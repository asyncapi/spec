# AsyncAPI Specification

#### Disclaimer

Part of this content has been taken from the great work done by the folks at the [OpenAPI Initiative](https://openapis.org). Mainly because **it's a great work** and we want to keep as much compatibility as possible with the [OpenAPI Specification](https://github.com/OAI/OpenAPI-Specification).

#### Version 2.1.0

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [RFC 2119](http://www.ietf.org/rfc/rfc2119.txt).

The AsyncAPI Specification is licensed under [The Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0.html).

## Introduction

The AsyncAPI Specification is a project used to describe and document message-driven APIs in a machine-readable format. It’s protocol-agnostic, so you can use it for APIs that work over any protocol (e.g., AMQP, MQTT, WebSockets, Kafka, STOMP, HTTP, Mercure, etc).

The AsyncAPI Specification defines a set of files required to describe such an API.
These files can then be used to create utilities, such as documentation, integration and/or testing tools.

The file(s) MUST describe the operations an [application](#definitionsApplication) accepts. For instance, consider the following AsyncAPI definition snippet:

```yaml
user/signedup:
  subscribe:
    $ref: "#/components/messages/userSignUp"
```

It means that the [application](#definitionsApplication) allows [consumers](#definitionsConsumer) to subscribe to the `user/signedup` [channel](#definitionsChannel) to receive userSignUp [messages](#definitionsMessage) produced by the application.

**The AsyncAPI specification does not assume any kind of software topology, architecture or pattern.** Therefore, a server MAY be a message broker, a web server or any other kind of computer program capable of sending and/or receiving data. However, AsyncAPI offers a mechanism called "bindings" that aims to help with more specific information about the protocol.

## Table of Contents
<!-- TOC depthFrom:2 depthTo:4 withLinks:1 updateOnSave:0 orderedList:0 -->

- [Definitions](#definitions)
  - [Application](#definitionsApplication)
  - [Producer](#definitionsProducer)
  - [Consumer](#definitionsConsumer)
  - [Message](#definitionsMessage)
  - [Channel](#definitionsChannel)
  - [Protocol](#definitionsProtocol)
- [Specification](#specification)
	- [Format](#format)
	- [File Structure](#file-structure)
	- [Schema](#schema)
      - [AsyncAPI Object](#A2SObject)
      - [AsyncAPI Version String](#A2SVersionString)
      - [Identifier](#A2SIdString)
      - [Info Object](#infoObject)
      - [Contact Object](#contactObject)
      - [License Object](#licenseObject)
      - [Servers Object](#serversObject)
      - [Server Object](#serverObject)  
      - [Server Variable Object](#serverVariableObject)
      - [Default Content Type](#defaultContentTypeString)  
      - [Channels Object](#channelsObject)
      - [Channel Item Object](#channelItemObject)
      - [Operation Object](#operationObject)
      - [Operation Trait Object](#operationTraitObject)
      - [Message Object](#messageObject)
      - [Message Trait Object](#messageTraitObject)
      - [Tags Object](#tagsObject)
      - [Tag Object](#tag-object)
      - [External Documentation Object](#externalDocumentationObject)
      - [Components Object](#componentsObject)
      - [Reference Object](#referenceObject)
      - [Schema Object](#schemaObject)
      - [Security Scheme Object](#securitySchemeObject)
      - [Security Requirement Object](#security-requirement-object)
      - [OAuth Flows Object](#oauth-flows-object)  
      - [OAuth Flow Object](#oauth-flow-object)
      - [Server Bindings Object](#serverBindingsObject)
      - [Parameters Object](#parametersObject)
      - [Parameter Object](#parameterObject)
      - [Channel Bindings Object](#channelBindingsObject)
      - [Operation Bindings Object](#operationBindingsObject)
      - [Message Bindings Object](#messageBindingsObject)
      - [Correlation ID Object](#correlationIdObject)
      - [Specification Extensions](#specificationExtensions)

<!-- /TOC -->

## <a name="definitions"></a>Definitions

#### <a name="definitionsApplication"></a>Application
An application is any kind of computer program or a group of them. It MUST be a [producer](#definitionsProducer), a [consumer](#definitionsConsumer) or both. An application MAY be a microservice, IoT device (sensor), mainframe process, etc. An application MAY be written in any number of different programming languages as long as they support the selected [protocol](#definitionsProtocol). An application MUST also use a protocol supported by the server in order to connect and exchange [messages](#definitionsMessage). 

#### <a name="definitionsProducer"></a>Producer
A producer is a type of application, connected to a server, that is creating [messages](#definitionsMessage) and addressing them to [channels](#definitionsChannel). A producer MAY be publishing to multiple channels depending on the server, protocol, and use-case pattern.

#### <a name="definitionsConsumer"></a>Consumer
A consumer is a type of application, connected to a server via a supported [protocol](#definitionsProtocol), that is consuming [messages](#definitionsMessage) from [channels](#definitionsChannel). A consumer MAY be consuming from multiple channels depending on the server, protocol, and the use-case pattern.

#### <a name="definitionsMessage"></a>Message
A message is the mechanism by which information is exchanged via a channel between servers and applications. A message MUST contain a payload and MAY also contain headers. The headers MAY be subdivided into [protocol](#definitionsProtocol)-defined headers and header properties defined by the application which can act as supporting metadata. The payload contains the data, defined by the application, which MUST be serialized into a format (JSON, XML, Avro, binary, etc.). Since a message is a generic mechanism, it can support multiple interaction patterns such as event, command, request, or response. 

#### <a name="definitionsChannel"></a>Channel
A channel is an addressable component, made available by the server, for the organization of [messages](#definitionsMessage). [Producer](#definitionsProducer) applications send messages to channels and [consumer](#definitionsConsumer) applications consume messages from channels. Servers MAY support many channel instances, allowing messages with different content to be addressed to different channels. Depending on the server implementation, the channel MAY be included in the message via protocol-defined headers.

#### <a name="definitionsProtocol"></a>Protocol
A protocol is the mechanism (wireline protocol or API) by which [messages](#definitionsMessage) are exchanged between the application and the [channel](#definitionsChannel). Example protocols include, but are not limited to, AMQP, HTTP, JMS, Kafka, MQTT, STOMP, Mercure, WebSocket.  

#### <a name="definitionsBindings"></a>Bindings
A "binding" (or "protocol binding") is a mechanism to define protocol-specific information. Therefore, a protocol binding MUST define protocol-specific information only. 

## <a name="specification"></a>Specification

### <a name="format"></a>Format

The files describing the message-driven API in accordance with the AsyncAPI Specification are represented as JSON objects and conform to the JSON standards.
YAML, being a superset of JSON, can be used as well to represent a A2S (AsyncAPI Specification) file.

For example, if a field is said to have an array value, the JSON array representation will be used:

```yaml
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

### <a name="file-structure"></a>File Structure

The A2S representation of the API is made of a single file.
However, parts of the definitions can be split into separate files, at the discretion of the user.
This is applicable for `$ref` fields in the specification as follows from the [JSON Schema](https://json-schema.org/understanding-json-schema/structuring.html) definitions.

By convention, the AsyncAPI Specification (A2S) file is named `asyncapi.json` or `asyncapi.yaml`.

### <a name="schema"></a>Schema

#### <a name="A2SObject"></a>AsyncAPI Object

This is the root document object for the API specification.
It combines resource listing and API declaration together into one document.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a name="A2SAsyncAPI"></a>asyncapi | [AsyncAPI Version String](#A2SVersionString) | **Required.** Specifies the AsyncAPI Specification version being used. It can be used by tooling Specifications and clients to interpret the version. The structure shall be `major`.`minor`.`patch`, where `patch` versions _must_ be compatible with the existing `major`.`minor` tooling. Typically patch versions will be introduced to address errors in the documentation, and tooling should typically be compatible with the corresponding `major`.`minor` (1.0.*). Patch versions will correspond to patches of this document.
<a name="A2SId"></a>id | [Identifier](#A2SIdString) | Identifier of the [application](#definitionsApplication) the AsyncAPI document is defining.
<a name="A2SInfo"></a>info | [Info Object](#infoObject) | **Required.** Provides metadata about the API. The metadata can be used by the clients if needed.
<a name="A2SServers"></a>servers | [Servers Object](#serversObject) | Provides connection details of servers.
<a name="A2SDefaultContentType"></a>defaultContentType | [Default Content Type](#defaultContentTypeString) | Default content type to use when encoding/decoding a message's payload.
<a name="A2SChannels"></a>channels | [Channels Object](#channelsObject) | **Required** The available channels and messages for the API.
<a name="A2SComponents"></a>components | [Components Object](#componentsObject) | An element to hold various schemas for the specification.
<a name="A2STags"></a>tags | [Tags Object](#tagsObject) | A list of tags used by the specification with additional metadata. Each tag name in the list MUST be unique.
<a name="A2SExternalDocs"></a>externalDocs | [External Documentation Object](#externalDocumentationObject) | Additional external documentation.


This object can be extended with [Specification Extensions](#specificationExtensions).

#### <a name="A2SVersionString"></a>AsyncAPI Version String

The version string signifies the version of the AsyncAPI Specification that the document complies to.
The format for this string _must_ be `major`.`minor`.`patch`.  The `patch` _may_ be suffixed by a hyphen and extra alphanumeric characters.

A `major`.`minor` shall be used to designate the AsyncAPI Specification version, and will be considered compatible with the AsyncAPI Specification specified by that `major`.`minor` version.
The patch version will not be considered by tooling, making no distinction between `1.0.0` and `1.0.1`.

In subsequent versions of the AsyncAPI Specification, care will be given such that increments of the `minor` version should not interfere with operations of tooling developed to a lower minor version. Thus a hypothetical `1.1.0` specification should be usable with tooling designed for `1.0.0`.

#### <a name="A2SIdString"></a>Identifier

This field represents a unique universal identifier of the [application](#definitionsApplication) the AsyncAPI document is defining. It must conform to the URI format, according to [RFC3986](http://tools.ietf.org/html/rfc3986).

It is RECOMMENDED to use a [URN](https://tools.ietf.org/html/rfc8141) to globally and uniquely identify the application during long periods of time, even after it becomes unavailable or ceases to exist.

###### Examples

```json
{
  "id": "urn:com:smartylighting:streetlights:server"
}
```

```yaml
id: 'urn:com:smartylighting:streetlights:server'
```

```json
{
  "id": "https://github.com/smartylighting/streetlights-server"
}
```

```yaml
id: 'https://github.com/smartylighting/streetlights-server'
```

#### <a name="infoObject"></a>Info Object

The object provides metadata about the API.
The metadata can be used by the clients if needed.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a name="infoObjectTitle"></a>title | `string` | **Required.** The title of the application.
<a name="infoObjectVersion"></a>version | `string` | **Required** Provides the version of the application API (not to be confused with the specification version).
<a name="infoObjectDescription"></a>description | `string` | A short description of the application. [CommonMark syntax](http://spec.commonmark.org/) can be used for rich text representation.
<a name="infoObjectTermsOfService"></a>termsOfService | `string` | A URL to the Terms of Service for the API. MUST be in the format of a URL.
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

#### <a name="serversObject"></a>Servers Object

The Servers Object is a map of [Server Objects](#serverObject).

##### Patterned Fields

Field Pattern | Type | Description
---|:---:|---
<a name="serversObjectServer"></a>`^[A-Za-z0-9_\-]+$` | [Server Object](#serverObject) | The definition of a server this application MAY connect to.

##### Servers Object Example

```json
{
  "production": {
    "url": "development.gigantic-server.com",
    "description": "Development server",
    "protocol": "kafka",
    "protocolVersion": "1.0.0"
  }
}
```

```yaml
production:
  url: development.gigantic-server.com
  description: Development server
  protocol: kafka
  protocolVersion: '1.0.0'
```


#### <a name="serverObject"></a>Server Object

An object representing a message broker, a server or any other kind of computer program capable of sending and/or receiving data. This object is used to capture details such as URIs, protocols and security configuration. Variable substitution can be used so that some details, for example usernames and passwords, can be injected by code generation tools.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a name="serverObjectUrl"></a>url | `string` | **REQUIRED**. A URL to the target host.  This URL supports Server Variables and MAY be relative, to indicate that the host location is relative to the location where the AsyncAPI document is being served. Variable substitutions will be made when a variable is named in `{`brackets`}`.
<a name="serverObjectProtocol"></a>protocol | `string` | **REQUIRED**. The protocol this URL supports for connection. Supported protocol include, but are not limited to: `amqp`, `amqps`, `http`, `https`, `ibmmq`, `jms`, `kafka`, `kafka-secure`, `mqtt`, `secure-mqtt`, `stomp`, `stomps`, `ws`, `wss`, `mercure`.
<a name="serverObjectProtocolVersion"></a>protocolVersion | `string` | The version of the protocol used for connection. For instance: AMQP `0.9.1`, HTTP `2.0`, Kafka `1.0.0`, etc.
<a name="serverObjectDescription"></a>description | `string` | An optional string describing the host designated by the URL. [CommonMark syntax](http://spec.commonmark.org/) MAY be used for rich text representation.
<a name="serverObjectVariables"></a>variables | Map[`string`, [Server Variable Object](#serverVariableObject)] | A map between a variable name and its value.  The value is used for substitution in the server's URL template.
<a name="serverObjectSecurity"></a>security | [[Security Requirement Object](#securityRequirementObject)] | A declaration of which security mechanisms can be used with this server. The list of values includes alternative security requirement objects that can be used. Only one of the security requirement objects need to be satisfied to authorize a connection or operation.
<a name="serverObjectBindings"></a>bindings | [Server Bindings Object](#serverBindingsObject) \| [Reference Object](#referenceObject) | A map where the keys describe the name of the protocol and the values describe protocol-specific definitions for the server.

This object MAY be extended with [Specification Extensions](#specificationExtensions).

##### Server Object Example

A single server would be described as:

```json
{
  "url": "development.gigantic-server.com",
  "description": "Development server",
  "protocol": "kafka",
  "protocolVersion": "1.0.0"
}
```

```yaml
url: development.gigantic-server.com
description: Development server
protocol: kafka
protocolVersion: '1.0.0'
```

The following shows how multiple servers can be described, for example, at the AsyncAPI Object's [`servers`](#A2SServers):

```json
{
  "servers": {
    "development": {
      "url": "development.gigantic-server.com",
      "description": "Development server",
      "protocol": "amqp",
      "protocolVersion": "0.9.1"
    },
    "staging": {
      "url": "staging.gigantic-server.com",
      "description": "Staging server",
      "protocol": "amqp",
      "protocolVersion": "0.9.1"
    },
    "production": {
      "url": "api.gigantic-server.com",
      "description": "Production server",
      "protocol": "amqp",
      "protocolVersion": "0.9.1"
    }
  }
}
```

```yaml
servers:
  development:
    url: development.gigantic-server.com
    description: Development server
    protocol: amqp
    protocolVersion: 0.9.1
  staging:
    url: staging.gigantic-server.com
    description: Staging server
    protocol: amqp
    protocolVersion: 0.9.1
  production:
    url: api.gigantic-server.com
    description: Production server
    protocol: amqp
    protocolVersion: 0.9.1
```

The following shows how variables can be used for a server configuration:

```json
{
  "servers": {
    "production": {
      "url": "{username}.gigantic-server.com:{port}/{basePath}",
      "description": "The production API server",
      "protocol": "secure-mqtt",
      "variables": {
        "username": {
          "default": "demo",
          "description": "This value is assigned by the service provider, in this example `gigantic-server.com`"
        },
        "port": {
          "enum": [
            "8883",
            "8884"
          ],
          "default": "8883"
        }
      }
    }
  }
}
```

```yaml
servers:
  production:
    url: '{username}.gigantic-server.com:{port}/{basePath}'
    description: The production API server
    protocol: secure-mqtt
    variables:
      username:
        # note! no enum here means it is an open value
        default: demo
        description: This value is assigned by the service provider, in this example `gigantic-server.com`
      port:
        enum:
          - '8883'
          - '8884'
        default: '8883'
```


#### <a name="serverVariableObject"></a>Server Variable Object

An object representing a Server Variable for server URL template substitution.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a name="serverVariableObjectEnum"></a>enum | [`string`] | An enumeration of string values to be used if the substitution options are from a limited set.
<a name="serverVariableObjectDefault"></a>default | `string` | The default value to use for substitution, and to send, if an alternate value is _not_ supplied.
<a name="serverVariableObjectDescription"></a>description | `string` | An optional description for the server variable. [CommonMark syntax](http://spec.commonmark.org/) MAY be used for rich text representation.
<a name="serverVariableObjectExamples"></a>examples | [`string`] | An array of examples of the server variable.

This object MAY be extended with [Specification Extensions](#specificationExtensions).





#### <a name="defaultContentTypeString"></a>Default Content Type

A string representing the default content type to use when encoding/decoding a message's payload. The value MUST be a specific media type (e.g. `application/json`). This value MUST be used by schema parsers when the [contentType](#messageObjectContentType) property is omitted.

In case a message can't be encoded/decoded using this value, schema parsers MUST use their default content type.

##### Default Content Type Example

```json
{
  "defaultContentType": "application/json"
}
```

```yaml
defaultContentType: application/json
```






#### <a name="channelsObject"></a>Channels Object

Holds the relative paths to the individual channel and their operations. Channel paths are relative to servers.

Channels are also known as "topics", "routing keys", "event types" or "paths".

##### Patterned Fields

Field Pattern | Type | Description
---|:---:|---
<a name="channelsObjectChannel"></a>{channel} | [Channel Item Object](#channelItemObject) | A relative path to an individual channel. The field name MUST be in the form of a [RFC 6570 URI template](https://tools.ietf.org/html/rfc6570). Query parameters and fragments SHALL NOT be used, instead use [bindings](#channelBindingsObject) to define them.

##### Channels Object Example

```json
{
  "user/signedup": {
    "subscribe": {
      "$ref": "#/components/messages/userSignedUp"
    }
  }
}
```

```yaml
user/signedup:
  subscribe:
    $ref: "#/components/messages/userSignedUp"
```




#### <a name="channelItemObject"></a>Channel Item Object

Describes the operations available on a single channel.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a name="channelItemObjectRef"></a>$ref | `string` | Allows for an external definition of this channel item. The referenced structure MUST be in the format of a [Channel Item Object](#channelItemObject). If there are conflicts between the referenced definition and this Channel Item's definition, the behavior is *undefined*.
<a name="channelItemObjectDescription"></a>description | `string` | An optional description of this channel item. [CommonMark syntax](http://spec.commonmark.org/) can be used for rich text representation.
<a name="channelItemObjectSubscribe"></a>subscribe | [Operation Object](#operationObject) | A definition of the SUBSCRIBE operation, which defines the messages produced by the application and sent to the channel.
<a name="channelItemObjectPublish"></a>publish | [Operation Object](#operationObject) | A definition of the PUBLISH operation, which defines the messages consumed by the application from the channel.
<a name="channelItemObjectParameters"></a>parameters | [Parameters Object](#parametersObject) | A map of the parameters included in the channel name. It SHOULD be present only when using channels with expressions (as defined by [RFC 6570 section 2.2](https://tools.ietf.org/html/rfc6570#section-2.2)).
<a name="channelItemObjectBindings"></a>bindings | [Channel Bindings Object](#channelBindingsObject) \| [Reference Object](#referenceObject) | A map where the keys describe the name of the protocol and the values describe protocol-specific definitions for the channel.

This object can be extended with [Specification Extensions](#specificationExtensions).

##### Channel Item Object Example

```json
{
  "description": "This channel is used to exchange messages about users signing up",
  "subscribe": {
    "summary": "A user signed up.",
    "message": {
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
  },
  "bindings": {
    "amqp": {
      "is": "queue",
      "queue": {
        "exclusive": true
      }
    }
  }
}
```

```yaml
description: This channel is used to exchange messages about users signing up
subscribe:
  summary: A user signed up.
  message:
    description: A longer description of the message
    payload:
      type: object
      properties:
        user:
          $ref: "#/components/schemas/user"
        signup:
bindings:
  amqp:
    is: queue
    queue:
      exclusive: true
```

Using `oneOf` to specify multiple messages per operation:

```json
{
  "subscribe": {
    "message": {
      "oneOf": [
        { "$ref": "#/components/messages/signup" },
        { "$ref": "#/components/messages/login" }
      ]
    }
  }
}
```

```yaml
subscribe:
  message:
    oneOf:
      - $ref: '#/components/messages/signup'
      - $ref: '#/components/messages/login'
```







#### <a name="operationObject"></a>Operation Object

Describes a publish or a subscribe operation. This provides a place to document how and why messages are sent and received.

For example, an operation might describe a chat application use case where a user sends a text message to a group. A publish operation describes messages that are received by the chat application, whereas a subscribe operation describes messages that are sent by the chat application.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a name="operationObjectOperationId"></a>operationId | `string` | Unique string used to identify the operation. The id MUST be unique among all operations described in the API. The operationId value is **case-sensitive**. Tools and libraries MAY use the operationId to uniquely identify an operation, therefore, it is RECOMMENDED to follow common programming naming conventions.
<a name="operationObjectSummary"></a>summary | `string` | A short summary of what the operation is about.
<a name="operationObjectDescription"></a>description | `string` | A verbose explanation of the operation. [CommonMark syntax](http://spec.commonmark.org/) can be used for rich text representation.
<a name="operationObjectTags"></a>tags | [Tags Object](#tagsObject) | A list of tags for API documentation control. Tags can be used for logical grouping of operations.
<a name="operationObjectExternalDocs"></a>externalDocs | [External Documentation Object](#externalDocumentationObject) | Additional external documentation for this operation.
<a name="operationObjectBindings"></a>bindings | [Operation Bindings Object](#operationBindingsObject) \| [Reference Object](#referenceObject) | A map where the keys describe the name of the protocol and the values describe protocol-specific definitions for the operation.
<a name="operationObjectTraits"></a>traits | [[Operation Trait Object](#operationTraitObject) &#124; [Reference Object](#referenceObject) ] | A list of traits to apply to the operation object. Traits MUST be merged into the operation object using the [JSON Merge Patch](https://tools.ietf.org/html/rfc7386) algorithm in the same order they are defined here.
<a name="operationObjectMessage"></a>message | [[Message Object](#messageObject) &#124; [Reference Object](#referenceObject)] | A definition of the message that will be published or received on this channel. `oneOf` is allowed here to specify multiple messages, however, **a message MUST be valid only against one of the referenced message objects.**

This object can be extended with [Specification Extensions](#specificationExtensions).

##### Operation Object Example

```json
{
  "operationId": "registerUser",
  "summary": "Action to sign a user up.",
  "description": "A longer description",
  "tags": [
    { "name": "user" },
    { "name": "signup" },
    { "name": "register" }
  ],
  "message": {
    "headers": {
      "type": "object",
      "properties": {
        "applicationInstanceId": {
          "description": "Unique identifier for a given instance of the publishing application",
          "type": "string"
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
  },
  "bindings": {
    "amqp": {
      "ack": false
    },
  },
  "traits": [
    { "$ref": "#/components/operationTraits/kafka" }
  ]
}
```

```yaml
operationId: registerUser
summary: Action to sign a user up.
description: A longer description
tags:
  - name: user
  - name: signup
  - name: register
message:
  headers:
    type: object
    properties:
      applicationInstanceId:
        description: Unique identifier for a given instance of the publishing application
        type: string
  payload:
    type: object
    properties:
      user:
        $ref: "#/components/schemas/userCreate"
      signup:
        $ref: "#/components/schemas/signup"
bindings:
  amqp:
    ack: false
traits:
  - $ref: "#/components/operationTraits/kafka"
```




#### <a name="operationTraitObject"></a>Operation Trait Object

Describes a trait that MAY be applied to an [Operation Object](#operationObject). This object MAY contain any property from the [Operation Object](#operationObject), except `message` and `traits`.

If you're looking to apply traits to a message, see the [Message Trait Object](#messageTraitObject).

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a name="operationTraitObjectOperationId"></a>operationId | `string` | Unique string used to identify the operation. The id MUST be unique among all operations described in the API. The operationId value is **case-sensitive**. Tools and libraries MAY use the operationId to uniquely identify an operation, therefore, it is RECOMMENDED to follow common programming naming conventions.
<a name="operationTraitObjectSummary"></a>summary | `string` | A short summary of what the operation is about.
<a name="operationTraitObjectDescription"></a>description | `string` | A verbose explanation of the operation. [CommonMark syntax](http://spec.commonmark.org/) can be used for rich text representation.
<a name="operationTraitObjectTags"></a>tags | [Tags Object](#tagsObject) | A list of tags for API documentation control. Tags can be used for logical grouping of operations.
<a name="operationTraitObjectExternalDocs"></a>externalDocs | [External Documentation Object](#externalDocumentationObject) | Additional external documentation for this operation.
<a name="operationTraitObjectBindings"></a>bindings | [Operation Bindings Object](#operationBindingsObject) \| [Reference Object](#referenceObject) | A map where the keys describe the name of the protocol and the values describe protocol-specific definitions for the operation.

This object can be extended with [Specification Extensions](#specificationExtensions).

##### Operation Trait Object Example

```json
{
  "bindings": {
    "amqp": {
      "ack": false
    }
  }
}
```

```yaml
bindings:
  amqp:
    ack: false
```




#### <a name="parametersObject"></a>Parameters Object

Describes a map of parameters included in a channel name.

This map MUST contain all the parameters used in the parent channel name.

##### Patterned Fields

Field Pattern | Type | Description
---|:---:|---
<a name="parametersObjectName"></a>`^[A-Za-z0-9_\-]+$` | [Parameter Object](#parameterObject) &#124; [Reference Object](#referenceObject) | The key represents the name of the parameter. It MUST match the parameter name used in the parent channel name.

##### Parameters Object Example

```json
{
  "user/{userId}/signup": {
    "parameters": {
      "userId": {
        "description": "Id of the user.",
        "schema": {
          "type": "string"
        }
      }
    },
    "subscribe": {
      "$ref": "#/components/messages/userSignedUp"
    }
  }
}
```

```yaml
user/{userId}/signup:
  parameters:
    userId:
      description: Id of the user.
      schema:
        type: string
  subscribe:
    $ref: "#/components/messages/userSignedUp"
```





#### <a name="parameterObject"></a>Parameter Object

Describes a parameter included in a channel name.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a name="parameterObjectDescription"></a>description | `string` | A verbose explanation of the parameter. [CommonMark syntax](http://spec.commonmark.org/) can be used for rich text representation.
<a name="parameterObjectSchema"></a>schema | [Schema Object](#schemaObject) \| [Reference Object](#referenceObject) | Definition of the parameter.
location | `string` | A [runtime expression](#runtimeExpression) that specifies the location of the parameter value. Even when a definition for the target field exists, it MUST NOT be used to validate this parameter but, instead, the `schema` property MUST be used.

This object can be extended with [Specification Extensions](#specificationExtensions).

##### Parameter Object Example

```json
{
  "user/{userId}/signup": {
    "parameters": {
      "userId": {
        "description": "Id of the user.",
        "schema": {
          "type": "string"
        },
        "location": "$message.payload#/user/id"
      }
    },
    "subscribe": {
      "$ref": "#/components/messages/userSignedUp"
    }
  }
}
```

```yaml
user/{userId}/signup:
  parameters:
    userId:
      description: Id of the user.
      schema:
        type: string
      location: $message.payload#/user/id
  subscribe:
    $ref: "#/components/messages/userSignedUp"
```




#### <a name="serverBindingsObject"></a>Server Bindings Object

Map describing protocol-specific definitions for a server.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a name="serverBindingsObjectHTTP"></a>`http` | [HTTP Server Binding](https://github.com/asyncapi/bindings/blob/master/http#server) | Protocol-specific information for an HTTP server.
<a name="serverBindingsObjectWebSockets"></a>`ws` | [WebSockets Server Binding](https://github.com/asyncapi/bindings/blob/master/websockets#server) | Protocol-specific information for a WebSockets server.
<a name="serverBindingsObjectKafka"></a>`kafka` | [Kafka Server Binding](https://github.com/asyncapi/bindings/blob/master/kafka#server) | Protocol-specific information for a Kafka server.
<a name="serverBindingsObjectAMQP"></a>`amqp` | [AMQP Server Binding](https://github.com/asyncapi/bindings/blob/master/amqp#server) | Protocol-specific information for an AMQP 0-9-1 server.
<a name="serverBindingsObjectAMQP1"></a>`amqp1` | [AMQP 1.0 Server Binding](https://github.com/asyncapi/bindings/blob/master/amqp1#server) | Protocol-specific information for an AMQP 1.0 server.
<a name="serverBindingsObjectMQTT"></a>`mqtt` | [MQTT Server Binding](https://github.com/asyncapi/bindings/blob/master/mqtt#server) | Protocol-specific information for an MQTT server.
<a name="serverBindingsObjectMQTT5"></a>`mqtt5` | [MQTT 5 Server Binding](https://github.com/asyncapi/bindings/blob/master/mqtt5#server) | Protocol-specific information for an MQTT 5 server.
<a name="serverBindingsObjectNATS"></a>`nats` | [NATS Server Binding](https://github.com/asyncapi/bindings/blob/master/nats#server) | Protocol-specific information for a NATS server.
<a name="serverBindingsObjectJMS"></a>`jms` | [JMS Server Binding](https://github.com/asyncapi/bindings/blob/master/jms#server) | Protocol-specific information for a JMS server.
<a name="serverBindingsObjectSNS"></a>`sns` | [SNS Server Binding](https://github.com/asyncapi/bindings/blob/master/sns#server) | Protocol-specific information for an SNS server.
<a name="serverBindingsObjectSQS"></a>`sqs` | [SQS Server Binding](https://github.com/asyncapi/bindings/blob/master/sqs#server) | Protocol-specific information for an SQS server.
<a name="serverBindingsObjectSTOMP"></a>`stomp` | [STOMP Server Binding](https://github.com/asyncapi/bindings/blob/master/stomp#server) | Protocol-specific information for a STOMP server.
<a name="serverBindingsObjectRedis"></a>`redis` | [Redis Server Binding](https://github.com/asyncapi/bindings/blob/master/redis#server) | Protocol-specific information for a Redis server.
<a name="serverBindingsObjectMercure"></a>`mercure` | [Mercure Server Binding](https://github.com/asyncapi/bindings/blob/master/mercure#server) | Protocol-specific information for a Mercure server.
<a name="serverBindingsObjectIBMMQ"></a>`ibmmq` | [IBM MQ Server Binding](https://github.com/asyncapi/bindings/blob/master/ibmmq#server-binding-object) | Protocol-specific information for an IBM MQ server.

This object can be extended with [Specification Extensions](#specificationExtensions).



#### <a name="channelBindingsObject"></a>Channel Bindings Object

Map describing protocol-specific definitions for a channel.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a name="channelBindingsObjectHTTP"></a>`http` | [HTTP Channel Binding](https://github.com/asyncapi/bindings/blob/master/http/README.md#channel) | Protocol-specific information for an HTTP channel.
<a name="channelBindingsObjectWebSockets"></a>`ws` | [WebSockets Channel Binding](https://github.com/asyncapi/bindings/blob/master/websockets/README.md#channel) | Protocol-specific information for a WebSockets channel.
<a name="channelBindingsObjectKafka"></a>`kafka` | [Kafka Channel Binding](https://github.com/asyncapi/bindings/blob/master/kafka/README.md#channel) | Protocol-specific information for a Kafka channel.
<a name="channelBindingsObjectAMQP"></a>`amqp` | [AMQP Channel Binding](https://github.com/asyncapi/bindings/blob/master/amqp/README.md#channel) | Protocol-specific information for an AMQP 0-9-1 channel.
<a name="channelBindingsObjectAMQP1"></a>`amqp1` | [AMQP 1.0 Channel Binding](https://github.com/asyncapi/bindings/blob/master/amqp1/README.md#channel) | Protocol-specific information for an AMQP 1.0 channel.
<a name="channelBindingsObjectMQTT"></a>`mqtt` | [MQTT Channel Binding](https://github.com/asyncapi/bindings/blob/master/mqtt/README.md#channel) | Protocol-specific information for an MQTT channel.
<a name="channelBindingsObjectMQTT5"></a>`mqtt5` | [MQTT 5 Channel Binding](https://github.com/asyncapi/bindings/blob/master/mqtt5#channel) | Protocol-specific information for an MQTT 5 channel.
<a name="channelBindingsObjectNATS"></a>`nats` | [NATS Channel Binding](https://github.com/asyncapi/bindings/blob/master/nats/README.md#channel) | Protocol-specific information for a NATS channel.
<a name="channelBindingsObjectJMS"></a>`jms` | [JMS Channel Binding](https://github.com/asyncapi/bindings/blob/master/jms/README.md#channel) | Protocol-specific information for a JMS channel.
<a name="channelBindingsObjectSNS"></a>`sns` | [SNS Channel Binding](https://github.com/asyncapi/bindings/blob/master/sns/README.md#channel) | Protocol-specific information for an SNS channel.
<a name="channelBindingsObjectSQS"></a>`sqs` | [SQS Channel Binding](https://github.com/asyncapi/bindings/blob/master/sqs/README.md#channel) | Protocol-specific information for an SQS channel.
<a name="channelBindingsObjectSTOMP"></a>`stomp` | [STOMP Channel Binding](https://github.com/asyncapi/bindings/blob/master/stomp/README.md#channel) | Protocol-specific information for a STOMP channel.
<a name="channelBindingsObjectRedis"></a>`redis` | [Redis Channel Binding](https://github.com/asyncapi/bindings/blob/master/redis#channel) | Protocol-specific information for a Redis channel.
<a name="channelBindingsObjectMercure"></a>`mercure` | [Mercure Channel Binding](https://github.com/asyncapi/bindings/blob/master/mercure#channel) | Protocol-specific information for a Mercure channel.
<a name="channelBindingsObjectIBMMQ"></a>`ibmmq` | [IBM MQ Channel Binding](https://github.com/asyncapi/bindings/tree/master/ibmmq#channel-binding-object) | Protocol-specific information for an IBM MQ channel.

This object can be extended with [Specification Extensions](#specificationExtensions).



#### <a name="operationBindingsObject"></a>Operation Bindings Object

Map describing protocol-specific definitions for an operation.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a name="operationBindingsObjectHTTP"></a>`http` | [HTTP Operation Binding](https://github.com/asyncapi/bindings/blob/master/http/README.md#operation) | Protocol-specific information for an HTTP operation.
<a name="operationBindingsObjectWebSockets"></a>`ws` | [WebSockets Operation Binding](https://github.com/asyncapi/bindings/blob/master/websockets/README.md#operation) | Protocol-specific information for a WebSockets operation.
<a name="operationBindingsObjectKafka"></a>`kafka` | [Kafka Operation Binding](https://github.com/asyncapi/bindings/blob/master/kafka/README.md#operation) | Protocol-specific information for a Kafka operation.
<a name="operationBindingsObjectAMQP"></a>`amqp` | [AMQP Operation Binding](https://github.com/asyncapi/bindings/blob/master/amqp/README.md#operation) | Protocol-specific information for an AMQP 0-9-1 operation.
<a name="operationBindingsObjectAMQP1"></a>`amqp1` | [AMQP 1.0 Operation Binding](https://github.com/asyncapi/bindings/blob/master/amqp1/README.md#operation) | Protocol-specific information for an AMQP 1.0 operation.
<a name="operationBindingsObjectMQTT"></a>`mqtt` | [MQTT Operation Binding](https://github.com/asyncapi/bindings/blob/master/mqtt/README.md#operation) | Protocol-specific information for an MQTT operation.
<a name="operationBindingsObjectMQTT5"></a>`mqtt5` | [MQTT 5 Operation Binding](https://github.com/asyncapi/bindings/blob/master/mqtt5/README.md#operation) | Protocol-specific information for an MQTT 5 operation.
<a name="operationBindingsObjectNATS"></a>`nats` | [NATS Operation Binding](https://github.com/asyncapi/bindings/blob/master/nats/README.md#operation) | Protocol-specific information for a NATS operation.
<a name="operationBindingsObjectJMS"></a>`jms` | [JMS Operation Binding](https://github.com/asyncapi/bindings/blob/master/jms/README.md#operation) | Protocol-specific information for a JMS operation.
<a name="operationBindingsObjectSNS"></a>`sns` | [SNS Operation Binding](https://github.com/asyncapi/bindings/blob/master/sns/README.md#operation) | Protocol-specific information for an SNS operation.
<a name="operationBindingsObjectSQS"></a>`sqs` | [SQS Operation Binding](https://github.com/asyncapi/bindings/blob/master/sqs/README.md#operation) | Protocol-specific information for an SQS operation.
<a name="operationBindingsObjectSTOMP"></a>`stomp` | [STOMP Operation Binding](https://github.com/asyncapi/bindings/blob/master/stomp/README.md#operation) | Protocol-specific information for a STOMP operation.
<a name="operationBindingsObjectRedis"></a>`redis` | [Redis Operation Binding](https://github.com/asyncapi/bindings/blob/master/redis#operation) | Protocol-specific information for a Redis operation.
<a name="operationBindingsObjectMercure"></a>`mercure` | [Mercure Operation Binding](https://github.com/asyncapi/bindings/blob/master/mercure#operation) | Protocol-specific information for a Mercure operation.

This object can be extended with [Specification Extensions](#specificationExtensions).




#### <a name="messageBindingsObject"></a>Message Bindings Object

Map describing protocol-specific definitions for a message.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a name="messageBindingsObjectHTTP"></a>`http` | [HTTP Message Binding](https://github.com/asyncapi/bindings/blob/master/http/README.md#message) | Protocol-specific information for an HTTP message, i.e., a request or a response.
<a name="messageBindingsObjectWebSockets"></a>`ws` | [WebSockets Message Binding](https://github.com/asyncapi/bindings/blob/master/websockets/README.md#message) | Protocol-specific information for a WebSockets message.
<a name="messageBindingsObjectKafka"></a>`kafka` | [Kafka Message Binding](https://github.com/asyncapi/bindings/blob/master/kafka/README.md#message) | Protocol-specific information for a Kafka message.
<a name="messageBindingsObjectAMQP"></a>`amqp` | [AMQP Message Binding](https://github.com/asyncapi/bindings/blob/master/amqp/README.md#message) | Protocol-specific information for an AMQP 0-9-1 message.
<a name="messageBindingsObjectAMQP1"></a>`amqp1` | [AMQP 1.0 Message Binding](https://github.com/asyncapi/bindings/blob/master/amqp1/README.md#message) | Protocol-specific information for an AMQP 1.0 message.
<a name="messageBindingsObjectMQTT"></a>`mqtt` | [MQTT Message Binding](https://github.com/asyncapi/bindings/blob/master/mqtt/README.md#message) | Protocol-specific information for an MQTT message.
<a name="messageBindingsObjectMQTT5"></a>`mqtt5` | [MQTT 5 Message Binding](https://github.com/asyncapi/bindings/blob/master/mqtt5/README.md#message) | Protocol-specific information for an MQTT 5 message.
<a name="messageBindingsObjectNATS"></a>`nats` | [NATS Message Binding](https://github.com/asyncapi/bindings/blob/master/nats/README.md#message) | Protocol-specific information for a NATS message.
<a name="messageBindingsObjectJMS"></a>`jms` | [JMS Message Binding](https://github.com/asyncapi/bindings/blob/master/jms/README.md#message) | Protocol-specific information for a JMS message.
<a name="messageBindingsObjectSNS"></a>`sns` | [SNS Message Binding](https://github.com/asyncapi/bindings/blob/master/sns/README.md#message) | Protocol-specific information for an SNS message.
<a name="messageBindingsObjectSQS"></a>`sqs` | [SQS Message Binding](https://github.com/asyncapi/bindings/blob/master/sqs/README.md#message) | Protocol-specific information for an SQS message.
<a name="messageBindingsObjectSTOMP"></a>`stomp` | [STOMP Message Binding](https://github.com/asyncapi/bindings/blob/master/stomp/README.md#message) | Protocol-specific information for a STOMP message.
<a name="messageBindingsObjectRedis"></a>`redis` | [Redis Message Binding](https://github.com/asyncapi/bindings/blob/master/redis#message) | Protocol-specific information for a Redis message.
<a name="messageBindingsObjectMercure"></a>`mercure` | [Mercure Message Binding](https://github.com/asyncapi/bindings/blob/master/mercure#message) | Protocol-specific information for a Mercure message.
<a name="messageBindingsObjectIBMMQ"></a>`ibmmq` | [IBM MQ Message Binding](https://github.com/asyncapi/bindings/tree/master/ibmmq#message-binding-object) | Protocol-specific information for an IBM MQ message.

This object can be extended with [Specification Extensions](#specificationExtensions).







#### <a name="messageObject"></a>Message Object

Describes a message received on a given channel and operation.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a name="messageObjectHeaders"></a>headers | [Schema Object](#schemaObject) &#124; [Reference Object](#referenceObject) | Schema definition of the application headers. Schema MUST be of type "object". It **MUST NOT** define the protocol headers.
<a name="messageObjectPayload"></a>payload | `any` | Definition of the message payload. It can be of any type but defaults to [Schema object](#schemaObject). It must match the schema format, including encoding type - e.g Avro should be inlined as either a YAML or JSON object NOT a string to be parsed as YAML or JSON.
<a name="messageObjectCorrelationId"></a>correlationId | [Correlation ID Object](#correlationIdObject) &#124; [Reference Object](#referenceObject) | Definition of the correlation ID used for message tracing or matching.
<a name="messageObjectSchemaFormat"></a>schemaFormat | `string` | A string containing the name of the schema format used to define the message payload. If omitted, implementations should parse the payload as a [Schema object](#schemaObject). When the payload is defined using a `$ref` to a remote file, it is RECOMMENDED the schema format includes the file encoding type to allow implementations to parse the file correctly. E.g., adding `+yaml` if content type is `application/vnd.apache.avro` results in `application/vnd.apache.avro+yaml`.<br/><br/>Check out the [supported schema formats table](#messageObjectSchemaFormatTable) for more information. Custom values are allowed but their implementation is OPTIONAL. A custom value MUST NOT refer to one of the schema formats listed in the [table](#messageObjectSchemaFormatTable).
<a name="messageObjectContentType"></a>contentType | `string` | The content type to use when encoding/decoding a message's payload. The value MUST be a specific media type (e.g. `application/json`). When omitted, the value MUST be the one specified on the [defaultContentType](#defaultContentTypeString) field.
<a name="messageObjectName"></a>name | `string` | A machine-friendly name for the message.
<a name="messageObjectTitle"></a>title | `string` | A human-friendly title for the message.
<a name="messageObjectSummary"></a>summary | `string` | A short summary of what the message is about.
<a name="messageObjectDescription"></a>description | `string` | A verbose explanation of the message. [CommonMark syntax](http://spec.commonmark.org/) can be used for rich text representation.
<a name="messageObjectTags"></a>tags | [Tags Object](#tagsObject) | A list of tags for API documentation control. Tags can be used for logical grouping of messages.
<a name="messageObjectExternalDocs"></a>externalDocs | [External Documentation Object](#externalDocumentationObject) | Additional external documentation for this message.
<a name="messageObjectBindings"></a>bindings | [Message Bindings Object](#messageBindingsObject) \| [Reference Object](#referenceObject) | A map where the keys describe the name of the protocol and the values describe protocol-specific definitions for the message.
<a name="messageObjectExamples"></a>examples | [Map[`string`, `any`]] | An array of key/value pairs where keys MUST be either **headers** and/or **payload**. Values MUST contain examples that validate against the [headers](#messageObjectHeaders) or [payload](#messageObjectPayload) fields, respectively. Example MAY also have the **name** and **summary** additional keys to provide respectively a machine-friendly name and a short summary of what the example is about.
<a name="messageObjectTraits"></a>traits | [[Message Trait Object](#messageTraitObject) &#124; [Reference Object](#referenceObject)] | A list of traits to apply to the message object. Traits MUST be merged into the message object using the [JSON Merge Patch](https://tools.ietf.org/html/rfc7386) algorithm in the same order they are defined here. The resulting object MUST be a valid [Message Object](#messageObject).

This object can be extended with [Specification Extensions](#specificationExtensions).

##### <a name="messageObjectSchemaFormatTable"></a>Schema formats table

The following table contains a set of values that every implementation MUST support.

Name | Allowed values | Notes
---|:---:|---
[AsyncAPI 2.1.0 Schema Object](#schemaObject) | `application/vnd.aai.asyncapi;version=2.1.0`, `application/vnd.aai.asyncapi+json;version=2.1.0`, `application/vnd.aai.asyncapi+yaml;version=2.1.0` | This is the default when a `schemaFormat` is not provided.
[JSON Schema Draft 07](http://json-schema.org/specification-links.html#draft-7) | `application/schema+json;version=draft-07`, `application/schema+yaml;version=draft-07` | 

The following table contains a set of values that every implementation is RECOMMENDED to support.

Name | Allowed values | Notes
---|:---:|---
[Avro 1.9.0 schema](https://avro.apache.org/docs/1.9.0/spec.html#schemas) | `application/vnd.apache.avro;version=1.9.0`, `application/vnd.apache.avro+json;version=1.9.0`, `application/vnd.apache.avro+yaml;version=1.9.0` |
[OpenAPI 3.0.0 Schema Object](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#schemaObject) | `application/vnd.oai.openapi;version=3.0.0`, `application/vnd.oai.openapi+json;version=3.0.0`, `application/vnd.oai.openapi+yaml;version=3.0.0` | 
[RAML 1.0 data type](https://github.com/raml-org/raml-spec/blob/master/versions/raml-10/raml-10.md/) | `application/raml+yaml;version=1.0` |


##### Message Object Example

```json
{
  "name": "UserSignup",
  "title": "User signup",
  "summary": "Action to sign a user up.",
  "description": "A longer description",
  "contentType": "application/json",
  "tags": [
    { "name": "user" },
    { "name": "signup" },
    { "name": "register" }
  ],
  "headers": {
    "type": "object",
    "properties": {
      "correlationId": {
        "description": "Correlation ID set by application",
        "type": "string"
      },
      "applicationInstanceId": {
        "description": "Unique identifier for a given instance of the publishing application",
        "type": "string"
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
  },
  "correlationId": {
    "description": "Default Correlation ID",
    "location": "$message.header#/correlationId"
  },
  "traits": [
    { "$ref": "#/components/messageTraits/commonHeaders" }
  ],
  "examples": [
    {
      "name": "SimpleSignup",
      "summary": "A simple UserSignup example message",
      "headers": {
        "correlationId": "my-correlation-id",
        "applicationInstanceId": "myInstanceId"
      },
      "payload": {
        "user": {
          "someUserKey": "someUserValue"
        },
        "signup": {
          "someSignupKey": "someSignupValue"
        }
      }
    }
  ]
}
```

```yaml
name: UserSignup
title: User signup
summary: Action to sign a user up.
description: A longer description
contentType: application/json
tags:
  - name: user
  - name: signup
  - name: register
headers:
  type: object
  properties:
    correlationId:
      description: Correlation ID set by application
      type: string
    applicationInstanceId:
      description: Unique identifier for a given instance of the publishing application
      type: string
payload:
  type: object
  properties:
    user:
      $ref: "#/components/schemas/userCreate"
    signup:
      $ref: "#/components/schemas/signup"
correlationId:
  description: Default Correlation ID
  location: $message.header#/correlationId
traits:
  - $ref: "#/components/messageTraits/commonHeaders"
examples:
  - name: SimpleSignup
    summary: A simple UserSignup example message
    headers:
      correlationId: my-correlation-id
      applicationInstanceId: myInstanceId
    payload:
      user:
        someUserKey: someUserValue
      signup:
        someSignupKey: someSignupValue
```

Example using Avro to define the payload:

```json
{
  "name": "UserSignup",
  "title": "User signup",
  "summary": "Action to sign a user up.",
  "description": "A longer description",
  "tags": [
    { "name": "user" },
    { "name": "signup" },
    { "name": "register" }
  ],
  "schemaFormat": "application/vnd.apache.avro+json;version=1.9.0",
  "payload": {
    "$ref": "path/to/user-create.avsc#/UserCreate"
  }
}
```

```yaml
name: UserSignup
title: User signup
summary: Action to sign a user up.
description: A longer description
tags:
  - name: user
  - name: signup
  - name: register
schemaFormat: 'application/vnd.apache.avro+yaml;version=1.9.0'
payload:
  $ref: 'path/to/user-create.avsc/#UserCreate'
```







#### <a name="messageTraitObject"></a>Message Trait Object

Describes a trait that MAY be applied to a [Message Object](#messageObject). This object MAY contain any property from the [Message Object](#messageObject), except `payload` and `traits`.

If you're looking to apply traits to an operation, see the [Operation Trait Object](#operationTraitObject).

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a name="messageTraitObjectHeaders"></a>headers | [Schema Object](#schemaObject) &#124; [Reference Object](#referenceObject) | Schema definition of the application headers. Schema MUST be of type "object". It **MUST NOT** define the protocol headers.
<a name="messageTraitObjectCorrelationId"></a>correlationId | [Correlation ID Object](#correlationIdObject) &#124; [Reference Object](#referenceObject) | Definition of the correlation ID used for message tracing or matching.
<a name="messageTraitObjectSchemaFormat"></a>schemaFormat | `string` | A string containing the name of the schema format/language used to define the message payload. If omitted, implementations should parse the payload as a [Schema object](#schemaObject).
<a name="messageTraitObjectContentType"></a>contentType | `string` | The content type to use when encoding/decoding a message's payload. The value MUST be a specific media type (e.g. `application/json`). When omitted, the value MUST be the one specified on the [defaultContentType](#defaultContentTypeString) field.
<a name="messageTraitObjectName"></a>name | `string` | A machine-friendly name for the message.
<a name="messageTraitObjectTitle"></a>title | `string` | A human-friendly title for the message.
<a name="messageTraitObjectSummary"></a>summary | `string` | A short summary of what the message is about.
<a name="messageTraitObjectDescription"></a>description | `string` | A verbose explanation of the message. [CommonMark syntax](http://spec.commonmark.org/) can be used for rich text representation.
<a name="messageTraitObjectTags"></a>tags | [Tags Object](#tagsObject) | A list of tags for API documentation control. Tags can be used for logical grouping of messages.
<a name="messageTraitObjectExternalDocs"></a>externalDocs | [External Documentation Object](#externalDocumentationObject) | Additional external documentation for this message.
<a name="messageTraitObjectBindings"></a>bindings | [Message Bindings Object](#messageBindingsObject) \| [Reference Object](#referenceObject) | A map where the keys describe the name of the protocol and the values describe protocol-specific definitions for the message.
<a name="messageTraitObjectExamples"></a>examples | [Map[`string`, `any`]] | An array with examples of valid message objects.

This object can be extended with [Specification Extensions](#specificationExtensions).

##### Message Trait Object Example

```json
{
  "schemaFormat": "application/vnd.apache.avro+json;version=1.9.0",
  "contentType": "application/json"
}
```

```yaml
schemaFormat: 'application/vnd.apache.avro+yaml;version=1.9.0'
contentType: application/json
```

#### <a name="tagsObject"></a>Tags Object

A Tags object is a list of Tag Objects.

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


The Reference Object is defined by [JSON Reference](https://tools.ietf.org/html/draft-pbryan-zyp-json-ref-03) and follows the same structure, behavior and rules. A JSON Reference SHALL only be used to refer to a schema that is formatted in either JSON or YAML. In the case of a YAML-formatted Schema, the JSON Reference SHALL be applied to the JSON representation of that schema. The JSON representation SHALL be made by applying the conversion described [here](#format).

For this specification, reference resolution is done as defined by the JSON Reference specification and not by the JSON Schema specification.

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
<a name="componentsSecuritySchemes"></a> securitySchemes| Map[`string`, [Security Scheme Object](#securitySchemeObject) \| [Reference Object](#referenceObject)] | An object to hold reusable [Security Scheme Objects](#securitySchemeObject).
<a name="componentsParameters"></a> parameters | Map[`string`, [Parameter Object](#parameterObject) \| [Reference Object](#referenceObject)] | An object to hold reusable [Parameter Objects](#parameterObject).
<a name="componentsCorrelationIDs"></a> correlationIds | Map[`string`, [Correlation ID Object](#correlationIdObject) \| [Reference Object](#referenceObject)] | An object to hold reusable [Correlation ID Objects](#correlationIdObject).
<a name="componentsOperationTraits"></a> operationTraits | Map[`string`, [Operation Trait Object](#operationTraitObject) \| [Reference Object](#referenceObject)]  | An object to hold reusable [Operation Trait Objects](#operationTraitObject).
<a name="componentsMessageTraits"></a> messageTraits | Map[`string`, [Message Trait Object](#messageTraitObject) \| [Reference Object](#referenceObject)]  | An object to hold reusable [Message Trait Objects](#messageTraitObject).
<a name="componentsServerBindings"></a> serverBindings | Map[`string`, [Server Bindings Object](#serverBindingsObject) \| [Reference Object](#referenceObject)]  | An object to hold reusable [Server Bindings Objects](#serverBindingsObject).
<a name="componentsChannelBindings"></a> channelBindings | Map[`string`, [Channel Bindings Object](#channelBindingsObject) \| [Reference Object](#referenceObject)]  | An object to hold reusable [Channel Bindings Objects](#channelBindingsObject).
<a name="componentsOperationBindings"></a> operationBindings | Map[`string`, [Operation Bindings Object](#operationBindingsObject) \| [Reference Object](#referenceObject)]  | An object to hold reusable [Operation Bindings Objects](#operationBindingsObject).
<a name="componentsMessageBindings"></a> messageBindings | Map[`string`, [Message Bindings Object](#messageBindingsObject) \| [Reference Object](#referenceObject)]  | An object to hold reusable [Message Bindings Objects](#messageBindingsObject).

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
          "applicationInstanceId": {
            "description": "Unique identifier for a given instance of the publishing application",
            "type": "string"
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
  },
  "parameters": {
    "userId": {
      "description": "Id of the user.",
      "schema": {
        "type": "string"
      }
    }
  },
  "correlationIds": {
    "default": {
      "description": "Default Correlation ID",
      "location": "$message.header#/correlationId"
    }
  },
  "messageTraits": {
    "commonHeaders": {
      "headers": {
        "type": "object",
        "properties": {
          "my-app-header": {
            "type": "integer",
            "minimum": 0,
            "maximum": 100
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
          applicationInstanceId:
            description: Unique identifier for a given instance of the publishing application
            type: string
      payload:
        type: object
        properties:
          user:
            $ref: "#/components/schemas/userCreate"
          signup:
            $ref: "#/components/schemas/signup"
  parameters:
    userId:
      description: Id of the user.
      schema:
        type: string
  correlationIds:
    default:
      description: Default Correlation ID
      location: $message.header#/correlationId
  messageTraits:
    commonHeaders:
      headers:
        type: object
        properties:
          my-app-header:
            type: integer
            minimum: 0
            maximum: 100
```

#### <a name="schemaObject"></a>Schema Object

The Schema Object allows the definition of input and output data types.
These types can be objects, but also primitives and arrays. This object is a superset of the [JSON Schema Specification Draft 07](http://json-schema.org/). The empty schema (which allows any instance to validate) MAY be represented by the `boolean` value `true` and a schema which allows no instance to validate MAY be represented by the `boolean` value `false`.

Further information about the properties can be found in [JSON Schema Core](https://tools.ietf.org/html/draft-handrews-json-schema-01) and [JSON Schema Validation](https://tools.ietf.org/html/draft-handrews-json-schema-validation-01).
Unless stated otherwise, the property definitions follow the JSON Schema specification as referenced here.

##### Properties

The AsyncAPI Schema Object is a JSON Schema vocabulary which extends JSON Schema Core and Validation vocabularies. As such, any keyword available for those vocabularies is by definition available in AsyncAPI, and will work the exact same way, including but not limited to:

- title
- type
- required
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
- enum
- const
- examples
- if / then / else
- readOnly
- writeOnly
- properties
- patternProperties
- additionalProperties
- additionalItems
- items
- propertyNames
- contains
- allOf
- oneOf
- anyOf
- not

The following properties are taken from the JSON Schema definition but their definitions were adjusted to the AsyncAPI Specification.

- description - [CommonMark syntax](http://spec.commonmark.org/) can be used for rich text representation.
- format - See [Data Type Formats](#dataTypeFormat) for further details. While relying on JSON Schema's defined formats, the AsyncAPI Specification offers a few additional predefined formats.
- default - The default value represents what would be assumed by the consumer of the input as the value of the schema if one is not provided. Unlike JSON Schema, the value MUST conform to the defined type for the Schema Object defined at the same level. For example, of `type` is `string`, then `default` can be `"foo"` but cannot be `1`.

Alternatively, any time a Schema Object can be used, a [Reference Object](#referenceObject) can be used in its place. This allows referencing definitions in place of defining them inline.

In addition to the JSON Schema fields, the following AsyncAPI vocabulary fields MAY be used for further schema documentation:

##### Fixed Fields
Field Name | Type | Description
---|:---:|---
<a name="schemaObjectDiscriminator"></a>discriminator | `string` | Adds support for polymorphism. The discriminator is the schema property name that is used to differentiate between other schema that inherit this schema. The property name used MUST be defined at this schema and it MUST be in the `required` property list. When used, the value MUST be the name of this schema or any schema that inherits it. See [Composition and Inheritance](#schemaComposition) for more details.
<a name="schemaObjectExternalDocs"></a>externalDocs | [External Documentation Object](#externalDocumentationObject) | Additional external documentation for this schema.
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

###### Model with Boolean Schemas

```json
{
  "type": "object",
  "required": [
    "anySchema"
  ],
  "properties": {
    "anySchema": true,
    "cannotBeDefined": false
  }
}
```

```yaml
type: object
required:
- anySchema
properties:
  anySchema: true
  cannotBeDefined: false
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
    },
    "StickInsect": {
      "description": "A representation of an Australian walking stick. Note that `StickBug` will be used as the discriminator value.",
      "allOf": [
        {
          "$ref": "#/components/schemas/Pet"
        },
        {
          "type": "object",
          "properties": {
            "petType": {
              "const": "StickBug"
            },
            "color": {
              "type": "string",
            }
          },
          "required": [
            "color"
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
  ## applies to instances with `petType: "Cat"`
  ## because that is the schema name
  Cat:
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
  ## applies to instances with `petType: "Dog"`
  ## because that is the schema name
  Dog:
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
  ## applies to instances with `petType: "StickBug"`
  ## because that is the required value of the discriminator field,
  ## overriding the schema name
  StickInsect:
    description: A representation of an Australian walking stick
    allOf:
    - $ref: '#/components/schemas/Pet'
    - type: object
      properties:
        petType:
          const: StickBug
        color:
          type: string
      required:
      - color
```





#### <a name="securitySchemeObject"></a>Security Scheme Object

Defines a security scheme that can be used by the operations. Supported schemes are:

* User/Password.
* API key (either as user or as password).
* X.509 certificate.
* End-to-end encryption (either symmetric or asymmetric).
* HTTP authentication.
* HTTP API key.
* OAuth2's common flows (Implicit, Resource Owner Protected Credentials, Client Credentials and Authorization Code) as defined in [RFC6749](https://tools.ietf.org/html/rfc6749).
* [OpenID Connect Discovery](https://tools.ietf.org/html/draft-ietf-oauth-discovery-06).
* SASL (Simple Authentication and Security Layer) as defined in [RFC4422](https://tools.ietf.org/html/rfc4422).

##### Fixed Fields
Field Name | Type | Applies To | Description
---|:---:|---|---
<a name="securitySchemeObjectType"></a>type | `string` | Any | **REQUIRED**. The type of the security scheme. Valid values are `"userPassword"`, `"apiKey"`, `"X509"`, `"symmetricEncryption"`, `"asymmetricEncryption"`, `"httpApiKey"`, `"http"`, `"oauth2"`, `"openIdConnect"`, `"plain"`, `"scramSha256"`, `"scramSha512"`, and `"gssapi"`.
<a name="securitySchemeObjectDescription"></a>description | `string` | Any | A short description for security scheme. [CommonMark syntax](http://spec.commonmark.org/) MAY be used for rich text representation.
<a name="securitySchemeObjectName"></a>name | `string` | `httpApiKey` | **REQUIRED**. The name of the header, query or cookie parameter to be used.
<a name="securitySchemeObjectIn"></a>in | `string` | `apiKey` \| `httpApiKey` | **REQUIRED**. The location of the API key. Valid values are `"user"` and `"password"` for `apiKey` and `"query"`, `"header"` or `"cookie"` for `httpApiKey`.
<a name="securitySchemeObjectScheme"></a>scheme | `string` | `http` | **REQUIRED**. The name of the HTTP Authorization scheme to be used in the [Authorization header as defined in RFC7235](https://tools.ietf.org/html/rfc7235#section-5.1).
<a name="securitySchemeObjectBearerFormat"></a>bearerFormat | `string` | `http` (`"bearer"`) | A hint to the client to identify how the bearer token is formatted.  Bearer tokens are usually generated by an authorization server, so this information is primarily for documentation purposes.
<a name="securitySchemeFlows"></a>flows | [OAuth Flows Object](#oauthFlowsObject) | `oauth2` | **REQUIRED**. An object containing configuration information for the flow types supported.
<a name="securitySchemeOpenIdConnectUrl"></a>openIdConnectUrl | `string` | `openIdConnect` | **REQUIRED**. OpenId Connect URL to discover OAuth2 configuration values. This MUST be in the form of a URL.

This object MAY be extended with [Specification Extensions](#specificationExtensions).

##### Security Scheme Object Example

###### User/Password Authentication Sample

```json
{
  "type": "userPassword"
}
```

```yaml
type: userPassword
```

###### API Key Authentication Sample

```json
{
  "type": "apiKey",
  "in": "user"
}
```

```yaml
type: apiKey,
in: user
```

###### X.509 Authentication Sample

```json
{
  "type": "X509"
}
```

```yaml
type: X509
```

###### End-to-end Encryption Authentication Sample

```json
{
  "type": "symmetricEncryption"
}
```

```yaml
type: symmetricEncryption
```

###### Basic Authentication Sample

```json
{
  "type": "http",
  "scheme": "basic"
}
```

```yaml
type: http
scheme: basic
```

###### API Key Sample

```json
{
  "type": "httpApiKey",
  "name": "api_key",
  "in": "header"
}
```

```yaml
type: httpApiKey
name: api_key
in: header
```

###### JWT Bearer Sample

```json
{
  "type": "http",
  "scheme": "bearer",
  "bearerFormat": "JWT",
}
```

```yaml
type: http
scheme: bearer
bearerFormat: JWT
```

###### Implicit OAuth2 Sample

```json
{
  "type": "oauth2",
  "flows": {
    "implicit": {
      "authorizationUrl": "https://example.com/api/oauth/dialog",
      "scopes": {
        "write:pets": "modify pets in your account",
        "read:pets": "read your pets"
      }
    }
  }
}
```

```yaml
type: oauth2
flows:
  implicit:
    authorizationUrl: https://example.com/api/oauth/dialog
    scopes:
      write:pets: modify pets in your account
      read:pets: read your pets
```

###### SASL Sample

```json
{
  "type": "scramSha512"
}
```

```yaml
type: scramSha512
```

#### <a name="oauthFlowsObject"></a>OAuth Flows Object

Allows configuration of the supported OAuth Flows.

##### Fixed Fields
Field Name | Type | Description
---|:---:|---
<a name="oauthFlowsImplicit"></a>implicit| [OAuth Flow Object](#oauthFlowObject) | Configuration for the OAuth Implicit flow
<a name="oauthFlowsPassword"></a>password| [OAuth Flow Object](#oauthFlowObject) | Configuration for the OAuth Resource Owner Protected Credentials flow
<a name="oauthFlowsClientCredentials"></a>clientCredentials| [OAuth Flow Object](#oauthFlowObject) | Configuration for the OAuth Client Credentials flow.
<a name="oauthFlowsAuthorizationCode"></a>authorizationCode| [OAuth Flow Object](#oauthFlowObject) | Configuration for the OAuth Authorization Code flow.

This object MAY be extended with [Specification Extensions](#specificationExtensions).

#### <a name="oauthFlowObject"></a>OAuth Flow Object

Configuration details for a supported OAuth Flow

##### Fixed Fields
Field Name | Type | Applies To | Description
---|:---:|---|---
<a name="oauthFlowAuthorizationUrl"></a>authorizationUrl | `string` | `oauth2` (`"implicit"`, `"authorizationCode"`) | **REQUIRED**. The authorization URL to be used for this flow. This MUST be in the form of a URL.
<a name="oauthFlowTokenUrl"></a>tokenUrl | `string` | `oauth2` (`"password"`, `"clientCredentials"`, `"authorizationCode"`) | **REQUIRED**. The token URL to be used for this flow. This MUST be in the form of a URL.
<a name="oauthFlowRefreshUrl"></a>refreshUrl | `string` | `oauth2` | The URL to be used for obtaining refresh tokens. This MUST be in the form of a URL.
<a name="oauthFlowScopes"></a>scopes | Map[`string`, `string`] | `oauth2` | **REQUIRED**. The available scopes for the OAuth2 security scheme. A map between the scope name and a short description for it.

This object MAY be extended with [Specification Extensions](#specificationExtensions).

##### OAuth Flow Object Examples

```JSON
{
  "type": "oauth2",
  "flows": {
    "implicit": {
      "authorizationUrl": "https://example.com/api/oauth/dialog",
      "scopes": {
        "write:pets": "modify pets in your account",
        "read:pets": "read your pets"
      }
    },
    "authorizationCode": {
      "authorizationUrl": "https://example.com/api/oauth/dialog",
      "tokenUrl": "https://example.com/api/oauth/token",
      "scopes": {
        "write:pets": "modify pets in your account",
        "read:pets": "read your pets"
      }
    }
  }
}
```

```YAML
type: oauth2
flows:
  implicit:
    authorizationUrl: https://example.com/api/oauth/dialog
    scopes:
      write:pets: modify pets in your account
      read:pets: read your pets
  authorizationCode:
    authorizationUrl: https://example.com/api/oauth/dialog
    tokenUrl: https://example.com/api/oauth/token
    scopes:
      write:pets: modify pets in your account
      read:pets: read your pets
```

#### <a name="securityRequirementObject"></a>Security Requirement Object

Lists the required security schemes to execute this operation.
The name used for each property MUST correspond to a security scheme declared in the [Security Schemes](#componentsSecuritySchemes) under the [Components Object](#componentsObject).

When a list of Security Requirement Objects is defined on a [Server object](#serverObject), only one of the Security Requirement Objects in the list needs to be satisfied to authorize the connection.

##### Patterned Fields

Field Pattern | Type | Description
---|:---:|---
<a name="securityRequirementsName"></a>{name} | [`string`] | Each name MUST correspond to a security scheme which is declared in the [Security Schemes](#componentsSecuritySchemes) under the [Components Object](#componentsObject). If the security scheme is of type `"oauth2"` or `"openIdConnect"`, then the value is a list of scope names. Provide scopes that are required to establish successful connection with the server. If scopes are not needed, the list can be empty. For other security scheme types, the array MUST be empty.

##### Security Requirement Object Examples

###### User/Password Security Requirement

```json
{
  "user_pass": []
}
```

```yaml
user_pass: []
```

###### API Key Security Requirement

```json
{
  "api_key": []
}
```

```yaml
api_key: []
```

###### OAuth2 Security Requirement

```json
{
  "petstore_auth": [
    "write:pets",
    "read:pets"
  ]
}
```

```yaml
petstore_auth:
- write:pets
- read:pets
```

### <a name="correlationIdObject"></a>Correlation ID Object

An object that specifies an identifier at design time that can used for message tracing and correlation. 

For specifying and computing the location of a Correlation ID, a [runtime expression](#runtimeExpression) is used.

##### Fixed Fields

Field Name | Type | Description
---|:---|---
description | `string` | An optional description of the identifier. [CommonMark syntax](http://spec.commonmark.org/) can be used for rich text representation.
location | `string` | **REQUIRED.** A [runtime expression](#runtimeExpression) that specifies the location of the correlation ID.

This object can be extended with [Specification Extensions](#specificationExtensions).

##### Examples

```json
{
  "description": "Default Correlation ID",
  "location": "$message.header#/correlationId"
}
```

```yaml
description: Default Correlation ID
location: $message.header#/correlationId
```

### <a name="runtimeExpression"></a>Runtime Expression

A runtime expression allows values to be defined based on information that will be available within the message.
This mechanism is used by [Correlation ID Object](#correlationIdObject).

The runtime expression is defined by the following [ABNF](https://tools.ietf.org/html/rfc5234) syntax:

```
      expression = ( "$message" "." source )
      source = ( header-reference | payload-reference )
      header-reference = "header" ["#" fragment]
      payload-reference = "payload" ["#" fragment]
      fragment = a JSON Pointer [RFC 6901](https://tools.ietf.org/html/rfc6901)
```

The table below provides examples of runtime expressions and examples of their use in a value:

##### <a name="runtimeExpressionExamples"></a>Examples

Source Location | Example expression  | Notes
---|:---|:---|
Message Header Property | `$message.header#/MQMD/CorrelId` | Correlation ID is set using the `CorrelId` value from the `MQMD` header.
Message Payload Property | `$message.payload#/messageId` | Correlation ID is set using the `messageId` value from the message payload.

Runtime expressions preserve the type of the referenced value.

### <a name="specificationExtensions"></a>Specification Extensions

While the AsyncAPI Specification tries to accommodate most use cases, additional data can be added to extend the specification at certain points.

The extensions properties are implemented as patterned fields that are always prefixed by `"x-"`.

Field Pattern | Type | Description
---|:---:|---
<a name="infoExtensions"></a>`^x-[\w\d\-\_]+$` | Any | Allows extensions to the AsyncAPI Schema. The field name MUST begin with `x-`, for example, `x-internal-id`. The value can be `null`, a primitive, an array or an object. Can have any valid JSON format value.

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
