# Kafka Bindings

This document defines how to describe Kafka-specific information on AsyncAPI.

<a name="version"></a>

## Version

Current version is `0.1.0`.


<a name="channel"></a>

## Channel Binding Object

This object MUST NOT contain any properties. Its name is reserved for future use.


<a name="operation"></a>

## Operation Binding Object

This object contains information about the operation representation in Kafka.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a name="operationBindingObjectGroupId"></a>`groupId` | [Schema Object](../asyncapi.md#schemaObject) | A [Schema Object](../asyncapi.md#schemaObject) containing the definition for the Kafka `group.id` property.
<a name="operationBindingObjectClientId"></a>`clientId` | [Schema Object](../asyncapi.md#schemaObject) | A [Schema Object](../asyncapi.md#schemaObject) containing the definition for the Kafka `client.id` property.
<a name="operationBindingObjectMeta"></a>`meta` | [Meta Object](#metaObject) | An object containing meta information about this binding object.

This object MUST contain only the properties defined above.

##### Example

```yaml
channels:
  user-signedup:
    publish:
      bindings:
        kafka:
          groupId:
            type: string
            enum: ['myGroupId']
          clientId:
            type: string
            enum: ['myClientId']
          meta:
            version: '0.1.0'
```


<a name="message"></a>

## Message Binding Object

This object contains information about the message representation in Kafka.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a name="messageBindingObjectKey"></a>`key` | [Schema Object](../asyncapi.md#schemaObject) | A [Schema Object](../asyncapi.md#schemaObject) containing the definition for the Kafka `key` property.
<a name="operationBindingObjectMeta"></a>`meta` | [Meta Object](#metaObject) | An object containing meta information about this binding object.

This object MUST contain only the properties defined above.


```yaml
channels:
  test:
    publish:
      message:
        bindings:
          kafka:
            key:
              type: string
              enum: ['myKey']
            meta:
              version: '0.1.0'
```

## Meta Object

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a name="metaObjectVersion"></a>`version` | String | **Required**. The version of this binding object. See [version](#version).

This object MUST contain only the properties defined above.
