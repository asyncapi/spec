#### <a name="{{href}}"></a>{{title}}

{{{description}}}

{{#if fixedFields}}
##### Fixed Fields
{{{fixedFields}}}
{{/if}}

{{#if patternedFields}}
##### Patterned Fields
{{{patternedFields}}}
{{/if}}

{{#if supportsSpecExtensions}}
This object can be extended with [Specification Extensions](#specificationExtensions).
{{/if}}

{{{beforeExamplesHook}}}

{{#if examples}}
##### {{title}} Examples:

{{#each examples as |example|}}
{{#if example.title}}
###### {{{example.titleJSON}}}
{{/if}}
{{#if example.titleJSON}}
###### {{{example.titleJSON}}}
{{/if}}

{{{example.description}}}
{{{example.descriptionJSON}}}

```json
{{{example.json}}}
```

{{#if example.titleYAML}}
###### {{{example.titleYAML}}}
{{/if}}

{{{example.descriptionYAML}}}

```yaml
{{{example.yaml}}}```

{{/each}}

{{/if}}

{{{afterExamplesHook}}}