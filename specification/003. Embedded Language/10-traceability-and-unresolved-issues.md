# 10. Traceability and Unresolved Issues

## 10.1 Traceability Approach

Each normative requirement has a stable identifier and observable verification objective. The requirement-to-verification index is maintained in the [verification and conformance matrix](09-verification-validation-and-acceptance.md#91-verification-and-conformance-matrix).

## 10.2 Unresolved Issues

No unresolved language-semantic conflict is recorded for version 0.4.0.

Concrete deployment values for the configurable compiler limits required by PERF-001 are implementation/configuration decisions, provided every active configuration preserves the finite-limit requirement and corresponding verification boundary.

Consumer-specific Compilation Profiles, including the exact feature subset selected for authorization, client filtering, or another consumer, belong to the consumer specification. Such profiles may only restrict the canonical language under ENV-004.

Export/module syntax, user-defined functions, arrow functions, call expressions, utility functions, additional statements, additional feature families, and additional schema-defined scalar types require an explicit future specification revision before they become part of the language contract.
