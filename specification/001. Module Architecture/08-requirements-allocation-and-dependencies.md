# 8. Requirements Allocation and Dependencies

## 8.1 Physical Project Map

The authoritative project roster is the [Gradle settings file](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/settings.gradle.kts). The table records direct production dependencies, omitting transitive dependencies and third-party libraries.

| Owner                | Public / direct dependencies                                                                    | Purpose                          |
| -------------------- | ----------------------------------------------------------------------------------------------- | -------------------------------- |
| `foundation:core`    | None                                                                                            | Generic core contracts           |
| `foundation:spring`  | `foundation:core`                                                                               | Spring support                   |
| `internal:language`  | None                                                                                            | Restricted language              |
| `query`              | `foundation:core`, `internal:language`                                                          | Query compiler and logical model |
| `internal:jpa-query` | `foundation:core`, `query`                                                                      | Typed JPA binding                |
| `authorization`      | `foundation:core`, `query`, `internal:language`, `internal:jpa-query`                           | Authorization and grants         |
| `audit`              | `foundation:core`                                                                               | Transactional audit              |
| `identity`           | `foundation:core`, `query`, `authorization`, `audit`, `internal:language`, `internal:jpa-query` | Users, groups, lifecycle         |
| `internal:eav`       | `query`, `internal:jpa-query`                                                                   | Versioned typed custom fields    |
| `ticket`             | `foundation:core`, `query`, `authorization`, `internal:jpa-query`, `internal:eav`               | Tickets and templates            |
| `database`           | None (Taskmigo)                                                                                 | JDBC/JPA runtime and schema      |

Project declarations SHALL preserve the public `api` versus private `implementation` distinctions verified by each project's Gradle file; this table intentionally summarizes both without implying all edges are public.

## 8.2 Executable Dependency Model

- **Web:** Foundation Spring, Query, Audit, Authorization, Identity, Ticket, and runtime Database.
- **Worker:** Foundation Spring, Identity, and runtime Database.
- **Migration:** Foundation Spring, Authorization, Identity, and runtime Database.
- **OpenAPI generator:** Documentation tooling; does not become a fourth business runtime.
- **Architecture testing:** Test-only shared rules, never a production module.
- **Authorization benchmarks:** JMH-only workload, not runtime behavior.

## 8.3 Prohibited Dependencies

Application modules SHALL NOT import internal capability projects directly. Business modules SHALL NOT import any executable application's code. Cross-context private-package and ORM imports SHALL remain forbidden regardless of a Gradle project edge.

## 8.4 Transaction Allocation

- **Domain:** Pure transition/invariant logic.
- **Concrete application service:** Ordinary `@Transactional` ownership; read-only transactions where appropriate.
- **Audit:** `MANDATORY` append/privacy participation.
- **Authorization persistence:** Dedicated isolated effective-Statement resolution when required for a coherent snapshot.
- **Migration installer:** `TransactionTemplate` with SERIALIZABLE isolation and at most three reconciliation attempts.

## 8.5 Cross-Specification Ownership

[Authorization](../002.%20Authorization/README.md) owns policy evaluation. [Language](../003.%20Language/README.md) owns syntax and evaluation. [Query Filtering](../004.%20Query%20Filtering/README.md) owns client filter/sort contract. [Identity and User Retention](../005.%20Identity%20and%20User%20Retention/README.md), [Tickets and Dynamic Fields](../006.%20Tickets%20and%20Dynamic%20Fields/README.md) and [Audit and API](../007.%20Audit%20and%20API%20Contracts/README.md) own their specified behaviors.
