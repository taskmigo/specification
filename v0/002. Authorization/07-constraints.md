# 7. Constraints

## 7.1 Null Object Pattern

Internal authorization abstractions SHOULD use the Null Object Pattern where it removes sentinel/null branching while preserving the normal interface.

Examples include constant compiled policies and Filter AST identity/zero objects such as `ALL` and `NONE`.

This SHALL NOT alter the external Statement contract: `policy` is always required and valid.

Verification: Inspect constant-policy and Filter AST identity/zero implementations and confirm the external Statement validation remains unchanged.
Traceability: [Shared Object Filter](02-overall-description.md#222-shared-object-filter); [ECMAScript Policy Contract](02-overall-description.md#223-ecmascript-policy-contract).

## 7.2 Design Patterns

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

Policy source is untrusted compiler input.

The supported policy environment SHALL NOT expose repositories, Spring/ApplicationContext objects, JPA entities, filesystem/network/process access, reflection, or arbitrary host APIs.

Source size, AST depth/node count, and other compiler complexity SHALL be bounded.

Verification: Inspect the policy compiler environment and execute policies attempting forbidden host access and complexity-limit exhaustion; confirm rejection or isolation.
Traceability: [ECMAScript Policy Contract](02-overall-description.md#223-ecmascript-policy-contract); POLICY-001 through POLICY-003.

## 7.4 Fail-Closed Behavior

Policy parse/validation errors SHALL prevent activation.

Runtime authorization failures, including non-boolean policy results, SHALL not grant access.

Verification: Inject compile-time and runtime authorization failures and confirm the resulting decision is denial and invalid Statements cannot activate.
Traceability: [Scope](01-introduction.md#12-scope); STMT-004; REQ-001.
