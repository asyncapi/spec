const util = require('util');
const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const YAML = require('js-yaml');
const RefParser = require('json-schema-ref-parser');
const walk = require('fs-walk');
require('colors');

const validate = async (content, schema) => {
  let json = YAML.safeLoad(content);

  try {
    json = await RefParser.dereference(json, {
      dereference: {
        circular: 'ignore'
      }
    });

    const ajv = new Ajv({ schemaId: 'auto' });
    ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-04.json'));

    const valid = ajv.validate(schema, json);

    if (!valid) {
      return {
        valid: false,
        errors: ajv.errors,
      };
    }

    return {
      valid: true,
    };
  } catch (e) {
    throw e;
  }
};

const runForVersion = version => new Promise((resolve, reject) => {
  const schema = require(path.resolve(__dirname, '../versions/', version, 'schema.json'));

  walk.walk(path.resolve(__dirname, '../examples/', version), async (basedir, filename, stat, next) => {
    if (!filename.match(/\.(y[a]?ml)|(json)$/)) return next();

    process.stdout.write(`Running test for ${filename} (version ${version})... `.cyan);
    const content = fs.readFileSync(path.resolve(basedir, filename)).toString();
    try {
      const result = await validate(content, schema);

      if (result.valid) {
        process.stdout.write('OK\n'.green);
        return next();
      }
      
      console.error('FAILED\n'.red);
      console.error('Error details:\n'.red.underline);
      console.error(util.inspect(result.errors, { depth: null, colors: true }));
      result.errors.logged = true;
      next(result.errors);
    } catch (e) {
      next(e);
    }
  }, (err) => {
    if (err) return reject(err);
    resolve();
  });
});

// RUNNING TESTS

let versions = ['1.1.0', '1.2.0', 'next'];

if (process.argv.length > 2) {
  const args = process.argv.slice(2);
  const indexOfVersions = args.indexOf('--versions');
  if (indexOfVersions > -1) versions = args[indexOfVersions + 1].split(',');
}

console.log(`Running tests for versions: ${versions.join(', ')}\n`.white.bold.underline);

Promise.all(
  versions.map(runForVersion)
).then(() => {
  console.log('\nThe future looks bright ✨'.green);
}).catch((e) => {
  if (e && !e.logged) console.error(e);
});