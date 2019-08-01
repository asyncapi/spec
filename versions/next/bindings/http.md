# HTTP Bindings

This document defines how to describe HTTP-specific information on AsyncAPI.

<a name="version"></a>

## Version

Current version is `0.1.0`.


<a name="channel"></a>

## Channel Binding Object

This object MUST NOT contain any properties. Its name is reserved for future use.


<a name="operation"></a>

## Operation Binding Object

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a name="operationBindingObjectType"></a>`type` | String | **Required**. Type of operation. Its value MUST be either `request` or `response`.
<a name="operationBindingObjectMethod"></a>`method` | String | When `type` is `request`, this is the HTTP method, otherwise it MUST be ignored. Its value MUST be one of `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, `OPTIONS`, `CONNECT`, and `TRACE`. Defaults to `GET`.
<a name="operationBindingObjectHTTPVersion"></a>`httpVersion` | String | The HTTP protocol version. It MUST be either `1.1` (for HTTP/1.1) or `2` (for HTTP/2).
<a name="operationBindingObjectHttps"></a>`https` | Boolean | Whether the connection should use HTTPS or not. Defaults to `false`.
<a name="operationBindingObjectQuery"></a>`query` | [Schema Object](../asyncapi.md#schemaObject) | A [Schema Object](../asyncapi.md#schemaObject) containing the definitions for each query parameter. This schema MUST be of type `object`.
<a name="operationBindingObjectMeta"></a>`meta` | [Meta Object](#metaObject) | An object containing meta information about this binding object.

This object MUST contain only the properties defined above.

##### Example

```yaml
channels:
  /employees:
    subscribe:
      bindings:
        http:
          type: request
          method: GET
          httpVersion: '1.1'
          https: true
          query:
            type: object
            required:
              - companyId
            properties:
              companyId:
                type: number
                minimum: 1
                description: The Id of the company.
            additionalProperties: false
          meta:
            version: '0.1.0'
```


<a name="message"></a>

## Message Binding Object

This object contains information about the message representation in HTTP.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a name="messageBindingObjectHeaders"></a>`headers` | [Schema Object](../asyncapi.md#schemaObject) | A [Schema Object](../asyncapi.md#schemaObject) containing the definitions for HTTP-specific headers. This schema MUST be of type `object`. This object MUST NOT contain application-specific headers, for that purpose, please use [Message headers](../asyncapi.md#messageObjectHeaders).
<a name="operationBindingObjectMeta"></a>`meta` | [Meta Object](#metaObject) | An object containing meta information about this binding object.

This object MUST contain only the properties defined above.


```yaml
channels:
  test:
    publish:
      message:
        bindings:
          http:
            headers:
              type: object
              properties:
                Content-Type:
                  type: string
                  enum: ['application/json']
            meta:
              version: '0.1.0'
```

## Meta Object

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a name="metaObjectVersion"></a>`version` | String | **Required**. The version of this binding object. See [version](#version).

This object MUST contain only the properties defined above.
