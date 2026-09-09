# 6. Quality and Performance Requirements

## 6.1 Maintainability

### ARCH-QUAL-001 — Independent capability evolution

A capability module SHALL be evolvable without requiring unrelated capability modules to accept that capability's framework or semantic dependencies through `foundation`.

Verification: Inspect transitive dependencies from `foundation` and confirm that adding or changing one capability does not make unrelated capabilities depend transitively on it.
Traceability: [Foundation role](04-functional-and-behavioral-requirements.md#arch-mod-001--foundation-role); [Foundation dependency floor](07-constraints.md#arch-con-001--foundation-dependency-floor).

### ARCH-QUAL-002 — Dependency isolation

Capability-specific third-party dependencies SHALL remain scoped to the owning capability or adapter unless a separate architectural requirement establishes them as project-wide foundation dependencies.

Verification: Inspect dependency declarations and confirm capability-specific frameworks and libraries are not exported transitively through `foundation`.
Traceability: ARCH-QUAL-001; [Framework isolation](07-constraints.md#arch-con-003--framework-isolation).

## 6.2 Testability

### ARCH-QUAL-003 — Module-boundary verification

The build or architecture test suite SHALL be capable of detecting prohibited dependencies defined by this specification before a change is accepted.

Verification: Introduce representative prohibited dependencies in an isolated verification scenario and confirm architecture verification fails.
Traceability: [Prohibited Dependencies](08-requirements-allocation-and-dependencies.md#83-prohibited-dependencies); [Architecture acceptance](09-verification-validation-and-acceptance.md#92-acceptance-conditions).

## 6.3 Portability

### ARCH-QUAL-004 — Foundation framework portability

Use of `foundation` contracts SHALL NOT require initialization of a dependency-injection container, HTTP runtime, persistence runtime, parser runtime, or application runtime.

Verification: Compile and exercise representative `foundation` contracts in a plain JVM test without framework bootstrapping.
Traceability: [Foundation contract neutrality](03-external-interface-requirements.md#arch-if-001--foundation-contract-neutrality).

## 6.4 Performance

This architecture specification introduces no independent runtime latency or throughput target. Feature-specific performance requirements SHALL remain in the specification that owns the behavior being measured.
