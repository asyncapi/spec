const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const glob = require('glob');

// Use glob to find all YAML files in the examples directory
const files = glob.sync('./examples/**/*.{yml,yaml}');

let filesCount = files.length;
let errorFilesCount = 0;
let filesWithErrors = []; // Array to store files that failed validation

// Function to validate a single file asynchronously
async function validateFile(file) {
  try {
    console.log(`\nValidating: ${file}`);
    await exec(`npx asyncapi validate ${file}`);
    console.log(`Validation successful for: ${file}\n`);
  } catch (error) {
    console.error(`Validation failed for: ${file}\n`);
    errorFilesCount++;
    filesWithErrors.push(file);
  }
}

// Run validation for all files asynchronously
(async () => {
  await Promise.all(files.map(validateFile));

  // Output validation result
  console.log(`\n\nValidation Completed!\nTotal files validated = ${filesCount}\nTotal files having error = ${errorFilesCount}`);

  // Display files with errors
  if (filesWithErrors.length > 0) {
    console.log('\nFiles with validation errors:');
    filesWithErrors.forEach((file) => {
      console.log(file);
    });
    process.exit(1);
  } else {
    console.log('\nAll files validated successfully.');
    process.exit(0);
  }
})();