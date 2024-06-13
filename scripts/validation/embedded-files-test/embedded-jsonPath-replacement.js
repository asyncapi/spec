const fs = require('fs');
const { JSONPath } = require('jsonpath-plus');

// Read the markdown file
// const markdownContent = fs.readFileSync('ex-doc-v1.md', 'utf8');
const markdownContent = fs.readFileSync('../../../spec/asyncapi.md', 'utf8');

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

// Function to determine which base document to use based on the comment
function selectBaseDocument(comment) {
  // Check if the comment's name includes "Security Scheme Object"
  if (comment.name && comment.name.includes("Security Scheme Object")) {
    // Read and return the second base document for examples with "Security Scheme Object"
    return JSON.parse(fs.readFileSync('base-doc-security-scheme-object.json', 'utf8'));
  } else {
    // Read and return the first base document for all other cases
    return JSON.parse(fs.readFileSync('ex-base-doc.json', 'utf8'));
  }
}

// Function to extract JSON examples from markdown content
function extractExamples(content) {
  const exampleRegex = /```json\s+([\s\S]*?)\s+```/g;
  let match;
  const examples = [];
  
  while ((match = exampleRegex.exec(content)) !== null) {
    try {
      examples.push(JSON.parse(match[1]));
    } catch (e) {
      console.error("Failed to parse example JSON:", match[1], e);
    }
  }
  
  return examples;
}

// Extract examples from the markdown file
const examples = extractExamples(markdownContent);

// Function to deeply merge two objects without overwriting existing nested structures
function deepMerge(target, source) {
  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object && key in target) {
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
      if (current[part] === undefined) {
        current[part] = value; // Set the new value if the path does not exist
      } else {
        current[part] = deepMerge(current[part], value); // Deep merge if the path exists
      }
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
  name: comment.name
}));

// Apply updates to the selected base document
const baseDoc = selectBaseDocument(comments[0]); // Assuming using the first comment to decide base document
updates.forEach(update => {
  try {
    const results = JSONPath({ path: update.json_path, json: baseDoc, resultType: 'all' });

    console.log(`Processing update for ${update.name} at path ${update.json_path}`);

    const pathParts = update.json_path.split('.');
    const targetKey = pathParts[pathParts.length - 1];

    // Check if the top-level key of the example JSON matches the target key
    let dataToMerge = update.data;
    if (dataToMerge.hasOwnProperty(targetKey)) {
      dataToMerge = dataToMerge[targetKey];
    }

    if (results.length === 0) {
      console.log(`Path not found, creating path: ${update.json_path}`);
      setValueByPath(baseDoc, update.json_path, dataToMerge); // Create the path if it doesn't exist
    } else {
      results.forEach(result => {
        const parent = result.parent;
        const parentProperty = result.parentProperty;
        console.log(`Merging data at path: ${update.json_path}`);
        parent[parentProperty] = deepMerge(parent[parentProperty], dataToMerge); // Deep merge the existing data with the new data
      });
    }
  } catch (e) {
    console.error(`Error processing update for ${update.name} at path ${update.json_path}`, e);
  }
});

// Save the updated document
fs.writeFileSync(`updated-doc.json`, JSON.stringify(baseDoc, null, 2), 'utf8');

console.log('AsyncAPI v3 document updated successfully!');


console.log(`Number of examples extracted: ${examples.length}`);

// console.log(baseDoc)