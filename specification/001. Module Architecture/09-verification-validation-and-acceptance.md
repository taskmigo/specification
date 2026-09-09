# 9. Verification, Validation, and Acceptance Evidence

## 9.1 Verification Objectives

### ARCH-VER-001 — Foundation dependency verification

Architecture verification SHALL confirm that `foundation` has no project dependency on any higher-level Taskmigo module and no prohibited framework dependency defined by [ARCH-CON-003](07-constraints.md#arch-con-003--framework-isolation).

Verification: Inspect the resolved build dependency graph and execute the architecture checks that enforce the rule.
Traceability: ARCH-CON-001; ARCH-CON-003.

### ARCH-VER-002 — Capability boundary verification

Architecture verification SHALL confirm that `language`, `query`, and `authorization` do not depend on prohibited consumer modules defined by [Section 7](07-constraints.md).

Verification: Inspect the resolved project dependency graph and module-boundary tests.
Traceability: ARCH-CON-004; ARCH-CON-005; ARCH-CON-006.

### ARCH-VER-003 — Resource ownership verification

Architecture verification SHALL inspect representative Query Schemas, Object Authorization Schemas, and persistence binders and confirm resource-specific mappings are owned by the resource module rather than generic capability modules.

Verification: Inspect representative identity resources and any additional resource modules introduced by feature specifications.
Traceability: ARCH-MOD-006; ARCH-CON-007.

### ARCH-VER-004 — Adapter boundary verification

Architecture verification SHALL confirm reusable lower-level modules do not depend on `web` or executable application modules.

Verification: Inspect the dependency graph and representative public APIs for adapter leakage.
Traceability: ARCH-CON-008; ARCH-CON-009.

## 9.2 Acceptance Conditions

A change affecting module ownership or project dependencies is acceptable only when:

- Every new dependency edge is permitted by [Section 8.2](08-requirements-allocation-and-dependencies.md#82-allowed-dependency-model).
- No prohibited relationship from [Section 8.3](08-requirements-allocation-and-dependencies.md#83-prohibited-dependencies) is introduced.
- Every public feature-specific contract remains owned by its defining capability or resource module.
- `foundation` continues to pass the [Architectural Boundary Test](02-overall-description.md#24-architectural-boundary-test).
- Applicable automated architecture, build, and specification checks pass.

## 9.3 Validation

The architecture SHALL be considered valid for future feature growth when a new independent capability can be introduced without moving its semantics into `foundation` and without requiring unrelated existing capabilities to consume its dependencies transitively through `foundation`.

Verification: Review at least one representative future-capability design against the dependency model or demonstrate the condition when the next independent capability is introduced.
Traceability: ARCH-QUAL-001.
