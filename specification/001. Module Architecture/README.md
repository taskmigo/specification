---
metadata:
  version: 0.6.0
  changelog: Adopts Domain-Driven Design as the normative architecture model, defines bounded-context ownership and tactical layering, and consolidates Role ownership into Access Control.
---

<!-- markdownlint-disable MD041 -->

## Table of contents

| Section | Title                                             | Purpose                                                          | Document                                                                                         |
| ------- | ------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| 1       | Introduction                                      | Purpose, scope, terminology, and references                      | [01-introduction.md](01-introduction.md)                                                         |
| 2       | Overall Description                               | DDD context model, module mapping, and boundaries                | [02-overall-description.md](02-overall-description.md)                                           |
| 3       | External Interface Requirements                   | Published contracts and cross-context interfaces                 | [03-external-interface-requirements.md](03-external-interface-requirements.md)                   |
| 4       | Functional and Behavioral Requirements            | Domain ownership, tactical layers, and dependency requirements   | [04-functional-and-behavioral-requirements.md](04-functional-and-behavioral-requirements.md)     |
| 5       | Data and Information Requirements                 | Context identity, aggregate ownership, and dependency metadata   | [05-data-and-information-requirements.md](05-data-and-information-requirements.md)               |
| 6       | Quality and Performance Requirements              | Maintainability, isolation, and dependency quality requirements  | [06-quality-and-performance-requirements.md](06-quality-and-performance-requirements.md)         |
| 7       | Constraints                                       | Mandatory DDD, dependency, persistence, and boundary constraints | [07-constraints.md](07-constraints.md)                                                           |
| 8       | Requirements Allocation and Dependencies          | Context map, ownership, and allowed dependency relationships     | [08-requirements-allocation-and-dependencies.md](08-requirements-allocation-and-dependencies.md) |
| 9       | Verification, Validation, and Acceptance Evidence | Architecture verification objectives and acceptance conditions   | [09-verification-validation-and-acceptance.md](09-verification-validation-and-acceptance.md)     |
| 10      | Traceability and Unresolved Issues                | Cross-specification traceability and unresolved decisions        | [10-traceability-and-unresolved-issues.md](10-traceability-and-unresolved-issues.md)             |
| 11      | Appendices                                        | Context map, dependency model, and package examples              | [11-appendices.md](11-appendices.md)                                                             |

## Read order

Read the documents in section-number order from 1 through 11. Use [Section 4](04-functional-and-behavioral-requirements.md) for normative ownership and tactical DDD requirements, [Section 7](07-constraints.md) for mandatory architectural constraints, and [Section 8](08-requirements-allocation-and-dependencies.md) for the normative context and dependency model.
