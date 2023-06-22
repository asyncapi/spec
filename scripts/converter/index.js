const path = require('path');
const fs = require('fs');
const { convert } = require('@asyncapi/converter');
const jsYaml = require('js-yaml');
const examplesDirectory = path.resolve(__dirname, '../../examples');
const toVersion = '3.0.0';

function convertExample(exampleFile) {
  console.warn(`Converting: ${exampleFile}`);
  const document = fs.readFileSync(exampleFile, 'utf-8');
  const loadedDocument = jsYaml.load(document);
  if(loadedDocument.asyncapi === toVersion) {
    console.warn(`${exampleFile} is already version ${toVersion}`);
    return;
  }
  const convertedDocument = convert(document, toVersion, { });
  fs.writeFileSync(exampleFile, convertedDocument);
}

async function convertExampleDir(directoryPath) {
  let examplesFiles = await fs.promises.readdir(directoryPath);
  examplesFiles = examplesFiles.map((file) => path.resolve(directoryPath, file));
  const nestedDirectory = examplesFiles.filter((file) => fs.lstatSync(file).isDirectory());
  // only convert .yml files
  examplesFiles = examplesFiles.filter((file) => path.extname(file) === '.yml');
  examplesFiles.forEach(convertExample);
}

/**
 * 
 */
(async () => {
  await convertExampleDir(examplesDirectory);
})()