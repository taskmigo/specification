# 1. Introduction

## 1.1 Purpose

This Software Requirements Specification (SRS) defines the authorization model for ECMAScript authorization policies and shared query filtering. It specifies the policy contract, authorization decisions, effective-state resolution, database filtering, security boundaries, and verification conditions.

This document is tailored to the software-requirements information-item guidance in [ISO/IEC/IEEE 29148:2018](https://committee.iso.org/standard/72089.html). The tailoring covers the software boundary, operational context, interfaces, functional and quality requirements, data/persistence constraints, verification, and traceability relevant to this authorization capability. It does not claim full conformance to the standard.

## 1.2 Scope

The authorization model SHALL use a required ECMAScript policy entry point while preserving these product semantics:

- Request Authorization is default-deny and DENY overrides ALLOW.
- Object Authorization is applied in the database query before pagination.
- User, Group, Role, and Statement inheritance/assignment semantics are preserved.
- Every authorization operation resolves its relevant effective Statements from the database; Statement state is not cached across requests.
- One authorization operation uses one immutable authorization snapshot from start to finish.
- Request Authorization uses only the `principal` and `request` values available at authorization time; it does not load business resources.
- Object policies compile to a persistence-neutral Filter AST that can also be reused by future query filtering.

Package/module ownership and public SDK boundaries are governed by [issue #54](https://github.com/taskmigo/specification/issues/54) and are not redefined here.

The following capabilities are outside the scope of this SRS:

- an external `filterBy` grammar;
- nested/relationship Object filtering;
- additional authorization target kinds beyond `target.api`;
- policy features, target kinds, and query capabilities not explicitly specified here.

## 1.3 Definitions, Acronyms, and Abbreviations

| Term                   | Definition                                                                                              |
| ---------------------- | ------------------------------------------------------------------------------------------------------- |
| Authorization Snapshot | Immutable authorization state used for one request or authorization operation.                          |
| Filter AST             | Persistence-neutral boolean predicate representation used for Object Authorization and query filtering. |
| Policy IR              | Taskmigo-owned intermediate representation produced from supported ECMAScript policy syntax.            |
| Request Authorization  | Authorization based only on the available request, principal, and applicable Request Statements.        |
| Object Authorization   | Database-side visibility filtering based on symbolic object fields and applicable Object Statements.    |
| Statement              | Named authorization rule with an effect, scope, API target, and policy.                                 |

## 1.4 References and baseline

- The linked standard's software-requirements information-item guidance. This document uses the guidance as a tailored framework; it does not reproduce or claim certification against the standard.
- The linked issue, module ownership and public SDK boundaries. This is a related product decision and remains outside the scope of this SRS.
- Baseline: the Taskmigo server `next` source review recorded in the preceding authorization specification, used only to identify the legacy authorization behavior that the requirements replace or preserve. The source repository and exact baseline commit are not included here, so this document does not claim a fresh runtime verification.

## 1.5 Overview

Sections 2–8 describe the product context, interfaces, behavior, data, quality attributes, constraints, dependencies, and allocation. Section 9 defines verification and acceptance evidence; Section 10 defines traceability and unresolved issues; Section 11 records appendices and deferred extensions.
