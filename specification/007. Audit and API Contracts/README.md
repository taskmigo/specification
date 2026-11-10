---
metadata:
  version: 0.2.0
  changelog: Full Audit and API contract rewrite defining transaction/privacy rules, envelope/error matrices and source-vs-OpenAPI verification.
---

# Audit and API Contracts — Software Requirements Specification

The canonical shared specification for **Entity Audit, API v0 envelopes, error semantics and pagination**, linked by domain modules rather than duplicated in every HTTP operation.

**Evidence:** [Backend revision 9c1cd242](https://github.com/taskmigo/taskmigo/tree/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server) and [generated OpenAPI v0](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/web/src/main/resources/static/api/docs/openapi.yaml).

## Contents

| Section | Subject                                     | Document                                                                                         |
| ------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| 1       | Scope and API/Audit terms                   | [01-introduction.md](01-introduction.md)                                                         |
| 2       | Entity Audit and transport context          | [02-overall-description.md](02-overall-description.md)                                           |
| 3       | Audit list, envelope and error matrix       | [03-external-interface-requirements.md](03-external-interface-requirements.md)                   |
| 4       | Audit privacy and API error behavior        | [04-functional-and-behavioral-requirements.md](04-functional-and-behavioral-requirements.md)     |
| 5       | Audit/event and API metadata                | [05-data-and-information-requirements.md](05-data-and-information-requirements.md)               |
| 6       | Security, privacy and contract quality      | [06-quality-and-performance-requirements.md](06-quality-and-performance-requirements.md)         |
| 7       | Audit and public API constraints            | [07-constraints.md](07-constraints.md)                                                           |
| 8       | Owning modules and transaction dependencies | [08-requirements-allocation-and-dependencies.md](08-requirements-allocation-and-dependencies.md) |
| 9       | Wire contract acceptance                    | [09-verification-validation-and-acceptance.md](09-verification-validation-and-acceptance.md)     |
| 10      | Code/schema trace and absent APIs           | [10-traceability-and-unresolved-issues.md](10-traceability-and-unresolved-issues.md)             |
| 11      | Envelope and audit JSON examples            | [11-appendices.md](11-appendices.md)                                                             |

## Read order

Start with [section 3](03-external-interface-requirements.md) for exact envelopes and machine error codes, [section 4](04-functional-and-behavioral-requirements.md) for audit behavior, [section 9](09-verification-validation-and-acceptance.md) for acceptance and [section 10](10-traceability-and-unresolved-issues.md) for evidence and unsupported interfaces. Per-resource requests and responses remain owned by those resources' SRSs.
