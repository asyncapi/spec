const fs = require('fs');
const path = require('path');
const YAML = require('js-yaml');

const schema = YAML.safeLoad(fs.readFileSync(path.resolve(__dirname, '../schema/asyncapi.yaml'), 'utf8'));
fs.writeFileSync(path.resolve(__dirname, '../schema/asyncapi.json'), JSON.stringify(schema, null, 2));