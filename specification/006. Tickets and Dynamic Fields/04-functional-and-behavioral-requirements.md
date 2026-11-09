# 4. Functional and Behavioral Requirements

## 4.1 Ticket Type Lifecycle

### TKT-FR-001 — Stable Type identity

A created Ticket Type SHALL initially have status ACTIVE, a unique immutable `key`, and one dedicated EAV schema definition. Type `name` and ACTIVE/RETIRED status MAY change without changing the stable key/schema identity.

### TKT-FR-002 — Creation eligibility

New Tickets SHALL require an ACTIVE Type and a current PUBLISHED template. A RETIRED Type or a Type without a current published template SHALL NOT accept new Tickets.

### TKT-FR-003 — Draft creation

Creating a template draft SHALL allocate the next positive version number and copy fields from the Type's current template where one exists; otherwise the draft SHALL start with an empty field set.

### TKT-FR-004 — Draft editing

Only DRAFT versions SHALL permit full field replacement. The replacement SHALL validate each field and reject collisions with common Ticket field names. A previously published field identifier SHALL NOT change its key or data type.

### TKT-FR-005 — Publish and retire

Publishing SHALL require DRAFT, set status PUBLISHED and mark that version as the current template. Retiring SHALL require PUBLISHED, set status RETIRED and clear current version when the retired version was current.

### TKT-FR-006 — Historical template integrity

Published/retired templates SHALL remain available for historically pinned Ticket instances. A Type template edit or subsequent publish SHALL NOT silently rewrite already persisted Ticket field values.

## 4.2 Ticket Creation/Update

### TKT-FR-007 — Common fields and provenance

Ticket creation SHALL record a stable UUID, Type ID, schema instance ID, title/status, creator UUID, creation/update timestamps and initial optimistic-lock version. The creator, Type and historical schema association SHALL remain unchanged on Ticket patch.

### TKT-FR-008 — Version pinning

Creation SHALL persist a custom-field instance against the current PUBLISHED template version. Reading/updating custom fields SHALL use that instance's pinned historical version.

### TKT-FR-009 — Custom-field validation

Custom fields SHALL be validated by the declared data type, `required` flag and supported constraints. Creation or patch with unknown field keys SHALL fail. Clearing a required field SHALL fail; passing `null` for an optional field on patch SHALL remove the stored value.

### TKT-FR-010 — Patch behavior

Patch SHALL update supplied common fields and supplied custom-field keys without replacing unspecified custom fields. If neither common nor custom fields are changed, the service SHALL return the current projection without applying a mutation.

### TKT-FR-011 — Type-safe field identity

When replacing a draft field, an absent `fieldId` MAY reuse an existing identity if the key and type match; otherwise a new UUID SHALL be generated. A published field's key/type SHALL be immutable for its stable ID.

## 4.3 Query and Authorization

### TKT-FR-012 — Database-side authorization

Ticket listing SHALL combine optional Type restriction, Object Authorization, filter predicate, and sort before pagination. Ticket read/update SHALL resolve authorized targets through their operation-specific object predicates; unauthorized targets SHALL NOT be returned.

### TKT-FR-013 — Runtime query field snapshots

Global Ticket queries SHALL expose custom fields only where all eligible versions sharing the same visible key have one unambiguous schema definition, field identity and type. Type-scoped queries SHALL consider its published/retired versions. Per-Ticket read/update SHALL use the exact pinned version.

### TKT-FR-014 — Queryable custom types

STRING custom fields SHALL support EQ/NE/CONTAINS and sorting. NUMBER, DATE and DATETIME SHALL support EQ/NE/GT/GTE/LT/LTE and sorting. BOOLEAN, UUID and ENUM SHALL support EQ/NE but SHALL NOT be sortable.

### TKT-FR-015 — No unapproved fields

Only declared common and compatible runtime custom fields SHALL be available to filtering, sorting, and Object Authorization. An unknown or ambiguous field SHALL not silently become an unrestricted persistence expression.
