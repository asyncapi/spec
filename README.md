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
servers | [[Server Object](#serverObject)] | An optional array of Server Objects which provide connectivity information to a target server.
topics | [Topics Object](#topicsObject) | **Required.** The available topics and messages for the API.
components | [Components Object](#componentsObject) | An element to hold various schemas for the specification.
security | [[Security Requirement Object](#securityRequirementObject)] | A declaration of which security mechanisms can be used across the API. The list of values includes alternative security requirement objects that can be used. Only one of the security requirement objects need to be satisfied to authorize a request. Individual operations can override this definition.
tags | [[Tag Object](#tagObject)] | A list of tags used by the specification with additional metadata. The order of the tags can be used to reflect on their order by the parsing tools. Not all tags that are used by the [Operation Object](#operationObject) must be declared. The tags that are not declared may be organized randomly or based on the tools' logic. Each tag name in the list MUST be unique.
externalDocs | [External Documentation Object](#externalDocumentationObject) | Additional external documentation.

This object can be extended with [Specification Extensions](#specificationExtensions).

#### <a name="aasVersion"></a>AsyncAPI Version String

The version string signifies the version of the AsyncAPI Specification that the document complies to.  The format for this string _must_ be `major`.`minor`.`patch`.  The `patch` _may_ be suffixed by a hyphen and extra alphanumeric characters.

A `major`.`minor` shall be used to designate the AsyncAPI Specification version, and will be considered compatible with the AsyncAPI Specification specified by that `major`.`minor` version.  The patch version will not be considered by tooling, making no distinction between `1.0.0` and `1.0.1`.

In subsequent versions of the AsyncAPI Specification, care will be given such that increments of the `minor` version should not interfere with operations of tooling developed to a lower minor version. Thus a hypothetical `1.1.0` specification should be usable with tooling designed for `1.0.0`.








