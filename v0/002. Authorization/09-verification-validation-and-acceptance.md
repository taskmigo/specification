# 9. Verification, Validation, and Acceptance Evidence

## 9.1 Verification and Conformance Matrix

| Requirement IDs           | Verification objective                                                                                                                                    |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| STMT-001–STMT-007         | Inspect and test the canonical Statement schema, policy entry point, boolean result, effect, target matching, and removal of legacy fields.               |
| INPUT-001–INPUT-002       | Test policy-root shape, path variables, principal identity, named resources, and symbolic object fields.                                                  |
| SNAPSHOT-001–SNAPSHOT-004 | Instrument one operation and sequential operations to verify one immutable snapshot, coherent creation, freshness, and disposal.                          |
| RES-001–RES-003           | Compile scope-specific resource declarations and test deduplication, batching, immutable values, and fail-closed failures.                                |
| POLICY-001–POLICY-005     | Inspect the Policy IR boundary and test syntax support, rejection, complexity limits, state-keyed reuse, and constant folding.                            |
| REQ-001–REQ-002           | Test default deny, deny-overrides, boolean-result validation, failure behavior, and constant-true deny short-circuiting after DB resolution.              |
| OBJ-001–OBJ-005           | Test partial evaluation, Filter Schema validation, Filter AST independence and algebra, database-before-pagination execution, and allow/deny composition. |
| PERF-001–PERF-005         | Instrument graph resolution, query counts, cross-operation freshness, cache-independence, and the approximately 500-Statement stress case.                |
| TECH-001–TECH-004         | Review selected patterns and policy isolation, then inject invalid or unsafe inputs to verify fail-closed behavior.                                       |

The verification objectives above are acceptance conditions for the corresponding normative requirements. The repository currently contains the specification and Markdown quality gate; implementation test evidence is produced by the system repository when these requirements are realized.
