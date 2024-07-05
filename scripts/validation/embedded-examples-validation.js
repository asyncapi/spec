const fs = require('fs');
const yaml = require('js-yaml');
const { Parser } = require('@asyncapi/parser');
const mergePatch = require('json-merge-patch');
const jsonpointer = require('jsonpointer');
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
        json_pointer: json.json_pointer,
        example: example,
        format: format,
      });
    } catch (e) {
      console.error("Failed to parse comment JSON or example:", match[1], e);
      process.exit(1);
    }
  }

  return combinedData;
}

// Extract comments and examples from the markdown file
const combinedData = extractCommentsAndExamples(markdownContent);

// Function to convert URI Fragment to JSON Pointer
function uriFragmentToJsonPointer(uriFragment) {
  if (uriFragment === '#') return '';
  return uriFragment.slice(1).split('/').map(decodeURIComponent).join('/');
}

// Function to apply JSON Merge Patch updates to the document
function applyUpdates(updates, baseDoc) {
  updates.forEach(update => {
    try {
      const jsonPointerPath = uriFragmentToJsonPointer(update.json_pointer);

      // Handle root document case
      if (jsonPointerPath === '') {
        baseDoc = mergePatch.apply(baseDoc, update.example);
        return;
      }

      // For non-root cases, use jsonpointer to get and set the correct location
      const targetObject = jsonpointer.get(baseDoc, jsonPointerPath);
      const updatedObject = mergePatch.apply(targetObject || {}, update.example);
      jsonpointer.set(baseDoc, jsonPointerPath, updatedObject);

    } catch (e) {
      console.error(`\nError processing update for '${update.name}' at path '${update.json_pointer}'`, e);
      process.exit(1);
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
          process.exit(1);
        } else {
          console.log(`\x1b[31mError in ${name}: ${diagnostic.message}\x1b[0m`);
          process.exit(1);
        }
      });
    } else {
      console.log(`${name} is valid.`);
    }
  } catch (error) {
    console.error(`\x1b[31mValidation failed for ${name}: ${error.message}\x1b[0m`);
    process.exit(1);
  }
}

// Iterate over the combinedData array, apply updates, and validate each document
const baseDocPath = './base-doc-combined.json';

const baseDoc = JSON.parse(fs.readFileSync(baseDocPath, 'utf8'));

const validationPromises = combinedData.map(async (item) => {
  const baseDocument = JSON.parse(JSON.stringify(baseDoc));

  const updatedDocument = applyUpdates([item], baseDocument);

  const documentString = JSON.stringify(updatedDocument, null, 2);
  await validateParser(documentString, `${item.name}-${item.format}-format`);
});

console.log(`\nNumber of examples extracted: ${combinedData.length}\n`);

Promise.all(validationPromises)
  .then(() => {
    console.log('\n\nAll files are valid!');
  })
  .catch((error) => {
    console.error('Error during validations:', error);
    process.exit(1);
  });