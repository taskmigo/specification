---
metadata:
  version: 0.4.0
  changelog: Complete query SRS rewrite defining client grammar, operation-owned allowlists, database-side authorization and contract verification.
---

# Query Filtering — Software Requirements Specification

This SRS is the canonical shared contract for **FilterBy, SortBy, pagination, operation Query Schemas and safe database-side predicate binding**. Resource owners define which specific logical fields their operations permit.

**Evidence baseline:** [Query implementation at 9c1cd242](https://github.com/taskmigo/taskmigo/tree/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/query).

## Contents

| Section | Subject | Document |
| --- | --- | --- |
| 1 | Purpose, scope and terms | [01-introduction.md](01-introduction.md) |
| 2 | Request pipeline and query safety | [02-overall-description.md](02-overall-description.md) |
| 3 | Wire grammar, sorting and allowlists | [03-external-interface-requirements.md](03-external-interface-requirements.md) |
| 4 | Compilation, sorting and authorization | [04-functional-and-behavioral-requirements.md](04-functional-and-behavioral-requirements.md) |
| 5 | Schema and dynamic-field data | [05-data-and-information-requirements.md](05-data-and-information-requirements.md) |
| 6 | Safety and query quality | [06-quality-and-performance-requirements.md](06-quality-and-performance-requirements.md) |
| 7 | Supported syntax boundaries | [07-constraints.md](07-constraints.md) |
| 8 | Cross-module allocation | [08-requirements-allocation-and-dependencies.md](08-requirements-allocation-and-dependencies.md) |
| 9 | Filter/sort/paging acceptance | [09-verification-validation-and-acceptance.md](09-verification-validation-and-acceptance.md) |
| 10 | Traceability and superseded syntax | [10-traceability-and-unresolved-issues.md](10-traceability-and-unresolved-issues.md) |
| 11 | Request and pipeline examples | [11-appendices.md](11-appendices.md) |

## Recommended read order

Begin with [section 3](03-external-interface-requirements.md) for exact query syntax and module-owned allowlist links; then [section 4](04-functional-and-behavioral-requirements.md) for semantic query composition and [section 9](09-verification-validation-and-acceptance.md) for high-signal acceptance. [Section 10](10-traceability-and-unresolved-issues.md) records source evidence and out-of-scope query assumptions.
