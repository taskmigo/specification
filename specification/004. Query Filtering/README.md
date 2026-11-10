---
metadata:
  version: 0.3.1
  changelog: Refines implementation parity, missing interface details, verification and source traceability.
---

<!-- markdownlint-disable MD041 -->

## Table of contents

| Section | Title                                    | Purpose                                 | Document                                                                                         |
| ------- | ---------------------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------ |
| 1       | Introduction                             | Scope and terminology                   | [01-introduction.md](01-introduction.md)                                                         |
| 2       | Overall Description                      | Filter and sort model                   | [02-overall-description.md](02-overall-description.md)                                           |
| 3       | External Interface Requirements          | Request, compiler and field contracts   | [03-external-interface-requirements.md](03-external-interface-requirements.md)                   |
| 4       | Functional and Behavioral Requirements   | Database-side execution semantics       | [04-functional-and-behavioral-requirements.md](04-functional-and-behavioral-requirements.md)     |
| 5       | Data and Information Requirements        | Query metadata and context              | [05-data-and-information-requirements.md](05-data-and-information-requirements.md)               |
| 6       | Quality and Performance Requirements     | Correctness and performance             | [06-quality-and-performance-requirements.md](06-quality-and-performance-requirements.md)         |
| 7       | Constraints                              | Allowlist and syntax restrictions       | [07-constraints.md](07-constraints.md)                                                           |
| 8       | Requirements Allocation and Dependencies | Compiler and persistence ownership      | [08-requirements-allocation-and-dependencies.md](08-requirements-allocation-and-dependencies.md) |
| 9       | Verification, Validation, and Acceptance | Filtering/sorting verification          | [09-verification-validation-and-acceptance.md](09-verification-validation-and-acceptance.md)     |
| 10      | Traceability and Unresolved Issues       | Deprecated assumptions and traceability | [10-traceability-and-unresolved-issues.md](10-traceability-and-unresolved-issues.md)             |
| 11      | Appendices                               | Examples and field/operator matrices    | [11-appendices.md](11-appendices.md)                                                             |

## Read order

Read sections 1–11 in order. Start with [external interfaces](03-external-interface-requirements.md), continue through [functional behavior](04-functional-and-behavioral-requirements.md), and consult [verification](09-verification-validation-and-acceptance.md) and [unresolved issues](10-traceability-and-unresolved-issues.md) before treating the specification as complete.
