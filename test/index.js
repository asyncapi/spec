const util = require('util');
const fs = require('fs');
const path = require('path');
const ZSchema = require('z-schema');
const loadJsonFile = require('load-json-file');
const YAML = require('js-yaml');
const RefParser = require('json-schema-ref-parser');

const validator = new ZSchema();

loadJsonFile(path.resolve(__dirname, '../schema/asyncapi.json')).then(schema => {
  fs.readFile(path.resolve(__dirname, '../sample.yml'), (err, yaml) => {
    yaml = yaml.toString();
    const json = YAML.safeLoad(yaml);
    RefParser.dereference(json, {
      dereference: {
        circular: 'ignore'
      }
    }).then((json) => {
      validator.validate(json, schema, (err, valid) => {
        if (err) return console.error(err);
        //console.log('Valid:', valid);
        //console.log(util.inspect(json, { depth: null, colors: true }));
        console.log(JSON.stringify(json));
      });
    }).catch((err) => {
      console.error(err);
    });
  });
}).catch(err => {
  console.error(err);
});
