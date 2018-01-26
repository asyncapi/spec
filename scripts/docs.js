const fs = require('fs');
const path = require('path');
const YAML = require('js-yaml');
const Handlebars = require('handlebars');
const _ = require('lodash');

const sectionTemplateSource = fs.readFileSync(path.resolve(__dirname, '../docs/SECTION.md'), 'utf8');
const sectionTemplate = Handlebars.compile(sectionTemplateSource);
const tableTemplateSource = fs.readFileSync(path.resolve(__dirname, '../docs/TABLE.md'), 'utf8');
const tableTemplate = Handlebars.compile(tableTemplateSource);

const schema = YAML.safeLoad(fs.readFileSync(path.resolve(__dirname, '../schema/asyncapi.yaml'), 'utf8'));
const defs = Object.keys(schema.definitions);

const resolveRef = (obj) => {
  const ref = obj['$ref'];
  if (ref && ref.startsWith('#/definitions')) {
    const key = ref.split('/')[2];
    return schema.definitions[key];
  }
};

const createLinkFromTitle = (title) => {
  return _.kebabCase(title);
};

const generateFixedFieldsTable = (section, sectionKey) => {
  if (section.properties) {
    let props = Object.keys(section.properties);
    
    props = props.filter(prop => !['oneOf', 'anyOf', 'allOf', 'not'].includes(prop))
    
    return tableTemplate({
      fieldTitle: 'Field Name',
      fields: props.map(prop => {
        let obj;
        let typeIsArray = false;
        
        if (section.properties[prop].type === 'array') {
          obj = resolveRef(section.properties[prop].items) || section.properties[prop].items;
          typeIsArray = true;
        } else {
          obj = resolveRef(section.properties[prop]) || section.properties[prop];
        }

        return {
          href: `${sectionKey}-${createLinkFromTitle(obj.title)}`,
          name: prop,
          typeTitle: obj.title || obj.type,
          typeHref: createLinkFromTitle(obj.title),
          typeIsArray,
          description: section.properties[prop].description,
          avoidSection: obj['x-avoid-section'],
        };
      })
    });
  }
};

const generatePatternedFieldsTable = (section, sectionKey) => {
  let props = Object.keys(section.patternProperties || {});
  
  if (sectionKey !== 'vendorExtension') {
    props = props.filter(prop => prop !== '^x-');
  }
  
  if (props.length) {
    return tableTemplate({
      fieldTitle: 'Field Pattern',
      fields: props.map(prop => {
        const obj = resolveRef(section.patternProperties[prop]) || section.patternProperties[prop];
        return {
          href: `${sectionKey}-${createLinkFromTitle(obj.title)}`,
          name: prop,
          typeTitle: obj.title || obj.type,
          typeHref: createLinkFromTitle(obj.title),
          description: section.patternProperties[prop].description,
          avoidSection: obj['x-avoid-section'],
        };
      })
    });
  }
};

const preprocessExamples = (examples) => {
  return (examples || []).map(example => {
    example.json = example.json || JSON.stringify(YAML.safeLoad(example.yaml), null, 2);
    return example;
  });
};

const renderSection = (section, sectionKey) => {
  if (section['x-avoid-section']) return '';
  
  return sectionTemplate({
    title: section.title,
    href: createLinkFromTitle(section.title),
    description: section.description,
    fixedFields: generateFixedFieldsTable(section, sectionKey),
    patternedFields: generatePatternedFieldsTable(section, sectionKey),
    supportsSpecExtensions: section.patternProperties && section.patternProperties['^x-'],
    beforeExamplesHook: section['x-before-examples-hook'],
    afterExamplesHook: section['x-after-examples-hook'],
    examples: preprocessExamples(section.examples),
  });
};

let output = renderSection(schema, 'asyncapi');
defs.forEach(key => {
  output += `${renderSection(schema.definitions[key], key)}\n`;
});

fs.writeFileSync(path.resolve(__dirname, 'TEST.md'), output);