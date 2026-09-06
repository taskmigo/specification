# 9. Verification, Validation, and Acceptance Evidence

## 9.1 Verification and Conformance Matrix

| Requirement IDs         | Verification objective                                                                                                                           |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| SYNTAX-001–SYNTAX-004   | Parse the direct policy-body syntax, JavaScript-like delimiters/operators/literals, and reject export/function/arrow/call/member-method syntax.  |
| ENV-001–ENV-003         | Compile against explicit Environment Schemas, verify consumer-defined root namespaces, and inspect compiled-policy/diagnostic interfaces.        |
| EVAL-IF-001–EVAL-IF-002 | Validate typed runtime inputs and direct/residual result forms without coercion.                                                                 |
| LANG-001–LANG-004       | Inspect language-owned Policy IR and test complete boolean returns, immutable `const` bindings, conditional semantics, and early return.         |
| TYPE-001–TYPE-004       | Test strict types, boolean/equality, arithmetic/ordering, null, lists, and membership semantics.                                                 |
| REF-001                 | Test static path resolution and reject dynamic paths, method calls, and call expressions.                                                        |
| EVAL-001–EVAL-002       | Test known-input evaluation, branch/short-circuit/return behavior, and deterministic repeated results.                                           |
| PARTIAL-001–PARTIAL-004 | Test unknown preservation, simplification, residual boolean typing, and dependency metadata.                                                     |
| QUERY-001–QUERY-003     | Validate residual queryability under consumer-provided capability contracts, callable exclusion, and persistence independence.                   |
| DATA-001–DATA-004       | Inspect immutable values, schema/artifact identity, source fingerprints, and source-location metadata.                                           |
| QUAL-001–QUAL-003       | Verify deterministic semantics, guaranteed termination from the non-callable bounded language, and parser-independent core dependency direction. |
| PERF-001–PERF-003       | Exercise compiler limits, dependency-aware specialization, and exact compiled-artifact reuse.                                                    |
| DIAG-001                | Trigger every required diagnostic category and verify source location where applicable.                                                          |
| TECH-001–TECH-005       | Verify ANTLR Java frontend use, language exclusions, strict non-ECMAScript semantics, host isolation, and fail-closed complexity-limit handling. |

The verification objectives above are acceptance conditions for the corresponding normative requirements. Implementation test evidence is produced by the system repository when these requirements are realized.

## 9.2 Consumer Contract Acceptance

A conforming consumer integration SHALL demonstrate both applicable execution forms without requiring the Policy Language to know the consumer's domain semantics:

1. Direct evaluation SHALL succeed for a valid policy when all required Environment Schema roots are supplied as known values.
2. Partial evaluation SHALL preserve a typed residual predicate when one or more required roots are supplied as unknown values.
3. When query lowering is requested, compilation SHALL accept residual operations supported by the supplied capability contract and SHALL reject unsupported residual operations with `QueryabilityError`.

Verification evidence SHALL use at least two different Environment Schemas with different root names to confirm that Policy Language behavior depends on schema contracts rather than hard-coded domain names.
