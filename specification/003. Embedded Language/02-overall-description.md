# 2. Overall Description

## 2.1 Product Perspective

The Embedded Language is a language subsystem between source text and execution inputs. The subsystem owns source parsing, binding, static typing, applicable control-flow validation, compilation-profile enforcement, Semantic AST construction, direct evaluation, and partial evaluation.

The required compilation and execution boundary is:

```text
Source + Compilation Profile
  -> Select PROGRAM or EXPRESSION parser entry
  -> ANTLR lexer/parser
  -> Parse tree
  -> Semantic analysis and feature validation
  -> Typed Semantic AST
  -> Evaluation or partial evaluation
  -> Value or residual Semantic AST
```

ANTLR parse-tree types SHALL remain a frontend concern. Evaluation and partial evaluation SHALL operate on the language-owned Semantic AST rather than ANTLR parse-tree nodes.

## 2.2 Product Functions

The Embedded Language subsystem provides:

- Deterministic parsing of canonical program and expression source modes.
- Consumer-defined compilation profiles that select one source mode and restrict enabled language feature families.
- Static root, path, operator, applicable control-flow, and type validation against an Environment Schema.
- Compilation into a typed Semantic AST with source-location and dependency metadata.
- Static source-result typing.
- Direct evaluation against known environment values.
- Partial evaluation against a known/unknown environment.
- Constant folding and type-preserving simplification.
- A parser-independent semantic boundary for future language evolution.

### 2.2.1 Program Model

The Embedded Language exposes two source modes:

- `PROGRAM` mode is the executable body of exactly one statement-bearing program. It MAY contain immutable `const` declarations and `if`/`else` control flow. Every reachable control-flow path SHALL terminate with `return <expression>;`, and the compiler SHALL determine one static result type from the reachable return expressions.
- `EXPRESSION` mode is exactly one expression followed by end-of-source. It SHALL NOT contain statement syntax or require a `return` wrapper. The static result type is the type of the expression.

Both modes use the same expression grammar, type system, Environment Schema, Semantic AST expression model, evaluation semantics, and partial-evaluation semantics.

The source result type MAY be any type supported by the language and the Environment Schema.

Neither source mode contains a module declaration, export declaration, wrapper function, arrow function, or other callable declaration in the current language version. The Embedded Language has no implicit return, truthiness conversion, automatic semicolon insertion, or ECMAScript module/function execution semantics.

### 2.2.2 Known and Unknown Inputs

Every Semantic AST expression SHALL identify the Environment Schema roots on which it depends.

For one evaluation operation, each required root SHALL be supplied as either known or unknown. An expression that depends only on known values MAY be evaluated immediately. An expression that depends on an unknown value SHALL remain symbolic unless simplification proves that the unknown dependency cannot affect the result.

### 2.2.3 Compilation Profiles

Every compilation SHALL use a Compilation Profile that selects one source mode and defines the language feature families enabled for that source.

The profile is a consumer-owned restriction of the canonical Embedded Language. It SHALL NOT add syntax, operators, root names, coercions, runtime behavior, or Semantic AST semantics not defined by this SRS.

A disabled feature SHALL remain part of the canonical language grammar but SHALL be rejected for compilations using a profile that disables it. This permits different consumers to use different bounded subsets without creating separate languages or parser implementations.

## 2.3 Stakeholders and Users

The Embedded Language is used by source authors and Taskmigo components that compile or execute Embedded Language sources. This SRS does not prescribe an editor or user-interface implementation.

## 2.4 Operational Context and Scenarios

The following scenarios are supporting context, not additional normative requirements:

1. A `PROGRAM` source is compiled once into a Semantic AST for an exact source, Environment Schema, and Compilation Profile.
2. An `EXPRESSION` source is compiled through the shared expression grammar without a statement wrapper.
3. A consumer disables language features that are valid in the canonical language but outside that consumer's accepted source subset.
4. The Semantic AST is evaluated repeatedly with fully known inputs.
5. The Semantic AST is partially evaluated with one or more unknown inputs.
6. A known branch result removes an unknown-dependent residual expression through constant or control-flow simplification.

## 2.5 Out of Scope

The boundaries listed in [Scope](01-introduction.md#12-scope) remain outside this SRS.
