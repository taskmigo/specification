# 1. Introduction

## 1.1 Purpose

This specification defines the currently implemented Taskmigo server module boundaries, DDD/Onion responsibilities, dependency direction, transactions, and mechanically enforced architectural constraints. It describes the backend at the [reviewed implementation commit](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/settings.gradle.kts).

## 1.2 Scope

The server SHALL be a modular monolith with independently executable Web, Worker, and Migration applications. The OpenAPI generator, architecture tests, and authorization benchmarks SHALL remain development/supporting projects rather than business runtimes.

This specification governs physical Gradle project dependencies, logical Spring Modulith interfaces, Java package ownership, transaction boundaries, shared infrastructure, and cross-context integration. It does not define endpoint-specific business rules.

## 1.3 Definitions, Acronyms, and Abbreviations

- **Bounded context:** Owner of one domain model and its application use cases.
- **Supporting capability:** Reusable technical or language/query library with no independently owned business aggregate.
- **Published interface:** Provider-owned root or Spring Modulith named interface intentionally consumed across modules.
- **Internal module:** Physical module located under `modules/internal`, inaccessible as a direct dependency from executable applications.
- **Application implementation:** Concrete use-case orchestration, permitted to use Spring declarative transaction annotations.
- **Domain:** Framework-neutral rules, aggregates, value objects, and business services.

## 1.4 References

- [Server architecture decision](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/ARCHITECTURE.md).
- [Gradle project topology](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/settings.gradle.kts).
- [Repository contribution and verification guidance](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/CONTRIBUTING.md).

## 1.5 Overview

[Overall Description](02-overall-description.md) establishes the model. [Requirements](04-functional-and-behavioral-requirements.md), [Constraints](07-constraints.md), and [Allocation](08-requirements-allocation-and-dependencies.md) define the normative boundaries.
