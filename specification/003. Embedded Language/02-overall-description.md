# 2. Overall Description

## 2.1 Product Perspective

The Embedded Language is a language subsystem between source text and execution inputs. The subsystem owns source parsing, Compilation Profile enforcement, binding, static typing, applicable control-flow validation, Semantic AST construction, direct evaluation, and partial evaluation.

The required boundary is:

```text
Source + Compilation Profile
  -> PROGRAM or EXPRESSION parser entry
  -> ANTLR lexer/parser
  -> Parse tree
  -> Semantic analysis and feature validation
  -> Typed Semantic AST
  -> Evaluation or partial evaluation
  -> Concrete value or residual Semantic AST
```

ANTLR parse-tree types SHALL remain a frontend concern. Evaluation and partial evaluation SHALL consume the language-owned Semantic AST.

## 2.2 Product Functions

The Embedded Language provides:

- Deterministic parsing of canonical `PROGRAM` and `EXPRESSION` sources.
- Consumer-defined profiles that restrict enabled feature families without defining another language.
- Static root/path, operator, intrinsic, lexical-binding, control-flow, and type validation.
- Typed Semantic AST construction with source-location and dependency metadata.
- Static source-result typing.
- Direct evaluation and unknown-preserving partial evaluation.
- Constant folding and type-preserving simplification.

### 2.2.1 Source Modes

`PROGRAM` mode is one statement-bearing program. It MAY contain immutable `const` declarations and `if`/`else` control flow. Every reachable control-flow path SHALL terminate with `return <expression>;`.

`EXPRESSION` mode is exactly one expression followed by end-of-source. It SHALL NOT contain statement syntax or require a `return` wrapper.

Both modes SHALL use the same expression semantics and Semantic AST expression model.

### 2.2.2 Known and Unknown Inputs

Every relevant Semantic AST expression SHALL identify the Environment Schema roots on which it depends, or equivalent metadata sufficient for partial evaluation.

For one evaluation operation, each required root SHALL be supplied as known or unknown. Unknown-dependent expressions SHALL remain symbolic unless simplification proves that the unknown dependency cannot affect the result.

### 2.2.3 Compilation Profiles

Every compilation SHALL use a Compilation Profile selecting one source mode and enabled canonical feature families.

A Compilation Profile SHALL only restrict the canonical language. It SHALL NOT add syntax, types, coercions, roots, intrinsics, evaluation behavior, or Semantic AST semantics.

### 2.2.4 Bounded Collection Expressions

When enabled, collection quantifiers SHALL use bounded intrinsic forms such as:

```text
all(values, value => predicate)
any(values, value => predicate)
none(values, value => predicate)
```

The restricted lambda introduces one lexical element binding scoped to the quantifier predicate. It SHALL NOT be a first-class callable value.

## 2.3 Stakeholders and Users

The language is consumed by source authors and Taskmigo components that compile or execute Embedded Language sources. Consumer-specific purposes remain outside the language contract.

## 2.4 Operational Context and Scenarios

The following scenarios are supporting context, not additional requirements:

1. A `PROGRAM` source is compiled against an Environment Schema and Compilation Profile and evaluated repeatedly.
2. An `EXPRESSION` source is compiled through the shared expression grammar without a statement wrapper.
3. A consumer disables canonical features outside its accepted source subset.
4. Partial evaluation specializes known values and preserves unknown-dependent residual expressions.
5. A symbolic collection quantifier remains a typed residual Semantic AST expression for a downstream consumer.

## 2.5 Out of Scope

Consumer-specific policy meanings, persistence translation, query APIs, and business-domain root names are outside this SRS.
