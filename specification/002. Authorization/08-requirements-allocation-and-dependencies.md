# 8. Requirements Allocation and Dependencies

## 8.1 Owning Components

- **Authorization role/statement/subject:** Persist Roles, Statements, direct grants and hierarchy; expose published use cases.
- **Request Authorization:** Resolve authoritative effective Statements, compile/evaluate REQUEST policies and return immutable operation context.
- **Object Authorization:** Compile/validate OBJECT expressions, partially evaluate with principal/request and compose opaque allowed/denied predicates.
- **Identity:** Own User/Group identity, membership and effective subject expansion without moving those aggregates into Authorization.
- **Query:** Own operation-scoped field allowlists, predicate identity and logical operators.
- **Internal Language:** Own parser/evaluator, compilation mode/profile, typed AST and partial evaluation.
- **Internal JPA Query and resource owners:** Map symbolic fields to trusted database predicates.
- **Web:** Enforce JWT identity, ACTIVE User state, Request Authorization on versioned routes and Object Authorization within relevant controller operations.

## 8.2 Contract Direction

Authorization SHALL NOT depend on Identity/Ticket internals. Identity and Ticket MAY depend on published Authorization abstractions. Query SHALL remain independent of Authorization; Language SHALL remain independent of Query.

## 8.3 Operational Data

The [migration Statements](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/migration/src/main/resources/migration/statements.yaml) and [Roles](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/migration/src/main/resources/migration/roles.yaml) are concrete managed policy examples, not universal hardcoded permission bypasses. Changes to these managed definitions affect actual authorization behavior.

## 8.4 Related SRSs

[Architecture](../001.%20Module%20Architecture/README.md), [Language](../003.%20Language/README.md), [Query Filtering](../004.%20Query%20Filtering/README.md), and [API Audit](../007.%20Audit%20and%20API%20Contracts/README.md).
