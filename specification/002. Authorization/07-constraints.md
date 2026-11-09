# 7. Constraints

## 7.1 Language and Query

### TECH-001 — Scope-specific compiler mode

Request compilation mode SHALL be PROGRAM; Object compilation mode SHALL be EXPRESSION. The generic Language module's full grammar SHALL NOT automatically be enabled for either scope.

### TECH-002 — No raw persistence access

Policy source SHALL never receive repositories, EntityManager, JPA Criteria, SQL fragments, servlet objects, or arbitrary runtime beans as evaluation inputs.

### TECH-003 — Trusted Object binding

Symbolic Object expressions SHALL be checked against a registered operation Query Schema and bound only by a resource-owned trusted persistence adapter.

### TECH-004 — Fail-closed evaluation

Compilation, evaluation, partial evaluation, target matching and incompatible schema context errors SHALL result in denial or a failed authorized query rather than a permissive fallback.

## 7.2 External API

### TECH-005 — No Authorization Log promise

The presence of Entity Audit SHALL NOT be construed as a separately queryable Authorization decision history. The former authorization-log endpoint and decision-log retention contracts are withdrawn.

### TECH-006 — No universal RBAC bypass

A built-in Role such as `system-operator` or `administrator` SHALL gain access only through its effective stored Statements, not an implicit unguarded superuser path.

## 7.3 Published Module Boundary

Authorization SHALL not import private Identity User/Group repositories. Identity SHALL resolve opaque effective subjects through the published integration contract. Authorization MAY use Query and Internal Language/JPA Query as declared Gradle dependencies.
