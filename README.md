# AsyncAPI Specification

#### Disclaimer

Part of this content has been taken from the great work done by the folks at the [Open API Initiative](https://openapis.org). Mainly because **it's a great work** and we want to keep as much compatibility as possible with the [Open API Specification](https://github.com/OAI/OpenAPI-Specification).

#### Version 1.0.0-rc2

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [RFC 2119](http://www.ietf.org/rfc/rfc2119.txt).

The AsyncAPI Specification is licensed under [The Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0.html).

## Introduction

The AsyncAPI Specification is a project used to describe and document Asynchronous APIs.

The AsyncAPI Specification defines a set of files required to describe such an API.
These files can then be used to create utilities, such as documentation, integration and/or testing tools.

## Table of Contents
<!-- TOC depthFrom:2 depthTo:4 withLinks:1 updateOnSave:0 orderedList:0 -->

- [Definitions](#definitions)
	- [Message Broker](#definitionsMessageBroker)
	- [Message](#definitionsMessage)
	- [Topic](#definitionstTopic)
	- [Process](#definitionsProcess)
	- [Producer](#definitionsProducer)
	- [Consumer](#definitionsConsumer)
	- [Topic Templating](#definitionsTopicTemplating)
- [Specification](#specification)
	- [Format](#format)
	- [File Structure](#file-structure)
	- [Schema](#schema)
		- [AsyncAPI Object](#A2SObject)
		- [AsyncAPI Version String](#A2SVersionString)
		- [Info Object](#infoObject)
		- [Contact Object](#contactObject)
		- [License Object](#licenseObject)
		- [Host String](#hostString)
		- [Base Topic String](#baseTopicString)
		- [Schemes List](#schemesList)
		- [Topics Object](#topicsObject)
		- [Topic Item Object](topicItemObject)
		- [Message Object](#messageObject)
		- [Tag Object](#tagObject)
		- [External Documentation Object](#externalDocumentationObject)
		- [Components Object](#componentsObject)
		- [Reference Object](#referenceObject)
		- [Schema Object](#schemaObject)
		- [XML Object](#xmlObject)
	- [Specification Extensions](#specificationExtensions)

<!-- /TOC -->

## Definitions

#### <a name="definitionsMessageBroker"></a>Message Broker
A message broker is a system in charge of message exchange. It MAY provide additional features, such as message queueing, storage or processing.

#### <a name="definitionsMessage"></a>Message
A message is a piece of information a process will send to a message broker. It MUST contain headers and payload.

#### <a name="definitionstTopic"></a>Topic
A topic is a routing key used by the message broker to deliver messages to the subscribed processes. Depending on the protocol used, a message MAY include the topic in its headers.

#### <a name="definitionsProcess"></a>Process
A process is any kind of computer program connected to a message broker. It MUST be a producer, a consumer or both.

#### <a name="definitionsProducer"></a>Producer
A producer is a process publishing messages to a message broker.

#### <a name="definitionsConsumer"></a>Consumer
A consumer is a process subscribed to a message broker and consumes messages from it.

#### <a name="definitionsTopicTemplating"></a>Topic Templating
Topic templating refers to the usage of curly braces ({}) to mark a section of a topic as replaceable.

## Specification

### Format

The files describing the Asynchronous API in accordance with the AsyncAPI Specification are represented as JSON objects and conform to the JSON standards.
YAML, being a superset of JSON, can be used as well to represent a A2S (AsyncAPI Specification) file.

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

The A2S representation of the API is made of a single file.
However, parts of the definitions can be split into separate files, at the discretion of the user.
This is applicable for `$ref` fields in the specification as follows from the [JSON Schema](http://json-schema.org) definitions.

By convention, the AsyncAPI Specification (A2S) file is named `asyncapi.json` or `asyncapi.yaml`.

### Schema

#### <a name="A2SObject"></a>AsyncAPI Object

This is the root document object for the API specification.
It combines resource listing and API declaration together into one document.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a name="A2SAsyncAPI"></a>asyncapi | [AsyncAPI Version String](#A2SVersionString) | **Required.** Specifies the AsyncAPI Specification version being used. It can be used by tooling Specifications and clients to interpret the version. The structure shall be `major`.`minor`.`patch`, where `patch` versions _must_ be compatible with the existing `major`.`minor` tooling. Typically patch versions will be introduced to address errors in the documentation, and tooling should typically be compatible with the corresponding `major`.`minor` (1.0.*). Patch versions will correspond to patches of this document.
<a name="A2SInfo"></a>info | [Info Object](#infoObject) | **Required.** Provides metadata about the API. The metadata can be used by the clients if needed.
<a name="A2SBaseTopic"></a>baseTopic | [BaseTopic String](#baseTopicString) | The base topic to the API.
<a name="A2STopics"></a>topics | [Topics Object](#topicsObject) | **Required.** The available topics and messages for the API.
<a name="A2SComponents"></a>components | [Components Object](#componentsObject) | An element to hold various schemas for the specification.
<a name="A2STags"></a>tags | [[Tag Object](#tagObject)] | A list of tags used by the specification with additional metadata. Each tag name in the list MUST be unique.
<a name="A2SExternalDocs"></a>externalDocs | [External Documentation Object](#externalDocumentationObject) | Additional external documentation.


This object can be extended with [Specification Extensions](#specificationExtensions).

#### <a name="A2SVersionString"></a>AsyncAPI Version String

The version string signifies the version of the AsyncAPI Specification that the document complies to.
The format for this string _must_ be `major`.`minor`.`patch`.  The `patch` _may_ be suffixed by a hyphen and extra alphanumeric characters.

A `major`.`minor` shall be used to designate the AsyncAPI Specification version, and will be considered compatible with the AsyncAPI Specification specified by that `major`.`minor` version.
The patch version will not be considered by tooling, making no distinction between `1.0.0` and `1.0.1`.

In subsequent versions of the AsyncAPI Specification, care will be given such that increments of the `minor` version should not interfere with operations of tooling developed to a lower minor version. Thus a hypothetical `1.1.0` specification should be usable with tooling designed for `1.0.0`.

#### <a name="infoObject"></a>Info Object

The object provides metadata about the API.
The metadata can be used by the clients if needed.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a name="infoObjectTitle"></a>title | `string` | **Required.** The title of the application.
<a name="infoObjectVersion"></a>version | `string` | **Required** Provides the version of the application API (not to be confused with the specification version).
<a name="infoObjectDescription"></a>description | `string` | A short description of the application. [CommonMark syntax](http://spec.commonmark.org/) can be used for rich text representation.
<a name="infoObjectTermsOfService"></a>termsOfService | `string` | A URL to the Terms of Service for the API.
<a name="infoObjectContact"></a>contact | [Contact Object](#contactObject) | The contact information for the exposed API.
<a name="infoObjectLicense"></a>license | [License Object](#licenseObject) | The license information for the exposed API.

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
  "version": "1.0.1"
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
```

#### <a name="contactObject"></a>Contact Object

Contact information for the exposed API.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a name="contactObjectName"></a>name | `string` | The identifying name of the contact person/organization.
<a name="contactObjectUrl"></a>url | `string` | The URL pointing to the contact information. MUST be in the format of a URL.
<a name="contactObjectEmail"></a>email | `string` | The email address of the contact person/organization. MUST be in the format of an email address.

This object can be extended with [Specification Extensions](#specificationExtensions). 

##### Contact Object Example:

```json
{
  "name": "API Support",
  "url": "http://www.example.com/support",
  "email": "support@example.com"
}
```

```yaml
name: API Support
url: http://www.example.com/support
email: support@example.com
```

#### <a name="licenseObject"></a>License Object

License information for the exposed API.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a name="licenseObjectName"></a>name | `string` | **Required.** The license name used for the API.
<a name="licenseObjectUrl"></a>url | `string` | A URL to the license used for the API. MUST be in the format of a URL.

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


#### <a name="hostString"></a>Host String

The host (name or ip) of the target server. This MAY point to a message broker.

##### Host String Example:

```json
{
  "host": "myapi.example.com"
}
```

```yaml
host: myapi.example.com
```

#### <a name="baseTopicString"></a>Base Topic String

The base topic to the API. You MAY use this field to avoid repeating the beginning of the topics.


##### Base Topic String Example:

```json
{
  "baseTopic": "hitch.accounts"
}
```

```yaml
baseTopic: hitch.accounts
```



#### <a name="schemesList"></a>Schemes List

An array of the transfer protocol(s) the API supports. Values MUST be one (or more) of the following values:

Value | Type | Description
---|:---:|---
<a name="schemesListValueAMQP"></a>amqp | `string` | AMQP protocol.
<a name="schemesListValueAMQPS"></a>amqps | `string` | AMQP protocol over SSL/TLS.
<a name="schemesListValueMQTT"></a>mqtt | `string` | MQTT protocol
<a name="schemesListValueMQTTS"></a>mqtts | `string` | MQTT protocol over SSL/TLS.
<a name="schemesListValueWS"></a>ws | `string` | WebSockets protocol
<a name="schemesListValueWSS"></a>wss | `string` | WebSockets protocol over SSL/TLS.
<a name="schemesListValueSTOMP"></a>stomp | `string` | STOMP protocol.
<a name="schemesListValueSTOMPS"></a>stomps | `string` | STOMP protocol over SSL/TLS.


##### Schemes List Example:

```json
{
  "schemes": ["amqps", "mqtts"]
}
```

```yaml
schemes:
  - amqps
  - mqtts
```


#### <a name="topicsObject"></a>Topics Object

Holds the relative paths to the individual topic and their operations.
The topic is appended to the [`Base Topic`](#baseTopicString) in order to construct the full one.

##### Patterned Fields

Field Pattern | Type | Description
---|:---:|---
<a name="topicsObjectTopic"></a>^[^.]{topic} | [Topic Item Object](#topicItemObject) | A relative path to an individual topic. The field name MUST NOT begin with a dot. [Topic templating](#definitionsTopicTemplating) is allowed.

This object can be extended with [Specification Extensions](#specificationExtensions). 

##### Topics Object Example

```json
{
  "accounts.1.0.event.user.signup": {
    "subscribe": {
      "$ref": "#/components/messages/userSignedUp"
    }
  }
}
```

```yaml
accounts.1.0.event.user.signup:
  subscribe:
    $ref: "#/components/messages/userSignedUp"
```




#### <a name="topicItemObject"></a>Topic Item Object

Describes the operations available on a single topic.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a name="topicItemObjectRef"></a>$ref | `string` | Allows for an external definition of this topic item. The referenced structure MUST be in the format of a [Topic Item Object](#topicItemObject). If there are conflicts between the referenced definition and this Topic Item's definition, the behavior is *undefined*.
<a name="topicItemObjectSubscribe"></a>subscribe | [Message Object](#messageObject) | A definition of the message a SUBSCRIBE operation will receive on this topic.
<a name="topicItemObjectPublish"></a>publish | [Message Object](#messageObject) | A definition of the message a PUBLISH operation will receive on this topic.

This object can be extended with [Specification Extensions](#specificationExtensions). 

##### Topic Item Object Example

```json
{
  "subscribe": {
    "summary": "A user signed up.",
    "description": "A longer description of the message",
    "payload": {
      "type": "object",
      "properties": {
        "user": {
          "$ref": "#/components/schemas/user"
        },
        "signup": {
          "$ref": "#/components/schemas/signup"
        }
      }
    }
  }
}
```

```yaml
subscribe:
  summary: A user signed up.
  description: A longer description of the message
  payload:
    type: object
    properties:
      user:
        $ref: "#/components/schemas/user"
      signup:
        $ref: "#/components/schemas/signup"
```



#### <a name="messageObject"></a>Message Object

Describes a message received on a given topic and operation.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a name="messageObjectHeaders"></a>headers | [Schema Object](#schemaObject) | Definition of the message headers. It MAY or MAY NOT define the protocol headers.
<a name="messageObjectPayload"></a>payload | [Schema Object](#schemaObject) | Definition of the message payload.
<a name="messageObjectSummary"></a>summary | `string` | A short summary of what the message is about.
<a name="messageObjectDescription"></a>description | `string` | A verbose explanation of the message. [CommonMark syntax](http://spec.commonmark.org/) can be used for rich text representation.
<a name="messageObjectTags"></a>tags | [`string`] | A list of tags for API documentation control. Tags can be used for logical grouping of messages.
<a name="messageObjectExternalDocs"></a>externalDocs | [External Documentation Object](#externalDocumentationObject) | Additional external documentation for this message.

This object can be extended with [Specification Extensions](#specificationExtensions). 

##### Message Object Example

```json
{
  "summary": "Action to sign a user up.",
  "description": "A longer description",
  "tags": [
    { "name" "user" },
    { "name" "signup" },
    { "name" "register" }
  ],
  "headers": {
    "type": "object",
    "properties": {
      "qos": {
        "$ref": "#/components/schemas/MQTTQoSHeader"
      },
      "retainFlag": {
        "$ref": "#/components/schemas/MQTTRetainHeader"
      }
    }
  },
  "payload": {
    "type": "object",
    "properties": {
      "user": {
        "$ref": "#/components/schemas/userCreate"
      },
      "signup": {
        "$ref": "#/components/schemas/signup"
      }
    }
  }
}
```

```yaml
summary: Action to sign a user up.
description: A longer description
tags:
  - name: user
  - name: signup
  - name: register
headers:
  type: object
  properties:
    qos:
      $ref: "#/components/schemas/MQTTQoSHeader"
    retainFlag:
      $ref: "#/components/schemas/MQTTRetainHeader"
payload:
  type: object
  properties:
    user:
      $ref: "#/components/schemas/userCreate"
    signup:
      $ref: "#/components/schemas/signup"
```






#### <a name="tagObject"></a>Tag Object

Allows adding meta data to a single tag.

##### Fixed Fields
Field Name | Type | Description
---|:---:|---
<a name="tagObjectName"></a>name | `string` | **Required.** The name of the tag.
<a name="tagObjectDescription"></a>description | `string` | A short description for the tag. [CommonMark syntax](http://spec.commonmark.org/) can be used for rich text representation.
<a name="tagObjectExternalDocs"></a>externalDocs | [External Documentation Object](#externalDocumentationObject) | Additional external documentation for this tag.

This object can be extended with [Specification Extensions](#specificationExtensions). 

##### Tag Object Example

```json
{
	"name": "user",
	"description": "User-related messages"
}
```

```yaml
name: user
description: User-related messages
```





#### <a name="externalDocumentationObject"></a>External Documentation Object

Allows referencing an external resource for extended documentation.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a name="externalDocDescription"></a>description | `string` | A short description of the target documentation. [CommonMark syntax](http://spec.commonmark.org/) can be used for rich text representation.
<a name="externalDocUrl"></a>url | `string` | **Required.** The URL for the target documentation. Value MUST be in the format of a URL.

This object can be extended with [Specification Extensions](#specificationExtensions). 

##### External Documentation Object Example

```json
{
  "description": "Find more info here",
  "url": "https://example.com"
}
```

```yaml
description: Find more info here
url: https://example.com
```

#### <a name="referenceObject"></a>Reference Object

A simple object to allow referencing other components in the specification, internally and externally.


The Reference Object is defined by [JSON Reference](https://tools.ietf.org/html/draft-pbryan-zyp-json-ref-03) and follows the same structure, behavior and rules.

For this specification, reference resolution is done as defined by the JSON Reference specification
and not by the JSON Schema specification.

##### Fixed Fields
Field Name | Type | Description
---|:---:|---
<a name="referenceRef"></a>$ref | `string` | **Required.** The reference string.

This object cannot be extended with additional properties and any properties added SHALL be ignored.

##### Reference Object Example

```json
{
  "$ref": "#/components/schemas/Pet"
}
```

```yaml
  $ref: '#/components/schemas/Pet'
```

#### <a name="componentsObject"></a>Components Object

Holds a set of reusable objects for different aspects of the AsyncAPI specification.
All objects defined within the components object will have no effect on the API unless they are explicitly referenced from properties outside the components object.

##### Fixed Fields

Field Name | Type | Description
---|:---|---
<a name="componentsSchemas"></a> schemas | Map[`string`, [Schema Object](#schemaObject) \| [Reference Object](#referenceObject)] | An object to hold reusable [Schema Objects](#schemaObject).
<a name="componentsMessages"></a> messages | Map[`string`, [Message Object](#messageObject) \| [Reference Object](#referenceObject)] | An object to hold reusable [Message Objects](#messageObject).

This object can be extended with [Specification Extensions](#specificationExtensions).

All the fixed fields declared above are objects that MUST use keys that match the regular expression: `^[a-zA-Z0-9\.\-_]+$`.

Field Name Examples:

```
User
User_1
User_Name
user-name
my.org.User
```

##### Components Object Example

```json
"components": {
  "schemas": {
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
  },
  "messages": {
    "userSignUp": {
      "summary": "Action to sign a user up.",
      "description": "Multiline description of what this action does.\nHere you have another line.\n",
      "tags": [
        {
          "name": "user"
        },
        {
          "name": "signup"
        }
      ],
      "headers": {
        "type": "object",
        "properties": {
          "qos": {
            "$ref": "#/components/schemas/MQTTQoSHeader"
          },
          "retainFlag": {
            "$ref": "#/components/schemas/MQTTRetainHeader"
          }
        }
      },
      "payload": {
        "type": "object",
        "properties": {
          "user": {
            "$ref": "#/components/schemas/userCreate"
          },
          "signup": {
            "$ref": "#/components/schemas/signup"
          }
        }
      }
    }
  }
}
```

```yaml
components:
  schemas:
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
  messages:
    userSignUp:
      summary: Action to sign a user up.
      description: |
        Multiline description of what this action does.
        Here you have another line.
      tags:
        - name: user
        - name: signup
      headers:
        type: object
        properties:
          qos:
            $ref: "#/components/schemas/MQTTQoSHeader"
          retainFlag:
            $ref: "#/components/schemas/MQTTRetainHeader"
      payload:
        type: object
        properties:
          user:
            $ref: "#/components/schemas/userCreate"
          signup:
            $ref: "#/components/schemas/signup"
```

#### <a name="schemaObject"></a>Schema Object

The Schema Object allows the definition of input and output data types.
These types can be objects, but also primitives and arrays.
This object is an extended subset of the [JSON Schema Specification Wright Draft 00](http://json-schema.org/).

Further information about the properties can be found in [JSON Schema Core](https://tools.ietf.org/html/draft-wright-json-schema-00) and [JSON Schema Validation](https://tools.ietf.org/html/draft-wright-json-schema-validation-00).
Unless stated otherwise, the property definitions follow the JSON Schema specification as referenced here.

##### Properties 

The following properties are taken directly from the JSON Schema definition and follow the same specifications:

- title
- multipleOf
- maximum
- exclusiveMaximum
- minimum
- exclusiveMinimum
- maxLength
- minLength
- pattern (This string SHOULD be a valid regular expression, according to the [ECMA 262 regular expression](https://www.ecma-international.org/ecma-262/5.1/#sec-7.8.5) dialect)
- maxItems
- minItems
- uniqueItems
- maxProperties
- minProperties
- required
- enum

The following properties are taken from the JSON Schema definition but their definitions were adjusted to the AsyncAPI Specification. 
- type - Value MUST be a string. Multiple types via an array are not supported.
- allOf - Inline or referenced schema MUST be of a [Schema Object](#schemaObject) and not a standard JSON Schema.
- oneOf - Inline or referenced schema MUST be of a [Schema Object](#schemaObject) and not a standard JSON Schema.
- anyOf - Inline or referenced schema MUST be of a [Schema Object](#schemaObject) and not a standard JSON Schema.
- not - Inline or referenced schema MUST be of a [Schema Object](#schemaObject) and not a standard JSON Schema.
- items - Value MUST be an object and not an array. Inline or referenced schema MUST be of a [Schema Object](#schemaObject) and not a standard JSON Schema. `items` MUST be present if the `type` is `array`.
- properties - Property definitions MUST be a [Schema Object](#schemaObject) and not a standard JSON Schema (inline or referenced).
- additionalProperties - Value can be boolean or object. Inline or referenced schema MUST be of a [Schema Object](#schemaObject) and not a standard JSON Schema.
- description - [CommonMark syntax](http://spec.commonmark.org/) can be used for rich text representation.
- format - See [Data Type Formats](#dataTypeFormat) for further details. While relying on JSON Schema's defined formats, the AsyncAPI Specification offers a few additional predefined formats.
- default - The default value represents what would be assumed by the consumer of the input as the value of the schema if one is not provided. Unlike JSON Schema, the value MUST conform to the defined type for the Schema Object defined at the same level. For example, of `type` is `string`, then `default` can be `"foo"` but cannot be `1`.

Alternatively, any time a Schema Object can be used, a [Reference Object](#referenceObject) can be used in its place. This allows referencing definitions in place of defining them inline.

Additional properties defined by the JSON Schema specification that are not mentioned here are strictly unsupported.

Other than the JSON Schema subset fields, the following fields MAY be used for further schema documentation:

##### Fixed Fields
Field Name | Type | Description
---|:---:|---
<a name="schemaObjectNullable"></a>nullable | `boolean` | Allows sending a `null` value for the defined schema. Default value is `false`.
<a name="schemaObjectDiscriminator"></a>discriminator | `string` | Adds support for polymorphism. The discriminator is the schema property name that is used to differentiate between other schema that inherit this schema. The property name used MUST be defined at this schema and it MUST be in the `required` property list. When used, the value MUST be the name of this schema or any schema that inherits it. See [Composition and Inheritance](#schemaComposition) for more details.
<a name="schemaObjectReadOnly"></a>readOnly | `boolean` | Relevant only for Schema `"properties"` definitions. Declares the property as "read only". This means that it MAY be sent as part of a response but SHOULD NOT be sent as part of the request. If property is marked as `readOnly` being `true` and is in the `required` list, the `required` will take effect on the response only. A property MUST NOT be marked as both `readOnly` and `writeOnly` being `true`. Default value is `false`.
<a name="schemaObjectWriteOnly"></a>writeOnly | `boolean` | Relevant only for Schema `"properties"` definitions. Declares the property as "write only". This means that it MAY be sent as part of a request but SHOULD NOT be sent as part of the response. If property is marked as `writeOnly` being `true` and is in the `required` list, the `required` will take effect on the request only. A property MUST NOT be marked as both `readOnly` and `writeOnly` being `true`. Default value is `false`.
<a name="schemaObjectXml"></a>xml | [XML Object](#xmlObject) | This MAY be used only on properties schemas. It has no effect on root schemas. Adds Additional metadata to describe the XML representation format of this property.
<a name="schemaObjectExternalDocs"></a>externalDocs | [External Documentation Object](#externalDocumentationObject) | Additional external documentation for this schema. 
<a name="schemaObjectExample"></a>example | Any | A free-form property to include an example of an instance for this schema. To represent examples that cannot naturally represented in JSON or YAML, a string value can be used to contain the example with escaping where necessary.
<a name="schemaObjectDeprecated"></a> deprecated | `boolean` | Specifies that a schema is deprecated and SHOULD be transitioned out of usage. Default value is `false`.

This object can be extended with [Specification Extensions](#specificationExtensions). 

###### <a name="schemaComposition"></a>Composition and Inheritance (Polymorphism)

The AsyncAPI Specification allows combining and extending model definitions using the `allOf` property of JSON Schema, in effect offering model composition.
`allOf` takes in an array of object definitions that are validated *independently* but together compose a single object. 

While composition offers model extensibility, it does not imply a hierarchy between the models.
To support polymorphism, AsyncAPI Specification adds the support of the `discriminator` field.
When used, the `discriminator` will be the name of the property used to decide which schema definition is used to validate the structure of the model.
As such, the `discriminator` field MUST be a required field.
There are are two ways to define the value of a discriminator for an inheriting instance.
- Use the schema's name.
- Override the schema's name by overriding the property with a new value. If exists, this takes precedence over the schema's name.
As such, inline schema definitions, which do not have a given id, *cannot* be used in polymorphism.

###### XML Modeling

The [xml](#schemaObjectXml) property allows extra definitions when translating the JSON definition to XML.
The [XML Object](#xmlObject) contains additional information about the available options.

##### Schema Object Examples

###### Primitive Sample

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
      "$ref": "#/components/schemas/Address"
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
    $ref: '#/components/schemas/Address'
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
    "$ref": "#/components/schemas/ComplexModel"
  }
}
```

```yaml
type: object
additionalProperties:
  $ref: '#/components/schemas/ComplexModel'
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

###### Models with Composition

```json
{
  "schemas": {
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
          "$ref": "#/components/schemas/ErrorModel"
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
schemas:
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
    - $ref: '#/components/schemas/ErrorModel'
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
  "schemas": {
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
      "description": "A representation of a cat. Note that `Cat` will be used as the discriminator value.",
      "allOf": [
        {
          "$ref": "#/components/schemas/Pet"
        },
        {
          "type": "object",
          "properties": {
            "huntingSkill": {
              "type": "string",
              "description": "The measured skill for hunting",
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
      "description": "A representation of a dog. Note that `Dog` will be used as the discriminator value.",
      "allOf": [
        {
          "$ref": "#/components/schemas/Pet"
        },
        {
          "type": "object",
          "properties": {
            "packSize": {
              "type": "integer",
              "format": "int32",
              "description": "the size of the pack the dog is from",
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
schemas:
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
  Cat:  ## "Cat" will be used as the discriminator value
    description: A representation of a cat
    allOf:
    - $ref: '#/components/schemas/Pet'
    - type: object
      properties:
        huntingSkill:
          type: string
          description: The measured skill for hunting
          enum:
          - clueless
          - lazy
          - adventurous
          - aggressive
      required:
      - huntingSkill
  Dog:  ## "Dog" will be used as the discriminator value
    description: A representation of a dog
    allOf:
    - $ref: '#/components/schemas/Pet'
    - type: object
      properties:
        packSize:
          type: integer
          format: int32
          description: the size of the pack the dog is from
          minimum: 0
      required:
      - packSize
```

#### <a name="xmlObject"></a>XML Object

A metadata object that allows for more fine-tuned XML model definitions.

When using arrays, XML element names are *not* inferred (for singular/plural forms) and the `name` property SHOULD be used to add that information.
See examples for expected behavior.

##### Fixed Fields
Field Name | Type | Description
---|:---:|---
<a name="xmlObjectName"></a>name | `string` | Replaces the name of the element/attribute used for the described schema property. When defined within `items`, it will affect the name of the individual XML elements within the list. When defined alongside `type` being `array` (outside the `items`), it will affect the wrapping element and only if `wrapped` is `true`. If `wrapped` is `false`, it will be ignored.
<a name="xmlObjectNamespace"></a>namespace | `string` | The URL of the namespace definition. Value SHOULD be in the form of a URL.
<a name="xmlObjectPrefix"></a>prefix | `string` | The prefix to be used for the [name](#xmlObjectName).
<a name="xmlObjectAttribute"></a>attribute | `boolean` | Declares whether the property definition translates to an attribute instead of an element. Default value is `false`.
<a name="xmlObjectWrapped"></a>wrapped | `boolean` | MAY be used only for an array definition. Signifies whether the array is wrapped (for example, `<books><book/><book/></books>`) or unwrapped (`<book/><book/>`). Default value is `false`. The definition takes effect only when defined alongside `type` being `array` (outside the `items`).

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

Basic string array property ([`wrapped`](#xmlObjectWrapped) is `false` by default):

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
          "namespace": "http://example.com/schema/sample",
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
        namespace: http://example.com/schema/sample
        prefix: sample
```

```xml
<Person id="123">
    <sample:name xmlns:sample="http://example.com/schema/sample">example</sample:name>
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
    name: aliens
    wrapped: true
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
<a name="infoExtensions"></a>^x- | Any | Allows extensions to the AsyncAPI Schema. The field name MUST begin with `x-`, for example, `x-internal-id`. The value can be `null`, a primitive, an array or an object. Can have any valid JSON format value.

The extensions may or may not be supported by the available tooling, but those may be extended as well to add requested support (if tools are internal or open-sourced).

### <a name="dataTypeFormat"></a>Data Type Formats

Primitives have an optional modifier property: `format`.
The AsyncAPI specification uses several known formats to more finely define the data type being used.
However, the `format` property is an open `string`-valued property, and can have any value to support documentation needs.
Formats such as `"email"`, `"uuid"`, etc., can be used even though they are not defined by this specification.
Types that are not accompanied by a `format` property follow their definition from the JSON Schema.
Tools that do not recognize a specific `format` MAY default back to the `type` alone, as if the `format` was not specified.

The formats defined by the AsyncAPI Specification are:


Common Name | `type` | [`format`](#dataTypeFormat) | Comments
----------- | ------ | -------- | --------
integer | `integer` | `int32` | signed 32 bits
long | `integer` | `int64` | signed 64 bits
float | `number` | `float` | |
double | `number` | `double` | |
string | `string` | | |
byte | `string` | `byte` | base64 encoded characters
binary | `string` | `binary` | any sequence of octets
boolean | `boolean` | | |
date | `string` | `date` | As defined by `full-date` - [RFC3339](http://xml2rfc.ietf.org/public/rfc/html/rfc3339.html#anchor14)
dateTime | `string` | `date-time` | As defined by `date-time` - [RFC3339](http://xml2rfc.ietf.org/public/rfc/html/rfc3339.html#anchor14)
password | `string` | `password` | Used to hint UIs the input needs to be obscured.
