const { execSync } = require('child_process');
const glob = require('glob');

// Use glob to find all YAML files in the examples directory
const files = glob.sync('./examples/**/*.{yml,yaml}');

let filesCount = 0;
let errorFilesCount = 0;
let filesWithErrors = []; // Array to store files that failed validation
// Validate each file using AsyncAPI CLI
files.forEach((file) => {
  filesCount++;
  try {
    console.log(`\nValidating: ${file}`);
    execSync(`npx asyncapi validate ${file}`, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Validation failed for: ${file}\n`);
    errorFilesCount++;
    filesWithErrors.push(file);
  }

});

console.log(`\n\nValidation Completed!\nTotal files validated = ${filesCount}\nTotal files having error = ${errorFilesCount}`)

// Display files with errors
if (filesWithErrors.length > 0) {
  console.log('\nFiles with validation errors:');
  filesWithErrors.forEach((file) => {
    console.log(file);
  });
  process.exit(1);
} else {
  console.log('\nAll files validated successfully.');
  process.exit(1);
}