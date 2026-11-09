# 2. Overall Description

## 2.1 Product Function

Taskmigo permits runtime definition of Ticket Types with custom templates. A Ticket Type owns an internal EAV schema definition; each published version defines the custom fields used by newly created Tickets. Tickets retain stable common fields independent of custom-field storage.

## 2.2 Version Independence

Published template versions and historical schema instances protect existing Tickets when a new template is published or an older version is retired. Existing Tickets continue to be validated and updated using their pinned schema version, not automatically migrated to the newest template.

## 2.3 Query Integration

The Ticket list API combines optional `ticketTypeId`, logical `filterBy`, repeated `sortBy`, and Object Authorization in database-side queries before pagination. Runtime custom-field paths come from EAV metadata. For global queries, ambiguous field definitions are excluded; for one Type, the query schema considers its published/retired history; for one Ticket, read/update authorization uses its exact historical version.

## 2.4 Domain Scope

Ticket status is a required nonblank string, not a configured workflow or transition engine. The reviewed API does not implement Ticket deletion, assignment, projects, comments, attachment management or sprints. This SRS SHALL NOT imply those capabilities exist.

## 2.5 Stakeholders

API clients create/manage Types, publish templates, create Tickets, and query accessible work. Administrators configure authorization through the existing Authorization feature rather than a special Ticket-specific policy DSL.
