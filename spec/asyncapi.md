# AsyncAPI Specification

## Attribution

Part of this content has been taken from the great work done by the folks at the [OpenAPI Initiative](https://openapis.org).

### Version 3.0.0

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [RFC 2119](https://www.ietf.org/rfc/rfc2119.txt).

The AsyncAPI Specification is licensed under [The Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0.html).

## Introduction

The AsyncAPI Specification is a project used to describe message-driven APIs in a machine-readable format. It’s protocol-agnostic, so you can use it for APIs that work over any protocol (e.g., AMQP, MQTT, WebSockets, Kafka, STOMP, HTTP, Mercure, etc).

The AsyncAPI Specification defines a set of fields that can be used in an AsyncAPI document to describe an [application](#definitions-application)'s API. The document may reference other files for additional details or shared fields, but it is typically a single, primary document that encapsulates the API description.

The AsyncAPI document SHOULD describe the operations an [application](#definitions-application) performs. For instance, consider the following AsyncAPI definition snippet:

```yaml
channels:
  userSignedUp:
    # ...(redacted for brevity)
operations:
  onUserSignedUp:
    action: receive
    channel:
      $ref: '#/channels/userSignedUp'
```

It means that the [application](#definitions-application) will receive messages from  the `userSignedUp` [channel](#definitions-channel).

**The AsyncAPI specification does not assume any kind of software topology, architecture or pattern.** Therefore, a server MAY be a message broker, a web server or any other kind of computer program capable of sending and/or receiving data. However, AsyncAPI offers a mechanism called "bindings" that aims to help with more specific information about the protocol.

It's NOT RECOMMENDED to derive a [receiver](#definitions-receiver) AsyncAPI document from a [sender](#definitions-sender) one or vice versa. There are no guarantees that the channel used by an application to receive messages will be the same channel where another application is sending them. Also, certain fields in the document like `summary`, `description`, and the id of the operation might stop making sense. For instance, given the following receiver snippet:

```yaml
operations:
  onUserSignedUp:
    summary: On user signed up.
    description: Event received when a user signed up on the product.
    action: receive
    channel:
      $ref: '#/channels/userSignedUp'
```

We can't automatically assume that an _opposite_ application exists by simply replacing `receive` with `send`:

```yaml
operations:
  onUserSignedUp: # <-- This doesn't make sense now. Should be something like sendUserSignedUp.
    summary: On user signed up. # <-- This doesn't make sense now. Should say something like "Sends a user signed up event".
    description: Event received when a user signed up on the product. # <-- This doesn't make sense now. Should speak about sending an event, not receiving it.
    action: send
    channel:
      $ref: '#/channels/userSignedUp'
```

Aside from the issues mentioned above, there may also be infrastructure configuration that is not represented here. For instance, a system may use a read-only channel for receiving messages, a different one for sending them, and an intermediary process that will forward messages from one channel to the other.


## <a name="definitions"></a>Definitions

### <a name="definitions-server"></a>Server

A server MAY be a message broker that is capable of sending and/or receiving between a [sender](#definitions-sender) and [receiver](#definitions-receiver). A server MAY be a service with WebSocket API that enables message-driven communication between browser-to-server or server-to-server.

### <a name="definitions-application"></a>Application

An application is any kind of computer program or a group of them. It MUST be a [sender](#definitions-sender), a [receiver](#definitions-receiver), or both. An application MAY be a microservice, IoT device (sensor), mainframe process, message broker, etc. An application MAY be written in any number of different programming languages as long as they support the selected [protocol](#definitions-protocol). An application MUST also use a protocol supported by the [server](#definitions-server) in order to connect and exchange [messages](#definitions-message), or expose the protocol described in the AsyncAPI document.

### <a name="definitions-sender"></a>Sender

A sender is a type of application, that is sending [messages](#definitions-message) to [channels](#definitions-channel). A sender MAY send to multiple channels depending on the [server](#definitions-server), protocol, and use-case pattern.

### <a name="definitions-receiver"></a>Receiver

A receiver is a type of application that is receiving [messages](#definitions-message) from [channels](#definitions-channel). A receiver MAY receive from multiple channels depending on the [server](#definitions-server), protocol, and the use-case pattern. A receiver MAY forward a received message further without changing it. A receiver MAY act as a consumer and react to the message. A receiver MAY act as a processor that, for example, aggregates multiple messages in one and forwards them.

### <a name="definitions-message"></a>Message

A message is the mechanism by which information is exchanged via a channel between [servers](#definitions-server) and applications. A message MAY contain a payload and MAY also contain headers. The headers MAY be subdivided into [protocol](#definitions-protocol)-defined headers and header properties defined by the application which can act as supporting metadata. The payload contains the data, defined by the application, which MUST be serialized into a format (JSON, XML, Avro, binary, etc.). Since a message is a generic mechanism, it can support multiple interaction patterns such as event, command, request, or response.

### <a name="definitions-channel"></a>Channel

A channel is an addressable component, made available by the [server](#definitions-server), for the organization of [messages](#definitions-message). [Sender](#definitions-sender) applications send messages to channels and [receiver](#definitions-receiver) applications receive messages from channels. [Servers](#definitions-server) MAY support many channel instances, allowing messages with different content to be addressed to different channels. Depending on the [server](#definitions-server) implementation, the channel MAY be included in the message via protocol-defined headers.

### <a name="definitions-protocol"></a>Protocol

A protocol is the mechanism (wireline protocol or API) by which [messages](#definitions-message) are exchanged between the application and the [channel](#definitions-channel). Example protocols include, but are not limited to, AMQP, HTTP, JMS, Kafka, Anypoint MQ, MQTT, Solace, STOMP, Mercure, WebSocket, Google Pub/Sub, Pulsar.  

### <a name="definitions-bindings"></a>Bindings

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

In order to preserve the ability to round-trip between YAML and JSON formats, YAML version [1.2](https://www.yaml.org/spec/1.2/spec.html) is recommended along with some additional constraints:

- Tags MUST be limited to those allowed by the [JSON Schema ruleset](https://www.yaml.org/spec/1.2/spec.html#id2803231)
- Keys used in YAML maps MUST be limited to a scalar string, as defined by the YAML Failsafe schema ruleset

### <a name="file-structure"></a>File Structure

An AsyncAPI document MAY be made up of a single document or be divided into multiple,
connected parts at the discretion of the author. In the latter case, [Reference Objects](#reference-object) are used.

It is important to note that everything that is defined in an AsyncAPI document MUST be used by the implemented [Application](#definitions-application), with the exception of the [Components Object](#components-object). Everything that is defined inside the Components Object represents a resource that MAY or MAY NOT be used by the implemented [Application](#definitions-application).

By convention, the AsyncAPI Specification (A2S) file is named `asyncapi.json` or `asyncapi.yaml`.

### <a name="absolute-urls"></a>Absolute URLs

Unless specified otherwise, all properties that are absolute URLs are defined by [RFC3986, section 4.3](https://datatracker.ietf.org/doc/html/rfc3986#section-4.3).

### <a name="schema"></a>Schema

#### <a name="a2s-object"></a>AsyncAPI Object

This is the root document object for the API specification.
It combines resource listing and API declaration together into one document.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a name="a2s-asyncAPI"></a>asyncapi | [AsyncAPI Version String](#a2s-version-string) | **REQUIRED.** Specifies the AsyncAPI Specification version being used. It can be used by tooling Specifications and clients to interpret the version. The structure shall be `major`.`minor`.`patch`, where `patch` versions _must_ be compatible with the existing `major`.`minor` tooling. Typically patch versions will be introduced to address errors in the documentation, and tooling should typically be compatible with the corresponding `major`.`minor` (1.0.*). Patch versions will correspond to patches of this document.
<a name="a2s-id"></a>id | [Identifier](#a2s-id-string) | Identifier of the [application](#definitions-application) the AsyncAPI document is defining.
<a name="a2s-info"></a>info | [Info Object](#info-object) | **REQUIRED.** Provides metadata about the API. The metadata can be used by the clients if needed.
<a name="a2s-servers"></a>servers | [Servers Object](#servers-object) | Provides connection details of servers.
<a name="a2s-default-content-type"></a>defaultContentType | [Default Content Typ(#default-content-type-string) | Default content type to use when encoding/decoding a message's payload.
<a name="a2s-channels"></a>channels | [Channels Object](#channels-object) | The channels used by this [application](#definitions-application).
<a name="a2s-operations"></a>operations | [Operations Object](#operations-object) | The operations this [application](#definitions-application) MUST implement.
<a name="a2s-components"></a>components | [Components Object](#components-object) | An element to hold various reusable objects for the specification. Everything that is defined inside this object represents a resource that MAY or MAY NOT be used in the rest of the document and MAY or MAY NOT be used by the implemented [Application](#definitions-application).

This object MAY be extended with [Specification Extensions](#specification-extensions).

#### <a name="a2s-version-string"></a>AsyncAPI Version String

The version string signifies the version of the AsyncAPI Specification that the document complies to.
The format for this string _must_ be `major`.`minor`.`patch`.  The `patch` _may_ be suffixed by a hyphen and extra alphanumeric characters.

A `major`.`minor` shall be used to designate the AsyncAPI Specification version, and will be considered compatible with the AsyncAPI Specification specified by that `major`.`minor` version.
The patch version will not be considered by tooling, making no distinction between `1.0.0` and `1.0.1`.

In subsequent versions of the AsyncAPI Specification, care will be given such that increments of the `minor` version should not interfere with operations of tooling developed to a lower minor version. Thus a hypothetical `1.1.0` specification should be usable with tooling designed for `1.0.0`.

#### <a name="a2s-id-string"></a>Identifier

This field represents a unique universal identifier of the [application](#definitions-application) the AsyncAPI document is defining. It must conform to the URI format, according to [RFC3986](https://tools.ietf.org/html/rfc3986).

It is RECOMMENDED to use a [URN](https://tools.ietf.org/html/rfc8141) to globally and uniquely identify the application during long periods of time, even after it becomes unavailable or ceases to exist.

##### Examples

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

#### <a name="info-object"></a>Info Object

The object provides metadata about the API.
The metadata can be used by the clients if needed.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a name="info-object-title"></a>title | `string` | **REQUIRED.** The title of the application.
<a name="info-object-version"></a>version | `string` | **REQUIRED** Provides the version of the application API (not to be confused with the specification version).
<a name="info-object-description"></a>description | `string` | A short description of the application. [CommonMark syntax](https://spec.commonmark.org/) can be used for rich text representation.
<a name="info-object-terms-of-service"></a>termsOfService | `string` | A URL to the Terms of Service for the API. This MUST be in the form of an absolute URL.
<a name="info-object-contact"></a>contact | [Contact Object](#contact-object) | The contact information for the exposed API.
<a name="info-object-license"></a>license | [License Object](#license-object) | The license information for the exposed API.
<a name="info-object-tags"></a>tags | [Tags Object](#tags-object) | A list of tags for application API documentation control. Tags can be used for logical grouping of applications.
<a name="info-object-external-docs"></a>externalDocs | [External Documentation Object](#external-documentation-object) \| [Reference Object](#reference-object) | Additional external documentation of the exposed API.

This object MAY be extended with [Specification Extensions](#specification-extensions).

##### Info Object Example

<!-- asyncapi-example-tester:{"name":"Info Object","json_pointer":"/info"} -->
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

<!-- asyncapi-example-tester:{"name":"Info Object","json_pointer":"/info"} -->
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

#### <a name="contact-object"></a>Contact Object

Contact information for the exposed API.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a name="contact-object-name"></a>name | `string` | The identifying name of the contact person/organization.
<a name="contact-object-url"></a>url | `string` | The URL pointing to the contact information. This MUST be in the form of an absolute URL.
<a name="contact-object-email"></a>email | `string` | The email address of the contact person/organization. MUST be in the format of an email address.

This object MAY be extended with [Specification Extensions](#specification-extensions).

##### Contact Object Example

<!-- asyncapi-example-tester:{"name":"Contact Object","json_pointer":"/info/contact"} -->
```json
{
  "name": "API Support",
  "url": "https://www.example.com/support",
  "email": "support@example.com"
}
```

<!-- asyncapi-example-tester:{"name":"Contact Object","json_pointer":"/info/contact"} -->
```yaml
name: API Support
url: https://www.example.com/support
email: support@example.com
```

#### <a name="license-object"></a>License Object

License information for the exposed API.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a name="license-object-name"></a>name | `string` | **REQUIRED.** The license name used for the API.
<a name="license-object-url"></a>url | `string` | A URL to the license used for the API. This MUST be in the form of an absolute URL.

This object MAY be extended with [Specification Extensions](#specification-extensions).

##### License Object Example

<!-- asyncapi-example-tester:{"name":"License Object","json_pointer":"/info/license"} -->
```json
{
  "name": "Apache 2.0",
  "url": "https://www.apache.org/licenses/LICENSE-2.0.html"
}
```

<!-- asyncapi-example-tester:{"name":"License Object","json_pointer":"/info/license"} -->
```yaml
name: Apache 2.0
url: https://www.apache.org/licenses/LICENSE-2.0.html
```

#### <a name="servers-object"></a>Servers Object

The Servers Object is a map of [Server Objects](#server-object).

##### Patterned Fields

Field Pattern | Type | Description
---|:---:|---
<a name="servers-object-server"></a>`^[A-Za-z0-9_\-]+$` | [Server Object](#server-object) \| [Reference Object](#reference-object) | The definition of a server this application MAY connect to.

##### Servers Object Example

<!-- asyncapi-example-tester:{"name":"Servers Object","json_pointer":"/servers"} -->
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

<!-- asyncapi-example-tester:{"name":"Servers Object","json_pointer":"/servers"} -->
```yaml
development:
  host: localhost:5672
  description: Development AMQP broker.
  protocol: amqp
  protocolVersion: 0-9-1
  tags:
    - name: 'env:development'
      description: 'This environment is meant for developers to run their own tests.'
staging:
  host: rabbitmq-staging.in.mycompany.com:5672
  description: RabbitMQ broker for the staging environment.
  protocol: amqp
  protocolVersion: 0-9-1
  tags:
    - name: 'env:staging'
      description: 'This environment is a replica of the production environment.'
production:
  host: rabbitmq.in.mycompany.com:5672
  description: RabbitMQ broker for the production environment.
  protocol: amqp
  protocolVersion: 0-9-1
  tags:
    - name: 'env:production'
      description: 'This environment is the live environment available for final users.'
```

#### <a name="server-object"></a>Server Object

An object representing a message broker, a server or any other kind of computer program capable of sending and/or receiving data. This object is used to capture details such as URIs, protocols and security configuration. Variable substitution can be used so that some details, for example usernames and passwords, can be injected by code generation tools.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a name="server-object-host"></a>host | `string` | **REQUIRED**. The server host name. It MAY include the port. This field supports [Server Variables](#server-object-variables). Variable substitutions will be made when a variable is named in `{`braces`}`.
<a name="server-object-protocol"></a>protocol | `string` | **REQUIRED**. The protocol this server supports for connection.
<a name="server-object-protocol-version"></a>protocolVersion | `string` | The version of the protocol used for connection. For instance: AMQP `0.9.1`, HTTP `2.0`, Kafka `1.0.0`, etc.
<a name="server-object-pathname"></a>pathname | `string` | The path to a resource in the host. This field supports [Server Variables](#server-object-variables). Variable substitutions will be made when a variable is named in `{`braces`}`.
<a name="server-object-description"></a>description | `string` | An optional string describing the server. [CommonMark syntax](https://spec.commonmark.org/) MAY be used for rich text representation.
<a name="server-object-title"></a>title | `string` | A human-friendly title for the server.
<a name="server-object-summary"></a>summary | `string` | A short summary of the server.
<a name="server-object-variables"></a>variables | Map[`string`, [Server Variable Object](#server-variable-object) \| [Reference Object](#reference-object)]] | A map between a variable name and its value.  The value is used for substitution in the server's `host` and `pathname` template.
<a name="server-object-security"></a>security | [Security Scheme Object](#security-scheme-object) \| [Reference Object](#reference-object) | A declaration of which security schemes can be used with this server. The list of values includes alternative [security scheme objects](#security-scheme-object) that can be used. Only one of the security scheme objects need to be satisfied to authorize a connection or operation.
<a name="server-object-tags"></a>tags | [Tags Object](#tags-object) | A list of tags for logical grouping and categorization of servers.
<a name="server-object-external-docs"></a>externalDocs | [External Documentation Object](#external-documentation-object) \| [Reference Object](#reference-object) | Additional external documentation for this server.
<a name="server-object-bindings"></a>bindings | [Server Bindings Object](#server-bindings-object) \| [Reference Object](#reference-object) | A map where the keys describe the name of the protocol and the values describe protocol-specific definitions for the server.

This object MAY be extended with [Specification Extensions](#specification-extensions).

##### Server Object Example

A single server would be described as:

<!-- asyncapi-example-tester:{"name":"Server Object","json_pointer":"/servers/production"} -->
```json
{
  "host": "kafka.in.mycompany.com:9092",
  "description": "Production Kafka broker.",
  "protocol": "kafka",
  "protocolVersion": "3.2"
}
```

<!-- asyncapi-example-tester:{"name":"Server Object","json_pointer":"/servers/production"} -->
```yaml
host: kafka.in.mycompany.com:9092
description: Production Kafka broker.
protocol: kafka
protocolVersion: '3.2'
```

An example of a server that has a `pathname`:

<!-- asyncapi-example-tester:{"name":"Server Object with pathname","json_pointer":"/servers/production"} -->
```json
{
  "host": "rabbitmq.in.mycompany.com:5672",
  "pathname": "/production",
  "protocol": "amqp",
  "description": "Production RabbitMQ broker (uses the `production` vhost)."
}
```

<!-- asyncapi-example-tester:{"name":"Server Object with pathname","json_pointer":"/servers/production"} -->
```yaml
host: rabbitmq.in.mycompany.com:5672
pathname: /production
protocol: amqp
description: Production RabbitMQ broker (uses the `production` vhost).
```

#### <a name="server-variable-object"></a>Server Variable Object

An object representing a Server Variable for server URL template substitution.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a name="server-variable-object-enum"></a>enum | [`string`] | An enumeration of string values to be used if the substitution options are from a limited set.
<a name="server-variable-object-default"></a>default | `string` | The default value to use for substitution, and to send, if an alternate value is _not_ supplied.
<a name="server-variable-object-description"></a>description | `string` | An optional description for the server variable. [CommonMark syntax](https://spec.commonmark.org/) MAY be used for rich text representation.
<a name="server-variable-object-examples"></a>examples | [`string`] | An array of examples of the server variable.

This object MAY be extended with [Specification Extensions](#specification-extensions).

##### Server Variable Object Example

<!-- asyncapi-example-tester:{"name":"Server Object with Variable Object","json_pointer":"/servers/production"} -->
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

<!-- asyncapi-example-tester:{"name":"Server Object with Variable Object","json_pointer":"/servers/production"} -->
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

#### <a name="default-content-type-string"></a>Default Content Type

A string representing the default content type to use when encoding/decoding a message's payload. The value MUST be a specific media type (e.g. `application/json`). This value MUST be used by schema parsers when the [contentType](#message-object-content-type) property is omitted.

In case a message can't be encoded/decoded using this value, schema parsers MUST use their default content type.

##### Default Content Type Example

<!-- asyncapi-example-tester:{"name":"Default Content Type at root doc","json_pointer":""} -->  
```json
{
  "defaultContentType": "application/json"
}
```

<!-- asyncapi-example-tester:{"name":"Default Content Type at root doc","json_pointer":""} -->  
```yaml
defaultContentType: application/json
```

#### <a name="channels-object"></a>Channels Object

An object containing all the [Channel Object](#channel-object) definitions the [Application](#definitions-application) MUST use during runtime.

##### Patterned Fields

Field Pattern | Type | Description
---|:---:|---
<a name="channels-object-channel"></a>\{channelId} | [Channel Object](#channel-object) \| [Reference Object](#reference-object) | An identifier for the described channel. The `channelId` value is **case-sensitive**. Tools and libraries MAY use the `channelId` to uniquely identify a channel, therefore, it is RECOMMENDED to follow common programming naming conventions.

##### Channels Object Example

<!-- asyncapi-example-tester:{"name":"Channels Object","json_pointer":"/channels"} -->
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

<!-- asyncapi-example-tester:{"name":"Channels Object","json_pointer":"/channels"} -->
```yaml
userSignedUp:
  address: 'user.signedup'
  messages:
    userSignedUp:
      $ref: '#/components/messages/userSignedUp'
```

#### <a name="channel-object"></a>Channel Object

Describes a shared communication channel.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a name="channel-object-address"></a>address | `string` \| `null` | An optional string representation of this channel's address. The address is typically the "topic name", "routing key", "event type", or "path". When `null` or absent, it MUST be interpreted as unknown. This is useful when the address is generated dynamically at runtime or can't be known upfront. It MAY contain [Channel Address Expressions](#channel-address-expressions). Query parameters and fragments SHALL NOT be used, instead use [bindings](#channel-bindings-object) to define them.
<a name="channel-object-messages"></a>messages | [Messages Object](#messages-object) | A map of the messages that will be sent to this channel by any application at any time. **Every message sent to this channel MUST be valid against one, and only one, of the [message objects](#message-object) defined in this map.**
<a name="channel-object-title"></a>title | `string` | A human-friendly title for the channel.
<a name="channel-object-summary"></a>summary | `string` | A short summary of the channel.
<a name="channel-object-description"></a>description | `string` | An optional description of this channel. [CommonMark syntax](https://spec.commonmark.org/) can be used for rich text representation.
<a name="channel-object-servers"></a>servers | [Reference Object](#reference-object) | An array of `$ref` pointers to the definition of the servers in which this channel is available. If the channel is located in the [root Channels Object](#channels-object), it MUST point to a subset of server definitions located in the [root Servers Object](#servers-object), and MUST NOT point to a subset of server definitions located in the [Components Object](#components-object) or anywhere else. If the channel is located in the [Components Object](#components-object), it MAY point to a [Server Objects](#server-object) in any location. If `servers` is absent or empty, this channel MUST be available on all the servers defined in the [Servers Object](#servers-object). Please note the `servers` property value MUST be an array of [Reference Objects](#reference-object) and, therefore, MUST NOT contain an array of [Server Objects](#server-object). However, it is RECOMMENDED that parsers (or other software) dereference this property for a better development experience.
<a name="channel-object-parameters"></a>parameters | [Parameters Object](#parameters-object) | A map of the parameters included in the channel address. It MUST be present only when the address contains [Channel Address Expressions](#channel-address-expressions).
<a name="channel-object-tags"></a>tags | [Tags Object](#tags-object) | A list of tags for logical grouping of channels.
<a name="channel-object-external-docs"></a>externalDocs | [External Documentation Object](#external-documentation-object) \| [Reference Object](#reference-object) | Additional external documentation for this channel.
<a name="channel-object-bindings"></a>bindings | [Channel Bindings Object](#channel-bindings-object) \| [Reference Object](#reference-object) | A map where the keys describe the name of the protocol and the values describe protocol-specific definitions for the channel.

This object MAY be extended with [Specification Extensions](#specification-extensions).

##### Channel Object Example

<!-- asyncapi-example-tester:{"name":"Channel Object","json_pointer":"/channels/user"} -->
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

<!-- asyncapi-example-tester:{"name":"Channel Object","json_pointer":"/channels/user"} -->
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

#### <a name="channel-address-expressions"></a>Channel Address Expressions

Channel addresses MAY contain expressions that can be used to define dynamic values.

Expressions MUST be composed by a name enclosed in curly braces (`{` and `}`). E.g., `{userId}`.

#### <a name="messages-object"></a>Messages Object

Describes a map of messages included in a channel.

##### Patterned Fields

Field Pattern | Type | Description
---|:---:|---
<a name="messages-object-id"></a>`{messageId}` | [Message Object](#message-object) \| [Reference Object](#reference-object) | The key represents the message identifier. The `messageId` value is **case-sensitive**. Tools and libraries MAY use the `messageId` value to uniquely identify a message, therefore, it is RECOMMENDED to follow common programming naming conventions.

##### Messages Object Example

<!-- asyncapi-example-tester:{"name":"Messages Object","json_pointer":"/channels/user/messages"} -->
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

<!-- asyncapi-example-tester:{"name":"Messages Object","json_pointer":"/channels/user/messages"} -->
```yaml
userSignedUp:
  $ref: '#/components/messages/userSignedUp'
userCompletedOrder:
  $ref: '#/components/messages/userCompletedOrder'
```

#### <a name="operations-object"></a>Operations Object

Holds a dictionary with all the [operations](#operation-object) this application MUST implement.

> If you're looking for a place to define operations that MAY or MAY NOT be implemented by the application, consider defining them in [`components/operations`](#components-operations).

##### Patterned Fields

Field Pattern | Type | Description
---|:---:|---
<a name="operations-object-operation"></a>{operationId} | [Operation Object](#operation-object) \| [Reference Object](#reference-object) | The operation this application MUST implement. The field name (`operationId`) MUST be a string used to identify the operation in the document where it is defined, and its value is **case-sensitive**. Tools and libraries MAY use the `operationId` to uniquely identify an operation, therefore, it is RECOMMENDED to follow common programming naming conventions.

##### Operations Object Example

<!-- asyncapi-example-tester:{"name":"Operations Object","json_pointer":"/operations"} -->
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

<!-- asyncapi-example-tester:{"name":"Operations Object","json_pointer":"/operations"} -->
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

#### <a name="operation-object"></a>Operation Object

Describes a specific operation.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a name="operation-object-action"></a>action | `"send"` &#124; `"receive"` | **Required**. Use `send` when it's expected that the application will send a message to the given [`channel`](#operation-object-channel), and `receive` when the application should expect receiving messages from the given [`channel`](#operation-object-channel).
<a name="operation-object-channel"></a>channel | [Reference Object](#reference-object) | **Required**. A `$ref` pointer to the definition of the channel in which this operation is performed. If the operation is located in the [root Operations Object](#operations-object), it MUST point to a channel definition located in the [root Channels Object](#channels-object), and MUST NOT point to a channel definition located in the [Components Object](#components-object) or anywhere else. If the operation is located in the [Components Object](#components-object), it MAY point to a [Channel Object](#channel-object) in any location. Please note the `channel` property value MUST be a [Reference Object](#reference-object) and, therefore, MUST NOT contain a [Channel Object](#channel-object). However, it is RECOMMENDED that parsers (or other software) dereference this property for a better development experience.
<a name="operation-object-title"></a>title | `string` | A human-friendly title for the operation.
<a name="operation-object-summary"></a>summary | `string` | A short summary of what the operation is about.
<a name="operation-object-description"></a>description | `string` | A verbose explanation of the operation. [CommonMark syntax](http://spec.commonmark.org/) can be used for rich text representation.
<a name="operation-object-security"></a>security | [Security Scheme Object](#security-scheme-object) \| [Reference Object](#reference-object)| A declaration of which security schemes are associated with this operation. Only one of the [security scheme objects](#security-scheme-object) MUST be satisfied to authorize an operation. In cases where [Server Security](#server-object-security) also applies, it MUST also be satisfied.
<a name="operation-object-tags"></a>tags | [Tags Object](#tags-object) | A list of tags for logical grouping and categorization of operations.
<a name="operation-object-external-docs"></a>externalDocs | [External Documentation Object](#external-documentation-object) \| [Reference Object](#reference-object) | Additional external documentation for this operation.
<a name="operation-object-bindings"></a>bindings | [Operation Bindings Object](#operation-bindings-object) \| [Reference Object](#reference-object) | A map where the keys describe the name of the protocol and the values describe protocol-specific definitions for the operation.
<a name="operation-object-traits"></a>traits | [[Operation Trait Object](#operation-trait-object) &#124; [Reference Object](#reference-object) ] | A list of traits to apply to the operation object. Traits MUST be merged using [traits merge mechanism](#traits-merge-mechanism). The resulting object MUST be a valid [Operation Object](#operation-object).
<a name="operation-object-messages"></a>messages | [[Reference Object](#reference-object)] | A list of `$ref` pointers pointing to the supported [Message Objects](#message-object) that can be processed by this operation. It MUST contain a subset of the messages defined in the [channel referenced in this operation](#operation-object-channel), and MUST NOT point to a subset of message definitions located in the [Messages Object](#components-messages) in the [Components Object](#components-object) or anywhere else. **Every message processed by this operation MUST be valid against one, and only one, of the [message objects](#message-object) referenced in this list.** Please note the `messages` property value MUST be a list of [Reference Objects](#reference-object) and, therefore, MUST NOT contain [Message Objects](#message-object). However, it is RECOMMENDED that parsers (or other software) dereference this property for a better development experience. <p>**Note**: excluding this property from the Operation implies that all messages from the channel will be included. Explicitly set the `messages` property to `[]` if this operation should contain no messages.</p>
<a name="operation-object-reply"></a>reply | [Operation Reply Object](#operation-reply-object) &#124; [Reference Object](#reference-object)  | The definition of the reply in a request-reply operation.

This object MAY be extended with [Specification Extensions](#specification-extensions).

##### Operation Object Example

<!-- asyncapi-example-tester:{"name":"Operation Object","json_pointer":"/operations/sendUserSignUp"} -->
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
      "type": "oauth2",
      "description": "The oauth security descriptions",
      "flows": {
        "clientCredentials": {
          "tokenUrl": "https://example.com/api/oauth/dialog",
          "availableScopes": {
            "subscribe:auth_revocations": "Scope required for authorization revocation topic"
          }
        }
      },
      "scopes": [
        "subscribe:auth_revocations"
      ],
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
    { "$ref": "#/channels/userSignup/messages/userSignedUp" }
  ],
  "reply": {
    "address": {
      "location": "$message.header#/replyTo"
    },
    "channel": {
      "$ref": "#/channels/userSignupReply"
    },
    "messages": [
      { "$ref": "#/channels/userSignupReply/messages/userSignedUpReply" }
    ]
  }
}
```

<!-- asyncapi-example-tester:{"name":"Operation Object","json_pointer":"/operations/sendUserSignUp"} -->
```yaml
title: User sign up
summary: Action to sign a user up.
description: A longer description
channel:
  $ref: '#/channels/userSignup'
action: send
security:
  - type: oauth2
    description: The oauth security descriptions
    flows:
      clientCredentials:
        tokenUrl: 'https://example.com/api/oauth/dialog'
        availableScopes:
          'subscribe:auth_revocations': Scope required for authorization revocation topic
    scopes:
      - 'subscribe:auth_revocations'
    petstore_auth:
      - 'write:pets'
      - 'read:pets'
tags:
  - name: user
  - name: signup
  - name: register
bindings:
  amqp:
    ack: false
traits:
  - $ref: '#/components/operationTraits/kafka'
messages:
  - $ref: '#/channels/userSignup/messages/userSignedUp'
reply:
  address:
    location: '$message.header#/replyTo'
  channel:
    $ref: '#/channels/userSignupReply'
  messages:
    - $ref: '#/channels/userSignupReply/messages/userSignedUpReply'
```

#### <a name="operation-trait-object"></a>Operation Trait Object

Describes a trait that MAY be applied to an [Operation Object](#operation-object). This object MAY contain any property from the [Operation Object](#operation-object), except the `action`, `channel`, `messages` and `traits` ones.

If you're looking to apply traits to a message, see the [Message Trait Object](#message-trait-object).

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a name="operation-trait-object-title"></a>title | `string` | A human-friendly title for the operation.
<a name="operation-trait-object-summary"></a>summary | `string` | A short summary of what the operation is about.
<a name="operation-trait-object-description"></a>description | `string` | A verbose explanation of the operation. [CommonMark syntax](https://spec.commonmark.org/) can be used for rich text representation.
<a name="operation-trait-object-security"></a>security | [Security Scheme Object](#security-scheme-object) \| [Reference Object](#reference-object)| A declaration of which security schemes are associated with this operation. Only one of the [security scheme objects](#security-scheme-object) MUST be satisfied to authorize an operation. In cases where [Server Security](#server-object-security) also applies, it MUST also be satisfied.
<a name="operation-trait-object-tags"></a>tags | [Tags Object](#tags-object) | A list of tags for logical grouping and categorization of operations.
<a name="operation-trait-object-external-docs"></a>externalDocs | [External Documentation Object](#external-documentation-object) \| [Reference Object](#reference-object) | Additional external documentation for this operation.
<a name="operation-trait-object-bindings"></a>bindings | [Operation Bindings Object](#operation-bindings-object) \| [Reference Object](#reference-object) | A map where the keys describe the name of the protocol and the values describe protocol-specific definitions for the operation.

This object MAY be extended with [Specification Extensions](#specification-extensions).

##### Operation Trait Object Example

<!-- asyncapi-example-tester:{"name":"Operation Traits Object","json_pointer":"/operations/sendUserSignUp/traits/0"} -->
```json
{
  "bindings": {
    "amqp": {
      "ack": false
    }
  }
}
```

<!-- asyncapi-example-tester:{"name":"Operation Traits Object","json_pointer":"/operations/sendUserSignUp/traits/0"} -->
```yaml
bindings:
  amqp:
    ack: false
```

#### <a name="operation-reply-object"></a>Operation Reply Object

Describes the reply part that MAY be applied to an Operation Object. If an operation implements the request/reply pattern, the reply object represents the response message.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a name="operation-reply-object-address"></a>address | [Operation Reply Address Object](#operation-reply-address-object) &#124; [Reference Object](#reference-object) | Definition of the address that implementations MUST use for the reply.
<a name="operation-reply-object-channel"></a>channel | [Reference Object](#reference-object) | A `$ref` pointer to the definition of the channel in which this operation is performed. When [address](#operation-reply-address-object) is specified, the [`address` property](#channel-object-address) of the channel referenced by this property MUST be either `null` or not defined. If the operation reply is located inside a [root Operation Object](#operation-object), it MUST point to a channel definition located in the [root Channels Object](#channels-object), and MUST NOT point to a channel definition located in the [Components Object](#components-object) or anywhere else. If the operation reply is located inside an [Operation Object] in the [Components Object](#components-object) or in the [Replies Object](#components-replies) in the [Components Object](#components-object), it MAY point to a [Channel Object](#channel-object) in any location. Please note the `channel` property value MUST be a [Reference Object](#reference-object) and, therefore, MUST NOT contain a [Channel Object](#channel-object). However, it is RECOMMENDED that parsers (or other software) dereference this property for a better development experience.
<a name="operation-reply-object-messages"></a>messages | [Reference Object](#reference-object) | A list of `$ref` pointers pointing to the supported [Message Objects](#message-object) that can be processed by this operation as reply. It MUST contain a subset of the messages defined in the [channel referenced in this operation reply](#operation-object-channel), and MUST NOT point to a subset of message definitions located in the [Components Object](#components-object) or anywhere else. **Every message processed by this operation MUST be valid against one, and only one, of the [message objects](#message-object) referenced in this list.** Please note the `messages` property value MUST be a list of [Reference Objects](#reference-object) and, therefore, MUST NOT contain [Message Objects](#message-object). However, it is RECOMMENDED that parsers (or other software) dereference this property for a better development experience.

This object MAY be extended with [Specification Extensions](#specification-extensions).

#### <a name="operation-reply-address-object"></a>Operation Reply Address Object

An object that specifies where an operation has to send the reply.

For specifying and computing the location of a reply address, a [runtime expression](#runtime-expression) is used.

##### Fixed Fields

Field Name | Type | Description
---|:---|---
description | `string` | An optional description of the address. [CommonMark syntax](https://spec.commonmark.org/) can be used for rich text representation.
location | `string` | **REQUIRED.** A [runtime expression](#runtime-expression) that specifies the location of the reply address.

This object MAY be extended with [Specification Extensions](#specification-extensions).

##### Examples

<!-- asyncapi-example-tester:{"name":"Operation Reply Address Object","json_pointer":"/operations/sendUserSignUp/reply/address"} -->
```json
{
  "description": "Consumer inbox",
  "location": "$message.header#/replyTo"
}
```

<!-- asyncapi-example-tester:{"name":"Operation Reply Address Object","json_pointer":"/operations/sendUserSignUp/reply/address"} -->
```yaml
description: Consumer Inbox
location: $message.header#/replyTo
```

#### <a name="parameters-object"></a>Parameters Object

Describes a map of parameters included in a channel address.

This map MUST contain all the parameters used in the parent channel address.

##### Patterned Fields

Field Pattern | Type | Description
---|:---:|---
<a name="parameters-object-name"></a>`^[A-Za-z0-9_\-]+$` | [Parameter Object](#parameter-object) &#124; [Reference Object](#reference-object) | The key represents the name of the parameter. It MUST match the parameter name used in the parent channel address.

##### Parameters Object Example

<!-- asyncapi-example-tester:{"name":"Channel Parameters Object","json_pointer":"/channels/user"} -->
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

<!-- asyncapi-example-tester:{"name":"Channel Parameters Object","json_pointer":"/channels/user"} -->
```yaml
address: user/{userId}/signedup
parameters:
  userId:
    description: Id of the user.
```

#### <a name="parameter-object"></a>Parameter Object

Describes a parameter included in a channel address.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a name="parameter-object-enum"></a>enum | [`string`] | An enumeration of string values to be used if the substitution options are from a limited set.
<a name="parameter-object-default"></a>default | `string` | The default value to use for substitution, and to send, if an alternate value is _not_ supplied.
<a name="parameter-object-description"></a>description | `string` | An optional description for the parameter. [CommonMark syntax](https://spec.commonmark.org/) MAY be used for rich text representation.
<a name="parameter-object-examples"></a>examples | [`string`] | An array of examples of the parameter value.
<a name="parameter-object-location"></a>location | `string` | A [runtime expression](#runtime-expression) that specifies the location of the parameter value.

This object MAY be extended with [Specification Extensions](#specification-extensions).

##### Parameter Object Example

<!-- asyncapi-example-tester:{"name":"Channel Parameter Object","json_pointer":"/channels/user"} -->
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

<!-- asyncapi-example-tester:{"name":"Channel Parameter Object","json_pointer":"/channels/user"} -->
```yaml
address: user/{userId}/signedup
parameters:
  userId:
    description: Id of the user.
    location: $message.payload#/user/id
```

#### <a name="server-bindings-object"></a>Server Bindings Object

Map describing protocol-specific definitions for a server.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a name="server-bindings-object-http"></a>`http` | [HTTP Server Binding](https://github.com/asyncapi/bindings/blob/master/http#server) | Protocol-specific information for an HTTP server.
<a name="server-bindings-object-web-sockets"></a>`ws` | [WebSockets Server Binding](https://github.com/asyncapi/bindings/blob/master/websockets#server) | Protocol-specific information for a WebSockets server.
<a name="server-bindings-object-kafka"></a>`kafka` | [Kafka Server Binding](https://github.com/asyncapi/bindings/blob/master/kafka#server) | Protocol-specific information for a Kafka server.
<a name="server-bindings-object-anypoint-mq"></a>`anypointmq` | [Anypoint MQ Server Binding](https://github.com/asyncapi/bindings/blob/master/anypointmq#server) | Protocol-specific information for an Anypoint MQ server.
<a name="server-bindings-object-amqp"></a>`amqp` | [AMQP Server Binding](https://github.com/asyncapi/bindings/blob/master/amqp#server) | Protocol-specific information for an AMQP 0-9-1 server.
<a name="server-bindings-object-amqp1"></a>`amqp1` | [AMQP 1.0 Server Binding](https://github.com/asyncapi/bindings/blob/master/amqp1#server) | Protocol-specific information for an AMQP 1.0 server.
<a name="server-bindings-object-mqtt"></a>`mqtt` | [MQTT Server Binding](https://github.com/asyncapi/bindings/blob/master/mqtt#server) | Protocol-specific information for an MQTT server.
<a name="server-bindings-object-mqtt5"></a>`mqtt5` | [MQTT 5 Server Binding](https://github.com/asyncapi/bindings/blob/master/mqtt5#server) | Protocol-specific information for an MQTT 5 server.
<a name="server-bindings-object-nats"></a>`nats` | [NATS Server Binding](https://github.com/asyncapi/bindings/blob/master/nats#server) | Protocol-specific information for a NATS server.
<a name="server-bindings-object-jms"></a>`jms` | [JMS Server Binding](https://github.com/asyncapi/bindings/blob/master/jms#server) | Protocol-specific information for a JMS server.
<a name="server-bindings-object-sns"></a>`sns` | [SNS Server Binding](https://github.com/asyncapi/bindings/blob/master/sns#server) | Protocol-specific information for an SNS server.
<a name="server-bindings-object-solace"></a>`solace` | [Solace Server Binding](https://github.com/asyncapi/bindings/blob/master/solace#server) | Protocol-specific information for a Solace server.
<a name="server-bindings-object-sqs"></a>`sqs` | [SQS Server Binding](https://github.com/asyncapi/bindings/blob/master/sqs#server) | Protocol-specific information for an SQS server.
<a name="server-bindings-object-stomp"></a>`stomp` | [STOMP Server Binding](https://github.com/asyncapi/bindings/blob/master/stomp#server) | Protocol-specific information for a STOMP server.
<a name="server-bindings-object-redis"></a>`redis` | [Redis Server Binding](https://github.com/asyncapi/bindings/blob/master/redis#server) | Protocol-specific information for a Redis server.
<a name="server-bindings-object-mercure"></a>`mercure` | [Mercure Server Binding](https://github.com/asyncapi/bindings/blob/master/mercure#server) | Protocol-specific information for a Mercure server.
<a name="server-bindings-object-ibmmq"></a>`ibmmq` | [IBM MQ Server Binding](https://github.com/asyncapi/bindings/blob/master/ibmmq#server-binding-object) | Protocol-specific information for an IBM MQ server.
<a name="server-bindings-object-google-pub-sub"></a>`googlepubsub` | [Google Cloud Pub/Sub Server Binding](https://github.com/asyncapi/bindings/blob/master/googlepubsub#server) | Protocol-specific information for a Google Cloud Pub/Sub server.
<a name="server-bindings-object-pulsar"></a>`pulsar` | [Pulsar Server Binding](https://github.com/asyncapi/bindings/tree/master/pulsar#server-binding-object) | Protocol-specific information for a Pulsar server.

This object MAY be extended with [Specification Extensions](#specification-extensions).

#### <a name="channel-bindings-object"></a>Channel Bindings Object

Map describing protocol-specific definitions for a channel.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a name="channel-bindings-object-http"></a>`http` | [HTTP Channel Binding](https://github.com/asyncapi/bindings/blob/master/http/README.md#channel) | Protocol-specific information for an HTTP channel.
<a name="channel-bindings-object-web-sockets"></a>`ws` | [WebSockets Channel Binding](https://github.com/asyncapi/bindings/blob/master/websockets/README.md#channel) | Protocol-specific information for a WebSockets channel.
<a name="channel-bindings-object-kafka"></a>`kafka` | [Kafka Channel Binding](https://github.com/asyncapi/bindings/blob/master/kafka/README.md#channel) | Protocol-specific information for a Kafka channel.
<a name="channel-bindings-object-anypoint-mq"></a>`anypointmq` | [Anypoint MQ Channel Binding](https://github.com/asyncapi/bindings/blob/master/anypointmq/README.md#channel) | Protocol-specific information for an Anypoint MQ channel.
<a name="channel-bindings-object-amqp"></a>`amqp` | [AMQP Channel Binding](https://github.com/asyncapi/bindings/blob/master/amqp/README.md#channel) | Protocol-specific information for an AMQP 0-9-1 channel.
<a name="channel-bindings-object-amqp1"></a>`amqp1` | [AMQP 1.0 Channel Binding](https://github.com/asyncapi/bindings/blob/master/amqp1/README.md#channel) | Protocol-specific information for an AMQP 1.0 channel.
<a name="channel-bindings-object-mqtt"></a>`mqtt` | [MQTT Channel Binding](https://github.com/asyncapi/bindings/blob/master/mqtt/README.md#channel) | Protocol-specific information for an MQTT channel.
<a name="channel-bindings-object-mqtt5"></a>`mqtt5` | [MQTT 5 Channel Binding](https://github.com/asyncapi/bindings/blob/master/mqtt5#channel) | Protocol-specific information for an MQTT 5 channel.
<a name="channel-bindings-object-nats"></a>`nats` | [NATS Channel Binding](https://github.com/asyncapi/bindings/blob/master/nats/README.md#channel) | Protocol-specific information for a NATS channel.
<a name="channel-bindings-object-jms"></a>`jms` | [JMS Channel Binding](https://github.com/asyncapi/bindings/blob/master/jms/README.md#channel) | Protocol-specific information for a JMS channel.
<a name="channel-bindings-object-sns"></a>`sns` | [SNS Channel Binding](https://github.com/asyncapi/bindings/blob/master/sns/README.md#channel) | Protocol-specific information for an SNS channel.
<a name="channel-bindings-object-solace"></a>`solace` | [Solace Channel Binding](https://github.com/asyncapi/bindings/blob/master/solace#channel) | Protocol-specific information for a Solace channel.
<a name="channel-bindings-object-sqs"></a>`sqs` | [SQS Channel Binding](https://github.com/asyncapi/bindings/blob/master/sqs/README.md#channel) | Protocol-specific information for an SQS channel.
<a name="channel-bindings-object-stomp"></a>`stomp` | [STOMP Channel Binding](https://github.com/asyncapi/bindings/blob/master/stomp/README.md#channel) | Protocol-specific information for a STOMP channel.
<a name="channel-bindings-object-redis"></a>`redis` | [Redis Channel Binding](https://github.com/asyncapi/bindings/blob/master/redis#channel) | Protocol-specific information for a Redis channel.
<a name="channel-bindings-object-mercure"></a>`mercure` | [Mercure Channel Binding](https://github.com/asyncapi/bindings/blob/master/mercure#channel) | Protocol-specific information for a Mercure channel.
<a name="channel-bindings-object-ibmmq"></a>`ibmmq` | [IBM MQ Channel Binding](https://github.com/asyncapi/bindings/tree/master/ibmmq#channel-binding-object) | Protocol-specific information for an IBM MQ channel.
<a name="channel-bindings-object-google-pub-sub"></a>`googlepubsub` | [Google Cloud Pub/Sub Channel Binding](https://github.com/asyncapi/bindings/tree/master/googlepubsub#channel) | Protocol-specific information for a Google Cloud Pub/Sub channel.
<a name="channel-bindings-object-pulsar"></a>`pulsar` | [Pulsar Channel Binding](https://github.com/asyncapi/bindings/tree/master/pulsar#channel-binding-object) | Protocol-specific information for a Pulsar channel.

This object MAY be extended with [Specification Extensions](#specification-extensions).

#### <a name="operation-bindings-object"></a>Operation Bindings Object

Map describing protocol-specific definitions for an operation.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a name="operation-bindings-object-http"></a>`http` | [HTTP Operation Binding](https://github.com/asyncapi/bindings/blob/master/http/README.md#operation) | Protocol-specific information for an HTTP operation.
<a name="operation-bindings-object-web-sockets"></a>`ws` | [WebSockets Operation Binding](https://github.com/asyncapi/bindings/blob/master/websockets/README.md#operation) | Protocol-specific information for a WebSockets operation.
<a name="operation-bindings-object-kafka"></a>`kafka` | [Kafka Operation Binding](https://github.com/asyncapi/bindings/blob/master/kafka/README.md#operation) | Protocol-specific information for a Kafka operation.
<a name="operation-bindings-object-anypoint-mq"></a>`anypointmq` | [Anypoint MQ Operation Binding](https://github.com/asyncapi/bindings/blob/master/anypointmq/README.md#operation) | Protocol-specific information for an Anypoint MQ operation.
<a name="operation-bindings-object-amqp"></a>`amqp` | [AMQP Operation Binding](https://github.com/asyncapi/bindings/blob/master/amqp/README.md#operation) | Protocol-specific information for an AMQP 0-9-1 operation.
<a name="operation-bindings-object-amqp1"></a>`amqp1` | [AMQP 1.0 Operation Binding](https://github.com/asyncapi/bindings/blob/master/amqp1/README.md#operation) | Protocol-specific information for an AMQP 1.0 operation.
<a name="operation-bindings-object-mqtt"></a>`mqtt` | [MQTT Operation Binding](https://github.com/asyncapi/bindings/blob/master/mqtt/README.md#operation) | Protocol-specific information for an MQTT operation.
<a name="operation-bindings-object-mqtt5"></a>`mqtt5` | [MQTT 5 Operation Binding](https://github.com/asyncapi/bindings/blob/master/mqtt5/README.md#operation) | Protocol-specific information for an MQTT 5 operation.
<a name="operation-bindings-object-nats"></a>`nats` | [NATS Operation Binding](https://github.com/asyncapi/bindings/blob/master/nats/README.md#operation) | Protocol-specific information for a NATS operation.
<a name="operation-bindings-object-jms"></a>`jms` | [JMS Operation Binding](https://github.com/asyncapi/bindings/blob/master/jms/README.md#operation) | Protocol-specific information for a JMS operation.
<a name="operation-bindings-object-sns"></a>`sns` | [SNS Operation Binding](https://github.com/asyncapi/bindings/blob/master/sns/README.md#operation) | Protocol-specific information for an SNS operation.
<a name="operation-bindings-object-solace"></a>`solace` | [Solace Operation Binding](https://github.com/asyncapi/bindings/blob/master/solace#operation) | Protocol-specific information for a Solace operation.
<a name="operation-bindings-object-sqs"></a>`sqs` | [SQS Operation Binding](https://github.com/asyncapi/bindings/blob/master/sqs/README.md#operation) | Protocol-specific information for an SQS operation.
<a name="operation-bindings-object-stomp"></a>`stomp` | [STOMP Operation Binding](https://github.com/asyncapi/bindings/blob/master/stomp/README.md#operation) | Protocol-specific information for a STOMP operation.
<a name="operation-bindings-object-redis"></a>`redis` | [Redis Operation Binding](https://github.com/asyncapi/bindings/blob/master/redis#operation) | Protocol-specific information for a Redis operation.
<a name="operation-bindings-object-mercure"></a>`mercure` | [Mercure Operation Binding](https://github.com/asyncapi/bindings/blob/master/mercure#operation) | Protocol-specific information for a Mercure operation.
<a name="operation-bindings-object-google-pub-sub"></a>`googlepubsub` | [Google Cloud Pub/Sub Operation Binding](https://github.com/asyncapi/bindings/blob/master/googlepubsub#operation) | Protocol-specific information for a Google Cloud Pub/Sub operation.
<a name="operation-bindings-object-ibmmq"></a>`ibmmq` | [IBM MQ Operation Binding](https://github.com/asyncapi/bindings/blob/master/ibmmq#operation-binding-object) | Protocol-specific information for an IBM MQ operation.
<a name="operation-bindings-object-pulsar"></a>`pulsar` | [Pulsar Operation Binding](https://github.com/asyncapi/bindings/tree/master/pulsar#operation-binding-fields) | Protocol-specific information for a Pulsar operation.

This object MAY be extended with [Specification Extensions](#specification-extensions).

#### <a name="message-bindings-object"></a>Message Bindings Object

Map describing protocol-specific definitions for a message.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a name="message-bindings-object-http"></a>`http` | [HTTP Message Binding](https://github.com/asyncapi/bindings/blob/master/http/README.md#message) | Protocol-specific information for an HTTP message, i.e., a request or a response.
<a name="message-bindings-object-web-sockets"></a>`ws` | [WebSockets Message Binding](https://github.com/asyncapi/bindings/blob/master/websockets/README.md#message) | Protocol-specific information for a WebSockets message.
<a name="message-bindings-object-kafka"></a>`kafka` | [Kafka Message Binding](https://github.com/asyncapi/bindings/blob/master/kafka/README.md#message) | Protocol-specific information for a Kafka message.
<a name="message-bindings-object-anypoint-mq"></a>`anypointmq` | [Anypoint MQ Message Binding](https://github.com/asyncapi/bindings/blob/master/anypointmq/README.md#message) | Protocol-specific information for an Anypoint MQ message.
<a name="message-bindings-object-amqp"></a>`amqp` | [AMQP Message Binding](https://github.com/asyncapi/bindings/blob/master/amqp/README.md#message) | Protocol-specific information for an AMQP 0-9-1 message.
<a name="message-bindings-objectamqp1"></a>`amqp1` | [AMQP 1.0 Message Binding](https://github.com/asyncapi/bindings/blob/master/amqp1/README.md#message) | Protocol-specific information for an AMQP 1.0 message.
<a name="message-bindings-object-mqtt"></a>`mqtt` | [MQTT Message Binding](https://github.com/asyncapi/bindings/blob/master/mqtt/README.md#message) | Protocol-specific information for an MQTT message.
<a name="message-bindings-object-mqtt5"></a>`mqtt5` | [MQTT 5 Message Binding](https://github.com/asyncapi/bindings/blob/master/mqtt5/README.md#message) | Protocol-specific information for an MQTT 5 message.
<a name="message-bindings-object-nats"></a>`nats` | [NATS Message Binding](https://github.com/asyncapi/bindings/blob/master/nats/README.md#message) | Protocol-specific information for a NATS message.
<a name="message-bindings-object-jms"></a>`jms` | [JMS Message Binding](https://github.com/asyncapi/bindings/blob/master/jms/README.md#message) | Protocol-specific information for a JMS message.
<a name="message-bindings-object-sns"></a>`sns` | [SNS Message Binding](https://github.com/asyncapi/bindings/blob/master/sns/README.md#message) | Protocol-specific information for an SNS message.
<a name="message-bindings-object-solace"></a>`solace` | [Solace Server Binding](https://github.com/asyncapi/bindings/blob/master/solace#message) | Protocol-specific information for a Solace message.
<a name="message-bindings-object-sqs"></a>`sqs` | [SQS Message Binding](https://github.com/asyncapi/bindings/blob/master/sqs/README.md#message) | Protocol-specific information for an SQS message.
<a name="message-bindings-object-stomp"></a>`stomp` | [STOMP Message Binding](https://github.com/asyncapi/bindings/blob/master/stomp/README.md#message) | Protocol-specific information for a STOMP message.
<a name="message-bindings-object-redis"></a>`redis` | [Redis Message Binding](https://github.com/asyncapi/bindings/blob/master/redis#message) | Protocol-specific information for a Redis message.
<a name="message-bindings-object-mercure"></a>`mercure` | [Mercure Message Binding](https://github.com/asyncapi/bindings/blob/master/mercure#message) | Protocol-specific information for a Mercure message.
<a name="message-bindings-object-ibmmq"></a>`ibmmq` | [IBM MQ Message Binding](https://github.com/asyncapi/bindings/tree/master/ibmmq#message-binding-object) | Protocol-specific information for an IBM MQ message.
<a name="message-bindings-object-google-pub-sub"></a>`googlepubsub` | [Google Cloud Pub/Sub Message Binding](https://github.com/asyncapi/bindings/tree/master/googlepubsub#message) | Protocol-specific information for a Google Cloud Pub/Sub message.
<a name="message-bindings-object-pulsar"></a>`pulsar` | [Pulsar Message Binding](https://github.com/asyncapi/bindings/tree/master/pulsar#message-binding-fields) | Protocol-specific information for a Pulsar message.

This object MAY be extended with [Specification Extensions](#specification-extensions).

#### <a name="message-object"></a>Message Object

Describes a message received on a given channel and operation.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a name="message-object-headers"></a>headers | [Multi Format Schema Object](#multi-format-schema-object) &#124; [Schema Object](#schema-object) &#124; [Reference Object](#reference-object) | Schema definition of the application headers. Schema MUST be a map of key-value pairs. It **MUST NOT** define the protocol headers. If this is a [Schema Object](#schema-object), then the `schemaFormat` will be assumed to be "application/vnd.aai.asyncapi+json;version=`asyncapi`" where the version is equal to the [AsyncAPI Version String](#a2s-version-string).
<a name="message-object-payload"></a>payload | [Multi Format Schema Object](#multi-format-schema-object) &#124; [Schema Object](#schema-object) &#124; [Reference Object](#reference-object) | Definition of the message payload. If this is a [Schema Object](#schema-object), then the `schemaFormat` will be assumed to be "application/vnd.aai.asyncapi+json;version=`asyncapi`" where the version is equal to the [AsyncAPI Version String](#a2s-version-string).
<a name="message-object-correlation-id"></a>correlationId | [Correlation ID Object](#correlation-id-object) &#124; [Reference Object](#reference-object) | Definition of the correlation ID used for message tracing or matching.
<a name="message-object-content-type"></a>contentType | `string` | The content type to use when encoding/decoding a message's payload. The value MUST be a specific media type (e.g. `application/json`). When omitted, the value MUST be the one specified on the [defaultContentType](#default-content-type-string) field.
<a name="message-object-name"></a>name | `string` | A machine-friendly name for the message.
<a name="message-object-title"></a>title | `string` | A human-friendly title for the message.
<a name="message-object-summary"></a>summary | `string` | A short summary of what the message is about.
<a name="message-object-description"></a>description | `string` | A verbose explanation of the message. [CommonMark syntax](https://spec.commonmark.org/) can be used for rich text representation.
<a name="message-object-tags"></a>tags | [Tags Object](#tags-object) | A list of tags for logical grouping and categorization of messages.
<a name="message-object-external-docs"></a>externalDocs | [External Documentation Object](#external-documentation-object) \| [Reference Object](#reference-object) | Additional external documentation for this message.
<a name="message-object-bindings"></a>bindings | [Message Bindings Object](#message-bindings-object) \| [Reference Object](#reference-object) | A map where the keys describe the name of the protocol and the values describe protocol-specific definitions for the message.
<a name="message-object-examples"></a>examples | [Message Example Object](#message-example-object) | List of examples.
<a name="message-object-traits"></a>traits | [Message Trait Object](#message-trait-object) &#124; [Reference Object](#reference-object) | A list of traits to apply to the message object. Traits MUST be merged using [traits merge mechanism](#traits-merge-mechanism). The resulting object MUST be a valid [Message Object](#message-object).

This object MAY be extended with [Specification Extensions](#specification-extensions).

##### Message Object Example

<!-- asyncapi-example-tester:{"name":"Message Object","json_pointer":"/components/messages/userSignedUp"} -->
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

<!-- asyncapi-example-tester:{"name":"Message Object","json_pointer":"/components/messages/userSignedUp"} -->
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
      $ref: '#/components/schemas/userCreate'
    signup:
      $ref: '#/components/schemas/signup'
correlationId:
  description: Default Correlation ID
  location: $message.header#/correlationId
traits:
  - $ref: '#/components/messageTraits/commonHeaders'
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

<!-- asyncapi-example-tester:{"name":"Message Object","json_pointer":"/components/messages/userSignedUp"} -->
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
      "$ref": "./user-create.avsc"
    }
  }
}
```

<!-- asyncapi-example-tester:{"name":"Message Object","json_pointer":"/components/messages/userSignedUp"} -->
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
    $ref: './user-create.avsc'
```

#### <a name="message-trait-object"></a>Message Trait Object

Describes a trait that MAY be applied to a [Message Object](#message-object). This object MAY contain any property from the [Message Object](#message-object), except `payload` and `traits`.

If you're looking to apply traits to an operation, see the [Operation Trait Object](#operation-trait-object).

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a name="message-trait-object-headers"></a>headers | [Multi Format Schema Object](#multi-format-schema-object) &#124; [Schema Object](#schema-object) &#124; [Reference Object](#reference-object) | Schema definition of the application headers. Schema MUST be a map of key-value pairs. It **MUST NOT** define the protocol headers. If this is a [Schema Object](#schema-object), then the `schemaFormat` will be assumed to be "application/vnd.aai.asyncapi+json;version=`asyncapi`" where the version is equal to the [AsyncAPI Version String](#a2s-version-string).
<a name="message-trait-object-correlation-id"></a>correlationId | [Correlation ID Object](#correlation-id-object) &#124; [Reference Object](#reference-object) | Definition of the correlation ID used for message tracing or matching.
<a name="message-trait-object-content-type"></a>contentType | `string` | The content type to use when encoding/decoding a message's payload. The value MUST be a specific media type (e.g. `application/json`). When omitted, the value MUST be the one specified on the [defaultContentType](#default-content-type-string) field.
<a name="message-trait-object-name"></a>name | `string` | A machine-friendly name for the message.
<a name="message-trait-object-title"></a>title | `string` | A human-friendly title for the message.
<a name="message-trait-object-summary"></a>summary | `string` | A short summary of what the message is about.
<a name="message-trait-object-description"></a>description | `string` | A verbose explanation of the message. [CommonMark syntax](https://spec.commonmark.org/) can be used for rich text representation.
<a name="message-trait-object-tags"></a>tags | [Tags Object](#tags-object) | A list of tags for logical grouping and categorization of messages.
<a name="message-trait-object-external-docs"></a>externalDocs | [External Documentation Object](#external-documentation-object) \| [Reference Object](#reference-object) | Additional external documentation for this message.
<a name="message-trait-object-bindings"></a>bindings | [Message Bindings Object](#message-bindings-object) \| [Reference Object](#reference-object) | A map where the keys describe the name of the protocol and the values describe protocol-specific definitions for the message.
<a name="message-trait-object-examples"></a>examples | [Message Example Object](#message-example-object) | List of examples.

This object MAY be extended with [Specification Extensions](#specification-extensions).

##### Message Trait Object Example

<!-- asyncapi-example-tester:{"name":"Message Trait Object","json_pointer":"/components/messageTraits/commonHeaders"} -->
```json
{
  "contentType": "application/json"
}
```

<!-- asyncapi-example-tester:{"name":"Message Trait Object","json_pointer":"/components/messageTraits/commonHeaders"} -->
```yaml
contentType: application/json
```

#### <a name="message-example-object"></a> Message Example Object

Message Example Object represents an example of a [Message Object](#message-object) and MUST contain either **headers** and/or **payload** fields.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a name="message-example-object-headers"></a>headers | `Map[string, any]` | The value of this field MUST validate against the [Message Object's headers](#message-object-headers) field.
<a name="message-example-object-payload"></a>payload | `any` | The value of this field MUST validate against the [Message Object's payload](#message-object-payload) field.
<a name="message-example-object-name"></a>name | `string` | A machine-friendly name.
<a name="message-example-object-summary"></a>summary | `string` |  A short summary of what the example is about.

This object MAY be extended with [Specification Extensions](#specification-extensions).

##### Message Example Object Example

<!-- asyncapi-example-tester:{"name":"Message Example Object","json_pointer":"/components/messages/userSignUp/examples/0"} -->
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

<!-- asyncapi-example-tester:{"name":"Message Example Object","json_pointer":"/components/messages/userSignUp/examples/0"} -->
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

#### <a name="tags-object"></a>Tags Object

A Tags object is a list of [Tag Objects](#tag-object). An [Tag Object](#tag-object) in a list can be referenced by [Reference Object](#reference-object).

#### <a name="tag-object"></a>Tag Object

Allows adding meta data to a single tag.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a name="tag-object-name"></a>name | `string` | **REQUIRED.** The name of the tag.
<a name="tag-object-description"></a>description | `string` | A short description for the tag. [CommonMark syntax](https://spec.commonmark.org/) can be used for rich text representation.
<a name="tag-object-external-docs"></a>externalDocs | [External Documentation Object](#external-documentation-object) \| [Reference Object](#reference-object) | Additional external documentation for this tag.

This object MAY be extended with [Specification Extensions](#specification-extensions).

##### Tag Object Example

<!-- asyncapi-example-tester:{"name":"Tag Object","json_pointer":"/components/tags/user"} -->
```json
{
 "name": "user",
 "description": "User-related messages"
}
```

<!-- asyncapi-example-tester:{"name":"Tag Object","json_pointer":"/components/tags/user"} -->
```yaml
name: user
description: User-related messages
```

#### <a name="external-documentation-object"></a>External Documentation Object

Allows referencing an external resource for extended documentation.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a name="external-doc-description"></a>description | `string` | A short description of the target documentation. [CommonMark syntax](https://spec.commonmark.org/) can be used for rich text representation.
<a name="external-doc-url"></a>url | `string` | **REQUIRED.** The URL for the target documentation. This MUST be in the form of an absolute URL.

This object MAY be extended with [Specification Extensions](#specification-extensions).

##### External Documentation Object Example

<!-- asyncapi-example-tester:{"name":"External Docs Object","json_pointer":"/components/externalDocs/infoDocs"} -->
```json
{
  "description": "Find more info here",
  "url": "https://example.com"
}
```

<!-- asyncapi-example-tester:{"name":"External Docs Object","json_pointer":"/components/externalDocs/infoDocs"} -->
```yaml
description: Find more info here
url: https://example.com
```

#### <a name="reference-object"></a>Reference Object

A simple object to allow referencing other components in the specification, internally and externally.

The Reference Object is defined by [JSON Reference](https://tools.ietf.org/html/draft-pbryan-zyp-json-ref-03) and follows the same structure, behavior and rules. A JSON Reference SHALL only be used to refer to a schema that is formatted in either JSON or YAML. In the case of a YAML-formatted Schema, the JSON Reference SHALL be applied to the JSON representation of that schema. The JSON representation SHALL be made by applying the conversion described [here](#format).

For this specification, reference resolution is done as defined by the JSON Reference specification and not by the JSON Schema specification.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a name="reference-ref"></a>$ref | `string` | **REQUIRED.** The reference string.

This object cannot be extended with additional properties and any properties added SHALL be ignored.

##### Reference Object Example

<!-- asyncapi-example-tester:{"name":"Reference Object","json_pointer":"/components/messages/userSignUp/payload"} -->
```json
{
  "$ref": "#/components/schemas/Pet"
}
```

<!-- asyncapi-example-tester:{"name":"Reference Object","json_pointer":"/components/messages/userSignUp/payload"} -->
```yaml
  $ref: '#/components/schemas/Pet'
```

#### <a name="components-object"></a>Components Object

Holds a set of reusable objects for different aspects of the AsyncAPI specification.
All objects defined within the components object will have no effect on the API unless they are explicitly referenced from properties outside the components object.

##### Fixed Fields

Field Name | Type | Description
---|:---|---
<a name="components-schemas"></a>schemas | Map[`string`, [Multi Format Schema Object](#multi-format-schema-object) \| [Schema Object](#schema-object) \| [Reference Object](#reference-object)] | An object to hold reusable [Schema Object](#schema-object). If this is a [Schema Object](#schema-object), then the `schemaFormat` will be assumed to be "application/vnd.aai.asyncapi+json;version=`asyncapi`" where the version is equal to the [AsyncAPI Version String](#a2s-version-string).
<a name="components-servers"></a>servers | Map[`string`, [Server Object](#server-object) \| [Reference Object](#reference-object)] | An object to hold reusable [Server Objects](#server-object).
<a name="components-channels"></a>channels | Map[`string`, [Channel Object](#channel-object) \| [Reference Object](#reference-object)] | An object to hold reusable [Channel Objects](#channel-object).
<a name="components-operations"></a>operations | Map[`string`, [Operation Object](#operation-object) \| [Reference Object](#reference-object)] | An object to hold reusable [Operation Objects](#operation-object).
<a name="components-messages"></a>messages | Map[`string`, [Message Object](#message-object) \| [Reference Object](#reference-object)] | An object to hold reusable [Message Objects](#message-object).
<a name="components-security-schemes"></a>securitySchemes| Map[`string`, [Security Scheme Object](#security-scheme-object) \| [Reference Object](#reference-object)] | An object to hold reusable [Security Scheme Objects](#security-scheme-object).
<a name="components-server-variables"></a>serverVariables | Map[`string`, [Server Variable Object](#server-variable-object) \| [Reference Object](#reference-object)] | An object to hold reusable [Server Variable Objects](#server-variable-object).
<a name="components-parameters"></a>parameters | Map[`string`, [Parameter Object](#parameter-object) \| [Reference Object](#reference-object)] | An object to hold reusable [Parameter Objects](#parameter-object).
<a name="components-correlationIDs"></a>correlationIds | Map[`string`, [Correlation ID Object](#correlation-id-object) \| [Reference Object](#reference-object)] | An object to hold reusable [Correlation ID Objects](#correlation-id-object).
<a name="components-replies"></a>replies | Map[`string`, [Operation Reply Object](#operation-reply-object) \| [Reference Object](#reference-object)] | An object to hold reusable [Operation Reply Objects](#operation-reply-object).
<a name="components-reply-addresses"></a>replyAddresses | Map[`string`, [Operation Reply Address Object](#operation-reply-address-object) &#124; [Reference Object](#reference-object)] | An object to hold reusable [Operation Reply Address Objects](#operation-reply-address-object).
<a name="components-external-docs"></a>externalDocs | Map[`string`, [External Documentation Object](#external-documentation-object) \| [Reference Object](#reference-object)] | An object to hold reusable [External Documentation Objects](#external-documentation-object).
<a name="components-tags"></a>tags | Map[`string`, [Tag Object](#tag-object) \| [Reference Object](#reference-object)] | An object to hold reusable [Tag Objects](#tag-object).
<a name="components-operation-traits"></a>operationTraits | Map[`string`, [Operation Trait Object](#operation-trait-object) \| [Reference Object](#reference-object)]  | An object to hold reusable [Operation Trait Objects](#operation-trait-object).
<a name="components-message-traits"></a>messageTraits | Map[`string`, [Message Trait Object](#message-trait-object) \| [Reference Object](#reference-object)]  | An object to hold reusable [Message Trait Objects](#message-trait-object).
<a name="components-server-bindings"></a>serverBindings | Map[`string`, [Server Bindings Object](#server-bindings-object) \| [Reference Object](#reference-object)]  | An object to hold reusable [Server Bindings Objects](#server-bindings-object).
<a name="components-channel-bindings"></a>channelBindings | Map[`string`, [Channel Bindings Object](#channel-bindings-object) \| [Reference Object](#reference-object)]  | An object to hold reusable [Channel Bindings Objects](#channel-bindings-object).
<a name="components-operation-bindings"></a>operationBindings | Map[`string`, [Operation Bindings Object](#operation-bindings-object) \| [Reference Object](#reference-object)]  | An object to hold reusable [Operation Bindings Objects](#operation-bindings-object).
<a name="components-message-bindings"></a>messageBindings | Map[`string`, [Message Bindings Object](#message-bindings-object) \| [Reference Object](#reference-object)]  | An object to hold reusable [Message Bindings Objects](#message-bindings-object).

This object MAY be extended with [Specification Extensions](#specification-extensions).

All the fixed fields declared above are objects that MUST use keys that match the regular expression: `^[a-zA-Z0-9\.\-_]+$`.

Field Name Examples:

```text
User
User_1
User_Name
user-name
my.org.User
```

##### Components Object Example

<!-- asyncapi-example-tester:{"name":"Components Object","json_pointer":""} -->
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
          "$ref": "./user-create.avsc"
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

<!-- asyncapi-example-tester:{"name":"Components Object","json_pointer":""} -->
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
      schemaFormat: 'application/vnd.apache.avro+json;version=1.9.0'
      schema:
        $ref: './user-create.avsc'
  servers:
    development:
      host: '{stage}.in.mycompany.com:{port}'
      description: RabbitMQ broker
      protocol: amqp
      protocolVersion: 0-9-1
      variables:
        stage:
          $ref: '#/components/serverVariables/stage'
        port:
          $ref: '#/components/serverVariables/port'
  serverVariables:
    stage:
      default: demo
      description: |
        This value is assigned by the service provider, in this example
        `mycompany.com`
    port:
      enum:
        - '5671'
        - '5672'
      default: '5672'
  channels:
    user/signedup:
      subscribe:
        message:
          $ref: '#/components/messages/userSignUp'
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
            description: |
              Unique identifier for a given instance of the publishing
              application
            type: string
      payload:
        type: object
        properties:
          user:
            $ref: '#/components/schemas/userCreate'
          signup:
            $ref: '#/components/schemas/signup'
  parameters:
    userId:
      description: Id of the user.
  correlationIds:
    default:
      description: Default Correlation ID
      location: '$message.header#/correlationId'
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

#### <a name="multi-format-schema-object"></a>Multi Format Schema Object

The Multi Format Schema Object represents a schema definition. It differs from the [Schema Object](#schema-object) in that it supports multiple schema formats or languages (e.g., JSON Schema, Avro, etc.).

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a name="multi-format-schema-object-schema-format"></a>schemaFormat | `string` | **REQUIRED**. A string containing the name of the schema format that is used to define the information. If `schemaFormat` is missing, it MUST default to `application/vnd.aai.asyncapi+json;version={{asyncapi}}` where `{{asyncapi}}` matches the [AsyncAPI Version String](#a2s-version-string). In such a case, this would make the Multi Format Schema Object equivalent to the [Schema Object](#schema-object). When using [Reference Object](#reference-object) within the schema, the `schemaFormat` of the resource being referenced MUST match the `schemaFormat` of the schema that contains the initial reference. For example, if you reference Avro `schema`, … then `schemaFormat` of the referencing resource and the resource being referenced MUST match. <br/><br/>Check out the [supported schema formats table](#multi-format-schema-format-table) for more information. Custom values are allowed but their implementation is OPTIONAL. A custom value MUST NOT refer to one of the schema formats listed in the [table](#multi-format-schema-format-table).<br/><br/>When using [Reference Objects](#reference-object) within the schema, the `schemaFormat` of the referenced resource MUST match the `schemaFormat` of the schema containing the reference.
<a name="multi-format-schema-object-schema"></a>schema | `any` | **REQUIRED**. Definition of the message payload. It can be of any type but defaults to [Schema Object](#schema-object). It MUST match the schema format defined in [`schemaFormat`](#multi-format-schema-object-schema-format), including the encoding type. E.g., Avro should be inlined as either a YAML or JSON object instead of as a string to be parsed as YAML or JSON. Non-JSON-based schemas (e.g., Protobuf or XSD) MUST be inlined as a string.

This object MAY be extended with [Specification Extensions](#specification-extensions).

##### <a name="multi-format-schema-format-table"></a>Schema formats table

The following table contains a set of values that every implementation MUST support.

Name | Allowed values | Notes
---|:---:|---
[AsyncAPI 3.0.0 Schema Object](#schema-object) | `application/vnd.aai.asyncapi;version=3.0.0`, `application/vnd.aai.asyncapi+json;version=3.0.0`, `application/vnd.aai.asyncapi+yaml;version=3.0.0` | This is the default when a `schemaFormat` is not provided.
[JSON Schema Draft 07](https://json-schema.org/specification-links.html#draft-7) | `application/schema+json;version=draft-07`, `application/schema+yaml;version=draft-07` |

The following table contains a set of values that every implementation is RECOMMENDED to support.

Name | Allowed values | Notes
---|:---:|---
[Avro 1.9.0 schema](https://avro.apache.org/docs/1.9.0/spec.html#schemas) | `application/vnd.apache.avro;version=1.9.0`, `application/vnd.apache.avro+json;version=1.9.0`, `application/vnd.apache.avro+yaml;version=1.9.0` |
[OpenAPI 3.0.0 Schema Object](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#schemaObject) | `application/vnd.oai.openapi;version=3.0.0`, `application/vnd.oai.openapi+json;version=3.0.0`, `application/vnd.oai.openapi+yaml;version=3.0.0` |
[RAML 1.0 data type](https://github.com/raml-org/raml-spec/blob/master/versions/raml-10/raml-10.md/) | `application/raml+yaml;version=1.0` |
[Protocol Buffers](https://protobuf.dev/) | `application/vnd.google.protobuf;version=2`, `application/vnd.google.protobuf;version=3` |

##### Multi Format Schema Object Examples

###### Multi Format Schema Object Example with Avro

<!-- asyncapi-example-tester:{"name":"Multi Format Schema Object - Avro","json_pointer":""} -->
```yaml
channels:
  example:
    messages:
      myMessage:
        payload:
          schemaFormat: 'application/vnd.apache.avro;version=1.9.0'
          schema:
            type: record
            name: User
            namespace: com.company
            doc: User information
            fields:
              - name: displayName
                type: string
              - name: age
                type: int
```

#### <a name="schema-object"></a>Schema Object

The Schema Object allows the definition of input and output data types.
These types can be objects, but also primitives and arrays. This object is a superset of the [JSON Schema Specification Draft 07](https://json-schema.org/). The empty schema (which allows any instance to validate) MAY be represented by the `boolean` value `true` and a schema which allows no instance to validate MAY be represented by the `boolean` value `false`.

Further information about the properties can be found in [JSON Schema Core](https://tools.ietf.org/html/draft-handrews-json-schema-01) and [JSON Schema Validation](https://tools.ietf.org/html/draft-handrews-json-schema-validation-01).
Unless stated otherwise, the property definitions follow the JSON Schema specification as referenced here. For other formats (e.g., Avro, RAML, etc) see [Multi Format Schema Object](#multi-format-schema-object).

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

- description - [CommonMark syntax](https://spec.commonmark.org/) can be used for rich text representation.
- format - See [Data Type Formats](#data-type-format) for further details. While relying on JSON Schema's defined formats, the AsyncAPI Specification offers a few additional predefined formats.
- default - Use it to specify that property has a predefined value if no other value is present. Unlike JSON Schema, the value MUST conform to the defined type for the Schema Object defined at the same level.For example, if `type` is `string`, then `default` can be `"foo"` but cannot be `1`.

Alternatively, any time a Schema Object can be used, a [Reference Object](#reference-object) can be used in its place. This allows referencing definitions in place of defining them inline. It is appropriate to clarify that the `$ref` keyword MUST follow the behavior described by [Reference Object](#reference-object) instead of the one in [JSON Schema definition](https://json-schema.org/understanding-json-schema/structuring.html#ref).

In addition to the JSON Schema fields, the following AsyncAPI vocabulary fields MAY be used for further schema documentation:

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a name="schema-object-discriminator"></a>discriminator | `string` | Adds support for polymorphism. The discriminator is the schema property name that is used to differentiate between other schema that inherit this schema. The property name used MUST be defined at this schema and it MUST be in the `required` property list. When used, the value MUST be the name of this schema or any schema that inherits it. See [Composition and Inheritance](#schema-composition) for more details.
<a name="schema-object-external-docs"></a>externalDocs | [External Documentation Object](#external-documentation-object) \| [Reference Object](#reference-object) | Additional external documentation for this schema.
<a name="schema-object-deprecated"></a> deprecated | `boolean` | Specifies that a schema is deprecated and SHOULD be transitioned out of usage. Default value is `false`.

This object MAY be extended with [Specification Extensions](#specification-extensions).

###### <a name="schema-composition"></a>Composition and Inheritance (Polymorphism)

The AsyncAPI Specification allows combining and extending model definitions using the `allOf` property of JSON Schema, in effect offering model composition.
`allOf` takes in an array of object definitions that are validated _independently_ but together compose a single object.

While composition offers model extensibility, it does not imply a hierarchy between the models.
To support polymorphism, AsyncAPI Specification adds the support of the `discriminator` field.
When used, the `discriminator` will be the name of the property used to decide which schema definition is used to validate the structure of the model.
As such, the `discriminator` field MUST be a required field.
There are two ways to define the value of a discriminator for an inheriting instance.

- Use the schema's name.
- Override the schema's name by overriding the property with a new value. If exists, this takes precedence over the schema's name.

As such, inline schema definitions, which do not have a given id, _cannot_ be used in polymorphism.

##### Schema Object Examples

###### Primitive Sample

<!-- asyncapi-example-tester:{"name":"Schema Object - Primitive","json_pointer":"/components/schemas/Email"} -->
```json
{
  "type": "string",
  "format": "email"
}
```

<!-- asyncapi-example-tester:{"name":"Schema Object - Primitive","json_pointer":"/components/schemas/Email"} -->
```yaml
type: string
format: email
```

###### Simple Model

<!-- asyncapi-example-tester:{"name":"Schema Object - Simple model","json_pointer":"/components/schemas/Person"} -->
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

<!-- asyncapi-example-tester:{"name":"Schema Object - Simple model","json_pointer":"/components/schemas/Person"} -->
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

<!-- asyncapi-example-tester:{"name":"Schema Object - Map-Dictionary model","json_pointer":"/components/schemas/Additional"} -->
```json
{
  "type": "object",
  "additionalProperties": {
    "type": "string"
  }
}
```

<!-- asyncapi-example-tester:{"name":"Schema Object - Map-Dictionary model","json_pointer":"/components/schemas/Additional"} -->
```yaml
type: object
additionalProperties:
  type: string
```

For a string to model mapping:

<!-- asyncapi-example-tester:{"name":"Schema Object - Allowing Complex model","json_pointer":"/components/schemas/WithComplex"} -->
```json
{
  "type": "object",
  "additionalProperties": {
    "$ref": "#/components/schemas/ComplexModel"
  }
}
```

<!-- asyncapi-example-tester:{"name":"Schema Object - Allowing Complex model","json_pointer":"/components/schemas/WithComplex"} -->
```yaml
type: object
additionalProperties:
  $ref: '#/components/schemas/ComplexModel'
```

###### Model with Example

<!-- asyncapi-example-tester:{"name":"Schema Object - With examples model","json_pointer":"/components/schemas/WithExamples"} -->
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

<!-- asyncapi-example-tester:{"name":"Schema Object - With examples model","json_pointer":"/components/schemas/WithExamples"} -->
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

<!-- asyncapi-example-tester:{"name":"Schema Object - With boolean model","json_pointer":"/components/schemas/WithBoolean"} -->
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

<!-- asyncapi-example-tester:{"name":"Schema Object - With boolean model","json_pointer":"/components/schemas/WithBoolean"} -->
```yaml
type: object
required:
- anySchema
properties:
  anySchema: true
  cannotBeDefined: false
```

###### Models with Composition

<!-- asyncapi-example-tester:{"name":"Schema Object - With composition model","json_pointer":"/components/schemas/WithComposition"} -->
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

<!-- asyncapi-example-tester:{"name":"Schema Object - With composition model","json_pointer":"/components/schemas/WithComposition"} -->
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

<!-- asyncapi-example-tester:{"name":"Schema Object - With polymorphism model","json_pointer":"/components/schemas/WithPolymorphism"} -->
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

<!-- asyncapi-example-tester:{"name":"Schema Object - With polymorphism model","json_pointer":"/components/schemas/WithPolymorphism"} -->
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

#### <a name="security-scheme-object"></a>Security Scheme Object

Defines a security scheme that can be used by the operations. Supported schemes are:

- User/Password.
- API key (either as user or as password).
- X.509 certificate.
- End-to-end encryption (either symmetric or asymmetric).
- HTTP authentication.
- HTTP API key.
- OAuth2's common flows (Implicit, Resource Owner Protected Credentials, Client Credentials and Authorization Code) as defined in [RFC6749](https://tools.ietf.org/html/rfc6749).
- [OpenID Connect Discovery](https://tools.ietf.org/html/draft-ietf-oauth-discovery-06).
- SASL (Simple Authentication and Security Layer) as defined in [RFC4422](https://tools.ietf.org/html/rfc4422).

##### Fixed Fields

Field Name | Type | Applies To | Description
---|:---:|---|---
<a name="security-scheme-object-type"></a>type | `string` | Any | **REQUIRED**. The type of the security scheme. Valid values are `"userPassword"`, `"apiKey"`, `"X509"`, `"symmetricEncryption"`, `"asymmetricEncryption"`, `"httpApiKey"`, `"http"`, `"oauth2"`, `"openIdConnect"`, `"plain"`, `"scramSha256"`, `"scramSha512"`, and `"gssapi"`.
<a name="security-scheme-object-description"></a>description | `string` | Any | A short description for security scheme. [CommonMark syntax](https://spec.commonmark.org/) MAY be used for rich text representation.
<a name="security-scheme-object-name"></a>name | `string` | `httpApiKey` | **REQUIRED**. The name of the header, query or cookie parameter to be used.
<a name="security-scheme-object-in"></a>in | `string` | `apiKey` \| `httpApiKey` | **REQUIRED**. The location of the API key. Valid values are `"user"` and `"password"` for `apiKey` and `"query"`, `"header"` or `"cookie"` for `httpApiKey`.
<a name="security-scheme-object-scheme"></a>scheme | `string` | `http` | **REQUIRED**. The name of the HTTP Authorization scheme to be used in the [Authorization header as defined in RFC7235](https://tools.ietf.org/html/rfc7235#section-5.1).
<a name="security-scheme-object-bearer-format"></a>bearerFormat | `string` | `http` (`"bearer"`) | A hint to the client to identify how the bearer token is formatted.  Bearer tokens are usually generated by an authorization server, so this information is primarily for documentation purposes.
<a name="security-scheme-flows"></a>flows | [OAuth Flows Object](#oauth-flows-object) | `oauth2` | **REQUIRED**. An object containing configuration information for the flow types supported.
<a name="security-scheme-open-id-connect-url"></a>open-id-connect-url | `string` | `openIdConnect` | **REQUIRED**. OpenId Connect URL to discover OAuth2 configuration values. This MUST be in the form of an absolute URL.
<a name="security-scheme-scopes"></a>scopes | [`string`] | `oauth2` \| `openIdConnect` | List of the needed scope names. An empty array means no scopes are needed.

This object MAY be extended with [Specification Extensions](#specification-extensions).

##### Security Scheme Object Example

###### User/Password Authentication Sample

<!-- asyncapi-example-tester:{"name":"Security Scheme Object - user-pass","json_pointer":"/components/securitySchemes/userPasswordAuth"} -->
```json
{
  "type": "userPassword"
}
```

<!-- asyncapi-example-tester:{"name":"Security Scheme Object - user-pass","json_pointer":"/components/securitySchemes/userPasswordAuth"} -->
```yaml
type: userPassword
```

###### API Key Authentication Sample

<!-- asyncapi-example-tester:{"name":"Security Scheme Object - API key auth","json_pointer":"/components/securitySchemes/apiKeyAuth"} -->
```json
{
  "type": "apiKey",
  "in": "user"
}
```

<!-- asyncapi-example-tester:{"name":"Security Scheme Object - API key auth","json_pointer":"/components/securitySchemes/apiKeyAuth"} -->
```yaml
type: apiKey
in: user
```

###### X.509 Authentication Sample

<!-- asyncapi-example-tester:{"name":"Security Scheme Object - X.509","json_pointer":"/components/securitySchemes/X509Auth"} -->
```json
{
  "type": "X509"
}
```

<!-- asyncapi-example-tester:{"name":"Security Scheme Object - X.509","json_pointer":"/components/securitySchemes/X509Auth"} -->
```yaml
type: X509
```

###### End-to-end Encryption Authentication Sample

<!-- asyncapi-example-tester:{"name":"Security Scheme Object - end to end encryption","json_pointer":"/components/securitySchemes/symmetricEncryptionAuth"} -->
```json
{
  "type": "symmetricEncryption"
}
```

<!-- asyncapi-example-tester:{"name":"Security Scheme Object - end to end encryption","json_pointer":"/components/securitySchemes/symmetricEncryptionAuth"} -->
```yaml
type: symmetricEncryption
```

###### Basic Authentication Sample

<!-- asyncapi-example-tester:{"name":"Security Scheme Object - basic","json_pointer":"/components/securitySchemes/basicAuth"} -->
```json
{
  "type": "http",
  "scheme": "basic"
}
```

<!-- asyncapi-example-tester:{"name":"Security Scheme Object - basic","json_pointer":"/components/securitySchemes/basicAuth"} -->
```yaml
type: http
scheme: basic
```

###### API Key Sample

<!-- asyncapi-example-tester:{"name":"Security Scheme Object - API key","json_pointer":"/components/securitySchemes/httpApiAuth"} -->
```json
{
  "type": "httpApiKey",
  "name": "api_key",
  "in": "header"
}
```

<!-- asyncapi-example-tester:{"name":"Security Scheme Object - API key","json_pointer":"/components/securitySchemes/httpApiAuth"} -->
```yaml
type: httpApiKey
name: api_key
in: header
```

###### JWT Bearer Sample

<!-- asyncapi-example-tester:{"name":"Security Scheme Object - JWT","json_pointer":"/components/securitySchemes/JWTAuth"} -->
```json
{
  "type": "http",
  "scheme": "bearer",
  "bearerFormat": "JWT"
}
```

<!-- asyncapi-example-tester:{"name":"Security Scheme Object - JWT","json_pointer":"/components/securitySchemes/JWTAuth"} -->
```yaml
type: http
scheme: bearer
bearerFormat: JWT
```

###### Implicit OAuth2 Sample

<!-- asyncapi-example-tester:{"name":"Security Scheme Object - implicity OAuth2","json_pointer":"/components/securitySchemes/oauth"} -->
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

<!-- asyncapi-example-tester:{"name":"Security Scheme Object - implicity OAuth2","json_pointer":"/components/securitySchemes/oauth"} -->
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

<!-- asyncapi-example-tester:{"name":"Security Scheme Object - SASL","json_pointer":"/components/securitySchemes/saslAuth"} -->
```json
{
  "type": "scramSha512"
}
```

<!-- asyncapi-example-tester:{"name":"Security Scheme Object - SASL","json_pointer":"/components/securitySchemes/saslAuth"} -->
```yaml
type: scramSha512
```

#### <a name="oauth-flows-object"></a>OAuth Flows Object

Allows configuration of the supported OAuth Flows.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a name="oauth-flows-implicit"></a>implicit| [OAuth Flow Object](#oauth-flow-object) | Configuration for the OAuth Implicit flow.
<a name="oauth-flows-password"></a>password| [OAuth Flow Object](#oauth-flow-object) | Configuration for the OAuth Resource Owner Protected Credentials flow.
<a name="oauth-flows-client-credentials"></a>clientCredentials| [OAuth Flow Object](#oauth-flow-object) | Configuration for the OAuth Client Credentials flow.
<a name="oauth-flows-authorization-code"></a>authorizationCode| [OAuth Flow Object](#oauth-flow-object) | Configuration for the OAuth Authorization Code flow.

This object MAY be extended with [Specification Extensions](#specification-extensions).

#### <a name="oauth-flow-object"></a>OAuth Flow Object

Configuration details for a supported OAuth Flow

##### Fixed Fields

Field Name | Type | Applies To | Description
---|:---:|---|---
<a name="oauth-flow-authorization-url"></a>authorizationUrl | `string` | `oauth2` (`"implicit"`, `"authorizationCode"`) | **REQUIRED**. The authorization URL to be used for this flow. This MUST be in the form of an absolute URL.
<a name="oauth-flow-token-url"></a>tokenUrl | `string` | `oauth2` (`"password"`, `"clientCredentials"`, `"authorizationCode"`) | **REQUIRED**. The token URL to be used for this flow. This MUST be in the form of an absolute URL.
<a name="oauth-flow-refresh-url"></a>refreshUrl | `string` | `oauth2` | The URL to be used for obtaining refresh tokens. This MUST be in the form of an absolute URL.
<a name="oauth-flow-scopes"></a>availableScopes | Map[`string`, `string`] | `oauth2` | **REQUIRED**. The available scopes for the OAuth2 security scheme. A map between the scope name and a short description for it.

This object MAY be extended with [Specification Extensions](#specification-extensions).

##### OAuth Flow Object Examples

###### clientCredentials Oauth Flow Object Example

<!-- asyncapi-example-tester:{"name":"Security Scheme OAuth Flow Object","json_pointer":"/components/securitySchemes/oauth/flows/clientCredentials"} -->
```json
{
  "tokenUrl": "https://example.com/api/oauth/token",
  "availableScopes": {
    "write:pets": "modify pets in your account",
    "read:pets": "read your pets"
  }
}
```
<!-- asyncapi-example-tester:{"name":"Security Scheme OAuth Flow Object","json_pointer":"/components/securitySchemes/oauth/flows/clientCredentials"} -->
```yaml
tokenUrl: https://example.com/api/oauth/token
availableScopes:
  write:pets: modify pets in your account
  read:pets: read your pets
```

### <a name="correlation-id-object"></a>Correlation ID Object


For specifying and computing the location of a Correlation ID, a [runtime expression](#runtime-expression) is used.

#### Fixed Fields

Field Name | Type | Description
---|:---|---
description | `string` | An optional description of the identifier. [CommonMark syntax](https://spec.commonmark.org/) can be used for rich text representation.
location | `string` | **REQUIRED.** A [runtime expression](#runtime-expression) that specifies the location of the correlation ID.

This object MAY be extended with [Specification Extensions](#specification-extensions).

##### Examples

<!-- asyncapi-example-tester:{"name":"Message Correlation ID Object","json_pointer":"/components/correlationIds/default"} -->
```json
{
  "description": "Default Correlation ID",
  "location": "$message.header#/correlationId"
}
```

<!-- asyncapi-example-tester:{"name":"Message Correlation ID Object","json_pointer":"/components/correlationIds/default"} -->
```yaml
description: Default Correlation ID
location: $message.header#/correlationId
```

### <a name="runtime-expression"></a>Runtime Expression

A runtime expression allows values to be defined based on information that will be available within the message.
This mechanism is used by [Correlation ID Object](#correlation-id-object) and [Operation Reply Address Object](#operation-reply-address-object).

The runtime expression is defined by the following [ABNF](https://tools.ietf.org/html/rfc5234) syntax:

```text
      expression = ( "$message" "." source )
      source = ( header-reference | payload-reference )
      header-reference = "header" ["#" fragment]
      payload-reference = "payload" ["#" fragment]
      fragment = a JSON Pointer [RFC 6901](https://tools.ietf.org/html/rfc6901)
```

The table below provides examples of runtime expressions and examples of their use in a value:

#### <a name="runtime-expression-examples"></a>Examples

Source Location | Example expression  | Notes
---|:---|:---|
Message Header Property | `$message.header#/MQMD/CorrelId` | Correlation ID is set using the `CorrelId` value from the `MQMD` header.
Message Payload Property | `$message.payload#/messageId` | Correlation ID is set using the `messageId` value from the message payload.

Runtime expressions preserve the type of the referenced value.

### <a name="traits-merge-mechanism"></a>Traits Merge Mechanism

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

### <a name="specification-extensions"></a>Specification Extensions

While the AsyncAPI Specification tries to accommodate most use cases, additional data can be added to extend the specification at certain points.

The extensions properties are implemented as patterned fields that are always prefixed by `"x-"`.

Field Pattern | Type | Description
---|:---:|---
<a name="info-extensions"></a>`^x-[\w\d\.\x2d_]+$` | Any | Allows extensions to the AsyncAPI Schema. The field name MUST begin with `x-`, for example, `x-internal-id`. The value can be `null`, a primitive, an array or an object. Can have any valid JSON format value.

The extensions may or may not be supported by the available tooling, but those may be extended as well to add requested support (if tools are internal or open-sourced).

### <a name="data-type-format"></a>Data Type Formats

Primitives have an optional modifier property: `format`.
The AsyncAPI specification uses several known formats to more finely define the data type being used.
However, the `format` property is an open `string`-valued property, and can have any value to support documentation needs.
Formats such as `"email"`, `"uuid"`, etc., can be used even though they are not defined by this specification.
Types that are not accompanied by a `format` property follow their definition from the JSON Schema.
Tools that do not recognize a specific `format` MAY default back to the `type` alone, as if the `format` was not specified.

The formats defined by the AsyncAPI Specification are:

Common Name | `type` | [`format`](#data-type-format) | Comments
----------- | ------ | -------- | --------
integer | `integer` | `int32` | signed 32 bits
long | `integer` | `int64` | signed 64 bits
float | `number` | `float` | |
double | `number` | `double` | |
string | `string` | | |
byte | `string` | `byte` | base64 encoded characters
binary | `string` | `binary` | any sequence of octets
boolean | `boolean` | | |
date | `string` | `date` | As defined by `full-date` - [RFC3339](https://www.rfc-editor.org/rfc/rfc3339.html#section-5.6)
dateTime | `string` | `date-time` | As defined by `date-time` - [RFC3339](https://www.rfc-editor.org/rfc/rfc3339.html#section-5.6)
password | `string` | `password` | Used to hint UIs the input needs to be obscured.
