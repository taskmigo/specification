# 9. Verification, Validation, and Acceptance Evidence

## 9.1 Verification and Conformance Matrix

| Requirement IDs         | Verification objective                                                                                                                                                         |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| SYNTAX-001–SYNTAX-004   | Parse the direct program syntax, JavaScript-like delimiters/operators/literals, and reject export/function/arrow/call/member-method syntax.                                    |
| ENV-001–ENV-003         | Compile against explicit Environment Schemas, verify schema-defined root namespaces, and inspect Semantic AST/result-type/diagnostic interfaces.                               |
| EVAL-IF-001–EVAL-IF-002 | Validate typed runtime inputs and concrete/residual result forms without coercion.                                                                                             |
| LANG-001–LANG-004       | Inspect the language-owned Semantic AST and test complete typed returns, multiple supported result types, immutable `const` bindings, conditional semantics, and early return. |
| TYPE-001–TYPE-004       | Test strict types, boolean/equality, arithmetic/ordering, null, lists, and membership semantics.                                                                               |
| REF-001                 | Test static path resolution and reject dynamic paths, method calls, and call expressions.                                                                                      |
| EVAL-001–EVAL-002       | Test known-input evaluation across multiple program result types, branch/short-circuit/return behavior, and deterministic repeated results.                                    |
| PARTIAL-001–PARTIAL-004 | Test unknown preservation, simplification, residual Semantic AST typing, and dependency metadata across multiple program result types.                                         |
| DATA-001–DATA-004       | Inspect immutable values, schema/artifact identity, Semantic AST metadata, source fingerprints, and source-location metadata.                                                  |
| QUAL-001–QUAL-003       | Verify deterministic semantics, guaranteed termination from the non-callable bounded language, and parser-independent Semantic AST dependency direction.                       |
| PERF-001–PERF-003       | Exercise compiler limits, dependency-aware specialization, and exact compiled-artifact reuse.                                                                                  |
| DIAG-001                | Trigger every required diagnostic category and verify source location where applicable.                                                                                        |
| TECH-001–TECH-005       | Verify ANTLR Java frontend use, parse-tree-to-Semantic-AST conversion, language exclusions, strict non-ECMAScript semantics, host isolation, and compiler-limit handling.      |

The verification objectives above are acceptance conditions for the corresponding normative requirements. Implementation test evidence is produced by the system repository when these requirements are realized.

## 9.2 Execution Acceptance

Verification SHALL demonstrate:

1. Compilation produces a typed Semantic AST for valid programs with different supported result types.
2. Direct evaluation succeeds when all required Environment Schema roots are known.
3. Partial evaluation preserves a typed residual Semantic AST expression when one or more required roots are unknown.
4. The same program compiles consistently against different Environment Schemas according to the roots and types declared by each schema.
