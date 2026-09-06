# 10. Traceability and Unresolved Issues

## 10.1 Traceability Approach

Each normative requirement has a stable identifier and observable verification objective. The requirement-to-verification index is maintained in the [verification and conformance matrix](09-verification-validation-and-acceptance.md#91-verification-and-conformance-matrix).

The [Authorization feature](../002.%20Authorization/README.md) owns authorization effects, target matching, effective Statement resolution, Object filter composition, and persistence execution. TPL owns the source-language, function/export, typing, and evaluation semantics used by that feature.

## 10.2 Unresolved Issues

No unresolved language-semantic conflict is recorded for version 0.1.0.

Concrete deployment values for the configurable compiler limits required by PERF-001 are implementation/configuration decisions, provided every active configuration preserves the finite-limit requirement and corresponding verification boundary.

Utility functions, function parameters, cross-policy imports, and additional consumer-defined scalar types require an explicit future specification revision before they become part of the language contract.
