---
metadata:
  version: 0.8.2
  changelog: Adds module-local OpenAPI and concrete HTTP/JSON contract navigation.
---

<!-- markdownlint-disable MD041 -->

## Table of contents

| Section | Title                                    | Purpose                                | Document                                                                                         |
| ------- | ---------------------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------ |
| 1       | Introduction                             | Scope and terminology                  | [01-introduction.md](01-introduction.md)                                                         |
| 2       | Overall Description                      | Policy and grant model                 | [02-overall-description.md](02-overall-description.md)                                           |
| 3       | External Interface Requirements          | Statement and Authorization interfaces | [03-external-interface-requirements.md](03-external-interface-requirements.md)                   |
| 4       | Functional and Behavioral Requirements   | Request/Object policy behavior         | [04-functional-and-behavioral-requirements.md](04-functional-and-behavioral-requirements.md)     |
| 5       | Data and Information Requirements        | Persisted grants and snapshots         | [05-data-and-information-requirements.md](05-data-and-information-requirements.md)               |
| 6       | Quality and Performance Requirements     | Security and consistency               | [06-quality-and-performance-requirements.md](06-quality-and-performance-requirements.md)         |
| 7       | Constraints                              | Language and boundary limits           | [07-constraints.md](07-constraints.md)                                                           |
| 8       | Requirements Allocation and Dependencies | Owner responsibilities                 | [08-requirements-allocation-and-dependencies.md](08-requirements-allocation-and-dependencies.md) |
| 9       | Verification, Validation, and Acceptance | Authorization verification             | [09-verification-validation-and-acceptance.md](09-verification-validation-and-acceptance.md)     |
| 10      | Traceability and Unresolved Issues       | Superseded contracts and traceability  | [10-traceability-and-unresolved-issues.md](10-traceability-and-unresolved-issues.md)             |
| 11      | Appendices                               | Policy and decision examples           | [11-appendices.md](11-appendices.md)                                                             |

## Read order

Read sections 1–11 in order. Start with [external interfaces](03-external-interface-requirements.md), continue through [functional behavior](04-functional-and-behavioral-requirements.md), and consult [verification](09-verification-validation-and-acceptance.md) and [unresolved issues](10-traceability-and-unresolved-issues.md) before treating the specification as complete.

## Module API Reference

- [Module OpenAPI 3.1 document](openapi.yaml) — paths, parameters, request bodies, responses, and schema definitions owned by this module
- [Module API request/response examples](12-api-v0-examples.md) — endpoint index and illustrative JSON payloads
- [Shared v0 conventions and module index](../007.%20Audit%20and%20API%20Contracts/12-api-v0-http-examples.md) — envelope, errors, pagination and other module contracts

The module OpenAPI is a **self-contained snapshot** extracted from the backend-generated v0 OpenAPI. It does not create a separate deployed API or replace the implementation-generated aggregate.
