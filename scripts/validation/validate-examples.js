const { execSync } = require('child_process');
const glob = require('glob');

// Use glob to find all YAML files in the examples directory
const files = glob.sync('./examples/**/*.{yml,yaml}');

let filesCount = 0;
let validationErrors = []; // Array to store validation errors
// Validate each file using AsyncAPI CLI
files.forEach((file) => {
  filesCount++;
  try {
    console.log(`\nValidating: ${file}`);
    execSync(`npx asyncapi validate ${file}`, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Validation failed for: ${file}\n`);
    // process.exit(1);
  }

});

console.log(`\n\nValidation Completed!\nTotal files validated = ${filesCount}`)