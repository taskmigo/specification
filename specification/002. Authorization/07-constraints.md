# 7. Constraints

## 7.1 Boundary Discipline

### TECH-001 — Explicit constant predicate semantics

Authorization SHALL represent constant policy and predicate outcomes through normal authorization contracts and SHALL NOT require callers or persistence binders to interpret `null`, sentinel values, or implementation-specific node types as constant `true` or `false`.

`ObjectAuthorizationPredicate<Q>` constant-state behavior exposed by AUTH-API-004 SHALL remain valid through predicate composition and persistence binding.

Verification: Exercise constant-true and constant-false Object Authorization results through composition and persistence binding without relying on sentinel/null conventions.
Traceability: AUTH-API-004; OBJ-005.

### TECH-002 — Integration boundary discipline

Core Authorization SHALL remain independent of transport-specific and persistence-specific implementation types. Spring Security/web adaptation SHALL remain behind the web adapter boundary, Object target applicability SHALL cross the framework-neutral resolver contract, and persistence translation SHALL remain resource-owned.

Authorization public interfaces SHALL NOT expose Semantic AST or persistence query structures. Internal class decomposition and design-pattern choices are non-normative provided these boundaries and observable contracts are preserved.

Verification: Review public and module boundaries, confirm Object target applicability uses the framework-neutral resolver contract, and confirm no Spring MVC, JPA, Semantic AST, or persistence-query implementation type leaks through core Authorization interfaces.
Traceability: AUTH-API-003 through AUTH-API-006; OBJ-003; TARGET-001; TARGET-002; ARCH-MOD-005; ARCH-MOD-008.

## 7.2 Security and Isolation

### TECH-003 — Authorization policy isolation

Policy source is untrusted compiler input. Authorization SHALL satisfy Language isolation constraints and SHALL NOT expose repositories, Spring/ApplicationContext objects, JPA entities, filesystems, networks, processes, reflection, arbitrary host objects, or privileged call surfaces through the policy Environment Schema.

Canonical bounded Language intrinsics MAY be enabled but SHALL NOT dispatch to arbitrary host behavior.

Verification: Attempt forbidden host/resource access from direct and restricted-lambda policy expressions.
Traceability: [Language isolation](../003.%20Language/07-constraints.md#74-isolation-and-host-access); RES-002.

## 7.3 Fail-Closed Behavior

### TECH-004 — Fail-closed authorization

Policy parse/profile/binding/control-flow/type/complexity/scope/queryability errors SHALL prevent activation where validation is required. Runtime authorization failures SHALL not grant access.

Persistence translation failure for an Object Authorization Predicate SHALL fail closed and SHALL NOT fall back to unrestricted row retrieval.

Verification: Trigger activation, runtime, and persistence-translation authorization failures.
Traceability: STMT-004; REQ-001; OBJ-004.
