# 4. Functional and Behavioral Requirements

This chapter is the canonical **typed behavioral contract** of the internal Language. An operation is conforming only when source validation, static type/result, evaluation/partial evaluation, and errors all respect the same Environment Schema and Compilation Profile. A valid grammar production is not automatically enabled for a particular consumer.

## 4.1 Compilation and Semantic AST

### LANG-001 — Language-owned semantic representation

**Required behavior:** Source SHALL pass through the frontend parser and semantic validation to a **language-owned, typed Semantic AST**. Semantic nodes SHALL be independent of ANTLR parse-tree types, JavaScript runtime rules, application-specific policy names, database code and arbitrary host objects.

**Equivalence:** An enabled expression parsed inside PROGRAM and EXPRESSION modes SHALL retain the same Semantic AST expression semantics.

**Verification:** Inspect dependency direction and compile equivalent expressions through both source entries. See [TECH-001](07-constraints.md).

### LANG-002 — Typed source result

**PROGRAM:** Every reachable path SHALL end in `return <expression>;`, and reachable returns SHALL agree on one statically compatible source-result type. A reachable fall-through SHALL be a compile error.

**EXPRESSION:** The single source expression SHALL have a statically known result type without a return statement. Results MAY use any supported type; implicit truthy/falsy conversion SHALL not exist.

**Verification:** Compile compatible/incompatible branches, nullable and list results, and missing returns.

### LANG-003 — Immutable local bindings

With `LOCAL_BINDINGS` enabled in PROGRAM mode, `const` SHALL introduce one immutable lexical binding visible only after declaration within the appropriate block scope. Reassignment, duplicate names in one scope and forward references SHALL fail. A profile disabling `LOCAL_BINDINGS` SHALL reject otherwise valid `const` source.

### LANG-004 — Conditional and return control flow

In a PROGRAM profile enabling conditional flow, each `if` condition SHALL be Bool; an executed `return` terminates the current path. Direct and partial evaluation SHALL inspect only branches relevant to the resulting value, preserving skipped-branch semantics even where a skipped expression would otherwise fail.

### LANG-005 — Compilation-profile restrictions

Every compilation SHALL validate its source against the exact mode and feature set specified by [ENV-004](03-external-interface-requirements.md#env-004--compilation-profile). A disabled feature SHALL cause compilation failure; disabling one feature SHALL not alter the semantics of other enabled constructs. Incompatible mode/schema/feature artifacts SHALL not be reused.

### LANG-006 — Restricted collection lambdas and intrinsics

`all`, `any`, `none` and `len` SHALL be compiler-recognized bounded intrinsics, **not generic callable functions**. A quantifier lambda SHALL bind exactly one element for its predicate, may read visible outer bindings/schema roots, and SHALL not be stored, returned, invoked independently or passed as a first-class function.

**Verification:** Accept enabled quantifier/intrinsic calls with outer captures; reject escaping/standalone lambdas and arbitrary function call syntax.

## 4.2 Type System and Operators

### TYPE-001 — Static types and no implicit coercion

Every expression and reachable return SHALL have a static type before execution. Built-in value categories SHALL include `Bool`, `String`, `Number`, `Null` and `List<T>`. The Environment Schema MAY add typed scalar and structured types, including structured list element types.

**Safety:** Incompatible types SHALL not be coerced implicitly. Mismatches are compilation/evaluation failures rather than surprising converted values.

### TYPE-002 — Boolean and equality operators

When enabled, `&&` and `||` SHALL operate only on Bool operands, yield Bool and short-circuit. `!` SHALL require Bool and be controlled by the **independent** `UNARY_NOT` feature; `==`/`!=` SHALL compare compatible types and yield Bool. Disabling logical operators SHALL not implicitly disable or enable unary negation.

### TYPE-003 — Ordering and arithmetic operators

When enabled, ordering SHALL accept only mutually compatible ordered types. Arithmetic SHALL accept Number unless an explicit overload exists. Division/modulo by zero, non-finite numeric results and incompatible operands SHALL fail rather than produce an unspecified value or hidden coercion.

### TYPE-004 — Null, lists, and membership

`null` is a distinct value, not an absent or undefined root. Ordering/arithmetic with null SHALL be invalid; equality against null SHALL require compatible nullable typing. List elements SHALL be type-compatible. When enabled, `value in list` SHALL require a compatible element type and return Bool; membership in an empty list SHALL return `false`.

**Profile distinction:** Even though canonical Language may support membership, a Query/Authorization consumer can forbid it.

### TYPE-005 — Collection quantifiers and length

When `COLLECTION_QUANTIFIERS` is enabled, the canonical forms SHALL be:

```text
all(collection, element => predicate)
any(collection, element => predicate)
none(collection, element => predicate)
```

The collection SHALL have `List<T>` type; the bound element SHALL have type `T`; the predicate SHALL be Bool; and the result SHALL be Bool. For empty collections:

| Expression | Required result |
| --- | --- |
| `all([], p)` | `true` |
| `any([], p)` | `false` |
| `none([], p)` | `true` |

A concrete null collection SHALL fail, and statically nullable collection operands SHALL be rejected rather than treated as empty unless a future null-safe construct is explicitly specified. When `LENGTH_INTRINSIC` is enabled, `len(value)` SHALL accept only a nonnull String or `List<T>`, returning Number; it SHALL not dispatch to arbitrary host reflection.

## 4.3 References

### REF-001 — Static reference resolution

Every source reference SHALL resolve at compile time to a visible `const`, a scoped quantifier element binding or a declared Environment Schema root/path. Missing roots, undeclared nested properties, computed member paths, general method calls and arbitrary host function invocation SHALL be rejected.

**Verification:** Test nested structured references and both valid and invalid local/lambda references under compatible profiles.

## 4.4 Direct Evaluation

### EVAL-001 — Known-input evaluation

Given the required concrete, schema-conforming inputs, direct evaluation SHALL return exactly one value of the compiled source-result type or an explicit evaluation failure. It SHALL preserve PROGRAM control flow and Boolean/quantifier short-circuit behavior. `all` may stop on first false, `any` on first true and `none` on first true; skipped elements SHALL not be evaluated.

### EVAL-002 — Deterministic values

For the same typed Semantic AST, Environment Schema, profile and input values, repeated evaluation SHALL yield the **same value or same failure category**. No hidden host environment, I/O, mutable global state or unbounded runtime behavior may change the result.

## 4.5 Partial Evaluation

### PARTIAL-001 — Unknown-preserving evaluation

Partial evaluation SHALL compute subexpressions fully determined by known values without forcing evaluation of unknown-dependent paths. An unknown-dependent result SHALL remain as a **typed residual Semantic AST expression** unless a semantics-preserving simplification proves its value.

### PARTIAL-002 — Constant folding and boolean simplification

Compilation and specialization SHALL fold constant subexpressions and standard Boolean identities only where observable semantics remain unchanged. Neither step SHALL evaluate a branch, operand or quantifier element that direct evaluation would have skipped, including a skipped expression that would raise an error.

### PARTIAL-003 — Residual result contract

A successful partial evaluation SHALL return either a concrete compatible value or a typed residual expression matching the compiled source-result type. A mismatched internal value or malformed residual SHALL fail instead of being coerced.

### PARTIAL-004 — Dependency metadata

Semantic AST nodes or equivalent compiled metadata SHALL retain enough dependency information to determine unknown-root dependency **without recursively rediscovering it for every specialization decision**. The metadata SHALL remain valid after simplification.

### PARTIAL-005 — Quantifier specialization

For a concrete collection, partial evaluation MAY specialize element predicates using permitted short-circuit behavior. For a symbolic collection or still-symbolic predicate, it SHALL preserve a typed residual quantifier unless simplification proves a value. Known outer bindings captured by the element predicate SHALL be specialized correctly.

**Verification:** Compare direct/partial outcomes for concrete, symbolic, empty and outer-capturing collections.

## 4.6 Additional Implemented Features

### LANG-007 — String contains intrinsic

With `CONTAINS_INTRINSIC` enabled, `contains(text, substring)` SHALL require String operands, return Bool and perform String containment. It SHALL NOT invoke arbitrary host methods; a disabled profile SHALL reject this source form.

### TYPE-006 — Independently gated Boolean negation

`UNARY_NOT` SHALL govern unary `!` independently of `LOGICAL_OPERATORS`, which governs `&&` and `||`. Each operation SHALL reject non-Boolean operands. The two feature switches SHALL be tested independently.

## 4.7 Verification cross-reference

Use the [canonical syntax/environment interface](03-external-interface-requirements.md), [quality and diagnostics contract](06-quality-and-performance-requirements.md), and [section 9](09-verification-validation-and-acceptance.md) for semantic, negative, partial-evaluation and profile-gating acceptance. A Language feature must also pass its consuming module's narrower profile tests before being used in authorization or client filtering.
