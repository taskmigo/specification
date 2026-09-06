# 4. Functional and Behavioral Requirements

## 4.1 Compilation and Typed Policy IR

### LANG-001 — Taskmigo-owned semantic representation

TPL source SHALL compile through the parser frontend into Taskmigo-owned typed Policy IR.

Policy IR SHALL be independent of ANTLR parse-tree classes, ECMAScript semantics, and persistence APIs.

Verification: Inspect public/core policy types and confirm evaluator, partial evaluator, and query-lowering code do not consume ANTLR parse-tree or persistence types.
Traceability: [Product Perspective](02-overall-description.md#21-product-perspective); [Parser Frontend](07-constraints.md#71-parser-frontend).

### LANG-002 — Boolean policy result

The final policy expression SHALL have static type `Bool`.

A policy whose final expression has any other type SHALL be rejected during compilation. Runtime truthy/falsy conversion SHALL NOT exist.

Verification: Compile policies whose final expressions are boolean, string, number, null, and list values and accept only the boolean cases.
Traceability: [Policy Model](02-overall-description.md#221-policy-model); TYPE-001.

### LANG-003 — Immutable local bindings

A `let` declaration SHALL bind one immutable local name to the value of its expression for the remainder of the policy.

A local binding SHALL be visible only after its declaration. Duplicate local names and local names that conflict with reserved keywords SHALL be rejected.

`let` bindings SHALL NOT introduce mutation, assignment after declaration, or observable side effects.

Verification: Test sequential references, forward-reference rejection, duplicate-name rejection, and the absence of assignment syntax.
Traceability: SYNTAX-001; [Language Restrictions](07-constraints.md#72-language-restrictions).

### LANG-004 — Conditional expression

`if <condition> then <true-expression> else <false-expression>` SHALL require a `Bool` condition and type-compatible branch expressions.

Only the selected branch SHALL be evaluated when the condition is concrete.

During partial evaluation, a concrete condition SHALL select one branch; an unknown condition MAY remain residual only when the resulting conditional expression is valid for the target consumer.

Verification: Test direct and partial evaluation with true, false, and unknown conditions.
Traceability: TYPE-001; PARTIAL-001; QUERY-001.

## 4.2 Type System and Operators

### TYPE-001 — Static types and no implicit coercion

TPL SHALL statically type every expression before producing executable Policy IR.

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

`and`, `or`, and `not` SHALL operate only on `Bool`.

`and` and `or` SHALL short-circuit when the left operand determines the result.

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

## 4.3 References and Intrinsics

### REF-001 — Static reference resolution

Every reference SHALL resolve at compile time to either a previously declared local binding or an Environment Schema root/path.

An unknown root, unknown path, unavailable scope-specific path, or dynamic path SHALL be rejected before activation.

Verification: Compile valid and invalid roots/paths against multiple schemas and confirm deterministic resolution.
Traceability: ENV-001; SYNTAX-004.

### INTR-001 — Registered pure intrinsics

A function call SHALL resolve only to a registered TPL intrinsic.

Each intrinsic SHALL declare:

- A stable TPL name.
- A static function signature.
- Deterministic, side-effect-free runtime semantics.
- Whether it can be constant-folded when all arguments are known.
- Whether and how it can be query-lowered for each supported consumer capability.

Unknown intrinsics and calls whose arguments do not match the declared signature SHALL be rejected during compilation.

Verification: Register a test intrinsic, compile valid/invalid calls, evaluate known arguments, and reject unknown or type-incompatible calls.
Traceability: [Query-Lowering Boundary](02-overall-description.md#223-query-lowering-boundary); QUERY-002.

### INTR-002 — No host method dispatch

TPL intrinsic resolution SHALL NOT invoke arbitrary methods based on runtime object types, reflection, application beans, or host-language overload resolution.

Verification: Attempt to use method-style and unregistered host calls and confirm compile-time rejection.
Traceability: [Isolation and Host Access](07-constraints.md#74-isolation-and-host-access).

## 4.4 Direct Evaluation

### EVAL-001 — Known-input evaluation

When every dependency required by the selected execution path is known, TPL SHALL evaluate the policy to exactly one `Bool` or an evaluation failure.

Evaluation SHALL preserve short-circuit and conditional branch semantics so that an unreachable failing expression does not fail the evaluation.

Verification: Evaluate representative policies with known inputs, including unreachable divide-by-zero or failing intrinsic branches.
Traceability: TYPE-002; LANG-004; EVAL-IF-002.

### EVAL-002 — Deterministic values

For the same compiled policy, Environment Schema, intrinsic definitions, and input values, direct evaluation SHALL produce the same result or the same class of evaluation failure.

Verification: Re-evaluate identical inputs across repeated executions and compare results/failure classes.
Traceability: [Determinism](06-quality-and-performance-requirements.md#61-determinism).

## 4.5 Partial Evaluation

### PARTIAL-001 — Unknown-preserving evaluation

Partial evaluation SHALL evaluate any subexpression whose value can be determined from known inputs without evaluating an unknown-dependent branch.

A subexpression whose result still depends on an unknown input SHALL remain as typed residual Policy IR unless boolean simplification eliminates that dependency.

Verification: Partially evaluate expressions that mix known and unknown roots and inspect the residual typed IR.
Traceability: [Known and Unknown Inputs](02-overall-description.md#222-known-and-unknown-inputs).

### PARTIAL-002 — Constant folding and boolean simplification

Compilation and partial evaluation SHALL fold constants when TPL semantics are unchanged.

At minimum, simplification SHALL preserve these identities:

```text
true and X   -> X
false and X  -> false
true or X    -> true
false or X   -> X
not true     -> false
not false    -> true
```

A simplification SHALL NOT evaluate a branch that direct evaluation would skip because of short-circuit or conditional semantics.

Verification: Test each identity and a skipped failing branch.
Traceability: TYPE-002; EVAL-001.

### PARTIAL-003 — Residual boolean contract

A successful partial evaluation SHALL produce a concrete `Bool` or a residual expression whose static type is `Bool`.

A residual expression of another type SHALL be impossible for a valid compiled policy. If internal corruption or an intrinsic contract violation produces such a result, evaluation SHALL fail closed at the consumer boundary.

Verification: Inspect residual types for representative policies and inject an invalid intrinsic contract in a test boundary.
Traceability: LANG-002; EVAL-IF-002.

### PARTIAL-004 — Dependency metadata

Compiled Policy IR SHALL record the set of environment roots on which each expression depends, or equivalent metadata that permits the partial evaluator to determine whether an expression can be evaluated without recursively rediscovering its root dependencies.

Dependency metadata SHALL be preserved or recomputed correctly after constant folding and residual rewriting.

Verification: Inspect dependency sets before and after simplification for constant, single-root, and multi-root expressions.
Traceability: [Known and Unknown Inputs](02-overall-description.md#222-known-and-unknown-inputs); PERF-002.

## 4.6 Query-Lowering Capability

### QUERY-001 — Residual queryability

A consumer that requires database-side evaluation of an unknown root SHALL validate, before policy activation for that consumer mapping, that every possible residual unknown-dependent operation is query-lowerable under the selected Environment Schema and intrinsic capabilities.

A consumer SHALL NOT defer a known queryability incompatibility until unrestricted business rows have been loaded.

Verification: Activate policies containing supported and unsupported residual fields/operators and confirm unsupported policies are rejected before use.
Traceability: [Query-Lowering Boundary](02-overall-description.md#223-query-lowering-boundary); [Authorization Object filtering](../002.%20Authorization/04-functional-and-behavioral-requirements.md#43-object-authorization-and-shared-filter-ast).

### QUERY-002 — Intrinsic query-lowering contract

A registered intrinsic MAY be runtime-only or query-lowerable.

When an intrinsic call remains in a residual predicate, the consumer SHALL accept it only when the intrinsic provides a query-lowering capability compatible with the selected Environment Schema.

The query-lowering implementation SHALL preserve the intrinsic's TPL semantics for the supported input types and nullability.

Verification: Test one runtime-only intrinsic and one query-lowerable intrinsic in direct and residual contexts.
Traceability: INTR-001; QUERY-001.

### QUERY-003 — Persistence independence

Policy IR and TPL evaluation SHALL NOT reference JPA Criteria, JPA Specification, SQL syntax, database entities, or another persistence-specific API.

Persistence-specific lowering SHALL occur behind the consumer query-lowering boundary.

Verification: Inspect module/package dependencies and execute a query-lowering adapter test without exposing persistence types in Policy IR.
Traceability: LANG-001; [Requirements Allocation](08-requirements-allocation-and-dependencies.md#82-requirements-allocation).
