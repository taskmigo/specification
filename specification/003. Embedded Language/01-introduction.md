# 1. Introduction

## 1.1 Purpose

This Software Requirements Specification (SRS) defines the Embedded Language, a bounded language for parsing, semantically analyzing, and executing deterministic program or expression sources through a language-owned Semantic AST.

This document is tailored to the software-requirements information-item guidance in [ISO/IEC/IEEE 29148:2018](https://committee.iso.org/standard/72089.html). The tailoring covers the source contract, compilation modes, feature profiles, static semantics, Semantic AST, evaluation, partial evaluation, safety constraints, quality attributes, dependencies, and verification relevant to the language subsystem. It does not claim full conformance to the standard.

## 1.2 Scope

The Embedded Language SHALL provide a bounded, statically typed, side-effect-free language with these capabilities:

- Compile one source in either `PROGRAM` or `EXPRESSION` mode into a typed Semantic AST.
- Use JavaScript-like expression syntax without adopting ECMAScript runtime semantics.
- In `PROGRAM` mode, support immutable `const` declarations, `return`, and `if (...)` control flow.
- In `EXPRESSION` mode, compile exactly one expression without a statement or `return` wrapper.
- Accept a consumer-defined compilation profile that can disable supported language feature families without changing the canonical grammar or Semantic AST semantics.
- Evaluate compiled sources whose required inputs are known.
- Partially evaluate compiled sources when selected inputs are unknown.
- Preserve unknown-dependent values as residual typed Semantic AST expressions.
- Support boolean logic, comparisons, arithmetic, list membership, and static property paths when the applicable compilation profile enables them.
- Reject source that depends on dynamic language behavior, arbitrary host APIs, callable constructs, unbounded computation, or a language feature disabled by the applicable compilation profile.

The Environment Schema SHALL define the roots and typed paths available to a source. The Embedded Language SHALL NOT reserve application-specific root names or application-specific compilation profiles.

The following capabilities are outside the scope of this SRS:

- General-purpose scripting.
- `export`, modules, imports, or cross-program reuse.
- User-defined functions, arrow functions, function calls, function parameters, recursion, loops, mutable variables, closures, exceptions, asynchronous execution, or I/O.
- Built-in or registered utility functions such as `startsWith`, `endsWith`, `contains`, `lower`, or equivalent helpers.
- Dynamic property names, reflection, arbitrary method invocation, or host-language object access.
- Persistence or query APIs.
- Consumer-specific profile names or business semantics such as authorization or client filtering.

## 1.3 Definitions, Acronyms, and Abbreviations

| Term                | Definition                                                                                                                      |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| ANTLR               | Parser generator required for the Embedded Language lexer/parser frontend.                                                      |
| Compilation Mode    | Source entry mode selecting either a statement-bearing `PROGRAM` source or a standalone `EXPRESSION` source.                   |
| Compilation Profile | Consumer-supplied compilation contract containing the selected mode and the language feature families allowed for that source. |
| Environment Schema  | Typed definition of roots, paths, nullability, and symbolic availability for a compiled source.                                |
| Semantic AST        | Typed language-owned abstract syntax tree produced after binding, type checking, and applicable control-flow validation.       |
| Partial Evaluation  | Evaluation that resolves known-dependent subexpressions while preserving unknown-dependent subexpressions.                      |
| Residual Expression | Typed Semantic AST expression remaining after partial evaluation because it depends on unknown values.                          |

## 1.4 References and Baseline

- The linked standard's software-requirements information-item guidance is used as a tailored framework.
- The Embedded Language replaces the previous dependency on a restricted ECMAScript frontend. JavaScript-like surface forms specified here do not imply ECMAScript compatibility.

## 1.5 Overview

Sections [2](02-overall-description.md)–[8](08-requirements-allocation-and-dependencies.md) define the Embedded Language context, interfaces, behavior, data, quality attributes, constraints, and dependencies. [Section 9](09-verification-validation-and-acceptance.md) defines verification and acceptance evidence; [Section 10](10-traceability-and-unresolved-issues.md) defines traceability and unresolved issues; [Section 11](11-appendices.md) provides examples and extension guidance.
