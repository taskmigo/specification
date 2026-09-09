# 6. Quality and Performance Requirements

## 6.1 Security

Authorization security behavior is defined by [policy isolation](07-constraints.md#72-security-and-isolation), [Statement validation](03-external-interface-requirements.md#31-statement-contract), [Request input boundaries](03-external-interface-requirements.md#32-authorization-inputs-and-operation-snapshot), and [fail-closed behavior](07-constraints.md#73-fail-closed-behavior).

The Language compiler/evaluator boundary SHALL additionally satisfy the [Language constraints](../003.%20Language/07-constraints.md).

## 6.2 Consistency

Operation state consistency SHALL satisfy SNAPSHOT-001 through SNAPSHOT-004.

## 6.3 Performance Requirements

### PERF-001 — DB-first resolution

Runtime authorization SHALL NOT load all Groups or all Roles and SHALL NOT build the complete authorization hierarchy graph in JVM memory.

Direct and inherited User/Group/Role/Statement semantics SHALL be preserved.

Verification: Instrument authorization-state resolution and confirm only relevant database state is loaded while direct and inherited assignments remain effective.
Traceability: [Resolution and Operation Context](02-overall-description.md#221-resolution-and-operation-context).

### PERF-002 — Bounded query behavior

Authorization-state resolution SHALL:

- Use a bounded number of database round trips.
- Avoid N+1 behavior.
- Avoid loading unrelated authorization graph nodes.
- Deduplicate effective authorization state.
- Avoid repeating the same effective-state resolution for Request and Object Authorization in one operation.

Unrelated authorization-graph growth SHALL NOT increase the number of database round trips for one equivalent authorization operation.

Verification: Compare query counts for equivalent principals while adding unrelated Groups, Roles, and Statements.
Traceability: PERF-001; SNAPSHOT-001.

### PERF-003 — Stress case

The authorization system SHALL support a principal with approximately 500 effective Statements targeting the same API, including a case where no early constant result can terminate evaluation.

The scenario SHALL use bounded database round trips and SHALL exercise target matching plus Language evaluation/partial evaluation.

Verification: Run the approximately 500-Statement scenario with query-count instrumentation.
Traceability: [Language partial-evaluation performance](../003.%20Language/06-quality-and-performance-requirements.md#perf-002--dependency-aware-partial-evaluation); PERF-002.

### PERF-004 — Database source of truth on every operation

Every authorization operation SHALL resolve the relevant effective Statements from the database.

The authorization system SHALL NOT use cross-request Statement, effective-Statement, principal-resolution, or Authorization Snapshot caches as authoritative authorization state.

A derived compiled Language artifact MAY be reused only under POLICY-004 and SHALL NOT substitute for the database Statement lookup.

Verification: Run sequential operations after a committed policy change and confirm each performs required database resolution.
Traceability: SNAPSHOT-001; POLICY-004.

### PERF-005 — No distributed-cache correctness dependency

After a Statement, assignment, Role, or Group authorization change is committed, the next operation SHALL observe that change through database resolution without requiring cache eviction, TTL expiry, pub/sub invalidation, or cross-instance cache synchronization.

Verification: Repeat committed-change freshness tests without cache coordination.
Traceability: SNAPSHOT-002; PERF-004.
