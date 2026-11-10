# 5. Data and Information Requirements

Typed operation schemas and server-owned dynamic field context are identity-sensitive data; a predicate compiled against one context cannot silently be rebound against another.

## 5.1 Query Schema

### DATA-001 — Field descriptors

**Normative requirement.** A field's logical identity SHALL include its public path, JVM/logical type, nullability, operator allowlist, sortable flag and source identity. The operation name SHALL be part of the full Query Schema identity.

### DATA-002 — Immutable query result

**Normative requirement.** `ListQuerySpec` SHALL hold the opaque predicate, immutable runtime field context, and immutable prioritized `List<QuerySort>` descriptions. The compiled predicate SHALL retain its schema identity for binding checks.

## 5.2 Dynamic Fields

### DATA-003 — Server-owned context

**Normative requirement.** Runtime context SHALL contain only server-resolved field metadata. API clients SHALL NOT provide arbitrary field source identity or schema-version binding metadata.

### DATA-004 — EAV compatibility

**Normative requirement.** A custom-field key SHALL be eligible in a multi-version query only if the schema definition UUID, field UUID and type remain unambiguous across the selected eligible published/retired versions.

## 5.3 Pagination

The common `OffsetPage` model records items, totalItems and totalPages. Web wraps it in API v0 `OffsetMeta` and preserves one-based page numbering in the response.
