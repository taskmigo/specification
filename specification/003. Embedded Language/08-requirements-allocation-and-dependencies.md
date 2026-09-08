# 8. Requirements Allocation and Dependencies

## 8.1 Assumptions and Dependencies

- The Environment Schema defines root names, fields, nullability, scalar semantics, and symbolic availability.
- Each evaluation operation supplies required roots as known or unknown values.
- Each compilation supplies a Compilation Profile selecting `PROGRAM` or `EXPRESSION` mode and the enabled language feature families.
- The initial language provides no export/module system, user-defined functions, arrow functions, call expressions, or utility-function library.
- The parser frontend depends on the ANTLR Java runtime as constrained by TECH-001.
- The Embedded Language does not depend on an ECMAScript parser or JavaScript runtime.
- Consumer-specific purposes such as authorization or client filtering are external to the Embedded Language contract.

## 8.2 Requirements Allocation

| Responsibility                                      | Embedded Language | External Environment |
| --------------------------------------------------- | ----------------- | -------------------- |
| Parse canonical `PROGRAM` and `EXPRESSION` sources  | SHALL             | SHALL NOT            |
| Enforce the supplied Compilation Profile            | SHALL             | SHALL supply         |
| Bind and type-check statements/expressions          | SHALL             | SHALL NOT            |
| Validate complete typed return control flow         | SHALL in PROGRAM  | SHALL NOT            |
| Determine the static source result type             | SHALL             | SHALL NOT            |
| Produce typed Semantic AST                          | SHALL             | SHALL NOT            |
| Evaluate known source inputs                        | SHALL             | MAY invoke           |
| Partially evaluate known/unknown inputs             | SHALL             | MAY invoke           |
| Define root names and field contracts               | SHALL NOT         | SHALL                |
| Define consumer-specific profile selection/purpose  | SHALL NOT         | SHALL                |
| Supply values for evaluation                        | SHALL NOT         | SHALL                |
