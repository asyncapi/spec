{{{fieldTitle}}} | Type | Description
---|:---:|---
{{#each fields as |field|}}
{{#if field.avoidSection}}
<a name="{{{field.href}}}"></a>`{{{field.name}}}` | {{#if field.typeIsArray}}[`{{{field.typeTitle}}}`]{{else}}`{{{field.typeTitle}}}`{{/if}} | {{{field.description}}}
{{else}}
<a name="{{{field.href}}}"></a>`{{{field.name}}}` | {{#if field.typeIsArray}}[[{{{field.typeTitle}}}](#{{{field.typeHref}}})]{{else}}[{{{field.typeTitle}}}](#{{{field.typeHref}}}){{/if}}| {{{field.description}}}
{{/if}}
{{/each}}