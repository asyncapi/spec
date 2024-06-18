const fs = require('fs');
const { JSONPath } = require('jsonpath-plus');
const path = require('path');
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

      console.log(`Extracted example in format: ${format}`);

      let example;
      if (format === 'json') {
        example = JSON.parse(exampleContent);
      } else if (format === 'yaml') {
        // Add YAML parsing if needed, using a library like js-yaml
        // example = yaml.load(exampleContent);
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

// Function to apply updates and save the document
function applyUpdatesAndSave(updates, baseDocPath, outputPath) {
  const baseDoc = JSON.parse(fs.readFileSync(baseDocPath, 'utf8'));

  updates.forEach(update => {
    try {
      if (update.json_path === "$") {
        console.log(`\nProcessing update for '${update.name}' at root path '$'`);
        for (const key in update.example) {
          baseDoc[key] = update.example[key];
        }
      } else {
        const results = JSONPath({ path: update.json_path, json: baseDoc, resultType: 'all' });

        console.log(`\nProcessing update for '${update.name}' at path '${update.json_path}'`);

        const pathParts = update.json_path.split('.');
        const targetKey = pathParts[pathParts.length - 1];

        // Check if the top-level key of the example JSON matches the target key
        let dataToMerge = update.example;
        if (dataToMerge.hasOwnProperty(targetKey)) {
          dataToMerge = dataToMerge[targetKey];
        }

        if (results.length === 0) {
          console.log(`\nPath not found, creating path: '${update.json_path}'`);
          setValueByPath(baseDoc, update.json_path, dataToMerge); // Create the path if it doesn't exist
        } else {
          results.forEach(result => {
            const parent = result.parent;
            const parentProperty = result.parentProperty;
            console.log(`\nMerging data at path: '${update.json_path}'`);
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
  fs.writeFileSync(outputPath, JSON.stringify(baseDoc, null, 2), 'utf8');
}

// Iterate over the combinedData array and apply updates for each item
const outputDir = path.join(__dirname, 'updated-docs');
const validationPromises = []; // Array to store all validation promises
combinedData.forEach((item) => {
  const baseDocPath = item.name && item.name.includes("Security Scheme Object")
    ? 'base-doc-security-scheme-object.json'
    : 'base-doc.json';

  // Check if the directory exists, and if not, create it
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const processedExampleName = item.name.replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
  const outputPath = path.join(outputDir, `${processedExampleName}-${item.format}-format.json`);
  // const outputPath = `./updated-docs/updated-doc-${index + 1}.json`;
  // console.log(`\n${combinedData[num-1].name} = ${currentExample}`);

  // Apply updates and save the document
  applyUpdatesAndSave([item], baseDocPath, outputPath);

  // Validate the output file using the AsyncAPI parser
  const validationPromise = validateParser(outputPath);

  // Delete the updated document after saving
  // fs.unlinkSync(outputPath);

  validationPromises.push(validationPromise);
});

//  Function to validate a file using AsyncAPI parser
async function validateParser(filePath) {
  const document = fs.readFileSync(filePath, 'utf8');
  try {
    const diagnostics = await parser.validate(document);

    if (diagnostics.length > 0) {
      diagnostics.forEach(diagnostic => {
        if (diagnostic.level === 'error') {
          console.error(`Error in ${filePath}: ${diagnostic.message}`);
          // process.exit(1);
        } else {
          console.log(`Warning in ${filePath}: ${diagnostic.message}`);
        }
      });
    } else {
      console.log(`${filePath} is valid.`);
    }
  } catch (error) {
    console.error(`Validation failed for ${filePath}: ${error.message}`);
    // process.exit(1);
  }
}

// Function to delete a folder and its contents recursively
async function deleteFolderRecursive(dir) {
  try {
    const files = await fs.promises.readdir(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const fileStat = await fs.promises.stat(filePath);

      if (fileStat.isDirectory()) {
        await deleteFolderRecursive(filePath);
      } else {
        await fs.promises.unlink(filePath);
      }
    }

    await fs.promises.rmdir(dir);
    console.log(`Folder ${dir} and its contents have been deleted.`);
    console.log('\n\nAll examples validated successfully!');
  } catch (err) {
    console.error('Error deleting folder:', err);
    // process.exit(1);
  }
}

// console.log(JSON.stringify(combinedData, null, 2));
console.log(`\nNumber of examples extracted: ${combinedData.length}`);

// fs.writeFileSync(`extracted-examples.json`, JSON.stringify(combinedData, null, 2), 'utf8');

// let num = 43;
// const currentExample = JSON.stringify(combinedData[num-1], null, 2);
// console.log(`\nexample ${num} = ${currentExample} `)
// console.log(`\n${combinedData[num-1].name} = ${currentExample}`);

// Wait for all validation promises to resolve
Promise.all(validationPromises)
  .then(() => {
    // All validations are complete, delete the folder
    // deleteFolderRecursive(outputDir); // Commented out to keep the updated files for debugging
  })
  .catch((error) => {
    console.error('Error during validations:', error);
    // process.exit(1);
  });
