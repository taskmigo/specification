# 1. Introduction

## 1.1 Purpose

This Software Requirements Specification (SRS) defines Taskmigo Policy Language (TPL), the Taskmigo-owned expression language used to compile deterministic authorization predicates into Taskmigo-owned intermediate representations.

This document is tailored to the software-requirements information-item guidance in [ISO/IEC/IEEE 29148:2018](https://committee.iso.org/standard/72089.html). The tailoring covers the language source contract, type and evaluation semantics, partial evaluation, query-lowering capability, safety constraints, quality attributes, dependencies, and verification relevant to the policy-language subsystem. It does not claim full conformance to the standard.

## 1.2 Scope

TPL SHALL provide a bounded, statically typed, side-effect-free expression language with these capabilities:

- Compile policy source into Taskmigo-owned typed Policy IR.
- Evaluate policies whose required inputs are known.
- Partially evaluate policies when selected inputs are unknown.
- Preserve unknown-dependent predicates as residual typed expressions.
- Determine whether residual predicates can be lowered by a consumer-provided query-lowering capability.
- Support immutable local bindings, conditional expressions, boolean logic, comparisons, arithmetic, list membership, property paths, and registered pure intrinsic functions.
- Reject source that depends on dynamic language behavior, arbitrary host APIs, or unbounded computation.

TPL SHALL NOT define Statement `effect`, authorization target matching, Role/Group assignment, authorization snapshot resolution, allow/deny composition, or persistence-specific query execution. Those behaviors are defined by the [Authorization feature](../002.%20Authorization/README.md).

The following capabilities are outside the scope of this SRS:

- General-purpose scripting.
- User-defined functions, recursion, loops, mutable variables, closures, exceptions, asynchronous execution, or I/O.
- Dynamic property names, reflection, arbitrary method invocation, or host-language object access.
- A persistence API such as JPA Criteria or JPA Specification.
- Client-facing query syntax unrelated to policy source.

## 1.3 Definitions, Acronyms, and Abbreviations

| Term                 | Definition                                                                                                                |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| ANTLR                | Parser generator required for the TPL lexer/parser frontend.                                                              |
| Environment Schema   | Consumer-provided typed definition of roots, paths, nullability, and query capabilities available to a policy.           |
| Intrinsic            | Registered pure function identified by TPL name and described by a type signature, runtime semantics, and capabilities. |
| Partial Evaluation   | Evaluation that resolves known-dependent subexpressions while preserving unknown-dependent subexpressions.               |
| Policy IR            | Taskmigo-owned typed intermediate representation independent of the parser frontend and persistence APIs.                |
| Query Lowering       | Conversion of a residual Policy IR predicate into a consumer-owned persistence-neutral query representation.             |
| Residual Predicate   | Boolean Policy IR remaining after partial evaluation because it depends on one or more unknown values.                   |
| TPL                  | Taskmigo Policy Language.                                                                                                 |

## 1.4 References and Baseline

- The linked standard's software-requirements information-item guidance is used as a tailored framework.
- The [Authorization feature](../002.%20Authorization/README.md) defines the initial consumer of TPL and the Request/Object Authorization semantics that depend on it.
- The previous authorization policy contract used a restricted ECMAScript frontend. TPL replaces that source-language dependency; ECMAScript compatibility is not part of this SRS.

## 1.5 Overview

Sections 2–8 define the TPL context, interfaces, behavior, data, quality attributes, constraints, and dependencies. Section 9 defines verification and acceptance evidence; Section 10 defines traceability and unresolved issues; Section 11 provides examples and extension guidance.
