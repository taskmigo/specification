# 9. Verification, Validation, and Acceptance Evidence

## 9.1 Verification Objectives

### ARCH-VER-001 — Foundation dependency verification

Architecture verification SHALL confirm that `foundation` has no project dependency on any higher-level Taskmigo module and that every third-party dependency it re-exports satisfies [ARCH-CON-003](07-constraints.md#arch-con-003--shared-foundation-dependencies).

Verification: Inspect the resolved build dependency graph, `foundation` dependency exposure, and representative consumers.
Traceability: ARCH-CON-001; ARCH-CON-003.

### ARCH-VER-002 — Capability boundary verification

Architecture verification SHALL confirm that `language`, `query`, and `authorization` do not depend on prohibited consumer modules defined by [Section 7](07-constraints.md).

Verification: Inspect the resolved project dependency graph and applicable [Spring Modulith](https://docs.spring.io/spring-modulith/reference/) module-boundary tests.
Traceability: ARCH-CON-004; ARCH-CON-005; ARCH-CON-006.

### ARCH-VER-003 — Resource ownership verification

Architecture verification SHALL inspect representative Query Schemas, Object Authorization Schemas, and persistence binders and confirm resource-specific mappings are owned by the resource module rather than generic capability modules.

Verification: Inspect representative identity resources and any additional resource modules introduced by feature specifications.
Traceability: ARCH-MOD-006; ARCH-CON-007.

### ARCH-VER-004 — Adapter boundary verification

Architecture verification SHALL confirm reusable lower-level modules do not depend on `web` or executable application modules.

Verification: Inspect the dependency graph and representative public APIs for adapter leakage.
Traceability: ARCH-CON-008; ARCH-CON-009.

### ARCH-VER-005 — Spring Modulith verification

Every executable composition that contains Taskmigo Spring Modulith application modules SHALL run an automated Spring Modulith architecture test that constructs the applicable `ApplicationModules` model and invokes `verify()` or an equivalent verification path.

The test SHALL fail for module cycles, references to another module's internal packages, and violations of explicit `allowedDependencies` declarations.

Verification: Introduce one isolated representative violation for each failure category and confirm the architecture test rejects it.
Traceability: ARCH-MOD-010; ARCH-MOD-011; ARCH-CON-010; ARCH-CON-011.

### ARCH-VER-006 — ArchUnit package-boundary verification

Every physical module containing two or more architectural package boundaries not fully enforced by Spring Modulith SHALL run automated [ArchUnit](https://www.archunit.org/getting-started) rules for those remaining package restrictions.

Verification: Introduce a representative forbidden cross-package dependency inside the physical module and confirm the ArchUnit rule rejects it.
Traceability: ARCH-CON-012; ARCH-QUAL-003.

## 9.2 Acceptance Conditions

A change affecting module ownership, project dependencies, or architectural package boundaries is acceptable only when:

- Every new Taskmigo project dependency edge is permitted by [Section 8.2](08-requirements-allocation-and-dependencies.md#82-allowed-dependency-model).
- No prohibited relationship from [Section 8.3](08-requirements-allocation-and-dependencies.md#83-prohibited-dependencies) is introduced.
- Every public feature-specific contract remains owned by its defining capability or resource module.
- `foundation` continues to pass the [Architectural Boundary Test](02-overall-description.md#24-architectural-boundary-test), including the classification of shared third-party dependencies.
- Every representable logical module boundary passes Spring Modulith verification.
- Every applicable intra-physical-module package boundary passes its ArchUnit rules.
- Applicable automated architecture, build, and specification checks pass.

## 9.3 Validation

The architecture SHALL be considered valid for future feature growth when a new independent capability can be introduced without moving its semantics into `foundation`, while still allowing intentional project-wide technical libraries to be shared through `foundation` and enforcing the new capability's logical boundaries automatically.

Verification: Review at least one representative future-capability design against the dependency model and boundary-enforcement model or demonstrate the condition when the next independent capability is introduced.
Traceability: ARCH-QUAL-001; ARCH-QUAL-003.
