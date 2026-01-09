'use strict';

const path = require('path');
const fs = require('fs/promises');
const { convert } = require('@asyncapi/converter');
const yaml = require('js-yaml');

/**
 * ============================
 * Configuration
 * ============================
 */
const CONFIG = {
  examplesDir: path.resolve(__dirname, '../examples'),
  targetVersion: '3.0.0',
  backupExtension: '.bak',
  allowedExtensions: new Set(['.yml', '.yaml'])
};

/**
 * Log helpers (consistent, grep-friendly)
 */
const log = {
  info: (msg) => console.info(`[INFO] ${msg}`),
  warn: (msg) => console.warn(`[WARN] ${msg}`),
  error: (msg, err) =>
    console.error(`[ERROR] ${msg}${err ? `\n${err.stack}` : ''}`)
};

/**
 * Convert a single AsyncAPI example file.
 *
 * Rules:
 * - Skip non-AsyncAPI YAML files
 * - Skip already converted files
 * - Create a backup before overwriting
 *
 * @param {string} filePath Absolute file path
 */
async function convertExampleFile(filePath) {
  log.info(`Processing file: ${filePath}`);

  let rawContent;
  try {
    rawContent = await fs.readFile(filePath, 'utf8');
  } catch (err) {
    log.error(`Failed to read file: ${filePath}`, err);
    return;
  }

  let parsed;
  try {
    parsed = yaml.load(rawContent);
  } catch (err) {
    log.error(`Invalid YAML format: ${filePath}`, err);
    return;
  }

  if (!parsed || typeof parsed !== 'object' || !parsed.asyncapi) {
    log.warn(`Skipping shared/non-AsyncAPI YAML: ${filePath}`);
    return;
  }

  if (parsed.asyncapi === CONFIG.targetVersion) {
    log.info(`Already up-to-date (${CONFIG.targetVersion}): ${filePath}`);
    return;
  }

  let converted;
  try {
    converted = convert(rawContent, CONFIG.targetVersion, {});
  } catch (err) {
    log.error(`Conversion failed for file: ${filePath}`, err);
    return;
  }

  try {
    await fs.writeFile(`${filePath}${CONFIG.backupExtension}`, rawContent);
    await fs.writeFile(filePath, converted);
    log.info(`Successfully converted: ${filePath}`);
  } catch (err) {
    log.error(`Failed to write converted output: ${filePath}`, err);
  }
}

/**
 * Recursively process a directory for AsyncAPI example files.
 *
 * @param {string} dirPath Absolute directory path
 */
async function processDirectory(dirPath) {
  let entries;
  try {
    entries = await fs.readdir(dirPath, { withFileTypes: true });
  } catch (err) {
    log.error(`Failed to read directory: ${dirPath}`, err);
    return;
  }

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      await processDirectory(fullPath);
      continue;
    }

    const ext = path.extname(entry.name);
    if (CONFIG.allowedExtensions.has(ext)) {
      await convertExampleFile(fullPath);
    }
  }
}

/**
 * Entry point
 */
async function main() {
  log.info(`Starting AsyncAPI example migration → v${CONFIG.targetVersion}`);
  await processDirectory(CONFIG.examplesDir);
  log.info('AsyncAPI example migration completed');
}

main().catch((err) => {
  log.error('Fatal error during execution', err);
  process.exit(1);
});


// const path = require('path');
// const fs = require('fs');
// const { convert } = require('@asyncapi/converter');
// const jsYaml = require('js-yaml');
// const examplesDirectory = path.resolve(__dirname, '../../examples');
// const toVersion = '3.0.0';

// /**
//  * This function converts a single example file into a newer version and overwrite the old one.
//  * 
//  * @param {*} exampleFile full path to file
//  */
// function convertExample(exampleFile) {
//   console.warn(`Converting: ${exampleFile}`);
//   const document = fs.readFileSync(exampleFile, 'utf-8');
//   const loadedDocument = jsYaml.load(document);
//   if(loadedDocument.asyncapi === undefined) {
//     //Probably encountered a common file (used in other files), ignore
//     console.error(`___________________________________________________________________________________
//     !!!Manual change required!!! 

//     ${exampleFile} is a shared resource among other AsyncAPI documents, make sure to manually inspect this!

// ___________________________________________________________________________________`);
//     return;
//   } else if(loadedDocument.asyncapi === toVersion) {
//     console.warn(`${exampleFile} is already version ${toVersion}`);
//     return;
//   }
//   const convertedDocument = convert(document, toVersion, { });
//   fs.writeFileSync(exampleFile, convertedDocument);
// }

// /**
//  * Convert all examples within a single directory and nested directories.
//  * 
//  * @param {*} directoryPath full path to a directory to convert examples from.
//  */
// async function convertExampleDir(directoryPath) {
//   let examplesFiles = await fs.promises.readdir(directoryPath);
//   examplesFiles = examplesFiles.map((file) => path.resolve(directoryPath, file));
//   const nestedDirectory = examplesFiles.filter((file) => fs.lstatSync(file).isDirectory());
//   for (const dir of nestedDirectory) {
//     await convertExampleDir(dir);
//   }

//   // only convert .yml files
//   examplesFiles = examplesFiles.filter((file) => path.extname(file) === '.yml' || path.extname(file) === '.yaml');
//   examplesFiles.forEach(convertExample);
// }

// /**
//  * 
//  */
// (async () => {
//   await convertExampleDir(examplesDirectory);
// })()