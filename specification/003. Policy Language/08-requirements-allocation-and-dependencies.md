# 8. Requirements Allocation and Dependencies

## 8.1 Assumptions and Dependencies

- Consumers provide Environment Schemas that define root names, fields, nullability, scalar semantics, and optional query capabilities.
- Consumers determine which required roots are known or unknown for each evaluation operation.
- Consumers that require residual query lowering provide a persistence-neutral query-lowering capability contract.
- Consumer-domain policy semantics, scope names, effects, targets, and lifecycle rules are outside the Policy Language.
- The initial language provides no export/module system, user-defined functions, arrow functions, call expressions, or utility-function library.
- The parser frontend depends on the ANTLR Java runtime as constrained by TECH-001.
- The Policy Language does not depend on an ECMAScript parser or JavaScript runtime.

## 8.2 Requirements Allocation

| Responsibility                                 | Policy Language | Consumer                          |
| ---------------------------------------------- | --------------- | --------------------------------- |
| Parse canonical policy body                    | SHALL           | SHALL NOT                         |
| Bind and type-check statements/expressions     | SHALL           | SHALL NOT                         |
| Validate complete boolean return control flow  | SHALL           | SHALL NOT                         |
| Produce typed Policy IR                        | SHALL           | SHALL NOT                         |
| Evaluate known policy inputs                   | SHALL           | MAY invoke                        |
| Partially evaluate known/unknown inputs        | SHALL           | MAY invoke                        |
| Define domain root names and field contracts   | SHALL NOT       | SHALL                             |
| Determine known/unknown roots per operation    | SHALL NOT       | SHALL                             |
| Define domain scope/effect/target semantics    | SHALL NOT       | SHALL                             |
| Validate residual queryability                 | SHALL           | SHALL provide capability contract |
| Lower residual predicates to consumer query IR | SHALL NOT       | MAY                               |
| Execute persistence/business operations        | SHALL NOT       | SHALL                             |

The Policy Language SHALL expose the typed residual and queryability result necessary for a consumer to enforce its own execution contract without importing consumer-domain semantics into the language subsystem.
