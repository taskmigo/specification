# 5. Data and Information Requirements

## 5.1 Architectural Identities

### ARCH-DATA-001 — Stable physical identifiers

Physical project identifiers SHALL match [current Gradle settings](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/settings.gradle.kts), including `:modules:authorization`, `:modules:ticket`, `:modules:audit`, and the three `:modules:internal:*` projects. `:modules:access-control` is not an implemented Gradle project.

### ARCH-DATA-002 — Contract ownership

A public contract SHALL have one owner. Public APIs may expose types from another module only through that module's deliberately published interface.

### ARCH-DATA-003 — Aggregate ownership

An aggregate SHALL be persisted and mutated by its owner. Shared infrastructure SHALL NOT become a second aggregate owner.

## 5.2 Dependency Metadata

### ARCH-DATA-004 — Explicit Gradle dependencies

Every Java project dependency SHALL be declared in the owning Gradle project. `api` SHALL be used only when intentionally exported types are part of a public compile contract; implementation details SHALL use `implementation` or `runtimeOnly` as appropriate.

### ARCH-DATA-005 — Named interface metadata

Spring Modulith named interfaces and `allowedDependencies` SHALL express legitimate consumer relationships. Private packages SHALL not be published merely to satisfy a convenience import.

## 5.3 Database Lifecycle

Database schema changes for major application version 1 SHALL reside in `V1__schema.sql`, not separate feature-specific Flyway migration versions. Database resources SHALL be supplied at runtime to executable apps.
