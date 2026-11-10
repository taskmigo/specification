# 7. Constraints

No independent decision log, unsupported entity query, query fallback or client-visible cursor route is asserted.

## 7.1 Audit Boundaries

### AUD-CON-001 — No standalone Authorization Log API

**Normative requirement.** The current backend SHALL NOT be represented as implementing `GET /api/v0/authorization/logs` or a dedicated persisted allowed/denied/error authorization-decision ledger.

### AUD-CON-002 — Audit event privacy

**Normative requirement.** Sensitive changes SHALL NOT carry old/new field values, even when a caller attempts to supply them.

### AUD-CON-003 — Transaction requirement

**Normative requirement.** Audit append and privacy scrub SHALL require an existing transaction; independent autocommit events SHALL NOT replace atomic business audit.

### AUD-CON-004 — Limited queryable entity types

**Normative requirement.** Public Audit query SHALL reject unsupported entity types; current support is limited to `user`.

## 7.2 Public API

### API-CON-001 — No unrestricted query fallback

**Normative requirement.** A malformed/unsupported FilterBy or SortBy request SHALL return an error and SHALL NOT bypass a predicate.

### API-CON-002 — Generated source of API docs

**Normative requirement.** Generated OpenAPI SHALL be checked against the runtime controller/schema source. Manual editing of generated snapshots SHALL NOT be used to redefine contracts.

### API-CON-003 — No implied cursor API

**Normative requirement.** The presence of an internal cursor metadata record SHALL NOT be taken as evidence that an external cursor-paginated route exists.
