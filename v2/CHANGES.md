- [x] Multiple messages per topic.
- [x] Protocol-specific payload, headers.
- [x] HTTP Streaming.
  * SSE, carriage-return, and newline.
  * (not needed for now) Headers used when connecting (i.e Content-Type).
- [x] Events without topics.
- [x] Move security requirements to server objects.
- [x] Topic parameters description.
- [x] Review XML functionality.
  * Content-Type on messages
- [x] IoT:
  * String payloads (Fixed-length and variable-length fields).
- [x] Allow for payload media types to be documented.
- [x] Add support for server.scheme 'jms'.
- [x] Support callback message descriptions.
- [x] Add support for "oneOf", "anyOf", and "not" on schemas.
- [x] Add global property to override the default topic separator.
- [ ] Human-readable documentation generated from the machine-readable one.
  * Allow for complete topic name description through flexible baseTopic & topics.topic composition.
