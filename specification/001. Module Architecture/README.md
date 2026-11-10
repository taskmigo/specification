---
metadata:
  version: 0.9.0
  changelog: Complete SRS rewrite with explicit module ownership, independent verification, interface boundaries and source-backed traceability.
---

# Module Architecture — Software Requirements Specification

Defines enforceable boundaries of the Taskmigo modular monolith, not the business behavior of individual resource endpoints.

**Audience:** Module owners, application engineers, architecture reviewers and CI maintainers. **Evidence baseline:** [Taskmigo server at 9c1cd242](https://github.com/taskmigo/taskmigo/tree/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server).

## Contents

| Section | What it answers                              | Document                                                                                         |
| ------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| 1       | Purpose, actors and scope                    | [01-introduction.md](01-introduction.md)                                                         |
| 2       | Ownership and runtime model                  | [02-overall-description.md](02-overall-description.md)                                           |
| 3       | Published interfaces and consumer boundaries | [03-external-interface-requirements.md](03-external-interface-requirements.md)                   |
| 4       | Normative module behavior                    | [04-functional-and-behavioral-requirements.md](04-functional-and-behavioral-requirements.md)     |
| 5       | Project and contract metadata                | [05-data-and-information-requirements.md](05-data-and-information-requirements.md)               |
| 6       | Architecture quality                         | [06-quality-and-performance-requirements.md](06-quality-and-performance-requirements.md)         |
| 7       | Prohibited dependencies and constraints      | [07-constraints.md](07-constraints.md)                                                           |
| 8       | Project graph and allocation                 | [08-requirements-allocation-and-dependencies.md](08-requirements-allocation-and-dependencies.md) |
| 9       | Architecture acceptance                      | [09-verification-validation-and-acceptance.md](09-verification-validation-and-acceptance.md)     |
| 10      | Evidence, decisions and drift                | [10-traceability-and-unresolved-issues.md](10-traceability-and-unresolved-issues.md)             |
| 11      | Examples and diagrams                        | [11-appendices.md](11-appendices.md)                                                             |

## How to use

Read sections 1–2 for scope and vocabulary, 3–8 for normative rules and allocation, 9 for acceptance and 10 for source/evidence reconciliation. Start with [sections 4](04-functional-and-behavioral-requirements.md), [7](07-constraints.md) and [8](08-requirements-allocation-and-dependencies.md) when reviewing a new module dependency. The appendix is illustrative, not an independent source of requirements.

## Baseline discipline

The backend commit is **observed evidence**; it does not automatically authorize a new requirement. Retain stable ARCH-* identifiers and record code/spec conflicts in [section 10](10-traceability-and-unresolved-issues.md) before revising any normative rule.
