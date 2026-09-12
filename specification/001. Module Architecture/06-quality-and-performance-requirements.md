# 6. Quality and Performance Requirements

## 6.1 Maintainability

### ARCH-QUAL-001 — Independent capability evolution

A capability module SHALL be evolvable without requiring unrelated capability modules to accept that capability's semantics, public contracts, runtime libraries, or build-tool dependencies through `foundation`.

Repository-wide build conventions MAY apply cross-cutting compile-time and verification tools without transferring feature ownership or creating Taskmigo project-module dependencies.

Verification: Inspect project and third-party dependencies and confirm shared build tooling is delivered by build conventions while feature/runtime dependencies remain owned by the module that uses them.
Traceability: [Foundation role](04-functional-and-behavioral-requirements.md#arch-mod-001--foundation-role); [Build convention ownership](04-functional-and-behavioral-requirements.md#arch-mod-012--build-convention-ownership).

### ARCH-QUAL-002 — Third-party dependency discipline

A third-party dependency required by feature or runtime behavior SHALL remain scoped to the owning capability, resource, adapter, infrastructure module, or application. A third-party dependency used only to compile, analyze, format, lint, or verify code across multiple projects SHALL be supplied through build conventions rather than re-exported from a runtime project.

Verification: Inspect dependency declarations and resolved classpaths and confirm build-only tools are absent from production runtime classpaths unless independently required by owned runtime behavior.
Traceability: ARCH-MOD-013; [Dependency scope discipline](07-constraints.md#arch-con-014--dependency-scope-discipline).

### ARCH-QUAL-005 — Build-file signal-to-noise

A normal Taskmigo module build file SHOULD primarily communicate the module type and intentional behavior dependencies. Project-wide Java version, nullness, static-analysis, formatting, style, and shared architecture-test configuration SHOULD NOT require repeated declarations in each module.

Verification: Inspect representative `foundation`, capability, resource, adapter, and application build files and confirm common build configuration is inherited from the convention layer.
Traceability: ARCH-MOD-012; [Build Conventions and Tooling Baseline](12-build-conventions-and-tooling-baseline.md).

## 6.2 Testability

### ARCH-QUAL-003 — Module-boundary verification

The automated architecture test suite SHALL detect prohibited dependencies defined by this specification before a change is accepted. [Spring Modulith](https://docs.spring.io/spring-modulith/reference/) SHALL provide the primary logical module verification, and [ArchUnit](https://www.archunit.org/getting-started) SHALL provide supplemental package-boundary linting where required by [ARCH-CON-012](07-constraints.md#arch-con-012--archunit-package-boundary-linting).

Verification: Introduce representative prohibited module and package dependencies in isolated verification scenarios and confirm the applicable architecture test fails.
Traceability: [Prohibited Dependencies](08-requirements-allocation-and-dependencies.md#83-prohibited-dependencies); [Architecture acceptance](09-verification-validation-and-acceptance.md#92-acceptance-conditions).

## 6.3 Portability

### ARCH-QUAL-004 — Foundation runtime neutrality

Consuming feature-neutral `foundation` contracts SHALL NOT require initialization of a dependency-injection container, HTTP runtime, persistence runtime, parser runtime, executable application runtime, or build-time analysis tool.

Verification: Exercise representative feature-neutral `foundation` contracts without starting application frameworks and inspect the runtime classpath to confirm build-only tooling is absent.
Traceability: [Foundation contract neutrality](03-external-interface-requirements.md#arch-if-001--foundation-contract-neutrality).

## 6.4 Performance

This architecture specification introduces no independent runtime latency or throughput target. Feature-specific performance requirements SHALL remain in the specification that owns the behavior being measured.
