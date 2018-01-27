# AsyncAPI v2.0.0 Changelog

## Table of Contents
  * [Multiple messages per topic.](#multiple-messages-per-topic)
  * [Scheme-specific payload and headers.](#scheme-specific-payload-and-headers)
  * [HTTP Streaming.](#http-streaming)
  * [WebSockets APIs.](#websockets-apis)
  * Move security requirements to server objects.
  * Topic parameters description.
  * Review XML functionality.
    * Content-Type on messages
  * IoT:
    * String payloads (Fixed-length and variable-length fields).
  * Allow for payload media types to be documented.
  * Add support for server.scheme 'jms'.
  * Support callback message descriptions.
  * Add support for "oneOf", "anyOf", and "not" on schemas.
  * Add global property to override the default topic separator.

## Descriptions

### Multiple messages per topic

Many people use the same topic/channel to transmit different kind of messages. It now supports specifying multiple message definitions for a single topic.

It is a breaking change, because a topic operation (subscribe or publish) is now accepting an array instead of an key-value object.

### Scheme-specific payload and headers

Some APIs allow you to connect using multiple schemes, i.e. AMQP and MQTT. Now it's possible to document specific payload or header fields depending on the scheme and version. Kudos to [@gmr](https://github.com/gmr) for [the idea](https://github.com/asyncapi/asyncapi/issues/42).

### HTTP Streaming

This is a major new feature in AsyncAPI. We can now document Streaming APIs. It supports two different types of framing:
  * HTTP chunked transfer encoding.
  * HTTP server-sent events.

Kudos to [@jkarneges](https://github.com/jkarneges) for [the idea and the documentation provided](https://github.com/asyncapi/asyncapi/issues/47).

### WebSockets APIs

This is another major new feature in AsyncAPI. We can now document event-driven APIs that don't know or implement the concept of a _topic_, i.e. WebSockets APIs.

Kudos to [@jkarneges](https://github.com/jkarneges) for [the idea and the documentation provided](https://github.com/asyncapi/asyncapi/issues/47).
