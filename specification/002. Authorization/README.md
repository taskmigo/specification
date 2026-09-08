---
metadata:
  version: 0.5.0
  changelog: Defines typed Request and Object Authorization APIs with authorization-owned object schemas and predicates.
---

<!-- markdownlint-disable MD041 -->

## Table of contents

| Section | Title                                             | Purpose                                                                  | Document                                                                                         |
| ------- | ------------------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| 1       | Introduction                                      | Purpose, scope, terminology, references, and document control            | [01-introduction.md](01-introduction.md)                                                         |
| 2       | Overall Description                               | Product context, authorization lifecycle, object filtering, boundaries   | [02-overall-description.md](02-overall-description.md)                                           |
| 3       | External Interface Requirements                   | Statement, input, snapshot, object schema, and public APIs               | [03-external-interface-requirements.md](03-external-interface-requirements.md)                   |
| 4       | Functional and Behavioral Requirements            | Policy compilation, request decisions, and Object predicate behavior     | [04-functional-and-behavioral-requirements.md](04-functional-and-behavioral-requirements.md)     |
| 5       | Data and Information Requirements                 | Authorization state, object schema identity, and lifecycle               | [05-data-and-information-requirements.md](05-data-and-information-requirements.md)               |
| 6       | Quality and Performance Requirements              | Security, consistency, performance, and freshness                        | [06-quality-and-performance-requirements.md](06-quality-and-performance-requirements.md)         |
| 7       | Constraints                                       | Spring integration, policy isolation, patterns, and fail-closed behavior | [07-constraints.md](07-constraints.md)                                                           |
| 8       | Requirements Allocation and Dependencies          | Ownership across Authorization, Embedded Language, web, and resources    | [08-requirements-allocation-and-dependencies.md](08-requirements-allocation-and-dependencies.md) |
| 9       | Verification, Validation, and Acceptance Evidence | Verification objectives and conformance conditions                       | [09-verification-validation-and-acceptance.md](09-verification-validation-and-acceptance.md)     |
| 10      | Traceability and Unresolved Issues                | Requirement traceability and unresolved decisions                        | [10-traceability-and-unresolved-issues.md](10-traceability-and-unresolved-issues.md)             |
| 11      | Appendices                                        | Authorization examples                                                   | [11-appendices.md](11-appendices.md)                                                             |

## Read order

Read the documents in section-number order from 1 through 11. Use [Section 3](03-external-interface-requirements.md) for public interfaces, [Section 4](04-functional-and-behavioral-requirements.md) for authorization semantics, and [Section 9](09-verification-validation-and-acceptance.md) for verification evidence.
