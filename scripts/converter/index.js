const path = require('path');
const fs = require('fs/promises');
const { convert } = require('@asyncapi/converter');
const jsYaml = require('js-yaml');

const examplesDirectory = path.resolve(__dirname, '../../examples');
const toVersion = '3.0.0';

/**
 * Converts a single AsyncAPI example file to a newer version.
 *
 * @param {string} exampleFile - Absolute path to file
 */
async function convertExample(exampleFile) {
  try {
    console.warn(`Converting: ${exampleFile}`);

    const document = await fs.readFile(exampleFile, 'utf-8');
    const loadedDocument = jsYaml.load(document);

    if (!loadedDocument || typeof loadedDocument !== 'object') {
      console.warn(`Skipping non-YAML object file: ${exampleFile}`);
      return;
    }

    if (!loadedDocument.asyncapi) {
      console.error(`
___________________________________________________________________________________
!!! Manual change required !!!

${exampleFile} appears to be a shared resource.
Please manually inspect this file.

___________________________________________________________________________________
      `);
      return;
    }

    if (loadedDocument.asyncapi === toVersion) {
      console.warn(`${exampleFile} is already version ${toVersion}`);
      return;
    }

    const convertedDocument = await convert(document, toVersion, {});

    await fs.writeFile(exampleFile, convertedDocument, 'utf-8');

    console.info(`✔ Successfully converted: ${exampleFile}`);
  } catch (error) {
    console.error(`✖ Failed to convert ${exampleFile}:`, error.message);
  }
}

/**
 * Recursively converts all AsyncAPI example files
 * within a directory and nested directories.
 *
 * @param {string} directoryPath - Absolute path to directory
 */
async function convertExampleDir(directoryPath) {
  try {
    const entries = await fs.readdir(directoryPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.resolve(directoryPath, entry.name);

      if (entry.isDirectory()) {
        await convertExampleDir(fullPath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();

        if (ext === '.yml' || ext === '.yaml') {
          await convertExample(fullPath);
        }
      }
    }
  } catch (error) {
    console.error(`Failed to process directory ${directoryPath}:`, error.message);
  }
}

/**
 * CLI execution
 */
async function main() {
  console.info(`Starting conversion to AsyncAPI ${toVersion}...`);
  await convertExampleDir(examplesDirectory);
  console.info('Conversion process completed.');
}

if (require.main === module) {
  main().catch((err) => {
    console.error('Unexpected error during conversion:', err);
    process.exit(1);
  });
}
