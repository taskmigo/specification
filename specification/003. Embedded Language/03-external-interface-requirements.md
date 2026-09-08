# 3. External Interface Requirements

## 3.1 Source Contract

### SYNTAX-001 — Canonical source modes

Every compilation SHALL select exactly one source mode through the applicable Compilation Profile:

```text
PROGRAM
EXPRESSION
```

A `PROGRAM` source SHALL contain statements directly at the source root. An `EXPRESSION` source SHALL contain exactly one expression without a statement or `return` wrapper.

Neither mode SHALL require or permit an `export`, module, function declaration, or entry-point wrapper.

Verification: Compile valid examples in each mode and reject incompatible-mode source and excluded declarations.
Traceability: [Source Modes](02-overall-description.md#221-source-modes); ENV-004.

### SYNTAX-002 — Canonical grammar

The parser SHALL implement behavior equivalent to these source entry points and shared productions:

```ebnf
programSource     ::= statement* EOF ;
expressionSource  ::= expression EOF ;
statement         ::= constDecl | ifStmt | returnStmt ;
block             ::= "{" statement* "}" ;
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
unaryExpr         ::= ( "!" | "+" | "-" ) unaryExpr | primary ;
primary           ::= literal
                    | listLiteral
                    | reference
                    | quantifierExpr
                    | lengthExpr
                    | "(" expression ")" ;
quantifierExpr    ::= quantifier "(" expression "," lambdaExpr ")" ;
quantifier        ::= "all" | "any" | "none" ;
lambdaExpr        ::= IDENT "=>" expression ;
lengthExpr        ::= "len" "(" expression ")" ;
reference         ::= IDENT ( "." IDENT )* ;
listLiteral       ::= "[" ( expression ( "," expression )* )? "]" ;
literal           ::= "true" | "false" | "null" | NUMBER | STRING ;
```

`PROGRAM` and `EXPRESSION` SHALL share the same expression productions. `=>` SHALL be accepted only in `lambdaExpr`; parentheses following an identifier SHALL be accepted only for the specified intrinsics.

Verification: Test both entries, precedence, quantifier/lambda placement, intrinsic forms, and rejection of general call expressions.
Traceability: SYNTAX-001; TECH-001.

### SYNTAX-003 — Delimiters, identifiers, and literals

`PROGRAM` mode SHALL require parentheses around `if` conditions, braces around `if`/`else` bodies, and semicolons after `const` and `return`. `EXPRESSION` mode SHALL NOT require a trailing semicolon.

Identifiers SHALL begin with an ASCII letter or `_` and continue with ASCII letters, decimal digits, or `_`.

String literals SHALL use double quotes and support the JSON escape set. Number literals SHALL represent finite base-10 values. List literals SHALL preserve source order.

Verification: Test valid and invalid delimiters, identifiers, strings, numbers, and list literals.
Traceability: SYNTAX-002; TYPE-001 through TYPE-005.

### SYNTAX-004 — Static paths and bounded intrinsic syntax

Property paths SHALL use static dot-separated identifiers. Computed member syntax, optional chaining, method calls, and general function calls SHALL be rejected.

The following SHALL be rejected:

```text
record[field]
record.getScore()
record?.score
custom(record.name)
```

The following MAY be valid when their feature families are enabled and operand types are valid:

```text
len(record.name)
all(record.emails, email => len(email) > 10)
```

Verification: Reject dynamic/general call forms and accept specified intrinsic forms under compatible profiles.
Traceability: REF-001; LANG-006; TECH-002.

## 3.2 Compilation Environment

### ENV-001 — Environment Schema

Compilation SHALL receive an Environment Schema that defines every available root and statically addressable property path, including:

- Static type.
- Nullability.
- Symbolic availability during partial evaluation.
- Structured property metadata required to type static nested references.
- `List<T>` element type metadata when a list element is structured or otherwise schema-defined.

A reference that is neither a visible lexical binding nor a declared schema root/path SHALL be rejected.

The language SHALL expose no general callable namespace. Canonical intrinsics are compiler-recognized language forms.

Verification: Compile sources against schemas that add/remove roots, nested paths, and list element types and confirm deterministic binding.
Traceability: REF-001; LANG-006.

### ENV-002 — Schema-defined root namespace

The Embedded Language SHALL NOT reserve or create application root names. Every non-local root SHALL exist only because the Environment Schema declares it.

Verification: Compile the same source against schemas with different root namespaces and confirm reference acceptance follows the supplied schema.
Traceability: ENV-001.

### ENV-003 — Compiled source interface

Successful compilation SHALL produce a compiled source artifact containing the typed Semantic AST, statically determined source result type, and metadata required by [compiled source artifacts](05-data-and-information-requirements.md#52-compiled-source-artifacts).

For `PROGRAM`, the result type SHALL derive from reachable returns. For `EXPRESSION`, it SHALL be the source expression type.

Verification: Compile valid sources with multiple result types and inspect artifact metadata and diagnostics.
Traceability: DATA-002; DATA-003; LANG-001; LANG-002; ENV-004.

### ENV-004 — Compilation Profile

Every compilation SHALL receive a Compilation Profile containing one source mode and the enabled feature-family set.

The initial feature families SHALL be:

```text
LOCAL_BINDINGS
CONDITIONAL_CONTROL_FLOW
LIST_LITERALS
MEMBERSHIP
LOGICAL_OPERATORS
EQUALITY_OPERATORS
ORDERING_OPERATORS
ARITHMETIC_OPERATORS
COLLECTION_QUANTIFIERS
LENGTH_INTRINSIC
```

`LOCAL_BINDINGS` and `CONDITIONAL_CONTROL_FLOW` apply only to `PROGRAM`. `COLLECTION_QUANTIFIERS` controls `all`, `any`, `none`, and their restricted lambda syntax. `LENGTH_INTRINSIC` controls `len(...)`.

A disabled feature SHALL fail compilation with a diagnostic identifying the disabled feature. A profile SHALL NOT add behavior outside the canonical language.

Verification: Enable and disable each feature independently and confirm source acceptance and artifact identity follow the profile.
Traceability: [Compilation Profiles](02-overall-description.md#223-compilation-profiles); LANG-005; DATA-003.

## 3.3 Evaluation Interface

### EVAL-IF-001 — Typed input values

Evaluation and partial evaluation SHALL receive values conforming to the Environment Schema used by the compiled source. Missing required values or incompatible runtime types SHALL fail rather than coerce.

Verification: Execute compiled sources with matching and mismatching runtime values.
Traceability: TYPE-001; TECH-003.

### EVAL-IF-002 — Result forms

Direct evaluation SHALL return exactly one value conforming to the compiled source result type, or an evaluation failure.

Partial evaluation SHALL return a concrete conforming value, a typed residual Semantic AST expression conforming to the source result type, or an evaluation failure.

Verification: Exercise concrete and residual results for scalar, list, and quantified expressions.
Traceability: LANG-001; LANG-002; EVAL-001; PARTIAL-001; PARTIAL-003.
