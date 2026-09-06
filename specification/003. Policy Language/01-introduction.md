# 1. Introduction

## 1.1 Purpose

This Software Requirements Specification (SRS) defines the Policy Language, a bounded language for compiling deterministic policy bodies into implementation-owned intermediate representations.

This document is tailored to the software-requirements information-item guidance in [ISO/IEC/IEEE 29148:2018](https://committee.iso.org/standard/72089.html). The tailoring covers the language source contract, static semantics, evaluation, partial evaluation, query-lowering capability, safety constraints, quality attributes, dependencies, and verification relevant to the policy-language subsystem. It does not claim full conformance to the standard.

## 1.2 Scope

The Policy Language SHALL provide a bounded, statically typed, side-effect-free language with these capabilities:

- Compile one policy body into typed Policy IR.
- Use JavaScript-like `const`, `return`, `if (...)`, block, expression-grouping, and boolean-operator syntax without adopting ECMAScript runtime semantics.
- Evaluate policies whose required inputs are known.
- Partially evaluate policies when selected inputs are unknown.
- Preserve unknown-dependent predicates as residual typed expressions.
- Determine whether residual predicates can be lowered by a consumer-provided query-lowering capability.
- Support immutable local bindings, conditional control flow, boolean logic, comparisons, arithmetic, list membership, and static property paths.
- Reject source that depends on dynamic language behavior, arbitrary host APIs, callable constructs, or unbounded computation.

The Policy Language SHALL NOT define consumer-domain root names, consumer scope names, authorization effects, target matching, role/group semantics, business-resource loading, persistence execution, or another feature's decision-composition rules. Consumers SHALL define those contracts independently and provide only the typed Environment Schema and capabilities required by the language.

The following capabilities are outside the scope of this SRS:

- General-purpose scripting.
- `export`, modules, imports, or cross-policy reuse.
- User-defined functions, arrow functions, function calls, function parameters, recursion, loops, mutable variables, closures, exceptions, asynchronous execution, or I/O.
- Built-in or registered utility functions such as `startsWith`, `endsWith`, `contains`, `lower`, or equivalent helpers.
- Dynamic property names, reflection, arbitrary method invocation, or host-language object access.
- A persistence API such as JPA Criteria or JPA Specification.
- Consumer-specific policy roots, scopes, effects, targets, or execution lifecycle.

## 1.3 Definitions, Acronyms, and Abbreviations

| Term               | Definition                                                                                                   |
| ------------------ | ------------------------------------------------------------------------------------------------------------ |
| ANTLR              | Parser generator required for the Policy Language lexer/parser frontend.                                     |
| Environment Schema | Consumer-provided typed definition of roots, paths, nullability, and query capabilities available to policy. |
| Partial Evaluation | Evaluation that resolves known-dependent subexpressions while preserving unknown-dependent subexpressions.   |
| Policy IR          | Typed intermediate representation independent of the parser frontend and consumer APIs.                      |
| Query Lowering     | Conversion of a residual Policy IR predicate into a consumer-owned persistence-neutral query representation. |
| Residual Predicate | Boolean Policy IR remaining after partial evaluation because it depends on one or more unknown values.       |

## 1.4 References and Baseline

- The linked standard's software-requirements information-item guidance is used as a tailored framework.
- The Policy Language replaces the previous dependency on a restricted ECMAScript policy frontend. JavaScript-like surface forms specified here do not imply ECMAScript compatibility.

## 1.5 Overview

Sections [2](02-overall-description.md)–[8](08-requirements-allocation-and-dependencies.md) define the Policy Language context, interfaces, behavior, data, quality attributes, constraints, and dependencies. [Section 9](09-verification-validation-and-acceptance.md) defines verification and acceptance evidence; [Section 10](10-traceability-and-unresolved-issues.md) defines traceability and unresolved issues; [Section 11](11-appendices.md) provides examples and extension guidance.
