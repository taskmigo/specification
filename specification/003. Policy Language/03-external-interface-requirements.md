# 3. External Interface Requirements

## 3.1 Source Contract

### SYNTAX-001 — Canonical policy shape

A TPL source SHALL contain top-level named function declarations and exactly one `export default` declaration that defines the policy entry point.

The default export SHALL accept a named function declaration, an unnamed function declaration, a block-bodied zero-parameter arrow function, or a concise zero-parameter arrow function.

Examples:

```text
export default function policy() {
  return principal.enabled && request.method == "GET";
}
```

```text
export default function() {
  return principal.enabled && request.method == "GET";
}
```

```text
export default () => {
  const readable = request.method == "GET";
  return principal.enabled && readable;
};
```

```text
export default () => principal.enabled && request.method == "GET";
```

A top-level named helper MAY be declared with `function <name>() { ... }` or `export function <name>() { ... }`. Named export syntax SHALL NOT imply cross-policy import or module-linking support in this version.

Verification: Parse each default-export form, named helpers, and named exports, then reject sources with zero or multiple default exports.
Traceability: [Policy Model](02-overall-description.md#221-policy-model).

### SYNTAX-002 — Canonical grammar

The parser SHALL implement language behavior equivalent to this grammar:

```ebnf
policy            ::= topLevelDecl* EOF ;

topLevelDecl      ::= functionDecl
                    | "export" functionDecl
                    | defaultExport ;

functionDecl      ::= "function" IDENT "(" ")" block ;
defaultExport     ::= "export" "default" defaultFunction ;
defaultFunction   ::= "function" IDENT? "(" ")" block
                    | arrowFunction ";" ;
arrowFunction     ::= "(" ")" "=>" ( block | expression ) ;

block             ::= "{" statement* "}" ;
statement         ::= constDecl | ifStmt | returnStmt ;
constDecl         ::= "const" IDENT "=" expression ";" ;
returnStmt        ::= "return" expression ";" ;
ifStmt            ::= "if" "(" expression ")" block
                      ( "else" ( ifStmt | block ) )? ;

expression        ::= orExpr ;
orExpr            ::= andExpr ( "||" andExpr )* ;
andExpr           ::= equalityExpr ( "&&" equalityExpr )* ;
equalityExpr      ::= compareExpr ( ( "==" | "!=" ) compareExpr )* ;
compareExpr       ::= inExpr ( ( "<" | "<=" | ">" | ">=" ) inExpr )* ;
inExpr            ::= additiveExpr ( "in" additiveExpr )? ;
additiveExpr      ::= multiplyExpr ( ( "+" | "-" ) multiplyExpr )* ;
multiplyExpr      ::= unaryExpr ( ( "*" | "/" | "%" ) unaryExpr )* ;
unaryExpr         ::= ( "!" | "+" | "-" ) unaryExpr
                    | primary ;

primary           ::= literal
                    | listLiteral
                    | reference
                    | call
                    | "(" expression ")" ;

reference         ::= IDENT ( "." IDENT )* ;
call              ::= IDENT "(" ")" ;
listLiteral       ::= "[" ( expression ( "," expression )* )? "]" ;

literal           ::= "true" | "false" | "null" | NUMBER | STRING ;
```

`function`, `export`, `default`, `const`, `if`, `else`, `return`, `in`, `true`, `false`, and `null` SHALL be reserved keywords.

The source SHALL contain exactly one `defaultExport`.

Function parameters and call arguments SHALL NOT be supported in this version; zero-parameter function declarations, calls, and arrow functions therefore use `()`.

Verification: Generate parser tests covering every production and precedence boundary, including named/unnamed default functions, block/concise arrows, declarations, `return`, parenthesized `if`, boolean operators, comparison, membership, arithmetic, calls, and grouping expressions.
Traceability: SYNTAX-001; [Parser Frontend](07-constraints.md#71-parser-frontend).

### SYNTAX-003 — Parentheses and delimiters

TPL SHALL follow the JavaScript-like parenthesis placement defined by the supported grammar:

- `if` SHALL require parentheses around its condition: `if (<expression>)`.
- Zero-parameter function declarations and calls SHALL use `()`.
- A zero-parameter arrow function SHALL use `() =>`.
- Parentheses MAY group an expression and SHALL affect precedence in the same syntactic position as a JavaScript grouping expression.
- `return` and `const` expressions SHALL NOT require an additional pair of parentheses.

Braces SHALL remain mandatory around `if` and `else` bodies in this version, except that `else if (...) { ... }` MAY use the nested `if` form defined by SYNTAX-002.

Semicolons SHALL be mandatory after `const`, `return`, and an arrow-function default export; TPL SHALL NOT provide automatic semicolon insertion.

Identifiers SHALL begin with an ASCII letter or `_` and SHALL continue with ASCII letters, decimal digits, or `_`.

String literals SHALL use double quotes and SHALL support the JSON string escape set. A malformed or unterminated string SHALL be a parse error.

Number literals SHALL represent finite base-10 values without `NaN` or infinity literals. Unary `+` and `-` SHALL be operators rather than part of the number token.

List literals SHALL preserve source order.

Verification: Test each required/optional parenthesis position, required braces/semicolons, valid and invalid identifiers, string escapes, finite number literals, unary signs, and list literal ordering.
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

Direct evaluation of the default export SHALL return exactly one `Bool` result or an evaluation failure.

Partial evaluation SHALL return either:

- A concrete `Bool`.
- A typed residual `Bool` Policy IR expression.
- An evaluation/validation failure.

No other result form SHALL be interpreted as an authorization decision.

Verification: Exercise concrete true/false, residual, and invalid-result scenarios for function-declaration and arrow default exports.
Traceability: EVAL-001; PARTIAL-001; PARTIAL-003.
