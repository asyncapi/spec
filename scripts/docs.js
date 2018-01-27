/**
 * The purpose of this script is to generate human-readable
 * documentation from the asyncapi.yaml file. This way we
 * always keep both in sync.
 *
 * We make use of different templates:
 * - README.md: This is the template for the global document. This document will contain the
 *              auto-generated documentation.
 * - SECTION.md: This is the template for every object or "section" we want to document.
 * - TABLE.md: This is the template for every table of properties (Fixed Fields) and pattern
 *             properties (Patterned Fields).
 */

const fs = require('fs');
const path = require('path');
const YAML = require('js-yaml');
const Handlebars = require('handlebars');
const _ = require('lodash');

/**
 * Loads template for a "section".
 */
const sectionTemplateSource = fs.readFileSync(path.resolve(__dirname, '../docs/SECTION.md'), 'utf8');
const sectionTemplate = Handlebars.compile(sectionTemplateSource);
/**
 * Loads template for a "table".
 */
const tableTemplateSource = fs.readFileSync(path.resolve(__dirname, '../docs/TABLE.md'), 'utf8');
const tableTemplate = Handlebars.compile(tableTemplateSource);

/**
 * Loads the AsyncAPI spec.
 */
const schema = YAML.safeLoad(fs.readFileSync(path.resolve(__dirname, '../schema/asyncapi.yaml'), 'utf8'));

/**
 * It resolves a single $ref.
 * 
 * @param  {Object} obj An object containing a $ref property pointing to an internal definition.
 * @return {Object} The pointed out object.
 */
const resolveRef = (obj) => {
  const ref = obj['$ref'];
  if (ref && ref.startsWith('#/definitions')) {
    const key = ref.split('/')[2];
    return schema.definitions[key];
  }
};

/**
 * Generates an internal link (#something) from a title.
 * 
 * @param  {String} title A title.
 * @return {String} An internal link.
 */
const createLinkFromTitle = (title) => {
  return _.kebabCase(title);
};

/**
 * Generates a Markdown Fixed Fields table from an object definition.
 * 
 * @param  {Object} section    A documentation section object.
 * @param  {String} sectionKey The key name of the documentation section.
 * @return {String}            Markdown table.
 */
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

/**
 * Generates a Markdown Patterned Fields table from an object definition.
 * 
 * @param  {Object} section    A documentation section object.
 * @param  {String} sectionKey The key name of the documentation section.
 * @return {String}            Markdown table.
 */
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

/**
 * Generates JSON examples from the YAML ones, if it doesn't exist.
 * 
 * @param  {Object} examples Examples object.
 * @return {Object}          An object containing JSON and YAML examples.
 */
const preprocessExamples = (examples) => {
  return (examples || []).map(example => {
    example.json = example.json || JSON.stringify(YAML.safeLoad(example.yaml), null, 2);
    return example;
  });
};

/**
 * Generates Markdown for a documentation section.
 * 
 * @param  {Object} section    A documentation section object.
 * @param  {String} sectionKey The key name of the documentation section.
 * @return {String}            Markdown for the given section.
 */
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

/**
 * Render top-level object as a documentation section.
 */
let output = renderSection(schema, 'asyncapi');

/**
 * Render each definition as a documentation section.
 */
const defs = Object.keys(schema.definitions);
defs.forEach(key => {
  output += `${renderSection(schema.definitions[key], key)}\n`;
});

/**
 * Store result in the README file.
 */
fs.writeFileSync(path.resolve(__dirname, '../v2/README.md'), output);
