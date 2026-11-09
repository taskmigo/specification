# 7. Constraints

## 7.1 Shared and Internal Libraries

### ARCH-CON-001 — Foundation dependency floor

Foundation Core SHALL NOT depend on a higher-level Taskmigo business module.

### ARCH-CON-002 — No business semantics in Foundation

Foundation SHALL NOT contain User, Role, Statement, Ticket, EAV domain models, or context-owned repositories.

### ARCH-CON-003 — Shared dependencies

Third-party libraries MAY be exported by Foundation only where deliberately shared as part of its published technical contract.

### ARCH-CON-004 — Language isolation

Internal Language SHALL NOT depend on Query, Authorization, Identity, Ticket, Web, Worker, or Migration.

### ARCH-CON-005 — Query independence

Query SHALL NOT depend on Authorization, Identity, Ticket, or executable applications.

### ARCH-CON-006 — Authorization independence

Authorization SHALL NOT depend on Identity or Ticket internals. Its publicly exposed policy/predicate model MAY depend on Query contracts.

### ARCH-CON-007 — Resource-owned persistence

A resource module SHALL NOT delegate its domain-specific persistence mapping or authorization/query schema ownership to Database or generic JPA Query.

## 7.2 Executables and Module Integrity

### ARCH-CON-008 — Web transport boundary

Reusable modules SHALL NOT import Spring MVC controllers or web-specific response types.

### ARCH-CON-009 — Application dependency leaves

Reusable modules SHALL NOT depend on Web, Worker, or Migration. Those executables SHALL NOT directly depend on `modules/internal`.

### ARCH-CON-010 — Spring Modulith enforcement

Spring Modulith verification SHALL detect logical module cycles, private package imports and disallowed dependency relations.

### ARCH-CON-011 — Published dependency contracts

A consumer SHALL use only named interfaces it requires; an explicitly internal capability SHALL NOT be exposed through an app dependency merely for compilation.

### ARCH-CON-012 — ArchUnit checks

ArchUnit SHALL enforce package-level Onion and implementation boundaries not represented by Gradle and Spring Modulith.

## 7.3 Tactical Direction

### ARCH-CON-013 — Onion dependency direction

Domain SHALL NOT depend on application, Spring, JPA, persistence, configuration or executable apps. Application implementations MAY use Spring declarative transaction annotations but SHALL NOT import Spring Data/JPA/persistence implementations, configuration, MVC, or security adapters. Persistence/configuration SHALL depend inward. No universal `port.in`/`port.out` folder convention SHALL be required.

### ARCH-CON-014 — Persistence isolation

Contexts SHALL NOT navigate, read, or modify another context's private database tables or ORM mappings as a business interface.

### ARCH-CON-015 — Cross-context integration contracts

Synchronous calls SHALL use provider-owned public contracts, and event integration SHALL use published event models instead of private mutable aggregates.
