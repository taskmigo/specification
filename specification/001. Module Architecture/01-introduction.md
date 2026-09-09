# 1. Introduction

## 1.1 Purpose

This Software Requirements Specification defines the mandatory module architecture for Taskmigo software. It establishes stable capability boundaries, dependency direction, and the role of the `foundation` module as the dependency floor for current and future modules.

This document is tailored to the software-requirements information-item guidance in [ISO/IEC/IEEE 29148:2018](https://committee.iso.org/standard/72089.html). It does not claim full conformance to the standard.

## 1.2 Scope

The Module Architecture capability SHALL:

- Define `foundation` as the project-wide dependency floor containing only framework-neutral primitives and contracts that remain meaningful independently of any Taskmigo feature.
- Define standalone capability modules for Language, Query Filtering, Authorization, Identity, and shared database infrastructure.
- Define adapter and application-composition boundaries for web, bootstrap, worker, and future applications.
- Prevent feature semantics, framework adapters, persistence topology, and application composition from leaking into `foundation`.
- Preserve one-way dependency flow from generic modules toward specialized capabilities, resources, adapters, and applications.
- Provide a stable architectural constraint that every feature specification SHALL respect unless this specification is intentionally revised.

This specification SHALL NOT prescribe package-private implementation structure inside a module when that structure does not affect module ownership or dependency direction.

## 1.3 Definitions, Acronyms, and Abbreviations

- **Application Module:** A deployable or executable composition boundary such as `web`, `bootstrap`, or `worker`.
- **Capability Module:** A module that owns one independently meaningful software capability and its semantics, such as `query` or `authorization`.
- **Dependency Floor:** A module that MAY be depended upon by higher-level modules but SHALL NOT depend on those higher-level capabilities.
- **Foundation Primitive:** A framework-neutral type or behavior whose meaning remains valid if any individual Taskmigo feature is removed.
- **Identity:** The capability that owns Taskmigo identity resources such as users, groups, and membership relationships.
- **Resource-Owning Module:** A module that owns domain resources and their resource-specific persistence/query mappings.

## 1.4 References

- [Authorization](../002.%20Authorization/README.md) defines authorization semantics and object authorization contracts.
- [Language](../003.%20Language/README.md) defines the standalone expression and policy language.
- [Query Filtering](../004.%20Query%20Filtering/README.md) defines typed client query filtering.

## 1.5 Overview

[Section 2](02-overall-description.md) defines the architectural model. [Section 4](04-functional-and-behavioral-requirements.md) defines normative module ownership. [Section 7](07-constraints.md) defines mandatory dependency constraints. [Section 8](08-requirements-allocation-and-dependencies.md) defines the allowed dependency relationships.
