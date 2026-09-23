# 5. Data and Information Requirements

## 5.1 Architectural Identity

### ARCH-DATA-001 — Stable architectural identity

Each bounded context, reusable supporting capability, shared technical module, adapter, and executable application SHALL have one stable architectural identity used consistently by build configuration, architecture verification, and specification allocation.

The Access Control bounded context SHALL use `:modules:access-control` as its Gradle project identity. The physical source directory MAY remain `server/modules/authorization`, and the Java API namespace MAY remain `io.taskmigo.authorization`; neither implementation name changes the canonical bounded-context identity.

Verification: Compare module names, bounded-context names, build configuration, and specification references and confirm each semantic owner has one unambiguous physical mapping.
Traceability: [Domain and Module Categories](02-overall-description.md#22-domain-and-module-categories).

### ARCH-DATA-002 — Public contract ownership metadata

A public contract SHALL be attributable to exactly one owning bounded context, supporting capability, or technical owner. Documentation and architecture metadata SHALL NOT represent the same contract as being canonically owned by multiple contexts.

Verification: Inspect exported contracts and module documentation and confirm each contract has one canonical owner.
Traceability: [Owner-published contracts](03-external-interface-requirements.md#arch-if-002--owner-published-contracts).

### ARCH-DATA-003 — Aggregate ownership metadata

Each persisted aggregate type SHALL be attributable to exactly one bounded context and one aggregate root. Persistence mappings, repositories, history records, or projections MAY have different technical representations but SHALL NOT create a second canonical owner for the aggregate.

Verification: Inspect aggregate roots, repositories, ORM mappings, and architecture documentation and confirm each persisted aggregate has one bounded-context owner.
Traceability: [Aggregate ownership](04-functional-and-behavioral-requirements.md#arch-mod-013--aggregate-ownership).

## 5.2 Dependency Information

### ARCH-DATA-004 — Explicit project dependencies

Inter-module project dependencies SHALL be declared explicitly in build configuration so the allowed dependency model can be verified mechanically. A reusable `java-library` project SHALL expose another project or third-party API transitively only when types from that dependency occur in its published contract; framework/runtime wiring SHALL use implementation/runtime exposure instead.

Verification: Inspect build configuration and confirm module relationships do not rely on undeclared runtime classpath coupling.
Traceability: [Allowed Dependency Model](08-requirements-allocation-and-dependencies.md#82-allowed-dependency-model).

### ARCH-DATA-005 — Published interface metadata

Cross-context published APIs, ports, and event contracts SHALL be identifiable through the module root API or explicit Spring Modulith named interfaces. Internal domain, application-service, and adapter packages SHALL remain non-published by default.

Verification: Inspect Spring Modulith metadata and package exports and confirm cross-context consumers target only published interfaces.
Traceability: ARCH-MOD-011; ARCH-MOD-014.

## 5.3 Persistence Information

Resource-specific persistence mappings are governed by [ARCH-MOD-006](04-functional-and-behavioral-requirements.md#arch-mod-006--resource-persistence-ownership), aggregate ownership by [ARCH-MOD-013](04-functional-and-behavioral-requirements.md#arch-mod-013--aggregate-ownership), and cross-context persistence isolation by [ARCH-CON-014](07-constraints.md#arch-con-014--persistence-isolation).

This architecture specification introduces no independent product data-retention, privacy, or lifecycle requirements beyond ensuring that persistence ownership follows the owning bounded context.
