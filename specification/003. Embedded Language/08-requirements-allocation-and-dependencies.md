# 8. Requirements Allocation and Dependencies

## 8.1 Assumptions and Dependencies

- The Environment Schema defines root names, fields, nullability, scalar semantics, and symbolic availability.
- Each evaluation operation supplies required roots as known or unknown values.
- The initial language provides no export/module system, user-defined functions, arrow functions, call expressions, or utility-function library.
- The parser frontend depends on the ANTLR Java runtime as constrained by TECH-001.
- The Embedded Language does not depend on an ECMAScript parser or JavaScript runtime.

## 8.2 Requirements Allocation

| Responsibility                              | Embedded Language | External Environment |
| ------------------------------------------- | ----------------- | -------------------- |
| Parse canonical program                     | SHALL             | SHALL NOT            |
| Bind and type-check statements/expressions  | SHALL             | SHALL NOT            |
| Validate complete typed return control flow | SHALL             | SHALL NOT            |
| Determine the static program result type    | SHALL             | SHALL NOT            |
| Produce typed Semantic AST                  | SHALL             | SHALL NOT            |
| Evaluate known program inputs               | SHALL             | MAY invoke           |
| Partially evaluate known/unknown inputs     | SHALL             | MAY invoke           |
| Define root names and field contracts       | SHALL NOT         | SHALL                |
| Supply values for evaluation                | SHALL NOT         | SHALL                |
