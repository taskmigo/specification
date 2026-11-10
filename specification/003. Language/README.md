---
metadata:
  version: 0.7.0
  changelog: Complete Language SRS rewrite covering source profiles, typed artifacts, consumer boundaries and deterministic verification.
---

# Language — Software Requirements Specification

This document is the normative specification of the **internal Taskmigo embedded language** and its typed compile/evaluate contracts. Consumers SHALL apply their own narrower compilation profiles without redefining canonical Language semantics.

**Evidence baseline:** [Internal Language at backend commit 9c1cd242](https://github.com/taskmigo/taskmigo/tree/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/internal/language).

## Contents

| Section | Subject | Document |
| --- | --- | --- |
| 1 | Purpose, scope and vocabulary | [01-introduction.md](01-introduction.md) |
| 2 | Compiler/evaluation workflow | [02-overall-description.md](02-overall-description.md) |
| 3 | Syntax, schemas and evaluation interfaces | [03-external-interface-requirements.md](03-external-interface-requirements.md) |
| 4 | Typing, evaluation and simplification | [04-functional-and-behavioral-requirements.md](04-functional-and-behavioral-requirements.md) |
| 5 | AST and compiled metadata | [05-data-and-information-requirements.md](05-data-and-information-requirements.md) |
| 6 | Safety, complexity and diagnostics | [06-quality-and-performance-requirements.md](06-quality-and-performance-requirements.md) |
| 7 | Language constraints | [07-constraints.md](07-constraints.md) |
| 8 | Ownership and consumer dependencies | [08-requirements-allocation-and-dependencies.md](08-requirements-allocation-and-dependencies.md) |
| 9 | Semantic and consumer-profile acceptance | [09-verification-validation-and-acceptance.md](09-verification-validation-and-acceptance.md) |
| 10 | Evidence and unresolved syntax questions | [10-traceability-and-unresolved-issues.md](10-traceability-and-unresolved-issues.md) |
| 11 | Source examples | [11-appendices.md](11-appendices.md) |

## Suggested read order

Start with [section 3](03-external-interface-requirements.md) for exact source forms, [section 4](04-functional-and-behavioral-requirements.md) for semantics, [section 5](05-data-and-information-requirements.md) for compiled artifacts, [section 9](09-verification-validation-and-acceptance.md) for objective examples, and [section 10](10-traceability-and-unresolved-issues.md) for source evidence. Language syntax in this SRS does not authorize that same syntax in Authorization or Query without their profile rules.
