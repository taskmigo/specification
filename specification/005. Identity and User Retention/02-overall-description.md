# 2. Overall Description

## 2.1 Identity Model

A User has a stable UUID, username, first/last name, normalized email set, derived display name, status, and optional retention timestamp. Roles and direct Statements are assigned through Authorization; Groups and memberships are owned by Identity. Group hierarchies are directed and acyclic, and may contain children.

## 2.2 Lifecycle Perspective

Public User deletion SHALL select either direct TOMBSTONE (`P0D`) or RETAINED (positive duration). Both paths revoke direct authorization grants, group memberships, and existing sessions. RETAINED state retains identity/profile data but forbids subsequent mutations. The worker later tombstones eligible retained Users, scrubbing PII and protecting audit history.

## 2.3 Application Configuration

A database-backed `retention.user` key has an effective default of `P30D`. The public API exposes this value nested under `retention.user`. Updating configuration affects future lifecycle operations and worker expiry calculations.

## 2.4 Visibility and Login

Ordinary User list/read lookup hides TOMBSTONE records. Retained Users remain persisted and participate in normal User list queries subject to the current Request/Object Authorization rules; no blanket public visibility is implied. Authentication and API authorization require ACTIVE User status.

## 2.5 Out of Scope

There is no public User profile update endpoint, public Group mutation beyond create/list, general User status-change API, or User restoration API in the reviewed v0 controller set. No Organization domain/API is implied by Group hierarchy.
