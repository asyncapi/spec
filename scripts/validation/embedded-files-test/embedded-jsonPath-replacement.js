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
      comments.push({
        json: JSON.parse(match[1]),
        index: match.index
      });
    } catch (e) {
      console.error("Failed to parse comment JSON:", match[1], e);
    }
  }
  
  return comments;
}

// Function to extract JSON examples from markdown content
function extractExamples(content) {
  const exampleRegex = /```json\s+([\s\S]*?)\s+```/g;
  let match;
  const examples = [];
  
  while ((match = exampleRegex.exec(content)) !== null) {
    examples.push({
      json: match[1],
      index: match.index
    });
  }
  
  return examples;
}

// Extract comments from the markdown file
const comments = extractComments(markdownContent);
// Extract examples from the markdown file
const examples = extractExamples(markdownContent);

// Create array of objects with properties: 'name', 'json_path', 'example'
const combinedData = comments.map((comment) => {
  const matchingExample = examples.find(example => example.index > comment.index);
  if (matchingExample) {
    try {
      return {
        name: comment.json.name,
        json_path: comment.json.json_path,
        example: JSON.parse(matchingExample.json)
      };
    } catch (e) {
      console.error("Failed to parse example JSON:", matchingExample.json, e);
      return null;
    }
  } else {
    console.error(`No matching example found for comment: ${comment.json.name}`);
    return null;
  }
}).filter(item => item !== null);



// Function to determine which base document to use based on the comment
function selectBaseDocument(comment) {
  const baseDocPath = comment.name && comment.name.includes("Security Scheme Object")
    ? 'base-doc-security-scheme-object.json'
    : 'ex-base-doc.json';
  return JSON.parse(fs.readFileSync(baseDocPath, 'utf8'));
}

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

// Create updates array from combinedData
const updates = combinedData.map(item => ({
  json_path: item.json_path,
  data: item.example,
  name: item.name
}));

// Apply updates to the selected base document
const baseDoc = selectBaseDocument(combinedData[0]); // Assuming using the first item to decide base document
updates.forEach(update => {
  try {
    const results = JSONPath({ path: update.json_path, json: baseDoc, resultType: 'all' });

    console.log(`\nProcessing update for ${update.name} at path ${update.json_path}`);

    const pathParts = update.json_path.split('.');
    const targetKey = pathParts[pathParts.length - 1];

    // Check if the top-level key of the example JSON matches the target key
    let dataToMerge = update.data;
    if (dataToMerge.hasOwnProperty(targetKey)) {
      dataToMerge = dataToMerge[targetKey];
    }

    if (results.length === 0) {
      console.log(`\nPath not found, creating path: ${update.json_path}`);
      setValueByPath(baseDoc, update.json_path, dataToMerge); // Create the path if it doesn't exist
    } else {
      results.forEach(result => {
        const parent = result.parent;
        const parentProperty = result.parentProperty;
        console.log(`\nMerging data at path: ${update.json_path}`);
        parent[parentProperty] = deepMerge(parent[parentProperty], dataToMerge); // Deep merge the existing data with the new data
      });
    }
  } catch (e) {
    console.error(`\nError processing update for ${update.name} at path ${update.json_path}`, e);
  }
});

// Save the updated document
fs.writeFileSync(`updated-doc.json`, JSON.stringify(baseDoc, null, 2), 'utf8');


// Output the combined data
console.log(JSON.stringify(combinedData, null, 2));
console.log('\nAsyncAPI v3 document updated successfully!');
console.log(`\nNumber of examples extracted: ${examples.length}`);
