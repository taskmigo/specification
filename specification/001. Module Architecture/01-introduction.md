# 1. Introduction

## 1.1 Purpose

This SRS specifies **how Taskmigo's server capabilities are owned, composed and isolated**. It is a normative contract for module dependency direction, bounded-context ownership, published interfaces, architectural test expectations and transaction responsibility. It does not prescribe a universal folder pattern or the internals of a particular business endpoint.

The implementation evidence for this edition is pinned to [backend commit `9c1cd242`](https://github.com/taskmigo/taskmigo/tree/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server). A source snapshot establishes observed topology, not permission to change approved requirements silently.

## 1.2 Scope

The architecture is a DDD/Onion **modular monolith**. The production composition roots are Web (HTTP and OAuth), Worker (scheduled work), and Migration (schema/managed-resource installation). Supporting tooling, including OpenAPI generation and architecture tests, is not a fourth business runtime.

This document specifies: physical Gradle module edges; logical Spring Modulith boundaries; domain/application/persistence responsibilities; use-case and event contract ownership; and transaction orchestration. API shapes, business state machines and persistence field semantics belong to their owning capability SRS.

## 1.3 Terminology

| Term                       | Meaning                                                                                                     |
| -------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Bounded context            | Exclusive owner of a domain aggregate, its invariants and application use cases                             |
| Supporting capability      | Reusable functionality (for example Query or Language) without business aggregate ownership                 |
| Published interface        | Provider-owned public contract or explicitly named Spring Modulith interface                                |
| Internal module            | Implementation-support module under `modules/internal`, not directly imported by production executable apps |
| Domain                     | Framework-neutral business rules, entities and value objects                                                |
| Application implementation | Use-case orchestration; may own Spring declarative transaction boundaries                                   |
| Composition root           | Runtime application assembling previously published capabilities                                            |

## 1.4 Normative and evidence references

- [Server architecture](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/ARCHITECTURE.md) — architecture evidence.
- [Gradle project declarations](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/settings.gradle.kts) — physical module snapshot.
- [Contributor verification guidance](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/CONTRIBUTING.md).

## 1.5 How to interpret this SRS

Read [section 4](04-functional-and-behavioral-requirements.md) for required ownership behavior, [section 7](07-constraints.md) for forbidden dependencies, [section 8](08-requirements-allocation-and-dependencies.md) for the actual project graph, and [section 9](09-verification-validation-and-acceptance.md) for objective conformance checks. A useful implementation design is not automatically an approved dependency; exceptions require an explicit decision.
