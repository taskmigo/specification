# 11. Appendices

## 11.1 Future Extensions (non-normative)

### `filterBy`

A future client-facing `filterBy` feature SHALL compile into the same Filter AST used by Object Authorization.

Its external syntax is not specified by this SRS.

When introduced, list-query composition SHALL be:

```text
business predicate
AND client filter predicate
AND authorization predicate
```

before pagination.

### Relationships and Additional Operators

Nested object paths, joins/subqueries, relationship predicates, and additional Filter AST operators require a separate complete specification before inclusion in the authorization model.
