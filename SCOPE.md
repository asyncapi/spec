# AsyncAPI Scope

AsyncAPI is a specification for defining message-driven APIs. We're on a mission to standardize message-based communication and increase interoperability of the different types of systems available.

## Scope

The following is a list of features the AsyncAPI specification and its official tooling should offer:

- Provide enough information to connect and consume message-driven APIs. An AsyncAPI document should provide everything your software needs to connect to a given API and start publishing and/or consuming messages from it.
- Offer a framework for validating message payloads and headers.
- Allow you to strictly define your message-driven API in a machine-readable format.
- Provide mechanisms for mapping the information contained in an AsyncAPI document to the major messaging protocols.
- Protocol-specific features, such as queues, exchanges, policies, partitions, etc; always via protocol mappers.
- Provide a standard way to create specification extensions and promote their discoverability. 
- Offer mechanisms to define message schemas in different formats. Namely: JSON Schema, OpenAPI schema (_slightly different than JSON Schema Draft 04_), Protobuf, Avro, etc.
- Provide parsers for all the major programming languages, so it's easier for others to create tooling.
- Bring human-readable documentation generators in React, HTML, and Markdown formats.
- Offer code generators for all the major programming languages.

## Out of scope

- Solutions for REST, RPC, gRPC, GraphQL.
- HTTP APIs, except HTTP streaming.
- Everything that's provided by OpenAPI.

## Compatiblity with OpenAPI

AsyncAPI was born out of the OpenAPI specification. The idea was to provide a similar format to describe message-driven APIs. Therefore, you'll find many similarities between both.

There's especially one of the components that's exactly the same between both: schemas. We made it on purpose so you could re-use OpenAPI schemas in your AsyncAPI documents and viceversa.

Although AsyncAPI is not part of the OpenAPI Initiative (OAI), we regularly work together in order to make both of them as compatible as possible.