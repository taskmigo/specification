# 2. Overall Description

## 2.1 Entity Audit Perspective

The Audit bounded supporting capability records one entity mutation with actor, occurrence time, entity reference, and field-level changes. Only entity type `user` is currently supported by the query service. Audit append and privacy-scrub operations participate in the calling business transaction.

## 2.2 Privacy

A sensitive field diff omits its before/after values by construction. Tombstoning a User scrubs identifying historical User diffs and replaces the actor's username with `Unknown user` without deleting the underlying audit record.

## 2.3 API v0 Perspective

The Web app exposes versioned `/api/v0/**` endpoints with one structured response envelope. Collection APIs with pagination provide one-based offset pagination, optional `filterBy` and repeated `sortBy` when their controllers declare those capabilities.

## 2.4 Public Documentation

The OpenAPI generator derives v0 operations from code and emits operation-specific `x-filter-by` and `x-sort-by` metadata from registered Query Schemas. The checked-in OpenAPI snapshot SHALL be generated, not edited manually.

## 2.5 Out of Scope

The current implementation SHALL NOT be described as providing generic audit retrieval for arbitrary entity types, a dedicated Authorization Log persistence API, a cursor-paginated public endpoint, or all future CRUD verbs for every resource.
