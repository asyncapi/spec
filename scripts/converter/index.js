const path = require('path');
const fs = require('fs');
const { convert } = require('@asyncapi/converter');
const jsYaml = require('js-yaml');
const examplesDirectory = path.resolve(__dirname, '../../examples');
const toVersion = '3.0.0';

/**
 * This function converts a single example file into a newer version and overwrite the old one.
 * 
 * @param {*} exampleFile full path to file
 */
function convertExample(exampleFile) {
  console.warn(`Converting: ${exampleFile}`);
  const document = fs.readFileSync(exampleFile, 'utf-8');
  const loadedDocument = jsYaml.load(document);
  if(loadedDocument.asyncapi === undefined) {
    //Probably encountered a common file (used in other files), ignore
    console.error(`___________________________________________________________________________________
    !!!Manual change required!!! 

    ${exampleFile} is a shared resource among other AsyncAPI documents, make sure to manually inspect this!

___________________________________________________________________________________`);
    return;
  } else if(loadedDocument.asyncapi === toVersion) {
    console.warn(`${exampleFile} is already version ${toVersion}`);
    return;
  }
  const convertedDocument = convert(document, toVersion, { });
  fs.writeFileSync(exampleFile, convertedDocument);
}

/**
 * Convert all examples within a single directory and nested directories.
 * 
 * @param {*} directoryPath full path to a directory to convert examples from.
 */
async function convertExampleDir(directoryPath) {
  let examplesFiles = await fs.promises.readdir(directoryPath);
  examplesFiles = examplesFiles.map((file) => path.resolve(directoryPath, file));
  const nestedDirectory = examplesFiles.filter((file) => fs.lstatSync(file).isDirectory());
  for (const dir of nestedDirectory) {
    await convertExampleDir(dir);
  }

  // only convert .yml files
  examplesFiles = examplesFiles.filter((file) => path.extname(file) === '.yml' || path.extname(file) === '.yaml');
  examplesFiles.forEach(convertExample);
}

/**
 * 
 */
(async () => {
  await convertExampleDir(examplesDirectory);
})()