# JSON Reference and non-JSON Linking (draft-asyncapi-ref-linking-01)

## Abstract

JSON Reference and non-JSON Linking allows to reference JSON and linking to non-JSON values.

## Status of this Memo
This Internet-Draft is submitted in full conformance with the provisions of [BCP 78](https://datatracker.ietf.org/doc/html/bcp78) and [BCP 79](https://datatracker.ietf.org/doc/html/bcp79).

Internet-Drafts are working documents of the Internet Engineering Task Force (IETF).  Note that other groups may also distribute working documents as Internet-Drafts.  The list of current Internet Drafts is at http://datatracker.ietf.org/drafts/current/.

Internet-Drafts are draft documents valid for a maximum of six months and may be updated, replaced, or obsoleted by other documents at any time.  It is inappropriate to use Internet-Drafts as reference material or to cite them other than as "work in progress."

This Internet-Draft will expire on xxx, 2022.

## Copyright Notice

Copyright (c) 2022 IETF Trust and the persons identified as the document authors.  All rights reserved.

This document is subject to [BCP 78](https://datatracker.ietf.org/doc/html/bcp78) and the IETF Trust's Legal Provisions Relating to IETF Documents (http://trustee.ietf.org/license-info) in effect on the date of publication of this document.  Please review these documents carefully, as they describe your rights and restrictions with respect
to this document.  Code Components extracted from this document must include Simplified BSD License text as described in Section 4.e of the Trust Legal Provisions and are provided without warranty as described in the Simplified BSD License.

## Table of Contents
<!-- TOC depthFrom:2 depthTo:4 withLinks:1 updateOnSave:0 orderedList:0 -->

<!-- /TOC -->

## Introduction

This specification defines a way to reference both JSON and non-JSON data in a JSON document. 

## Conventions
The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [[RFC2119](https://datatracker.ietf.org/doc/html/rfc2119)].

## Syntax
A JSON Reference is a JSON object, which contains a member named "$ref", which has a JSON string value. Any members other than "$ref" in a JSON Reference object SHALL be ignored. 

### Referencing
Referencing, is when the referenced resource is a JSON value.

```json
{
    "$ref": "http://example.com/example.json#/foo/bar"
}
```

The "$ref" string value contains a URI [[RFC3986](https://datatracker.ietf.org/doc/html/rfc3986)], which identifies the location of the JSON value being referenced. It is an error condition if the string value does not conform to URI syntax rules.

Resolution of a JSON Reference object SHOULD yield the referenced JSON value. Implementations MAY choose to replace the reference with the referenced value.

### Linking
Linking, is when the linked resource is a non-JSON value.

```json
{
    "$ref": "http://example.com/example.proto"
}
```
Resolution of a linked resource SHOULD yield the content of the resource in string format. Implementations MAY choose to replace the `$ref` with `content`.

### Reference-linking format
The application MUST extended the usage of ref-linking with a keyword that can determine the resource type. This is for implementations to handle the resource accurately. For example this could be `referenceFormat`, `format`, etc. Example:

```json
{
    "referenceFormat": "application/vnd.;version=3.0.0",
    "schema": {
        "$ref": "example.proto"
    }
}
```

### Resolution
If the URI contained in the JSON Reference value is a relative URI, then the base URI resolution MUST be calculated according to [[RFC3986](https://datatracker.ietf.org/doc/html/rfc3986#section-5.2)], [section 5.2](https://datatracker.ietf.org/doc/html/rfc3986#section-5.2).  Resolution is performed relative to the referring document.

If a URI contains a fragment identifier, then the fragment should be resolved per the fragment resolution mechansim of the referrant document.  If the representation of the referrant document is JSON, then the fragment identifier SHOULD be interpreted as a [[JSON-Pointer](https://datatracker.ietf.org/doc/html/draft-pbryan-zyp-json-ref-03#ref-JSON-Pointer)]. 

If it's non-JSON, then fragment MUST be ignored as there are no accurate way to fragment into non-JSON data.

For references, any subsequent `$ref` encounters, are NOT to be interpreted as reference-linking, but MUST be interpreted and determined by the reference-linking format.

### Examples

#### External refering with fragment
**Unresolved**
```json
{
    "$ref": "http://example.com/example.json#/foo/bar"
}
```

**JSON file (http://example.com/example.json)**
```
{
    "foo": {
        "bar": "foo"
    }
}
```

**Resolved**
```json
"foo"
```

#### External linking to Protobuf

**Unresolved**
```json
{
    "$ref": "http://mydomain.com/myfile.proto"
}
```

**Protobuf file (http://mydomain.com/myfile.proto)**

```proto
package my.org;

enum MyEnum {
  UNKNOWN = 0;
  STARTED = 1;
  RUNNING = 2;
}

message Outer {
  message Inner {
      int test = 1;
  }
  MyEnum enum_field = 9;
}
```

**Resolved**
```json
{
    "$ref": "http://mydomain.com/myfile.proto",
    "content": "package my.org;

enum MyEnum {
  UNKNOWN = 0;
  STARTED = 1;
  RUNNING = 2;
}

message Outer {
  message Inner {
      int test = 1;
  }
  MyEnum enum_field = 9;
}"
}
```


#### External linking to XSD/XML

**Unresolved**
```json
{
    "$ref": "http://mydomain.com/myfile.xsd"
}
```

**XSD file (http://mydomain.com/myfile.xsd)**

```xml
<xsd:schema xmlns:xsd="http://www.w3.org/2001/XMLSchema"
           xmlns:tns="http://tempuri.org/PurchaseOrderSchema.xsd"
           targetNamespace="http://tempuri.org/PurchaseOrderSchema.xsd"
           elementFormDefault="qualified">
 <xsd:element name="PurchaseOrder" type="tns:PurchaseOrderType"/>
 <xsd:complexType name="PurchaseOrderType">
  <xsd:sequence>
   <xsd:element name="ShipTo" type="tns:USAddress" maxOccurs="2"/>
   <xsd:element name="BillTo" type="tns:USAddress"/>
  </xsd:sequence>
  <xsd:attribute name="OrderDate" type="xsd:date"/>
 </xsd:complexType>

 <xsd:complexType name="USAddress">
  <xsd:sequence>
   <xsd:element name="name"   type="xsd:string"/>
   <xsd:element name="street" type="xsd:string"/>
   <xsd:element name="city"   type="xsd:string"/>
   <xsd:element name="state"  type="xsd:string"/>
   <xsd:element name="zip"    type="xsd:integer"/>
  </xsd:sequence>
  <xsd:attribute name="country" type="xsd:NMTOKEN" fixed="US"/>
 </xsd:complexType>
</xsd:schema>
```

**Resolved**
```json
{
    "$ref": "http://mydomain.com/myfile.xsd",
    "content": '<xsd:schema xmlns:xsd="http://www.w3.org/2001/XMLSchema"
           xmlns:tns="http://tempuri.org/PurchaseOrderSchema.xsd"
           targetNamespace="http://tempuri.org/PurchaseOrderSchema.xsd"
           elementFormDefault="qualified">
 <xsd:element name="PurchaseOrder" type="tns:PurchaseOrderType"/>
 <xsd:complexType name="PurchaseOrderType">
  <xsd:sequence>
   <xsd:element name="ShipTo" type="tns:USAddress" maxOccurs="2"/>
   <xsd:element name="BillTo" type="tns:USAddress"/>
  </xsd:sequence>
  <xsd:attribute name="OrderDate" type="xsd:date"/>
 </xsd:complexType>

 <xsd:complexType name="USAddress">
  <xsd:sequence>
   <xsd:element name="name"   type="xsd:string"/>
   <xsd:element name="street" type="xsd:string"/>
   <xsd:element name="city"   type="xsd:string"/>
   <xsd:element name="state"  type="xsd:string"/>
   <xsd:element name="zip"    type="xsd:integer"/>
  </xsd:sequence>
  <xsd:attribute name="country" type="xsd:NMTOKEN" fixed="US"/>
 </xsd:complexType>
</xsd:schema>'
}
```