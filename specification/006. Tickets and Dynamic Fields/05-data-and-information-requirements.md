# 5. Data and Information Requirements

This data contract distinguishes immutable Ticket identity and Type ownership, common fields, versioned EAV metadata, typed custom values and historic field identity.

## 5.1 Ticket Common Fields

### TKT-DATA-001 — Ticket row

**Normative requirement.** A Ticket SHALL persist `id`, `ticket_type_id`, `schema_instance_id`, `title`, `status`, `created_by`, `created_at`, `updated_at`, and `version`. `title`/`status` SHALL be nonblank. `created_by` SHALL reference a persisted User identity.

### TKT-DATA-002 — Ticket Type row

**Normative requirement.** Ticket Type SHALL persist stable `id`, unique `type_key`, `name`, ACTIVE/RETIRED `status`, owning `schema_definition_id`, and timestamps.

## 5.2 Versioned EAV Schema

### TKT-DATA-003 — Schema lifecycle

**Normative requirement.** Each EAV definition SHALL own monotonically increasing positive versions; versions SHALL have DRAFT, PUBLISHED, or RETIRED status and immutable schema-version identity. A definition MAY point to its current published version.

### TKT-DATA-004 — Typed values

**Normative requirement.** Custom values SHALL be stored in typed EAV value fields rather than unvalidated arbitrary JSON, constrained by a field definition's UUID, key, data type, required flag and constraints.

### TKT-DATA-005 — Field types and constraints

**Normative requirement.** - **STRING:** `minLength`, `maxLength`.

- **NUMBER:** `minimum`, `maximum`.
- **BOOLEAN:** No additional constraints.
- **DATE/DATETIME:** `minimum`, `maximum`.
- **UUID:** No additional constraints.
- **ENUM:** `options` defining allowed values.

Input SHALL be checked against the field's type and supported constraints before persistence.

## 5.3 Schema Identity and Query Data

### TKT-DATA-006 — Historical identity

**Normative requirement.** An EAV instance SHALL retain its `schema_definition_id` and `schema_version_id`. Query schema identity SHALL include effective runtime fields and their field/source identities to prevent binding predicates against incompatible templates.
