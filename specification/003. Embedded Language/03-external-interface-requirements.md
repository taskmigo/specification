# 3. External Interface Requirements

## 3.1 Source Contract

### SYNTAX-001 — Canonical source modes

Every Embedded Language compilation SHALL select exactly one source mode through the applicable Compilation Profile:

```text
PROGRAM
EXPRESSION
```

A `PROGRAM` source SHALL contain statements directly at the source root. Assuming an Environment Schema exposes roots named `context`, `record`, and `operation`, a valid program is:

```text
const eligible = record.score >= context.minimumScore;
const enabled = record.enabled == true;

if (context.override) {
  return true;
}

return enabled && eligible && operation.mode == "READ";
```

An `EXPRESSION` source SHALL contain exactly one expression without a statement or `return` wrapper. With the same example roots, a valid expression source is:

```text
record.enabled == true && record.score >= context.minimumScore
```

Neither mode SHALL require or permit an `export`, module, function, arrow-function, or entry-point wrapper declaration.

Verification: Compile the examples in their specified modes, reject each example in the incompatible mode, and reject source containing `export`, `function`, arrow syntax, or a callable declaration.
Traceability: [Program Model](02-overall-description.md#221-program-model); ENV-004.

### SYNTAX-002 — Canonical grammar

The parser SHALL implement language behavior equivalent to these source entry points and shared productions:

```ebnf
programSource    ::= statement* EOF ;
expressionSource ::= expression EOF ;

statement    ::= constDecl | ifStmt | returnStmt ;
block        ::= "{" statement* "}" ;
constDecl    ::= "const" IDENT "=" expression ";" ;
returnStmt   ::= "return" expression ";" ;
ifStmt       ::= "if" "(" expression ")" block
                 ( "else" ( ifStmt | block ) )? ;

expression   ::= orExpr ;
orExpr       ::= andExpr ( "||" andExpr )* ;
andExpr      ::= equalityExpr ( "&&" equalityExpr )* ;
equalityExpr ::= compareExpr ( ( "==" | "!=" ) compareExpr )* ;
compareExpr  ::= inExpr ( ( "<" | "<=" | ">" | ">=" ) inExpr )* ;
inExpr       ::= additiveExpr ( "in" additiveExpr )? ;
additiveExpr ::= multiplyExpr ( ( "+" | "-" ) multiplyExpr )* ;
multiplyExpr ::= unaryExpr ( ( "*" | "/" | "%" ) unaryExpr )* ;
unaryExpr    ::= ( "!" | "+" | "-" ) unaryExpr
               | primary ;

primary      ::= literal
               | listLiteral
               | reference
               | "(" expression ")" ;

reference    ::= IDENT ( "." IDENT )* ;
listLiteral  ::= "[" ( expression ( "," expression )* )? "]" ;
literal      ::= "true" | "false" | "null" | NUMBER | STRING ;
```

`const`, `if`, `else`, `return`, `in`, `true`, `false`, and `null` SHALL be reserved keywords.

`export`, `function`, `=>`, and call-expression syntax SHALL NOT be part of the language grammar in this version.

The `PROGRAM` and `EXPRESSION` entry points SHALL share the same expression productions rather than defining independent expression languages.

Verification: Generate parser tests covering both entry points, each shared production, each precedence boundary, incompatible-mode source, and rejection of excluded export/function/arrow/call forms.
Traceability: SYNTAX-001; [Parser Frontend](07-constraints.md#71-parser-frontend).

### SYNTAX-003 — JavaScript-like delimiters, identifiers, and literals

In `PROGRAM` mode, parentheses around every `if` condition SHALL be mandatory, matching the supported JavaScript-style control-flow form `if (<expression>)`.

Parentheses MAY group expressions in either mode. A `return` expression or `const` initializer in `PROGRAM` mode SHALL NOT require grouping parentheses when JavaScript would not require them.

In `PROGRAM` mode, braces around every `if` and `else` body SHALL be mandatory except that `else if (...) { ... }` MAY use the nested `if` form defined by SYNTAX-002.

Semicolons SHALL be mandatory after `const` and `return` in `PROGRAM` mode. `EXPRESSION` mode SHALL end after its expression and SHALL NOT require a trailing semicolon. The Embedded Language SHALL NOT provide automatic semicolon insertion.

Identifiers SHALL begin with an ASCII letter or `_` and SHALL continue with ASCII letters, decimal digits, or `_`.

String literals SHALL use double quotes and SHALL support the JSON string escape set. A malformed or unterminated string SHALL be a parse error.

Number literals SHALL represent finite base-10 values without `NaN` or infinity literals. Unary `+` and `-` SHALL be operators rather than part of the number token.

List literals SHALL preserve source order when enabled by the Compilation Profile.

Verification: Test mode-specific statement delimiters, optional expression grouping, valid and invalid identifiers, string escapes, finite number literals, unary signs, list literal ordering, and expression-source end-of-input handling.
Traceability: SYNTAX-002; TYPE-001 through TYPE-004; ENV-004.

### SYNTAX-004 — No dynamic member, method, or call syntax

Property paths SHALL use static dot-separated identifiers. Computed member syntax, method-call syntax, optional-chaining syntax, and function-call syntax SHALL be rejected in both source modes.

The following forms are outside the language:

```text
record[field]
record.getScore()
record?.score
startsWith(record.name, "task-")
```

Verification: Reject each excluded form in both source modes and accept an equivalent statically declared property path when the Environment Schema contains it.
Traceability: REF-001; [Language Restrictions](07-constraints.md#72-language-restrictions).

## 3.2 Compilation Environment

### ENV-001 — Environment Schema

Compilation SHALL receive an Environment Schema that defines every available root and property path, including:

- The static type.
- Whether the value may be `null`.
- Whether the root or path may remain symbolic during partial evaluation.

A reference that is neither a visible local `const` binding in `PROGRAM` mode nor a schema root/path SHALL be rejected during compilation.

No built-in, registered, or source-declared callable namespace SHALL be available in this language version.

Verification: Compile the same source against schemas that add or remove a root or path and confirm deterministic acceptance or rejection; reject representative call expressions.
Traceability: REF-001.

### ENV-002 — Schema-defined root namespace

The Embedded Language SHALL NOT reserve or create root names.

Every non-local root SHALL exist only because the Environment Schema declares it. Root names, field sets, nullability, and symbolic availability SHALL follow the supplied schema.

Verification: Compile the same source against two Environment Schemas with different root namespaces and confirm that reference acceptance follows the supplied schema.
Traceability: ENV-001; [Known and Unknown Inputs](02-overall-description.md#222-known-and-unknown-inputs).

### ENV-003 — Compiled source interface

Successful compilation SHALL produce a compiled source artifact containing the typed Semantic AST, the statically determined source result type, and the metadata required by [compiled source artifacts](05-data-and-information-requirements.md#52-compiled-source-artifacts).

For `PROGRAM` mode, the source result type SHALL be derived from the reachable return expressions. For `EXPRESSION` mode, the source result type SHALL be the static type of the source expression.

A parser or static-validation error SHALL produce one or more diagnostics with source location and SHALL NOT produce an executable compiled source.

Verification: Compile valid program and expression sources with different result types and invalid source, then inspect the compiled Semantic AST, source result type, mode/profile identity, and diagnostics boundary.
Traceability: DIAG-001; DATA-002; DATA-003; LANG-001; LANG-002; ENV-004.

### ENV-004 — Compilation Profile

Every compilation SHALL receive a Compilation Profile that contains:

- Exactly one source mode: `PROGRAM` or `EXPRESSION`.
- The set of Embedded Language feature families enabled for that compilation.

The initial feature-family identifiers SHALL be:

```text
LOCAL_BINDINGS
CONDITIONAL_CONTROL_FLOW
LIST_LITERALS
MEMBERSHIP
LOGICAL_OPERATORS
EQUALITY_OPERATORS
ORDERING_OPERATORS
ARITHMETIC_OPERATORS
```

`PROGRAM` mode SHALL provide the statement structure required by SYNTAX-002. `LOCAL_BINDINGS` controls `const` declarations and `CONDITIONAL_CONTROL_FLOW` controls `if`/`else`; `return` remains part of the `PROGRAM` source contract and is required by LANG-002.

`EXPRESSION` mode SHALL reject all statement syntax regardless of the enabled feature set.

The remaining feature families SHALL control their corresponding expression constructs and operators. A source that uses a disabled feature SHALL fail compilation with a diagnostic identifying the disabled feature and SHALL NOT produce an executable compiled source.

A Compilation Profile SHALL only restrict the canonical language. It SHALL NOT add syntax, operators, types, coercions, roots, evaluation behavior, or Semantic AST semantics.

Verification: Compile equivalent source under profiles that enable and disable each feature family, confirm incompatible constructs are rejected, confirm identical enabled constructs preserve the same language semantics, and confirm `EXPRESSION` mode rejects statement syntax independently of feature flags.
Traceability: [Compilation Profiles](02-overall-description.md#223-compilation-profiles); LANG-005; DATA-003.

## 3.3 Evaluation Interface

### EVAL-IF-001 — Typed input values

Evaluation and partial evaluation SHALL receive values conforming to the Environment Schema used by the compiled source.

A missing required value or incompatible runtime value type SHALL be an evaluation failure rather than an implicit coercion.

Verification: Execute compiled program and expression sources with matching and mismatching runtime values and confirm strict validation.
Traceability: TYPE-001; [Strict Semantics](07-constraints.md#73-strict-semantics).

### EVAL-IF-002 — Result forms

Direct evaluation of a valid Semantic AST SHALL return exactly one value conforming to the compiled source result type, or an evaluation failure.

Partial evaluation SHALL return either:

- A concrete value conforming to the compiled source result type.
- A typed residual Semantic AST expression whose type conforms to the compiled source result type.
- An evaluation failure.

Verification: Exercise concrete and residual `Bool`, `String`, and `Number` result scenarios in both source modes plus incompatible internal-result scenarios.
Traceability: LANG-001; LANG-002; EVAL-001; PARTIAL-001; PARTIAL-003.
