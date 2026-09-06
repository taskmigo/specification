# 3. External Interface Requirements

## 3.1 Source Contract

### SYNTAX-001 — Canonical policy shape

A TPL source SHALL contain top-level function declarations and exactly one `export default function` declaration that defines the policy entry point.

Example:

```text
function isOwner() {
  return object.ownerId == principal.id;
}

export default function policy() {
  const readable = request.method == "GET";

  if (principal.admin) {
    return true;
  }

  return readable && isOwner();
}
```

A non-default function SHALL be named. The default-exported function MAY be named or anonymous.

A top-level function MAY be declared with `export function <name>() { ... }`. Named export syntax SHALL NOT imply cross-policy import or module-linking support in this version.

Verification: Parse the example, named exports, named and anonymous default exports, and reject sources with zero or multiple default exports.
Traceability: [Policy Model](02-overall-description.md#221-policy-model).

### SYNTAX-002 — Canonical grammar

The parser SHALL implement language behavior equivalent to this grammar:

```ebnf
policy        ::= topLevelDecl* EOF ;

topLevelDecl ::= functionDecl
               | "export" functionDecl
               | "export" "default" defaultFunctionDecl ;

functionDecl        ::= "function" IDENT "(" ")" block ;
defaultFunctionDecl ::= "function" IDENT? "(" ")" block ;

block         ::= "{" statement* "}" ;
statement     ::= constDecl | ifStmt | returnStmt ;
constDecl     ::= "const" IDENT "=" expression ";" ;
returnStmt    ::= "return" expression ";" ;
ifStmt        ::= "if" "(" expression ")" block
                  ( "else" ( ifStmt | block ) )? ;

expression    ::= orExpr ;
orExpr        ::= andExpr ( "||" andExpr )* ;
andExpr       ::= equalityExpr ( "&&" equalityExpr )* ;
equalityExpr  ::= compareExpr ( ( "==" | "!=" ) compareExpr )* ;
compareExpr   ::= inExpr ( ( "<" | "<=" | ">" | ">=" ) inExpr )* ;
inExpr        ::= additiveExpr ( "in" additiveExpr )? ;
additiveExpr  ::= multiplyExpr ( ( "+" | "-" ) multiplyExpr )* ;
multiplyExpr  ::= unaryExpr ( ( "*" | "/" | "%" ) unaryExpr )* ;
unaryExpr     ::= ( "!" | "+" | "-" ) unaryExpr
                | primary ;

primary       ::= literal
                | listLiteral
                | reference
                | call
                | "(" expression ")" ;

reference     ::= IDENT ( "." IDENT )* ;
call          ::= IDENT "(" ")" ;
listLiteral   ::= "[" ( expression ( "," expression )* )? "]" ;

literal       ::= "true" | "false" | "null" | NUMBER | STRING ;
```

`function`, `export`, `default`, `const`, `if`, `else`, `return`, `in`, `true`, `false`, and `null` SHALL be reserved keywords.

The source SHALL contain exactly one top-level declaration with both `export` and `default`.

Function parameters and call arguments SHALL NOT be supported in this version; the parentheses remain mandatory syntax.

Verification: Generate parser tests covering each production and precedence boundary, including function/export forms, declarations, parenthesized `if`, boolean operators, comparison, membership, arithmetic, unary, calls, and grouping expressions.
Traceability: SYNTAX-001; [Parser Frontend](07-constraints.md#71-parser-frontend).

### SYNTAX-003 — Delimiters, identifiers, and literals

Parentheses around every `if` condition SHALL be mandatory. Braces around every `if` and `else` body SHALL be mandatory except that `else if (...) { ... }` MAY use the nested `if` form defined by SYNTAX-002.

Semicolons SHALL be mandatory after `const` and `return`; TPL SHALL NOT provide automatic semicolon insertion.

Identifiers SHALL begin with an ASCII letter or `_` and SHALL continue with ASCII letters, decimal digits, or `_`.

String literals SHALL use double quotes and SHALL support the JSON string escape set. A malformed or unterminated string SHALL be a parse error.

Number literals SHALL represent finite base-10 values without `NaN` or infinity literals. Unary `+` and `-` SHALL be operators rather than part of the number token.

List literals SHALL preserve source order.

Verification: Test required delimiters/semicolons, valid and invalid identifiers, string escapes, finite number literals, unary signs, and list literal ordering.
Traceability: SYNTAX-002; TYPE-001 through TYPE-004.

### SYNTAX-004 — No dynamic member or method syntax

Property paths SHALL use static dot-separated identifiers. Computed member syntax, method-call syntax, optional-chaining syntax, and calls through property paths SHALL be rejected.

The following forms are outside the language:

```text
object[field]
object.getOwner()
object?.ownerId
```

Verification: Reject each excluded form and accept an equivalent statically declared property path when the Environment Schema contains it.
Traceability: REF-001; [Language Restrictions](07-constraints.md#72-language-restrictions).

## 3.2 Compilation Environment

### ENV-001 — Environment Schema

Compilation SHALL receive an Environment Schema that defines every available root and property path, including:

- The static type.
- Whether the value may be `null`.
- Whether the path is available for the consuming policy scope.
- Whether the path may remain symbolic during partial evaluation.
- Whether the path can participate in consumer query lowering when it remains symbolic.

A reference that is neither a local `const` binding, a source-declared function call, nor a schema root/path SHALL be rejected before activation.

No built-in or registered utility-function namespace SHALL be available in this language version.

Verification: Compile the same source against schemas that add/remove a root or path, call declared and undeclared function names, and confirm deterministic acceptance or rejection.
Traceability: REF-001; FUNC-001; QUERY-001.

### ENV-002 — Authorization roots

The Authorization consumer SHALL define the scope-dependent roots described by the [Authorization inputs](../002.%20Authorization/03-external-interface-requirements.md#32-authorization-inputs-and-operation-snapshot).

TPL itself SHALL NOT hard-code additional authorization roots that are absent from the consumer Environment Schema.

Verification: Compile Request and Object policies against the corresponding Authorization schemas and reject unavailable roots.
Traceability: ENV-001; [Authorization feature](../002.%20Authorization/README.md).

### ENV-003 — Compiled policy interface

Successful compilation SHALL produce a Taskmigo-owned compiled policy artifact containing typed Policy IR and the metadata required by [compiled policy artifacts](05-data-and-information-requirements.md#52-compiled-policy-artifacts).

A parser or static-validation error SHALL produce one or more diagnostics with source location and SHALL NOT produce an executable compiled policy.

Verification: Compile valid and invalid source and inspect the compiled artifact/diagnostics boundary.
Traceability: DIAG-001; DATA-002.

## 3.3 Evaluation Interface

### EVAL-IF-001 — Typed input values

Evaluation and partial evaluation SHALL receive values conforming to the Environment Schema used by the compiled policy.

A missing required value or incompatible runtime value type SHALL be an evaluation failure rather than an implicit coercion.

Verification: Execute a compiled policy with matching and mismatching runtime values and confirm strict validation.
Traceability: TYPE-001; [Strict Semantics](07-constraints.md#73-strict-semantics).

### EVAL-IF-002 — Result forms

Direct evaluation of the default-exported function SHALL return exactly one `Bool` result or an evaluation failure.

Partial evaluation SHALL return either:

- A concrete `Bool`.
- A typed residual `Bool` Policy IR expression.
- An evaluation/validation failure.

No other result form SHALL be interpreted as an authorization decision.

Verification: Exercise concrete true/false, residual, and invalid-result scenarios.
Traceability: EVAL-001; PARTIAL-001; PARTIAL-003.
