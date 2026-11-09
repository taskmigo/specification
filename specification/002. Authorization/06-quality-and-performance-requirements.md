# 6. Quality and Performance Requirements

## 6.1 Security

### SEC-001 — Default-deny safety

Request Authorization SHALL deny absent allow, invalid/failed policy execution, missing principal status or failed snapshot resolution.

### SEC-002 — Field allowlisting

Object Authorization SHALL never expose arbitrary persistence columns/JPA properties from policy source. Only registered operation-scoped Query Schema fields and operators SHALL be bindable.

### SEC-003 — Deny precedence

Matching DENY rules SHALL prevail over ALLOW for both Request and Object Authorization even with multiple inherited effective Statements.

## 6.2 Performance

### PERF-001 — Bounded target matching

API target regex SHALL use the bounded safe subset enforced by StatementTargetPathMatcher; unsupported regex constructs and oversized expressions SHALL be rejected.

### PERF-002 — Database-side filtering

Object restrictions SHALL be executed in database queries before pagination, avoiding unrestricted JVM filtering. No unmeasured statement cache hit-rate or throughput target is asserted.

## 6.3 Consistency

### QUAL-001 — Fresh effective state

A new authorization operation SHALL resolve authoritative persisted grants; its immutable snapshot SHALL remain internally consistent throughout that operation.

### QUAL-002 — Transaction isolation

Effective Statement retrieval SHALL use read-only `REQUIRES_NEW` with `REPEATABLE_READ` isolation to obtain an operation's authoritative rule set.
