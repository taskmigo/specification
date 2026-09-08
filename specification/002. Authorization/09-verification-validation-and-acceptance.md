# 9. Verification, Validation, and Acceptance Evidence

## 9.1 Verification and Conformance Matrix

| Requirement IDs           | Verification objective                                                                                                                                                                                           |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| STMT-001–STMT-007         | Inspect and test the canonical Statement schema, `PROGRAM`-mode Embedded Language policy contract, runtime Boolean decision handling, effect, target matching, and removal of legacy execution.                  |
| INPUT-001–INPUT-003       | Test policy-root shape, path variables, principal identity, Request-only inputs, rejection of object/resource usage, and symbolic Object fields.                                                                 |
| SNAPSHOT-001–SNAPSHOT-004 | Instrument one operation and sequential operations to verify one immutable snapshot, coherent creation, freshness, and disposal.                                                                                 |
| RES-001–RES-003           | Test rejection of resource roots/call syntax and confirm Request Authorization performs no business-resource or adapter resolution.                                                                              |
| POLICY-001–POLICY-005     | Inspect the Embedded Language `PROGRAM`/Compilation Profile boundary and verify policy compilation, Authorization schemas, profile-aware Semantic AST reuse, and constant folding.                               |
| REQ-001–REQ-003           | Test Request Authorization evaluation over Semantic AST, default deny, deny-overrides, Request input boundaries, non-`Bool` runtime failure behavior, and constant-true deny short-circuiting.                   |
| OBJ-001–OBJ-005           | Test Semantic AST partial evaluation, runtime rejection of concrete/residual non-`Bool` results, Authorization-owned queryability, Semantic AST predicate composition, and database-before-pagination execution. |
| PERF-001–PERF-005         | Instrument graph resolution, query counts, cross-operation freshness, cache-independence, and the approximately 500-Statement stress case.                                                                       |
| TECH-001–TECH-004         | Review selected patterns and policy isolation, then inject invalid or unsafe inputs to verify fail-closed behavior without a required second predicate AST.                                                      |

The verification objectives above are acceptance conditions for the corresponding normative requirements.

Authorization verification SHALL include valid non-`Bool` Embedded Language programs for both scopes and confirm:

1. The policies compile in `PROGRAM` mode to Semantic AST and are not rejected before activation solely because of their static result type.
2. Request Authorization evaluates the Semantic AST, raises an authorization runtime exception, and fails closed when evaluation produces a concrete non-`Bool` result.
3. Object Authorization partially evaluates the Semantic AST, raises an authorization runtime exception, and fails closed when partial evaluation produces either a concrete non-`Bool` result or residual non-`Bool` Semantic AST expression.
4. Object queryability validation and persistence-query compilation are not attempted after an invalid Object runtime result is observed.
5. A valid residual `Bool` Semantic AST expression is validated against Filter Schema and compiled directly to the persistence query predicate without requiring Filter AST lowering.
6. Object allow/deny composition remains a typed `Bool` Semantic AST predicate and preserves the complete allow/deny truth table after simplification.

Embedded Language parser, source-mode/profile, Semantic AST, type, control-flow, evaluation, partial-evaluation, diagnostic, and ANTLR frontend evidence SHALL additionally satisfy the [Embedded Language verification matrix](../003.%20Embedded%20Language/09-verification-validation-and-acceptance.md#91-verification-and-conformance-matrix).

The repository currently contains the specification and Markdown quality gate; implementation test evidence is produced by the system repository when these requirements are realized.
