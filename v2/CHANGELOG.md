# AsyncAPI v2.0.0 Changelog

## Table of Contents
  - [Multiple messages per topic.](#multiple-messages-per-topic)
  - [Scheme-specific payload and headers.](#scheme-specific payload-and-headers)
  - HTTP Streaming.
    * SSE, carriage-return, and newline.
    * (not needed for now) Headers used when connecting (i.e Content-Type).
  - Events without topics.
  - Move security requirements to server objects.
  - Topic parameters description.
  - Review XML functionality.
    * Content-Type on messages
  - IoT:
    * String payloads (Fixed-length and variable-length fields).
  - Allow for payload media types to be documented.
  - Add support for server.scheme 'jms'.
  - Support callback message descriptions.
  - Add support for "oneOf", "anyOf", and "not" on schemas.
  - Add global property to override the default topic separator.

## Descriptions

### Multiple messages per topic

Many people use the same topic/channel to transmit different kind of messages. It now supports specifying multiple message definitions for a single topic.

It is a breaking change, because a topic operation (subscribe or publish) is now accepting an array instead of an key-value object.

### Scheme-specific payload and headers

Some APIs allow you to connect using multiple schemes, i.e. AMQP and MQTT. Now it's possible to document specific payload or header fields depending on the scheme and version.

