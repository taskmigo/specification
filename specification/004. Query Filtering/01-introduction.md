# 1. Introduction

## 1.1 Purpose

This SRS defines how a Taskmigo API consumer **filters, orders and pages resource collections safely and predictably**, and how internal callers combine those requests with Object Authorization. It specifies the shared FilterBy/SortBy grammar and the boundaries of operation-scoped typed Query Schemas. It does **not** grant clients arbitrary query or SQL execution capability.

The inspected implementation is pinned to [backend commit `9c1cd242`](https://github.com/taskmigo/taskmigo/tree/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/query). Per-operation filter/sort field allowlists are normative in the owning resource module's interface section, not inferred from response JSON.

## 1.2 Scope

This SRS covers request parameters `filterBy`, ordered repeated `sortBy`, and offset paging; safe expression compilation; typed field/operator allowlists; runtime dynamic-field contexts; trusted persistence translation; and composition with resource-specific scope and Object Authorization before pagination.

The Query module owns schemas and logical predicates. Web owns transport binding. Resource owners map only trusted query paths into their database model. Authorization independently supplies mandatory Object predicates; neither client filters nor page sizes may bypass authorization.

## 1.3 Terms

| Term                   | Definition                                                                 |
| ---------------------- | -------------------------------------------------------------------------- |
| Operation Query Schema | Stable operation identifier and its supported field/operator metadata      |
| Logical field          | Public allowlisted query path independent of JPA/storage field spelling    |
| `filterBy`             | Restricted Boolean expression over `object.<field>` and supported literals |
| `sortBy`               | Repeated query field ordered by priority, optionally prefixed with `-`     |
| QueryFieldContext      | Server-owned runtime metadata for dynamic or versioned fields              |
| Schema-bound predicate | Validated typed expression associated with one schema/context identity     |
| Object predicate       | Mandatory authorization filter resolved independently of client input      |

## 1.4 Evidence and related SRS

- [Filter compiler](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/query/src/main/java/io/taskmigo/query/FilterByCompiler.java).
- [Query schema validator](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/query/src/main/java/io/taskmigo/query/QuerySchemaValidator.java).
- [Web query compiler](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/web/src/main/java/io/taskmigo/web/api/support/query/ListQueryOptionsCompiler.java).
- [Authorization](../002.%20Authorization/README.md), [Tickets](../006.%20Tickets%20and%20Dynamic%20Fields/README.md), and [API Envelope](../007.%20Audit%20and%20API%20Contracts/README.md).

## 1.5 Verification perspective

Consumer conformance requires correct parsing **and** exact field allowlists, access-restricted result membership, total counts and SQL-side pagination. Tests that filter a fully unrestricted in-memory dataset do not verify authorization semantics.
