# 4. Functional and Behavioral Requirements

## 4.1 Capability Ownership

### ARCH-MOD-001 — Foundation role

Foundation Core SHALL contain only generic primitives and contracts; Foundation Spring SHALL own generic Spring integration. Neither SHALL acquire bounded-context state or persistence.

### ARCH-MOD-002 — Canonical capability ownership

Every domain invariant, public use case, and persisted aggregate SHALL have a single owning bounded context or supporting capability.

### ARCH-MOD-003 — Language ownership

`:modules:internal:language` SHALL own the source grammar, compilation modes/profiles, semantic typing, evaluation, partial evaluation, and diagnostics; consumer-specific authorization and filtering constraints SHALL remain with the consuming modules.

### ARCH-MOD-004 — Query ownership

`:modules:query` SHALL own operation-scoped query schemas, allowlisted fields/operators, typed opaque predicates, dynamic-field contexts, client `filterBy` compilation, and logical sort requests.

### ARCH-MOD-005 — Authorization ownership

`:modules:authorization` SHALL own Role, Statement, subject grants, Request Authorization and Object Authorization; Identity SHALL NOT redefine Role or Statement lifecycle.

### ARCH-MOD-006 — Resource persistence ownership

Identity, Authorization, and Ticket SHALL own their resource-specific query schemas, aggregates, persistence translations, and repositories. Internal JPA Query SHALL supply only common binding behavior.

### ARCH-MOD-007 — Identity ownership

`:modules:identity` SHALL own User/Group/membership, account status transitions, retention configuration, and User-specific persistence, using published Authorization and Audit integration contracts.

### ARCH-MOD-008 — Web ownership

Web SHALL adapt externally visible HTTP/OAuth/security operations to published application services and SHALL NOT move business invariants into controllers.

### ARCH-MOD-009 — Executable composition

Web, Worker and Migration SHALL remain executable composition roots. Migration MAY use specialized installation and transaction coordination; Worker SHALL own scheduled-job triggering.

## 4.2 Logical Boundaries

### ARCH-MOD-010 — Spring Modulith model

Applicable logical modules SHALL be declared and verified with Spring Modulith; physical Gradle project boundaries SHALL remain independently enforced.

### ARCH-MOD-011 — Published interfaces and allowed dependencies

Cross-module accesses SHALL pass through provider-owned published interfaces and declared `allowedDependencies`; public dependency scope SHALL not be widened to bypass these boundaries.

## 4.3 Tactical DDD

### ARCH-MOD-012 — Domain/application/persistence responsibility

Domain SHALL hold pure business rules without framework dependencies. Concrete application services MAY use `org.springframework.transaction.annotation` for declarative transactions and SHALL NOT depend on concrete persistence or web implementations. Persistence/configuration MAY depend inward to application and domain. Ports and adapters MAY be introduced only where they improve the implementation; they are not universally prescribed.

### ARCH-MOD-013 — Aggregate ownership

Each aggregate SHALL have one owner and state-changing operations SHALL follow that owner's domain/application use cases instead of other contexts' private persistence APIs.

### ARCH-MOD-014 — Cross-context contracts

Cross-context integration SHALL use published provider-owned contracts or events. A consumer SHALL NOT import another context's private domain, application-implementation, or persistence packages.

### ARCH-MOD-015 — Domain event ownership

The context completing a domain transition SHALL own any domain event describing that transition; external consumers SHALL receive only stable published event data.

## 4.4 Transaction Behavior

Ordinary application writes SHALL join/own Spring `REQUIRED` transactions; read-only operations MAY declare `readOnly=true`. Audit append and privacy actions SHALL join an existing business transaction with `MANDATORY`. Specialized consistency boundaries MAY use explicit `REQUIRES_NEW` or isolation; Migration installation SHALL use `SERIALIZABLE` and bounded retries.

Traceability: [Server architecture decision](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/ARCHITECTURE.md).
