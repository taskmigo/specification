# 1. Introduction

## 1.1 Purpose

This Software Requirements Specification defines the mandatory module architecture for Taskmigo software. It establishes stable capability boundaries, dependency direction, the role of the `foundation` module as the shared semantic dependency floor, and the automated mechanisms and build conventions that enforce the architecture.

This document is tailored to the software-requirements information-item guidance in [ISO/IEC/IEEE 29148:2018](https://committee.iso.org/standard/72089.html). It does not claim full conformance to the standard.

## 1.2 Scope

The Module Architecture capability SHALL:

- Define `foundation` as the project-wide shared library for feature-neutral Taskmigo primitives and contracts, not as a distribution mechanism for unrelated third-party build or tooling dependencies.
- Define standalone capability modules for Language, Query Filtering, Authorization, Identity, and shared database infrastructure.
- Define adapter and application-composition boundaries for web, bootstrap, worker, and future applications.
- Define a Gradle convention-plugin layer for project-wide Java toolchain, nullness, static-analysis, formatting, style, and architecture-test conventions without creating false Taskmigo project-module dependencies.
- Fix the versions and scopes of cross-cutting build/tooling dependencies required by that convention layer.
- Use [Spring Modulith](https://docs.spring.io/spring-modulith/reference/) as the primary mechanism for application-module boundaries, explicit allowed dependencies, published interfaces, cycle detection, and internal-package access verification where the architecture is representable by Spring Modulith.
- Use [ArchUnit](https://www.archunit.org/getting-started) as an automated package-boundary linter when architectural boundaries share one physical module or a required package rule is not directly represented by Spring Modulith.
- Prevent feature semantics, resource ownership, framework adapters, persistence topology, application composition, and build-tool distribution from leaking into `foundation`.
- Preserve one-way dependency flow from generic shared semantics and infrastructure toward specialized capabilities, resources, adapters, and applications.
- Provide a stable architectural constraint that every feature specification SHALL respect unless this specification is intentionally revised.

This specification SHALL NOT require every Java package to map one-to-one to a physical build module. Package structure remains implementation-local except where a package participates in a logical module boundary or dependency rule governed by this specification.

## 1.3 Definitions, Acronyms, and Abbreviations

- **Build Convention:** A reusable Gradle convention plugin or equivalent build-logic component that applies project-wide build configuration without becoming a Taskmigo runtime or domain module.
- **Capability Module:** A module that owns one independently meaningful software capability and its semantics, such as `query` or `authorization`.
- **Dependency Floor:** A module that MAY be depended upon by higher-level modules but SHALL NOT depend on those higher-level capabilities.
- **Executable Application:** A runnable composition such as `bootstrap`, `worker`, or a future application entry point.
- **Foundation Library:** The `foundation` physical library that provides feature-neutral Taskmigo-owned primitives and contracts.
- **Identity:** The capability that owns Taskmigo identity resources such as users, groups, and membership relationships.
- **Physical Module:** A build-level module or produced library, such as a Gradle project or JAR boundary.
- **Resource-Owning Module:** A module that owns domain resources and their resource-specific persistence/query mappings.
- **Spring Modulith Application Module:** A logical package-based module detected or declared by Spring Modulith and verified as part of an executable application composition.

## 1.4 References

- [Spring Modulith reference documentation](https://docs.spring.io/spring-modulith/reference/) defines the application-module model, named interfaces, explicit allowed dependencies, and module verification used by this architecture.
- [ArchUnit Getting Started](https://www.archunit.org/getting-started) defines the architecture-test mechanism used for supplemental package-boundary linting.
- [Gradle Convention Plugins](https://docs.gradle.org/current/userguide/custom_plugins.html#sec:convention_plugins) defines the reusable build-configuration mechanism used by the build convention layer.
- [Authorization](../002.%20Authorization/README.md) defines authorization semantics and object authorization contracts.
- [Language](../003.%20Language/README.md) defines the standalone expression and policy language.
- [Query Filtering](../004.%20Query%20Filtering/README.md) defines typed client query filtering.

## 1.5 Overview

[Section 2](02-overall-description.md) defines the architectural model. [Section 4](04-functional-and-behavioral-requirements.md) defines normative module and build-convention ownership. [Section 7](07-constraints.md) defines mandatory dependency, build, and boundary-enforcement constraints. [Section 8](08-requirements-allocation-and-dependencies.md) defines the allowed dependency relationships and enforcement allocation. [Section 12](12-build-conventions-and-tooling-baseline.md) fixes the cross-cutting Java build-tool baseline.
