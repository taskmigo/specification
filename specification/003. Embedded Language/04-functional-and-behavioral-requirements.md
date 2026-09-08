# 4. Functional and Behavioral Requirements

## 4.1 Compilation and Semantic AST

### LANG-001 — Language-owned semantic representation

Source SHALL compile through the parser frontend and semantic analysis into a language-owned typed Semantic AST independent of ANTLR parse-tree classes, ECMAScript semantics, application-domain semantics, consumer profile names, persistence APIs, and host APIs.

Equivalent enabled expressions compiled through either source mode SHALL use the same Semantic AST expression semantics.

Verification: Inspect dependency direction and compare equivalent expressions compiled through both modes.
Traceability: [Product Perspective](02-overall-description.md#21-product-perspective); TECH-001.

### LANG-002 — Typed source result

In `PROGRAM`, every reachable path SHALL execute a `return` with a statically known type, and reachable returns SHALL form one compatible source result type. Reachable fall-through SHALL be rejected.

In `EXPRESSION`, the source expression SHALL have a statically known result type and SHALL NOT require `return`.

The result type MAY be any supported type. Truthy/falsy result coercion SHALL NOT exist.

Verification: Compile sources producing booleans, strings, numbers, nullable values, lists, and schema-defined types; reject incompatible program returns and fall-through.
Traceability: TYPE-001; SYNTAX-001.

### LANG-003 — Immutable local bindings

When `LOCAL_BINDINGS` is enabled in `PROGRAM`, `const` SHALL bind one immutable lexical name. Visibility SHALL begin after declaration and follow lexical block scope. Reassignment, duplicate same-scope names, and forward references SHALL be rejected.

Verification: Test lexical visibility, duplicates, forward references, and disabled local bindings.
Traceability: ENV-004; TECH-002.

### LANG-004 — Conditional and return control flow

When enabled in `PROGRAM`, `if` SHALL require a `Bool` condition. Executed `return` SHALL terminate the current path. Direct and partial evaluation SHALL evaluate only branches that can affect the result.

Verification: Test true, false, unknown conditions, early return, and unreachable failures.
Traceability: TYPE-001; PARTIAL-001; ENV-004.

### LANG-005 — Compilation-profile restrictions

The compiler SHALL enforce the feature set selected by ENV-004 before producing an executable artifact. Disabling a feature SHALL NOT change the semantics of constructs that remain enabled.

Verification: Compile the same source under multiple profiles and confirm disabled features fail and incompatible artifacts are not reused.
Traceability: ENV-004; DATA-003; PERF-003.

### LANG-006 — Restricted collection lambdas and intrinsics

`all`, `any`, `none`, and `len` SHALL be canonical compiler-recognized intrinsic forms rather than general callable values.

A quantifier lambda SHALL introduce exactly one lexical element binding scoped to its predicate. The lambda SHALL NOT be storable, returnable, independently invokable, or passable to an arbitrary function.

A lambda predicate MAY reference visible outer lexical values and Environment Schema roots in addition to its element binding.

Verification: Accept valid intrinsic forms and captured outer values; reject standalone lambdas, direct lambda invocation, arbitrary function calls, and lambda escape.
Traceability: SYNTAX-002; SYNTAX-004; TECH-002.

## 4.2 Type System and Operators

### TYPE-001 — Static types and no implicit coercion

Every expression and applicable reachable return SHALL be statically typed before execution.

The initial value categories SHALL include:

```text
Bool
String
Number
Null
List<T>
```

Environment Schemas MAY additionally declare schema-defined scalar types and structured types with statically declared properties. `List<T>` MAY use a structured schema-defined element type.

The language SHALL NOT implicitly convert between incompatible types.

Verification: Test scalar, structured, and list typing and reject implicit coercion.
Traceability: TECH-003.

### TYPE-002 — Boolean and equality operators

When enabled, `&&`, `||`, and `!` SHALL operate only on `Bool`; `==` and `!=` SHALL compare type-compatible operands and return `Bool`. `&&` and `||` SHALL short-circuit.

Verification: Test valid operations, type errors, short-circuiting, and disabled features.
Traceability: LANG-005; EVAL-001.

### TYPE-003 — Ordering and arithmetic operators

When enabled, ordering operators SHALL require mutually compatible ordered operands. Arithmetic operators SHALL require `Number` unless another overload is explicitly specified. Invalid or non-finite numeric operations SHALL fail.

Verification: Test valid operations, incompatible operands, zero division/modulo, non-finite results, and disabled features.
Traceability: LANG-005; QUAL-001.

### TYPE-004 — Null, lists, and membership

`null` SHALL be a value distinct from absence and `undefined`. Ordering/arithmetic with `null` SHALL be invalid. Equality with `null` SHALL be permitted only when nullability allows it.

List literals SHALL contain compatible elements. `value in list` SHALL require a compatible element type and return `Bool`. Membership in an empty list SHALL return `false`.

Verification: Test null semantics, list compatibility, membership, and disabled list/membership features.
Traceability: TYPE-001; LANG-005.

### TYPE-005 — Collection quantifiers and length

When `COLLECTION_QUANTIFIERS` is enabled:

```text
all(collection, element => predicate)
any(collection, element => predicate)
none(collection, element => predicate)
```

SHALL require `collection: List<T>`, bind `element: T`, require `predicate: Bool`, and return `Bool`.

The semantics over an empty list SHALL be:

```text
all([], p)  -> true
any([], p)  -> false
none([], p) -> true
```

A nullable collection SHALL NOT be implicitly treated as an empty list. Quantification over a concrete `null` SHALL fail; a statically nullable collection operand SHALL be rejected unless a future specified null-safe construct removes the ambiguity.

When `LENGTH_INTRINSIC` is enabled, `len(value)` SHALL accept a non-null `String` or `List<T>` and return `Number`. It SHALL NOT use host reflection or arbitrary method invocation.

Verification: Test quantifier typing, nested structured element paths, empty-list semantics, null rejection, captured outer values, and `len` over strings/lists.
Traceability: LANG-006; TYPE-001; ENV-004.

## 4.3 References

### REF-001 — Static reference resolution

Every value reference SHALL resolve at compile time to a visible `const`, a visible restricted-lambda element binding, or an Environment Schema root/path.

Unknown roots/paths, dynamic paths, method calls, and general call expressions SHALL be rejected.

Verification: Compile valid and invalid nested paths, local bindings, lambda element paths, and general calls.
Traceability: ENV-001; SYNTAX-004; LANG-006.

## 4.4 Direct Evaluation

### EVAL-001 — Known-input evaluation

When all dependencies required by the selected execution path are known, evaluation SHALL produce exactly one conforming value or an evaluation failure.

Evaluation SHALL preserve short-circuit, `PROGRAM` control-flow, and quantifier short-circuit semantics. `all` MAY stop at the first false predicate; `any` MAY stop at the first true predicate; `none` MAY stop at the first true predicate.

Verification: Evaluate representative sources including skipped failing expressions and quantified collections.
Traceability: LANG-002; TYPE-002; TYPE-005; EVAL-IF-002.

### EVAL-002 — Deterministic values

For the same Semantic AST, Environment Schema, Compilation Profile, and input values, evaluation SHALL produce the same result or same class of failure.

Verification: Repeat identical executions and compare results/failures.
Traceability: QUAL-001; ENV-004.

## 4.5 Partial Evaluation

### PARTIAL-001 — Unknown-preserving evaluation

Partial evaluation SHALL evaluate any expression or applicable statement whose result can be determined from known inputs without evaluating an unknown-dependent path. A source result still depending on unknown input SHALL remain as a typed residual Semantic AST expression unless simplification removes the dependency.

Verification: Partially evaluate mixed known/unknown sources and inspect residual types.
Traceability: LANG-001; LANG-002.

### PARTIAL-002 — Constant folding and boolean simplification

Compilation and partial evaluation SHALL fold constants when semantics are unchanged. At minimum, standard boolean identities SHALL be preserved.

A simplification SHALL NOT evaluate a branch, operand, or quantifier element that direct evaluation would skip.

Verification: Test boolean identities and skipped failing branches/elements.
Traceability: TYPE-002; EVAL-001.

### PARTIAL-003 — Residual result contract

Successful partial evaluation SHALL produce a concrete value or residual Semantic AST expression conforming to the compiled source result type. Incompatible internal results SHALL fail rather than coerce.

Verification: Inspect residual types and inject incompatible internal results at a test boundary.
Traceability: LANG-001; LANG-002; EVAL-IF-002.

### PARTIAL-004 — Dependency metadata

The Semantic AST SHALL retain or provide equivalent dependency metadata sufficient to determine unknown-root dependencies without rediscovering them recursively for every specialization decision.

Verification: Inspect dependency metadata before and after simplification.
Traceability: PERF-002.

### PARTIAL-005 — Quantifier specialization

When a quantifier source collection is concrete, partial evaluation MAY evaluate element predicates and apply quantifier short-circuit semantics. When the collection or element predicate remains symbolic, partial evaluation SHALL preserve a typed residual quantifier expression unless simplification proves a concrete result.

Captured known outer values SHALL specialize normally inside the residual predicate.

Verification: Partially evaluate concrete, symbolic, empty, and outer-value-capturing quantifiers and compare with direct evaluation semantics.
Traceability: TYPE-005; PARTIAL-001; PARTIAL-004.
