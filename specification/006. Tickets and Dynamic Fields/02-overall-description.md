# 2. Overall Description

## 2.1 Ticket Types and template lifecycle

Users can define Ticket Types and publish versioned custom-field templates. Each Type has a stable key and EAV schema definition. A new template begins as a DRAFT, can be populated or fully replaced, and becomes usable for new Tickets only when PUBLISHED. A published version can be RETIRED, but historical Tickets and template definitions must remain readable.

## 2.2 Create and update flow

Creating a Ticket requires an ACTIVE Type, the current PUBLISHED template, a nonblank title and status, and values consistent with the template's required fields and constraints. The server derives Ticket identity, creator and time metadata and persists custom fields against the selected version.

A PATCH updates only supplied common fields or supplied `customFields` entries. An omitted key retains its prior value; an explicit null for an optional field removes its stored value; required fields cannot be cleared. A PATCH does not change the Ticket's creator, Type or pinned historical template version.

## 2.3 Schema evolution

Templates are **immutable after publication**. Draft replacement may reuse a stable field ID only where its key/type identity remains valid. New versions do not migrate existing Ticket values or reinterpret them under the latest schema; every Ticket remains validated against its historical version.

## 2.4 Query and security integration

Ticket list queries may combine optional Type scope, the client FilterBy expression, ordered repeated SortBy clauses and the mandatory Object Authorization predicate. Sorting and filtering occur in the **database before offset pagination**. Object Authorization for a Ticket read/update uses the exact pinned schema metadata; global list queries allow only unambiguous, compatible dynamic fields.

## 2.5 Public capability boundary

The v0 API exposes Ticket creation/list/read/update and Ticket Type/template management. Type and template list responses are not paginated; Ticket collection is offset-paginated. No Ticket DELETE, Type DELETE, assignment, sprint/project association, comment thread, attachment route or configured status-transition engine is part of this SRS.

## 2.6 Stakeholders and consequences

API consumers need the exact schema, allowed fields, version identity and error responses to construct compatible requests. Security reviewers must confirm no unauthorized Ticket is returned or counted. QA must cover template history, missing/invalid custom fields, partial updates and query/authorization composition without generating redundant test combinations.
