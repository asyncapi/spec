# AsyncAPI Specification Project Index

A comprehensive index of the AsyncAPI Specification repository structure and contents.

**Project:** AsyncAPI Specification  
**Purpose:** Protocol-agnostic specification for describing message-driven APIs  
**Latest Version:** 3.0.0  
**License:** Apache License, Version 2.0

---

## Table of Contents

1. [Repository Structure](#repository-structure)
2. [Core Specification](#core-specification)
3. [Examples](#examples)
4. [Documentation & Contributing](#documentation--contributing)
5. [Scripts & Tools](#scripts--tools)
6. [Assets & Media](#assets--media)
7. [Configuration Files](#configuration-files)

---

## Repository Structure

```
spec/
├── spec/                          # Core specification directory
│   └── asyncapi.md               # Main specification document (2763 lines)
├── examples/                      # AsyncAPI examples
│   ├── social-media/             # Multi-service social media example
│   └── *.yml                      # Protocol-specific examples
├── scripts/                       # Automation and validation tools
│   ├── converter/                # Format conversion utilities
│   └── validation/               # Specification validation
├── assets/                        # Images, icons, and release resources
│   └── release_process/          # Release documentation
├── .github/                      # GitHub workflows and templates
├── README.md                     # Main project documentation
├── CONTRIBUTING.md               # Contributor guidelines
├── CODE_OF_CONDUCT.md            # Community standards
├── LICENSE                       # Apache 2.0 License
├── NOTICE                        # Attribution and notices
└── Configuration files           # CI/CD and tool config
```

---

## Core Specification

### Main Specification File
- **[spec/asyncapi.md](spec/asyncapi.md)** (2763 lines)
  - Complete AsyncAPI v3.0.0 specification
  - Protocol-agnostic message-driven API definitions
  - Covers: channels, operations, messages, servers, schemas, security, bindings
  - Source of truth for the specification

### Specification Versions
- **v3.0.0** (latest) - Current stable release
- **v2.6.0** through **v1.0.0** - Historical versions available on GitHub

---

## Examples

### Quick Start Examples
Basic examples demonstrating different use cases:

| Example | File | Purpose |
|---------|------|---------|
| Simple AsyncAPI | `simple-asyncapi.yml` | Basic AsyncAPI document structure |
| Kafka Request-Reply | `adeo-kafka-request-reply-asyncapi.yml` | Kafka-based RPC pattern |
| WebSocket RPC | `kraken-websocket-request-reply-*.yml` | WebSocket request-reply patterns |
| Slack RTM | `slack-rtm-asyncapi.yml` | Slack Real-Time Messaging integration |
| MQTT Streetlights | `streetlights-mqtt-asyncapi.yml` | MQTT publish-subscribe example |
| Kafka Streetlights | `streetlights-kafka-asyncapi.yml` | Kafka streaming example |
| Gitter Streaming | `gitter-streaming-asyncapi.yml` | Real-time streaming platform |
| Mercure | `mercure-asyncapi.yml` | Server-sent events protocol |
| WebSocket Gemini | `websocket-gemini-asyncapi.yml` | WebSocket real-time data feed |

### Advanced Examples
Pattern and schema examples:

| Example | File | Purpose |
|---------|------|---------|
| AnyOf Schema | `anyof-asyncapi.yml` | Schema composition with anyOf |
| OneOf Schema | `oneof-asyncapi.yml` | Schema composition with oneOf |
| Application Headers | `application-headers-asyncapi.yml` | Message headers definition |
| Correlation ID | `correlation-id-asyncapi.yml` | Message correlation patterns |
| Operation Security | `operation-security-asyncapi.yml` & `streetlights-operation-security-asyncapi.yml` | Security enforcement |
| Non-AsyncAPI | `not-asyncapi.yml` | Intentional invalid example |

### Social Media Example
**[examples/social-media/](examples/social-media/)** - Complete multi-service application:
- `readme.md` - Documentation
- `common/` - Shared assets
  - `messages.yaml` - Message definitions
  - `parameters.yaml` - Parameter definitions
  - `schemas.yaml` - Data schemas
  - `servers.yaml` - Server configurations
- `backend/` - Backend service AsyncAPI
- `frontend/` - Frontend service AsyncAPI
- `comments-service/` - Comments microservice AsyncAPI
- `notification-service/` - Notification microservice AsyncAPI
- `public-api/` - Public API service AsyncAPI

---

## Documentation & Contributing

### Documentation Files
- **[README.md](README.md)** - Main project overview, specification links, sponsor information
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Guidelines for contributing to the project
- **[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)** - Community standards and conduct rules
- **[RELEASE_PROCESS.md](RELEASE_PROCESS.md)** - Release procedures and versioning
- **[LICENSE](LICENSE)** - Apache License 2.0
- **[NOTICE](NOTICE)** - Attribution and legal notices
- **[CODEOWNERS](CODEOWNERS)** - File ownership assignments
- **[examples/README.md](examples/README.md)** - Examples documentation
- **[examples/social-media/readme.md](examples/social-media/readme.md)** - Social media example docs

---

## Scripts & Tools

### [scripts/converter/](scripts/converter/)
Format conversion utilities for AsyncAPI documents
- `index.js` - Main converter implementation
- `package.json` - NPM package configuration
- `README.md` - Converter documentation

### [scripts/validation/](scripts/validation/)
Validation tools for AsyncAPI specifications
- `embedded-examples-validation.js` - Validates embedded examples
- `base-doc-combined.json` - Base validation document
- `user-create.avsc` - Apache Avro schema example
- `package.json` - NPM package configuration

---

## Assets & Media

### [assets/](assets/)
- **asyncapi.xml** - XML asset file
- **[release_process/](assets/release_process/)** - Release documentation and diagrams

### Logos & Images
- `logo.png` (referenced in README)
- Sponsor images: Gravitee, Kong, Solace, IBM, Bump.sh, Svix, Aklivity, SmartBear, Route4Me, APIDeck, Mercedes-Benz

---

## Configuration Files

### Version Control & CI/CD
- **.git/** - Git repository data
- **.github/** - GitHub workflows and automation
- **.gitignore** - Git ignore patterns
- **.releaserc** - Semantic release configuration

### Linting & Code Quality
- **.markdownlint.yaml** - Markdown linting rules
- **.all-contributorsrc** - All Contributors bot configuration

---

## Key Concepts & Features

### Protocol Support
The AsyncAPI specification supports multiple protocols:
- AMQP (Advanced Message Queuing Protocol)
- MQTT (Message Queuing Telemetry Transport)
- WebSockets
- Apache Kafka
- STOMP (Streaming Text Oriented Messaging Protocol)
- HTTP
- Mercure
- And others via protocol bindings

### Specification Components
- **Applications** - Systems producing/consuming messages
- **Channels** - Topics or subjects for message exchange
- **Operations** - Actions applications perform (send/receive)
- **Messages** - Data structures exchanged
- **Servers** - Broker or endpoint locations
- **Schemas** - Message payload definitions
- **Bindings** - Protocol-specific configurations
- **Security Schemes** - Authentication and authorization

### Use Cases
- Real-time event streaming
- Message-driven microservices
- Request-reply patterns
- Pub-sub systems
- WebSocket APIs
- Kafka event streaming
- MQTT IoT applications

---

## Quick Links

- **Main Specification:** [spec/asyncapi.md](spec/asyncapi.md)
- **Contributing Guide:** [CONTRIBUTING.md](CONTRIBUTING.md)
- **AsyncAPI Website:** https://www.asyncapi.com
- **GitHub Repository:** https://github.com/asyncapi/spec
- **JSON Schemas:** https://github.com/asyncapi/spec-json-schemas
- **Case Studies:** https://www.asyncapi.com/casestudies

---

## Project Statistics

- **Total Examples:** 20+ AsyncAPI files
- **Specification Size:** 2,763 lines (main specification)
- **Supported Protocols:** 8+ (with extensibility)
- **Version History:** 10+ released versions
- **Community:** Multiple platinum, gold, silver, and bronze sponsors

---

*This index was generated for the AsyncAPI Specification project to provide quick navigation and understanding of the repository structure and contents.*

Last Updated: January 8, 2026
