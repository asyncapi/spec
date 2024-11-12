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
  let document;

  try {
    document = fs.readFileSync(exampleFile, 'utf8');
    
  } catch (error) {
    console.error(`Error reading file ${exampleFile}:`, error);
    return;
    
  }
 
  let loadedDocument;
  try {
    loadedDocument = jsYaml.load(document);
    
  } catch (error) {
    console.error(`Error parsing YAML for file ${exampleFile}:`, error);
    return;
    
  }
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
  let convertedDocument;
  try {
    convertedDocument = convert(document, toVersion, { });
  } catch (error) {
    console.error(`Error converting file ${exampleFile}:`, error);
    return;
  }
  fs.writeFileSync(exampleFile, convertedDocument);
}

/**
 * Convert all examples within a single directory and nested directories.
 * 
 * @param {*} directoryPath full path to a directory to convert examples from.
 */
async function convertExampleDir(directoryPath) {
  let examplesFiles;
  try {
    examplesFiles =  fs.readdir(directoryPath);
  } catch (error) {
    console.error(`Error reading directory ${directoryPath}:`, error);
    return;
  }
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
  try {
    await convertExampleDir(examplesDirectory);
  } catch (error) {
    console.error('Error during conversion process:', error);
  }
})()