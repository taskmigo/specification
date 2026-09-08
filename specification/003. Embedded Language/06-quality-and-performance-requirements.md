# 6. Quality and Performance Requirements

## 6.1 Determinism

### QUAL-001 — Deterministic semantics

Parsing, compilation-profile validation, static validation, applicable control-flow analysis, Semantic AST construction, direct evaluation, partial evaluation, and constant folding SHALL be deterministic for identical source, language version, Environment Schema, Compilation Profile, and input values.

Verification: Repeat compilation and evaluation across identical inputs and compare Semantic AST structure modulo non-semantic metadata, residual expressions, results, and failure classes.
Traceability: LANG-001; LANG-005; EVAL-002; PARTIAL-001.

### QUAL-002 — Guaranteed termination

Every valid compiled source SHALL terminate without relying on runtime instruction quotas for loops or recursion because the language SHALL provide neither loops nor callable constructs.

Verification: Inspect the grammar and test deeply nested but valid bounded program and expression sources under compiler limits.
Traceability: [Language Restrictions](07-constraints.md#72-language-restrictions); TECH-002.

## 6.2 Compiler Complexity and Safety Limits

### PERF-001 — Bounded source complexity

The compiler SHALL enforce finite configurable upper bounds for source size, token count, syntax-tree depth, Semantic AST node count, applicable `PROGRAM` block nesting depth, and list literal size.

A source exceeding any configured bound SHALL be rejected before execution with a diagnostic identifying the exceeded category.

Verification: Exercise each configured boundary at, below, and above its limit in each applicable source mode.
Traceability: [Compiler Limits](07-constraints.md#75-compiler-limits); DIAG-001.

### PERF-002 — Dependency-aware partial evaluation

Partial evaluation SHALL use the dependency information required by PARTIAL-004, or an equivalent precomputed analysis, to avoid repeatedly traversing an unchanged subtree solely to rediscover whether it depends on an unknown root.

Verification: Instrument a large multi-root Semantic AST produced through each source mode and confirm dependency discovery is not recomputed recursively for every specialization decision.
Traceability: PARTIAL-004.

## 6.3 Compilation Reuse

### PERF-003 — Compile before execution

A source SHALL pass parsing, compilation-profile validation, binding, applicable control-flow validation, type checking, and complexity validation before its Semantic AST becomes executable.

An exact compiled artifact MAY be reused instead of recompiling the same source only when the identity requirements in DATA-002 and DATA-003 are satisfied, including the selected source mode and enabled feature families.

Verification: Execute repeated operations against one unchanged source/schema/profile tuple and confirm exact compiled-artifact reuse is possible; change the source, schema, mode, or feature set and confirm recompilation or rejection.
Traceability: DATA-002; DATA-003; LANG-005.

## 6.4 Diagnostics and Maintainability

### DIAG-001 — Actionable diagnostics

Parse, binding, compilation-profile, control-flow, type, and complexity failures SHALL report a stable diagnostic category and source location when a source location exists.

Diagnostics SHALL distinguish at least:

```text
SyntaxError
BindingError
FeatureError
ControlFlowError
TypeError
ComplexityError
```

A `FeatureError` SHALL identify the disabled feature family whose use caused compilation to fail.

Verification: Trigger one failure in each category and inspect the diagnostic category, disabled feature identifier where applicable, and source span.
Traceability: DATA-004; ENV-004.

### QUAL-003 — Frontend replacement boundary

Core Embedded Language semantics SHALL depend on the language-owned Semantic AST contract rather than generated parser node types so that parser-generator upgrades or frontend replacement do not require rewriting evaluation semantics.

Verification: Inspect dependency direction between syntax, compilation-profile validation, semantic analysis, evaluation, and partial-evaluation components.
Traceability: LANG-001; [Parser Frontend](07-constraints.md#71-parser-frontend).
