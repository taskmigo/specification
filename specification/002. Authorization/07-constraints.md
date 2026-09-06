# 7. Constraints

## 7.1 Null Object Pattern

### TECH-001 — Null Object usage

Internal authorization abstractions SHOULD use the Null Object Pattern where it removes sentinel/null branching while preserving the normal interface.

Examples include constant compiled policies and Filter AST identity/zero objects such as `ALL` and `NONE`.

This SHALL NOT alter the external Statement contract: `policy` is always required and valid.

Verification: Inspect constant-policy and Filter AST identity/zero implementations and confirm the external Statement validation remains unchanged.
Traceability: [Shared Object Filter](02-overall-description.md#222-shared-object-filter); [Policy Language Contract](02-overall-description.md#223-policy-language-contract).

## 7.2 Design Patterns

### TECH-002 — Pattern discipline

The authorization architecture SHOULD apply established design patterns when they materially reduce coupling, branching, duplication, or persistence/runtime leakage. Patterns SHALL simplify the design and SHALL NOT create abstractions solely to satisfy a pattern checklist.

Preferred applications include:

| Concern                                              | Preferred pattern |
| ---------------------------------------------------- | ----------------- |
| Constant/identity authorization behavior             | Null Object       |
| Request evaluation vs Object partial evaluation      | Strategy          |
| Policy IR and Filter AST boolean trees               | Composite         |
| Persistence-specific translation boundaries          | Adapter           |
| Database authorization predicates                    | Specification     |
| Filter Schemas selected by registered type or target | Registry          |

Equivalent patterns or simpler designs are acceptable where they better fit the architecture. The authorization architecture SHOULD make its intent clear when a non-obvious pattern is introduced.

Verification: Review the relevant architecture and confirm each selected pattern reduces a stated boundary or behavior concern without pattern-only abstractions.
Traceability: [Product Functions](02-overall-description.md#22-product-functions).

## 7.3 Security and Failure Constraints

### TECH-003 — Authorization policy isolation

Policy source is untrusted compiler input.

The Authorization consumer SHALL satisfy the [TPL isolation and compiler constraints](../003.%20Policy%20Language/07-constraints.md).

The authorization Environment Schema and intrinsic registry SHALL NOT expose repositories, Spring/ApplicationContext objects, JPA entities, filesystem/network/process access, reflection, arbitrary Java objects, or host methods.

Verification: Inspect the Authorization TPL Environment Schema/intrinsic registry and execute policies attempting forbidden host access and complexity-limit exhaustion; confirm rejection or isolation.
Traceability: [Policy Language Contract](02-overall-description.md#223-policy-language-contract); POLICY-001 through POLICY-003.

## 7.4 Fail-Closed Behavior

### TECH-004 — Fail-closed authorization

Policy parse, binding, type, complexity, scope, intrinsic, or queryability errors SHALL prevent activation.

Runtime authorization failures SHALL not grant access.

Verification: Inject compile-time and runtime authorization failures and confirm the resulting decision is denial and invalid Statements cannot activate.
Traceability: [Scope](01-introduction.md#12-scope); STMT-004; REQ-001.
