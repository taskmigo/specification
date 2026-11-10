---
metadata:
  version: 0.1.2
  changelog: Defines module-owned normative API contracts independently of backend-generated OpenAPI.
---

<!-- markdownlint-disable MD041 -->

## Table of contents

| Section | Title                                    | Purpose                                    | Document                                                                                         |
| ------- | ---------------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| 1       | Introduction                             | Scope and terminology                      | [01-introduction.md](01-introduction.md)                                                         |
| 2       | Overall Description                      | User, Group and lifecycle context          | [02-overall-description.md](02-overall-description.md)                                           |
| 3       | External Interface Requirements          | Public User/Group/configuration API        | [03-external-interface-requirements.md](03-external-interface-requirements.md)                   |
| 4       | Functional and Behavioral Requirements   | Identity, retention and registration rules | [04-functional-and-behavioral-requirements.md](04-functional-and-behavioral-requirements.md)     |
| 5       | Data and Information Requirements        | Lifecycle and PII data                     | [05-data-and-information-requirements.md](05-data-and-information-requirements.md)               |
| 6       | Quality and Performance Requirements     | Privacy, concurrency and performance       | [06-quality-and-performance-requirements.md](06-quality-and-performance-requirements.md)         |
| 7       | Constraints                              | Retention and security boundaries          | [07-constraints.md](07-constraints.md)                                                           |
| 8       | Requirements Allocation and Dependencies | Owner and worker responsibilities          | [08-requirements-allocation-and-dependencies.md](08-requirements-allocation-and-dependencies.md) |
| 9       | Verification, Validation, and Acceptance | Identity and retention verification        | [09-verification-validation-and-acceptance.md](09-verification-validation-and-acceptance.md)     |
| 10      | Traceability and Unresolved Issues       | Source mapping and conflicts               | [10-traceability-and-unresolved-issues.md](10-traceability-and-unresolved-issues.md)             |
| 11      | Appendices                               | State diagram and sample configuration     | [11-appendices.md](11-appendices.md)                                                             |

## Read order

Read sections 1–11 in order. Start with [external interfaces](03-external-interface-requirements.md), continue through [functional behavior](04-functional-and-behavioral-requirements.md), and consult [verification](09-verification-validation-and-acceptance.md) and [unresolved issues](10-traceability-and-unresolved-issues.md) before treating the specification as complete.

## Normative HTTP/JSON Contract

- [**API contract (normative)**](api-contract.md) — methods, paths, query parameters, request/response DTOs, types, required fields, constraints, success and error codes, and authorization
- [HTTP/JSON examples](12-api-v0-examples.md) — illustrative request and response bodies
- [Shared API v0 conventions](../007.%20Audit%20and%20API%20Contracts/12-api-v0-http-examples.md) — common envelope, error and pagination rules

The specification is the **source of truth** for backend implementation. The OpenAPI generated in `taskmigo/taskmigo` SHALL be checked against this authored contract, not copied back into it. The `npm run openapi:check` comparator verifies this separation.
