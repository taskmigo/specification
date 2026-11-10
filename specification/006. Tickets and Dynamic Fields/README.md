---
metadata:
  version: 0.2.0
  changelog: Complete Ticket SRS rewrite covering typed Type/Template versions, field-level HTTP contracts, query allowlists and historical acceptance.
---

# Tickets and Dynamic Fields — Software Requirements Specification

This document defines the public contract for **Tickets, Ticket Types, custom-field templates and historical schema preservation**. It is suitable for independent frontend/API implementation and cross-repository contract testing.

**Evidence:** [Ticket backend at 9c1cd242](https://github.com/taskmigo/taskmigo/tree/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/ticket).

## Contents

| Section | Subject                                | Document                                                                                         |
| ------- | -------------------------------------- | ------------------------------------------------------------------------------------------------ |
| 1       | Scope, users and template vocabulary   | [01-introduction.md](01-introduction.md)                                                         |
| 2       | Ticket lifecycle and version evolution | [02-overall-description.md](02-overall-description.md)                                           |
| 3       | Ticket/Type/Template API contract      | [03-external-interface-requirements.md](03-external-interface-requirements.md)                   |
| 4       | Business rules and historical pinning  | [04-functional-and-behavioral-requirements.md](04-functional-and-behavioral-requirements.md)     |
| 5       | Ticket and EAV data schema             | [05-data-and-information-requirements.md](05-data-and-information-requirements.md)               |
| 6       | Authorization and query quality        | [06-quality-and-performance-requirements.md](06-quality-and-performance-requirements.md)         |
| 7       | Version and ownership constraints      | [07-constraints.md](07-constraints.md)                                                           |
| 8       | Component ownership and dependencies   | [08-requirements-allocation-and-dependencies.md](08-requirements-allocation-and-dependencies.md) |
| 9       | Contract and lifecycle verification    | [09-verification-validation-and-acceptance.md](09-verification-validation-and-acceptance.md)     |
| 10      | Source trace and unresolved features   | [10-traceability-and-unresolved-issues.md](10-traceability-and-unresolved-issues.md)             |
| 11      | Version diagrams and JSON examples     | [11-appendices.md](11-appendices.md)                                                             |

## Read order and boundaries

Start with [section 3](03-external-interface-requirements.md) to implement an HTTP client; [sections 4](04-functional-and-behavioral-requirements.md) and [5](05-data-and-information-requirements.md) to implement domain behavior; and [section 9](09-verification-validation-and-acceptance.md) to validate both. [Section 10](10-traceability-and-unresolved-issues.md) records the backend evidence and unsupported features. Shared [Query Filtering](../004.%20Query%20Filtering/README.md) and [API Envelope](../007.%20Audit%20and%20API%20Contracts/README.md) semantics are linked instead of copied.
