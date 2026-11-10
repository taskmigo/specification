# 1. Introduction

## 1.1 Purpose

This specification defines the Access Control/Authorization capability implemented in the Taskmigo server as of backend commit `9c1cd242fe4c5210fdd8dd88311e328a3784d0e1`. It supersedes earlier speculative Authorization Log, universal program-mode policy and compiler-cache requirements that are not implemented.

## 1.2 Scope

The capability SHALL own Role, Statement, subject grant, effective Statement resolution, Request Authorization and Object Authorization. A policy SHALL be evaluated within a bounded Language profile against explicitly approved request/principal/object fields.

## 1.3 Terms

- **Statement:** Named allow/deny rule with request/object scope, API method/path target, and policy source.
- **Effective subject:** The current User and associated inherited subjects contributing direct Roles/Statements.
- **Request Authorization:** Boolean gate for an HTTP request.
- **Object Authorization:** Database-bindable predicate constraining which objects are visible/actionable.
- **Authorization snapshot:** Immutable effective Statements and approved input roots for one operation.
- **Authorization decision log:** Separate database event ledger not implemented in the current code.

## 1.4 References

- [Authorization module](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/authorization).
- [RequestAuthorizationService](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/authorization/src/main/java/io/taskmigo/authorization/request/application/service/RequestAuthorizationService.java).
- [ObjectAuthorizationService](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/authorization/src/main/java/io/taskmigo/authorization/object/application/service/ObjectAuthorizationService.java).
- [Migration-managed Statements](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/migration/src/main/resources/migration/statements.yaml).

## 1.5 Structure

Sections 3 and 4 define contracts and semantics. Section 10 records preserved and withdrawn requirement identifiers from the outdated baseline.
