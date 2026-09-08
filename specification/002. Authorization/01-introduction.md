# 1. Introduction

## 1.1 Purpose

This Software Requirements Specification (SRS) defines Statement-based Request and Object Authorization using Embedded Language policies and the shared logical predicate contract defined by Query Filtering.

This document is tailored to the software-requirements information-item guidance in [ISO/IEC/IEEE 29148:2018](https://committee.iso.org/standard/72089.html). It does not claim full conformance to the standard.

## 1.2 Scope

The authorization model SHALL:

- Preserve default-deny Request Authorization with DENY overriding ALLOW.
- Resolve relevant effective Statements from the database for every authorization operation.
- Use one immutable operation-scoped authorization snapshot for Request and Object Authorization.
- Compile Statement policies with [Embedded Language](../003.%20Embedded%20Language/README.md) `PROGRAM` mode.
- Evaluate Request policies using concrete `principal` and `request` values only.
- Partially evaluate Object policies with symbolic `object` values.
- Use the [Query Filtering feature](../004.%20Query%20Filtering/README.md) Query Schema and Query Predicate contracts for Object Authorization queryability and database-side filtering.
- Apply Object Authorization before pagination without unrestricted JVM row filtering.
- Expose an opaque authorization context to integration consumers rather than internal snapshots or Semantic AST.

Package/module ownership and public SDK boundaries are governed by [issue #54](https://github.com/taskmigo/specification/issues/54) and are not redefined here.

Additional authorization target kinds beyond `target.api` remain outside this SRS.

## 1.3 Definitions, Acronyms, and Abbreviations

- **Authorization Context:** Opaque operation-scoped public handle carrying the authorization state required by subsequent operations.
- **Authorization Snapshot:** Internal immutable authorization state materialized once for one operation.
- **Object Predicate:** Typed logical `QueryPredicate<Q>` produced from Object Authorization policy semantics.
- **Query Contract:** Logical API query surface defined by Query Filtering and identified by generic type `Q`.
- **Query Schema:** Query Filtering schema defining API-visible paths, types, nullability, and allowed operators.
- **Request Authorization:** Authorization based only on available principal/request inputs and applicable Request Statements.
- **Object Authorization:** Database-side visibility filtering derived from symbolic object policies and a Query Schema.
- **Statement:** Named authorization rule with effect, scope, API target, and policy.

## 1.4 References and Baseline

- The [Embedded Language feature](../003.%20Embedded%20Language/README.md) defines language syntax, Semantic AST, typing, profiles, evaluation, and partial evaluation.
- The [Query Filtering feature](../004.%20Query%20Filtering/README.md) defines Query Schema, Query Predicate, API-visible query paths, predicate composition, and persistence integration.
- The linked issue defines module ownership and public SDK boundaries outside this SRS.

## 1.5 Overview

Sections [2](02-overall-description.md)–[8](08-requirements-allocation-and-dependencies.md) define authorization context, interfaces, behavior, data, quality, constraints, and dependencies. [Section 9](09-verification-validation-and-acceptance.md) defines verification evidence.
