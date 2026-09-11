# 9. Verification, Validation, and Acceptance Evidence

## 9.1 Verification and Conformance Matrix

Verification SHALL cover:

- SYNTAX-001–SYNTAX-004: Both modes, shared expressions, bounded intrinsic/lambda syntax, and rejection of general calls/dynamic members.
- ENV-001–ENV-004: Structured schemas, symbolic metadata, result interfaces, modes, and feature-profile restrictions.
- EVAL-IF-001–EVAL-IF-002: Typed runtime inputs and concrete/residual results without coercion.
- LANG-001–LANG-006: Semantic AST ownership, typed results, program control flow, profile restrictions, and bounded intrinsic/lambda semantics.
- TYPE-001–TYPE-005: Scalar/structured/list types, operators, membership, quantifiers, empty-list semantics, null handling, and `len`.
- REF-001: Lexical/nested static reference resolution and rejection of dynamic/general callable references.
- EVAL-001–EVAL-002: Known-input evaluation, short-circuiting, quantifier evaluation, and determinism.
- PARTIAL-001–PARTIAL-005: Unknown preservation, simplification, residual typing, dependency metadata, and quantifier specialization.
- DATA-001–DATA-004: Immutable values, schema/artifact identity, source/profile metadata, no independent Semantic AST version, and source locations.
- QUAL-001–QUAL-003: Deterministic semantics, bounded termination, and parser-independent Semantic AST dependencies.
- PERF-001–PERF-003: Compiler limits, dependency-aware specialization, and exact artifact reuse.
- DIAG-001: All required diagnostic categories, including feature errors for quantifier/length capabilities.
- TECH-001–TECH-005: ANTLR Java frontend use, bounded callable model, strict semantics, host isolation, and compiler-limit behavior.

## 9.2 Execution Acceptance

Verification SHALL demonstrate:

1. `PROGRAM` and `EXPRESSION` compile through shared expression semantics.
2. Profiles disable every defined feature family independently.
3. `all`, `any`, and `none` statically type their element binding and predicate.
4. `all([], p)` is `true`, `any([], p)` is `false`, and `none([], p)` is `true`.
5. `len(...)` works only for specified non-null operand types.
6. Restricted lambdas cannot escape or be used as general function values.
7. Partial evaluation preserves symbolic quantified predicates and specializes captured known outer values.
8. Compiled-artifact reuse does not cross incompatible schemas, modes, or feature sets.
9. Semantic AST nodes and compiled artifacts do not require an independent Semantic AST version field.
