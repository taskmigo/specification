# 2. Overall Description

## 2.1 Architectural Context

Taskmigo's normative server model is **Domain-Driven Design + Onion Architecture + Modular Monolith**. The architecture is not required to adopt Hexagonal Architecture or universal `port.in`/`port.out` package conventions. Implementations MAY use port/adapter terms locally when these improve readability without contradicting dependency direction.

## 2.2 Module Categories

### 2.2.1 Business bounded contexts

- **Authorization (`:modules:authorization`):** Role, Statement, subject grants, Request Authorization, Object Authorization, and policy evaluation. It owns authorization decisions, not User/Group identity.
- **Identity (`:modules:identity`):** User, Group, membership, account lifecycle, application configuration, and identity-owned query/persistence contracts. It consumes published Authorization and Audit contracts.
- **Ticket (`:modules:ticket`):** Ticket, Ticket Type, published template management, dynamic-field-aware query surfaces, and Ticket-owned persistence.

### 2.2.2 Supporting capabilities

- **Query (`:modules:query`):** Operation-scoped logical query metadata and safe filter compiler.
- **Audit (`:modules:audit`):** Synchronous, transactional entity audit append/query/privacy functionality.
- **Language (`:modules:internal:language`):** Pure bounded expression/program compiler used internally.
- **JPA Query (`:modules:internal:jpa-query`):** Generic JPA Criteria binding and database-side sorting.
- **EAV (`:modules:internal:eav`):** Versioned typed schema and instance persistence used by Ticket.

### 2.2.3 Foundation and infrastructure

`:modules:foundation:core` owns domain-neutral primitives. `:modules:foundation:spring` owns reusable Spring integration. `:modules:database` provides runtime database configuration and the major-version Flyway schema; it does not own business aggregates.

## 2.3 Executable Applications

Exactly three production application roots own runtime composition: `apps:web` (REST, OAuth, security), `apps:worker` (retention scheduling), and `apps:migration` (schema migration and managed-resource reconciliation). `apps:openapi-generator` is a tooling project, not an independently deployed business application.

## 2.4 Tactical DDD and Onion Model

Dependencies point inward from persistence/configuration/framework to application to domain. Domain packages do not depend on Spring or JPA. Published application contracts are framework-neutral; concrete application services MAY use Spring `@Transactional` to own their use-case transaction boundaries. Specialized persistence consistency and Migration installation retain explicitly justified transaction mechanisms.

## 2.5 Cross-Context Integration

Consumers use deliberate provider-owned public APIs, named interfaces, or published events rather than private implementation/persistence packages. Spring Modulith verification and ArchUnit enforce complementary architectural restrictions.

## 2.6 Out of Scope

This specification does not impose a particular internal class name, universally mandatory repository-interface layer, REST API shape, or runtime performance target; feature SRSs own their public behavior.
