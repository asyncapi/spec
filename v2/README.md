#### <a name="async-api-2-0-0-schema"></a>AsyncAPI 2.0.0 schema.

This is the root document object for the API specification. It combines resource listing and API declaration together into one document.

One, and only one, of the following is required: `topics` or `stream` or `events`.


##### Fixed Fields
Field Name | Type | Description
---|:---:|---
<a name="asyncapi-async-api-version-string"></a>`asyncapi` | [AsyncAPI Version String](#async-api-version-string)| **REQUIRED**. Specifies the AsyncAPI Specification version being used. It can be used by tooling Specifications and clients to interpret the version. The structure SHALL be `major`.`minor`.`patch`, where `patch` versions MUST be compatible with the existing `major`.`minor` tooling. Typically patch versions will be introduced to address errors in the documentation, and tooling should typically be compatible with the corresponding `major`.`minor` (1.0.\*). Patch versions will correspond to patches of this document.
<a name="asyncapi-info-object"></a>`info` | [Info Object](#info-object)| **REQUIRED**. Provides metadata about the API. The metadata can be used by the clients if needed.
<a name="asyncapi-base-topic-object"></a>`baseTopic` | [Base Topic Object](#base-topic-object)| The base topic to the API.
<a name="asyncapi-topic-separator"></a>`topicSeparator` | `topicSeparator` | The string or character used to separate topic parts. For example, MQTT uses `/`, AMQP uses `.`. Defaults to `.`.
<a name="asyncapi-default-content-type"></a>`defaultContentType` | `defaultContentType` | Sets the default content type for messages. Defaults to `application/json`.
<a name="asyncapi-servers-array"></a>`servers` | `Servers Array` | An array of [Server Objects](#server-object), which provide connectivity information to a target server.
<a name="asyncapi-topics-object"></a>`topics` | [Topics Object](#topics-object)| The available topics and messages for the API.
<a name="asyncapi-stream-object"></a>`stream` | [Stream Object](#stream-object)| The list of messages a consumer can read or write from/to a streaming API.
<a name="asyncapi-events-object"></a>`events` | [Events Object](#events-object)| The list of messages an events API sends and/or receives.
<a name="asyncapi-components-object"></a>`components` | [Components Object](#components-object)| An element to hold various schemas for the specification.
<a name="asyncapi-tags-array"></a>`tags` | [Tags Array](#tags-array)| A list of tags used by the specification with additional metadata. Each tag name in the list MUST be unique.
<a name="asyncapi-external-docs-object"></a>`externalDocs` | [External Docs Object](#external-docs-object)| Additional external documentation.



This object can be extended with [Specification Extensions](#specificationExtensions).




#### <a name="async-api-version-string"></a>AsyncAPI Version String

The version string signifies the version of the AsyncAPI Specification that the document complies to.
The format for this string _must_ be `major`.`minor`.`patch`.  The `patch` _may_ be suffixed by a hyphen and extra alphanumeric characters.

A `major`.`minor` shall be used to designate the AsyncAPI Specification version, and will be considered compatible with the AsyncAPI Specification specified by that `major`.`minor` version.
The patch version will not be considered by tooling, making no distinction between `1.0.0` and `1.0.1`.

In subsequent versions of the AsyncAPI Specification, care will be given such that increments of the `minor` version should not interfere with operations of tooling developed to a lower minor version. Thus a hypothetical `1.1.0` specification should be usable with tooling designed for `1.0.0`.









#### <a name="info-object"></a>Info Object

General information about the API.

##### Fixed Fields
Field Name | Type | Description
---|:---:|---
<a name="info-"></a>`title` | [string](#)| A unique and precise title of the API.
<a name="info-"></a>`version` | [string](#)| A semantic version number of the API.
<a name="info-"></a>`description` | [string](#)| A longer description of the API. Should be different from the title. CommonMark is allowed.
<a name="info-"></a>`termsOfService` | [string](#)| A URL to the Terms of Service for the API. MUST be in the format of a URL.
<a name="info-contact-object"></a>`contact` | [Contact Object](#contact-object)| 
<a name="info-license-object"></a>`license` | [License Object](#license-object)| 



This object can be extended with [Specification Extensions](#specificationExtensions).



##### Info Object Examples:





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
  "version": "1.0.1"
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
```




#### <a name="base-topic-object"></a>Base Topic Object

The base topic to the API. Example: 'hitch'.











#### <a name="topics-object"></a>Topics Object

Holds the relative paths to the individual topic and their operations. The topic is appended to the [`Base Topic`](#base-topic-object) in order to construct the full one.


##### Patterned Fields
Field Pattern | Type | Description
---|:---:|---
<a name="topics-topic-item-object"></a>`^[^.]` | [Topic Item Object](#topic-item-object)| A relative path to an individual topic. The field name MUST NOT begin with a dot. [Topic templating](#topic-templating) is allowed.


This object can be extended with [Specification Extensions](#specificationExtensions).



##### Topics Object Examples:





```json
{
  "accounts.1.0.event.user.signup": {
    "subscribe": {
      "$ref": "#/components/messages/userSignedUp"
    }
  }
}
```




```yaml
accounts.1.0.event.user.signup:
  subscribe:
    $ref: "#/components/messages/userSignedUp"
```




#### <a name="topic-item-object"></a>Topic Item Object

Describes the operations available on a single topic.

##### Fixed Fields
Field Name | Type | Description
---|:---:|---
<a name="topicItem-"></a>`$ref` | `string` | Allows for an external definition of this topic item. The referenced structure MUST be in the format of a [Topic Item Object](#topic-item-object). If there are conflicts between the referenced definition and this Topic Item's definition, the behavior is *undefined*.
<a name="topicItem-topic-params-object"></a>`params` | [Topic Params Object](#topic-params-object)| TODO
<a name="topicItem-message-object"></a>`publish` | [[Message Object](#message-object)]| An array of messages a PUBLISH operation might receive on this topic.
<a name="topicItem-message-object"></a>`subscribe` | [[Message Object](#message-object)]| An array of messages a SUBSCRIBE operation might receive on this topic.
<a name="topicItem-"></a>`deprecated` | [boolean](#)| TODO



This object can be extended with [Specification Extensions](#specificationExtensions).





#### <a name="topic-params-object"></a>Topic Params Object

TODO


##### Patterned Fields
Field Pattern | Type | Description
---|:---:|---
<a name="topicParams-topic-param-object"></a>`[a-zA-Z0-9-_]+` | [Topic Param Object](#topic-param-object)| TODO







#### <a name="topic-param-object"></a>Topic Param Object

TODO








#### <a name="stream-object"></a>Stream Object

TODO

##### Fixed Fields
Field Name | Type | Description
---|:---:|---
<a name="stream-stream-framing-object"></a>`framing` | [Stream Framing Object](#stream-framing-object)| TODO
<a name="stream-message-object"></a>`read` | [[Message Object](#message-object)]| TODO
<a name="stream-message-object"></a>`write` | [[Message Object](#message-object)]| TODO



This object can be extended with [Specification Extensions](#specificationExtensions).





#### <a name="events-object"></a>Events Object

TODO

##### Fixed Fields
Field Name | Type | Description
---|:---:|---
<a name="events-message-object"></a>`receive` | [[Message Object](#message-object)]| TODO
<a name="events-message-object"></a>`send` | [[Message Object](#message-object)]| TODO



This object can be extended with [Specification Extensions](#specificationExtensions).





#### <a name="components-object"></a>Components Object

An object to hold a set of reusable objects for different aspects of the AsyncAPI Specification.

##### Fixed Fields
Field Name | Type | Description
---|:---:|---
<a name="components-schemas-object"></a>`schemas` | [Schemas Object](#schemas-object)| 
<a name="components-messages-object"></a>`messages` | [Messages Object](#messages-object)| 
<a name="components-security-schemes-object"></a>`securitySchemes` | [Security Schemes Object](#security-schemes-object)| 








#### <a name="tags-array"></a>Tags Array

TODO








#### <a name="contact-object"></a>Contact Object

Contact information for the owners of the API.

##### Fixed Fields
Field Name | Type | Description
---|:---:|---
<a name="contact-"></a>`name` | [string](#)| The identifying name of the contact person/organization.
<a name="contact-"></a>`url` | [string](#)| The URL pointing to the contact information.
<a name="contact-"></a>`email` | [string](#)| The email address of the contact person/organization.



This object can be extended with [Specification Extensions](#specificationExtensions).





#### <a name="license-object"></a>License Object

TODO

##### Fixed Fields
Field Name | Type | Description
---|:---:|---
<a name="license-"></a>`name` | [string](#)| The name of the license type. It's encouraged to use an OSI compatible license.
<a name="license-"></a>`url` | [string](#)| The URL pointing to the license.



This object can be extended with [Specification Extensions](#specificationExtensions).





#### <a name="server-object"></a>Server Object

An object representing a Server.

##### Fixed Fields
Field Name | Type | Description
---|:---:|---
<a name="server-"></a>`url` | [string](#)| TODO
<a name="server-"></a>`description` | [string](#)| TODO
<a name="server-"></a>`scheme` | [string](#)| The transfer protocol.
<a name="server-"></a>`schemeVersion` | [string](#)| TODO
<a name="server-todo"></a>`security` | [[TODO](#todo)]| TODO
<a name="server-server-variables-object"></a>`variables` | [Server Variables Object](#server-variables-object)| TODO



This object can be extended with [Specification Extensions](#specificationExtensions).





#### <a name="server-variables-object"></a>Server Variables Object

TODO








#### <a name="server-variable-object"></a>Server Variable Object

An object representing a Server Variable for server URL template substitution.

##### Fixed Fields
Field Name | Type | Description
---|:---:|---
<a name="serverVariable-"></a>`enum` | [[string](#)]| 
<a name="serverVariable-"></a>`default` | [string](#)| 
<a name="serverVariable-"></a>`description` | [string](#)| 



This object can be extended with [Specification Extensions](#specificationExtensions).





#### <a name="schemas-object"></a>Schemas Object

JSON objects describing schemas the API uses.








#### <a name="messages-object"></a>Messages Object

JSON objects describing the messages being consumed and produced by the API.








#### <a name="security-schemes-object"></a>Security Schemes Object

TODO


##### Patterned Fields
Field Pattern | Type | Description
---|:---:|---
<a name="securitySchemes-"></a>`^[a-zA-Z0-9\.\-_]+$` | [](#)| TODO







#### <a name="schema-object"></a>Schema Object

A deterministic version of a JSON Schema object.

##### Fixed Fields
Field Name | Type | Description
---|:---:|---
<a name="schema-"></a>`$ref` | [string](#)| TODO
<a name="schema-"></a>`format` | [string](#)| TODO
<a name="schema-"></a>`title` | [string](#)| TODO
<a name="schema-"></a>`description` | [string](#)| TODO
<a name="schema-"></a>`default` | [](#)| TODO
<a name="schema-"></a>`multipleOf` | [](#)| TODO
<a name="schema-"></a>`maximum` | [](#)| TODO
<a name="schema-"></a>`exclusiveMaximum` | [](#)| TODO
<a name="schema-"></a>`minimum` | [](#)| TODO
<a name="schema-"></a>`exclusiveMinimum` | [](#)| TODO
<a name="schema-"></a>`maxLength` | [](#)| TODO
<a name="schema-"></a>`minLength` | [](#)| TODO
<a name="schema-"></a>`pattern` | [](#)| TODO
<a name="schema-"></a>`maxItems` | [](#)| TODO
<a name="schema-"></a>`minItems` | [](#)| TODO
<a name="schema-"></a>`uniqueItems` | [](#)| TODO
<a name="schema-"></a>`maxProperties` | [](#)| TODO
<a name="schema-"></a>`minProperties` | [](#)| TODO
<a name="schema-"></a>`required` | [](#)| TODO
<a name="schema-"></a>`enum` | [](#)| TODO
<a name="schema-"></a>`additionalProperties` | [](#)| TODO
<a name="schema-"></a>`type` | [](#)| TODO
<a name="schema-"></a>`items` | [](#)| TODO
<a name="schema-"></a>`requiredItems` | [[number](#)]| TODO
<a name="schema-"></a>`repeatableItems` | [boolean](#)| TODO
<a name="schema-"></a>`itemSeparator` | [string](#)| TODO
<a name="schema-"></a>`value` | [](#)| 
<a name="schema-"></a>`properties` | [object](#)| TODO
<a name="schema-"></a>`discriminator` | [string](#)| TODO
<a name="schema-"></a>`readOnly` | [boolean](#)| TODO
<a name="schema-xml-object"></a>`xml` | [XML Object](#xml-object)| TODO
<a name="schema-external-docs-object"></a>`externalDocs` | [External Docs Object](#external-docs-object)| TODO
<a name="schema-"></a>`eol` | [string](#)| TODO
<a name="schema-"></a>`example` | [](#)| 



This object can be extended with [Specification Extensions](#specificationExtensions).





#### <a name="xml-object"></a>XML Object

TODO

##### Fixed Fields
Field Name | Type | Description
---|:---:|---
<a name="xml-"></a>`name` | [string](#)| TODO
<a name="xml-"></a>`namespace` | [string](#)| TODO
<a name="xml-"></a>`prefix` | [string](#)| TODO
<a name="xml-"></a>`attribute` | [boolean](#)| TODO
<a name="xml-"></a>`wrapped` | [boolean](#)| TODO








#### <a name="external-docs-object"></a>External Docs Object

Information about external documentation

##### Fixed Fields
Field Name | Type | Description
---|:---:|---
<a name="externalDocs-"></a>`description` | [string](#)| TODO
<a name="externalDocs-"></a>`url` | [string](#)| TODO



This object can be extended with [Specification Extensions](#specificationExtensions).





#### <a name="message-object"></a>Message Object

Describes a message that is sent and/or received.

##### Fixed Fields
Field Name | Type | Description
---|:---:|---
<a name="message-"></a>`$ref` | [string](#)| TODO
<a name="message-schema-object"></a>`headers` | [Schema Object](#schema-object)| TODO
<a name="message-schema-object"></a>`payload` | [Schema Object](#schema-object)| TODO
<a name="message-"></a>`callbacks` | [object](#)| TODO
<a name="message-"></a>`schemes` | [object](#)| TODO
<a name="message-tag-object"></a>`tags` | [[Tag Object](#tag-object)]| TODO
<a name="message-"></a>`summary` | [string](#)| A brief summary of the message.
<a name="message-"></a>`description` | [string](#)| A longer description of the message. CommonMark is allowed.
<a name="message-external-docs-object"></a>`externalDocs` | [External Docs Object](#external-docs-object)| TODO
<a name="message-"></a>`deprecated` | [boolean](#)| TODO
<a name="message-"></a>`contentType` | [string](#)| TODO
<a name="message-"></a>`example` | [](#)| 



This object can be extended with [Specification Extensions](#specificationExtensions).





#### <a name="callback-object"></a>Callback Object

TODO

##### Fixed Fields
Field Name | Type | Description
---|:---:|---
<a name="callback-"></a>`topic` | [string](#)| TODO
<a name="callback-"></a>`message` | [](#)| TODO








#### <a name="specification-extensions"></a>Specification Extensions

While the AsyncAPI Specification tries to accommodate most use cases, additional data can be added to extend the specification at certain points.

The extensions properties are implemented as patterned fields that are always prefixed by `"x-"`.









#### <a name="tag-object"></a>Tag Object

TODO

##### Fixed Fields
Field Name | Type | Description
---|:---:|---
<a name="tag-"></a>`name` | [string](#)| TODO
<a name="tag-"></a>`description` | [string](#)| TODO
<a name="tag-external-docs-object"></a>`externalDocs` | [External Docs Object](#external-docs-object)| TODO



This object can be extended with [Specification Extensions](#specificationExtensions).





#### <a name="security-scheme-object"></a>Security Scheme Object

TODO








#### <a name="todo"></a>TODO

TODO

##### Fixed Fields
Field Name | Type | Description
---|:---:|---
<a name="userPassword-"></a>`type` | [string](#)| 
<a name="userPassword-"></a>`description` | [string](#)| 



This object can be extended with [Specification Extensions](#specificationExtensions).





#### <a name="todo"></a>TODO

TODO

##### Fixed Fields
Field Name | Type | Description
---|:---:|---
<a name="apiKey-"></a>`type` | [string](#)| 
<a name="apiKey-"></a>`in` | [string](#)| 
<a name="apiKey-"></a>`description` | [string](#)| 



This object can be extended with [Specification Extensions](#specificationExtensions).





#### <a name="todo"></a>TODO

TODO

##### Fixed Fields
Field Name | Type | Description
---|:---:|---
<a name="X509-"></a>`type` | [string](#)| 
<a name="X509-"></a>`description` | [string](#)| 



This object can be extended with [Specification Extensions](#specificationExtensions).





#### <a name="todo"></a>TODO

TODO

##### Fixed Fields
Field Name | Type | Description
---|:---:|---
<a name="symmetricEncryption-"></a>`type` | [string](#)| 
<a name="symmetricEncryption-"></a>`description` | [string](#)| 



This object can be extended with [Specification Extensions](#specificationExtensions).





#### <a name="todo"></a>TODO

TODO

##### Fixed Fields
Field Name | Type | Description
---|:---:|---
<a name="asymmetricEncryption-"></a>`type` | [string](#)| 
<a name="asymmetricEncryption-"></a>`description` | [string](#)| 



This object can be extended with [Specification Extensions](#specificationExtensions).





#### <a name="todo"></a>TODO

TODO








#### <a name="todo"></a>TODO

TODO

##### Fixed Fields
Field Name | Type | Description
---|:---:|---
<a name="NonBearerHTTPSecurityScheme-"></a>`scheme` | [string](#)| 
<a name="NonBearerHTTPSecurityScheme-"></a>`description` | [string](#)| 
<a name="NonBearerHTTPSecurityScheme-"></a>`type` | [string](#)| 



This object can be extended with [Specification Extensions](#specificationExtensions).





#### <a name="todo"></a>TODO

TODO

##### Fixed Fields
Field Name | Type | Description
---|:---:|---
<a name="BearerHTTPSecurityScheme-"></a>`scheme` | [string](#)| 
<a name="BearerHTTPSecurityScheme-"></a>`bearerFormat` | [string](#)| 
<a name="BearerHTTPSecurityScheme-"></a>`type` | [string](#)| 
<a name="BearerHTTPSecurityScheme-"></a>`description` | [string](#)| 



This object can be extended with [Specification Extensions](#specificationExtensions).





#### <a name="todo"></a>TODO

TODO

##### Fixed Fields
Field Name | Type | Description
---|:---:|---
<a name="APIKeyHTTPSecurityScheme-"></a>`type` | [string](#)| 
<a name="APIKeyHTTPSecurityScheme-"></a>`name` | [string](#)| 
<a name="APIKeyHTTPSecurityScheme-"></a>`in` | [string](#)| 
<a name="APIKeyHTTPSecurityScheme-"></a>`description` | [string](#)| 



This object can be extended with [Specification Extensions](#specificationExtensions).





#### <a name="todo"></a>TODO

TODO








#### <a name="todo"></a>TODO

TODO

##### Fixed Fields
Field Name | Type | Description
---|:---:|---
<a name="Reference-"></a>`$ref` | [string](#)| 








