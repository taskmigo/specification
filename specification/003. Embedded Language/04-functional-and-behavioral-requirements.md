# 4. Functional and Behavioral Requirements

## 4.1 Compilation and Typed Policy IR

### LANG-001 — Language-owned semantic representation

Policy Language source SHALL compile through the parser frontend into language-owned typed Policy IR.

Policy IR SHALL be independent of ANTLR parse-tree classes, ECMAScript semantics, callable/module semantics, consumer-domain semantics, and persistence APIs.

Verification: Inspect public/core policy types and confirm evaluator, partial evaluator, and query-lowering code do not consume ANTLR parse-tree, consumer-domain, or persistence types.
Traceability: [Product Perspective](02-overall-description.md#21-product-perspective); [Parser Frontend](07-constraints.md#71-parser-frontend).

### LANG-002 — Boolean policy result

Every reachable control-flow path of the policy body SHALL execute a `return` whose expression has static type `Bool`.

A policy containing a non-boolean return path or a reachable path that falls through end-of-source/end-of-block without reaching a later enclosing return SHALL be rejected during compilation. Runtime truthy/falsy conversion SHALL NOT exist.

Verification: Compile policy bodies whose reachable returns are boolean, string, number, null, list, or absent and accept only complete boolean-returning cases.
Traceability: [Policy Model](02-overall-description.md#221-policy-model); TYPE-001.

### LANG-003 — Immutable local bindings

A `const` declaration SHALL bind one immutable local name to the value of its expression.

A local binding SHALL be visible only after its declaration and within its lexical block and nested blocks. Duplicate local names in the same lexical scope, reassignment, and local names that conflict with reserved keywords SHALL be rejected.

Verification: Test sequential references, block visibility, forward-reference rejection, duplicate-name rejection, and the absence of assignment syntax.
Traceability: SYNTAX-001; [Language Restrictions](07-constraints.md#72-language-restrictions).

### LANG-004 — Conditional and return control flow

`if (<condition>) { ... }` SHALL require a `Bool` condition and SHALL follow the source delimiters defined by SYNTAX-003.

A `return <expression>;` SHALL immediately terminate evaluation of the current policy path. Statements following an executed return SHALL NOT be evaluated.

Only the selected `if`/`else` branch SHALL be evaluated when the condition is concrete.

During partial evaluation, a concrete condition SHALL select one branch. An unknown condition SHALL preserve the branch-dependent boolean result in residual Policy IR when both outcomes may affect the policy result.

Verification: Test direct and partial evaluation with true, false, and unknown conditions, `else if`, early return, and unreachable failing statements after return.
Traceability: TYPE-001; PARTIAL-001; QUERY-001.

## 4.2 Type System and Operators

### TYPE-001 — Static types and no implicit coercion

The Policy Language SHALL statically type every expression and reachable return before producing executable Policy IR.

The initial language SHALL support these value categories:

```text
Bool
String
Number
Null
List<T>
```

Environment Schema paths MAY additionally carry consumer-defined scalar types when their supported operators and equality semantics are declared by the schema.

The Policy Language SHALL NOT implicitly convert between booleans, strings, numbers, lists, null, or consumer-defined scalar types.

Verification: Compile valid same-type operations and reject mixed-type arithmetic, boolean coercion, string-to-number coercion, and list-to-scalar coercion.
Traceability: [Strict Semantics](07-constraints.md#73-strict-semantics).

### TYPE-002 — Boolean and equality operators

`&&`, `||`, and `!` SHALL operate only on `Bool`.

`&&` and `||` SHALL short-circuit when the left operand determines the result.

`==` and `!=` SHALL compare type-compatible operands and SHALL return `Bool`.

Verification: Test boolean type errors, short-circuit behavior with a failing right operand, and equality on compatible/incompatible types.
Traceability: LANG-002; EVAL-001.

### TYPE-003 — Ordering and arithmetic operators

`<`, `<=`, `>`, and `>=` SHALL operate only on operands whose type defines an ordering compatible with both operands.

`+`, `-`, `*`, `/`, `%`, unary `+`, and unary `-` SHALL operate only on `Number` unless a future specification explicitly adds another overload.

Numeric results SHALL be finite and deterministic. Division or modulo by zero, numeric overflow outside the implementation's supported finite range, or another invalid numeric operation SHALL be an evaluation failure.

Verification: Test valid numeric arithmetic/comparison and reject or fail for incompatible operands, divide-by-zero, modulo-by-zero, and non-finite results.
Traceability: [Determinism](06-quality-and-performance-requirements.md#61-determinism).

### TYPE-004 — Null, lists, and membership

`null` SHALL be a value, not an absent identifier and not an ECMAScript-style `undefined` value.

Ordering and arithmetic with `null` SHALL be invalid. Equality with `null` SHALL be permitted only for values whose Environment Schema or expression type allows null.

A list literal SHALL contain type-compatible elements.

`value in list` SHALL require `list` to have element type compatible with `value` and SHALL return `Bool`.

`value in []` SHALL evaluate to `false`.

Verification: Test null equality, invalid null arithmetic/ordering, homogeneous and heterogeneous lists, membership, and empty-list membership.
Traceability: TYPE-001; SYNTAX-003.

## 4.3 References

### REF-001 — Static reference resolution

Every value reference SHALL resolve at compile time to either a previously declared visible local `const` binding or an Environment Schema root/path.

An unknown root, unknown path, unavailable schema path, dynamic path, method call, or call expression SHALL be rejected during compilation.

Verification: Compile valid and invalid roots/paths against multiple schemas and reject representative dynamic/call syntax.
Traceability: ENV-001; SYNTAX-004.

## 4.4 Direct Evaluation

### EVAL-001 — Known-input evaluation

When every dependency required by the selected execution path is known, the Policy Language SHALL evaluate the policy body to exactly one `Bool` or an evaluation failure.

Evaluation SHALL preserve `&&`, `||`, `if`, and `return` semantics so that unreachable failing expressions or statements do not fail the evaluation.

Verification: Evaluate representative policies with known inputs, including unreachable divide-by-zero branches and statements after an executed return.
Traceability: TYPE-002; LANG-004; EVAL-IF-002.

### EVAL-002 — Deterministic values

For the same compiled policy, Environment Schema, and input values, direct evaluation SHALL produce the same result or the same class of evaluation failure.

Verification: Re-evaluate identical inputs across repeated executions and compare results/failure classes.
Traceability: [Determinism](06-quality-and-performance-requirements.md#61-determinism).

## 4.5 Partial Evaluation

### PARTIAL-001 — Unknown-preserving evaluation

Partial evaluation SHALL evaluate any statement or expression whose result/control-flow effect can be determined from known inputs without evaluating an unknown-dependent branch.

A policy result that still depends on an unknown input SHALL remain as typed residual Policy IR unless boolean/control-flow simplification eliminates that dependency.

Verification: Partially evaluate policies that mix known and unknown roots and inspect the residual typed IR.
Traceability: [Known and Unknown Inputs](02-overall-description.md#222-known-and-unknown-inputs).

### PARTIAL-002 — Constant folding and boolean simplification

Compilation and partial evaluation SHALL fold constants when Policy Language semantics are unchanged.

At minimum, simplification SHALL preserve these identities:

```text
true && X   -> X
false && X  -> false
true || X   -> true
false || X  -> X
!true       -> false
!false      -> true
```

A simplification SHALL NOT evaluate a branch or statement that direct evaluation would skip because of short-circuit, `if`, or `return` semantics.

Verification: Test each identity and skipped failing branches/statements.
Traceability: TYPE-002; EVAL-001.

### PARTIAL-003 — Residual boolean contract

A successful partial evaluation SHALL produce a concrete `Bool` or a residual expression whose static type is `Bool`.

A residual expression of another type SHALL be impossible for a valid compiled policy. If internal corruption produces such a result, evaluation SHALL fail at the consumer boundary rather than reinterpret the result.

Verification: Inspect residual types for representative policies and inject an invalid internal result in a test boundary.
Traceability: LANG-002; EVAL-IF-002.

### PARTIAL-004 — Dependency metadata

Compiled Policy IR SHALL record the set of Environment Schema roots on which each relevant expression depends, or equivalent metadata that permits the partial evaluator to determine whether a subtree can be evaluated without recursively rediscovering its root dependencies.

Dependency metadata SHALL be preserved or recomputed correctly after control-flow normalization, constant folding, and residual rewriting.

Verification: Inspect dependency sets before and after simplification for constant, single-root, and multi-root expressions.
Traceability: [Known and Unknown Inputs](02-overall-description.md#222-known-and-unknown-inputs); PERF-002.

## 4.6 Query-Lowering Capability

### QUERY-001 — Residual queryability

When a consumer contract marks an unknown root as query-bound, the Policy Language SHALL determine whether every possible residual operation that depends on that root is query-lowerable under the selected Environment Schema and query capability contract.

Control-flow constructs SHALL NOT hide residual operations from queryability analysis. Queryability SHALL be determined from the residual boolean semantics produced from the policy body.

Compilation for that consumer contract SHALL fail with `QueryabilityError` when a possible residual operation is not representable by the selected query-lowering capability.

Verification: Compile policies containing supported and unsupported residual fields/operators across `if`/return paths under multiple query capability contracts and confirm deterministic acceptance or `QueryabilityError`.
Traceability: [Query-Lowering Boundary](02-overall-description.md#223-query-lowering-boundary); ENV-001.

### QUERY-002 — Initial callable exclusion

The initial language SHALL NOT provide built-in, registered, or source-declared functions or other callable expressions for runtime evaluation or query lowering.

Calls such as the following SHALL be rejected:

```text
startsWith(record.name, "task-")
contains(context.tags, "admin")
lower(record.email)
lookup(record.id)
```

A future callable/utility-function contract SHALL require an explicit language-specification revision defining syntax, type, runtime, partial-evaluation, and query-lowering semantics before such calls become valid.

Verification: Reject representative call expressions under multiple consumer schemas.
Traceability: SYNTAX-004; [Scope](01-introduction.md#12-scope).

### QUERY-003 — Persistence independence

Policy IR and Policy Language evaluation SHALL NOT reference JPA Criteria, JPA Specification, SQL syntax, database entities, or another persistence-specific API.

Persistence-specific lowering SHALL occur behind the consumer query-lowering boundary.

Verification: Inspect module/package dependencies and execute a query-lowering adapter test without exposing persistence types in Policy IR.
Traceability: LANG-001; [Requirements Allocation](08-requirements-allocation-and-dependencies.md#82-requirements-allocation).
