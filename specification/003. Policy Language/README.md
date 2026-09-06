---
name: Policy Language feature
version: 0.1.0
---

<!-- markdownlint-disable MD041 -->

## Table of contents

| Section | Title                                             | Purpose                                                               | Document                                                                                         |
| ------- | ------------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| 1       | Introduction                                      | Purpose, scope, terminology, references, and document control         | [01-introduction.md](01-introduction.md)                                                         |
| 2       | Overall Description                               | Product context, execution model, stakeholders, and boundaries        | [02-overall-description.md](02-overall-description.md)                                           |
| 3       | External Interface Requirements                   | Policy-body syntax, environment, and compiled-policy interfaces       | [03-external-interface-requirements.md](03-external-interface-requirements.md)                   |
| 4       | Functional and Behavioral Requirements            | Typing, control flow, evaluation, partial evaluation, and query lowering | [04-functional-and-behavioral-requirements.md](04-functional-and-behavioral-requirements.md)  |
| 5       | Data and Information Requirements                 | Values, schemas, compiled artifacts, and source metadata               | [05-data-and-information-requirements.md](05-data-and-information-requirements.md)               |
| 6       | Quality and Performance Requirements              | Determinism, bounded compilation, and execution quality                | [06-quality-and-performance-requirements.md](06-quality-and-performance-requirements.md)         |
| 7       | Constraints                                       | ANTLR frontend, language restrictions, isolation, and safety           | [07-constraints.md](07-constraints.md)                                                           |
| 8       | Requirements Allocation and Dependencies          | Authorization, schema, query, and parser dependencies                  | [08-requirements-allocation-and-dependencies.md](08-requirements-allocation-and-dependencies.md) |
| 9       | Verification, Validation, and Acceptance Evidence | Verification objectives and conformance conditions                    | [09-verification-validation-and-acceptance.md](09-verification-validation-and-acceptance.md)     |
| 10      | Traceability and Unresolved Issues                | Requirement traceability and unresolved decisions                     | [10-traceability-and-unresolved-issues.md](10-traceability-and-unresolved-issues.md)             |
| 11      | Appendices                                        | Canonical examples and non-normative extension guidance               | [11-appendices.md](11-appendices.md)                                                             |

## Read order

Read the documents in section-number order from 1 through 11. Use Section 3 for the source contract, Section 4 for semantics, Section 7 for implementation constraints, and Section 9 for verification evidence.

## History

| Version | Short summary of changes                                                                                                                                                                                                                                                                                                         |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 0.1.0   | <ul><li>Defined Taskmigo Policy Language as a single policy body using JavaScript-like `const`, `return`, `if (...)`, and `&&`/`||`/`!` surface syntax.</li><li>Defined static typing, partial evaluation, and query-lowering requirements for Object Authorization.</li><li>Excluded `export`, user-defined functions, arrow functions, calls, and utility functions from the initial language.</li><li>Required an ANTLR-generated Java parser frontend.</li></ul> |
