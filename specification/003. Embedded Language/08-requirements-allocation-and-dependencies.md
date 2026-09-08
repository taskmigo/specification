# 8. Requirements Allocation and Dependencies

## 8.1 Assumptions and Dependencies

- The Environment Schema defines root names, structured paths, types, nullability, and symbolic availability.
- Each compilation supplies a Compilation Profile selecting one mode and enabled feature families.
- Each evaluation operation supplies required roots as known or unknown values.
- The parser frontend depends on the ANTLR Java runtime.
- Consumer-specific purposes, queryability, and persistence translation remain external.

## 8.2 Requirements Allocation

| Responsibility                                           | Embedded Language | External Environment |
| -------------------------------------------------------- | ----------------- | -------------------- |
| Parse canonical `PROGRAM` and `EXPRESSION` sources       | SHALL             | SHALL NOT            |
| Enforce Compilation Profile                              | SHALL             | SHALL supply         |
| Bind/type-check paths, locals, restricted lambdas        | SHALL             | SHALL NOT            |
| Define bounded intrinsic semantics                       | SHALL             | SHALL NOT            |
| Validate complete return flow                            | SHALL in PROGRAM  | SHALL NOT            |
| Produce typed Semantic AST                               | SHALL             | SHALL NOT            |
| Evaluate and partially evaluate                          | SHALL             | MAY invoke           |
| Define application root/path contracts                   | SHALL NOT         | SHALL                |
| Define queryability or persistence mappings              | SHALL NOT         | SHALL                |
| Define consumer-specific profile purpose                 | SHALL NOT         | SHALL                |
