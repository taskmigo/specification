# 2. Overall Description

## 2.1 User and Group model

A User has a stable UUID, required identity name fields, a normalized email set, derived `displayName`, lifecycle status and optional retention timestamps. Groups are hierarchical, directed and acyclic; they hold membership relationships. User/Group-specific queries and persistence are owned by Identity, while Role and Statement grants remain in Authorization.

## 2.2 Registration flow

On a valid `POST /api/v0/users`, Identity normalizes username, names and email addresses; rejects the reserved `system` username; validates requested Role/Group references; and creates the User and initial assignments atomically. The response exposes the server-created UUID, not credential state or direct grant internals.

## 2.3 Deletion and retention lifecycle

| Condition                                               | Mutation and visible outcome                                                                                                |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Ordinary mutable User deleted when `retention.user=P0D` | Immediately TOMBSTONE in the owning transaction; revoke access and scrub listed PII; do not synthesize a RETAINED timestamp |
| Ordinary mutable User deleted with positive duration    | Move to RETAINED with first `retainedAt`; revoke Roles, direct Statements, Group memberships and sessions                   |
| RETAINED User reaches configured expiry                 | Worker safely claims/rechecks eligible User and tombstones it                                                               |
| RETAINED/TOMBSTONE targeted for normal mutation         | Reject without modifying protected lifecycle state                                                                          |
| Reserved System User targeted for deletion              | Reject under the reserved-account constraint                                                                                |

The worker's fixed-delay trigger is one hour. Retention eligibility is computed from the effective persisted configuration, not a hard-coded duration captured when the User was deleted.

## 2.4 Privacy and history

Tombstoning removes username, first/last names, email identifiers, password hash, direct grants, memberships and sessions while **preserving User UUID and historical business references**. Audit event identities/history remain available under audit authorization rules, but identifying actor names and sensitive prior/new values are anonymized or omitted. Do not confuse stable referential identity with continued storage of PII.

## 2.5 Configuration, policy and visibility

The public Configuration API exposes `data.retention.user` and updates only recognized fields. Absent a stored value, the effective default is `P30D`; valid inputs are nonnegative whole-day durations serialized as `P<n>D`. Retained Users remain subject to the same applicable Request and Object Authorization checks; TOMBSTONE users are omitted from normal User projections. Neither status alone grants a privileged viewer blanket access.

## 2.6 Out of scope

No general User PATCH, User GET-by-ID, restoration, User status-transition API, Group update/delete, or Organization abstraction exists in this reviewed v0 public interface set. Future capabilities require an explicit separately approved specification.
