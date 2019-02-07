const util = require('util');
const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const loadJsonFile = require('load-json-file');
const YAML = require('js-yaml');
const RefParser = require('json-schema-ref-parser');

loadJsonFile(path.resolve(__dirname, '../versions/1.2.0/schema.json')).then(schema => {
  fs.readFile(path.resolve(__dirname, '../examples/1.2.0/streetlights.yml'), (err, yaml) => {
    yaml = yaml.toString();
    const json = YAML.safeLoad(yaml);
    RefParser.dereference(json, {
      dereference: {
        circular: 'ignore'
      }
    }).then((json) => {
      const ajv = new Ajv({schemaId: 'auto'});

      ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-04.json'));

      const valid = ajv.validate(schema, json);

      if (!valid) return console.error(ajv.errors);
      console.log(util.inspect(json, { depth: null, colors: true }));
      console.log('Valid:', valid);
    }).catch((err) => {
      console.error(err);
    });
  });
}).catch(err => {
  console.error(err);
});
