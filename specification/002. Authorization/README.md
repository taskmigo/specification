---
metadata:
  version: 0.9.0
  changelog: Comprehensive Authorization SRS rewrite preserving requirement identifiers while specifying external API contracts and fail-closed verification.
---

# Authorization — Software Requirements Specification

The normative contract for Taskmigo **Statements, Roles, grants, Request Authorization and Object Authorization**. Its intended readers include API consumers, authorization implementers and QA/security engineers.

**Evidence baseline:** [Backend 9c1cd242](https://github.com/taskmigo/taskmigo/tree/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/authorization). Source files and generated OpenAPI are implementation evidence; approved requirements and unresolved drift remain separately identified in section 10.

## Contents

| Section | Subject | Document |
| --- | --- | --- |
| 1 | Intent, scope and glossary | [01-introduction.md](01-introduction.md) |
| 2 | Authorization process and actors | [02-overall-description.md](02-overall-description.md) |
| 3 | HTTP and policy interface contracts | [03-external-interface-requirements.md](03-external-interface-requirements.md) |
| 4 | Policy/request/object behavior | [04-functional-and-behavioral-requirements.md](04-functional-and-behavioral-requirements.md) |
| 5 | Statement, Role and snapshot data | [05-data-and-information-requirements.md](05-data-and-information-requirements.md) |
| 6 | Security and consistency quality | [06-quality-and-performance-requirements.md](06-quality-and-performance-requirements.md) |
| 7 | Policy and dependency constraints | [07-constraints.md](07-constraints.md) |
| 8 | Owning interfaces and consumers | [08-requirements-allocation-and-dependencies.md](08-requirements-allocation-and-dependencies.md) |
| 9 | Authorization and HTTP acceptance | [09-verification-validation-and-acceptance.md](09-verification-validation-and-acceptance.md) |
| 10 | Traceability and withdrawn contracts | [10-traceability-and-unresolved-issues.md](10-traceability-and-unresolved-issues.md) |
| 11 | Policy examples | [11-appendices.md](11-appendices.md) |

## Consumer read order

Start with [section 3](03-external-interface-requirements.md) for exact API inputs, outputs and allowlists, then [section 4](04-functional-and-behavioral-requirements.md) for evaluation semantics, [section 9](09-verification-validation-and-acceptance.md) for acceptance and [section 10](10-traceability-and-unresolved-issues.md) for evidence and outstanding decisions. The remaining sections establish vocabulary, data and architectural constraints.
