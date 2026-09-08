---
metadata:
  version: 0.2.0
  changelog: Defines standalone filterBy contracts over API-visible query paths with nested and collection filtering.
---

<!-- markdownlint-disable MD041 -->

## Table of contents

| Section | Title                                             | Purpose                                                             | Document                                                                                         |
| ------- | ------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| 1       | Introduction                                      | Purpose, scope, terminology, and references                         | [01-introduction.md](01-introduction.md)                                                         |
| 2       | Overall Description                               | Query model, consumers, scenarios, and boundaries                   | [02-overall-description.md](02-overall-description.md)                                           |
| 3       | External Interface Requirements                   | Query schema, predicate, filterBy, Spring MVC, and persistence APIs | [03-external-interface-requirements.md](03-external-interface-requirements.md)                   |
| 4       | Functional and Behavioral Requirements            | Compilation, mapping, collection, and execution behavior            | [04-functional-and-behavioral-requirements.md](04-functional-and-behavioral-requirements.md)     |
| 5       | Data and Information Requirements                 | Query paths, schemas, predicate identity, and lifecycle             | [05-data-and-information-requirements.md](05-data-and-information-requirements.md)               |
| 6       | Quality and Performance Requirements              | Determinism, isolation, caching, and database execution             | [06-quality-and-performance-requirements.md](06-quality-and-performance-requirements.md)         |
| 7       | Constraints                                       | Spring integration, persistence, isolation, and failure behavior    | [07-constraints.md](07-constraints.md)                                                           |
| 8       | Requirements Allocation and Dependencies          | Ownership across Query Filtering, Embedded Language, web, resources | [08-requirements-allocation-and-dependencies.md](08-requirements-allocation-and-dependencies.md) |
| 9       | Verification, Validation, and Acceptance Evidence | Verification objectives and acceptance conditions                   | [09-verification-validation-and-acceptance.md](09-verification-validation-and-acceptance.md)     |
| 10      | Traceability and Unresolved Issues                | Requirement traceability and unresolved decisions                   | [10-traceability-and-unresolved-issues.md](10-traceability-and-unresolved-issues.md)             |
| 11      | Appendices                                        | Query examples                                                      | [11-appendices.md](11-appendices.md)                                                             |

## Read order

Read the documents in section-number order from 1 through 11. Use [Section 3](03-external-interface-requirements.md) for public interfaces, [Section 4](04-functional-and-behavioral-requirements.md) for query semantics, and [Section 9](09-verification-validation-and-acceptance.md) for verification evidence.
