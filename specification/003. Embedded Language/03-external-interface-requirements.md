# 3. External Interface Requirements

## 3.1 Source Contract

### SYNTAX-001 — Canonical program shape

An Embedded Language source SHALL be one program containing statements directly at the source root.

Assuming a consumer Environment Schema exposes roots named `context`, `record`, and `operation`, a valid program is:

```text
const eligible = record.score >= context.minimumScore;
const enabled = record.enabled == true;

if (context.override) {
  return true;
}

return enabled && eligible && operation.mode == "READ";
```

The source SHALL NOT require or permit an `export`, module, function, arrow-function, or entry-point wrapper declaration.

Verification: Parse the example and equivalent single-return programs, then reject source containing `export`, `function`, arrow syntax, or a callable declaration.
Traceability: [Program Model](02-overall-description.md#221-program-model).

### SYNTAX-002 — Canonical grammar

The parser SHALL implement language behavior equivalent to this grammar:

```ebnf
program      ::= statement* EOF ;

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

Verification: Generate parser tests covering each production and precedence boundary and rejection tests for excluded export/function/arrow/call forms.
Traceability: SYNTAX-001; [Parser Frontend](07-constraints.md#71-parser-frontend).

### SYNTAX-003 — JavaScript-like delimiters, identifiers, and literals

Parentheses around every `if` condition SHALL be mandatory, matching the supported JavaScript-style control-flow form `if (<expression>)`.

Parentheses MAY group expressions wherever the grammar permits and SHALL NOT be required around a `return` expression or `const` initializer when JavaScript would not require them.

Braces around every `if` and `else` body SHALL be mandatory except that `else if (...) { ... }` MAY use the nested `if` form defined by SYNTAX-002.

Semicolons SHALL be mandatory after `const` and `return`; the Embedded Language SHALL NOT provide automatic semicolon insertion.

Identifiers SHALL begin with an ASCII letter or `_` and SHALL continue with ASCII letters, decimal digits, or `_`.

String literals SHALL use double quotes and SHALL support the JSON string escape set. A malformed or unterminated string SHALL be a parse error.

Number literals SHALL represent finite base-10 values without `NaN` or infinity literals. Unary `+` and `-` SHALL be operators rather than part of the number token.

List literals SHALL preserve source order.

Verification: Test required `if` parentheses/braces/semicolons, optional expression grouping, valid and invalid identifiers, string escapes, finite number literals, unary signs, and list literal ordering.
Traceability: SYNTAX-002; TYPE-001 through TYPE-004.

### SYNTAX-004 — No dynamic member, method, or call syntax

Property paths SHALL use static dot-separated identifiers. Computed member syntax, method-call syntax, optional-chaining syntax, and function-call syntax SHALL be rejected.

The following forms are outside the language:

```text
record[field]
record.getScore()
record?.score
startsWith(record.name, "task-")
```

Verification: Reject each excluded form and accept an equivalent statically declared property path when the Environment Schema contains it.
Traceability: REF-001; [Language Restrictions](07-constraints.md#72-language-restrictions).

## 3.2 Compilation Environment

### ENV-001 — Environment Schema

Compilation SHALL receive an Environment Schema that defines every available root and property path, including:

- The static type.
- Whether the value may be `null`.
- Whether the root/path is available in the selected consumer contract.
- Whether the root/path may remain symbolic during partial evaluation.
- Whether the root/path can participate in consumer query lowering when it remains symbolic.

A reference that is neither a visible local `const` binding nor a schema root/path SHALL be rejected during compilation.

No built-in, registered, or source-declared callable namespace SHALL be available in this language version.

Verification: Compile the same source against schemas that add/remove a root or path and confirm deterministic acceptance or rejection; reject representative call expressions.
Traceability: REF-001; QUERY-001.

### ENV-002 — Consumer-defined root namespace

The Embedded Language SHALL NOT reserve, create, or hard-code consumer-domain root names or their semantics.

Every non-local root SHALL exist only because the supplied Environment Schema declares it. Root availability, names, field sets, nullability, and known/unknown status SHALL be consumer contracts rather than Embedded Language rules.

Verification: Compile the same program against two Environment Schemas with different root namespaces and confirm that reference acceptance follows only the supplied schema.
Traceability: ENV-001; [Known and Unknown Inputs](02-overall-description.md#222-known-and-unknown-inputs).

### ENV-003 — Compiled program interface

Successful compilation SHALL produce a compiled program artifact containing typed Language IR and the metadata required by [compiled program artifacts](05-data-and-information-requirements.md#52-compiled-program-artifacts).

A parser or static-validation error SHALL produce one or more diagnostics with source location and SHALL NOT produce an executable compiled program.

Verification: Compile valid and invalid source and inspect the compiled artifact/diagnostics boundary.
Traceability: DIAG-001; DATA-002.

## 3.3 Evaluation Interface

### EVAL-IF-001 — Typed input values

Evaluation and partial evaluation SHALL receive values conforming to the Environment Schema used by the compiled program.

A missing required value or incompatible runtime value type SHALL be an evaluation failure rather than an implicit coercion.

Verification: Execute a compiled program with matching and mismatching runtime values and confirm strict validation.
Traceability: TYPE-001; [Strict Semantics](07-constraints.md#73-strict-semantics).

### EVAL-IF-002 — Result forms

Direct evaluation of a valid program SHALL return exactly one `Bool` result or an evaluation failure.

Partial evaluation SHALL return either:

- A concrete `Bool`.
- A typed residual `Bool` Language IR expression.
- An evaluation/validation failure.

No other result form SHALL be interpreted as a valid program result.

Verification: Exercise concrete true/false, residual, and invalid-result scenarios.
Traceability: EVAL-001; PARTIAL-001; PARTIAL-003.
