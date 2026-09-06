# 1. Introduction

## 1.1 Purpose

This Software Requirements Specification (SRS) defines the authorization model for Policy Language policies and shared query filtering. It specifies the Statement contract, authorization decisions, effective-state resolution, database filtering, security boundaries, and verification conditions.

This document is tailored to the software-requirements information-item guidance in [ISO/IEC/IEEE 29148:2018](https://committee.iso.org/standard/72089.html). The tailoring covers the software boundary, operational context, interfaces, functional and quality requirements, data/persistence constraints, verification, and traceability relevant to this authorization capability. It does not claim full conformance to the standard.

## 1.2 Scope

The authorization model SHALL use policies defined by the [Policy Language feature](../003.%20Policy%20Language/README.md) while preserving these product semantics:

- Request Authorization is default-deny and DENY overrides ALLOW.
- Object Authorization is applied in the database query before pagination.
- Every authorization operation resolves its relevant effective Statements from the database; Statement state is not cached across requests.
- One authorization operation uses one immutable authorization snapshot from start to finish.
- Request Authorization uses only the `principal` and `request` values available at authorization time; it does not load business resources.
- Object policies compile to typed Policy IR, are partially evaluated with symbolic `object`, and lower residual predicates to the persistence-neutral Filter AST.

Package/module ownership and public SDK boundaries are governed by [issue #54](https://github.com/taskmigo/specification/issues/54) and are not redefined here.

The following capabilities are outside the scope of this SRS:

- An external `filterBy` grammar.
- Nested/relationship Object filtering.
- Additional authorization target kinds beyond `target.api`.
- Policy-language features not specified by the [Policy Language feature](../003.%20Policy%20Language/README.md).
- Target kinds and query capabilities not explicitly specified here.

## 1.3 Definitions, Acronyms, and Abbreviations

| Term                   | Definition                                                                                              |
| ---------------------- | ------------------------------------------------------------------------------------------------------- |
| Authorization Snapshot | Immutable authorization state used for one request or authorization operation.                          |
| Filter AST             | Persistence-neutral boolean predicate representation used for Object Authorization and query filtering. |
| Policy IR              | Typed intermediate representation defined by the Policy Language feature.                               |
| Request Authorization  | Authorization based only on the available request, principal, and applicable Request Statements.        |
| Object Authorization   | Database-side visibility filtering based on symbolic object fields and applicable Object Statements.    |
| Statement              | Named authorization rule with an effect, scope, API target, and policy.                                 |

## 1.4 References and Baseline

- The linked standard's software-requirements information-item guidance is used as a tailored framework.
- The [Policy Language feature](../003.%20Policy%20Language/README.md) defines the policy source language, type system, evaluation, partial evaluation, and queryability contracts consumed by Authorization.
- The linked issue defines module ownership and public SDK boundaries outside the scope of this SRS.
- Baseline: The server `next` source review recorded in the preceding authorization specification, used only to identify legacy authorization behavior that the requirements replace or preserve. The source repository and exact baseline commit are not included here, so this document does not claim a fresh runtime verification.

## 1.5 Overview

Sections [2](02-overall-description.md)–[8](08-requirements-allocation-and-dependencies.md) define the authorization context, interfaces, behavior, data, quality attributes, constraints, and dependencies. [Section 9](09-verification-validation-and-acceptance.md) defines verification and acceptance evidence; [Section 10](10-traceability-and-unresolved-issues.md) defines traceability and unresolved issues; [Section 11](11-appendices.md) provides supporting examples and extension guidance.
