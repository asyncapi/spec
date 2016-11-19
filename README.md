# AsyncAPI Specification

#### Version 0.1

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [RFC 2119](http://www.ietf.org/rfc/rfc2119.txt).

The AsyncAPI Specification is licensed under [The Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0.html).

## Introduction

The AsyncAPI Specification is a project used to describe and document Asynchronous APIs.

The AsyncAPI Specification defines a set of files required to describe such an API.
These files can then be used to create utilities, such as documentation, integration and/or testing tools.

## Definitions

#### Message Broker
A message broker is a system in charge of message exchange. It MAY provide additional features, such as message queueing, storage or processing.

#### Message
A message is a piece of information a process will send to a message broker. It MUST contain headers and payload and MAY contain a topic.

#### Topic
A topic is a routing key used by the message broker to deliver messages to the subscribed processes. Depending on the protocol used, a message MAY include the topic in its headers. Message topic is OPTIONAL.

#### Process
A process is any kind of computer program connected to a message broker. It MUST be a producer, a consumer or both.

#### Producer
A producer is a process publishing messages to a message broker.

#### Consumer
A consumer is a process subscribed to a message broker and consumes messages from it.

## Specification

### Format

The files describing the Asynchronous API in accordance with the AsyncAPI Specification are represented as JSON objects and conform to the JSON standards.
YAML, being a superset of JSON, can be used as well to represent a AAS (AsyncAPI Specification) file.

For example, if a field is said to have an array value, the JSON array representation will be used:

```json
{
   "field" : [...]
}
```

While the API is described using JSON it does not impose a JSON input/output to the API itself.

All field names in the specification are **case sensitive**.

The schema exposes two types of fields.
Fixed fields, which have a declared name, and Patterned fields, which declare a regex pattern for the field name.
Patterned fields can have multiple occurrences as long as each has a unique name.

In order to preserve the ability to round-trip between YAML and JSON formats, YAML version [1.2](http://www.yaml.org/spec/1.2/spec.html) is recommended along with some additional constraints:

- Tags MUST be limited to those allowed by the [JSON Schema ruleset](http://www.yaml.org/spec/1.2/spec.html#id2803231)
- Keys used in YAML maps MUST be limited to a scalar string, as defined by the YAML Failsafe schema ruleset

### File Structure

The AAS representation of the API is made of a single file.
However, parts of the definitions can be split into separate files, at the discretion of the user.
This is applicable for `$ref` fields in the specification as follows from the [JSON Schema](http://json-schema.org) definitions.

By convention, the AsyncAPI Specification (AAS) file is named `asyncapi.json` or `asyncapi.yaml`.

### Schema

#### <a name="aasObject"></a>AsyncAPI Object

This is the root document object for the API specification.
It combines what previously was the Resource Listing and API Declaration (version 1.2 and earlier) together into one document.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
asyncapi | [AsyncAPI Version String](#aasVersion) | **Required.** Specifies the AsyncAPI Specification version being used. It can be used by tooling Specifications and clients to interpret the version. The structure shall be `major`.`minor`.`patch`, where `patch` versions _must_ be compatible with the existing `major`.`minor` tooling. Typically patch versions will be introduced to address errors in the documentation, and tooling should typically be compatible with the corresponding `major`.`minor` (1.0.*). Patch versions will correspond to patches of this document.
info | [Info Object](#infoObject) | **Required.** Provides metadata about the API. The metadata can be used by the clients if needed.
topics | [Topics Object](#topicsObject) | **Required.** The available topics and messages for the API.
components | [Components Object](#componentsObject) | An element to hold various schemas for the specification.
security | [[Security Requirement Object](#securityRequirementObject)] | A declaration of which security mechanisms can be used across the API. The list of values includes alternative security requirement objects that can be used. Only one of the security requirement objects need to be satisfied to authorize a request. Individual operations can override this definition.
servers | [[Server Object](#serverObject)] | An optional array of Server Objects which provide connectivity information to a target server.
externalDocs | [External Documentation Object](#externalDocumentationObject) | Additional external documentation.

This object can be extended with [Specification Extensions](#specificationExtensions).

#### <a name="aasVersion"></a>AsyncAPI Version String

The version string signifies the version of the AsyncAPI Specification that the document complies to.  The format for this string _must_ be `major`.`minor`.`patch`.  The `patch` _may_ be suffixed by a hyphen and extra alphanumeric characters.

A `major`.`minor` shall be used to designate the AsyncAPI Specification version, and will be considered compatible with the AsyncAPI Specification specified by that `major`.`minor` version.  The patch version will not be considered by tooling, making no distinction between `1.0.0` and `1.0.1`.

In subsequent versions of the AsyncAPI Specification, care will be given such that increments of the `minor` version should not interfere with operations of tooling developed to a lower minor version. Thus a hypothetical `1.1.0` specification should be usable with tooling designed for `1.0.0`.

#### <a name="infoObject"></a>Info Object

The object provides metadata about the API.
The metadata can be used by the clients if needed, and can be presented in the AsyncAPI-UI for convenience.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a name="infoTitle"></a>title | `string` | **Required.** The title of the application.
<a name="infoDescription"></a>description | `string` | A short description of the application. [CommonMark syntax](http://spec.commonmark.org/) can be used for rich text representation.
<a name="infoTermsOfService"></a>termsOfService | `string` | A URL to the Terms of Service for the API.
<a name="infoContact"></a>contact | [Contact Object](#contactObject) | The contact information for the exposed API.
<a name="infoLicense"></a>license | [License Object](#licenseObject) | The license information for the exposed API.
<a name="infoVersion"></a>version | `string` | **Required** Provides the version of the application API (not to be confused with the specification version).
<a name="infoProtocol"></a>protocols | [[Protocol Object](#protocolObject)] | **Required** A list of supported protocols.

This object can be extended with [Specification Extensions](#specificationExtensions).

##### Info Object Example:

```json
{
  "title": "AsyncAPI Sample App",
  "description": "This is a sample server.",
  "termsOfService": "http://asyncapi.org/terms/",
  "contact": {
    "name": "API Support",
    "url": "http://www.asyncapi.org/support",
    "email": "support@asyncapi.org"
  },
  "license": {
    "name": "Apache 2.0",
    "url": "http://www.apache.org/licenses/LICENSE-2.0.html"
  },
  "version": "1.0.1",
  "protocols": [
    {
      "name": "MQTT",
      "topic": {
        "separator": "/",
        "singleLevel": "+",
        "multiLevel": "#"
      }
    },
    {
      "name": "AMQP",
      "topic": {
        "separator": ".",
        "singleLevel": "*",
        "multiLevel": "#"
      }
    }
  ]
}
```

```yaml
title: AsyncAPI Sample App
description: This is a sample server.
termsOfService: http://asyncapi.org/terms/
contact:
  name: API Support
  url: http://www.asyncapi.org/support
  email: support@asyncapi.org
license:
  name: Apache 2.0
  url: http://www.apache.org/licenses/LICENSE-2.0.html
version: 1.0.1
protocols:
  - name: MQTT
    topic:
      separator: /
      singleLevel: +
      multiLevel: "#"
  - name: AMQP
    topic:
      separator: .
      singleLevel: *
      multiLevel: "#"
```

#### <a name="contactObject"></a>Contact Object

Contact information for the exposed API.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
name | `string` | The identifying name of the contact person/organization.
url | `string` | The URL pointing to the contact information. MUST be in the format of a URL.
email | `string` | The email address of the contact person/organization. MUST be in the format of an email address.

This object can be extended with [Specification Extensions](#specificationExtensions).

##### Contact Object Example:

```json
{
  "name": "API Support",
  "url": "http://www.asyncapi.org/support",
  "email": "support@asyncapi.org"
}
```

```yaml
name: API Support
url: http://www.asyncapi.org/support
email: support@asyncapi.org
```

#### <a name="licenseObject"></a>License Object

License information for the exposed API.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
name | `string` | **Required.** The license name used for the API.
url | `string` | A URL to the license used for the API. MUST be in the format of a URL.

This object can be extended with [Specification Extensions](#specificationExtensions).

##### License Object Example:

```json
{
  "name": "Apache 2.0",
  "url": "http://www.apache.org/licenses/LICENSE-2.0.html"
}
```

```yaml
name: Apache 2.0
url: http://www.apache.org/licenses/LICENSE-2.0.html
```

#### <a name="protocolObject"></a>Protocol Object

Protocol information for the exposed API.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
name | `string` | The identifying name of the protocol.
topic | [Topic Object](#topicObject) | A description of the topic structure in this protocol.

This object can be extended with [Specification Extensions](#specificationExtensions).

##### Protocol Object Example:

```json
{
  "name": "MQTT",
  "topic": {
    "separator": "/",
    "singleLevel": "+",
    "multiLevel": "#"
  }
}
```

```yaml
name: MQTT
topic:
  separator: /
  singleLevel: +
  multiLevel: "#"
```

#### <a name="topicObject"></a>Topic Object

The object provides information on how a topic is structured.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
separator | `string` | The character used to separate topic words or levels.
singleLevel | `string` | The character used to represent a single-level wildcard.
multiLevel | `string` | The character used to represent a multi-level wildcard.

This object can be extended with [Specification Extensions](#specificationExtensions).

#### <a name="componentsObject"></a>Components Object

Holds a set of reusable objects for different aspects of the AAS.
All objects defined within the components object will have no effect on the API unless they are explicitly referenced from properties outside the components object.


##### Fixed Fields

Field Pattern | Type | Description
---|:---:|---
definitions | [Definitions Object](#definitionsObject) | An array of object definitions.
protocols | [Protocol Object](#protocolObject) | An array of protocol definitions.

All the fixed fields declared above are objects that MUST use keys that match the regular expression: `[a-zA-Z0-9.\-_]+`.


#### <a name="definitionsObject"></a>Definitions Object

An object to hold schemas for data types that can be consumed and produced by operations.
These data types can be primitives, arrays or models.

##### Patterned Fields

Field Pattern | Type | Description
---|:---:|---
<a name="definitionsName"></a>{name} | [Schema Object](#schemaObject) | A single definition, mapping a "name" to the schema it defines.

Examples:

```
User
User_1
User_Name
user-name
my.org.User
my\org\User
```

##### Definitions Object Example

```json
{
  "Category": {
    "type": "object",
    "properties": {
      "id": {
        "type": "integer",
        "format": "int64"
      },
      "name": {
        "type": "string"
      }
    }
  },
  "Tag": {
    "type": "object",
    "properties": {
      "id": {
        "type": "integer",
        "format": "int64"
      },
      "name": {
        "type": "string"
      }
    }
  }
}
```

```yaml
Category:
  type: object
  properties:
    id:
      type: integer
      format: int64
    name:
      type: string
Tag:
  type: object
  properties:
    id:
      type: integer
      format: int64
    name:
      type: string
```

#### <a name="schemaObject"></a>Schema Object

The Schema Object allows the definition of input and output data types.
These types can be objects, but also primitives and arrays.
This object is based on the [JSON Schema Specification Draft 4](http://json-schema.org/) and uses a predefined subset of it.
On top of this subset, there are extensions provided by this specification to allow for more complete documentation.

Further information about the properties can be found in [JSON Schema Core](http://json-schema.org/latest/json-schema-core.html) and [JSON Schema Validation](http://json-schema.org/latest/json-schema-validation.html).
Unless stated otherwise, the property definitions follow the JSON Schema specification as referenced here.

The following properties are taken directly from the JSON Schema definition and follow the same specifications:
- $ref - As a [JSON Reference](https://tools.ietf.org/html/draft-pbryan-zyp-json-ref-03)
- format (See [Data Type Formats](#dataTypeFormat) for further details)
- title
- description ([CommonMark syntax](http://spec.commonmark.org/) can be used for rich text representation)
- default (Unlike JSON Schema, the value MUST conform to the defined type for the Schema Object)
- multipleOf
- maximum
- exclusiveMaximum
- minimum
- exclusiveMinimum
- maxLength
- minLength
- pattern
- maxItems
- minItems
- uniqueItems
- maxProperties
- minProperties
- required
- enum
- type

The following properties are taken from the JSON Schema definition but their definitions were adjusted to the AsyncAPI Specification.
Their definition is the same as the one from JSON Schema, only where the original definition references the JSON Schema definition, the [Schema Object](#schemaObject) definition is used instead.
- items
- allOf
- oneOf
- anyOf
- not
- properties
- additionalProperties

Other than the JSON Schema subset fields, the following fields may be used for further schema documentation.

##### Fixed Fields
Field Name | Type | Description
---|:---:|---
<a name="schemaDiscriminator"></a>discriminator | `string` | Adds support for polymorphism. The discriminator is the schema property name that is used to differentiate between other schema that inherit this schema. The property name used MUST be defined at this schema and it MUST be in the `required` property list. When used, the value MUST be the name of this schema or any schema that inherits it.
<a name="schemaReadOnly"></a>readOnly | `boolean` | Relevant only for Schema `"properties"` definitions. Declares the property as "read only". This means that it MAY be sent as part of a response but MUST NOT be sent as part of the request. Properties marked as `readOnly` being `true` SHOULD NOT be in the `required` list of the defined schema. Default value is `false`.
<a name="schemaXml"></a>xml | [XML Object](#xmlObject) | This MAY be used only on properties schemas. It has no effect on root schemas. Adds Additional metadata to describe the XML representation format of this property.
<a name="schemaExternalDocs"></a>externalDocs | [External Documentation Object](#externalDocumentationObject) | Additional external documentation for this schema.
<a name="schemaExample"></a>example | Any | A free-form property to include an example of an instance for this schema.
<a name="schemaExamples"></a>examples | Any | An array of free-formed properties to include examples for this schema.
<a name="schemaDeprecated"></a> deprecated | `boolean` | Specifies that a schema is deprecated and should be transitioned out of usage.

This object can be extended with [Specification Extensions](#specificationExtensions).

###### Composition and Inheritance (Polymorphism)

The AsyncAPI Specification allows combining and extending model definitions using the `allOf` property of JSON Schema, in effect offering model composition.
`allOf` takes in an array of object definitions that are validated *independently* but together compose a single object.

While composition offers model extensibility, it does not imply a hierarchy between the models.
To support polymorphism, AsyncAPI Specification adds the support of the `discriminator` field.
When used, the `discriminator` will be the name of the property used to decide which schema definition is used to validate the structure of the model.
As such, the `discriminator` field MUST be a required field.
The value of the chosen property has to be the friendly name given to the model under the `definitions` property.
As such, inline schema definitions, which do not have a given id, *cannot* be used in polymorphism.

###### XML Modeling

The [xml](#schemaXml) property allows extra definitions when translating the JSON definition to XML.
The [XML Object](#xmlObject) contains additional information about the available options.

##### Schema Object Examples

###### Primitive Sample

Unlike previous versions of Swagger, AsyncAPI Schema definitions can be used to describe primitive and arrays as well.

```json
{
  "type": "string",
  "format": "email"
}
```

```yaml
type: string
format: email
```

###### Simple Model

```json
{
  "type": "object",
  "required": [
    "name"
  ],
  "properties": {
    "name": {
      "type": "string"
    },
    "address": {
      "$ref": "#/definitions/Address"
    },
    "age": {
      "type": "integer",
      "format": "int32",
      "minimum": 0
    }
  }
}
```

```yaml
type: object
required:
- name
properties:
  name:
    type: string
  address:
    $ref: '#/definitions/Address'
  age:
    type: integer
    format: int32
    minimum: 0
```

###### Model with Map/Dictionary Properties

For a simple string to string mapping:

```json
{
  "type": "object",
  "additionalProperties": {
    "type": "string"
  }
}
```

```yaml
type: object
additionalProperties:
  type: string
```

For a string to model mapping:

```json
{
  "type": "object",
  "additionalProperties": {
    "$ref": "#/definitions/ComplexModel"
  }
}
```

```yaml
type: object
additionalProperties:
  $ref: '#/definitions/ComplexModel'
```

###### Model with Example

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "integer",
      "format": "int64"
    },
    "name": {
      "type": "string"
    }
  },
  "required": [
    "name"
  ],
  "example": {
    "name": "Puma",
    "id": 1
  }
}
```

```yaml
type: object
properties:
  id:
    type: integer
    format: int64
  name:
    type: string
required:
- name
example:
  name: Puma
  id: 1
```

###### Model with Examples

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "integer",
      "format": "int64"
    },
    "name": {
      "type": "string"
    }
  },
  "required": [
    "name"
  ],
  "examples": [
  {
    "name": "Puma",
    "id": 1
  }, {
    "name": "Ferguson",
    "id": 2
  }]
}
```

```yaml
type: object
properties:
  id:
    type: integer
    format: int64
  name:
    type: string
required:
- name
examples:
  - name: Puma
    id: 1
  - name: Ferguson
    id: 2
```

###### Models with Composition

```json
{
  "definitions": {
    "ErrorModel": {
      "type": "object",
      "required": [
        "message",
        "code"
      ],
      "properties": {
        "message": {
          "type": "string"
        },
        "code": {
          "type": "integer",
          "minimum": 100,
          "maximum": 600
        }
      }
    },
    "ExtendedErrorModel": {
      "allOf": [
        {
          "$ref": "#/definitions/ErrorModel"
        },
        {
          "type": "object",
          "required": [
            "rootCause"
          ],
          "properties": {
            "rootCause": {
              "type": "string"
            }
          }
        }
      ]
    }
  }
}
```

```yaml
definitions:
  ErrorModel:
    type: object
    required:
    - message
    - code
    properties:
      message:
        type: string
      code:
        type: integer
        minimum: 100
        maximum: 600
  ExtendedErrorModel:
    allOf:
    - $ref: '#/definitions/ErrorModel'
    - type: object
      required:
      - rootCause
      properties:
        rootCause:
          type: string
```

###### Models with Polymorphism Support

```json
{
  "definitions": {
    "Pet": {
      "type": "object",
      "discriminator": "petType",
      "properties": {
        "name": {
          "type": "string"
        },
        "petType": {
          "type": "string"
        }
      },
      "required": [
        "name",
        "petType"
      ]
    },
    "Cat": {
      "description": "A representation of a cat",
      "allOf": [
        {
          "$ref": "#/definitions/Pet"
        },
        {
          "type": "object",
          "properties": {
            "huntingSkill": {
              "type": "string",
              "description": "The measured skill for hunting",
              "default": "lazy",
              "enum": [
                "clueless",
                "lazy",
                "adventurous",
                "aggressive"
              ]
            }
          },
          "required": [
            "huntingSkill"
          ]
        }
      ]
    },
    "Dog": {
      "description": "A representation of a dog",
      "allOf": [
        {
          "$ref": "#/definitions/Pet"
        },
        {
          "type": "object",
          "properties": {
            "packSize": {
              "type": "integer",
              "format": "int32",
              "description": "the size of the pack the dog is from",
              "default": 0,
              "minimum": 0
            }
          },
          "required": [
            "packSize"
          ]
        }
      ]
    }
  }
}
```

```yaml
definitions:
  Pet:
    type: object
    discriminator: petType
    properties:
      name:
        type: string
      petType:
        type: string
    required:
    - name
    - petType
  Cat:
    description: A representation of a cat
    allOf:
    - $ref: '#/definitions/Pet'
    - type: object
      properties:
        huntingSkill:
          type: string
          description: The measured skill for hunting
          default: lazy
          enum:
          - clueless
          - lazy
          - adventurous
          - aggressive
      required:
      - huntingSkill
  Dog:
    description: A representation of a dog
    allOf:
    - $ref: '#/definitions/Pet'
    - type: object
      properties:
        packSize:
          type: integer
          format: int32
          description: the size of the pack the dog is from
          default: 0
          minimum: 0
      required:
      - packSize
```

#### <a name="xmlObject"></a>XML Object

A metadata object that allows for more fine-tuned XML model definitions.

When using arrays, XML element names are *not* inferred (for singular/plural forms) and the `name` property should be used to add that information.
See examples for expected behavior.

##### Fixed Fields
Field Name | Type | Description
---|:---:|---
<a name="xmlName"></a>name | `string` | Replaces the name of the element/attribute used for the described schema property. When defined within the Items Object (`items`), it will affect the name of the individual XML elements within the list. When defined alongside `type` being `array` (outside the `items`), it will affect the wrapping element and only if `wrapped` is `true`. If `wrapped` is `false`, it will be ignored.
<a name="xmlNamespace"></a>namespace | `string` | The URL of the namespace definition. Value SHOULD be in the form of a URL.
<a name="xmlPrefix"></a>prefix | `string` | The prefix to be used for the [name](#xmlName).
<a name="xmlAttribute"></a>attribute | `boolean` | Declares whether the property definition translates to an attribute instead of an element. Default value is `false`.
<a name="xmlWrapped"></a>wrapped | `boolean` | MAY be used only for an array definition. Signifies whether the array is wrapped (for example, `<books><book/><book/></books>`) or unwrapped (`<book/><book/>`). Default value is `false`. The definition takes effect only when defined alongside `type` being `array` (outside the `items`).

This object can be extended with [Specification Extensions](#specificationExtensions).

##### XML Object Examples

The examples of the XML object definitions are included inside a property definition of a [Schema Object](#schemaObject) with a sample of the XML representation of it.

###### No XML Element

Basic string property:

```json
{
    "animals": {
        "type": "string"
    }
}
```

```yaml
animals:
  type: string
```

```xml
<animals>...</animals>
```

Basic string array property ([`wrapped`](#xmlWrapped) is `false` by default):

```json
{
    "animals": {
        "type": "array",
        "items": {
            "type": "string"
        }
    }
}
```

```yaml
animals:
  type: array
  items:
    type: string
```

```xml
<animals>...</animals>
<animals>...</animals>
<animals>...</animals>
```

###### XML Name Replacement

```json
{
  "animals": {
    "type": "string",
    "xml": {
      "name": "animal"
    }
  }
}
```

```yaml
animals:
  type: string
  xml:
    name: animal
```

```xml
<animal>...</animal>
```


###### XML Attribute, Prefix and Namespace

In this example, a full model definition is shown.

```json
{
  "Person": {
    "type": "object",
    "properties": {
      "id": {
        "type": "integer",
        "format": "int32",
        "xml": {
          "attribute": true
        }
      },
      "name": {
        "type": "string",
        "xml": {
          "namespace": "http://swagger.io/schema/sample",
          "prefix": "sample"
        }
      }
    }
  }
}
```

```yaml
Person:
  type: object
  properties:
    id:
      type: integer
      format: int32
      xml:
        attribute: true
    name:
      type: string
      xml:
        namespace: http://swagger.io/schema/sample
        prefix: sample
```

```xml
<Person id="123">
    <sample:name xmlns:sample="http://swagger.io/schema/sample">example</sample:name>
</Person>
```

###### XML Arrays

Changing the element names:

```json
{
  "animals": {
    "type": "array",
    "items": {
      "type": "string",
      "xml": {
        "name": "animal"
      }
    }
  }
}
```

```yaml
animals:
  type: array
  items:
    type: string
    xml:
      name: animal
```

```xml
<animal>value</animal>
<animal>value</animal>
```

The external `name` property has no effect on the XML:

```json
{
  "animals": {
    "type": "array",
    "items": {
      "type": "string",
      "xml": {
        "name": "animal"
      }
    },
    "xml": {
      "name": "aliens"
    }
  }
}
```

```yaml
animals:
  type: array
  items:
    type: string
    xml:
      name: animal
  xml:
    name: aliens
```

```xml
<animal>value</animal>
<animal>value</animal>
```

Even when the array is wrapped, if no name is explicitly defined, the same name will be used both internally and externally:

```json
{
  "animals": {
    "type": "array",
    "items": {
      "type": "string"
    },
    "xml": {
      "wrapped": true
    }
  }
}
```

```yaml
animals:
  type: array
  items:
    type: string
  xml:
    wrapped: true
```

```xml
<animals>
  <animals>value</animals>
  <animals>value</animals>
</animals>
```

To overcome the above example, the following definition can be used:

```json
{
  "animals": {
    "type": "array",
    "items": {
      "type": "string",
      "xml": {
        "name": "animal"
      }
    },
    "xml": {
      "wrapped": true
    }
  }
}
```

```yaml
animals:
  type: array
  items:
    type: string
    xml:
      name: animal
  xml:
    wrapped: true
```

```xml
<animals>
  <animal>value</animal>
  <animal>value</animal>
</animals>
```

Affecting both internal and external names:

```json
{
  "animals": {
    "type": "array",
    "items": {
      "type": "string",
      "xml": {
        "name": "animal"
      }
    },
    "xml": {
      "name": "aliens",
      "wrapped": false
    }
  }
}
```

```yaml
animals:
  type: array
  items:
    type: string
    xml:
      name: animal
  xml:
    name: aliens
    wrapped: false
```

```xml
<aliens>
  <animal>value</animal>
  <animal>value</animal>
</aliens>
```

If we change the external element but not the internal ones:

```json
{
  "animals": {
    "type": "array",
    "items": {
      "type": "string"
    },
    "xml": {
      "name": "aliens",
      "wrapped": true
    }
  }
}
```

```yaml
animals:
  type: array
  items:
    type: string
  xml:
    name: aliens
    wrapped: true
```

```xml
<aliens>
  <aliens>value</aliens>
  <aliens>value</aliens>
</aliens>
```

### <a name="specificationExtensions"></a>Specification Extensions

While the AsyncAPI Specification tries to accommodate most use cases, additional data can be added to extend the specification at certain points.

The extensions properties are implemented as patterned fields that are always prefixed by `"x-"`.

Field Pattern | Type | Description
---|:---:|---
^x- | Any | Allows extensions to the AsyncAPI Schema. The field name MUST begin with `x-`, for example, `x-internal-id`. The value can be `null`, a primitive, an array or an object. Can have any valid JSON format value.

The extensions may or may not be supported by the available tooling, but those may be extended as well to add requested support (if tools are internal or open-sourced).
