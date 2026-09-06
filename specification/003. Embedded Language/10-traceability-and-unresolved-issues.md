# 10. Traceability and Unresolved Issues

## 10.1 Traceability Approach

Each normative requirement has a stable identifier and observable verification objective. The requirement-to-verification index is maintained in the [verification and conformance matrix](09-verification-validation-and-acceptance.md#91-verification-and-conformance-matrix).

The Embedded Language owns only the source-language, typing, control-flow, evaluation, partial-evaluation, and generic queryability semantics defined by this SRS. Consuming features own their domain roots, domain semantics, result composition, resource access, persistence behavior, and execution lifecycle.

## 10.2 Unresolved Issues

No unresolved language-semantic conflict is recorded for version 0.2.0.

Concrete deployment values for the configurable compiler limits required by PERF-001 are implementation/configuration decisions, provided every active configuration preserves the finite-limit requirement and corresponding verification boundary.

Export/module syntax, user-defined functions, arrow functions, call expressions, utility functions, additional statements, and additional consumer-defined scalar types require an explicit future specification revision before they become part of the language contract.
