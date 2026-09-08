# 4. Functional and Behavioral Requirements

## 4.1 Compilation and Semantic AST

### LANG-001 — Language-owned semantic representation

Embedded Language source SHALL compile through the parser frontend and semantic analysis into a language-owned typed Semantic AST.

The Semantic AST SHALL be independent of ANTLR parse-tree classes, ECMAScript semantics, callable/module semantics, application-domain semantics, consumer profile names, and host APIs.

Equivalent expressions compiled under `PROGRAM` and `EXPRESSION` modes with compatible Environment Schemas and enabled feature families SHALL use the same Semantic AST expression semantics.

Verification: Inspect public/core language types and confirm evaluator and partial evaluator code consume the Semantic AST rather than ANTLR parse-tree, application-domain, persistence, or consumer-specific types; compare equivalent expression nodes compiled through both source modes.
Traceability: [Product Perspective](02-overall-description.md#21-product-perspective); [Parser Frontend](07-constraints.md#71-parser-frontend); ENV-004.

### LANG-002 — Typed source result

In `PROGRAM` mode, every reachable control-flow path SHALL execute a `return` whose expression has a statically known type. The reachable return expressions SHALL have one statically compatible source result type. A reachable path that falls through end-of-source/end-of-block without reaching a later enclosing return, or a set of reachable return expressions that cannot form one compatible result type, SHALL be rejected during compilation.

In `EXPRESSION` mode, the source expression SHALL have a statically known source result type and SHALL NOT require a `return` statement.

The source result type MAY be any value type supported by TYPE-001 and the applicable Environment Schema.

Runtime truthy/falsy conversion or result coercion SHALL NOT exist.

Verification: Compile program and expression sources returning or producing `Bool`, `String`, `Number`, nullable values, lists, and compatible schema-defined scalar types; reject program fall-through paths and incompatible mixed return types.
Traceability: [Program Model](02-overall-description.md#221-program-model); TYPE-001; SYNTAX-001.

### LANG-003 — Immutable local bindings

When `LOCAL_BINDINGS` is enabled in a `PROGRAM` Compilation Profile, a `const` declaration SHALL bind one immutable local name to the value of its expression.

A local binding SHALL be visible only after its declaration and within its lexical block and nested blocks. Duplicate local names in the same lexical scope, reassignment, and local names that conflict with reserved keywords SHALL be rejected.

`EXPRESSION` mode SHALL NOT provide local declarations.

Verification: Test sequential references, block visibility, forward-reference rejection, duplicate-name rejection, the absence of assignment syntax, disabled `LOCAL_BINDINGS`, and rejection of local declarations in `EXPRESSION` mode.
Traceability: SYNTAX-001; ENV-004; [Language Restrictions](07-constraints.md#72-language-restrictions).

### LANG-004 — Conditional and return control flow

When `CONDITIONAL_CONTROL_FLOW` is enabled in `PROGRAM` mode, `if (<condition>) { ... }` SHALL require a `Bool` condition and SHALL follow the source delimiters defined by SYNTAX-003.

A `return <expression>;` in `PROGRAM` mode SHALL immediately terminate evaluation of the current program path. Statements following an executed return SHALL NOT be evaluated.

Only the selected `if`/`else` branch SHALL be evaluated when the condition is concrete.

During partial evaluation, a concrete condition SHALL select one branch. An unknown condition SHALL preserve the branch-dependent typed result as residual Semantic AST when multiple outcomes may affect the program result.

`EXPRESSION` mode SHALL NOT provide statement-level conditional control flow or `return` statements.

Verification: Test direct and partial evaluation with true, false, and unknown conditions, `else if`, early return, multiple compatible result types, unreachable failing statements after return, disabled `CONDITIONAL_CONTROL_FLOW`, and statement rejection in `EXPRESSION` mode.
Traceability: TYPE-001; PARTIAL-001; ENV-004.

### LANG-005 — Compilation-profile restrictions

The compiler SHALL enforce the feature set selected by ENV-004 during compilation before producing an executable Semantic AST.

A disabled feature SHALL be rejected even when the same source construct would be valid under another Compilation Profile. Disabling a feature SHALL NOT change the semantics of constructs that remain enabled.

Compilation-profile enforcement SHALL apply before compiled-artifact reuse is considered valid under DATA-003.

Verification: Compile the same source under multiple profiles, reject every disabled feature family, compare Semantic AST/evaluation behavior for enabled constructs, and confirm an artifact compiled under a less-restrictive profile is not reused under an incompatible more-restrictive profile.
Traceability: ENV-004; DATA-003; PERF-003.

## 4.2 Type System and Operators

### TYPE-001 — Static types and no implicit coercion

The Embedded Language SHALL statically type every expression and, in `PROGRAM` mode, every reachable return before producing an executable Semantic AST.

The initial language SHALL support these value categories:

```text
Bool
String
Number
Null
List<T>
```

Environment Schema paths MAY additionally carry schema-defined scalar types when their supported operators and equality semantics are declared by the schema.

The Embedded Language SHALL NOT implicitly convert between booleans, strings, numbers, lists, null, or schema-defined scalar types.

Verification: Compile valid same-type operations in both source modes and reject mixed-type arithmetic, boolean coercion, string-to-number coercion, and list-to-scalar coercion.
Traceability: [Strict Semantics](07-constraints.md#73-strict-semantics).

### TYPE-002 — Boolean and equality operators

When their corresponding feature families are enabled, `&&`, `||`, and `!` SHALL operate only on `Bool`, while `==` and `!=` SHALL compare type-compatible operands and SHALL return `Bool`.

`&&` and `||` SHALL short-circuit when the left operand determines the result.

Verification: Test boolean type errors, short-circuit behavior with a failing right operand, equality on compatible/incompatible types, and rejection when the relevant feature family is disabled.
Traceability: LANG-002; LANG-005; EVAL-001.

### TYPE-003 — Ordering and arithmetic operators

When `ORDERING_OPERATORS` is enabled, `<`, `<=`, `>`, and `>=` SHALL operate only on operands whose type defines an ordering compatible with both operands.

When `ARITHMETIC_OPERATORS` is enabled, `+`, `-`, `*`, `/`, `%`, unary `+`, and unary `-` SHALL operate only on `Number` unless a future specification explicitly adds another overload.

Numeric results SHALL be finite and deterministic. Division or modulo by zero, numeric overflow outside the implementation's supported finite range, or another invalid numeric operation SHALL be an evaluation failure.

Verification: Test valid numeric arithmetic/comparison, disabled ordering/arithmetic profiles, and rejection or failure for incompatible operands, divide-by-zero, modulo-by-zero, and non-finite results.
Traceability: LANG-005; [Determinism](06-quality-and-performance-requirements.md#61-determinism).

### TYPE-004 — Null, lists, and membership

`null` SHALL be a value, not an absent identifier and not an ECMAScript-style `undefined` value.

Ordering and arithmetic with `null` SHALL be invalid. Equality with `null` SHALL be permitted only for values whose Environment Schema or expression type allows null.

When `LIST_LITERALS` is enabled, a list literal SHALL contain type-compatible elements.

When `MEMBERSHIP` is enabled, `value in list` SHALL require `list` to have element type compatible with `value` and SHALL return `Bool`.

`value in []` SHALL evaluate to `false` when list literals and membership are enabled.

Verification: Test null equality, invalid null arithmetic/ordering, homogeneous and heterogeneous lists, membership, empty-list membership, and rejection when list or membership features are disabled.
Traceability: TYPE-001; SYNTAX-003; LANG-005.

## 4.3 References

### REF-001 — Static reference resolution

Every value reference SHALL resolve at compile time to either a previously declared visible local `const` binding in `PROGRAM` mode or an Environment Schema root/path.

An unknown root, unknown path, unavailable schema path, dynamic path, method call, or call expression SHALL be rejected during compilation.

Verification: Compile valid and invalid roots/paths in both source modes against multiple schemas and reject representative dynamic/call syntax.
Traceability: ENV-001; SYNTAX-004.

## 4.4 Direct Evaluation

### EVAL-001 — Known-input evaluation

When every dependency required by the selected execution path is known, the Embedded Language SHALL evaluate the Semantic AST to exactly one value conforming to the compiled source result type, or an evaluation failure.

Evaluation SHALL preserve `&&`, `||`, and applicable `PROGRAM` control-flow semantics so that unreachable failing expressions or statements do not fail the evaluation.

Verification: Evaluate representative program and expression sources with known inputs and multiple result types, including short-circuited failing expressions and program-only unreachable divide-by-zero branches/statements.
Traceability: LANG-001; LANG-002; TYPE-002; LANG-004; EVAL-IF-002.

### EVAL-002 — Deterministic values

For the same Semantic AST, Environment Schema, Compilation Profile, and input values, direct evaluation SHALL produce the same result or the same class of evaluation failure.

Verification: Re-evaluate identical inputs across repeated executions and compare results/failure classes.
Traceability: [Determinism](06-quality-and-performance-requirements.md#61-determinism); ENV-004.

## 4.5 Partial Evaluation

### PARTIAL-001 — Unknown-preserving evaluation

Partial evaluation SHALL evaluate any expression or applicable `PROGRAM` statement whose result/control-flow effect can be determined from known inputs without evaluating an unknown-dependent branch.

A source result that still depends on an unknown input SHALL remain as a typed residual Semantic AST expression conforming to the compiled source result type unless simplification eliminates that dependency.

Verification: Partially evaluate program and expression sources that mix known and unknown roots across multiple result types and inspect the residual Semantic AST.
Traceability: [Known and Unknown Inputs](02-overall-description.md#222-known-and-unknown-inputs); LANG-001; LANG-002.

### PARTIAL-002 — Constant folding and boolean simplification

Compilation and partial evaluation SHALL fold constants when Embedded Language semantics are unchanged.

At minimum, simplification SHALL preserve these identities when the applicable operators are enabled:

```text
true && X   -> X
false && X  -> false
true || X   -> true
false || X  -> X
!true       -> false
!false      -> true
```

A simplification SHALL NOT evaluate an expression, branch, or statement that direct evaluation would skip because of short-circuit or applicable `PROGRAM` control-flow semantics.

Verification: Test each identity in both source modes where applicable and skipped failing expressions/branches/statements.
Traceability: TYPE-002; EVAL-001.

### PARTIAL-003 — Residual result contract

A successful partial evaluation SHALL produce a concrete value or a residual Semantic AST expression whose static type conforms to the compiled source result type.

If internal corruption produces a result that does not conform to the compiled source result type, evaluation SHALL fail rather than reinterpret or coerce the result.

Verification: Inspect residual Semantic AST types for representative `Bool`, `String`, and `Number` program and expression sources and inject an incompatible internal result at a test boundary.
Traceability: LANG-001; LANG-002; EVAL-IF-002.

### PARTIAL-004 — Dependency metadata

The Semantic AST SHALL record the set of Environment Schema roots on which each relevant expression depends, or equivalent metadata that permits the partial evaluator to determine whether a subtree can be evaluated without recursively rediscovering its root dependencies.

Dependency metadata SHALL be preserved or recomputed correctly after control-flow normalization, constant folding, and residual rewriting.

Verification: Inspect dependency sets before and after simplification for constant, single-root, and multi-root expressions compiled through both source modes.
Traceability: [Known and Unknown Inputs](02-overall-description.md#222-known-and-unknown-inputs); PERF-002.
