# 4. Functional and Behavioral Requirements

These are lifecycle **business invariants**: eligible mutation, retention timing, PII purge and transactional revocation. State names are not interchangeable with API actions.

## 4.1 Identity Registration and Grouping

### ID-FR-001 — User registration invariants

**Normative requirement.** Runtime registration SHALL create an ACTIVE User with normalized username and profile data. Username and first/last name SHALL be nonblank. Username `system` SHALL be reserved for managed provisioning.

### ID-FR-002 — Normalization

**Normative requirement.** Username and first/last name SHALL be trimmed. Emails SHALL be normalized to trimmed, lowercase values and deduplicated. `displayName` SHALL be derived from the names rather than independently persisted.

### ID-FR-003 — Atomic initial assignments

**Normative requirement.** User creation with initial Role and Group IDs SHALL be one transaction; unknown referenced IDs SHALL prevent successful completion.

### ID-FR-004 — Group hierarchy

**Normative requirement.** Group parent-to-child relations SHALL be acyclic. Creation and internal hierarchy changes SHALL validate referenced child Groups, preserve stable Group codes, and reject graph cycles.

### ID-FR-005 — Role and Statement assignment

**Normative requirement.** Identity SHALL delegate Role/Statement grant state to Authorization subject grants. Direct assignments SHALL be distinguishable from inherited grants. User mutation operations SHALL verify the User is mutable.

## 4.2 User Deletion Lifecycle

### ID-FR-006 — Reserved System User

**Normative requirement.** Managed User deletion SHALL reject a User whose username equals the reserved system username `system`.

### ID-FR-007 — Immediate tombstone

**Normative requirement.** When `retention.user=P0D`, deletion SHALL transition directly to TOMBSTONE in the deletion transaction, revoke access, and erase User PII. It SHALL NOT synthesize a RETAINED transition or `retainedAt`.

### ID-FR-008 — Retained transition

**Normative requirement.** When retention is positive, deleting an ordinary mutable User SHALL revoke direct Role/Statement assignments, Group memberships, and sessions; persist status RETAINED and first `retainedAt` timestamp; and append an audit record in the same transaction.

### ID-FR-009 — Retained immutability

**Normative requirement.** A RETAINED or TOMBSTONE User SHALL NOT be an ordinary mutation target. A subsequent public delete or direct-Statement update of a RETAINED User SHALL fail without changing state.

### ID-FR-010 — Terminal tombstone

**Normative requirement.** TOMBSTONE SHALL preserve User UUID and lifecycle timestamp metadata while removing username, first/last names, emails, password hash, direct Role/Statement assignments, Group memberships, and sessions. TOMBSTONE SHALL be terminal for normal runtime User lifecycle operations.

### ID-FR-011 — PII-safe audit

**Normative requirement.** Tombstoning SHALL scrub user-identifying fields from existing audit records, preserve audit event identities/history, anonymize prior actor username to `Unknown user`, and record sensitive field-change markers without including old/new values.

## 4.3 Retention Worker

### ID-FR-012 — Scheduled expiration

**Normative requirement.** Worker SHALL invoke retention purge at a fixed delay of one hour. Eligibility SHALL use status RETAINED and `retainedAt <= now - configuredDuration`; changing configured duration SHALL change eligibility on the next purge.

### ID-FR-013 — Safe batched processing

**Normative requirement.** Purge SHALL page candidates by (`retainedAt`, UUID) in batches of at most 100, claim eligible User rows with pessimistic `SKIP LOCKED`, recheck eligibility inside per-User transactions, and continue processing after independent candidate failures.

### ID-FR-014 — User access revocation and login

**Normative requirement.** Retained/tombstoned Users SHALL NOT be able to authenticate as ACTIVE users or use previously stored interactive sessions. User mutation and session-state writes SHALL use locking/eligibility checks to avoid recreating authentication after deletion.

## 4.4 Configuration

### ID-FR-015 — Whole-day duration

**Normative requirement.** Retention SHALL accept only valid ISO-8601 durations representing nonnegative whole 24-hour days (including `PT24H` for one day), and SHALL serialize canonically as `P<n>D`. Fractional or sub-day durations SHALL be rejected.

### ID-FR-016 — Effective default

**Normative requirement.** Absent a persisted `retention.user` configuration row, the effective value SHALL be `P30D`. Configuration updates SHALL be stored in the database.

## 4.5 Visibility

### ID-FR-017 — Tombstone query exclusion

**Normative requirement.** Ordinary User lookup/list and authorized mutation target selection SHALL exclude TOMBSTONE rows; User list SHALL additionally apply Request/Object Authorization and client query predicates before pagination. RETAINED visibility SHALL depend on the applicable policies rather than an unconditional System User exception.
