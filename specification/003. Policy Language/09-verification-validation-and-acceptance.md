# 9. Verification, Validation, and Acceptance Evidence

## 9.1 Verification and Conformance Matrix

| Requirement IDs         | Verification objective                                                                                                                                             |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| SYNTAX-001–SYNTAX-004   | Parse named/unnamed default functions, block/concise default arrows, JavaScript-like parenthesis positions, canonical operators/literals, and reject dynamic access. |
| ENV-001–ENV-003         | Compile against explicit Environment Schemas, verify scope-dependent roots, and inspect compiled-policy/diagnostic interfaces.                                     |
| EVAL-IF-001–EVAL-IF-002 | Validate typed runtime inputs and direct/residual result forms without coercion across supported default-export forms.                                             |
| LANG-001–LANG-005       | Inspect Taskmigo-owned Policy IR and test boolean default results, immutable `const` bindings, conditional semantics, and `return`.                                |
| FUNC-001–FUNC-004       | Test source-declared helper calls, return typing, acyclic call graphs, named exports, default-export forms, and exactly one default export.                         |
| TYPE-001–TYPE-004       | Test strict types, boolean/equality, arithmetic/ordering, null, lists, and membership semantics.                                                                   |
| REF-001                 | Test static path and call-target resolution and reject dynamic/unknown references.                                                                                 |
| EVAL-001–EVAL-002       | Test known-input evaluation, branch/short-circuit/return behavior, helper calls, arrow defaults, and deterministic repeated results.                              |
| PARTIAL-001–PARTIAL-004 | Test unknown preservation, simplification, residual boolean typing, helper dependencies, default-export normalization, and dependency metadata.                   |
| QUERY-001–QUERY-003     | Validate residual queryability through helper functions, utility-function exclusion, and persistence independence.                                                |
| DATA-001–DATA-004       | Inspect immutable values, schema/artifact identity, source fingerprints, and source-location metadata.                                                             |
| QUAL-001–QUAL-003       | Verify deterministic semantics, guaranteed termination through an acyclic call graph, and parser-independent core dependency direction.                           |
| PERF-001–PERF-003       | Exercise compiler limits, dependency-aware specialization, and exact compiled-artifact reuse.                                                                      |
| DIAG-001                | Trigger every required diagnostic category and verify source location where applicable.                                                                            |
| TECH-001–TECH-005       | Verify ANTLR Java frontend use, bounded language exclusions, strict non-ECMAScript semantics, host isolation, and fail-closed complexity-limit handling.          |

The verification objectives above are acceptance conditions for the corresponding normative requirements. Implementation test evidence is produced by the Taskmigo system repository when these requirements are realized.

## 9.2 Cross-Consumer Acceptance

The initial Authorization consumer SHALL demonstrate both execution modes:

1. Request Authorization SHALL evaluate valid TPL policies using at least one function-declaration default export and one arrow default export with known `principal` and `request` values.
2. Object Authorization SHALL partially evaluate a valid TPL policy with unknown `object`, validate residual queryability, and apply the lowered authorization predicate before pagination as required by the [Authorization Object requirements](../002.%20Authorization/04-functional-and-behavioral-requirements.md#43-object-authorization-and-shared-filter-ast).

Verification evidence SHALL include at least one policy that becomes a concrete boolean after specialization and one policy that produces a residual object predicate through a source-declared helper function.
