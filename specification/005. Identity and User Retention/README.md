---
metadata:
  version: 0.2.0
  changelog: Full Identity SRS rewrite documenting User and Group wire contracts, deletion states, PII handling and retention verification.
---

# Identity and User Retention — Software Requirements Specification

The authoritative contract for **User, Group, retention configuration, lifecycle transitions, PII scrubbing and security integration** in the Taskmigo backend.

**Evidence:** [Identity implementation at 9c1cd242](https://github.com/taskmigo/taskmigo/tree/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/identity).

## Contents

| Section | Subject                                             | Document                                                                                         |
| ------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| 1       | Scope, lifecycle vocabulary and actors              | [01-introduction.md](01-introduction.md)                                                         |
| 2       | Registration, retention and privacy flow            | [02-overall-description.md](02-overall-description.md)                                           |
| 3       | User, Group and Configuration API contracts         | [03-external-interface-requirements.md](03-external-interface-requirements.md)                   |
| 4       | Registration, deletion, worker and visibility rules | [04-functional-and-behavioral-requirements.md](04-functional-and-behavioral-requirements.md)     |
| 5       | Identity fields, tombstone and audit data           | [05-data-and-information-requirements.md](05-data-and-information-requirements.md)               |
| 6       | Privacy, concurrency and query quality              | [06-quality-and-performance-requirements.md](06-quality-and-performance-requirements.md)         |
| 7       | System User and immutability constraints            | [07-constraints.md](07-constraints.md)                                                           |
| 8       | Service ownership and transactions                  | [08-requirements-allocation-and-dependencies.md](08-requirements-allocation-and-dependencies.md) |
| 9       | HTTP/lifecycle acceptance cases                     | [09-verification-validation-and-acceptance.md](09-verification-validation-and-acceptance.md)     |
| 10      | Source trace and unresolved decisions               | [10-traceability-and-unresolved-issues.md](10-traceability-and-unresolved-issues.md)             |
| 11      | State diagrams and JSON examples                    | [11-appendices.md](11-appendices.md)                                                             |

## How to read

API consumers begin with [section 3](03-external-interface-requirements.md); implementation and security reviewers with [sections 4](04-functional-and-behavioral-requirements.md) and [5](05-data-and-information-requirements.md); testers with [section 9](09-verification-validation-and-acceptance.md). [Section 10](10-traceability-and-unresolved-issues.md) distinguishes approved requirements, observed source and unresolved decisions. Preserve existing ID-* requirement IDs when making corrections.
