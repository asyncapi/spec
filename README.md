# AsyncAPI Specification

#### Disclaimer

Part of this content has been taken from the great work done by the folks at the [Open API Initiative](https://openapis.org). Mainly because it's a great work and we want to keep as much compatibility as possible with the [Open API Specification](https://github.com/OAI/OpenAPI-Specification).

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
It combines what previously was the Resource Listing and API Declaration (version 1.2 and earlier) together into one document.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
asyncapi | [AsyncAPI Version String](#A2SVersionString) | **Required.** Specifies the AsyncAPI Specification version being used. It can be used by tooling Specifications and clients to interpret the version. The structure shall be `major`.`minor`.`patch`, where `patch` versions _must_ be compatible with the existing `major`.`minor` tooling. Typically patch versions will be introduced to address errors in the documentation, and tooling should typically be compatible with the corresponding `major`.`minor` (1.0.*). Patch versions will correspond to patches of this document.
info | [Info Object](#infoObject) | **Required.** Provides metadata about the API. The metadata can be used by the clients if needed.
baseTopic | [BaseTopic String](#baseTopicString) | The base topic to the API.
topics | [Topics Object](#topicsObject) | **Required.** The available topics and messages for the API.
components | [Components Object](#componentsObject) | An element to hold various schemas for the specification.


This object can be extended with [Specification Extensions](#specificationExtensions).

#### <a name="A2SVersionString"></a>AsyncAPI Version String

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

#### <a name="baseTopicString"></a>baseTopic String

The base topic to the API. Example: 'hitch'.
