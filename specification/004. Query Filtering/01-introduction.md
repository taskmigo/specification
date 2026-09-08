# 1. Introduction

## 1.1 Purpose

This Software Requirements Specification (SRS) defines Taskmigo's logical query-filtering contract between API-visible resource fields, Embedded Language expressions, authorization predicates, and persistence queries.

This document is tailored to the software-requirements information-item guidance in [ISO/IEC/IEEE 29148:2018](https://committee.iso.org/standard/72089.html). It does not claim full conformance to the standard.

## 1.2 Scope

The Query Filtering capability SHALL:

- Define query fields by API-visible response paths rather than database/JPA names.
- Support nested and composed API projections independent of persistence topology.
- Provide typed Query Schemas and opaque typed Query Predicates.
- Compile the HTTP `filterBy` expression through [Embedded Language](../003.%20Embedded%20Language/README.md) `EXPRESSION` mode.
- Compose client filters, Object Authorization predicates, and business predicates before pagination.
- Translate logical predicates through resource-owned persistence mappings.
- Support collection membership and bounded quantifier predicates when declared queryable by the schema/backend.
- Integrate with Spring MVC and Spring Data without exposing persistence entities to controllers.

The capability SHALL NOT expose arbitrary database columns, table names, JPA property names, or persistence expressions as user-authored query identifiers.

## 1.3 Definitions, Acronyms, and Abbreviations

| Term             | Definition                                                                                                   |
| ---------------- | ------------------------------------------------------------------------------------------------------------ |
| Query Contract   | Java type identifying one logical API query surface independently of persistence entity topology.            |
| Query Field      | Typed, explicitly queryable API-visible path with allowed logical operators.                                 |
| Query Path       | Ordered path segments relative to the query `object` root, such as `user.name`.                               |
| Query Predicate  | Opaque typed logical boolean predicate over one Query Contract.                                               |
| Query Schema     | Typed registry of the Query Fields available for one Query Contract.                                         |
| Persistence Map  | Resource-owned trusted translation from logical Query Paths/operators to persistence expressions or queries. |

## 1.4 References

- The [Embedded Language feature](../003.%20Embedded%20Language/README.md) defines `EXPRESSION` mode, Semantic AST, types, collection intrinsics, and Compilation Profiles.
- The [Authorization feature](../002.%20Authorization/README.md) produces Object Authorization predicates that compose with client filters.

## 1.5 Overview

Sections [2](02-overall-description.md)–[8](08-requirements-allocation-and-dependencies.md) define context, interfaces, behavior, data, quality, constraints, and ownership. [Section 9](09-verification-validation-and-acceptance.md) defines verification evidence.
