# 7. Constraints

## 7.1 Parser Frontend

### TECH-001 — ANTLR-generated parser

The Policy Language lexer and parser SHALL be generated from the canonical grammar using [ANTLR](https://www.antlr.org/).

The generated frontend SHALL use the ANTLR Java target/runtime and SHALL NOT require JNI or a native parser library.

The generated parse tree SHALL be converted into language-owned AST/Policy IR before semantic evaluation.

Verification: Inspect build dependencies and generated parser sources, confirm the Java ANTLR runtime is used without JNI/native parser dependencies, and inspect the parse-tree conversion boundary.
Traceability: SYNTAX-002; LANG-001.

## 7.2 Language Restrictions

### TECH-002 — No general-purpose scripting or callable constructs

The Policy Language SHALL NOT provide:

```text
export or module syntax
imports or cross-policy linking
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

A future language revision SHALL require an explicit specification change before adding one of these capabilities.

Verification: Confirm the grammar excludes each construct and rejection tests cover representative syntax.
Traceability: [Scope](01-introduction.md#12-scope); QUAL-002; QUERY-002.

## 7.3 Strict Semantics

### TECH-003 — No ECMAScript coercion model

The Policy Language SHALL NOT implement ECMAScript truthiness, `undefined`, loose equality, prototype lookup, JavaScript number edge cases, automatic semicolon insertion, or implicit string/number/boolean coercion.

JavaScript-like tokens and control-flow forms specified by the Policy Language SHALL follow the language's own type, binding, control-flow, and evaluation rules.

Verification: Attempt policies that depend on truthiness, `undefined`, loose equality, implicit coercion, or omitted required semicolons and confirm rejection.
Traceability: TYPE-001 through TYPE-004; SYNTAX-003.

## 7.4 Isolation and Host Access

### TECH-004 — Pure policy environment

Policy source SHALL be treated as untrusted compiler input.

The Policy Language SHALL NOT expose repositories, dependency-injection containers, persistence entities, filesystems, networks, processes, reflection, class loaders, arbitrary host objects, or host methods to policy expressions.

Because call expressions are absent from this language version, policy source SHALL NOT invoke host or utility functions through another callable boundary.

Verification: Attempt to reference forbidden host facilities and call-like syntax and confirm they are unreachable.
Traceability: SYNTAX-004; DATA-001.

## 7.5 Compiler Limits

### TECH-005 — Fail closed on compiler-limit exhaustion

The compiler limits required by PERF-001 SHALL be applied before an oversized or excessively deep policy becomes executable.

Limit exhaustion SHALL produce `ComplexityError` and SHALL NOT fall back to a less-restricted parser or evaluator.

Verification: Exceed each configured limit and confirm `ComplexityError` without fallback execution.
Traceability: PERF-001; DIAG-001.
