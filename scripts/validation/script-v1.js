const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { execSync } = require('child_process');

// Path to the Markdown file
// const mdPath = './test-document.md';
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

// Save each full document as a temporary file and validate using AsyncAPI CLI
async function validateExamples(mdPath) {
  const mdContent = fs.readFileSync(mdPath, 'utf8');
  const snippets = extractAsyncAPISnippets(mdContent);
  const tempDir = fs.mkdtempSync(path.join(__dirname, 'temp-'));

  try {
    for (const [index, snippet] of snippets.entries()) {
      const fullDoc = createFullDocument(snippet);
      const tempFilePath = path.join(tempDir, `snippet-${index + 1}.yaml`);
      fs.writeFileSync(tempFilePath, yaml.dump(fullDoc));

      try {
        execSync(`npx asyncapi validate ${tempFilePath}`, { stdio: 'inherit' });
        console.log(`\nValidation successful for: ${tempFilePath}`);
      } catch (error) {
        console.error(`Validation failed for: ${tempFilePath}`);
      }
    }
  } finally {
    // fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

validateExamples(mdPath).catch((error) => {
    console.error('Validation script failed:', error);
    process.exit(1);  // Exit with an error code to fail the CI job
  });