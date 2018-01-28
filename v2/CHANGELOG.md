# AsyncAPI v2.0.0 Changelog

## Table of Contents
  * [Multiple messages per topic.](#multiple-messages-per-topic)
  * [Scheme-specific payload and headers.](#scheme-specific-payload-and-headers)
  * [HTTP Streaming.](#http-streaming)
  * [WebSockets APIs.](#websockets-apis)
  * [Moved security requirements to server objects.](#moved-security-requirements-to-server-objects)
  * [Topic parameters definition.](#topic-parameters-definition)
  * [Message Content-Type.](#message-content-type)
  * [Structured string payloads.](#structured-string-payloads)
  * [Added JMS scheme.](#added-jms-scheme)
  * [Callback messages.](#callback-messages)
  * [Support for "oneOf", "anyOf", and "not" on schemas.](#support-for-oneof-anyof-and-not-on-schemas)
  * [Override default topic separator.](#override-default-topic-separator)

## Descriptions

### Multiple messages per topic

Many people use the same topic/channel to transmit different kind of messages. It now supports specifying multiple message definitions for a single topic.

It is a breaking change, because a topic operation (subscribe or publish) is now accepting an array instead of an key-value object.

### Scheme-specific payload and headers

Some APIs allow you to connect using multiple schemes, i.e. AMQP and MQTT. Now it's possible to document specific payload or header fields depending on the scheme and version. Kudos to [@gmr](https://github.com/gmr) for [the idea](https://github.com/asyncapi/asyncapi/issues/42).

### HTTP streaming

This is a major new feature in AsyncAPI. We can now document Streaming APIs. It supports two different types of framing:
  * HTTP chunked transfer encoding.
  * HTTP server-sent events.

Kudos to [@jkarneges](https://github.com/jkarneges) for [the idea and the documentation provided](https://github.com/asyncapi/asyncapi/issues/47).

### WebSockets APIs

This is another major new feature in AsyncAPI. We can now document event-driven APIs that don't know or implement the concept of a _topic_, i.e. WebSockets APIs.

Kudos to [@jkarneges](https://github.com/jkarneges) for [the idea and the documentation provided](https://github.com/asyncapi/asyncapi/issues/47).

### Moved security requirements to server objects

Security requirements have been moved to the Server Object. Since AsyncAPI supports specifying the scheme for every server, it makes more sense to define security requirements for each particular server definition, instead of having a single security requirement for the whole API.

### Topic parameters definition

Since AsyncAPI v1.0.0, topics support templating, i.e. you can define replaceable parts or _parameters_. Now it is possible to define rules for these parameters. So far, you can specify a description, and a set of allowed values or a regular expression pattern it should match.

Kudos to [@riccardo1991](https://github.com/riccardo1991) for [reporting it](https://github.com/asyncapi/asyncapi/issues/51).

### Message Content-Type

We can now define the content type of a message. This field accepts any MIME type. Along with it, a root property `defaultContentType` has also been added, to override the default content type for messages.

Kudos to [@wout3r](https://github.com/wout3r) for [the idea](https://github.com/asyncapi/asyncapi/issues/54).

### Structured string payloads

In an effort to help document IoT APIs, it is now possible to describe structured string payloads. Many IoT APIs don't use JSON, but instead, they choose to create their own custom format to reduce the number of bytes they send through the wire.

### Added JMS scheme

You can now use `jms` as a scheme.

Kudos to [@wout3r](https://github.com/wout3r) for [the proposal](https://github.com/asyncapi/asyncapi/issues/52)

### Callback messages

This is a cool new feature that will help document RPC operations in message-driven systems. It allows to define a message that will serve as a response to another one.

Kudos to [@wout3r](https://github.com/wout3r) for [the proposal](https://github.com/asyncapi/asyncapi/issues/55)

### Support for "oneOf", "anyOf", and "not" on schemas

It is more a bugfix than a feature. For some reason `oneOf`, `anyOf` and `not` were left out in version 1.0.0. They are now included. 

Kudos to [@wout3r](https://github.com/wout3r) and [@SensibleWood](https://github.com/SensibleWood) for reporting it.

### Override default topic separator

It is now possible to override the default topic separator by specifying `defaultTopicSeparator`. This value will be used to concatenate the base topic (if it exists) with every topic. A common use case is to set it to `/` when documenting MQTT APIs.
