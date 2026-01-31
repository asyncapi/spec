# Security Logic Examples

This document demonstrates the difference between OR logic (existing) and AND logic (new feature) in AsyncAPI 3.x security schemes.

## OR Logic (Single-Level Array) - Existing Behavior

When security is defined as a single-level array, **only ONE** of the security schemes needs to be satisfied:

```yaml
security:
  - $ref: '#/components/securitySchemes/oauth2'
  - $ref: '#/components/securitySchemes/apiKey'
  - $ref: '#/components/securitySchemes/basicAuth'
```

**Meaning**: OAuth2 **OR** API Key **OR** Basic Auth

## AND Logic (Array of Arrays) - New Feature

When security is defined as an array of arrays, the **outer array represents OR** while **inner arrays represent AND**:

```yaml
security:
  # Option 1: OAuth2 AND API Key (both required)
  - 
    - $ref: '#/components/securitySchemes/oauth2'
    - $ref: '#/components/securitySchemes/apiKey'
  # OR Option 2: Client Certificate alone
  - 
    - $ref: '#/components/securitySchemes/clientCertificate'
```

**Meaning**: (OAuth2 **AND** API Key) **OR** (Client Certificate)

## Real-World Use Cases

### Use Case 1: Defense in Depth

Require multiple authentication methods for sensitive operations:

```yaml
operations:
  deleteUserData:
    action: send
    channel:
      $ref: '#/channels/userDeletion'
    security:
      # Require BOTH OAuth2 token AND API key for deletion
      - 
        - $ref: '#/components/securitySchemes/oauth2'
        - $ref: '#/components/securitySchemes/apiKey'
```

### Use Case 2: Flexible Authentication with Fallback

Allow different authentication combinations:

```yaml
servers:
  production:
    host: api.example.com
    protocol: https
    security:
      # Option 1: Modern auth - OAuth2 AND HMAC signature
      - 
        - $ref: '#/components/securitySchemes/oauth2'
        - $ref: '#/components/securitySchemes/hmacSignature'
      # Option 2: Legacy auth - Basic auth AND API key
      - 
        - $ref: '#/components/securitySchemes/basicAuth'
        - $ref: '#/components/securitySchemes/apiKey'
      # Option 3: High-security - mTLS alone
      - 
        - $ref: '#/components/securitySchemes/clientCertificate'
```

**Meaning**: 
- (OAuth2 **AND** HMAC) 
- **OR** (Basic Auth **AND** API Key) 
- **OR** (mTLS)

### Use Case 3: Request Signing with Authentication

Common in financial APIs where you need both identity and integrity:

```yaml
operations:
  processPayment:
    action: send
    channel:
      $ref: '#/channels/payments'
    security:
      # Require OAuth2 for identity AND HMAC for request integrity
      - 
        - type: oauth2
          flows:
            clientCredentials:
              tokenUrl: https://auth.example.com/token
              scopes:
                'payments:write': Process payments
        - type: httpApiKey
          name: X-Signature
          in: header
          description: HMAC signature of request body
```

## Backward Compatibility

The new AND logic syntax is **fully backward compatible**:

- **Existing specs** using single-level arrays continue to work with OR logic
- **New specs** can use array of arrays for AND logic
- **Validators** should support both formats

### Migration Example

**Before (OR logic only)**:
```yaml
security:
  - $ref: '#/components/securitySchemes/oauth2'
  - $ref: '#/components/securitySchemes/apiKey'
```
Meaning: OAuth2 **OR** API Key

**After (AND logic support)** - Same behavior:
```yaml
security:
  - 
    - $ref: '#/components/securitySchemes/oauth2'
  - 
    - $ref: '#/components/securitySchemes/apiKey'
```
Meaning: OAuth2 **OR** API Key

**After (AND logic)** - New requirement:
```yaml
security:
  - 
    - $ref: '#/components/securitySchemes/oauth2'
    - $ref: '#/components/securitySchemes/apiKey'
```
Meaning: OAuth2 **AND** API Key

## Validation Rules

Tools implementing this feature should enforce:

1. **Outer array**: Represents OR logic between security options
2. **Inner array**: Represents AND logic within each option
3. **All schemes in an inner array** MUST be satisfied simultaneously
4. **At least one inner array** MUST be fully satisfied for authorization
5. **Single-level arrays** continue to use OR logic for backward compatibility

## Complete Example

See [security-and-logic-asyncapi.yml](./security-and-logic-asyncapi.yml) for a complete working example.
