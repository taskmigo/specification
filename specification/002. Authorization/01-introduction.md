# 1. Introduction

## 1.1 Purpose

This SRS defines **Taskmigo's authorization model and external contract**: how policies are authored as Statements, how Roles and direct grants are resolved, how each request is admitted or rejected, and how resource selection is restricted by Object Authorization. It is written for independent API consumers and policy implementers, not as a restatement of Java classes.

The source-backed implementation evidence is pinned to [backend commit `9c1cd242`](https://github.com/taskmigo/taskmigo/tree/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/authorization). Where the reviewed source and approved requirements diverge, the discrepancy belongs in [section 10](10-traceability-and-unresolved-issues.md).

## 1.2 Scope and responsibilities

Authorization owns Statement creation/deletion, Roles and role hierarchy, subject grants, effective Statement resolution, Request Authorization, and Object Authorization. Request evaluation yields an allow/deny decision for an operation. Object evaluation yields a **schema-bound logical predicate**, to be combined with resource data access before mutation or pagination.

Identity owns User and Group lifecycle and supplies effective subjects through published interfaces; Query owns supported query schemas; Language owns the compiler and type system. Authorization cannot bypass those boundaries by importing private persistence classes.

## 1.3 Vocabulary

| Term                   | Meaning                                                                                 |
| ---------------------- | --------------------------------------------------------------------------------------- |
| Statement              | Unique-code policy rule with effect, scope, HTTP target and source expression           |
| Effect                 | `allow` or `deny` on creation, with domain values `ALLOW` and `DENY`                    |
| Request scope          | Policy evaluated to a Boolean operation admission decision                              |
| Object scope           | Policy partially evaluated to a typed resource-selection predicate                      |
| Effective Statement    | Direct or inherited rule applicable to the current subject set                          |
| Authorization snapshot | Immutable matching Statement set and approved principal/request input for one operation |
| Fail closed            | Errors and unsupported policies never become permission grants                          |
| Decision log           | Separate authorization evaluation history—**not implemented** in this baseline          |

## 1.4 Source and related specifications

- [Authorization source](https://github.com/taskmigo/taskmigo/tree/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/authorization).
- [Request authorization implementation](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/authorization/src/main/java/io/taskmigo/authorization/request/application/service/RequestAuthorizationService.java).
- [Object authorization implementation](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/authorization/src/main/java/io/taskmigo/authorization/object/application/service/ObjectAuthorizationService.java).
- [Language](../003.%20Language/README.md) and [Query Filtering](../004.%20Query%20Filtering/README.md) own syntax/type and safe query-conversion contracts.

## 1.5 Reading and acceptance

For a consumer, [section 3](03-external-interface-requirements.md) is the **wire contract** for Statements, Roles and direct grants; [section 4](04-functional-and-behavioral-requirements.md) defines request/object authorization semantics; [section 9](09-verification-validation-and-acceptance.md) gives objective pass/fail cases. A passing API call with an overly broad object set does not satisfy this SRS.
