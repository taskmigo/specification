# 6. Quality and Performance Requirements

## 6.1 Security

Security requirements are specified by [security and failure constraints](07-constraints.md#73-security-and-failure-constraints), [Statement validation](03-external-interface-requirements.md#31-statement-contract), [Request input boundary](03-external-interface-requirements.md#32-authorization-inputs-and-operation-snapshot), [policy compilation](04-functional-and-behavioral-requirements.md#41-ecmascript-policy-compilation), and [request authorization](04-functional-and-behavioral-requirements.md#42-request-authorization).

## 6.2 Consistency

Consistency requirements are specified by [operation snapshot](03-external-interface-requirements.md#32-authorization-inputs-and-operation-snapshot) and [performance/source-of-truth requirements](06-quality-and-performance-requirements.md#63-performance-requirements).

## 6.3 Performance Requirements

### PERF-001 — DB-first resolution

Runtime authorization SHALL NOT load all Groups or all Roles and SHALL NOT build the authorization hierarchy graph in JVM memory.

Direct and inherited User/Group/Role/Statement semantics present on `next` SHALL be preserved.

Verification: Inspect authorization queries and instrument a graph-resolution scenario to confirm only relevant database state is loaded and no complete in-memory hierarchy is built; verify direct and inherited assignments preserve baseline semantics.
Traceability: [Product Perspective](02-overall-description.md#21-product-perspective-and-baseline) baseline inheritance/assignment semantics; [Resolution and Operation Snapshot](02-overall-description.md#221-resolution-and-operation-snapshot).

### PERF-002 — Bounded query behavior

Authorization-state resolution SHALL:

- use a bounded number of database round trips;
- avoid N+1 behavior;
- avoid loading unrelated authorization graph nodes;
- deduplicate effective authorization state;
- avoid repeating the same effective-state resolution for Request and Object Authorization in one operation.

Unrelated growth in the authorization graph SHALL NOT increase the number of database round trips for one authorization operation.

Verification: Compare query counts for equivalent principals while adding unrelated Groups, Roles, and Statements; confirm bounded round trips and no N+1 access.
Traceability: [Resolution and Operation Snapshot](02-overall-description.md#221-resolution-and-operation-snapshot); PERF-001.

### PERF-003 — Stress case

The authorization system SHALL support a principal with approximately 500 effective Statements targeting the same API, including a case where no early constant result can terminate evaluation. This behavior SHALL use bounded database round trips and SHALL exercise target matching plus policy evaluation/partial evaluation.

Verification: Run the approximately 500-Statement stress scenario with query-count instrumentation and verify target matching plus request evaluation and object partial evaluation.
Traceability: [Resolution and Operation Snapshot](02-overall-description.md#221-resolution-and-operation-snapshot); PERF-002.

### PERF-004 — Database source of truth on every operation

Every request/authorization operation SHALL perform database resolution of the relevant effective Statements required for that operation.

The authorization system SHALL NOT maintain or consult a cross-request in-memory or distributed cache containing:

```text
Statement records
Statement policy source as authoritative state
effective Statement ids/sets
principal -> Statement resolution results
Authorization Snapshots
```

A request-scoped snapshot or request-scoped materialization of the Statements just read from the database is allowed and SHALL be discarded with the operation.

Verification: Inspect authorization state access and run two sequential operations after a committed policy change, confirming each performs the required database resolution and no cross-request state is consulted.
Traceability: [Scope](01-introduction.md#12-scope) database source-of-truth semantics; SNAPSHOT-001.

### PERF-005 — No distributed-cache correctness dependency

Authorization correctness SHALL depend on the database state read for the current operation, not on cache invalidation.

After a Statement, assignment, Role, or Group authorization change is committed, the next operation SHALL observe that change through its database resolution without requiring:

```text
cache eviction
cache TTL expiry
pub/sub invalidation
cross-instance cache synchronization
```

Verification: Repeat the committed-change freshness test with cache invalidation, TTL, pub/sub, and cross-instance synchronization unavailable; the next operation SHALL still observe the database state.
Traceability: [Integration and Consistency](02-overall-description.md#225-integration-and-consistency); SNAPSHOT-002.

## 6.4 Other Quality Attributes

Reliability, availability, usability, maintainability, portability, and safety are Not applicable to this authorization capability because no measurable criteria for them are defined by the source contract.
