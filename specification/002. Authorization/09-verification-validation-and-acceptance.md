# 9. Verification, Validation, and Acceptance Evidence

## 9.1 Verification and Conformance Matrix

| Requirement IDs           | Verification objective                                                                                                                                           |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| STMT-001–STMT-007         | Inspect and test the canonical Statement schema, direct Policy Language body contract, boolean result, effect, target matching, and removal of legacy execution. |
| INPUT-001–INPUT-003       | Test policy-root shape, path variables, principal identity, Request-only inputs, rejection of object/resource usage, and symbolic Object fields.                 |
| SNAPSHOT-001–SNAPSHOT-004 | Instrument one operation and sequential operations to verify one immutable snapshot, coherent creation, freshness, and disposal.                                 |
| RES-001–RES-003           | Test rejection of resource roots/call syntax and confirm Request Authorization performs no business-resource or adapter resolution.                              |
| POLICY-001–POLICY-005     | Inspect the Policy Language/Policy IR boundary and test static validation, scope schemas, state-keyed reuse, and constant folding.                               |
| REQ-001–REQ-003           | Test default deny, deny-overrides, Request input boundaries, failure behavior, and constant-true deny short-circuiting.                                          |
| OBJ-001–OBJ-005           | Test Policy Language partial evaluation, Filter Schema queryability, Filter AST independence/algebra, database-before-pagination execution, and composition.     |
| PERF-001–PERF-005         | Instrument graph resolution, query counts, cross-operation freshness, cache-independence, and the approximately 500-Statement stress case.                       |
| TECH-001–TECH-004         | Review selected patterns and policy isolation, then inject invalid or unsafe inputs to verify fail-closed behavior.                                              |

The verification objectives above are acceptance conditions for the corresponding normative requirements.

Policy Language-specific parser, type, control-flow, evaluation, partial-evaluation, queryability, diagnostic, and ANTLR frontend evidence SHALL additionally satisfy the [Policy Language verification matrix](../003.%20Policy%20Language/09-verification-validation-and-acceptance.md#91-verification-and-conformance-matrix).

The repository currently contains the specification and Markdown quality gate; implementation test evidence is produced by the system repository when these requirements are realized.
