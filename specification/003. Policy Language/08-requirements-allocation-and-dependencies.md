# 8. Requirements Allocation and Dependencies

## 8.1 Assumptions and Dependencies

- The [Authorization feature](../002.%20Authorization/README.md) is the initial TPL consumer and defines Request/Object Authorization behavior outside the language.
- Consumers provide Environment Schemas that define roots, fields, nullability, scalar semantics, and query capabilities.
- Consumers that require database-side residual evaluation provide a persistence-neutral query-lowering boundary.
- Registered intrinsics provide stable type, runtime, and query-lowering contracts.
- The parser frontend depends on the ANTLR Java runtime as constrained by TECH-001.
- TPL does not depend on an ECMAScript parser or JavaScript runtime.

## 8.2 Requirements Allocation

| Responsibility                                      | TPL subsystem | Authorization consumer |
| --------------------------------------------------- | ------------- | ---------------------- |
| Parse canonical policy source                       | SHALL         | SHALL NOT              |
| Bind and type-check expressions                     | SHALL         | SHALL NOT              |
| Produce typed Policy IR                             | SHALL         | SHALL NOT              |
| Evaluate known policy inputs                        | SHALL         | MAY invoke             |
| Partially evaluate known/unknown inputs             | SHALL         | MAY invoke             |
| Define `principal`, `request`, and `object` schemas | SHALL NOT     | SHALL                  |
| Define Statement effects and target matching        | SHALL NOT     | SHALL                  |
| Validate residual queryability                      | SHALL expose  | SHALL provide mapping  |
| Lower residual predicates to persistence filter     | SHALL NOT     | SHALL                  |
| Execute JPA/database query                          | SHALL NOT     | SHALL                  |

The "SHALL expose" allocation means TPL SHALL expose the typed residual and capability information necessary for the consumer to perform the validation required by QUERY-001.
