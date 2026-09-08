# 7. Constraints

## 7.1 Parser Frontend

### TECH-001 — ANTLR-generated parser

The lexer and parser SHALL be generated from the canonical grammar using [ANTLR](https://www.antlr.org/) with the Java target/runtime. The frontend SHALL expose both source-mode entries from one shared grammar and convert generated parse trees into the language-owned Semantic AST before evaluation.

Compilation Profile restrictions SHALL NOT introduce consumer-specific grammars.

Verification: Inspect parser generation, shared entries, Java runtime dependency, and parse-tree-to-Semantic-AST conversion.
Traceability: SYNTAX-002; LANG-001; ENV-004.

## 7.2 Language Restrictions

### TECH-002 — No general-purpose scripting or general callable model

The language SHALL NOT provide:

```text
modules or imports
general function declarations
general call expressions
first-class functions
standalone or escapable lambdas
recursion or general loops
mutable assignment
object construction
class/prototype semantics
exceptions
async/await
filesystem/network/process/clock/random I/O
dynamic property access
reflection
arbitrary host method calls
```

The bounded intrinsic forms specified by LANG-006 are permitted and SHALL NOT create a general callable namespace.

Verification: Reject representative excluded constructs while accepting valid bounded intrinsics under compatible profiles.
Traceability: [Scope](01-introduction.md#12-scope); LANG-006; QUAL-002.

## 7.3 Strict Semantics

### TECH-003 — No ECMAScript coercion model

The language SHALL NOT implement ECMAScript truthiness, `undefined`, loose equality, prototype lookup, automatic semicolon insertion, or implicit string/number/boolean coercion.

Verification: Attempt sources depending on excluded coercions or delimiters and confirm rejection.
Traceability: TYPE-001 through TYPE-005; SYNTAX-003.

## 7.4 Isolation and Host Access

### TECH-004 — Pure execution environment

Source SHALL be treated as untrusted compiler input. The language SHALL NOT expose repositories, dependency-injection containers, persistence entities, filesystems, networks, processes, reflection, class loaders, arbitrary host objects, or host methods.

Canonical intrinsics SHALL execute only their specified pure language semantics and SHALL NOT dispatch to user-selected host methods.

Verification: Attempt forbidden host access and arbitrary calls from direct source and restricted lambdas.
Traceability: SYNTAX-004; LANG-006; DATA-001.

## 7.5 Compiler Limits

### TECH-005 — Fail closed on compiler-limit exhaustion

Compiler limits required by PERF-001 SHALL be applied before source becomes executable. Limit exhaustion SHALL produce `ComplexityError` and SHALL NOT fall back to a less-restricted parser, profile, or evaluator.

Verification: Exceed each limit and confirm failure without fallback.
Traceability: PERF-001; DIAG-001; ENV-004.
