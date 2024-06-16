# AsyncAPI Examples

## Operations Object

Here is an example of an operations object:

<!-- asyncapi-example-tester:{"test":"Contact Object","json_path":"$.info.contact"} -->
```json
{
  "name": "API Support",
  "url": "https://www.example.com/support",
  "email": "support@example.com"
}
```

<!-- asyncapi-example-tester:{"test":"Info Object","json_path":"$.info"} -->
```json
{
  "title": "AsyncAPI Sample App",
  "version": "1.0.1",
  "description": "This is a sample app.",
  "termsOfService": "https://asyncapi.org/terms/",
  "contact": {
    "name": "API Support",
    "url": "https://www.asyncapi.org/support",
    "email": "support@asyncapi.org"
  },
  "license": {
    "name": "Apache 2.0",
    "url": "https://www.apache.org/licenses/LICENSE-2.0.html"
  },
  "externalDocs": {
    "description": "Find more info here",
    "url": "https://www.asyncapi.org"
  },
  "tags": [
    {
      "name": "e-commerce"
    }
  ]
}
```