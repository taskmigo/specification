# 5. Data and Information Requirements

## 5.1 Query Schema

### DATA-001 — Field descriptors

A field's logical identity SHALL include its public path, JVM/logical type, nullability, operator allowlist, sortable flag and source identity. The operation name SHALL be part of the full Query Schema identity.

### DATA-002 — Immutable query result

`ListQuerySpec` SHALL hold the opaque predicate, immutable runtime field context, and immutable prioritized `List<QuerySort>` descriptions. The compiled predicate SHALL retain its schema identity for binding checks.

## 5.2 Dynamic Fields

### DATA-003 — Server-owned context

Runtime context SHALL contain only server-resolved field metadata. API clients SHALL NOT provide arbitrary field source identity or schema-version binding metadata.

### DATA-004 — EAV compatibility

A custom-field key SHALL be eligible in a multi-version query only if the schema definition UUID, field UUID and type remain unambiguous across the selected eligible published/retired versions.

## 5.3 Pagination

The common `OffsetPage` model records items, totalItems and totalPages. Web wraps it in API v0 `OffsetMeta` and preserves one-based page numbering in the response.
