# 6. Quality and Performance Requirements

## 6.1 Maintainability

### ARCH-QUAL-001 — Independent capability evolution

A capability module SHALL be evolvable without requiring unrelated capability modules to accept that capability's semantics, public contracts, or capability-specific libraries through `foundation`.

Project-wide technical libraries intentionally shared through `foundation` MAY be visible transitively to unrelated modules without transferring feature ownership.

Verification: Inspect transitive dependencies from `foundation` and confirm that shared dependencies are part of the common technical baseline rather than dependencies introduced solely for one capability.
Traceability: [Foundation role](04-functional-and-behavioral-requirements.md#arch-mod-001--foundation-role); [Shared foundation dependencies](07-constraints.md#arch-con-003--shared-foundation-dependencies).

### ARCH-QUAL-002 — Shared dependency discipline

Third-party dependencies intentionally used as a common technical baseline across multiple Taskmigo modules MAY be centralized and re-exported by `foundation`. Capability-specific third-party dependencies SHALL remain scoped to the owning capability or adapter unless an architectural decision establishes them as project-wide dependencies.

Verification: Inspect dependency declarations and consumers and confirm every dependency re-exported by `foundation` is intentionally shared, while capability-specific libraries remain local to their owners.
Traceability: ARCH-QUAL-001; [Shared foundation dependencies](07-constraints.md#arch-con-003--shared-foundation-dependencies).

## 6.2 Testability

### ARCH-QUAL-003 — Module-boundary verification

The automated architecture test suite SHALL detect prohibited dependencies defined by this specification before a change is accepted. [Spring Modulith](https://docs.spring.io/spring-modulith/reference/) SHALL provide the primary logical module verification, and [ArchUnit](https://www.archunit.org/getting-started) SHALL provide supplemental package-boundary linting where required by [ARCH-CON-012](07-constraints.md#arch-con-012--archunit-package-boundary-linting).

Verification: Introduce representative prohibited module and package dependencies in isolated verification scenarios and confirm the applicable architecture test fails.
Traceability: [Prohibited Dependencies](08-requirements-allocation-and-dependencies.md#83-prohibited-dependencies); [Architecture acceptance](09-verification-validation-and-acceptance.md#92-acceptance-conditions).

## 6.3 Portability

### ARCH-QUAL-004 — Foundation runtime neutrality

Consuming feature-neutral `foundation` contracts SHALL NOT require initialization of a dependency-injection container, HTTP runtime, persistence runtime, parser runtime, or executable application runtime merely because `foundation` also distributes shared libraries.

Verification: Exercise representative feature-neutral `foundation` contracts without starting application frameworks and confirm shared dependency distribution does not impose runtime initialization.
Traceability: [Foundation contract neutrality](03-external-interface-requirements.md#arch-if-001--foundation-contract-neutrality).

## 6.4 Performance

This architecture specification introduces no independent runtime latency or throughput target. Feature-specific performance requirements SHALL remain in the specification that owns the behavior being measured.
