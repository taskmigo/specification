# 7. Constraints

## 7.1 Parser Frontend

### TECH-001 — ANTLR-generated parser

The Embedded Language lexer and parser SHALL be generated from the canonical grammar using [ANTLR](https://www.antlr.org/).

The generated frontend SHALL expose parser entry points capable of implementing both `PROGRAM` and `EXPRESSION` source modes from the shared canonical grammar.

The generated frontend SHALL use the ANTLR Java target/runtime and SHALL NOT require JNI or a native parser library.

The generated parse tree SHALL be converted into the language-owned Semantic AST before evaluation or partial evaluation.

Compilation Profile restrictions SHALL be enforced without introducing a second consumer-specific parser or grammar.

Verification: Inspect build dependencies and generated parser sources, confirm both source modes use the Java ANTLR frontend and shared expression productions without JNI/native parser dependencies or consumer-specific grammars, and inspect the parse-tree-to-Semantic-AST boundary.
Traceability: SYNTAX-002; LANG-001; ENV-004.

## 7.2 Language Restrictions

### TECH-002 — No general-purpose scripting or callable constructs

The Embedded Language SHALL NOT provide in the current version:

```text
export or module syntax
imports or cross-program linking
function declarations
arrow functions
function or method calls
function parameters or arguments
loops or recursion
closures or lambdas
mutable assignment
object construction
class or prototype semantics
exceptions
async/await
filesystem, network, process, clock, or random I/O
dynamic property access
reflection
arbitrary host method calls
built-in or registered utility functions
```

A Compilation Profile SHALL NOT enable any capability excluded above. A future language revision SHALL require an explicit specification change before adding one of these capabilities.

Verification: Confirm the canonical grammar excludes each construct and rejection tests cover representative syntax in both source modes and across representative Compilation Profiles.
Traceability: [Scope](01-introduction.md#12-scope); QUAL-002; ENV-004.

## 7.3 Strict Semantics

### TECH-003 — No ECMAScript coercion model

The Embedded Language SHALL NOT implement ECMAScript truthiness, `undefined`, loose equality, prototype lookup, JavaScript number edge cases, automatic semicolon insertion, or implicit string/number/boolean coercion.

JavaScript-like tokens and control-flow forms specified by the Embedded Language SHALL follow the language's own type, binding, control-flow, feature-profile, and evaluation rules.

Verification: Attempt sources that depend on truthiness, `undefined`, loose equality, implicit coercion, or omitted required `PROGRAM` semicolons and confirm rejection.
Traceability: TYPE-001 through TYPE-004; SYNTAX-003; LANG-005.

## 7.4 Isolation and Host Access

### TECH-004 — Pure execution environment

Embedded Language source SHALL be treated as untrusted compiler input.

The Embedded Language SHALL NOT expose repositories, dependency-injection containers, persistence entities, filesystems, networks, processes, reflection, class loaders, arbitrary host objects, or host methods to source expressions.

Because call expressions are absent from this language version, source SHALL NOT invoke host or utility functions through another callable boundary.

Verification: Attempt to reference forbidden host facilities and call-like syntax in both source modes and confirm they are unreachable.
Traceability: SYNTAX-004; DATA-001.

## 7.5 Compiler Limits

### TECH-005 — Fail closed on compiler-limit exhaustion

The compiler limits required by PERF-001 SHALL be applied before an oversized or excessively deep source becomes executable.

Limit exhaustion SHALL produce `ComplexityError` and SHALL NOT fall back to a less-restricted parser, Compilation Profile, or evaluator.

Verification: Exceed each configured limit in each applicable source mode and confirm `ComplexityError` without fallback execution or profile relaxation.
Traceability: PERF-001; DIAG-001; ENV-004.
