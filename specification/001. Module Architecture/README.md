---
metadata:
  version: 0.8.1
  changelog: Clarifies module-owned interfaces, independent-consumer acceptance and source-to-spec traceability against the pinned backend baseline.
---

<!-- markdownlint-disable MD041 -->

## Table of contents

| Section | Title                                    | Purpose                                       | Document                                                                                         |
| ------- | ---------------------------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| 1       | Introduction                             | Scope, terminology and source baseline        | [01-introduction.md](01-introduction.md)                                                         |
| 2       | Overall Description                      | Business contexts and tactical model          | [02-overall-description.md](02-overall-description.md)                                           |
| 3       | External Interface Requirements          | Published interfaces and adaptation           | [03-external-interface-requirements.md](03-external-interface-requirements.md)                   |
| 4       | Functional and Behavioral Requirements   | Architecture behavior and ownership           | [04-functional-and-behavioral-requirements.md](04-functional-and-behavioral-requirements.md)     |
| 5       | Data and Information Requirements        | Project identities and metadata               | [05-data-and-information-requirements.md](05-data-and-information-requirements.md)               |
| 6       | Quality and Performance Requirements     | Isolation and testability                     | [06-quality-and-performance-requirements.md](06-quality-and-performance-requirements.md)         |
| 7       | Constraints                              | Prohibited dependencies and transaction rules | [07-constraints.md](07-constraints.md)                                                           |
| 8       | Requirements Allocation and Dependencies | Project graph and runtime composition         | [08-requirements-allocation-and-dependencies.md](08-requirements-allocation-and-dependencies.md) |
| 9       | Verification, Validation, and Acceptance | Architecture test objectives                  | [09-verification-validation-and-acceptance.md](09-verification-validation-and-acceptance.md)     |
| 10      | Traceability and Unresolved Issues       | Source-to-spec evidence and superseded design | [10-traceability-and-unresolved-issues.md](10-traceability-and-unresolved-issues.md)             |
| 11      | Appendices                               | Dependency diagram and examples               | [11-appendices.md](11-appendices.md)                                                             |

## Read order

For independent implementation, read [Section 3](03-external-interface-requirements.md) for contracts, [Section 9](09-verification-validation-and-acceptance.md) for acceptance, and [Section 10](10-traceability-and-unresolved-issues.md) for evidence and unresolved drift. Continue reading the remaining sections for normative constraints and domain behavior.

Read sections 1 through 11 in sequence. Use [Section 4](04-functional-and-behavioral-requirements.md) for requirements, [Section 7](07-constraints.md) for enforced constraints, and [Section 8](08-requirements-allocation-and-dependencies.md) for the current project graph.
