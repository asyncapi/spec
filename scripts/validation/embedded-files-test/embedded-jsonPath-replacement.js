const fs = require('fs');
const { JSONPath } = require('jsonpath-plus');

// Read the markdown file
const markdownContent = fs.readFileSync('ex-doc-v1.md', 'utf8');

// Function to extract comments with example metadata
function extractComments(content) {
  const commentRegex = /<!-- asyncapi-example-tester:(\{.*?\}) -->/g;
  let match;
  const comments = [];
  
  while ((match = commentRegex.exec(content)) !== null) {
    try {
      comments.push(JSON.parse(match[1]));
    } catch (e) {
      console.error("Failed to parse comment JSON:", match[1], e);
    }
  }
  
  return comments;
}

// Extract comments from the markdown file
const comments = extractComments(markdownContent);

// Function to extract JSON examples from markdown content
function extractExamples(content) {
  const exampleRegex = /```json\s+([\s\S]*?)\s+```/g;
  let match;
  const examples = [];
  
  while ((match = exampleRegex.exec(content)) !== null) {
    examples.push(JSON.parse(match[1]));
  }
  
  return examples;
}

// Extract examples from the markdown file
const examples = extractExamples(markdownContent);

// Read the base AsyncAPI document for v3
const baseDoc = JSON.parse(fs.readFileSync('ex-base-doc.json', 'utf8'));

// Function to set a value in a JSON object using JSONPath, creating missing fields if necessary
function setValueByPath(obj, path, value) {
  const pathParts = path.replace(/\$/g, '').split('.').slice(1); // Remove the root "$" and split path
  let current = obj;

  pathParts.forEach((part, index) => {
    if (index === pathParts.length - 1) {
      current[part] = value; // Set value at the end of the path
    } else {
      if (!current[part]) {
        current[part] = {}; // Create object if it doesn't exist
      }
      current = current[part];
    }
  });
}

// Create updates array from comments and examples
const updates = comments.map((comment, index) => ({
  json_path: comment.json_path,
  data: examples[index],
  test: comment.test
}));

// Apply updates
updates.forEach(update => {
  const results = JSONPath({ path: update.json_path, json: baseDoc, resultType: 'all' });

  if (results.length === 0) {
    setValueByPath(baseDoc, update.json_path, update.data); // Create the path if it doesn't exist
  } else {
    results.forEach(result => {
      const parent = result.parent;
      const parentProperty = result.parentProperty;
      parent[parentProperty] = {
        ...parent[parentProperty],
        ...update.data // Merge the existing data with the new data
      };
    });
  }
});

// Save the updated document
fs.writeFileSync('updated-doc.json', JSON.stringify(baseDoc, null, 2), 'utf8');

console.log('AsyncAPI v3 document updated successfully!');
