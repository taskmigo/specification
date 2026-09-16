# 3. External Interface Requirements

## 3.1 Shared Contract Interfaces

### ARCH-IF-001 — Foundation contract neutrality

Public contracts exported by `foundation` SHALL be framework-neutral and SHALL NOT require consumers to depend on Spring, Spring Modulith, Spring Data, JPA, ANTLR, HTTP adapters, or a Taskmigo domain context merely to use the contract.

Verification: Inspect the public API and declared dependencies of `foundation` and confirm that no prohibited framework or domain-context dependency is required.
Traceability: [Shared Technical Modules](02-overall-description.md#224-shared-technical-modules); [Foundation dependency floor](07-constraints.md#arch-con-001--foundation-dependency-floor).

### ARCH-IF-002 — Owner-published contracts

A public contract whose semantics are defined by one bounded context or reusable supporting capability SHALL be exported by that owner rather than by `foundation`, `database`, `web`, or an executable application.

Another bounded context SHALL consume that contract only through the owner's module root API, an explicitly declared [Spring Modulith](https://docs.spring.io/spring-modulith/reference/) named interface, or a published integration-event contract.

Verification: Inspect public contracts for Access Control, Identity, Query Filtering, and Language and confirm owner-specific contracts have one canonical publisher and consumers do not import owner-internal packages.
Traceability: [Domain and Module Categories](02-overall-description.md#22-domain-and-module-categories); [Capability ownership](04-functional-and-behavioral-requirements.md#arch-mod-002--capability-ownership).

### ARCH-IF-003 — Cross-context event contracts

A domain or integration event consumed outside its owning bounded context SHALL expose only the stable information required by consumers and SHALL NOT expose private persistence entities, ORM relationships, framework request objects, or mutable aggregate internals.

Verification: Inspect cross-context event payloads and confirm they are published contracts independent from the owner's private persistence representation.
Traceability: [Aggregate and Persistence Ownership](02-overall-description.md#25-aggregate-and-persistence-ownership); [Cross-context integration](04-functional-and-behavioral-requirements.md#arch-mod-014--cross-context-integration).

## 3.2 Adapter Interfaces

### ARCH-IF-004 — Web adapter boundary

Public HTTP extraction, HTTP error representation, Spring MVC argument resolution, and Spring Security adaptation SHALL be owned by `web` or another explicit adapter module and SHALL NOT be required by domain or supporting-capability contracts.

Verification: Inspect reusable module APIs and confirm that their public contracts can be used without importing web-adapter types.
Traceability: [Adapter and Application Modules](02-overall-description.md#225-adapter-and-application-modules).

## 3.3 Persistence Interfaces

### ARCH-IF-005 — Owner-controlled persistence translation

Resource-specific mappings from Query or Object Authorization predicates to persistence queries SHALL be owned by the resource-owning bounded context. Shared persistence infrastructure MAY be provided by `database`, but `database` SHALL NOT become the owner of domain semantics solely because a resource is persisted.

Repository implementations, ORM entities, closure-table writers, and persistence binders SHALL remain implementation details of their owning context unless an explicit published contract states otherwise.

Verification: Inspect persistence binders and mappings and confirm resource-specific queryability, repository implementations, and domain semantics remain with the owning context.
Traceability: [Shared Technical Modules](02-overall-description.md#224-shared-technical-modules); [Resource persistence ownership](04-functional-and-behavioral-requirements.md#arch-mod-006--resource-persistence-ownership).

### ARCH-IF-006 — No persistence integration contract

A bounded context SHALL NOT require another bounded context to integrate by reading, joining, navigating ORM relationships into, or writing the owner's private persistence tables.

Verification: Inspect cross-context repository queries, ORM mappings, foreign-key navigation, and data-access code and confirm cross-context behavior uses published contracts or events instead of private persistence structures.
Traceability: [Aggregate and Persistence Ownership](02-overall-description.md#25-aggregate-and-persistence-ownership); [Persistence isolation](07-constraints.md#arch-con-014--persistence-isolation).

## 3.4 Application Composition Interface

### ARCH-IF-007 — Composition-only application boundary

Executable applications SHALL compose bounded contexts, supporting capabilities, infrastructure, and adapter modules through their published contracts and SHALL NOT become the canonical owner of reusable domain semantics.

Verification: Inspect executable application modules and confirm reusable semantics are defined in their owning bounded context or supporting capability rather than application-local contracts.
Traceability: [Adapter and Application Modules](02-overall-description.md#225-adapter-and-application-modules).
