# 1. Introduction

## 1.1 Purpose

This Software Requirements Specification (SRS) defines Taskmigo client-side query filtering through API-visible field paths, Language expressions, typed logical predicates, and resource-owned persistence translation.

This document is tailored to the software-requirements information-item guidance in [ISO/IEC/IEEE 29148:2018](https://committee.iso.org/standard/72089.html). It does not claim full conformance to the standard.

## 1.2 Scope

The Query Filtering capability SHALL:

- Define queryable fields by API-visible response paths.
- Support nested and composed API projections independently of persistence topology.
- Provide typed Query Schemas and opaque typed Query Predicates.
- Compile HTTP `filterBy` source through [Language](../003.%20Language/README.md) `EXPRESSION` mode.
- Support scalar, membership, and bounded collection predicates when declared queryable.
- Translate logical predicates through resource-owned persistence mappings.
- Apply client filtering in the persistence query before pagination.
- Integrate with Spring MVC and Spring Data without exposing persistence entities to controllers.

The capability SHALL NOT expose arbitrary database columns, table names, JPA property names, or persistence expressions as client query identifiers.

## 1.3 Definitions, Acronyms, and Abbreviations

- **Filtered Query:** Request-scoped public value containing the Query Predicate compiled from `filterBy`.
- **Query Contract:** Java type identifying one logical API query surface independently of persistence entity topology.
- **Query Field:** Typed, explicitly queryable API-visible path with allowed logical operators.
- **Query Path:** Ordered path segments relative to the query `object` root, such as `user.name`.
- **Query Predicate:** Opaque typed logical Boolean predicate over one Query Contract.
- **Query Schema:** Typed registry of Query Fields available for one Query Contract.
- **Persistence Map:** Resource-owned trusted translation from Query Paths/operators to persistence expressions or repository queries.

## 1.4 References

- The [Language feature](../003.%20Language/README.md) defines `EXPRESSION` mode, Semantic AST, types, collection intrinsics, and Compilation Profiles.

## 1.5 Overview

Sections [2](02-overall-description.md)–[8](08-requirements-allocation-and-dependencies.md) define context, interfaces, behavior, data, quality, constraints, and ownership. [Section 9](09-verification-validation-and-acceptance.md) defines verification evidence.
