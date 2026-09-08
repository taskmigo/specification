---
metadata:
  version: 0.4.0
  changelog: Uses PROGRAM-mode policies, opaque authorization context, and Query Filtering predicates for database-side Object Authorization.
---

<!-- markdownlint-disable MD041 -->

## Table of contents

| Section | Title                                             | Purpose                                                                  | Document                                                                                         |
| ------- | ------------------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| 1       | Introduction                                      | Purpose, scope, terminology, references, and document control            | [01-introduction.md](01-introduction.md)                                                         |
| 2       | Overall Description                               | Product context, authorization lifecycle, query integration, boundaries  | [02-overall-description.md](02-overall-description.md)                                           |
| 3       | External Interface Requirements                   | Statement, input, snapshot, and public integration interfaces            | [03-external-interface-requirements.md](03-external-interface-requirements.md)                   |
| 4       | Functional and Behavioral Requirements            | Policy compilation, request decisions, and Object predicate behavior     | [04-functional-and-behavioral-requirements.md](04-functional-and-behavioral-requirements.md)     |
| 5       | Data and Information Requirements                 | Authorization data, integrity, privacy, and lifecycle                    | [05-data-and-information-requirements.md](05-data-and-information-requirements.md)               |
| 6       | Quality and Performance Requirements              | Security, consistency, performance, and applicable quality attributes    | [06-quality-and-performance-requirements.md](06-quality-and-performance-requirements.md)         |
| 7       | Constraints                                       | Spring integration, policy isolation, patterns, and fail-closed behavior | [07-constraints.md](07-constraints.md)                                                           |
| 8       | Requirements Allocation and Dependencies          | Ownership across Authorization, Query Filtering, Embedded Language, web  | [08-requirements-allocation-and-dependencies.md](08-requirements-allocation-and-dependencies.md) |
| 9       | Verification, Validation, and Acceptance Evidence | Verification objectives and conformance conditions                       | [09-verification-validation-and-acceptance.md](09-verification-validation-and-acceptance.md)     |
| 10      | Traceability and Unresolved Issues                | Requirement traceability and unresolved decisions                        | [10-traceability-and-unresolved-issues.md](10-traceability-and-unresolved-issues.md)             |
| 11      | Appendices                                        | Supporting authorization/query examples                                  | [11-appendices.md](11-appendices.md)                                                             |

## Read order

Read the documents in section-number order from 1 through 11. Use [Section 3](03-external-interface-requirements.md) for public interfaces, [Section 4](04-functional-and-behavioral-requirements.md) for authorization semantics, and [Section 9](09-verification-validation-and-acceptance.md) for verification evidence.
