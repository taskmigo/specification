---
metadata:
  version: 0.7.0
  changelog: Makes Domain-Driven Design, Onion Architecture, and Hexagonal Architecture the normative model, with explicit port and adapter direction plus framework-neutral transaction boundaries.
---

<!-- markdownlint-disable MD041 -->

## Table of contents

| Section | Title                                             | Purpose                                                          | Document                                                                                         |
| ------- | ------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| 1       | Introduction                                      | Purpose, scope, terminology, and references                      | [01-introduction.md](01-introduction.md)                                                         |
| 2       | Overall Description                               | DDD, Onion, and Hexagonal context model and boundaries           | [02-overall-description.md](02-overall-description.md)                                           |
| 3       | External Interface Requirements                   | Published contracts and cross-context interfaces                 | [03-external-interface-requirements.md](03-external-interface-requirements.md)                   |
| 4       | Functional and Behavioral Requirements            | Domain ownership, ports, adapters, and dependency requirements   | [04-functional-and-behavioral-requirements.md](04-functional-and-behavioral-requirements.md)     |
| 5       | Data and Information Requirements                 | Context identity, aggregate ownership, and dependency metadata   | [05-data-and-information-requirements.md](05-data-and-information-requirements.md)               |
| 6       | Quality and Performance Requirements              | Maintainability, isolation, and dependency quality requirements  | [06-quality-and-performance-requirements.md](06-quality-and-performance-requirements.md)         |
| 7       | Constraints                                       | Mandatory DDD, Onion, Hexagonal, and boundary constraints        | [07-constraints.md](07-constraints.md)                                                           |
| 8       | Requirements Allocation and Dependencies          | Context map, port ownership, and dependency relationships        | [08-requirements-allocation-and-dependencies.md](08-requirements-allocation-and-dependencies.md) |
| 9       | Verification, Validation, and Acceptance Evidence | Architecture verification objectives and acceptance conditions   | [09-verification-validation-and-acceptance.md](09-verification-validation-and-acceptance.md)     |
| 10      | Traceability and Unresolved Issues                | Cross-specification traceability and unresolved decisions        | [10-traceability-and-unresolved-issues.md](10-traceability-and-unresolved-issues.md)             |
| 11      | Appendices                                        | Context map, dependency model, and package examples              | [11-appendices.md](11-appendices.md)                                                             |

## Read order

Read the documents in section-number order from 1 through 11. Use [Section 4](04-functional-and-behavioral-requirements.md) for normative ownership and DDD + Onion + Hexagonal requirements, [Section 7](07-constraints.md) for mandatory architectural constraints, and [Section 8](08-requirements-allocation-and-dependencies.md) for the normative context, port-ownership, and dependency model.
