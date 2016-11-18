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











