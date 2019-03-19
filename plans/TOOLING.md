# Tooling plans and tentative roadmap

This document describes the tentative roadmap for AsyncAPI tooling in the next year, and the strategies we'll follow to create the tools.

## Tentative Roadmap

### Epics

The following is a list of "epics" we're working on or about to start working on.

Note the epics are not necessarily in order of implementation priority. Please, check out the "Dependencies" section on each of the epics to understand what's blocking them.

#### :arrow_right: Create a Parser/Validator
The first tool we would have to implement is the AsyncAPI parser/validator. The parser/validator is a core piece of all the other tooling we'll build in the future. Therefore it's a top priority for us.

##### Requirements:
1. It MUST support YAML and JSON as input formats.
2. It MUST support the following schema formats: OpenAPI schemas, JSON Schema Draft 04-07, Protobuf, and Avro.
3. It MUST support plugging in a new format parser.
4. It MUST be implemented as a Go package and [exported as a C shared object](https://medium.com/learning-the-go-programming-language/calling-go-functions-from-other-languages-4c7d8bcc69bf).
5. It MUST have wrappers in, at least, the following languages: Java and Node.js.

#### :arrow_right: Add support for AsyncAPI 2.0.0 in AsyncAPI React component
_Requirements to be discussed with [@derberg](https://github.com/derberg) and the Kyma/SAP team._

##### Suggestions:
* Extract parser implementation to another package.
* Make sure all parser dependencies are compatible with a browser.

##### Dependencies:
* Parser/Validator

#### :arrow_right: Add support for AsyncAPI 2.0.0 in all [asyncapi/generator](https://github.com/asyncapi/generator) templates
So far, only HTML and Markdown templates will require work.

##### Dependencies:
* Parser/Validator

#### :arrow_right: Improve online code editor (editor.asyncapi.org)
Most probably this will consist in ditching the current editor in favor of the playground [@derberg](https://github.com/derberg) and the Kyma/SAP team have created.

##### Requirements:
* Add support for multiple documentation formats: React, HTML, and Markdown.
* Add support for multiple schema types: OpenAPI, JSON Schema Draft 04-07, Protobuf, and Avro.
* Add a button to generate and download code (whenever code generators are available).
* Add ability to load a remote file.
* Auto-update documentation as you type.

##### Dependencies:
* AsyncAPI 2.0.0 React, HTML, and Markdown.

### Tentative Epics

The following is a list of "epics" we're considering for implementation and we're currently exploring the viability of those.

Note the epics are not necessarily in order of implementation priority. Please, check out the "Dependencies" section on each of the epics to understand what's blocking them.

#### :arrow_right: Create code generation framework
1. Design a code generation solution.
2. Keep in mind how to make the code generation solution suitable for documentation generation too. Maybe by improving [asyncapi/generator](https://github.com/asyncapi/generator)?
3. Implement code generation templates for the following languages: Java, Node.js, and Go.

##### Dependencies:
* Parser/Validator

#### :arrow_right: SDKs
Investigate, define requirements, and implement, at least, two SDKs: one for Java <sup>1</sup> and another for Node.js. Ideally, we should find a way to automate the process of creating new SDKs, or to make it as fast and smooth as possible.

##### Suggestions:
* Implement an SDK in Go.
* Create wrappers for other languages.

##### Dependencies:
* Parser/Validator

#### :arrow_right: Implement code generation templates using SDKs
Implement templates in our code generation tool for a simple Java application and a simple Node.js application, both using our SDKs.

##### Dependencies:
* Parser/Validator
* SDKs

## Strategies
As you may have already noticed, there are three main tooling categories:
1. Parser/Validator
2. SDKs
3. Code and documentation generators

By far, the one that will require more work is the "SDKs" one. Just the fact that we'll have to build all the possible combinations between languages, schema formats, and protocols, makes you quickly realize it's going to be a tedious task. Let's do a quick calculation here: 4 languages (Java, Node.js, Go, and .NET) x 4 schema formats (OpenAPI, JSON Schema Draft 04-07, Protobuf, and Avro) x 5 protocols (AMQP 0-9-1, AMQP 1.0, Kafka, MQTT, WebSockets) = 80 combinations! And I'm keeping the list of languages and protocols short on purpose.

It's no secret we'll have to do ~some~a lot of automation here. But how do we automate all of this? There's the challenge! We're not going to build all of this at once, obviously. Instead, we should follow an incremental approach where we can learn of every step and feed the process back with the learnings to keep improving it.

![](https://cdn.dribbble.com/users/377435/screenshots/1753131/redisflat_mvp.png "MVP by Kirill Shikhanov")

---
1: Do we really need an SDK for Java? Or are Spring Boot and Spring Cloud Streams enough? Are they very coupled to Spring? i.e., can someone use these libraries without using the Spring framework?
