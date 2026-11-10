# 6. Quality and Performance Requirements

Quality is expressed as **change isolation and mechanically testable constraints**. Feature latency/throughput targets are intentionally left to their respective owners.

## 6.1 Maintainability

### ARCH-QUAL-001 — Independent evolution

**Normative requirement.** A bounded context SHALL be able to evolve its own aggregate and persistence representation without forcing unrelated contexts to depend on its internals.

### ARCH-QUAL-002 — Dependency exposure

**Normative requirement.** Reusable Gradle projects SHALL expose only dependencies intentionally required by their public contract. A module SHALL NOT leak private internal capability types through an executable app's public surface.

### ARCH-QUAL-003 — Persistence isolation

**Normative requirement.** Cross-context integration SHALL remain independent of private tables, JPA associations, schema joins and repository implementations.

## 6.2 Testability

### ARCH-QUAL-004 — Enforceable boundaries

**Normative requirement.** Automated Gradle dependency checks, Spring Modulith verification and ArchUnit SHALL detect forbidden dependency directions and app imports of internal implementation modules.

## 6.3 Framework Neutrality

### ARCH-QUAL-005 — Pure domain behavior

**Normative requirement.** Domain behavior SHALL be exercisable without starting web, Spring dependency-injection, or a persistence runtime. Spring transaction annotations MAY be used on concrete application implementations, not domain types.

## 6.4 Runtime Qualities

Application-specific latency/throughput targets SHALL be specified by their owning feature rather than invented by this architecture SRS.
