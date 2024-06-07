```yaml
asyncapi: 3.0.0
info:
  title: sample document
  version: 0.0.0
channels:
  example:
    messages:
      myMessage:
        payload:
          schemaFormat: 'application/vnd.apache.avro;version=1.9.0'
          schema:
            type: record
            name: User
            namespace: com.company
            doc: User information
            fields:
              - name: displayName
                type: string
              - name: age
                type: int
```