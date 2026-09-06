---
name: Authorization feature
version: 0.3.0
---

<!-- markdownlint-disable MD041 -->

## Table of contents

| Section | Title                                             | Purpose                                                               | Document                                                                                         |
| ------- | ------------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| 1       | Introduction                                      | Purpose, scope, terminology, references, and document control         | [01-introduction.md](01-introduction.md)                                                         |
| 2       | Overall Description                               | Product context, stakeholders, users, scenarios, and boundaries       | [02-overall-description.md](02-overall-description.md)                                           |
| 3       | External Interface Requirements                   | Statement, input, and snapshot interfaces                             | [03-external-interface-requirements.md](03-external-interface-requirements.md)                   |
| 4       | Functional and Behavioral Requirements            | Policy compilation, request authorization, and object authorization   | [04-functional-and-behavioral-requirements.md](04-functional-and-behavioral-requirements.md)     |
| 5       | Data and Information Requirements                 | Authorization data, integrity, privacy, and lifecycle                 | [05-data-and-information-requirements.md](05-data-and-information-requirements.md)               |
| 6       | Quality and Performance Requirements              | Security, consistency, performance, and applicable quality attributes | [06-quality-and-performance-requirements.md](06-quality-and-performance-requirements.md)         |
| 7       | Constraints                                       | Design patterns, policy isolation, and fail-closed constraints        | [07-constraints.md](07-constraints.md)                                                           |
| 8       | Requirements Allocation and Dependencies          | Assumptions, dependencies, allocation, and derivation boundaries      | [08-requirements-allocation-and-dependencies.md](08-requirements-allocation-and-dependencies.md) |
| 9       | Verification, Validation, and Acceptance Evidence | Verification objectives and conformance conditions                    | [09-verification-validation-and-acceptance.md](09-verification-validation-and-acceptance.md)     |
| 10      | Traceability and Unresolved Issues                | Requirement traceability and unresolved decisions                     | [10-traceability-and-unresolved-issues.md](10-traceability-and-unresolved-issues.md)             |
| 11      | Appendices                                        | Deferred extensions and supporting material                           | [11-appendices.md](11-appendices.md)                                                             |

## Read order

Read the documents in section-number order from 1 through 11. Use the section links above for focused retrieval; use Section 9 for verification evidence and Section 10 for traceability or unresolved issues.

## History

| Version | Short summary of changes                                                                                                                                                                                                   |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0.3.0   | <ul><li>Replaced the restricted ECMAScript policy source contract with Taskmigo Policy Language.</li><li>Delegated language typing, evaluation, partial evaluation, and queryability semantics to the Policy Language SRS.</li></ul> |
| 0.2.0   | <ul><li>Restricted Request Authorization to principal/request inputs.</li><li>Removed request-time business-resource loading.</li></ul>                                                                                   |
| 0.1.0   | <ul><li>Defined the initial policy authorization model, shared query filtering, operation snapshots, and verification boundaries.</li></ul>                                                                               |
