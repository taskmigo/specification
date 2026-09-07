# 2. Overall Description

## 2.1 Product Perspective

The Embedded Language is a language subsystem between source text and execution inputs. The subsystem owns source parsing, binding, static typing, control-flow validation, Semantic AST construction, direct evaluation, and partial evaluation.

The required compilation and execution boundary is:

```text
Program source
  -> ANTLR lexer/parser
  -> Parse tree
  -> Semantic analysis
  -> Typed Semantic AST
  -> Evaluation or partial evaluation
  -> Value or residual Semantic AST
```

ANTLR parse-tree types SHALL remain a frontend concern. Evaluation and partial evaluation SHALL operate on the language-owned Semantic AST rather than ANTLR parse-tree nodes.

## 2.2 Product Functions

The Embedded Language subsystem provides:

- Deterministic parsing of the canonical program syntax.
- Static root, path, operator, control-flow, and type validation against an Environment Schema.
- Compilation into a typed Semantic AST with source-location and dependency metadata.
- Static program-result typing.
- Direct evaluation against known environment values.
- Partial evaluation against a known/unknown environment.
- Constant folding and type-preserving simplification.
- A parser-independent semantic boundary for future language evolution.

### 2.2.1 Program Model

An Embedded Language source is the executable body of exactly one program. It does not contain a module declaration, export declaration, wrapper function, arrow function, or other callable declaration in the current language version.

The program MAY contain immutable `const` declarations and `if`/`else` control flow. Every reachable control-flow path SHALL terminate with `return <expression>;`, and the compiler SHALL determine one static program result type from the reachable return expressions.

The program result type MAY be any type supported by the language and the Environment Schema.

The Embedded Language has no implicit return, truthiness conversion, automatic semicolon insertion, or ECMAScript module/function execution semantics.

### 2.2.2 Known and Unknown Inputs

Every Semantic AST expression SHALL identify the Environment Schema roots on which it depends.

For one evaluation operation, each required root SHALL be supplied as either known or unknown. An expression that depends only on known values MAY be evaluated immediately. An expression that depends on an unknown value SHALL remain symbolic unless simplification proves that the unknown dependency cannot affect the result.

## 2.3 Stakeholders and Users

The Embedded Language is used by program authors and Taskmigo components that compile or execute Embedded Language programs. This SRS does not prescribe an editor or user-interface implementation.

## 2.4 Operational Context and Scenarios

The following scenarios are supporting context, not additional normative requirements:

1. A program is compiled once into a Semantic AST for an exact source and Environment Schema.
2. The Semantic AST is evaluated repeatedly with fully known inputs.
3. The Semantic AST is partially evaluated with one or more unknown inputs.
4. A known branch result removes an unknown-dependent residual expression through constant or control-flow simplification.

## 2.5 Out of Scope

The boundaries listed in [Scope](01-introduction.md#12-scope) remain outside this SRS.
