# 2. Overall Description

## 2.1 Compiler and evaluator pipeline

Language transforms source text and a declared compilation environment into a **typed, language-owned Semantic AST**. The observable processing model is:

```text
Source + Environment Schema + Compilation Profile
  → mode-specific ANTLR parse entry
  → lexical and syntactic diagnostics
  → reference binding, feature validation, typing and control-flow checks
  → immutable typed Semantic AST + result type + dependencies
  → concrete evaluation OR partial evaluation
  → compatible value OR typed residual expression OR explicit failure
```

ANTLR parse trees SHALL not escape as public semantic artifacts. A consumer SHALL receive typed results/diagnostics rather than having to inspect parser-specific node implementations.

## 2.2 Source modes

`PROGRAM` accepts a sequence of statements with immutable `const` declarations and bounded `if`/`else` control flow when features are enabled. Every reachable execution path SHALL yield a `return` value. `EXPRESSION` accepts exactly one expression and no wrapper, assignment or `return`. Both use the same expression semantics.

## 2.3 Types and bounded operations

The canonical values include Boolean, String, Number, Null and typed List values, with schema-defined scalar/structured references where declared. Operators are statically checked; incompatible values are **not** implicitly coerced. With the relevant feature enabled, `len(value)` operates on compatible String/List inputs and `contains(text, substring)` performs string containment. `all`, `any`, and `none` are bounded quantifiers with a restricted predicate-only lambda.

## 2.4 Profiles and consumers

Profiles select the source mode and accepted feature families. Authorization Request compilation uses PROGRAM; Object Authorization and client FilterBy use EXPRESSION with narrower valid expression shapes. A general grammar production or built-in intrinsic SHALL not be exposed to those consumers unless their own SRS explicitly allows it.

## 2.5 Known and symbolic evaluation

Direct evaluation resolves concrete, schema-conforming values. Partial evaluation substitutes known inputs without evaluating skipped branches or unknown-dependent paths; remaining unknown parts are represented as a typed residual Semantic AST. The same schema/profile/artifact identity controls safe reuse; an incompatible identity is not valid evidence for reuse.

## 2.6 Consumers and exclusions

Primary users are Taskmigo modules compiling embedded expressions and trusted policy/query code—not a browser-facing Language administration API. Consumer-specific database translation, User roles, field allowlists, network access and arbitrary scripting are outside Language's ownership boundary.
