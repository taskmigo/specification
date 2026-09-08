# 1. Introduction

## 1.1 Purpose

This Software Requirements Specification (SRS) defines Statement-based Request and Object Authorization using Embedded Language policies, operation-scoped authorization state, authorization-owned object schemas, and database-side Object predicates.

This document is tailored to the software-requirements information-item guidance in [ISO/IEC/IEEE 29148:2018](https://committee.iso.org/standard/72089.html). It does not claim full conformance to the standard.

## 1.2 Scope

The authorization model SHALL:

- Preserve default-deny Request Authorization with DENY overriding ALLOW.
- Resolve relevant effective Statements from the database for every authorization operation.
- Use one immutable operation-scoped authorization state for Request and Object Authorization.
- Compile Statement policies with [Embedded Language](../003.%20Embedded%20Language/README.md) `PROGRAM` mode.
- Evaluate Request policies using concrete `principal` and `request` values only.
- Partially evaluate Object policies with symbolic `object` values.
- Define Object Authorization Schemas over API-visible object paths, including declared nested and collection paths.
- Produce opaque Object Authorization Predicates for resource-owned persistence translation.
- Apply Object Authorization before pagination without unrestricted JVM row filtering.
- Expose an opaque Authorization Context rather than internal snapshots or Semantic AST.

Package/module ownership and public SDK boundaries are governed by [issue #54](https://github.com/taskmigo/specification/issues/54) and are not redefined here.

Additional authorization target kinds beyond `target.api` remain outside this SRS.

## 1.3 Definitions, Acronyms, and Abbreviations

- **Authorization Context:** Opaque operation-scoped public handle carrying authorization state required by subsequent Object Authorization.
- **Authorization Snapshot:** Internal immutable authorization state materialized once for one operation.
- **Object Authorization Field:** Typed API-visible object path with operators accepted for Object Authorization persistence translation.
- **Object Authorization Predicate:** Opaque typed Boolean predicate produced by Object Authorization.
- **Object Authorization Schema:** Typed set of API-visible object fields available to Object policies for one resource query surface.
- **Request Authorization:** Authorization based only on available principal/request inputs and applicable Request Statements.
- **Object Authorization:** Database-side visibility filtering derived from symbolic object policies and an Object Authorization Schema.
- **Statement:** Named authorization rule with effect, scope, API target, and policy.

## 1.4 References

- The [Embedded Language feature](../003.%20Embedded%20Language/README.md) defines language syntax, Semantic AST, typing, Compilation Profiles, evaluation, partial evaluation, and bounded collection intrinsics.
- The linked issue defines package/module ownership and public SDK boundaries outside this SRS.

## 1.5 Overview

Sections [2](02-overall-description.md)–[8](08-requirements-allocation-and-dependencies.md) define authorization context, interfaces, behavior, data, quality, constraints, and dependencies. [Section 9](09-verification-validation-and-acceptance.md) defines verification evidence.
