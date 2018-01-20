const fs = require('fs');
const path = require('path');
const YAML = require('js-yaml');
const RefParser = require('json-schema-ref-parser');
const ZSchema = require('z-schema');

const validator = new ZSchema();
const schema = YAML.safeLoad(fs.readFileSync(path.resolve(__dirname, '../schema/asyncapi.yaml'), 'utf8'));

const testFile = async (file) => {
  let yaml, json, derefJSON;
  
  try {
    yaml = fs.readFileSync(path.resolve(__dirname, file)).toString();
    json = YAML.safeLoad(yaml);
    
    derefJSON = await RefParser.dereference(json, {
      dereference: {
        circular: 'ignore'
      }
    });
  } catch (e) {
    throw e;
  }
  
  return new Promise((resolve, reject) => {
    validator.validate(derefJSON, schema, (err, valid) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

describe('AsyncAPI 2.0.0', () => {
  const files = fs.readdirSync(path.resolve(__dirname, 'docs'));
  
  files.forEach(file => {
    it(`Passes ${file} example`, async () => {
      try {
        await testFile(path.resolve(__dirname, 'docs', file));
      } catch (e) {
        throw e;
      }
    });
  });
});