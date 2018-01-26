# AsyncAPI Specification

#### Disclaimer

Part of this content has been taken from the great work done by the folks at the [Open API Initiative](https://openapis.org). Mainly because **it's a great work** and we want to keep as much compatibility as possible with the [Open API Specification](https://github.com/OAI/OpenAPI-Specification).

#### Version 1.0.0

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [RFC 2119](http://www.ietf.org/rfc/rfc2119.txt).

The AsyncAPI Specification is licensed under [The Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0.html).

## Introduction

The AsyncAPI Specification is a project used to describe and document Asynchronous APIs.

The AsyncAPI Specification defines a set of files required to describe such an API.
These files can then be used to create utilities, such as documentation, integration and/or testing tools.

The AsyncAPI Specification is often used to describe the inter-process communication (IPC) in distributed systems built using a broker-centric architecture. In such cases, it's very easy to get confused with what the AsyncAPI files must describe. **It's RECOMMENDED to create a single file describing the whole system instead of creating a file for each [process](#definitionsProcess).** Otherwise, you will end up having lots of interdependent files.

The file(s) MUST describe the operations a new [process](#definitionsProcess) can perform. For instance:

```yaml
event.user.signup:
  subscribe:
    $ref: "#/components/messages/userSignUp"
```

It means [processes](#definitionsProcess) can subscribe to `event.user.signup` topic. However, it does NOT mean every [process](#definitionsProcess) must subscribe to this topic.

{{toc}}

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

### File Structure

The A2S representation of the API is made of a single file.
However, parts of the definitions can be split into separate files, at the discretion of the user.
This is applicable for `$ref` fields in the specification as follows from the [JSON Schema](http://json-schema.org) definitions.

By convention, the AsyncAPI Specification (A2S) file is named `asyncapi.json` or `asyncapi.yaml`.

### Schema

{{schema}}

