# 9. Verification, Validation, and Acceptance Evidence

## 9.1 Verification and Conformance Matrix

| Requirement IDs         | Verification objective                                                                                                                                                                                |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SYNTAX-001–SYNTAX-004   | Parse canonical `PROGRAM` and `EXPRESSION` source modes through shared expression syntax, enforce mode-specific delimiters, and reject export/function/arrow/call/member-method syntax.               |
| ENV-001–ENV-004         | Compile against explicit Environment Schemas and Compilation Profiles, verify schema-defined root namespaces, feature restrictions, source modes, and Semantic AST/result-type/diagnostic interfaces. |
| EVAL-IF-001–EVAL-IF-002 | Validate typed runtime inputs and concrete/residual result forms without coercion in both source modes.                                                                                                |
| LANG-001–LANG-005       | Inspect the language-owned Semantic AST and test typed source results, `PROGRAM` local/control-flow semantics, `EXPRESSION` sources, and compilation-profile restrictions.                            |
| TYPE-001–TYPE-004       | Test strict types, boolean/equality, arithmetic/ordering, null, lists, membership semantics, and feature-family disablement.                                                                           |
| REF-001                 | Test static path resolution and reject dynamic paths, method calls, and call expressions in both source modes.                                                                                         |
| EVAL-001–EVAL-002       | Test known-input evaluation across multiple source result types and modes, applicable branch/short-circuit/return behavior, and deterministic repeated results.                                       |
| PARTIAL-001–PARTIAL-004 | Test unknown preservation, simplification, residual Semantic AST typing, and dependency metadata across multiple source result types and modes.                                                        |
| DATA-001–DATA-004       | Inspect immutable values, schema/artifact identity, mode/profile identity, Semantic AST metadata, source fingerprints, and source-location metadata.                                                    |
| QUAL-001–QUAL-003       | Verify deterministic semantics, guaranteed termination from the non-callable bounded language, and parser-independent Semantic AST dependency direction.                                               |
| PERF-001–PERF-003       | Exercise compiler limits, dependency-aware specialization, and exact compiled-artifact reuse across source/schema/profile identity changes.                                                            |
| DIAG-001                | Trigger every required diagnostic category, including `FeatureError`, and verify source location where applicable.                                                                                    |
| TECH-001–TECH-005       | Verify shared ANTLR Java frontend use for both modes, parse-tree-to-Semantic-AST conversion, language exclusions, strict semantics, host isolation, and compiler-limit handling.                      |

The verification objectives above are acceptance conditions for the corresponding normative requirements. Implementation test evidence is produced by the system repository when these requirements are realized.

## 9.2 Execution Acceptance

Verification SHALL demonstrate:

1. `PROGRAM` compilation produces a typed Semantic AST for valid programs with different supported result types and preserves complete-return validation.
2. `EXPRESSION` compilation produces a typed Semantic AST for a standalone expression without requiring or accepting a statement wrapper.
3. A Compilation Profile can disable each feature family defined by ENV-004, and disabled-feature usage fails before an executable artifact is produced.
4. The same enabled expression semantics are preserved across compatible `PROGRAM` and `EXPRESSION` compilations.
5. Direct evaluation succeeds when all required Environment Schema roots are known.
6. Partial evaluation preserves a typed residual Semantic AST expression when one or more required roots are unknown.
7. The same source compiles consistently against different Environment Schemas and Compilation Profiles according to the roots, types, mode, and feature set supplied to compilation.
8. Compiled-artifact reuse does not cross incompatible source modes or feature profiles.
