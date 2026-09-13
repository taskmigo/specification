# 7. Constraints

## 7.1 Boundary Discipline

### TECH-001 — Explicit constant predicate semantics

Authorization SHALL represent constant policy and predicate outcomes through normal authorization contracts and SHALL NOT require callers or persistence binders to interpret `null`, sentinel values, or implementation-specific node types as constant `true` or `false`.

`ObjectAuthorizationPredicate<Q>` constant-state behavior exposed by AUTH-API-004 SHALL remain valid through predicate composition and persistence binding.

Verification: Exercise constant-true and constant-false Object Authorization results through composition and persistence binding without relying on sentinel/null conventions.
Traceability: AUTH-API-004; OBJ-005.

### TECH-002 — Integration boundary discipline

Core Authorization SHALL remain independent of transport-specific and persistence-specific implementation types. Spring Security/web adaptation and Authorization Log HTTP retrieval SHALL remain behind the web adapter boundary, and persistence translation SHALL remain resource-owned.

Authorization public interfaces SHALL NOT expose Semantic AST or persistence query structures. Internal class decomposition and design-pattern choices are non-normative provided these boundaries and observable contracts are preserved.

Verification: Review public and module boundaries and confirm no Spring MVC, JPA, Semantic AST, or persistence-query implementation type leaks through core Authorization interfaces.
Traceability: AUTH-API-003 through AUTH-API-006; LOG-API-001; OBJ-003; ARCH-MOD-005; ARCH-MOD-008.

## 7.2 Security and Isolation

### TECH-003 — Authorization policy isolation

Policy source is untrusted compiler input. Authorization SHALL satisfy Language isolation constraints and SHALL NOT expose repositories, Spring/ApplicationContext objects, JPA entities, filesystems, networks, processes, reflection, arbitrary host objects, Authorization Logs, or privileged call surfaces through the policy Environment Schema.

Canonical bounded Language intrinsics MAY be enabled but SHALL NOT dispatch to arbitrary host behavior.

Verification: Attempt forbidden host/resource/log access from direct and restricted-lambda policy expressions.
Traceability: [Language isolation](../003.%20Language/07-constraints.md#74-isolation-and-host-access); RES-002; LOG-DATA-001.

## 7.3 Fail-Closed Behavior

### TECH-004 — Fail-closed authorization

Runtime target-processing, policy parse/profile/binding/control-flow/type/complexity/scope, evaluation/partial-evaluation, and Object queryability failures SHALL NOT grant access.

Persistence translation failure for an Object Authorization Predicate SHALL fail closed and SHALL NOT fall back to unrestricted row retrieval.

Authorization execution failures covered by LOG-003 SHALL be distinguished from ordinary denied decisions in Authorization Logs.

Verification: Trigger runtime authorization and persistence-translation failures and verify no access is granted; inspect Authorization Log classification for failures covered by LOG-003.
Traceability: STMT-003; STMT-004; REQ-001; OBJ-004; LOG-003.

### TECH-005 — Authorization logging isolation

Authorization Log persistence SHALL remain outside policy-visible inputs and SHALL satisfy the outcome-isolation behavior defined by LOG-005.

Verification: Inspect policy roots and inject Authorization Log persistence failures during authorization.
Traceability: LOG-005; TECH-003.
