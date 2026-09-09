# 3. External Interface Requirements

## 3.1 Foundation Contract Interface

### ARCH-IF-001 — Foundation contract neutrality

Public contracts exported by `foundation` SHALL be framework-neutral and SHALL NOT require consumers to depend on Spring, Spring Modulith, Spring Data, JPA, ANTLR, HTTP adapters, or a Taskmigo feature module merely to use the contract.

Verification: Inspect the public API and declared dependencies of `foundation` and confirm that no prohibited framework or feature dependency is required.
Traceability: [Foundation](02-overall-description.md#221-foundation); [Foundation dependency floor](07-constraints.md#arch-con-001--foundation-dependency-floor).

### ARCH-IF-002 — Feature-owned public contracts

A public contract whose semantics are defined by one capability SHALL be exported by that capability module rather than by `foundation`.

Verification: Inspect public contracts for Query Filtering, Authorization, Language, and Identity and confirm capability-specific contracts are owned by their defining module.
Traceability: [Standalone Capability Modules](02-overall-description.md#222-standalone-capability-modules); [Capability ownership](04-functional-and-behavioral-requirements.md#arch-mod-002--capability-ownership).

## 3.2 Adapter Interfaces

### ARCH-IF-003 — Web adapter boundary

Public HTTP extraction, HTTP error representation, Spring MVC argument resolution, and Spring Security adaptation SHALL be owned by `web` or another explicit adapter module and SHALL NOT be required by capability contracts.

Verification: Inspect capability-module APIs and confirm that their public contracts can be used without importing web-adapter types.
Traceability: [Adapter and Application Modules](02-overall-description.md#224-adapter-and-application-modules).

## 3.3 Persistence Interfaces

### ARCH-IF-004 — Resource-owned persistence translation

Resource-specific mappings from capability predicates or resource contracts to persistence queries SHALL be owned by the resource-owning module. Shared persistence infrastructure MAY be provided by `database`, but `database` SHALL NOT become the owner of resource semantics solely because a resource is persisted.

Verification: Inspect persistence binders and mappings and confirm that resource-specific queryability and domain semantics remain with the owning resource module.
Traceability: [Infrastructure Modules](02-overall-description.md#223-infrastructure-modules); [Resource persistence ownership](04-functional-and-behavioral-requirements.md#arch-mod-006--resource-persistence-ownership).

## 3.4 Application Composition Interface

### ARCH-IF-005 — Composition-only application boundary

Executable applications SHALL compose capability, infrastructure, and adapter modules through their published contracts and SHALL NOT become the canonical owner of reusable capability semantics.

Verification: Inspect executable application modules and confirm reusable semantics are defined in capability or infrastructure modules rather than application-local contracts.
Traceability: [Adapter and Application Modules](02-overall-description.md#224-adapter-and-application-modules).
