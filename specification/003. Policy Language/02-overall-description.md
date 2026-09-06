# 2. Overall Description

## 2.1 Product Perspective

TPL is a policy-language subsystem between policy source and Taskmigo authorization/query consumers. The subsystem owns source parsing, binding, static typing, function-call analysis, typed Policy IR, direct evaluation, partial evaluation, and query-lowering capability analysis.

The required compilation and execution boundary is:

```text
TPL source
  -> ANTLR lexer/parser
  -> Surface AST
  -> Binding and type checking
  -> Function-call analysis
  -> Typed Policy IR
  -> Evaluation or partial evaluation
  -> Residual Policy IR
  -> Consumer query lowering
```

ANTLR parse-tree types SHALL remain a frontend concern. Authorization, partial evaluation, and query-lowering consumers SHALL operate on Taskmigo-owned representations rather than ANTLR parse-tree nodes.

## 2.2 Product Functions

The TPL subsystem provides:

- Deterministic parsing of the canonical TPL source syntax.
- Static export, function, root, path, operator, and type validation.
- Compilation into typed Policy IR with source-location and dependency metadata.
- Strict boolean default-policy result enforcement.
- Direct evaluation against known environment values.
- Partial evaluation against a known/unknown environment.
- Constant folding and boolean simplification.
- Queryability analysis for residual unknown-dependent predicates.
- A parser-independent and persistence-independent boundary for future language evolution.

### 2.2.1 Policy Model

A TPL source is a policy unit containing top-level function declarations and exactly one default export.

The default export SHALL be one of these forms:

```text
export default function policy() { ... }
export default function() { ... }
export default () => { ... };
export default () => expression;
```

Named helper functions use `function <name>() { ... }` and MAY use `export function <name>() { ... }`. Named exports do not create cross-policy imports in this version.

Functions in the initial language take no parameters, may read values exposed through the Environment Schema, may declare immutable local `const` bindings, and may call other source-declared named functions.

Every reachable path of a block-bodied default export SHALL return a value of static type `Bool`. A concise arrow default export SHALL have an expression of static type `Bool`.

TPL has no truthiness conversion, automatic semicolon insertion, or ECMAScript module execution semantics.

### 2.2.2 Known and Unknown Inputs

Every compiled expression SHALL identify the environment roots on which it depends.

Evaluation SHALL treat a root as either known or unknown for one evaluation operation. An expression that depends only on known values MAY be evaluated immediately. An expression that depends on an unknown value SHALL remain symbolic unless simplification proves that the unknown dependency cannot affect the result.

For the initial [Authorization feature](../002.%20Authorization/README.md), Request Authorization supplies known `principal` and `request` roots. Object Authorization supplies known `principal` and `request` roots while treating `object` as unknown during partial evaluation.

### 2.2.3 Query-Lowering Boundary

TPL SHALL NOT embed JPA, SQL, or another persistence API in Policy IR.

A consumer SHALL be able to define which roots, fields, and operators are query-lowerable. Before consumer query lowering, source-declared function calls SHALL have been analyzed so that queryability is determined from the called function body rather than from a host-language call boundary.

After partial evaluation, every residual subtree that still depends on a query-bound unknown root SHALL be accepted only when the consumer can lower the subtree without changing TPL semantics.

## 2.3 Stakeholders and Users

TPL is consumed by policy authors, authorization components, schema providers, query-lowering adapters, and reviewers of policy-language changes. This SRS does not prescribe an editor or user-interface implementation.

## 2.4 Operational Context and Scenarios

The following scenarios are supporting context, not additional normative requirements:

1. A Request policy is compiled once for an exact policy revision and its default-exported policy function is evaluated repeatedly with known `principal` and `request` values.
2. An Object policy is compiled, then partially evaluated with known request/principal values while `object` remains symbolic.
3. A named helper function encapsulates an object predicate and is statically resolved from the default export.
4. An Object policy whose known branch resolves to `true` produces no residual object restriction.
5. An Object policy whose residual expression references a queryable object field is lowered by the Authorization consumer into its persistence-neutral filter representation.

## 2.5 Out of Scope

The boundaries listed in [Scope](01-introduction.md#12-scope) remain outside this SRS. Persistence-specific execution, authorization effect composition, business-resource resolution, utility-function libraries, and cross-policy imports are consumer or future-language concerns.
