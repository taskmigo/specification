# 2. Overall Description

## 2.1 Product Perspective

The Policy Language is a language subsystem between policy source and consuming features. The subsystem owns source parsing, binding, static typing, control-flow validation, typed Policy IR, direct evaluation, partial evaluation, and query-lowering capability analysis.

The required compilation and execution boundary is:

```text
Policy source
  -> ANTLR lexer/parser
  -> Surface AST
  -> Binding and type checking
  -> Control-flow validation
  -> Typed Policy IR
  -> Evaluation or partial evaluation
  -> Residual Policy IR
  -> Consumer query lowering
```

ANTLR parse-tree types SHALL remain a frontend concern. Evaluation, partial evaluation, and query-lowering consumers SHALL operate on language-owned representations rather than ANTLR parse-tree nodes.

## 2.2 Product Functions

The Policy Language subsystem provides:

- Deterministic parsing of the canonical policy-body syntax.
- Static root, path, operator, control-flow, and type validation against a consumer-provided Environment Schema.
- Compilation into typed Policy IR with source-location and dependency metadata.
- Strict boolean policy-result enforcement.
- Direct evaluation against known environment values.
- Partial evaluation against a known/unknown environment.
- Constant folding and boolean simplification.
- Queryability analysis for residual unknown-dependent predicates.
- A parser-independent and consumer-independent boundary for future language evolution.

### 2.2.1 Policy Model

A Policy Language source is the executable body of exactly one policy. It does not contain a module declaration, export declaration, wrapper function, arrow function, or other callable declaration.

The body MAY contain immutable `const` declarations and `if`/`else` control flow and SHALL terminate every reachable path with `return <expression>;` whose expression has static type `Bool`.

The Policy Language has no implicit return, truthiness conversion, automatic semicolon insertion, or ECMAScript module/function execution semantics.

### 2.2.2 Known and Unknown Inputs

Every compiled expression SHALL identify the Environment Schema roots on which it depends.

For one evaluation operation, the consumer SHALL provide each required root as either known or unknown. An expression that depends only on known values MAY be evaluated immediately. An expression that depends on an unknown value SHALL remain symbolic unless simplification proves that the unknown dependency cannot affect the result.

The Policy Language SHALL NOT assign domain meaning to a root name or determine which roots are known or unknown for a consumer operation.

### 2.2.3 Query-Lowering Boundary

The Policy Language SHALL NOT embed JPA, SQL, or another consumer persistence API in Policy IR.

A consumer MAY define which roots, fields, and operators are query-lowerable. After partial evaluation, every residual subtree that still depends on a query-bound unknown root SHALL be accepted only when the selected consumer contract can lower the subtree without changing Policy Language semantics.

## 2.3 Stakeholders and Users

The Policy Language is consumed by policy authors, feature components, Environment Schema providers, query-lowering adapters, and reviewers of language changes. This SRS does not prescribe an editor or user-interface implementation.

## 2.4 Operational Context and Scenarios

The following scenarios are supporting context, not additional normative requirements:

1. A consumer compiles a policy body once for an exact source/schema contract and evaluates it repeatedly with fully known inputs.
2. A consumer partially evaluates a policy with one or more roots marked unknown.
3. A known branch result removes an otherwise unknown-dependent residual predicate through constant/control-flow simplification.
4. A residual predicate that uses consumer-declared queryable fields/operators is lowered through a consumer adapter.

## 2.5 Out of Scope

The boundaries listed in [Scope](01-introduction.md#12-scope) remain outside this SRS. Consumer-domain semantics, persistence-specific execution, reusable policy modules, callable abstractions, and utility-function libraries are consumer or future-language concerns.
