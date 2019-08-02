# [WIP] AMQP Bindings

This document defines how to describe AMQP-specific information on AsyncAPI.

<a name="version"></a>

## Version

Current version is `0.1.0`.


<a name="channel"></a>

## Channel Binding Object

This object contains information about the channel representation in AMQP.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
WIP: Check example below

This object MUST contain only the properties defined above.

##### Example

```yaml
channels:
  user-signedup:
    bindings:
      amqp:
        type: routingKey # queue or routingKey, defaults to routingKey
        queue:
          name: my-queue-name # Max 255
          durable: true
          exclusive: true
          autoDelete: false
        exchange:
          name: myExchange # Max 255
          type: topic # topic, direct, fanout, default or headers
        meta:
          version: '0.1.0'
```


<a name="operation"></a>

## Operation Binding Object

This object contains information about the operation representation in AMQP.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a name="operationBindingObjectMeta"></a>`meta` | [Meta Object](#metaObject) | An object containing meta information about this binding object.

This object MUST contain only the properties defined above.

##### Example

```yaml
WIP
```


<a name="message"></a>

## Message Binding Object

This object contains information about the message representation in AMQP.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a name="operationBindingObjectMeta"></a>`meta` | [Meta Object](#metaObject) | An object containing meta information about this binding object.

This object MUST contain only the properties defined above.


```yaml
WIP
```

## Meta Object

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a name="metaObjectVersion"></a>`version` | String | **Required**. The version of this binding object. See [version](#version).

This object MUST contain only the properties defined above.
