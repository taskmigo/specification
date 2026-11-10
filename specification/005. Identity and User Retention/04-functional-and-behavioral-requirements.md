# 4. Functional and Behavioral Requirements

This section defines the normative **User and Group lifecycle** independently of transport details. [Section 3](03-external-interface-requirements.md) defines HTTP shapes, while [section 5](05-data-and-information-requirements.md) defines retained identifiers and purged fields. Each requirement below SHALL be verifiable by [section 9](09-verification-validation-and-acceptance.md).

## 4.1 Identity Registration and Grouping

### ID-FR-001 — User registration invariants

**Precondition:** a caller submits a valid create User request through the registered API and is permitted to create Users.

**Required behavior:** Runtime registration SHALL create an `ACTIVE` User with server-assigned UUID. `username`, `firstName` and `lastName` SHALL be present and nonblank. The reserved username `system` SHALL not be registerable through this operation.

**Failure boundary:** invalid input or the reserved managed identity SHALL not produce a new User or partially assigned grants.

### ID-FR-002 — Normalization

**Required behavior:** The system SHALL trim usernames and first/last names, normalize email strings by trimming and lowercasing, and deduplicate normalized emails. `displayName` SHALL be derived from profile names rather than independently settable through registration.

**Observable result:** User projections SHALL reflect normalized values; normalization SHALL not create duplicate email entries.

### ID-FR-003 — Atomic initial assignments

**Required behavior:** User creation, requested initial Role assignments and Group membership creation SHALL commit as one mutation. Every referenced Role/Group ID SHALL resolve successfully before completion.

**Failure boundary:** any unknown referenced identifier SHALL cause the registration to fail without leaving a partially created User or subset of assignments.

### ID-FR-004 — Group hierarchy

**Required behavior:** A Group SHALL have stable identity and code. Parent-to-child links SHALL be directed and acyclic; creation and internal hierarchy updates SHALL validate referenced child Groups and maintain consistent reachability.

**Failure boundary:** unknown child Groups or a proposed cycle SHALL be rejected, not silently ignored.

### ID-FR-005 — Role and Statement assignment

**Required behavior:** Identity SHALL invoke published Authorization use cases to manage direct User grants and distinguish direct assignments from grants inherited through Roles/Groups. A mutation that targets an ineligible User SHALL be rejected.

**Ownership:** Identity manages User and Group relationships; Authorization remains authoritative for Role and Statement grant state.

## 4.2 User Deletion Lifecycle

The effective `retention.user` configuration determines which lifecycle transition applies when an ordinary mutable User is deleted. Deletion and cleanup SHALL remain atomic and SHALL satisfy the privacy field enumeration in [section 5](05-data-and-information-requirements.md).

### ID-FR-006 — Reserved System User

**Required behavior:** Managed User deletion SHALL reject a User whose username equals the reserved System User username `system`. No policy grant, retention value or caller type SHALL convert the reserved identity into an ordinary deletable User.

### ID-FR-007 — Immediate tombstone

**Condition:** `retention.user=P0D` at the time of deletion.

**Required behavior:** The deletion transaction SHALL revoke access, scrub User PII and transition directly to `TOMBSTONE`. It SHALL preserve the stable User UUID but SHALL NOT insert a synthetic `RETAINED` transition or `retainedAt` value.

**Observable result:** Ordinary User queries no longer expose the tombstone; audit history remains under privacy-safe rules.

### ID-FR-008 — Retained transition

**Condition:** a positive retention duration and a mutable ordinary User.

**Required behavior:** Deletion SHALL remove direct Role/Statement assignments, Group memberships and sessions; record the first `retainedAt`; transition to `RETAINED`; and append the relevant mutation audit in the **same transaction**.

**Observable result:** Profile PII remains stored during retention, but the User cannot perform ordinary mutations or authenticate as an ACTIVE User.

### ID-FR-009 — Retained immutability

**Required behavior:** `RETAINED` and `TOMBSTONE` SHALL be ineligible as ordinary mutation targets. A repeated public delete or direct Statement grant replacement targeting a RETAINED User SHALL fail without changing the retained record.

**Important distinction:** This is not a promise that repeated deletion returns a successful idempotent no-op.

### ID-FR-010 — Terminal tombstone

**Required behavior:** `TOMBSTONE` SHALL be a terminal normal lifecycle state that preserves the User UUID and lifecycle metadata while erasing username, first/last names, email set, password hash, direct grants, Group memberships and sessions.

**Data boundary:** historical Ticket and Audit relationships identifying the User by UUID SHALL remain intact unless their own owning SRS specifies otherwise.

### ID-FR-011 — PII-safe audit

**Required behavior:** Tombstoning SHALL preserve Audit event identities/history but scrub identifying historical User field values. Events associated with the former actor SHALL display `Unknown user` in place of identifying actor username; sensitive change markers SHALL have null before/after values.

**Failure boundary:** a deletion audit SHALL not copy removed PII into the diff payload as a new disclosure.

## 4.3 Retention Worker

### ID-FR-012 — Scheduled expiration

**Required behavior:** Worker SHALL trigger the published retention use case at a fixed delay of one hour. A RETAINED User is eligible when `retainedAt <= now - effectiveRetentionDuration`. The duration SHALL be read from effective configuration so an update can affect eligibility at the next purge.

### ID-FR-013 — Safe batched processing

**Required behavior:** Retention processing SHALL page candidates in `(retainedAt, UUID)` order, in batches of no more than 100; use pessimistic `SKIP LOCKED` claims; recheck eligibility under a per-User transaction; and allow independent candidate failures without abandoning every other eligible User.

**Concurrency invariant:** two workers SHALL not both perform conflicting cleanup of the same retained User. Partial cleanup of one failing User SHALL not commit as a successful tombstone.

### ID-FR-014 — User access revocation and login

**Required behavior:** Non-ACTIVE, RETAINED and TOMBSTONE Users SHALL not obtain or continue ordinary ACTIVE interactive authentication. Session and OAuth authorization/consent persistence SHALL use lifecycle eligibility and concurrency guards so a deleted User's usable credentials cannot be recreated after revocation.

## 4.4 Configuration

### ID-FR-015 — Whole-day duration

**Required behavior:** Retention input SHALL parse a valid nonnegative ISO-8601 duration representing an **integer number of 24-hour days**. `PT24H` SHALL be accepted as one day; fractional, negative and sub-day durations SHALL be rejected. Successful output SHALL use canonical `P<n>D` representation.

### ID-FR-016 — Effective default

**Required behavior:** Configuration SHALL be stored in the database. When no persisted `retention.user` value exists, the API and retention service SHALL use the effective default `P30D`. A PATCH omitting `retention.user` SHALL leave the existing effective value unchanged.

## 4.5 Visibility

### ID-FR-017 — Tombstone query exclusion

**Required behavior:** Normal User list/read target selection SHALL exclude `TOMBSTONE` records. User list SHALL compose the applicable Request/Object Authorization and client predicate in the database **before pagination and total computation**.

**Access distinction:** RETAINED visibility SHALL be determined by the applicable authorization policies. The System User label does not by itself establish a public, unconditional retained-User viewing bypass.
