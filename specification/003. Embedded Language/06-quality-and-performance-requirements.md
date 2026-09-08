# 6. Quality and Performance Requirements

## 6.1 Determinism and Termination

### QUAL-001 — Deterministic semantics

Parsing, profile validation, static validation, Semantic AST construction, direct evaluation, partial evaluation, intrinsic evaluation, and constant folding SHALL be deterministic for identical source, language version, Environment Schema, Compilation Profile, and input values.

Verification: Repeat compilation/evaluation and compare Semantic AST structure modulo non-semantic metadata, residual expressions, results, and failure classes.
Traceability: LANG-001; LANG-005; EVAL-002; PARTIAL-001.

### QUAL-002 — Guaranteed termination

Every valid source SHALL terminate without general runtime instruction quotas for loops or recursion because the language SHALL provide neither. Restricted quantifiers SHALL iterate only finite concrete lists during direct evaluation and SHALL remain symbolic when their source collection is unknown.

Verification: Inspect the grammar and exercise large finite quantified lists under compiler/runtime resource limits.
Traceability: TECH-002; TYPE-005.

## 6.2 Compiler Complexity and Safety Limits

### PERF-001 — Bounded source complexity

The compiler SHALL enforce finite configurable upper bounds for source size, token count, syntax-tree depth, Semantic AST node count, applicable block nesting, list literal size, quantifier nesting, and restricted-lambda nesting.

A source exceeding a configured bound SHALL be rejected before execution with `ComplexityError`.

Verification: Exercise each configured boundary at, below, and above its limit.
Traceability: TECH-005; DIAG-001.

### PERF-002 — Dependency-aware partial evaluation

Partial evaluation SHALL use dependency metadata required by PARTIAL-004, or equivalent precomputed analysis, to avoid repeatedly traversing unchanged subtrees solely to rediscover unknown-root dependencies.

Verification: Instrument large multi-root and quantified Semantic ASTs.
Traceability: PARTIAL-004; PARTIAL-005.

## 6.3 Compilation Reuse

### PERF-003 — Compile before execution

A source SHALL pass parsing, profile validation, binding, applicable control-flow validation, type checking, and complexity validation before its Semantic AST becomes executable.

An exact compiled artifact MAY be reused only when DATA-002 and DATA-003 identity requirements are satisfied.

Verification: Reuse unchanged artifacts and change source/schema/mode/features independently to confirm recompilation or rejection.
Traceability: DATA-002; DATA-003; LANG-005.

## 6.4 Diagnostics and Maintainability

### DIAG-001 — Actionable diagnostics

Failures SHALL report a stable diagnostic category and source location where available. Diagnostics SHALL distinguish at least:

```text
SyntaxError
BindingError
FeatureError
ControlFlowError
TypeError
ComplexityError
```

`FeatureError` SHALL identify the disabled feature family responsible for rejection.

Verification: Trigger each category, including invalid intrinsic/lambda placement and disabled collection features.
Traceability: DATA-004; ENV-004.

### QUAL-003 — Frontend replacement boundary

Core semantics SHALL depend on the language-owned Semantic AST rather than generated parser node types.

Verification: Inspect dependency direction between syntax, semantic analysis, evaluation, and partial evaluation.
Traceability: LANG-001; TECH-001.
