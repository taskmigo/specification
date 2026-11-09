# 4. Functional and Behavioral Requirements

## 4.1 Audit Append and Privacy

### AUD-FR-001 — Synchronous transaction participation

An Entity Audit event SHALL be appended synchronously inside the caller's active transaction using `MANDATORY` participation. Audit persistence failure SHALL therefore prevent the originating mutation from committing successfully.

### AUD-FR-002 — Immutable event metadata

Each event SHALL carry a stable UUID, entity type/ID, actor UUID/username, millisecond-precision occurrence instant, and immutable ordered list of field changes.

### AUD-FR-003 — Sensitive field omission

A change marked `sensitive=true` SHALL have `before=null` and `after=null` before persistence. Construction with sensitive=true and nonnull before/after SHALL be rejected.

### AUD-FR-004 — User privacy scrubbing

User tombstoning SHALL scrub older Audit events where that User was actor or target. Actor username SHALL become `Unknown user`; target User diff values for `username`, `firstName`, `lastName`, and `emails` SHALL become sensitive markers.

### AUD-FR-005 — Audited deletion actions

User deletion and tombstone operations SHALL record status/lifecycle transitions and sensitive markers for revoked roles/statements/groups/sessions or purged identifying fields as applicable, without exposing purged values.

### AUD-FR-006 — Audit read order

Audit retrieval SHALL order records by `occurredAt DESC`, then `id DESC`; the query SHALL use one-based offset pagination.

## 4.2 API v0 Error Semantics

### API-FR-001 — Input validation

Invalid field-level body validation SHALL return HTTP 422 with `validation.failed` and `formErrors`; malformed JSON/body SHALL return HTTP 400 with `request.malformed`.

### API-FR-002 — Filter/sort failure isolation

Invalid `filterBy` SHALL return HTTP 400 with error code `INVALID_FILTER`. Invalid `sortBy` SHALL return HTTP 400 with error code `INVALID_SORT`. Neither SHALL fall back to unrestricted result retrieval.

### API-FR-003 — Domain failures

Domain failure types INVALID_INPUT, NOT_FOUND, CONFLICT, and UNPROCESSABLE SHALL map to HTTP 400, 404, 409, and 422 respectively; forbidden access SHALL map to HTTP 403.

### API-FR-004 — Success behavior

Standard read/update responses SHALL use HTTP 200; successful resource creation SHALL use HTTP 201 with a Location header and created `id` or resource representation as defined by its owning endpoint.

### API-FR-005 — Unknown server failures

Unhandled exceptions SHALL return HTTP 500 with a generic internal-error message rather than leaking implementation stack traces.

## 4.3 Audit Feature Activation

### AUD-FR-007 — Runtime configuration

Audit application services and the JPA store SHALL be enabled when `taskmigo.audit.enabled=true`. This SRS SHALL NOT imply they are active when that property disables them.
