# 1. Introduction

## 1.1 Purpose

The **Language** is Taskmigo's bounded, statically typed source language for deterministic compilation, direct evaluation and partial evaluation. It is an internal service capability, **not a public JavaScript runtime or HTTP API**. This specification defines exactly which source forms exist, which are profile-controlled, what values and errors they produce, and which runtime operations are prohibited.

This document uses tailored [ISO/IEC/IEEE 29148:2018 guidance](https://committee.iso.org/standard/72089.html) without claiming full certification. Implementation evidence is pinned to the [internal Language module at backend commit `9c1cd242`](https://github.com/taskmigo/taskmigo/tree/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/internal/language).

## 1.2 Scope

Language SHALL provide two canonical source modes, a consumer-defined Compilation Profile, typed Environment Schemas, language-owned Semantic AST, expression/statement validation, static result typing, source diagnostics, concrete evaluation, unknown-preserving partial evaluation, and bounded simplification. Conditional control flow and immutable `const` bindings are available only under permitted PROGRAM profiles. Typed lists, membership, `len`, `contains`, and bounded collection quantifiers are available only when enabled.

The language **does not** implement arbitrary function calls, modules/imports, mutable variables, loops, recursion, host reflection, I/O, external resource access, asynchronous work or general-purpose JavaScript semantics.

## 1.3 Terms and type vocabulary

| Term | Meaning |
| --- | --- |
| Source mode | `PROGRAM` statement-bearing source or `EXPRESSION` single-expression source |
| Compilation Profile | Mode and enabled feature families supplied by the consumer |
| Environment Schema | Allowed roots, typed property paths, nullability and symbolic availability |
| Semantic AST | Language-owned typed representation, independent of ANTLR parse-tree classes |
| Residual expression | Typed symbolic expression retained after partial evaluation |
| Intrinsic | Bounded compiler-recognized `len`/`contains`/quantifier form, not a general host call |
| Restricted lambda | One element binding accepted only within a quantifier predicate |
| Known input | Value available now; contrast an explicit symbolic root required for partial evaluation |

## 1.4 Source authority and consumers

The Language's grammar and semantics are specified in [sections 3–5](03-external-interface-requirements.md). The [Authorization SRS](../002.%20Authorization/README.md) and [Query Filtering SRS](../004.%20Query%20Filtering/README.md) **restrict** the Language to their accepted profiles and fields; they cannot silently extend its grammar. A future interpreter/compiler change must preserve the typed external semantics or obtain an explicit SRS revision.

## 1.5 Acceptance model

Conformance consists of valid/invalid compilation, result-typing, direct/partial evaluation and bounded resource behavior under the same schema and profile. The [verification section](09-verification-validation-and-acceptance.md) defines the acceptance cases; [traceability](10-traceability-and-unresolved-issues.md) identifies evidence and any unresolved limitations.
