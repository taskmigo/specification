# 2. Overall Description

## 2.1 Transaction-bound Entity Audit

The entity owner completes a business mutation and appends an Audit event inside the same transaction. Each event identifies audited entity type/UUID, actor UUID/username, occurrence timestamp and field changes. Audit failure prevents successful mutation commit when append is active. Audit services use an existing transaction rather than starting independent autocommit work.

## 2.2 Privacy behavior

Sensitive field changes are **markers**, not stores of old/new PII. Their before/after values are null before persistence and in responses. Tombstoning a User preserves the historical audit row and identifiers while anonymizing identifying actor usernames as `Unknown user` and scrubbing prior User identity diffs.

## 2.3 Audit list operation

The public `GET /api/v0/audit/{entityType}/logs` route supports only entity type `user` at this snapshot. It requires Request Authorization and an **unrestricted User Object Authorization predicate**; otherwise it is forbidden rather than leaking a partial audit history. Results are ordered by occurrence time descending, then event ID descending, with shared one-based offset paging.

## 2.4 Shared API response structure

Successful and failed v0 resource calls use a structured envelope containing Boolean `success`, numeric `statusCode`, `message.code/text`, nullable `error`, execution metadata and endpoint-specific `data`. Errors have their own `error.code` and optional `formErrors`; consumers must not confuse the machine error code with the outcome message code.

## 2.5 Error semantics and generated documentation

Input validation, malformed JSON, unsupported filter/sort, domain conflict, missing resource, denied authorization and unexpected server failure have distinct observable HTTP/error contracts. Generated OpenAPI operations reflect controller wiring and the `x-filter-by`/`x-sort-by` metadata from registered operation Query Schemas. Each owning module SRS remains the normative source for its fields, side effects and business rules.

## 2.6 Exclusions

No general audit search for arbitrary entity types, public cursor pagination route, independent Authorization decision-history ledger, or default CRUD set for every domain resource is promised. The internal response model's cursor metadata does not imply a public cursor endpoint.
