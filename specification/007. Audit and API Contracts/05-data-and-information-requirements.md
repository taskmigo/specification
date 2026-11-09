# 5. Data and Information Requirements

## 5.1 Persisted Audit Records

### AUD-DATA-001 — Audit fields

The `audit_logs` record SHALL persist audit UUID, audited entity type/UUID, actor UUID/username, occurred-at instant, and field changes encoded as structured JSON.

### AUD-DATA-002 — Immutable audit model

The public Audit model SHALL not permit mutation of its field-change list. Sensitive field values SHALL be omitted before serialization to persistence.

### AUD-DATA-003 — Privacy scrub fields

For User tombstone, the persisted actor name and User PII field-change payloads SHALL be rewritten for privacy while audit IDs, actor IDs, target IDs and timestamps remain stable.

## 5.2 API Metadata

### API-DATA-001 — Envelope metadata

Basic API responses SHALL contain `meta.execution`. Offset responses SHALL additionally include offset pagination state. The internal response model supports cursor metadata, but the reviewed public resource controllers expose offset-pagination endpoints.

### API-DATA-002 — OpenAPI operation schemas

OpenAPI documentation SHALL derive field allowlists and sort capabilities from registered Query Schemas, not implicitly reflect arbitrary database columns.
