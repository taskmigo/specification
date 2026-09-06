# 4. Functional and Behavioral Requirements

## 4.1 Compilation and Typed Policy IR

### LANG-001 — Taskmigo-owned semantic representation

TPL source SHALL compile through the parser frontend into Taskmigo-owned typed Policy IR.

Policy IR SHALL be independent of ANTLR parse-tree classes, ECMAScript semantics, and persistence APIs.

Verification: Inspect public/core policy types and confirm evaluator, partial evaluator, and query-lowering code do not consume ANTLR parse-tree or persistence types.
Traceability: [Product Perspective](02-overall-description.md#21-product-perspective); [Parser Frontend](07-constraints.md#71-parser-frontend).

### LANG-002 — Boolean default-policy result

Every reachable path of the default-exported function SHALL return a value of static type `Bool`.

A default-exported function with a non-boolean return path or a reachable path that falls through without `return` SHALL be rejected during compilation. Runtime truthy/falsy conversion SHALL NOT exist.

Verification: Compile default functions whose paths return boolean, string, number, null, list, or no value and accept only complete boolean-returning cases.
Traceability: [Policy Model](02-overall-description.md#221-policy-model); TYPE-001.

### LANG-003 — Immutable local bindings

A `const` declaration SHALL bind one immutable local name to the value of its expression.

A local binding SHALL be visible only after its declaration and within its lexical block. Duplicate local names in the same function, shadowing of another local name in the same function, and local names that conflict with reserved keywords SHALL be rejected.

`const` bindings SHALL NOT introduce mutation, reassignment, or observable side effects.

Verification: Test sequential references, block visibility, forward-reference rejection, duplicate/shadow rejection, and the absence of assignment syntax.
Traceability: SYNTAX-001; [Language Restrictions](07-constraints.md#72-language-restrictions).

### LANG-004 — Conditional statement

`if (<condition>) { ... }` SHALL require a `Bool` condition. Parentheses and braces SHALL be required by the source contract.

Only the selected branch SHALL be evaluated when the condition is concrete.

During partial evaluation, a concrete condition SHALL select one branch. An unknown condition SHALL preserve the branch-dependent boolean semantics in residual Policy IR when required to determine the default function result.

Verification: Test direct and partial evaluation with true, false, and unknown conditions, including `else if` and `else` paths.
Traceability: TYPE-001; PARTIAL-001; QUERY-001.

## 4.2 Functions and Exports

### FUNC-001 — Source-declared functions only

A function call SHALL resolve at compile time to a top-level function declared in the same policy source.

The initial language SHALL support only zero-argument functions and zero-argument calls. Functions MAY read Environment Schema roots and previously visible local values within their own body; functions SHALL NOT capture caller-local variables.

An undeclared call, including a call to a utility-style name such as `startsWith`, `endsWith`, `contains`, `lower`, or `resource`, SHALL be rejected during compilation.

Verification: Compile calls to declared functions, reject undeclared utility-style calls, and reject function parameters or call arguments.
Traceability: SYNTAX-002; ENV-001.

### FUNC-002 — Function return typing

Every callable source-declared function SHALL return a value on every reachable path. All reachable return values of one function SHALL have one compatible static type.

The compiler SHALL infer the function return type from its return expressions after binding and type checking. Falling through a reachable function path SHALL be a compile-time error rather than an `undefined` result.

Verification: Compile helper functions with consistent and inconsistent return paths/types and reject reachable fall-through.
Traceability: TYPE-001; [Strict Semantics](07-constraints.md#73-strict-semantics).

### FUNC-003 — Acyclic call graph

Direct and indirect recursion SHALL be rejected during compilation.

The compiler SHALL construct or otherwise validate a finite acyclic call graph for all functions reachable from the default-exported function.

Source-declared function calls SHALL be represented or lowered so that evaluation, partial evaluation, dependency analysis, and residual queryability are derived from the called function body without arbitrary host-language dispatch.

Verification: Accept an acyclic helper chain, reject direct recursion and a multi-function cycle, and inspect residual queryability through a helper function referencing `object`.
Traceability: PARTIAL-004; QUERY-001; QUAL-002.

### FUNC-004 — Export contract

Exactly one top-level function SHALL be declared with `export default` and SHALL serve as the only policy entry point.

A non-default `export function <name>() { ... }` SHALL be permitted. Named exports SHALL NOT create a cross-policy import or linking mechanism in this version.

Duplicate exported names, multiple default exports, or a default export that is not a function declaration SHALL be rejected.

Verification: Test valid named/default exports and each invalid export form.
Traceability: SYNTAX-001; LANG-002.

## 4.3 Type System and Operators

### TYPE-001 — Static types and no implicit coercion

TPL SHALL statically type every expression and function return before producing executable Policy IR.

The initial language SHALL support these value categories:

```text
Bool
String
Number
Null
List<T>
```

Environment Schema paths MAY additionally carry consumer-defined scalar types when their supported operators and equality semantics are declared by the schema.

TPL SHALL NOT implicitly convert between booleans, strings, numbers, lists, null, or consumer-defined scalar types.

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

Verification: Test valid numeric arithmetic/comparison and reject or fail closed for incompatible operands, divide-by-zero, modulo-by-zero, and non-finite results.
Traceability: [Determinism](06-quality-and-performance-requirements.md#61-determinism).

### TYPE-004 — Null, lists, and membership

`null` SHALL be a value, not an absent identifier and not an ECMAScript-style `undefined` value.

Ordering and arithmetic with `null` SHALL be invalid. Equality with `null` SHALL be permitted only for values whose Environment Schema or expression type allows null.

A list literal SHALL contain type-compatible elements.

`value in list` SHALL require `list` to have element type compatible with `value` and SHALL return `Bool`.

`value in []` SHALL evaluate to `false`.

Verification: Test null equality, invalid null arithmetic/ordering, homogeneous and heterogeneous lists, membership, and empty-list membership.
Traceability: TYPE-001; SYNTAX-003.

## 4.4 References

### REF-001 — Static reference resolution

Every value reference SHALL resolve at compile time to either a previously declared local `const` binding or an Environment Schema root/path. Every call SHALL resolve according to FUNC-001.

An unknown root, unknown path, unavailable scope-specific path, dynamic path, or unknown call target SHALL be rejected before activation.

Verification: Compile valid and invalid roots/paths/calls against multiple schemas and confirm deterministic resolution.
Traceability: ENV-001; SYNTAX-004; FUNC-001.

## 4.5 Direct Evaluation

### EVAL-001 — Known-input evaluation

When every dependency required by the selected execution path is known, TPL SHALL evaluate the default-exported function to exactly one `Bool` or an evaluation failure.

Evaluation SHALL preserve `&&`, `||`, `if`, and function return semantics so that an unreachable failing expression does not fail the evaluation.

Verification: Evaluate representative policies with known inputs, including unreachable divide-by-zero branches and helper-function calls.
Traceability: TYPE-002; LANG-004; EVAL-IF-002.

### EVAL-002 — Deterministic values

For the same compiled policy, Environment Schema, and input values, direct evaluation SHALL produce the same result or the same class of evaluation failure.

Verification: Re-evaluate identical inputs across repeated executions and compare results/failure classes.
Traceability: [Determinism](06-quality-and-performance-requirements.md#61-determinism).

## 4.6 Partial Evaluation

### PARTIAL-001 — Unknown-preserving evaluation

Partial evaluation SHALL evaluate any expression or function path whose value can be determined from known inputs without evaluating an unknown-dependent branch.

A result that still depends on an unknown input SHALL remain as typed residual Policy IR unless boolean simplification eliminates that dependency.

Verification: Partially evaluate policies that mix known and unknown roots, including helper functions, and inspect the residual typed IR.
Traceability: [Known and Unknown Inputs](02-overall-description.md#222-known-and-unknown-inputs).

### PARTIAL-002 — Constant folding and boolean simplification

Compilation and partial evaluation SHALL fold constants when TPL semantics are unchanged.

At minimum, simplification SHALL preserve these identities:

```text
true && X   -> X
false && X  -> false
true || X   -> true
false || X  -> X
!true       -> false
!false      -> true
```

A simplification SHALL NOT evaluate a branch that direct evaluation would skip because of short-circuit or `if` semantics.

Verification: Test each identity and a skipped failing branch.
Traceability: TYPE-002; EVAL-001.

### PARTIAL-003 — Residual boolean contract

A successful partial evaluation of the default-exported policy SHALL produce a concrete `Bool` or a residual expression whose static type is `Bool`.

A residual expression of another type SHALL be impossible for a valid compiled policy. If internal corruption produces such a result, evaluation SHALL fail closed at the consumer boundary.

Verification: Inspect residual types for representative policies and inject an invalid internal result in a test boundary.
Traceability: LANG-002; EVAL-IF-002.

### PARTIAL-004 — Dependency metadata

Compiled Policy IR SHALL record the set of environment roots on which each expression and reachable source-declared function depends, or equivalent metadata that permits the partial evaluator to determine whether an expression can be evaluated without recursively rediscovering its root dependencies.

Dependency metadata SHALL be preserved or recomputed correctly after constant folding, function-call lowering, and residual rewriting.

Verification: Inspect dependency sets before and after simplification for constant, single-root, multi-root, and helper-function expressions.
Traceability: [Known and Unknown Inputs](02-overall-description.md#222-known-and-unknown-inputs); PERF-002.

## 4.7 Query-Lowering Capability

### QUERY-001 — Residual queryability

A consumer that requires database-side evaluation of an unknown root SHALL validate, before policy activation for that consumer mapping, that every possible residual unknown-dependent operation is query-lowerable under the selected Environment Schema.

Source-declared function boundaries SHALL NOT hide residual operations from queryability analysis. Queryability SHALL be determined from the function body semantics reachable from the default-exported function.

A consumer SHALL NOT defer a known queryability incompatibility until unrestricted business rows have been loaded.

Verification: Activate policies containing supported and unsupported residual fields/operators directly and through helper functions and confirm unsupported policies are rejected before use.
Traceability: [Query-Lowering Boundary](02-overall-description.md#223-query-lowering-boundary); [Authorization Object filtering](../002.%20Authorization/04-functional-and-behavioral-requirements.md#43-object-authorization-and-shared-filter-ast).

### QUERY-002 — Initial utility-function exclusion

The initial language SHALL NOT provide built-in or registered utility functions for runtime evaluation or query lowering.

Calls such as the following SHALL be rejected unless the source itself declares a zero-argument function with that exact name:

```text
startsWith(...)
endsWith(...)
contains(...)
lower(...)
resource(...)
```

A future utility-function contract SHALL require an explicit language-specification revision defining type, runtime, partial-evaluation, and query-lowering semantics before such a function becomes built in.

Verification: Reject representative undeclared utility calls in Request and Object policies.
Traceability: FUNC-001; [Scope](01-introduction.md#12-scope).

### QUERY-003 — Persistence independence

Policy IR and TPL evaluation SHALL NOT reference JPA Criteria, JPA Specification, SQL syntax, database entities, or another persistence-specific API.

Persistence-specific lowering SHALL occur behind the consumer query-lowering boundary.

Verification: Inspect module/package dependencies and execute a query-lowering adapter test without exposing persistence types in Policy IR.
Traceability: LANG-001; [Requirements Allocation](08-requirements-allocation-and-dependencies.md#82-requirements-allocation).
