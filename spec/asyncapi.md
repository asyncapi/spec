# AsyncAPI Specification

#### Attribution

Part of this content has been taken from the great work done by the folks at the [OpenAPI Initiative](https://openapis.org).

#### Version 3.0.0

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [RFC 2119](https://www.ietf.org/rfc/rfc2119.txt).

The AsyncAPI Specification is licensed under [The Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0.html).

## Introduction

The AsyncAPI Specification is a project used to describe message-driven APIs in a machine-readable format. It’s protocol-agnostic, so you can use it for APIs that work over any protocol (e.g., AMQP, MQTT, WebSockets, Kafka, STOMP, HTTP, Mercure, etc).

The AsyncAPI Specification defines a set of fields that can be used in an AsyncAPI document to describe an [application](#application)'s API. The document may reference other files for additional details or shared fields, but it is typically a single, primary document that encapsulates the API description.

The AsyncAPI document SHOULD describe the operations an [application](#application) performs. For instance, consider the following AsyncAPI definition snippet:

```yaml
channels:
  userSignedUp:
    # ...(redacted for brevity)
operations:
  onUserSignedUp:
    action: receive
    channel:
      $ref: "#/channels/userSignedUp"
```

It means that the [application](#user-content-definitionsApplication) will receive messages from  the `userSignedUp` [channel](#channel).

**The AsyncAPI specification does not assume any kind of software topology, architecture or pattern.** Therefore, a server MAY be a message broker, a web server or any other kind of computer program capable of sending and/or receiving data. However, AsyncAPI offers a mechanism called "bindings" that aims to help with more specific information about the protocol.

It's NOT RECOMMENDED to derive a [receiver](#user-content-definitionsReceiver) AsyncAPI document from a [sender](#sender) one or vice versa. There are no guarantees that the channel used by an application to receive messages will be the same channel where another application is sending them. Also, certain fields in the document like `summary`, `description`, and the id of the operation might stop making sense. For instance, given the following receiver snippet:

```yaml
operations:
  onUserSignedUp:
    summary: On user signed up.
    description: Event received when a user signed up on the product.
    action: receive
    channel:
      $ref: "#/channels/userSignedUp"
```

We can't automatically assume that an _opposite_ application exists by simply replacing `receive` with `send`:

```yaml
operations:
  onUserSignedUp: # <-- This doesn't make sense now. Should be something like sendUserSignedUp.
    summary: On user signed up. # <-- This doesn't make sense now. Should say something like "Sends a user signed up event".
    description: Event received when a user signed up on the product. # <-- This doesn't make sense now. Should speak about sending an event, not receiving it.
    action: send
    channel:
      $ref: "#/channels/userSignedUp"
```

Aside from the issues mentioned above, there may also be infrastructure configuration that is not represented here. For instance, a system may use a read-only channel for receiving messages, a different one for sending them, and an intermediary process that will forward messages from one channel to the other.

## Table of Contents
<!-- TOC depthFrom:2 depthTo:4 withLinks:1 updateOnSave:0 orderedList:0 -->

- [Definitions](#definitions)
  - [Server](#server)
  - [Application](#application)
  - [Sender](#sender)
  - [Receiver](#receiver)
  - [Message](#message)
  - [Channel](#channel)
  - [Protocol](#protocol)
- [Specification](#specification)
  - [Format](#format)
  - [File Structure](#file-structure)
  - [Absolute URLs](#absolute-urls)
  - [Schema](#schema)
    - [AsyncAPI Object](#asyncapi-object)
    - [AsyncAPI Version String](#asyncapi-version-string)
    - [Identifier](#identifier)
    - [Info Object](#info-object)
    - [Contact Object](#contact-object)
    - [License Object](#license-object)
    - [Servers Object](#servers-object)
    - [Server Object](#server-object)
    - [Server Variable Object](#server-variable-object)
    - [Default Content Type](#default-content-type)
    - [Channels Object](#channels-object)
    - [Channel Object](#channel-object)
    - [Operations Object](#operations-object)
    - [Operation Object](#operation-object)
    - [Operation Trait Object](#operation-trait-object)
    - [Operation Reply Object](#operation-reply-object)
    - [Operation Reply Address Object](#operation-reply-address-object)
    - [Message Object](#message-object)
    - [Message Trait Object](#message-trait-object)
    - [Message Example Object](#message-example-object)
    - [Tags Object](#tags-object)
    - [Tag Object](#user-content-tag-object)
    - [External Documentation Object](#external-documentation-object)
    - [Components Object](#components-object)
    - [Reference Object](#reference-object)
    - [Multi Format Schema Object](#multi-format-schema-object)
    - [Schema Object](#schema-object)
    - [Security Scheme Object](#security-scheme-object)
    - [OAuth Flows Object](#user-content-oauth-flows-object)
    - [OAuth Flow Object](#user-content-oauth-flow-object)
    - [Server Bindings Object](#server-bindings-object)
    - [Parameters Object](#parameters-object)
    - [Parameter Object](#parameter-object)
    - [Channel Bindings Object](#channel-bindings-object)
    - [Operation Bindings Object](#operation-bindings-object)
    - [Message Bindings Object](#message-bindings-object)
    - [Correlation ID Object](#correlation-id-object)
    - [Specification Extensions](#specification-extensions)

<!-- /TOC -->

## <a id="definitions"></a>Definitions

### <a id="definitionsServer"></a>Server
A server MAY be a message broker that is capable of sending and/or receiving between a [sender](#user-content-definitionsSender) and [receiver](#receiver). A server MAY be a service with WebSocket API that enables message-driven communication between browser-to-server or server-to-server.

### <a id="definitionsApplication"></a>Application
An application is any kind of computer program or a group of them. It MUST be a [sender](#user-content-definitionsSender), a [receiver](#user-content-definitionsReceiver), or both. An application MAY be a microservice, IoT device (sensor), mainframe process, message broker, etc. An application MAY be written in any number of different programming languages as long as they support the selected [protocol](#user-content-definitionsProtocol). An application MUST also use a protocol supported by the [server](#user-content-definitionsServer) in order to connect and exchange [messages](#message).

### <a id="definitionsSender"></a>Sender
A sender is a type of application, that is sending [messages](#user-content-definitionsMessage) to [channels](#user-content-definitionsChannel). A sender MAY send to multiple channels depending on the [server](#server), protocol, and use-case pattern.

### <a id="definitionsReceiver"></a>Receiver
A receiver is a type of application that is receiving [messages](#user-content-definitionsMessage) from [channels](#user-content-definitionsChannel). A receiver MAY receive from multiple channels depending on the [server](#server), protocol, and the use-case pattern. A receiver MAY forward a received message further without changing it. A receiver MAY act as a consumer and react to the message. A receiver MAY act as a processor that, for example, aggregates multiple messages in one and forwards them.

### <a id="definitionsMessage"></a>Message
A message is the mechanism by which information is exchanged via a channel between [servers](#user-content-definitionsServer) and applications. A message MAY contain a payload and MAY also contain headers. The headers MAY be subdivided into [protocol](#protocol)-defined headers and header properties defined by the application which can act as supporting metadata. The payload contains the data, defined by the application, which MUST be serialized into a format (JSON, XML, Avro, binary, etc.). Since a message is a generic mechanism, it can support multiple interaction patterns such as event, command, request, or response.

### <a id="definitionsChannel"></a>Channel
A channel is an addressable component, made available by the [server](#server), for the organization of [messages](#user-content-definitionsMessage). [Sender](#user-content-definitionsSender) applications send messages to channels and [receiver](#user-content-definitionsReceiver) applications receive messages from channels. [Servers](#server) MAY support many channel instances, allowing messages with different content to be addressed to different channels. Depending on the [server](#server) implementation, the channel MAY be included in the message via protocol-defined headers.

### <a id="definitionsProtocol"></a>Protocol
A protocol is the mechanism (wireline protocol or API) by which [messages](#user-content-definitionsMessage) are exchanged between the application and the [channel](#channel). Example protocols include, but are not limited to, AMQP, HTTP, JMS, Kafka, Anypoint MQ, MQTT, Solace, STOMP, Mercure, WebSocket, Google Pub/Sub, Pulsar.

### <a id="definitionsBindings"></a>Bindings
A "binding" (or "protocol binding") is a mechanism to define protocol-specific information. Therefore, a protocol binding MUST define protocol-specific information only.

## <a id="specification"></a>Specification

### <a id="format"></a>Format

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

In order to preserve the ability to round-trip between YAML and JSON formats, YAML version [1.2](https://www.yaml.org/spec/1.2/spec.html) is recommended along with some additional constraints:

- Tags MUST be limited to those allowed by the [JSON Schema ruleset](https://www.yaml.org/spec/1.2/spec.html#user-content-id2803231)
- Keys used in YAML maps MUST be limited to a scalar string, as defined by the YAML Failsafe schema ruleset

### <a id="file-structure"></a>File Structure

An AsyncAPI document MAY be made up of a single document or be divided into multiple,
connected parts at the discretion of the author. In the latter case, [Reference Objects](#reference-object) are used.

It is important to note that everything that is defined in an AsyncAPI document MUST be used by the implemented [Application](#application), with the exception of the [Components Object](#user-content-componentsObject). Everything that is defined inside the Components Object represents a resource that MAY or MAY NOT be used by the implemented [Application](#application).

By convention, the AsyncAPI Specification (A2S) file is named `asyncapi.json` or `asyncapi.yaml`.

### <a id="absolute-urls"></a>Absolute URLs

Unless specified otherwise, all properties that are absolute URLs are defined by [RFC3986, section 4.3](https://datatracker.ietf.org/doc/html/rfc3986#user-content-section-4.3).

### <a id="schema"></a>Schema

#### <a id="A2SObject"></a>AsyncAPI Object

This is the root document object for the API specification.
It combines resource listing and API declaration together into one document.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a id="A2SAsyncAPI"></a>asyncapi | [AsyncAPI Version String](#asyncapi-version-string) | **REQUIRED.** Specifies the AsyncAPI Specification version being used. It can be used by tooling Specifications and clients to interpret the version. The structure shall be `major`.`minor`.`patch`, where `patch` versions _must_ be compatible with the existing `major`.`minor` tooling. Typically patch versions will be introduced to address errors in the documentation, and tooling should typically be compatible with the corresponding `major`.`minor` (1.0.*). Patch versions will correspond to patches of this document.
<a id="A2SId"></a>id | [Identifier](#user-content-A2SIdString) | Identifier of the [application](#application) the AsyncAPI document is defining.
<a id="A2SInfo"></a>info | [Info Object](#info-object) | **REQUIRED.** Provides metadata about the API. The metadata can be used by the clients if needed.
<a id="A2SServers"></a>servers | [Servers Object](#servers-object) | Provides connection details of servers.
<a id="A2SDefaultContentType"></a>defaultContentType | [Default Content Type](#default-content-type) | Default content type to use when encoding/decoding a message's payload.
<a id="A2SChannels"></a>channels | [Channels Object](#user-content-channelsObject) | The channels used by this [application](#application).
<a id="A2SOperations"></a>operations | [Operations Object](#user-content-operationsObject) | The operations this [application](#application) MUST implement.
<a id="A2SComponents"></a>components | [Components Object](#user-content-componentsObject) | An element to hold various reusable objects for the specification. Everything that is defined inside this object represents a resource that MAY or MAY NOT be used in the rest of the document and MAY or MAY NOT be used by the implemented [Application](#application).

This object MAY be extended with [Specification Extensions](#specification-extensions).

#### <a id="A2SVersionString"></a>AsyncAPI Version String

The version string signifies the version of the AsyncAPI Specification that the document complies to.
The format for this string _must_ be `major`.`minor`.`patch`.  The `patch` _may_ be suffixed by a hyphen and extra alphanumeric characters.

A `major`.`minor` shall be used to designate the AsyncAPI Specification version, and will be considered compatible with the AsyncAPI Specification specified by that `major`.`minor` version.
The patch version will not be considered by tooling, making no distinction between `1.0.0` and `1.0.1`.

In subsequent versions of the AsyncAPI Specification, care will be given such that increments of the `minor` version should not interfere with operations of tooling developed to a lower minor version. Thus a hypothetical `1.1.0` specification should be usable with tooling designed for `1.0.0`.

#### <a id="A2SIdString"></a>Identifier

This field represents a unique universal identifier of the [application](#application) the AsyncAPI document is defining. It must conform to the URI format, according to [RFC3986](https://tools.ietf.org/html/rfc3986).

It is RECOMMENDED to use a [URN](https://tools.ietf.org/html/rfc8141) to globally and uniquely identify the application during long periods of time, even after it becomes unavailable or ceases to exist.

###### Examples

```json
{
  "id": "urn:example:com:smartylighting:streetlights:server"
}
```

```yaml
id: 'urn:example:com:smartylighting:streetlights:server'
```

```json
{
  "id": "https://github.com/smartylighting/streetlights-server"
}
```

```yaml
id: 'https://github.com/smartylighting/streetlights-server'
```

#### <a id="infoObject"></a>Info Object

The object provides metadata about the API.
The metadata can be used by the clients if needed.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a id="infoObjectTitle"></a>title | `string` | **REQUIRED.** The title of the application.
<a id="infoObjectVersion"></a>version | `string` | **REQUIRED** Provides the version of the application API (not to be confused with the specification version).
<a id="infoObjectDescription"></a>description | `string` | A short description of the application. [CommonMark syntax](https://spec.commonmark.org/) can be used for rich text representation.
<a id="infoObjectTermsOfService"></a>termsOfService | `string` | A URL to the Terms of Service for the API. This MUST be in the form of an absolute URL.
<a id="infoObjectContact"></a>contact | [Contact Object](#contact-object) | The contact information for the exposed API.
<a id="infoObjectLicense"></a>license | [License Object](#license-object) | The license information for the exposed API.
<a id="infoObjectTags"></a>tags | [Tags Object](#tags-object) | A list of tags for application API documentation control. Tags can be used for logical grouping of applications.
<a id="infoObjectExternalDocs"></a>externalDocs | [External Documentation Object](#user-content-externalDocumentationObject) \| [Reference Object](#reference-object) | Additional external documentation of the exposed API.

This object MAY be extended with [Specification Extensions](#specification-extensions).

##### Info Object Example:

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

```yaml
title: AsyncAPI Sample App
version: 1.0.1
description: This is a sample app.
termsOfService: https://asyncapi.org/terms/
contact:
  name: API Support
  url: https://www.asyncapi.org/support
  email: support@asyncapi.org
license:
  name: Apache 2.0
  url: https://www.apache.org/licenses/LICENSE-2.0.html
externalDocs:
  description: Find more info here
  url: https://www.asyncapi.org
tags:
  - name: e-commerce
```

#### <a id="contactObject"></a>Contact Object

Contact information for the exposed API.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a id="contactObjectName"></a>name | `string` | The identifying name of the contact person/organization.
<a id="contactObjectUrl"></a>url | `string` | The URL pointing to the contact information. This MUST be in the form of an absolute URL.
<a id="contactObjectEmail"></a>email | `string` | The email address of the contact person/organization. MUST be in the format of an email address.

This object MAY be extended with [Specification Extensions](#specification-extensions).

##### Contact Object Example:

```json
{
  "name": "API Support",
  "url": "https://www.example.com/support",
  "email": "support@example.com"
}
```

```yaml
name: API Support
url: https://www.example.com/support
email: support@example.com
```

#### <a id="licenseObject"></a>License Object

License information for the exposed API.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a id="licenseObjectName"></a>name | `string` | **REQUIRED.** The license name used for the API.
<a id="licenseObjectUrl"></a>url | `string` | A URL to the license used for the API. This MUST be in the form of an absolute URL.

This object MAY be extended with [Specification Extensions](#specification-extensions).

##### License Object Example:

```json
{
  "name": "Apache 2.0",
  "url": "https://www.apache.org/licenses/LICENSE-2.0.html"
}
```

```yaml
name: Apache 2.0
url: https://www.apache.org/licenses/LICENSE-2.0.html
```

#### <a id="serversObject"></a>Servers Object

The Servers Object is a map of [Server Objects](#server-object).

##### Patterned Fields

Field Pattern | Type | Description
---|:---:|---
<a id="serversObjectServer"></a>`^[A-Za-z0-9_\-]+$` | [Server Object](#user-content-serverObject) \| [Reference Object](#reference-object) | The definition of a server this application MAY connect to.

##### Servers Object Example

```json
{
  "development": {
    "host": "localhost:5672",
    "description": "Development AMQP broker.",
    "protocol": "amqp",
    "protocolVersion": "0-9-1",
    "tags": [
      { 
        "name": "env:development",
        "description": "This environment is meant for developers to run their own tests."
      }
    ]
  },
  "staging": {
    "host": "rabbitmq-staging.in.mycompany.com:5672",
    "description": "RabbitMQ broker for the staging environment.",
    "protocol": "amqp",
    "protocolVersion": "0-9-1",
    "tags": [
      { 
        "name": "env:staging",
        "description": "This environment is a replica of the production environment."
      }
    ]
  },
  "production": {
    "host": "rabbitmq.in.mycompany.com:5672",
    "description": "RabbitMQ broker for the production environment.",
    "protocol": "amqp",
    "protocolVersion": "0-9-1",
    "tags": [
      { 
        "name": "env:production",
        "description": "This environment is the live environment available for final users."
      }
    ]
  }
}
```

```yaml
development:
  host: localhost:5672
  description: Development AMQP broker.
  protocol: amqp
  protocolVersion: 0-9-1
  tags:
    - name: "env:development"
      description: "This environment is meant for developers to run their own tests."
staging:
  host: rabbitmq-staging.in.mycompany.com:5672
  description: RabbitMQ broker for the staging environment.
  protocol: amqp
  protocolVersion: 0-9-1
  tags:
    - name: "env:staging"
      description: "This environment is a replica of the production environment."
production:
  host: rabbitmq.in.mycompany.com:5672
  description: RabbitMQ broker for the production environment.
  protocol: amqp
  protocolVersion: 0-9-1
  tags:
    - name: "env:production"
      description: "This environment is the live environment available for final users."
```


#### <a id="serverObject"></a>Server Object

An object representing a message broker, a server or any other kind of computer program capable of sending and/or receiving data. This object is used to capture details such as URIs, protocols and security configuration. Variable substitution can be used so that some details, for example usernames and passwords, can be injected by code generation tools.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a id="serverObjectHost"></a>host | `string` | **REQUIRED**. The server host name. It MAY include the port. This field supports [Server Variables](#user-content-serverObjectVariables). Variable substitutions will be made when a variable is named in `{`braces`}`.
<a id="serverObjectProtocol"></a>protocol | `string` | **REQUIRED**. The protocol this server supports for connection.
<a id="serverObjectProtocolVersion"></a>protocolVersion | `string` | The version of the protocol used for connection. For instance: AMQP `0.9.1`, HTTP `2.0`, Kafka `1.0.0`, etc.
<a id="serverObjectPathname"></a>pathname | `string` | The path to a resource in the host. This field supports [Server Variables](#user-content-serverObjectVariables). Variable substitutions will be made when a variable is named in `{`braces`}`.
<a id="serverObjectDescription"></a>description | `string` | An optional string describing the server. [CommonMark syntax](https://spec.commonmark.org/) MAY be used for rich text representation.
<a id="serverObjectTitle"></a>title | `string` | A human-friendly title for the server.
<a id="serverObjectSummary"></a>summary | `string` | A short summary of the server.
<a id="serverObjectVariables"></a>variables | Map[`string`, [Server Variable Object](#user-content-serverVariableObject) \| [Reference Object](#reference-object)]] | A map between a variable name and its value.  The value is used for substitution in the server's `host` and `pathname` template.
<a id="serverObjectSecurity"></a>security | [[Security Scheme Object](#security-scheme-object) \| [Reference Object](#user-content-referenceObject)] | A declaration of which security schemes can be used with this server. The list of values includes alternative [security scheme objects](#security-scheme-object) that can be used. Only one of the security scheme objects need to be satisfied to authorize a connection or operation.
<a id="serverObjectTags"></a>tags | [Tags Object](#tags-object) | A list of tags for logical grouping and categorization of servers.
<a id="serverObjectExternalDocs"></a>externalDocs | [External Documentation Object](#user-content-externalDocumentationObject) \| [Reference Object](#reference-object) | Additional external documentation for this server.
<a id="serverObjectBindings"></a>bindings | [Server Bindings Object](#user-content-serverBindingsObject) \| [Reference Object](#reference-object) | A map where the keys describe the name of the protocol and the values describe protocol-specific definitions for the server.

##### Server Object Example

A single server would be described as:

```json
{
  "host": "kafka.in.mycompany.com:9092",
  "description": "Production Kafka broker.",
  "protocol": "kafka",
  "protocolVersion": "3.2"
}
```

```yaml
host: kafka.in.mycompany.com:9092
description: Production Kafka broker.
protocol: kafka
protocolVersion: '3.2'
```

An example of a server that has a `pathname`:

```json
{
  "host": "rabbitmq.in.mycompany.com:5672",
  "pathname": "/production",
  "protocol": "amqp",
  "description": "Production RabbitMQ broker (uses the `production` vhost)."
}
```

```yaml
host: rabbitmq.in.mycompany.com:5672
pathname: /production
protocol: amqp
description: Production RabbitMQ broker (uses the `production` vhost).
```

#### <a id="serverVariableObject"></a>Server Variable Object

An object representing a Server Variable for server URL template substitution.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a id="serverVariableObjectEnum"></a>enum | [`string`] | An enumeration of string values to be used if the substitution options are from a limited set.
<a id="serverVariableObjectDefault"></a>default | `string` | The default value to use for substitution, and to send, if an alternate value is _not_ supplied.
<a id="serverVariableObjectDescription"></a>description | `string` | An optional description for the server variable. [CommonMark syntax](https://spec.commonmark.org/) MAY be used for rich text representation.
<a id="serverVariableObjectExamples"></a>examples | [`string`] | An array of examples of the server variable.

This object MAY be extended with [Specification Extensions](#specification-extensions).

##### Server Variable Object Example

```json
{
  "host": "rabbitmq.in.mycompany.com:5672",
  "pathname": "/{env}",
  "protocol": "amqp",
  "description": "RabbitMQ broker. Use the `env` variable to point to either `production` or `staging`.",
  "variables": {
    "env": {
      "description": "Environment to connect to. It can be either `production` or `staging`.",
      "enum": [
        "production",
        "staging"
      ]
    }
  }
}
```

```yaml
host: 'rabbitmq.in.mycompany.com:5672'
pathname: '/{env}'
protocol: amqp
description: RabbitMQ broker. Use the `env` variable to point to either `production` or `staging`.
variables:
  env:
    description: Environment to connect to. It can be either `production` or `staging`.
    enum:
      - production
      - staging
```


#### <a id="defaultContentTypeString"></a>Default Content Type

A string representing the default content type to use when encoding/decoding a message's payload. The value MUST be a specific media type (e.g. `application/json`). This value MUST be used by schema parsers when the [contentType](#user-content-messageObjectContentType) property is omitted.

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






#### <a id="channelsObject"></a>Channels Object

An object containing all the [Channel Object](#user-content-channelObject) definitions the [Application](#application) MUST use during runtime.

##### Patterned Fields

Field Pattern | Type | Description
---|:---:|---
<a id="channelsObjectChannel"></a>{channelId} | [Channel Object](#user-content-channelObject) \| [Reference Object](#reference-object) | An identifier for the described channel. The `channelId` value is **case-sensitive**. Tools and libraries MAY use the `channelId` to uniquely identify a channel, therefore, it is RECOMMENDED to follow common programming naming conventions.

##### Channels Object Example

```json
{
  "userSignedUp": {
    "address": "user.signedup",
    "messages": {
      "userSignedUp": {
        "$ref": "#/components/messages/userSignedUp"
      }
    }
  }
}
```

```yaml
userSignedUp:
  address: 'user.signedup'
  messages:
    userSignedUp:
      $ref: '#/components/messages/userSignedUp'
```




#### <a id="channelObject"></a>Channel Object

Describes a shared communication channel.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a id="channelObjectAddress"></a>address | `string` \| `null` | An optional string representation of this channel's address. The address is typically the "topic name", "routing key", "event type", or "path". When `null` or absent, it MUST be interpreted as unknown. This is useful when the address is generated dynamically at runtime or can't be known upfront. It MAY contain [Channel Address Expressions](#user-content-channelAddressExpressions). Query parameters and fragments SHALL NOT be used, instead use [bindings](#channel-bindings-object) to define them.
<a id="channelObjectMessages"></a>messages | [Messages Object](#user-content-messagesObject) | A map of the messages that will be sent to this channel by any application at any time. **Every message sent to this channel MUST be valid against one, and only one, of the [message objects](#message-object) defined in this map.**
<a id="channelObjectTitle"></a>title | `string` | A human-friendly title for the channel.
<a id="channelObjectSummary"></a>summary | `string` | A short summary of the channel.
<a id="channelObjectDescription"></a>description | `string` | An optional description of this channel. [CommonMark syntax](https://spec.commonmark.org/) can be used for rich text representation.
<a id="channelObjectServers"></a>servers | [[Reference Object](#user-content-referenceObject)] | An array of `$ref` pointers to the definition of the servers in which this channel is available. If the channel is located in the [root Channels Object](#user-content-channelsObject), it MUST point to a subset of server definitions located in the [root Servers Object](#user-content-serversObject), and MUST NOT point to a subset of server definitions located in the [Components Object](#user-content-componentsObject) or anywhere else. If the channel is located in the [Components Object](#user-content-componentsObject), it MAY point to a [Server Objects](#server-object) in any location. If `servers` is absent or empty, this channel MUST be available on all the servers defined in the [Servers Object](#user-content-serversObject). Please note the `servers` property value MUST be an array of [Reference Objects](#user-content-referenceObject) and, therefore, MUST NOT contain an array of [Server Objects](#server-object). However, it is RECOMMENDED that parsers (or other software) dereference this property for a better development experience.
<a id="channelObjectParameters"></a>parameters | [Parameters Object](#user-content-parametersObject) | A map of the parameters included in the channel address. It MUST be present only when the address contains [Channel Address Expressions](#channel-address-expressions).
<a id="channelObjectTags"></a>tags | [Tags Object](#tags-object) | A list of tags for logical grouping of channels.
<a id="channelObjectExternalDocs"></a>externalDocs | [External Documentation Object](#user-content-externalDocumentationObject) \| [Reference Object](#reference-object) | Additional external documentation for this channel.
<a id="channelObjectBindings"></a>bindings | [Channel Bindings Object](#user-content-channelBindingsObject) \| [Reference Object](#reference-object) | A map where the keys describe the name of the protocol and the values describe protocol-specific definitions for the channel.


This object MAY be extended with [Specification Extensions](#specification-extensions).

##### Channel Object Example

```json
{
  "address": "users.{userId}",
  "title": "Users channel",
  "description": "This channel is used to exchange messages about user events.",
  "messages": {
    "userSignedUp": {
      "$ref": "#/components/messages/userSignedUp"
    },
    "userCompletedOrder": {
      "$ref": "#/components/messages/userCompletedOrder"
    }
  },
  "parameters": {
    "userId": {
      "$ref": "#/components/parameters/userId"
    }
  },
  "servers": [
    { "$ref": "#/servers/rabbitmqInProd" },
    { "$ref": "#/servers/rabbitmqInStaging" }
  ],
  "bindings": {
    "amqp": {
      "is": "queue",
      "queue": {
        "exclusive": true
      }
    }
  },
  "tags": [{
    "name": "user",
    "description": "User-related messages"
  }],
  "externalDocs": {
    "description": "Find more info here",
    "url": "https://example.com"
  }
}
```

```yaml
address: 'users.{userId}'
title: Users channel
description: This channel is used to exchange messages about user events.
messages:
  userSignedUp:
    $ref: '#/components/messages/userSignedUp'
  userCompletedOrder:
    $ref: '#/components/messages/userCompletedOrder'
parameters:
  userId:
    $ref: '#/components/parameters/userId'
servers:
  - $ref: '#/servers/rabbitmqInProd'
  - $ref: '#/servers/rabbitmqInStaging'
bindings:
  amqp:
    is: queue
    queue:
      exclusive: true
tags:
  - name: user
    description: User-related messages
externalDocs:
  description: 'Find more info here'
  url: 'https://example.com'
```





#### <a id="channelAddressExpressions"></a>Channel Address Expressions

Channel addresses MAY contain expressions that can be used to define dynamic values.

Expressions MUST be composed by a name enclosed in curly braces (`{` and `}`). E.g., `{userId}`.





#### <a id="messagesObject"></a>Messages Object

Describes a map of messages included in a channel.

##### Patterned Fields

Field Pattern | Type | Description
---|:---:|---
<a id="messagesObjectId"></a>`{messageId}` | [Message Object](#user-content-messageObject) \| [Reference Object](#reference-object) | The key represents the message identifier. The `messageId` value is **case-sensitive**. Tools and libraries MAY use the `messageId` value to uniquely identify a message, therefore, it is RECOMMENDED to follow common programming naming conventions.

##### Messages Object Example

```json
{
  "userSignedUp": {
    "$ref": "#/components/messages/userSignedUp"
  },
  "userCompletedOrder": {
    "$ref": "#/components/messages/userCompletedOrder"
  }
}
```

```yaml
userSignedUp:
  $ref: '#/components/messages/userSignedUp'
userCompletedOrder:
  $ref: '#/components/messages/userCompletedOrder'
```



#### <a id="operationsObject"></a>Operations Object

Holds a dictionary with all the [operations](#operation-object) this application MUST implement.

> If you're looking for a place to define operations that MAY or MAY NOT be implemented by the application, consider defining them in [`components/operations`](#user-content-componentsOperations).

##### Patterned Fields

Field Pattern | Type | Description
---|:---:|---
<a id="operationsObjectOperation"></a>{operationId} | [Operation Object](#user-content-operationObject) \| [Reference Object](#reference-object) | The operation this application MUST implement. The field name (`operationId`) MUST be a string used to identify the operation in the document where it is defined, and its value is **case-sensitive**. Tools and libraries MAY use the `operationId` to uniquely identify an operation, therefore, it is RECOMMENDED to follow common programming naming conventions.

##### Operations Object Example

```json
{
  "onUserSignUp": {
    "title": "User sign up",
    "summary": "Action to sign a user up.",
    "description": "A longer description",
    "channel": {
      "$ref": "#/channels/userSignup"
    },
    "action": "send",
    "tags": [
      { "name": "user" },
      { "name": "signup" },
      { "name": "register" }
    ],
    "bindings": {
      "amqp": {
        "ack": false
      }
    },
    "traits": [
      { "$ref": "#/components/operationTraits/kafka" }
    ]
  }
}
```

```yaml
onUserSignUp:
  title: User sign up
  summary: Action to sign a user up.
  description: A longer description
  channel:
    $ref: '#/channels/userSignup'
  action: send
  tags:
    - name: user
    - name: signup
    - name: register
  bindings:
    amqp:
      ack: false
  traits:
    - $ref: '#/components/operationTraits/kafka'
```


#### <a id="operationObject"></a>Operation Object

Describes a specific operation.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a id="operationObjectAction"></a>action | `"send"` &#user-content-124; `"receive"` | **Required**. Use `send` when it's expected that the application will send a message to the given [`channel`](#user-content-operationObjectChannel), and `receive` when the application should expect receiving messages from the given [`channel`](#user-content-operationObjectChannel).
<a id="operationObjectChannel"></a>channel | [Reference Object](#user-content-referenceObject) | **Required**. A `$ref` pointer to the definition of the channel in which this operation is performed. If the operation is located in the [root Operations Object](#user-content-operationsObject), it MUST point to a channel definition located in the [root Channels Object](#user-content-channelsObject), and MUST NOT point to a channel definition located in the [Components Object](#user-content-componentsObject) or anywhere else. If the operation is located in the [Components Object](#user-content-componentsObject), it MAY point to a [Channel Object](#channel-object) in any location. Please note the `channel` property value MUST be a [Reference Object](#user-content-referenceObject) and, therefore, MUST NOT contain a [Channel Object](#channel-object). However, it is RECOMMENDED that parsers (or other software) dereference this property for a better development experience.
<a id="operationObjectTitle"></a>title | `string` | A human-friendly title for the operation.
<a id="operationObjectSummary"></a>summary | `string` | A short summary of what the operation is about.
<a id="operationObjectDescription"></a>description | `string` | A verbose explanation of the operation. [CommonMark syntax](http://spec.commonmark.org/) can be used for rich text representation.
<a id="operationObjectSecurity"></a>security | [[Security Scheme Object](#user-content-securitySchemeObject) \| [Reference Object](#user-content-referenceObject)]| A declaration of which security schemes are associated with this operation. Only one of the [security scheme objects](#user-content-securitySchemeObject) MUST be satisfied to authorize an operation. In cases where [Server Security](#user-content-serverObjectSecurity) also applies, it MUST also be satisfied.
<a id="operationObjectTags"></a>tags | [Tags Object](#tags-object) | A list of tags for logical grouping and categorization of operations.
<a id="operationObjectExternalDocs"></a>externalDocs | [External Documentation Object](#user-content-externalDocumentationObject) \| [Reference Object](#reference-object) | Additional external documentation for this operation.
<a id="operationObjectBindings"></a>bindings | [Operation Bindings Object](#user-content-operationBindingsObject) \| [Reference Object](#reference-object) | A map where the keys describe the name of the protocol and the values describe protocol-specific definitions for the operation.
<a id="operationObjectTraits"></a>traits | [[Operation Trait Object](#user-content-operationTraitObject) &#user-content-124; [Reference Object](#user-content-referenceObject) ] | A list of traits to apply to the operation object. Traits MUST be merged using [traits merge mechanism](#user-content-traits-merge-mechanism). The resulting object MUST be a valid [Operation Object](#operation-object).
<a id="operationObjectMessages"></a>messages | [[Reference Object](#user-content-referenceObject)] | A list of `$ref` pointers pointing to the supported [Message Objects](#message-object) that can be processed by this operation. It MUST contain a subset of the messages defined in the [channel referenced in this operation](#user-content-operationObjectChannel), and MUST NOT point to a subset of message definitions located in the [Messages Object](#user-content-componentsMessages) in the [Components Object](#user-content-componentsObject) or anywhere else. **Every message processed by this operation MUST be valid against one, and only one, of the [message objects](#message-object) referenced in this list.** Please note the `messages` property value MUST be a list of [Reference Objects](#user-content-referenceObject) and, therefore, MUST NOT contain [Message Objects](#message-object). However, it is RECOMMENDED that parsers (or other software) dereference this property for a better development experience.
<a id="operationObjectReply"></a>reply | [Operation Reply Object](#user-content-operationReplyObject) &#user-content-124; [Reference Object](#reference-object)  | The definition of the reply in a request-reply operation.

This object MAY be extended with [Specification Extensions](#specification-extensions).

##### Operation Object Example

```json
{
  "title": "User sign up",
  "summary": "Action to sign a user up.",
  "description": "A longer description",
  "channel": {
    "$ref": "#/channels/userSignup"
  },
  "action": "send",
  "security": [
    {
     "petstore_auth": [
       "write:pets",
       "read:pets"
     ]
    }
  ],
  "tags": [
    { "name": "user" },
    { "name": "signup" },
    { "name": "register" }
  ],
  "bindings": {
    "amqp": {
      "ack": false
    }
  },
  "traits": [
    { "$ref": "#/components/operationTraits/kafka" }
  ],
  "messages": [
    { "$ref": "/components/messages/userSignedUp" }
  ],
  "reply": {
    "address": {
      "location": "$message.header#/replyTo"
    },
    "channel": {
      "$ref": "#/channels/userSignupReply"
    },
    "messages": [
      { "$ref": "/components/messages/userSignedUpReply" }
    ],
  }
}
```

```yaml
title: User sign up
summary: Action to sign a user up.
description: A longer description
channel:
  $ref: '#/channels/userSignup'
action: send
security:
  - petstore_auth:
    - write:pets
    - read:pets
tags:
  - name: user
  - name: signup
  - name: register
bindings:
  amqp:
    ack: false
traits:
  - $ref: "#/components/operationTraits/kafka"
messages:
  - $ref: '#/components/messages/userSignedUp'
reply:
  address:
    location: '$message.header#/replyTo'
  channel:
    $ref: '#/channels/userSignupReply'
  messages:
    - $ref: '#/components/messages/userSignedUpReply'
```




#### <a id="operationTraitObject"></a>Operation Trait Object

Describes a trait that MAY be applied to an [Operation Object](#operation-object). This object MAY contain any property from the [Operation Object](#operation-object), except the `action`, `channel`, `messages` and `traits` ones.

If you're looking to apply traits to a message, see the [Message Trait Object](#message-trait-object).

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a id="operationTraitObjectTitle"></a>title | `string` | A human-friendly title for the operation.
<a id="operationTraitObjectSummary"></a>summary | `string` | A short summary of what the operation is about.
<a id="operationTraitObjectDescription"></a>description | `string` | A verbose explanation of the operation. [CommonMark syntax](https://spec.commonmark.org/) can be used for rich text representation.
<a id="operationTraitObjectSecurity"></a>security | [[Security Scheme Object](#user-content-securitySchemeObject) \| [Reference Object](#user-content-referenceObject)]| A declaration of which security schemes are associated with this operation. Only one of the [security scheme objects](#user-content-securitySchemeObject) MUST be satisfied to authorize an operation. In cases where [Server Security](#user-content-serverObjectSecurity) also applies, it MUST also be satisfied.
<a id="operationTraitObjectTags"></a>tags | [Tags Object](#tags-object) | A list of tags for logical grouping and categorization of operations.
<a id="operationTraitObjectExternalDocs"></a>externalDocs | [External Documentation Object](#user-content-externalDocumentationObject) \| [Reference Object](#reference-object) | Additional external documentation for this operation.
<a id="operationTraitObjectBindings"></a>bindings | [Operation Bindings Object](#user-content-operationBindingsObject) \| [Reference Object](#reference-object) | A map where the keys describe the name of the protocol and the values describe protocol-specific definitions for the operation.

This object MAY be extended with [Specification Extensions](#specification-extensions).

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




#### <a id="operationReplyObject"></a>Operation Reply Object

Describes the reply part that MAY be applied to an Operation Object. If an operation implements the request/reply pattern, the reply object represents the response message.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a id="operationReplyObjectAddress"></a>address | [Operation Reply Address Object](#user-content-operationReplyAddressObject) &#user-content-124; [Reference Object](#reference-object) | Definition of the address that implementations MUST use for the reply.
<a id="operationReplyObjectChannel"></a>channel | [Reference Object](#user-content-referenceObject) | A `$ref` pointer to the definition of the channel in which this operation is performed. When [address](#user-content-operationReplyAddressObject) is specified, the [`address` property](#channel-objectAddress) of the channel referenced by this property MUST be either `null` or not defined. If the operation reply is located inside a [root Operation Object](#user-content-operationObject), it MUST point to a channel definition located in the [root Channels Object](#user-content-channelsObject), and MUST NOT point to a channel definition located in the [Components Object](#user-content-componentsObject) or anywhere else. If the operation reply is located inside an [Operation Object] in the [Components Object](#user-content-componentsObject) or in the [Replies Object](#user-content-componentsReplies) in the [Components Object](#user-content-componentsObject), it MAY point to a [Channel Object](#channel-object) in any location. Please note the `channel` property value MUST be a [Reference Object](#user-content-referenceObject) and, therefore, MUST NOT contain a [Channel Object](#channel-object). However, it is RECOMMENDED that parsers (or other software) dereference this property for a better development experience.
<a id="operationReplyObjectMessages"></a>messages | [[Reference Object](#user-content-referenceObject)] | A list of `$ref` pointers pointing to the supported [Message Objects](#message-object) that can be processed by this operation as reply. It MUST contain a subset of the messages defined in the [channel referenced in this operation reply](#user-content-operationObjectChannel), and MUST NOT point to a subset of message definitions located in the [Components Object](#user-content-componentsObject) or anywhere else. **Every message processed by this operation MUST be valid against one, and only one, of the [message objects](#message-object) referenced in this list.** Please note the `messages` property value MUST be a list of [Reference Objects](#user-content-referenceObject) and, therefore, MUST NOT contain [Message Objects](#message-object). However, it is RECOMMENDED that parsers (or other software) dereference this property for a better development experience.

This object MAY be extended with [Specification Extensions](#specification-extensions).

#### <a id="operationReplyAddressObject"></a>Operation Reply Address Object

An object that specifies where an operation has to send the reply.

For specifying and computing the location of a reply address, a [runtime expression](#runtime-expression) is used.


##### Fixed Fields

Field Name | Type | Description
---|:---|---
description | `string` | An optional description of the address. [CommonMark syntax](https://spec.commonmark.org/) can be used for rich text representation.
location | `string` | **REQUIRED.** A [runtime expression](#runtime-expression) that specifies the location of the reply address.

This object MAY be extended with [Specification Extensions](#specification-extensions).

##### Examples

```json
{
  "description": "Consumer inbox",
  "location": "$message.header#/replyTo"
}
```

```yaml
description: Consumer Inbox
location: $message.header#/replyTo
```


#### <a id="parametersObject"></a>Parameters Object

Describes a map of parameters included in a channel address.

This map MUST contain all the parameters used in the parent channel address.

##### Patterned Fields

Field Pattern | Type | Description
---|:---:|---
<a id="parametersObjectName"></a>`^[A-Za-z0-9_\-]+$` | [Parameter Object](#user-content-parameterObject) &#user-content-124; [Reference Object](#reference-object) | The key represents the name of the parameter. It MUST match the parameter name used in the parent channel address.

##### Parameters Object Example

```json
{
  "address": "user/{userId}/signedup",
  "parameters": {
    "userId": {
      "description": "Id of the user."
    }
  }
}
```

```yaml
address: user/{userId}/signedup
parameters:
  userId:
    description: Id of the user.
```





#### <a id="parameterObject"></a>Parameter Object

Describes a parameter included in a channel address.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a id="parameterObjectEnum"></a>enum | [`string`] | An enumeration of string values to be used if the substitution options are from a limited set.
<a id="parameterObjectDefault"></a>default | `string` | The default value to use for substitution, and to send, if an alternate value is _not_ supplied.
<a id="parameterObjectDescription"></a>description | `string` | An optional description for the parameter. [CommonMark syntax](https://spec.commonmark.org/) MAY be used for rich text representation.
<a id="parameterObjectExamples"></a>examples | [`string`] | An array of examples of the parameter value.
<a id="parameterObjectLocation"></a>location | `string` | A [runtime expression](#runtime-expression) that specifies the location of the parameter value.

This object MAY be extended with [Specification Extensions](#specification-extensions).

##### Parameter Object Example

```json
{
  "address": "user/{userId}/signedup",
  "parameters": {
    "userId": {
      "description": "Id of the user.",
      "location": "$message.payload#/user/id"
    }
  }
}
```

```yaml
address: user/{userId}/signedup
parameters:
  userId:
    description: Id of the user.
    location: $message.payload#/user/id
```




#### <a id="serverBindingsObject"></a>Server Bindings Object

Map describing protocol-specific definitions for a server.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a id="serverBindingsObjectHTTP"></a>`http` | [HTTP Server Binding](https://github.com/asyncapi/bindings/blob/master/http#user-content-server) | Protocol-specific information for an HTTP server.
<a id="serverBindingsObjectWebSockets"></a>`ws` | [WebSockets Server Binding](https://github.com/asyncapi/bindings/blob/master/websockets#user-content-server) | Protocol-specific information for a WebSockets server.
<a id="serverBindingsObjectKafka"></a>`kafka` | [Kafka Server Binding](https://github.com/asyncapi/bindings/blob/master/kafka#user-content-server) | Protocol-specific information for a Kafka server.
<a id="serverBindingsObjectAnypointMQ"></a>`anypointmq` | [Anypoint MQ Server Binding](https://github.com/asyncapi/bindings/blob/master/anypointmq#user-content-server) | Protocol-specific information for an Anypoint MQ server.
<a id="serverBindingsObjectAMQP"></a>`amqp` | [AMQP Server Binding](https://github.com/asyncapi/bindings/blob/master/amqp#user-content-server) | Protocol-specific information for an AMQP 0-9-1 server.
<a id="serverBindingsObjectAMQP1"></a>`amqp1` | [AMQP 1.0 Server Binding](https://github.com/asyncapi/bindings/blob/master/amqp1#user-content-server) | Protocol-specific information for an AMQP 1.0 server.
<a id="serverBindingsObjectMQTT"></a>`mqtt` | [MQTT Server Binding](https://github.com/asyncapi/bindings/blob/master/mqtt#user-content-server) | Protocol-specific information for an MQTT server.
<a id="serverBindingsObjectMQTT5"></a>`mqtt5` | [MQTT 5 Server Binding](https://github.com/asyncapi/bindings/blob/master/mqtt5#user-content-server) | Protocol-specific information for an MQTT 5 server.
<a id="serverBindingsObjectNATS"></a>`nats` | [NATS Server Binding](https://github.com/asyncapi/bindings/blob/master/nats#user-content-server) | Protocol-specific information for a NATS server.
<a id="serverBindingsObjectJMS"></a>`jms` | [JMS Server Binding](https://github.com/asyncapi/bindings/blob/master/jms#user-content-server) | Protocol-specific information for a JMS server.
<a id="serverBindingsObjectSNS"></a>`sns` | [SNS Server Binding](https://github.com/asyncapi/bindings/blob/master/sns#user-content-server) | Protocol-specific information for an SNS server.
<a id="serverBindingsObjectSolace"></a>`solace` | [Solace Server Binding](https://github.com/asyncapi/bindings/blob/master/solace#user-content-server) | Protocol-specific information for a Solace server.
<a id="serverBindingsObjectSQS"></a>`sqs` | [SQS Server Binding](https://github.com/asyncapi/bindings/blob/master/sqs#user-content-server) | Protocol-specific information for an SQS server.
<a id="serverBindingsObjectSTOMP"></a>`stomp` | [STOMP Server Binding](https://github.com/asyncapi/bindings/blob/master/stomp#user-content-server) | Protocol-specific information for a STOMP server.
<a id="serverBindingsObjectRedis"></a>`redis` | [Redis Server Binding](https://github.com/asyncapi/bindings/blob/master/redis#user-content-server) | Protocol-specific information for a Redis server.
<a id="serverBindingsObjectMercure"></a>`mercure` | [Mercure Server Binding](https://github.com/asyncapi/bindings/blob/master/mercure#user-content-server) | Protocol-specific information for a Mercure server.
<a id="serverBindingsObjectIBMMQ"></a>`ibmmq` | [IBM MQ Server Binding](https://github.com/asyncapi/bindings/blob/master/ibmmq#user-content-server-binding-object) | Protocol-specific information for an IBM MQ server.
<a id="serverBindingsObjectGooglePubSub"></a>`googlepubsub` | [Google Cloud Pub/Sub Server Binding](https://github.com/asyncapi/bindings/blob/master/googlepubsub#user-content-server) | Protocol-specific information for a Google Cloud Pub/Sub server.
<a id="serverBindingsObjectPulsar"></a>`pulsar` | [Pulsar Server Binding](https://github.com/asyncapi/bindings/tree/master/pulsar#user-content-server-binding-object) | Protocol-specific information for a Pulsar server.

This object MAY be extended with [Specification Extensions](#specification-extensions).



#### <a id="channelBindingsObject"></a>Channel Bindings Object

Map describing protocol-specific definitions for a channel.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a id="channelBindingsObjectHTTP"></a>`http` | [HTTP Channel Binding](https://github.com/asyncapi/bindings/blob/master/http/README.md#user-content-channel) | Protocol-specific information for an HTTP channel.
<a id="channelBindingsObjectWebSockets"></a>`ws` | [WebSockets Channel Binding](https://github.com/asyncapi/bindings/blob/master/websockets/README.md#user-content-channel) | Protocol-specific information for a WebSockets channel.
<a id="channelBindingsObjectKafka"></a>`kafka` | [Kafka Channel Binding](https://github.com/asyncapi/bindings/blob/master/kafka/README.md#user-content-channel) | Protocol-specific information for a Kafka channel.
<a id="channelBindingsObjectAnypointMQ"></a>`anypointmq` | [Anypoint MQ Channel Binding](https://github.com/asyncapi/bindings/blob/master/anypointmq/README.md#user-content-channel) | Protocol-specific information for an Anypoint MQ channel.
<a id="channelBindingsObjectAMQP"></a>`amqp` | [AMQP Channel Binding](https://github.com/asyncapi/bindings/blob/master/amqp/README.md#user-content-channel) | Protocol-specific information for an AMQP 0-9-1 channel.
<a id="channelBindingsObjectAMQP1"></a>`amqp1` | [AMQP 1.0 Channel Binding](https://github.com/asyncapi/bindings/blob/master/amqp1/README.md#user-content-channel) | Protocol-specific information for an AMQP 1.0 channel.
<a id="channelBindingsObjectMQTT"></a>`mqtt` | [MQTT Channel Binding](https://github.com/asyncapi/bindings/blob/master/mqtt/README.md#user-content-channel) | Protocol-specific information for an MQTT channel.
<a id="channelBindingsObjectMQTT5"></a>`mqtt5` | [MQTT 5 Channel Binding](https://github.com/asyncapi/bindings/blob/master/mqtt5#user-content-channel) | Protocol-specific information for an MQTT 5 channel.
<a id="channelBindingsObjectNATS"></a>`nats` | [NATS Channel Binding](https://github.com/asyncapi/bindings/blob/master/nats/README.md#user-content-channel) | Protocol-specific information for a NATS channel.
<a id="channelBindingsObjectJMS"></a>`jms` | [JMS Channel Binding](https://github.com/asyncapi/bindings/blob/master/jms/README.md#user-content-channel) | Protocol-specific information for a JMS channel.
<a id="channelBindingsObjectSNS"></a>`sns` | [SNS Channel Binding](https://github.com/asyncapi/bindings/blob/master/sns/README.md#user-content-channel) | Protocol-specific information for an SNS channel.
<a id="channelBindingsObjectSolace"></a>`solace` | [Solace Channel Binding](https://github.com/asyncapi/bindings/blob/master/solace#user-content-channel) | Protocol-specific information for a Solace channel.
<a id="channelBindingsObjectSQS"></a>`sqs` | [SQS Channel Binding](https://github.com/asyncapi/bindings/blob/master/sqs/README.md#user-content-channel) | Protocol-specific information for an SQS channel.
<a id="channelBindingsObjectSTOMP"></a>`stomp` | [STOMP Channel Binding](https://github.com/asyncapi/bindings/blob/master/stomp/README.md#user-content-channel) | Protocol-specific information for a STOMP channel.
<a id="channelBindingsObjectRedis"></a>`redis` | [Redis Channel Binding](https://github.com/asyncapi/bindings/blob/master/redis#user-content-channel) | Protocol-specific information for a Redis channel.
<a id="channelBindingsObjectMercure"></a>`mercure` | [Mercure Channel Binding](https://github.com/asyncapi/bindings/blob/master/mercure#user-content-channel) | Protocol-specific information for a Mercure channel.
<a id="channelBindingsObjectIBMMQ"></a>`ibmmq` | [IBM MQ Channel Binding](https://github.com/asyncapi/bindings/tree/master/ibmmq#user-content-channel-binding-object) | Protocol-specific information for an IBM MQ channel.
<a id="channelBindingsObjectGooglePubSub"></a>`googlepubsub` | [Google Cloud Pub/Sub Channel Binding](https://github.com/asyncapi/bindings/tree/master/googlepubsub#user-content-channel) | Protocol-specific information for a Google Cloud Pub/Sub channel.
<a id="channelBindingsObjectPulsar"></a>`pulsar` | [Pulsar Channel Binding](https://github.com/asyncapi/bindings/tree/master/pulsar#user-content-channel-binding-object) | Protocol-specific information for a Pulsar channel.

This object MAY be extended with [Specification Extensions](#specification-extensions).



#### <a id="operationBindingsObject"></a>Operation Bindings Object

Map describing protocol-specific definitions for an operation.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a id="operationBindingsObjectHTTP"></a>`http` | [HTTP Operation Binding](https://github.com/asyncapi/bindings/blob/master/http/README.md#user-content-operation) | Protocol-specific information for an HTTP operation.
<a id="operationBindingsObjectWebSockets"></a>`ws` | [WebSockets Operation Binding](https://github.com/asyncapi/bindings/blob/master/websockets/README.md#user-content-operation) | Protocol-specific information for a WebSockets operation.
<a id="operationBindingsObjectKafka"></a>`kafka` | [Kafka Operation Binding](https://github.com/asyncapi/bindings/blob/master/kafka/README.md#user-content-operation) | Protocol-specific information for a Kafka operation.
<a id="operationBindingsObjectAnypointMQ"></a>`anypointmq` | [Anypoint MQ Operation Binding](https://github.com/asyncapi/bindings/blob/master/anypointmq/README.md#user-content-operation) | Protocol-specific information for an Anypoint MQ operation.
<a id="operationBindingsObjectAMQP"></a>`amqp` | [AMQP Operation Binding](https://github.com/asyncapi/bindings/blob/master/amqp/README.md#user-content-operation) | Protocol-specific information for an AMQP 0-9-1 operation.
<a id="operationBindingsObjectAMQP1"></a>`amqp1` | [AMQP 1.0 Operation Binding](https://github.com/asyncapi/bindings/blob/master/amqp1/README.md#user-content-operation) | Protocol-specific information for an AMQP 1.0 operation.
<a id="operationBindingsObjectMQTT"></a>`mqtt` | [MQTT Operation Binding](https://github.com/asyncapi/bindings/blob/master/mqtt/README.md#user-content-operation) | Protocol-specific information for an MQTT operation.
<a id="operationBindingsObjectMQTT5"></a>`mqtt5` | [MQTT 5 Operation Binding](https://github.com/asyncapi/bindings/blob/master/mqtt5/README.md#user-content-operation) | Protocol-specific information for an MQTT 5 operation.
<a id="operationBindingsObjectNATS"></a>`nats` | [NATS Operation Binding](https://github.com/asyncapi/bindings/blob/master/nats/README.md#user-content-operation) | Protocol-specific information for a NATS operation.
<a id="operationBindingsObjectJMS"></a>`jms` | [JMS Operation Binding](https://github.com/asyncapi/bindings/blob/master/jms/README.md#user-content-operation) | Protocol-specific information for a JMS operation.
<a id="operationBindingsObjectSNS"></a>`sns` | [SNS Operation Binding](https://github.com/asyncapi/bindings/blob/master/sns/README.md#user-content-operation) | Protocol-specific information for an SNS operation.
<a id="operationBindingsObjectSolace"></a>`solace` | [Solace Operation Binding](https://github.com/asyncapi/bindings/blob/master/solace#user-content-operation) | Protocol-specific information for a Solace operation.
<a id="operationBindingsObjectSQS"></a>`sqs` | [SQS Operation Binding](https://github.com/asyncapi/bindings/blob/master/sqs/README.md#user-content-operation) | Protocol-specific information for an SQS operation.
<a id="operationBindingsObjectSTOMP"></a>`stomp` | [STOMP Operation Binding](https://github.com/asyncapi/bindings/blob/master/stomp/README.md#user-content-operation) | Protocol-specific information for a STOMP operation.
<a id="operationBindingsObjectRedis"></a>`redis` | [Redis Operation Binding](https://github.com/asyncapi/bindings/blob/master/redis#user-content-operation) | Protocol-specific information for a Redis operation.
<a id="operationBindingsObjectMercure"></a>`mercure` | [Mercure Operation Binding](https://github.com/asyncapi/bindings/blob/master/mercure#user-content-operation) | Protocol-specific information for a Mercure operation.
<a id="operationBindingsObjectGooglePubSub"></a>`googlepubsub` | [Google Cloud Pub/Sub Operation Binding](https://github.com/asyncapi/bindings/blob/master/googlepubsub#user-content-operation) | Protocol-specific information for a Google Cloud Pub/Sub operation.
<a id="operationBindingsObjectIBMMQ"></a>`ibmmq` | [IBM MQ Operation Binding](https://github.com/asyncapi/bindings/blob/master/ibmmq#user-content-operation-binding-object) | Protocol-specific information for an IBM MQ operation.
<a id="operationBindingsObjectPulsar"></a>`pulsar` | [Pulsar Operation Binding](https://github.com/asyncapi/bindings/tree/master/pulsar#user-content-operation-binding-fields) | Protocol-specific information for a Pulsar operation.

This object MAY be extended with [Specification Extensions](#specification-extensions).




#### <a id="messageBindingsObject"></a>Message Bindings Object

Map describing protocol-specific definitions for a message.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a id="messageBindingsObjectHTTP"></a>`http` | [HTTP Message Binding](https://github.com/asyncapi/bindings/blob/master/http/README.md#user-content-message) | Protocol-specific information for an HTTP message, i.e., a request or a response.
<a id="messageBindingsObjectWebSockets"></a>`ws` | [WebSockets Message Binding](https://github.com/asyncapi/bindings/blob/master/websockets/README.md#user-content-message) | Protocol-specific information for a WebSockets message.
<a id="messageBindingsObjectKafka"></a>`kafka` | [Kafka Message Binding](https://github.com/asyncapi/bindings/blob/master/kafka/README.md#user-content-message) | Protocol-specific information for a Kafka message.
<a id="messageBindingsObjectAnypointMQ"></a>`anypointmq` | [Anypoint MQ Message Binding](https://github.com/asyncapi/bindings/blob/master/anypointmq/README.md#user-content-message) | Protocol-specific information for an Anypoint MQ message.
<a id="messageBindingsObjectAMQP"></a>`amqp` | [AMQP Message Binding](https://github.com/asyncapi/bindings/blob/master/amqp/README.md#user-content-message) | Protocol-specific information for an AMQP 0-9-1 message.
<a id="messageBindingsObjectAMQP1"></a>`amqp1` | [AMQP 1.0 Message Binding](https://github.com/asyncapi/bindings/blob/master/amqp1/README.md#user-content-message) | Protocol-specific information for an AMQP 1.0 message.
<a id="messageBindingsObjectMQTT"></a>`mqtt` | [MQTT Message Binding](https://github.com/asyncapi/bindings/blob/master/mqtt/README.md#user-content-message) | Protocol-specific information for an MQTT message.
<a id="messageBindingsObjectMQTT5"></a>`mqtt5` | [MQTT 5 Message Binding](https://github.com/asyncapi/bindings/blob/master/mqtt5/README.md#user-content-message) | Protocol-specific information for an MQTT 5 message.
<a id="messageBindingsObjectNATS"></a>`nats` | [NATS Message Binding](https://github.com/asyncapi/bindings/blob/master/nats/README.md#user-content-message) | Protocol-specific information for a NATS message.
<a id="messageBindingsObjectJMS"></a>`jms` | [JMS Message Binding](https://github.com/asyncapi/bindings/blob/master/jms/README.md#user-content-message) | Protocol-specific information for a JMS message.
<a id="messageBindingsObjectSNS"></a>`sns` | [SNS Message Binding](https://github.com/asyncapi/bindings/blob/master/sns/README.md#user-content-message) | Protocol-specific information for an SNS message.
<a id="messageBindingsObjectSolace"></a>`solace` | [Solace Server Binding](https://github.com/asyncapi/bindings/blob/master/solace#user-content-message) | Protocol-specific information for a Solace message.
<a id="messageBindingsObjectSQS"></a>`sqs` | [SQS Message Binding](https://github.com/asyncapi/bindings/blob/master/sqs/README.md#user-content-message) | Protocol-specific information for an SQS message.
<a id="messageBindingsObjectSTOMP"></a>`stomp` | [STOMP Message Binding](https://github.com/asyncapi/bindings/blob/master/stomp/README.md#user-content-message) | Protocol-specific information for a STOMP message.
<a id="messageBindingsObjectRedis"></a>`redis` | [Redis Message Binding](https://github.com/asyncapi/bindings/blob/master/redis#user-content-message) | Protocol-specific information for a Redis message.
<a id="messageBindingsObjectMercure"></a>`mercure` | [Mercure Message Binding](https://github.com/asyncapi/bindings/blob/master/mercure#user-content-message) | Protocol-specific information for a Mercure message.
<a id="messageBindingsObjectIBMMQ"></a>`ibmmq` | [IBM MQ Message Binding](https://github.com/asyncapi/bindings/tree/master/ibmmq#user-content-message-binding-object) | Protocol-specific information for an IBM MQ message.
<a id="messageBindingsObjectGooglePubSub"></a>`googlepubsub` | [Google Cloud Pub/Sub Message Binding](https://github.com/asyncapi/bindings/tree/master/googlepubsub#user-content-message) | Protocol-specific information for a Google Cloud Pub/Sub message.
<a id="messageBindingsObjectPulsar"></a>`pulsar` | [Pulsar Message Binding](https://github.com/asyncapi/bindings/tree/master/pulsar#user-content-message-binding-fields) | Protocol-specific information for a Pulsar message.

This object MAY be extended with [Specification Extensions](#specification-extensions).







#### <a id="messageObject"></a>Message Object

Describes a message received on a given channel and operation.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a id="messageObjectHeaders"></a>headers | [Multi Format Schema Object](#user-content-multiFormatSchemaObject) &#user-content-124; [Schema Object](#user-content-schemaObject) &#user-content-124; [Reference Object](#user-content-referenceObject) | Schema definition of the application headers. Schema MUST be a map of key-value pairs. It **MUST NOT** define the protocol headers. If this is a [Schema Object](#user-content-schemaObject), then the `schemaFormat` will be assumed to be "application/vnd.aai.asyncapi+json;version=`asyncapi`" where the version is equal to the [AsyncAPI Version String](#asyncapi-version-string).
<a id="messageObjectPayload"></a>payload | [Multi Format Schema Object](#user-content-multiFormatSchemaObject) &#user-content-124; [Schema Object](#user-content-schemaObject) &#user-content-124; [Reference Object](#user-content-referenceObject) | Definition of the message payload. If this is a [Schema Object](#user-content-schemaObject), then the `schemaFormat` will be assumed to be "application/vnd.aai.asyncapi+json;version=`asyncapi`" where the version is equal to the [AsyncAPI Version String](#asyncapi-version-string). 
<a id="messageObjectCorrelationId"></a>correlationId | [Correlation ID Object](#user-content-correlationIdObject) &#user-content-124; [Reference Object](#reference-object) | Definition of the correlation ID used for message tracing or matching.
<a id="messageObjectContentType"></a>contentType | `string` | The content type to use when encoding/decoding a message's payload. The value MUST be a specific media type (e.g. `application/json`). When omitted, the value MUST be the one specified on the [defaultContentType](#default-content-type) field.
<a id="messageObjectName"></a>name | `string` | A machine-friendly name for the message.
<a id="messageObjectTitle"></a>title | `string` | A human-friendly title for the message.
<a id="messageObjectSummary"></a>summary | `string` | A short summary of what the message is about.
<a id="messageObjectDescription"></a>description | `string` | A verbose explanation of the message. [CommonMark syntax](https://spec.commonmark.org/) can be used for rich text representation.
<a id="messageObjectTags"></a>tags | [Tags Object](#tags-object) | A list of tags for logical grouping and categorization of messages.
<a id="messageObjectExternalDocs"></a>externalDocs | [External Documentation Object](#user-content-externalDocumentationObject) \| [Reference Object](#reference-object) | Additional external documentation for this message.
<a id="messageObjectBindings"></a>bindings | [Message Bindings Object](#user-content-messageBindingsObject) \| [Reference Object](#reference-object) | A map where the keys describe the name of the protocol and the values describe protocol-specific definitions for the message.
<a id="messageObjectExamples"></a>examples | [[Message Example Object](#message-example-object)] | List of examples.
<a id="messageObjectTraits"></a>traits | [[Message Trait Object](#user-content-messageTraitObject) &#user-content-124; [Reference Object](#user-content-referenceObject)] | A list of traits to apply to the message object. Traits MUST be merged using [traits merge mechanism](#user-content-traits-merge-mechanism). The resulting object MUST be a valid [Message Object](#message-object).

This object MAY be extended with [Specification Extensions](#specification-extensions).

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
  "payload": {
    "schemaFormat": "application/vnd.apache.avro+json;version=1.9.0",
    "schema": {
      "$ref": "path/to/user-create.avsc#/UserCreate"
    }
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
payload:
  schemaFormat: 'application/vnd.apache.avro+yaml;version=1.9.0'
  schema:
    $ref: 'path/to/user-create.avsc/#user-content-UserCreate'
```







#### <a id="messageTraitObject"></a>Message Trait Object

Describes a trait that MAY be applied to a [Message Object](#message-object). This object MAY contain any property from the [Message Object](#message-object), except `payload` and `traits`.

If you're looking to apply traits to an operation, see the [Operation Trait Object](#operation-trait-object).

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a id="messageTraitObjectHeaders"></a>headers | [Multi Format Schema Object](#user-content-multiFormatSchemaObject) &#user-content-124; [Schema Object](#user-content-schemaObject) &#user-content-124; [Reference Object](#user-content-referenceObject) | Schema definition of the application headers. Schema MUST be a map of key-value pairs. It **MUST NOT** define the protocol headers. If this is a [Schema Object](#user-content-schemaObject), then the `schemaFormat` will be assumed to be "application/vnd.aai.asyncapi+json;version=`asyncapi`" where the version is equal to the [AsyncAPI Version String](#asyncapi-version-string).
<a id="messageTraitObjectCorrelationId"></a>correlationId | [Correlation ID Object](#user-content-correlationIdObject) &#user-content-124; [Reference Object](#reference-object) | Definition of the correlation ID used for message tracing or matching.
<a id="messageTraitObjectContentType"></a>contentType | `string` | The content type to use when encoding/decoding a message's payload. The value MUST be a specific media type (e.g. `application/json`). When omitted, the value MUST be the one specified on the [defaultContentType](#default-content-type) field.
<a id="messageTraitObjectName"></a>name | `string` | A machine-friendly name for the message.
<a id="messageTraitObjectTitle"></a>title | `string` | A human-friendly title for the message.
<a id="messageTraitObjectSummary"></a>summary | `string` | A short summary of what the message is about.
<a id="messageTraitObjectDescription"></a>description | `string` | A verbose explanation of the message. [CommonMark syntax](https://spec.commonmark.org/) can be used for rich text representation.
<a id="messageTraitObjectTags"></a>tags | [Tags Object](#tags-object) | A list of tags for logical grouping and categorization of messages.
<a id="messageTraitObjectExternalDocs"></a>externalDocs | [External Documentation Object](#user-content-externalDocumentationObject) \| [Reference Object](#reference-object) | Additional external documentation for this message.
<a id="messageTraitObjectBindings"></a>bindings | [Message Bindings Object](#user-content-messageBindingsObject) \| [Reference Object](#reference-object) | A map where the keys describe the name of the protocol and the values describe protocol-specific definitions for the message.
<a id="messageTraitObjectExamples"></a>examples | [[Message Example Object](#message-example-object)] | List of examples.

This object MAY be extended with [Specification Extensions](#specification-extensions).

##### Message Trait Object Example

```json
{
  "contentType": "application/json"
}
```

```yaml
contentType: application/json
```

#### <a id="messageExampleObject"></a> Message Example Object

Message Example Object represents an example of a [Message Object](#message-object) and MUST contain either **headers** and/or **payload** fields.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a id="messageExampleObjectHeaders"></a>headers | `Map[string, any]` | The value of this field MUST validate against the [Message Object's headers](#user-content-messageObjectHeaders) field. 
<a id="messageExampleObjectPayload"></a>payload | `Map[string, any]` | The value of this field MUST validate against the [Message Object's payload](#user-content-messageObjectPayload) field.
<a id="messageExampleObjectName"></a>name | `string` | A machine-friendly name.
<a id="messageExampleObjectSummary"></a>summary | `string` |  A short summary of what the example is about.

This object MAY be extended with [Specification Extensions](#specification-extensions).

##### Message Example Object Example

```json
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
```

```yaml
name: SimpleSignup
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

#### <a id="tagsObject"></a>Tags Object

A Tags object is a list of [Tag Objects](#user-content-tagObject). An [Tag Object](#user-content-tagObject) in a list can be referenced by [Reference Object](#reference-object).

#### <a id="tagObject"></a>Tag Object

Allows adding meta data to a single tag.

##### Fixed Fields
Field Name | Type | Description
---|:---:|---
<a id="tagObjectName"></a>name | `string` | **REQUIRED.** The name of the tag.
<a id="tagObjectDescription"></a>description | `string` | A short description for the tag. [CommonMark syntax](https://spec.commonmark.org/) can be used for rich text representation.
<a id="tagObjectExternalDocs"></a>externalDocs | [External Documentation Object](#user-content-externalDocumentationObject) \| [Reference Object](#reference-object) | Additional external documentation for this tag.

This object MAY be extended with [Specification Extensions](#specification-extensions).

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







#### <a id="externalDocumentationObject"></a>External Documentation Object

Allows referencing an external resource for extended documentation.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a id="externalDocDescription"></a>description | `string` | A short description of the target documentation. [CommonMark syntax](https://spec.commonmark.org/) can be used for rich text representation.
<a id="externalDocUrl"></a>url | `string` | **REQUIRED.** The URL for the target documentation. This MUST be in the form of an absolute URL.

This object MAY be extended with [Specification Extensions](#specification-extensions).

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


#### <a id="referenceObject"></a>Reference Object

A simple object to allow referencing other components in the specification, internally and externally.

The Reference Object is defined by [JSON Reference](https://tools.ietf.org/html/draft-pbryan-zyp-json-ref-03) and follows the same structure, behavior and rules. A JSON Reference SHALL only be used to refer to a schema that is formatted in either JSON or YAML. In the case of a YAML-formatted Schema, the JSON Reference SHALL be applied to the JSON representation of that schema. The JSON representation SHALL be made by applying the conversion described [here](#format).

For this specification, reference resolution is done as defined by the JSON Reference specification and not by the JSON Schema specification.

##### Fixed Fields
Field Name | Type | Description
---|:---:|---
<a id="referenceRef"></a>$ref | `string` | **REQUIRED.** The reference string.

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

#### <a id="componentsObject"></a>Components Object

Holds a set of reusable objects for different aspects of the AsyncAPI specification.
All objects defined within the components object will have no effect on the API unless they are explicitly referenced from properties outside the components object.

##### Fixed Fields

Field Name | Type | Description
---|:---|--- 
<a id="componentsSchemas"></a> schemas | Map[`string`, [Multi Format Schema Object](#user-content-multiFormatSchemaObject) \| [Schema Object](#user-content-schemaObject) \| [Reference Object](#user-content-referenceObject)] | An object to hold reusable [Schema Object](#user-content-schemaObject). If this is a [Schema Object](#user-content-schemaObject), then the `schemaFormat` will be assumed to be "application/vnd.aai.asyncapi+json;version=`asyncapi`" where the version is equal to the [AsyncAPI Version String](#asyncapi-version-string).
<a id="componentsServers"></a> servers | Map[`string`, [Server Object](#server-object) \| [Reference Object](#user-content-referenceObject)] | An object to hold reusable [Server Objects](#server-object).
<a id="componentsChannels"></a> channels | Map[`string`, [Channel Object](#channel-object) \| [Reference Object](#user-content-referenceObject)] | An object to hold reusable [Channel Objects](#channel-object).
<a id="componentsOperations"></a> operations | Map[`string`, [Operation Object](#operation-object) \| [Reference Object](#user-content-referenceObject)] | An object to hold reusable [Operation Objects](#operation-object).
<a id="componentsMessages"></a> messages | Map[`string`, [Message Object](#message-object) \| [Reference Object](#user-content-referenceObject)] | An object to hold reusable [Message Objects](#message-object).
<a id="componentsSecuritySchemes"></a> securitySchemes| Map[`string`, [Security Scheme Object](#security-scheme-object) \| [Reference Object](#user-content-referenceObject)] | An object to hold reusable [Security Scheme Objects](#security-scheme-object).
<a id="componentsServerVariables"></a> serverVariables | Map[`string`, [Server Variable Object](#server-variable-object) \| [Reference Object](#user-content-referenceObject)] | An object to hold reusable [Server Variable Objects](#server-variable-object). 
<a id="componentsParameters"></a> parameters | Map[`string`, [Parameter Object](#parameter-object) \| [Reference Object](#user-content-referenceObject)] | An object to hold reusable [Parameter Objects](#parameter-object).
<a id="componentsCorrelationIDs"></a> correlationIds | Map[`string`, [Correlation ID Object](#correlation-id-object) \| [Reference Object](#user-content-referenceObject)] | An object to hold reusable [Correlation ID Objects](#correlation-id-object).
<a id="componentsReplies"></a>replies | Map[`string`, [Operation Reply Object](#operation-reply-object) \| [Reference Object](#user-content-referenceObject)] | An object to hold reusable [Operation Reply Objects](#operation-reply-object).
<a id="componentsReplyAddresses"></a> replyAddresses | Map[`string`, [Operation Reply Address Object](#operation-reply-address-object) &#user-content-124; [Reference Object](#user-content-referenceObject)] | An object to hold reusable [Operation Reply Address Objects](#operation-reply-address-object).
<a id="componentsExternalDocs"></a> externalDocs | Map[`string`, [External Documentation Object](#external-documentation-object) \| [Reference Object](#user-content-referenceObject)] | An object to hold reusable [External Documentation Objects](#external-documentation-object).
<a id="componentsTags"></a> tags | Map[`string`, [Tag Object](#tag-object) \| [Reference Object](#user-content-referenceObject)] | An object to hold reusable [Tag Objects](#tag-object).
<a id="componentsOperationTraits"></a> operationTraits | Map[`string`, [Operation Trait Object](#operation-trait-object) \| [Reference Object](#user-content-referenceObject)]  | An object to hold reusable [Operation Trait Objects](#operation-trait-object).
<a id="componentsMessageTraits"></a> messageTraits | Map[`string`, [Message Trait Object](#message-trait-object) \| [Reference Object](#user-content-referenceObject)]  | An object to hold reusable [Message Trait Objects](#message-trait-object).
<a id="componentsServerBindings"></a> serverBindings | Map[`string`, [Server Bindings Object](#server-bindings-object) \| [Reference Object](#user-content-referenceObject)]  | An object to hold reusable [Server Bindings Objects](#server-bindings-object).
<a id="componentsChannelBindings"></a> channelBindings | Map[`string`, [Channel Bindings Object](#channel-bindings-object) \| [Reference Object](#user-content-referenceObject)]  | An object to hold reusable [Channel Bindings Objects](#channel-bindings-object).
<a id="componentsOperationBindings"></a> operationBindings | Map[`string`, [Operation Bindings Object](#operation-bindings-object) \| [Reference Object](#user-content-referenceObject)]  | An object to hold reusable [Operation Bindings Objects](#operation-bindings-object).
<a id="componentsMessageBindings"></a> messageBindings | Map[`string`, [Message Bindings Object](#message-bindings-object) \| [Reference Object](#user-content-referenceObject)]  | An object to hold reusable [Message Bindings Objects](#message-bindings-object).

This object MAY be extended with [Specification Extensions](#specification-extensions).

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
{
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
      },
      "AvroExample": {
        "schemaFormat": "application/vnd.apache.avro+json;version=1.9.0",
        "schema": {
          "$ref": "path/to/user-create.avsc#/UserCreate"
        }
      }
    },
    "servers": {
      "development": {
        "host": "{stage}.in.mycompany.com:{port}",
        "description": "RabbitMQ broker",
        "protocol": "amqp",
        "protocolVersion": "0-9-1",
        "variables": {
          "stage": {
            "$ref": "#/components/serverVariables/stage"
          },
          "port": {
            "$ref": "#/components/serverVariables/port"
          }
        }
      }
    },
    "serverVariables": {
      "stage": {
        "default": "demo",
        "description": "This value is assigned by the service provider, in this example `mycompany.com`"
      },
      "port": {
        "enum": ["5671", "5672"],
        "default": "5672"
      }
    },
    "channels": {
      "user/signedup": {
        "subscribe": {
          "message": {
            "$ref": "#/components/messages/userSignUp"
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
        "description": "Id of the user."
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
    AvroExample:
      schemaFormat: application/vnd.apache.avro+json;version=1.9.0
      schema:
        $ref: 'path/to/user-create.avsc/#user-content-UserCreate'
  servers:
    development:
      host: "{stage}.in.mycompany.com:{port}"
      description: RabbitMQ broker
      protocol: amqp
      protocolVersion: 0-9-1
      variables:
        stage:
          $ref: "#/components/serverVariables/stage"
        port:
          $ref: "#/components/serverVariables/port"
  serverVariables:
    stage:
      default: demo
      description: This value is assigned by the service provider, in this example `mycompany.com`
    port:
      enum: ["5671", "5672"]
      default: "5672"
  channels:
    user/signedup:
      subscribe:
        message:
          $ref: "#/components/messages/userSignUp"
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

#### <a id="multiFormatSchemaObject"></a>Multi Format Schema Object

The Multi Format Schema Object represents a schema definition. It differs from the [Schema Object](#schema-object) in that it supports multiple schema formats or languages (e.g., JSON Schema, Avro, etc.).

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a id="multiFormatSchemaObjectSchemaFormat"></a>schemaFormat | `string` | **Required**. A string containing the name of the schema format that is used to define the information. If `schemaFormat` is missing, it MUST default to `application/vnd.aai.asyncapi+json;version={{asyncapi}}` where `{{asyncapi}}` matches the [AsyncAPI Version String](#user-content-A2SVersionString). In such a case, this would make the Multi Format Schema Object equivalent to the [Schema Object](#user-content-schemaObject). When using [Reference Object](#reference-object) within the schema, the `schemaFormat` of the resource being referenced MUST match the `schemaFormat` of the schema that contains the initial reference. For example, if you reference Avro `schema`, then `schemaFormat` of referencing resource and the resource being reference MUST match. <br/><br/>Check out the [supported schema formats table](#user-content-multiFormatSchemaFormatTable) for more information. Custom values are allowed but their implementation is OPTIONAL. A custom value MUST NOT refer to one of the schema formats listed in the [table](#user-content-multiFormatSchemaFormatTable).<br/><br/>When using [Reference Objects](#reference-object) within the schema, the `schemaFormat` of the referenced resource MUST match the `schemaFormat` of the schema containing the reference.
<a id="multiFormatSchemaObjectSchema"></a>schema | `any` | **Required**. Definition of the message payload. It can be of any type but defaults to [Schema Object](#user-content-schemaObject). It MUST match the schema format defined in [`schemaFormat`](#user-content-multiFormatSchemaObjectSchemaFormat), including the encoding type. E.g., Avro should be inlined as either a YAML or JSON object instead of as a string to be parsed as YAML or JSON. Non-JSON-based schemas (e.g., Protobuf or XSD) MUST be inlined as a string.

This object MAY be extended with [Specification Extensions](#specification-extensions).

##### <a id="multiFormatSchemaFormatTable"></a>Schema formats table

The following table contains a set of values that every implementation MUST support.

Name | Allowed values | Notes
---|:---:|---
[AsyncAPI 3.0.0 Schema Object](#schema-object) | `application/vnd.aai.asyncapi;version=3.0.0`, `application/vnd.aai.asyncapi+json;version=3.0.0`, `application/vnd.aai.asyncapi+yaml;version=3.0.0` | This is the default when a `schemaFormat` is not provided.
[JSON Schema Draft 07](https://json-schema.org/specification-links.html#user-content-draft-7) | `application/schema+json;version=draft-07`, `application/schema+yaml;version=draft-07` |

The following table contains a set of values that every implementation is RECOMMENDED to support.

Name | Allowed values | Notes
---|:---:|---
[Avro 1.9.0 schema](https://avro.apache.org/docs/1.9.0/spec.html#user-content-schemas) | `application/vnd.apache.avro;version=1.9.0`, `application/vnd.apache.avro+json;version=1.9.0`, `application/vnd.apache.avro+yaml;version=1.9.0` |
[OpenAPI 3.0.0 Schema Object](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#user-content-schemaObject) | `application/vnd.oai.openapi;version=3.0.0`, `application/vnd.oai.openapi+json;version=3.0.0`, `application/vnd.oai.openapi+yaml;version=3.0.0` |
[RAML 1.0 data type](https://github.com/raml-org/raml-spec/blob/master/versions/raml-10/raml-10.md/) | `application/raml+yaml;version=1.0` |
[Protocol Buffers](https://protobuf.dev/) | `application/vnd.google.protobuf;version=2`, `application/vnd.google.protobuf;version=3` |


#### <a id="schemaObject"></a>Schema Object

The Schema Object allows the definition of input and output data types.
These types can be objects, but also primitives and arrays. This object is a superset of the [JSON Schema Specification Draft 07](https://json-schema.org/). The empty schema (which allows any instance to validate) MAY be represented by the `boolean` value `true` and a schema which allows no instance to validate MAY be represented by the `boolean` value `false`.

Further information about the properties can be found in [JSON Schema Core](https://tools.ietf.org/html/draft-handrews-json-schema-01) and [JSON Schema Validation](https://tools.ietf.org/html/draft-handrews-json-schema-validation-01).
Unless stated otherwise, the property definitions follow the JSON Schema specification as referenced here. For other formats (e.g., Avro, RAML, etc) see [Multi Format Schema Object](#multiFormatSchemaObject).

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
- pattern (This string SHOULD be a valid regular expression, according to the [ECMA 262 regular expression](https://www.ecma-international.org/ecma-262/5.1/#user-content-sec-7.8.5) dialect)
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

- description - [CommonMark syntax](https://spec.commonmark.org/) can be used for rich text representation.
- format - See [Data Type Formats](#data-type-formats) for further details. While relying on JSON Schema's defined formats, the AsyncAPI Specification offers a few additional predefined formats.
- default - Use it to specify that property has a predefined value if no other value is present. Unlike JSON Schema, the value MUST conform to the defined type for the Schema Object defined at the same level. For example, of `type` is `string`, then `default` can be `"foo"` but cannot be `1`.

Alternatively, any time a Schema Object can be used, a [Reference Object](#reference-object) can be used in its place. This allows referencing definitions in place of defining them inline. It is appropriate to clarify that the `$ref` keyword MUST follow the behavior described by [Reference Object](#reference-object) instead of the one in [JSON Schema definition](https://json-schema.org/understanding-json-schema/structuring.html#user-content-ref).

In addition to the JSON Schema fields, the following AsyncAPI vocabulary fields MAY be used for further schema documentation:

##### Fixed Fields
Field Name | Type | Description
---|:---:|---
<a id="schemaObjectDiscriminator"></a>discriminator | `string` | Adds support for polymorphism. The discriminator is the schema property name that is used to differentiate between other schema that inherit this schema. The property name used MUST be defined at this schema and it MUST be in the `required` property list. When used, the value MUST be the name of this schema or any schema that inherits it. See [Composition and Inheritance](#composition-and-inheritance-(polymorphism)) for more details.
<a id="schemaObjectExternalDocs"></a>externalDocs | [External Documentation Object](#user-content-externalDocumentationObject) \| [Reference Object](#reference-object) | Additional external documentation for this schema.
<a id="schemaObjectDeprecated"></a> deprecated | `boolean` | Specifies that a schema is deprecated and SHOULD be transitioned out of usage. Default value is `false`.

This object MAY be extended with [Specification Extensions](#specification-extensions).

###### <a id="schemaComposition"></a>Composition and Inheritance (Polymorphism)

The AsyncAPI Specification allows combining and extending model definitions using the `allOf` property of JSON Schema, in effect offering model composition.
`allOf` takes in an array of object definitions that are validated *independently* but together compose a single object.

While composition offers model extensibility, it does not imply a hierarchy between the models.
To support polymorphism, AsyncAPI Specification adds the support of the `discriminator` field.
When used, the `discriminator` will be the name of the property used to decide which schema definition is used to validate the structure of the model.
As such, the `discriminator` field MUST be a required field.
There are two ways to define the value of a discriminator for an inheriting instance.

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
  "examples": [
    {
      "name": "Puma",
      "id": 1
    }
  ]
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
              "type": "string"
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





#### <a id="securitySchemeObject"></a>Security Scheme Object

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
<a id="securitySchemeObjectType"></a>type | `string` | Any | **REQUIRED**. The type of the security scheme. Valid values are `"userPassword"`, `"apiKey"`, `"X509"`, `"symmetricEncryption"`, `"asymmetricEncryption"`, `"httpApiKey"`, `"http"`, `"oauth2"`, `"openIdConnect"`, `"plain"`, `"scramSha256"`, `"scramSha512"`, and `"gssapi"`.
<a id="securitySchemeObjectDescription"></a>description | `string` | Any | A short description for security scheme. [CommonMark syntax](https://spec.commonmark.org/) MAY be used for rich text representation.
<a id="securitySchemeObjectName"></a>name | `string` | `httpApiKey` | **REQUIRED**. The name of the header, query or cookie parameter to be used.
<a id="securitySchemeObjectIn"></a>in | `string` | `apiKey` \| `httpApiKey` | **REQUIRED**. The location of the API key. Valid values are `"user"` and `"password"` for `apiKey` and `"query"`, `"header"` or `"cookie"` for `httpApiKey`.
<a id="securitySchemeObjectScheme"></a>scheme | `string` | `http` | **REQUIRED**. The name of the HTTP Authorization scheme to be used in the [Authorization header as defined in RFC7235](https://tools.ietf.org/html/rfc7235#user-content-section-5.1).
<a id="securitySchemeObjectBearerFormat"></a>bearerFormat | `string` | `http` (`"bearer"`) | A hint to the client to identify how the bearer token is formatted.  Bearer tokens are usually generated by an authorization server, so this information is primarily for documentation purposes.
<a id="securitySchemeFlows"></a>flows | [OAuth Flows Object](#oauth-flows-object) | `oauth2` | **REQUIRED**. An object containing configuration information for the flow types supported.
<a id="securitySchemeOpenIdConnectUrl"></a>openIdConnectUrl | `string` | `openIdConnect` | **REQUIRED**. OpenId Connect URL to discover OAuth2 configuration values. This MUST be in the form of an absolute URL.
<a id="securitySchemeScopes"></a>scopes | [`string`] | `oauth2` \| `openIdConnect` | List of the needed scope names. An empty array means no scopes are needed.

This object MAY be extended with [Specification Extensions](#specification-extensions).

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
type: apiKey
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
  "bearerFormat": "JWT"
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
      "availableScopes": {
        "write:pets": "modify pets in your account",
        "read:pets": "read your pets"
      }
    }
  },
  "scopes": [
    "write:pets"
  ]
}
```

```yaml
type: oauth2
flows:
  implicit:
    authorizationUrl: https://example.com/api/oauth/dialog
    availableScopes:
      write:pets: modify pets in your account
      read:pets: read your pets
scopes:
  - 'write:pets'
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

#### <a id="oauthFlowsObject"></a>OAuth Flows Object

Allows configuration of the supported OAuth Flows.

##### Fixed Fields
Field Name | Type | Description
---|:---:|---
<a id="oauthFlowsImplicit"></a>implicit| [OAuth Flow Object](#oauth-flow-object) | Configuration for the OAuth Implicit flow.
<a id="oauthFlowsPassword"></a>password| [OAuth Flow Object](#oauth-flow-object) | Configuration for the OAuth Resource Owner Protected Credentials flow.
<a id="oauthFlowsClientCredentials"></a>clientCredentials| [OAuth Flow Object](#oauth-flow-object) | Configuration for the OAuth Client Credentials flow.
<a id="oauthFlowsAuthorizationCode"></a>authorizationCode| [OAuth Flow Object](#oauth-flow-object) | Configuration for the OAuth Authorization Code flow.

This object MAY be extended with [Specification Extensions](#specification-extensions).

#### <a id="oauthFlowObject"></a>OAuth Flow Object

Configuration details for a supported OAuth Flow

##### Fixed Fields
Field Name | Type | Applies To | Description
---|:---:|---|---
<a id="oauthFlowAuthorizationUrl"></a>authorizationUrl | `string` | `oauth2` (`"implicit"`, `"authorizationCode"`) | **REQUIRED**. The authorization URL to be used for this flow. This MUST be in the form of an absolute URL.
<a id="oauthFlowTokenUrl"></a>tokenUrl | `string` | `oauth2` (`"password"`, `"clientCredentials"`, `"authorizationCode"`) | **REQUIRED**. The token URL to be used for this flow. This MUST be in the form of an absolute URL.
<a id="oauthFlowRefreshUrl"></a>refreshUrl | `string` | `oauth2` | The URL to be used for obtaining refresh tokens. This MUST be in the form of an absolute URL.
<a id="oauthFlowScopes"></a>availableScopes | Map[`string`, `string`] | `oauth2` | **REQUIRED**. The available scopes for the OAuth2 security scheme. A map between the scope name and a short description for it.

This object MAY be extended with [Specification Extensions](#specification-extensions).

##### OAuth Flow Object Examples

```JSON
{
  "authorizationUrl": "https://example.com/api/oauth/dialog",
  "tokenUrl": "https://example.com/api/oauth/token",
  "availableScopes": {
    "write:pets": "modify pets in your account",
    "read:pets": "read your pets"
  }
}
```

```YAML
authorizationUrl: https://example.com/api/oauth/dialog
tokenUrl: https://example.com/api/oauth/token
availableScopes:
  write:pets: modify pets in your account
  read:pets: read your pets
```



### <a id="correlationIdObject"></a>Correlation ID Object

An object that specifies an identifier at design time that can used for message tracing and correlation.

For specifying and computing the location of a Correlation ID, a [runtime expression](#runtime-expression) is used.

##### Fixed Fields

Field Name | Type | Description
---|:---|---
description | `string` | An optional description of the identifier. [CommonMark syntax](https://spec.commonmark.org/) can be used for rich text representation.
location | `string` | **REQUIRED.** A [runtime expression](#runtime-expression) that specifies the location of the correlation ID.

This object MAY be extended with [Specification Extensions](#specification-extensions).

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

### <a id="runtimeExpression"></a>Runtime Expression

A runtime expression allows values to be defined based on information that will be available within the message.
This mechanism is used by [Correlation ID Object](#user-content-correlationIdObject) and [Operation Reply Address Object](#operation-reply-address-object).

The runtime expression is defined by the following [ABNF](https://tools.ietf.org/html/rfc5234) syntax:

```
      expression = ( "$message" "." source )
      source = ( header-reference | payload-reference )
      header-reference = "header" ["#" fragment]
      payload-reference = "payload" ["#" fragment]
      fragment = a JSON Pointer [RFC 6901](https://tools.ietf.org/html/rfc6901)
```

The table below provides examples of runtime expressions and examples of their use in a value:

##### <a id="runtimeExpressionExamples"></a>Examples

Source Location | Example expression  | Notes
---|:---|:---|
Message Header Property | `$message.header#/MQMD/CorrelId` | Correlation ID is set using the `CorrelId` value from the `MQMD` header.
Message Payload Property | `$message.payload#/messageId` | Correlation ID is set using the `messageId` value from the message payload.

Runtime expressions preserve the type of the referenced value.

### <a id="traitsMergeMechanism"></a>Traits Merge Mechanism

Traits MUST be merged with the target object using the [JSON Merge Patch](https://tools.ietf.org/html/rfc7386) algorithm in the same order they are defined. A property on a trait MUST NOT override the same property on the target object.

#### Example

An object like the following:

```yaml
description: A longer description.
traits:
  - name: UserSignup
    description: Description from trait.
  - tags:
      - name: user
```

Would look like the following after applying traits:

```yaml
name: UserSignup
description: A longer description.
tags:
  - name: user
```

### <a id="specificationExtensions"></a>Specification Extensions

While the AsyncAPI Specification tries to accommodate most use cases, additional data can be added to extend the specification at certain points.

The extensions properties are implemented as patterned fields that are always prefixed by `"x-"`.

Field Pattern | Type | Description
---|:---:|---
<a id="infoExtensions"></a>`^x-[\w\d\-\_]+$` | Any | Allows extensions to the AsyncAPI Schema. The field name MUST begin with `x-`, for example, `x-internal-id`. The value can be `null`, a primitive, an array or an object. Can have any valid JSON format value.

The extensions may or may not be supported by the available tooling, but those may be extended as well to add requested support (if tools are internal or open-sourced).

### <a id="dataTypeFormat"></a>Data Type Formats

Primitives have an optional modifier property: `format`.
The AsyncAPI specification uses several known formats to more finely define the data type being used.
However, the `format` property is an open `string`-valued property, and can have any value to support documentation needs.
Formats such as `"email"`, `"uuid"`, etc., can be used even though they are not defined by this specification.
Types that are not accompanied by a `format` property follow their definition from the JSON Schema.
Tools that do not recognize a specific `format` MAY default back to the `type` alone, as if the `format` was not specified.

The formats defined by the AsyncAPI Specification are:


Common Name | `type` | [`format`](#data-type-formats) | Comments
----------- | ------ | -------- | --------
integer | `integer` | `int32` | signed 32 bits
long | `integer` | `int64` | signed 64 bits
float | `number` | `float` | |
double | `number` | `double` | |
string | `string` | | |
byte | `string` | `byte` | base64 encoded characters
binary | `string` | `binary` | any sequence of octets
boolean | `boolean` | | |
date | `string` | `date` | As defined by `full-date` - [RFC3339](https://www.rfc-editor.org/rfc/rfc3339.html#user-content-section-5.6)
dateTime | `string` | `date-time` | As defined by `date-time` - [RFC3339](https://www.rfc-editor.org/rfc/rfc3339.html#user-content-section-5.6)
password | `string` | `password` | Used to hint UIs the input needs to be obscured.
