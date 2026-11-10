---
metadata:
  version: 0.2.0
  changelog: Complete Authentication SRS rewrite covering OAuth profile, JWT principal claims, guarded sessions, managed installation and security acceptance.
---

# Authentication and Provisioning — Software Requirements Specification

The authoritative contract for Taskmigo's **OAuth/OIDC security, versioned JWT resource access, persisted interactive sessions and migration-managed security resources**.

**Evidence:** [Backend at 9c1cd242](https://github.com/taskmigo/taskmigo/tree/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server).

## Contents

| Section | Subject                                   | Document                                                                                         |
| ------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------ |
| 1       | Purpose, actors and security vocabulary   | [01-introduction.md](01-introduction.md)                                                         |
| 2       | OAuth, JWT, session and migration flows   | [02-overall-description.md](02-overall-description.md)                                           |
| 3       | Client/claims/security interfaces         | [03-external-interface-requirements.md](03-external-interface-requirements.md)                   |
| 4       | Token, session and installation rules     | [04-functional-and-behavioral-requirements.md](04-functional-and-behavioral-requirements.md)     |
| 5       | OAuth persistence, session and key data   | [05-data-and-information-requirements.md](05-data-and-information-requirements.md)               |
| 6       | Security and installation quality         | [06-quality-and-performance-requirements.md](06-quality-and-performance-requirements.md)         |
| 7       | Authentication and management constraints | [07-constraints.md](07-constraints.md)                                                           |
| 8       | Protocol and module ownership             | [08-requirements-allocation-and-dependencies.md](08-requirements-allocation-and-dependencies.md) |
| 9       | OAuth, session and migration acceptance   | [09-verification-validation-and-acceptance.md](09-verification-validation-and-acceptance.md)     |
| 10      | Evidence and unsupported capabilities     | [10-traceability-and-unresolved-issues.md](10-traceability-and-unresolved-issues.md)             |
| 11      | Flowcharts and managed defaults           | [11-appendices.md](11-appendices.md)                                                             |

## How to read

Start with [section 3](03-external-interface-requirements.md) for token claims, browser client settings and security outcome contracts, then [section 4](04-functional-and-behavioral-requirements.md) for lifecycle rules and [section 9](09-verification-validation-and-acceptance.md) for integration acceptance. [Section 10](10-traceability-and-unresolved-issues.md) records code evidence and explicitly absent public features. OAuth protocol endpoints SHALL be confirmed through actual server metadata.
