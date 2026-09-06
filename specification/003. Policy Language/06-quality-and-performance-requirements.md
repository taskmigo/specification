# 6. Quality and Performance Requirements

## 6.1 Determinism

### QUAL-001 — Deterministic semantics

Parsing, static validation, direct evaluation, partial evaluation, and constant folding SHALL be deterministic for identical source, language version, Environment Schema, intrinsic contract, and input values.

Verification: Repeat compilation and evaluation across identical inputs and compare typed IR structure modulo non-semantic metadata, residual predicates, results, and failure classes.
Traceability: EVAL-002; PARTIAL-001.

### QUAL-002 — Guaranteed termination

Every valid TPL policy SHALL terminate without relying on runtime instruction quotas for loops or recursion because the language SHALL not provide looping, recursion, or user-defined callable constructs.

A registered intrinsic SHALL itself be required to terminate under its declared input contract.

Verification: Inspect the grammar and intrinsic contract and test deeply nested but valid bounded expressions under compiler limits.
Traceability: [Language Restrictions](07-constraints.md#72-language-restrictions); INTR-001.

## 6.2 Compiler Complexity and Safety Limits

### PERF-001 — Bounded source complexity

The compiler SHALL enforce finite configurable upper bounds for policy source size, token count, syntax-tree depth, Policy IR node count, list literal size, and intrinsic argument count.

A policy exceeding any configured bound SHALL be rejected before activation with a diagnostic identifying the exceeded category.

Verification: Exercise each configured boundary at, below, and above its limit.
Traceability: [Compiler Limits](07-constraints.md#75-compiler-limits); DIAG-001.

### PERF-002 — Dependency-aware partial evaluation

Partial evaluation SHALL use the dependency information required by PARTIAL-004, or an equivalent precomputed analysis, to avoid repeatedly traversing an unchanged subtree solely to rediscover whether it depends on an unknown root.

Verification: Instrument a large multi-root expression and confirm dependency discovery is not recomputed recursively for every specialization decision.
Traceability: PARTIAL-004.

## 6.3 Compilation Reuse

### PERF-003 — Compile before execution

A policy SHALL pass parsing, binding, type checking, intrinsic validation, and applicable queryability validation before it becomes executable for a consumer mapping.

A consumer MAY reuse an exact compiled artifact instead of recompiling the same source on every authorization operation when the identity requirements in DATA-002 and DATA-003 are satisfied.

Verification: Execute repeated operations against one unchanged policy revision and confirm exact compiled-artifact reuse is possible; change the source/schema contract and confirm recompilation or rejection.
Traceability: DATA-002; DATA-003.

## 6.4 Diagnostics and Maintainability

### DIAG-001 — Actionable diagnostics

Parse, binding, type, intrinsic, complexity, and queryability failures SHALL report a stable diagnostic category and source location when a source location exists.

Diagnostics SHALL distinguish at least:

```text
SyntaxError
BindingError
TypeError
IntrinsicError
ComplexityError
QueryabilityError
```

Verification: Trigger one failure in each category and inspect the diagnostic category and source span.
Traceability: DATA-004.

### QUAL-003 — Frontend replacement boundary

Core TPL semantics SHALL depend on Taskmigo-owned AST/Policy IR contracts rather than generated parser node types so that parser-generator upgrades or frontend replacement do not require rewriting evaluation and query semantics.

Verification: Inspect dependency direction between syntax, semantic, evaluation, and query-lowering components.
Traceability: LANG-001; [Parser Frontend](07-constraints.md#71-parser-frontend).
