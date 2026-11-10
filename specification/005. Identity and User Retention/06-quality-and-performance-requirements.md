# 6. Quality and Performance Requirements

Privacy, atomicity, concurrency and query visibility are first-class quality boundaries. No speculative throughput or cleanup deadline is asserted beyond the worker behavior stated here.

## 6.1 Security and Privacy

### ID-QUAL-001 — Fail-closed account state

**Normative requirement.** An inactive, RETAINED, or TOMBSTONE account SHALL NOT be accepted as an ACTIVE principal by API Request Authorization or interactive-session validation.

### ID-QUAL-002 — No sensitive audit payloads

**Normative requirement.** Deletion/purge events SHALL record sensitive-field markers without prior or new PII values. Historical user PII in audit diffs SHALL be scrubbed when the User is tombstoned.

## 6.2 Concurrency

### ID-QUAL-003 — Mutation serialization

**Normative requirement.** User state changes and session writes SHALL coordinate through persisted User row locking, so deletion cannot race with a session being recreated.

### ID-QUAL-004 — Multi-worker safety

**Normative requirement.** Purge SHALL use row claims and rechecking rather than assuming only one worker instance; independent candidate failures SHALL NOT roll back every eligible User in the batch.

## 6.3 Query Performance

### ID-QUAL-005 — Database-side visibility

**Normative requirement.** Authorized User lists SHALL combine lifecycle visibility, Object Authorization, and filters in the database before offset pagination. Retention scanning SHALL use bounded batches rather than loading all retained users into JVM memory.

No fixed latency, throughput or worker-completion deadline beyond the implemented scheduling interval is asserted.
