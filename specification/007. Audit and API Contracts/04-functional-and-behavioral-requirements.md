# 4. Functional and Behavioral Requirements

This chapter is the normative behavior for **Entity Audit privacy/consistency** and the **API v0 error and success response semantics**. The exact wire envelope and error-code matrix are in [section 3](03-external-interface-requirements.md); domain modules SHALL link to that shared contract without redefining it.

## 4.1 Audit Append and Privacy

### AUD-FR-001 — Synchronous transaction participation

**Required behavior:** Audit event append SHALL participate synchronously in the caller's existing business transaction using `MANDATORY` propagation. If Audit persistence fails while enabled, the originating mutation SHALL not complete successfully.

**Non-goal:** No fire-and-forget event append or independent autocommit audit transaction is implied.

### AUD-FR-002 — Immutable event metadata

Each audit event SHALL have stable UUID, audited entity type and ID, actor UUID/username, occurrence instant at millisecond precision and an immutable ordered list of field changes. The event identity and historic event relationship SHALL survive later User privacy scrubbing.

### AUD-FR-003 — Sensitive field omission

**Required behavior:** A field change with `sensitive=true` SHALL have `before=null` and `after=null` **before persistence**. A caller attempting to construct a sensitive diff containing prior or new values SHALL be rejected. Serialization SHALL not accidentally restore removed values.

### AUD-FR-004 — User privacy scrubbing

When a User becomes TOMBSTONE, historic Audit records where that User was actor or target SHALL be scrubbed. The stored actor username SHALL be replaced by `Unknown user`; identifying User change values for `username`, `firstName`, `lastName` and `emails` SHALL become sensitive markers. Event IDs, actor IDs, target IDs and event timestamps remain intact.

### AUD-FR-005 — Audited deletion actions

User deletion and tombstoning SHALL record applicable status/lifecycle transitions and **sensitive** markers for revoked direct Role/Statement grants, Group memberships, sessions and erased identifying fields. The audit trail SHALL preserve the action without recording the purged field values as ordinary before/after JSON.

### AUD-FR-006 — Audit read order

The Audit list operation SHALL return records in `occurredAt DESC`, then `id DESC` order, and use the shared **one-based offset pagination** contract. Audit reads SHALL still pass the authorization and supported entity-type boundaries defined in [section 3](03-external-interface-requirements.md).

## 4.2 API v0 Error Semantics

### API-FR-001 — Input validation

When body field validation fails, v0 SHALL respond with HTTP 422, `message.code=validation.failed`, `error.code=VALIDATION_ERROR` and `formErrors` for reported fields. A malformed/unreadable JSON body SHALL instead respond with HTTP 400 and the `request.malformed`/`MALFORMED_REQUEST` code pair.

### API-FR-002 — Filter/sort failure isolation

An invalid `filterBy` SHALL result in HTTP 400 and `error.code=INVALID_FILTER`; an invalid `sortBy` SHALL result in HTTP 400 and `error.code=INVALID_SORT`. Either error SHALL prevent unrestricted list retrieval. Unknown/unsupported query features SHALL not be silently dropped as if no filter or sort were provided.

### API-FR-003 — Domain failures

Typed domain failure categories SHALL map as follows: `INVALID_INPUT` → HTTP 400; `NOT_FOUND` → HTTP 404; `CONFLICT` → HTTP 409; `UNPROCESSABLE` → HTTP 422. Forbidden access SHALL map to HTTP 403. Resource modules SHALL not invent a uniform machine error code for unverified domain exception conditions.

### API-FR-004 — Success behavior

Standard successful read/update operations SHALL respond with HTTP 200. Successful resource creation SHALL respond with HTTP 201 and `Location` identifying the created resource, plus the ID or representation explicitly specified by the owning endpoint. Success responses SHALL set `error=null`.

### API-FR-005 — Unknown server failures

Unhandled exceptions SHALL produce HTTP 500 and a generic internal error response, without stack trace or internal implementation details. The failure envelope SHALL set `success=false` and `data=null`.

## 4.3 Audit Feature Activation

### AUD-FR-007 — Runtime configuration

Audit application services and JPA store SHALL be enabled when `taskmigo.audit.enabled=true`. This specification SHALL not assert audit append/persistence is active for configurations that disable this capability.

## 4.4 Independent-consumer implications

Client validation SHALL assert **both** HTTP status and `message.code`/`error.code`, which have distinct meanings. [Section 9](09-verification-validation-and-acceptance.md) defines contract tests for malformed and invalid bodies, protected Audit history, privacy markers, query errors and generated OpenAPI parity. The existence of a test class alone does not demonstrate that it passed.
