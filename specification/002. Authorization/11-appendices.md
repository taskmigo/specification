# 11. Appendices

## 11.1 Future Extensions (non-normative)

### `filterBy`

A future client-facing `filterBy` feature can use the [Embedded Language](../003.%20Embedded%20Language/README.md) in `EXPRESSION` mode with a consumer-owned Compilation Profile that disables language features outside the client-filter contract.

Its external query-parameter syntax, exposed root namespace, result-type contract, and exact enabled feature set are not specified by this Authorization SRS and require a separate client-filter specification.

When such a feature is specified, a valid client filter can produce a typed `Bool` Semantic AST expression, validate that expression against the applicable Filter Schema, and share the same persistence-query compiler used by Object Authorization. A separate Filter AST is not required merely to translate equivalent Semantic AST operators into another predicate tree.

The intended list-query composition is:

```text
business predicate
AND client filter predicate
AND authorization predicate
```

before pagination.

### Relationships and Additional Operators

Nested object paths, joins/subqueries, relationship predicates, and query operators outside the current Filter Schema/Object Predicate contract require a separate complete specification before inclusion in the authorization model.
