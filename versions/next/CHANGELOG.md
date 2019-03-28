# CHANGELOG

This document outlines what has changed in version 2.0.0 of the specification.

## Overview

* Unified `events`, `stream`, and `topics` into the `channels` object.
* Added a way to describe protocol-specific information, using the `protocolInfo` object.
* Added support for multiple message schemas.
* Added constraints to make sure an AsyncAPI document represents a single application.
* Added support for RAML-like traits in the Operation and Message objects.
* Added support for correlation IDS. Kudos to @SensibleWood.

## Changes

* Added top-level property `id`.
* Changed `topics` to `channels`.
* Changed `topics` (now `channels`) format to URI template.
* Removed `events` and `stream` in favor of `channels`.
* Moved top-level property `baseTopic` to the Server object as `baseChannel`.
* Added top-level property `defaultContentType`.
* Moved top-level property `security` to the Server object.
* Changed Server object `scheme` as `protocol`.
* Changed Server object `schemeVersion` as `protocolVersion`.
* Removed the restriction on supported protocols.
* Added `examples` property to the Server Variable object.
* Added support for correlation IDs. Kudos to @SensibleWood.
* Added support for RAML-like traits in the Operation and Message objects.
* Added `examples` property to the Schema object.
* Added `protocolInfo` property to the Channel, Operation, and Message objects.
* Added `message` property to the Operation object.
* Added `schemaFormat` property to the Message object.
* Added `contentType` property to the Message object.
* Added `title` property to the Message object.
* Added `name` property to the Message object.
* Changed the format of Message object `headers` to be a map of Schema objects.
* Changed the purpose of Message object `headers` to be only application-related headers.
* Removed constraints on Message object `payload` property. Its content can be anything now.
* Changed the `example` property in the Message object to `examples`.
* Fixed Server Variable object so it's not mandatory to provide at least one field. Kudos to @MikeRalphson.
* Changed the definitions section. Kudos to @jschabowsky.
* Changed `schema.json` from JSON Schema Draft 04 to Draft 07.
* Fixed specification extensions regular expression.