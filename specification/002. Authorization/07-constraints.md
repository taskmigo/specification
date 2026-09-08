# 7. Constraints

## 7.1 Pattern Discipline

### TECH-001 — Constant identity behavior

Internal authorization abstractions SHOULD use constant/identity objects where they remove sentinel branching without changing the external Statement contract.

Verification: Inspect constant policy/predicate implementations.
Traceability: OBJ-005.

### TECH-002 — Integration pattern discipline

Authorization SHOULD use framework patterns only where they reduce coupling. Relevant patterns include Strategy for Request/Object evaluation, Composite for Object predicate composition, Adapter for Spring Security/web boundaries, and Registry through Spring-managed Object Authorization Schemas.

A pattern SHALL NOT expose Semantic AST or persistence query structures through public authorization interfaces.

Verification: Review public/internal boundaries for unnecessary pattern-only abstractions.
Traceability: AUTH-API-003 through AUTH-API-006; OBJ-003.

## 7.2 Security and Isolation

### TECH-003 — Authorization policy isolation

Policy source is untrusted compiler input. Authorization SHALL satisfy Embedded Language isolation constraints and SHALL NOT expose repositories, Spring/ApplicationContext objects, JPA entities, filesystems, networks, processes, reflection, arbitrary host objects, or privileged call surfaces through the policy Environment Schema.

Canonical bounded Embedded Language intrinsics MAY be enabled but SHALL NOT dispatch to arbitrary host behavior.

Verification: Attempt forbidden host/resource access from direct and restricted-lambda policy expressions.
Traceability: [Embedded Language isolation](../003.%20Embedded%20Language/07-constraints.md#74-isolation-and-host-access); RES-002.

## 7.3 Fail-Closed Behavior

### TECH-004 — Fail-closed authorization

Policy parse/profile/binding/control-flow/type/complexity/scope/queryability errors SHALL prevent activation where validation is required. Runtime authorization failures SHALL not grant access.

Persistence translation failure for an Object Authorization Predicate SHALL fail closed and SHALL NOT fall back to unrestricted row retrieval.

Verification: Trigger activation, runtime, and persistence-translation authorization failures.
Traceability: STMT-004; REQ-001; OBJ-004.
