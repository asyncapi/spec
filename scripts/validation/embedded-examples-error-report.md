# how did I locally resolved error in [Operation-Object.json](https://github.com/asyncapi/spec/blob/ced626f6f6abf80e128216793a1bdc656c36c059/scripts/validation/updated-docs/Operation-Object.json)?

## 1st change
change line 219 in the document itself from 

```json
"$ref": "/components/messages/userSignedUp"
```

to 
```json
"$ref": "#/components/messages/userSignedUp"
```

## 2nd change
and similar changes for line 231 in the document

from 


```json
"$ref": "/components/messages/userSignedUpReply"
```

```json
"$ref": "#/components/messages/userSignedUpReply"
```


## 3rd change

remove lines from 217 to 221 in the document

Then the file becomes valid in the AsyncAPI Studio

Try it [here](https://tinyurl.com/operation-object)

# how did I locally resolved error in [Message-Example-Object.json](https://github.com/asyncapi/spec/blob/ced626f6f6abf80e128216793a1bdc656c36c059/scripts/validation/updated-docs/Message-Example-Object.json)?

Added a placeholder of type array for the example at line 429 in the base doc

```json 
"examples":[]
```
applied it via this [commit](https://github.com/asyncapi/spec/pull/1059/commits/6f18cbc36767bbce74220947b9cd9fc570c21b62)

# how did I locally resolved error in [Operation-Traits-Object.json](https://github.com/asyncapi/spec/blob/ced626f6f6abf80e128216793a1bdc656c36c059/scripts/validation/updated-docs/Operation-Traits-Object.json)?

Added a placeholder of type array for the example at line 231 in the base doc

```json 
"traits":[]
```
applied it via this [commit](https://github.com/asyncapi/spec/pull/1059/commits/6f18cbc36767bbce74220947b9cd9fc570c21b62)

---

# Problems with [Security-Scheme-OAuth-Flow-Object.json](https://github.com/AnimeshKumar923/asyncapi-spec/blob/254354385f0cd28bd73eaaa86a9a91adc958b13f/scripts/validation/embed-logs/Security%20Scheme%20OAuth%20Flow%20Object-json-format.json)


```bash
Warning in Security Scheme OAuth Flow Object-json-format: "0" property must have required property "in"
Warning in Security Scheme OAuth Flow Object-json-format: "0" property must not be valid
Warning in Security Scheme OAuth Flow Object-json-format: "0" property must have required property "scheme"
Warning in Security Scheme OAuth Flow Object-json-format: "0" property must have required property "name"
Warning in Security Scheme OAuth Flow Object-json-format: "0" property must have required property "openIdConnectUrl"
Warning in Security Scheme OAuth Flow Object-json-format: Property "flows" is not expected to be here
Warning in Security Scheme OAuth Flow Object-json-format: "clientCredentials" property must not be valid
Warning in Security Scheme OAuth Flow Object-json-format: Property "scopes" is not expected to be here
Warning in Security Scheme OAuth Flow Object-json-format: Property "flows" is not expected to be here
Warning in Security Scheme OAuth Flow Object-json-format: "clientCredentials" property must not be valid
Warning in Security Scheme OAuth Flow Object-json-format: Property "scopes" is not expected to be here
Warning in Security Scheme OAuth Flow Object-json-format: "0" property must have required property "in"
Warning in Security Scheme OAuth Flow Object-json-format: "0" property must not be valid
Warning in Security Scheme OAuth Flow Object-json-format: "0" property must have required property "scheme"
Warning in Security Scheme OAuth Flow Object-json-format: "0" property must have required property "name"
Warning in Security Scheme OAuth Flow Object-json-format: "0" property must have required property "openIdConnectUrl"
Warning in Security Scheme OAuth Flow Object-json-format: "oauth" property must have required property "in"
Warning in Security Scheme OAuth Flow Object-json-format: "oauth" property must not be valid
Warning in Security Scheme OAuth Flow Object-json-format: "oauth" property must have required property "scheme"
Warning in Security Scheme OAuth Flow Object-json-format: "oauth" property must have required property "name"
Warning in Security Scheme OAuth Flow Object-json-format: "oauth" property must have required property "openIdConnectUrl"
Warning in Security Scheme OAuth Flow Object-json-format: Property "flows" is not expected to be here
Warning in Security Scheme OAuth Flow Object-json-format: "clientCredentials" property must not be valid
Warning in Security Scheme OAuth Flow Object-json-format: Property "scopes" is not expected to be here

```

## Solution for this error
For the resolution, what I found out from my observation is that if we remove this line:

```json
"authorizationUrl": "https://example.com/api/oauth/dialog",
```
from the examples in the spec, the files become valid.

and we remove the same line from the yaml file as well.

I tried removing this line from the invalid document in the Studio validator and the file became valid

Maybe I'm wrong and we need to modify something else? I don't know as of now...

---

# Problems in [Message-Object](https://github.com/AnimeshKumar923/asyncapi-spec/blob/3ffdb58ce45a7619037be7c77642eb62c33a10a4/scripts/validation/embed-logs/Message%20Object-json-format.json)

```bash
Warning in Message Object-json-format: ENOENT: no such file or directory, open 'path/to/user-create.avsc'
```

# Problems in [Components-Object](https://github.com/AnimeshKumar923/asyncapi-spec/blob/3ffdb58ce45a7619037be7c77642eb62c33a10a4/scripts/validation/embed-logs/Components%20Object-json-format.json)

```bash
Warning in Components Object-json-format: "AvroExample" property must match "then" schema
Warning in Components Object-json-format: "schema" property must match exactly one schema in oneOf
Warning in Components Object-json-format: ENOENT: no such file or directory, open 'path/to/user-create.avsc'
```

As far as I understand, it's referencing to some non-existent external example file.

I've tried this in the Studio validator:

- For the `Message Object`, if we remove [this portion](https://github.com/AnimeshKumar923/asyncapi-spec/blob/3ffdb58ce45a7619037be7c77642eb62c33a10a4/scripts/validation/embed-logs/Message%20Object-json-format.json#L479C75-L482C12), the file becomes valid.

- For the `Components Object`, if we remove [this portion](https://github.com/AnimeshKumar923/asyncapi-spec/blob/3ffdb58ce45a7619037be7c77642eb62c33a10a4/scripts/validation/embed-logs/Components%20Object-json-format.json#L263C12-L264C57), the file becomes valid.
