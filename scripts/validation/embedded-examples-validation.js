const fs = require('fs');
const { JSONPath } = require('jsonpath-plus');
const yaml = require('js-yaml');
const { Parser } = require('@asyncapi/parser');
const parser = new Parser();

// Read the markdown file
const markdownContent = fs.readFileSync('../../spec/asyncapi.md', 'utf8');

// Function to extract comments and examples from the markdown content
function extractCommentsAndExamples(content) {
  const combinedRegex = /<!--\s*asyncapi-example-tester:\s*({.*?})\s*-->\s*\n```(.*)?\n([\s\S]*?)\n```/g;
  let match;
  const combinedData = [];

  while ((match = combinedRegex.exec(content)) !== null) {
    try {
      const json = JSON.parse(match[1]);
      const format = match[2].trim();
      const exampleContent = match[3].trim();

      // console.log(`Extracted example in format: ${format}`);

      let example;
      if (format === 'json') {
        example = JSON.parse(exampleContent);
      } else if (format === 'yaml') {
        example = yaml.load(exampleContent);
      } else {
        throw new Error(`Unsupported format: ${format}`);
      }

      combinedData.push({
        name: json.name,
        json_path: json.json_path,
        example: example,
        format: format,
      });
    } catch (e) {
      console.error("Failed to parse comment JSON or example:", match[1], e);
      // process.exit(1);
    }
  }

  return combinedData;
}

// Extract comments and examples from the markdown file
const combinedData = extractCommentsAndExamples(markdownContent);

// Function to deeply merge two objects without overwriting existing nested structures
function deepMerge(target, source) {
  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object && key in target && target[key] instanceof Object) {
      target[key] = deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

// Function to set a value in a JSON object using JSONPath, creating missing fields if necessary
function setValueByPath(obj, path, value) {
  const pathParts = path.replace(/\$/g, '').split('.').slice(1); // Remove the root "$" and split path
  let current = obj;

  pathParts.forEach((part, index) => {
    if (index === pathParts.length - 1) {
      current[part] = value; // Set the new value directly
    } else {
      if (!current[part]) {
        current[part] = {}; // Create object if it doesn't exist
      }
      current = current[part];
    }
  });
}

// Function to apply updates to the document
function applyUpdates(updates, baseDoc) {
  updates.forEach(update => {
    try {
      if (update.json_path === "$") {
        // console.log(`\nProcessing update for '${update.name}' at root path '$'`);
        for (const key in update.example) {
          baseDoc[key] = update.example[key];
        }
      } else {
        const results = JSONPath({ path: update.json_path, json: baseDoc, resultType: 'all' });

        // console.log(`\nProcessing update for '${update.name}-${update.format}-format' at path '${update.json_path}'`);

        const pathParts = update.json_path.split('.');
        const targetKey = pathParts[pathParts.length - 1];

        // Check if the top-level key of the example JSON matches the target key
        let dataToMerge = update.example;
        if (dataToMerge.hasOwnProperty(targetKey)) {
          dataToMerge = dataToMerge[targetKey];
        }

        if (results.length === 0) {
          // console.log(`\nPath not found, creating path: '${update.json_path}'`);
          setValueByPath(baseDoc, update.json_path, dataToMerge); // Create the path if it doesn't exist
        } else {
          results.forEach(result => {
            const parent = result.parent;
            const parentProperty = result.parentProperty;
            // console.log(`\nMerging data at path: '${update.json_path}'`);
            if (Array.isArray(parent[parentProperty])) {
              // If the existing data is an array, add the update data as an array item
              parent[parentProperty].push(dataToMerge);
            } else {
              // Otherwise, deep merge the existing data with the new data
              parent[parentProperty] = deepMerge(parent[parentProperty], dataToMerge);
            }
          });
        }
      }
    } catch (e) {
      console.error(`\nError processing update for '${update.name}' at path '${update.json_path}'`, e);
      // process.exit(1);
    }
  });
  return baseDoc;
}

// Function to validate a document using AsyncAPI parser
async function validateParser(document, name) {
  try {
    const diagnostics = await parser.validate(document);

    if (diagnostics.length > 0) {
      diagnostics.forEach(diagnostic => {
        if (diagnostic.level === 'error') {
          console.error(`\x1b[31mError in ${name}: ${diagnostic.message}\x1b[0m`);
        } else {
          console.log(`\x1b[31mWarning in ${name}: ${diagnostic.message}\x1b[0m`);
        }
      });
    } else {
      console.log(`${name} is valid.`);
    }
  } catch (error) {
    console.error(`\x1b[31mValidation failed for ${name}: ${error.message}\x1b[0m`);
  }
}


// Iterate over the combinedData array, apply updates, and validate each document
const baseDocPath = './base-doc.json';
const baseDocSecuritySchemePath = './base-doc-security-scheme-object.json';

const baseDoc = JSON.parse(fs.readFileSync(baseDocPath, 'utf8'));
const baseDocSecurityScheme = JSON.parse(fs.readFileSync(baseDocSecuritySchemePath, 'utf8'));

const validationPromises = combinedData.map(async (item) => {
  const baseDocument = item.name && item.name.includes("Security Scheme Object")
    ? JSON.parse(JSON.stringify(baseDocSecurityScheme)) // Deep copy for each iteration
    : JSON.parse(JSON.stringify(baseDoc)); // Deep copy for each iteration

  const updatedDocument = applyUpdates([item], baseDocument);

  const documentString = JSON.stringify(updatedDocument, null, 2);
  await validateParser(documentString, `${item.name}-${item.format}-format`);
});

console.log(`\nNumber of examples extracted: ${combinedData.length}\n`);

Promise.all(validationPromises)
  .then(() => {
    console.log('\n\nAll examples validated successfully!');
  })
  .catch((error) => {
    console.error('Error during validations:', error);
    // process.exit(1);
  });
