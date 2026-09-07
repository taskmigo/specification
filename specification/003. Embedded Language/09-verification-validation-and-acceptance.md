# 9. Verification, Validation, and Acceptance Evidence

## 9.1 Verification and Conformance Matrix

| Requirement IDs         | Verification objective                                                                                                                           |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| SYNTAX-001–SYNTAX-004   | Parse the direct program syntax, JavaScript-like delimiters/operators/literals, and reject export/function/arrow/call/member-method syntax.      |
| ENV-001–ENV-003         | Compile against explicit Environment Schemas, verify consumer-defined root namespaces, and inspect compiled-program result-type/diagnostic interfaces. |
| EVAL-IF-001–EVAL-IF-002 | Validate typed runtime inputs and concrete/residual result forms without coercion or consumer-specific reinterpretation.                         |
| LANG-001–LANG-004       | Inspect language-owned Language IR and test complete typed returns, multiple supported result types, immutable `const` bindings, conditional semantics, and early return. |
| TYPE-001–TYPE-004       | Test strict types, boolean/equality, arithmetic/ordering, null, lists, and membership semantics.                                                 |
| REF-001                 | Test static path resolution and reject dynamic paths, method calls, and call expressions.                                                        |
| EVAL-001–EVAL-002       | Test known-input evaluation across multiple program result types, branch/short-circuit/return behavior, and deterministic repeated results.      |
| PARTIAL-001–PARTIAL-004 | Test unknown preservation, simplification, residual result typing, and dependency metadata across multiple program result types.                 |
| QUERY-001–QUERY-003     | Validate residual queryability under consumer-provided capability/result contracts, callable exclusion, and persistence independence.            |
| DATA-001–DATA-004       | Inspect immutable values, schema/artifact identity, source fingerprints, and source-location metadata.                                           |
| QUAL-001–QUAL-003       | Verify deterministic semantics, guaranteed termination from the non-callable bounded language, and parser-independent core dependency direction. |
| PERF-001–PERF-003       | Exercise compiler limits, dependency-aware specialization, and exact compiled-artifact reuse.                                                    |
| DIAG-001                | Trigger every required diagnostic category and verify source location where applicable.                                                          |
| TECH-001–TECH-005       | Verify ANTLR Java frontend use, language exclusions, strict non-ECMAScript semantics, host isolation, and fail-closed complexity-limit handling. |

The verification objectives above are acceptance conditions for the corresponding normative requirements. Implementation test evidence is produced by the system repository when these requirements are realized.

## 9.2 Consumer Contract Acceptance

A conforming consumer integration SHALL demonstrate applicable execution forms without requiring the Embedded Language to know the consumer's domain semantics or required program result type:

1. Direct evaluation SHALL succeed for valid programs with at least two different supported result types when all required Environment Schema roots are supplied as known values.
2. Partial evaluation SHALL preserve a typed residual expression that conforms to the compiled program result type when one or more required roots are supplied as unknown values.
3. A consumer that requires a specific program result type SHALL reject an otherwise valid compiled program whose static result type does not satisfy that consumer contract.
4. When query lowering is requested, compilation SHALL accept residual operations and result forms supported by the supplied capability contract and SHALL reject unsupported residual operations or result forms with `QueryabilityError`.

Verification evidence SHALL use at least two different Environment Schemas with different root names and SHALL include at least one valid non-`Bool` program to confirm that Embedded Language behavior depends on language/schema contracts rather than hard-coded domain names or authorization-specific result restrictions.
