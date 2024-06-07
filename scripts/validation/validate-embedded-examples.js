const fs = require('fs');
const yaml = require('js-yaml');
const { parse } = require('@asyncapi/parser');

// Path to the Markdown file
const mdPath = '../../spec/asyncapi.md';

// Function to create a full AsyncAPI document from an example
function createFullDocument(example) {
  return {
    asyncapi: '3.0.0',
    info: {
      title: 'Sample Document',
      version: '0.0.0'
    },
    ...example
  };
}

// Function to validate an example
async function validateExample(example, fileName) {
  const fullDoc = createFullDocument(example);

  try {
    await parse(yaml.dump(fullDoc));
    console.log(`Validation successful for: ${fileName}`);
  } catch (error) {
    console.error(`Validation failed for: ${fileName}`, error);
  }
}


// Extract AsyncAPI YAML snippets from the markdown file
function extractAsyncAPISnippets(mdContent) {
  const snippets = [];
  const codeBlockRegex = /```yaml([^```]+)```/g;
  let match;

  while ((match = codeBlockRegex.exec(mdContent)) !== null) {
    const yamlContent = match[1].trim();
    try {
      const parsedYaml = yaml.load(yamlContent);
      snippets.push(parsedYaml);
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }
  }

  return snippets;
}

// Read the markdown file and extract examples
async function extractAndValidateExamples(mdPath) {
  const mdContent = fs.readFileSync(mdPath, 'utf8');
  const snippets = extractAsyncAPISnippets(mdContent);

  for (const [index, snippet] of snippets.entries()) {
    await validateExample(snippet, `snippet-${index + 1}`);
  }
}

extractAndValidateExamples(mdPath).catch(console.error);
