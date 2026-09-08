# 1. Introduction

## 1.1 Purpose

This Software Requirements Specification (SRS) defines the Embedded Language, a bounded language for parsing, semantically analyzing, evaluating, and partially evaluating deterministic program or expression sources through a language-owned Semantic AST.

This document is tailored to the software-requirements information-item guidance in [ISO/IEC/IEEE 29148:2018](https://committee.iso.org/standard/72089.html). It does not claim full conformance to the standard.

## 1.2 Scope

The Embedded Language SHALL provide:

- `PROGRAM` and `EXPRESSION` compilation modes over one canonical expression language.
- Consumer-defined Compilation Profiles that restrict canonical language feature families.
- A typed, language-owned Semantic AST independent of ANTLR parse-tree classes and application-domain semantics.
- Static types, immutable local bindings, bounded conditional control flow, direct evaluation, partial evaluation, and constant folding.
- Static property paths declared by an Environment Schema.
- Lists, membership, bounded collection quantifiers, and the bounded `len(...)` intrinsic when enabled by the applicable profile.
- Restricted lambda syntax only as the element predicate of collection quantifiers.

The Embedded Language SHALL NOT provide general-purpose scripting, modules, imports, general function declarations or calls, first-class callable values, recursion, loops, mutable assignment, reflection, arbitrary host access, asynchronous execution, or I/O.

The Environment Schema SHALL define the roots, structured paths, types, nullability, and symbolic availability visible to a source. The Embedded Language SHALL NOT reserve application-specific root names or consumer-specific profile names.

## 1.3 Definitions, Acronyms, and Abbreviations

- **ANTLR:** Parser generator required for the Embedded Language lexer/parser frontend.
- **Compilation Mode:** Source entry mode selecting either a statement-bearing `PROGRAM` source or a standalone `EXPRESSION` source.
- **Compilation Profile:** Consumer-supplied compilation contract containing the selected mode and enabled canonical feature families.
- **Environment Schema:** Typed definition of roots, structured paths, nullability, and symbolic availability for a compiled source.
- **Intrinsic:** Compiler-recognized bounded language operation with specified static and runtime semantics, not a general callable host method.
- **Semantic AST:** Typed language-owned abstract syntax tree produced after binding, type checking, and applicable control-flow validation.
- **Partial Evaluation:** Evaluation that resolves known-dependent subexpressions while preserving unknown-dependent subexpressions.
- **Residual Expression:** Typed Semantic AST expression remaining after partial evaluation because it depends on unknown values.
- **Restricted Lambda:** Lexically scoped element-binding expression accepted only inside a specified collection quantifier.

## 1.4 References and Baseline

- The linked standard's software-requirements information-item guidance is used as a tailored framework.
- JavaScript-like surface syntax specified here does not imply ECMAScript runtime semantics.

## 1.5 Overview

Sections [2](02-overall-description.md)–[8](08-requirements-allocation-and-dependencies.md) define the language context, interfaces, behavior, data, quality attributes, constraints, and dependencies. [Section 9](09-verification-validation-and-acceptance.md) defines verification evidence; [Section 10](10-traceability-and-unresolved-issues.md) defines traceability and unresolved issues; [Section 11](11-appendices.md) provides supporting examples.
