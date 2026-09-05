---
name: srs-writer
description: Draft, restructure, or review software requirements specifications using ISO/IEC/IEEE 29148:2018 with tailored information-item content, README-first navigation, stable requirement IDs, and human- and agent-friendly traceability.
---

# SRS Writer

Use this skill when the requested deliverable is a Software Requirements Specification: creating one, reorganizing an existing SRS, or reviewing its completeness and clarity. Do not use it for ordinary API documentation, implementation plans, or code changes unless the user explicitly asks for an SRS.

## Required outcome

Produce a decision-ready Software Requirements Specification (SRS) that expresses an agreed software need as verifiable requirements and preserves its context, constraints, dependencies, and traceability without turning the specification into a development task list.

- Use ISO/IEC/IEEE 29148:2018 as the governing requirements-engineering framework. Treat the SRS as a tailored information item rather than imposing a fixed universal template. Cover the information needed for the product boundary and audience, including purpose and scope, operational context, stakeholders and users, assumptions and dependencies, interfaces, functional and quality requirements, data, constraints, verification, and traceability.
- Distinguish the SRS from related information items. Use a Business Requirements Specification (BRS), Stakeholder Requirements Specification (StRS), System Requirements Specification (SyRS), Concept/Operational Concept, or Requirements Traceability Matrix (RTM) when the requested content belongs there; link related items rather than silently combining incompatible abstraction levels.
- Keep requirements normative and testable. Use SHALL for mandatory behavior, MAY for permitted options, and SHOULD only for justified preferences.
- Preserve existing requirement IDs, domain terms, public contracts, and user decisions. Do not silently invent business rules, wire formats, roles, fallbacks, or acceptance behavior.
- Separate product requirements from implementation choices. Avoid roadmap language such as implementation phases, migration tasks, TODOs, “Done” statements, or development-only instructions.
- Write each requirement so its subject, condition, action or capability, and measurable outcome are clear. Check the individual requirement and the requirement set for necessity, feasibility, consistency, completeness, singularity, unambiguity, verifiability, correctness, and traceability; tailor the checks to the deliverable instead of asserting unsupported conformance.
- Include failure behavior, security boundaries, consistency, performance, persistence, and conformance criteria when they affect the requested system.

For the detailed 29148 information-item mapping and requirement-writing pattern, read [references/iso-iec-ieee-29148-outline.md](references/iso-iec-ieee-29148-outline.md).

## Repository and document structure

When working in a repository, inspect the current branch/worktree, existing specification files, links, lint configuration, and relevant project conventions before editing. Preserve unrelated user changes and use the repository’s existing terminology as the source of truth.

The canonical entry point for a split SRS SHALL be `README.md`. It SHALL contain:

- YAML frontmatter containing only the feature `name` and document `version`;
- a Markdown `Table of contents`;
- a `Read order` section;
- a `History` table with exactly `Version` and `Short summary of changes` columns;
- a Markdown table of contents with section number, title, purpose, and relative document link.

The README body SHALL contain only navigation metadata: the table of contents, read order, and history. It SHALL not repeat the SRS purpose, scope, requirements, or common knowledge. Because the README body intentionally has no level-one heading, it SHALL include `<!-- markdownlint-disable MD041 -->` immediately before the first heading.

Use Markdown links for all internal navigation and traceability. Replace bare section notation such as `2.2.2` with a link to the relevant file and anchor, for example `[Shared Object Filter](02-overall-description.md#222-shared-object-filter)`. Do not leave unlinked section notation in the SRS.

Split the SRS according to the tailored ISO/IEC/IEEE 29148:2018 information-item structure:

```text
README.md
01-introduction.md
02-overall-description.md
03-external-interface-requirements.md
04-functional-and-behavioral-requirements.md
05-data-and-information-requirements.md
06-quality-and-performance-requirements.md
07-constraints.md
08-requirements-allocation-and-dependencies.md
09-verification-validation-and-acceptance.md
10-traceability-and-unresolved-issues.md
11-appendices.md
```

Each file SHALL contain the corresponding numbered section and its normative or supporting content. Use additional files only when a document becomes genuinely unwieldy or the user requests finer separation. Do not leave a competing full copy, an obsolete filename, or an unhelpful pointer file as a second entry point.

## Writing workflow

1. Establish the source of truth, audience, scope, compatibility constraints, and required output location from the repository and user request.
2. Identify the information-item level and tailor the SRS outline before drafting. Record omitted content as Not applicable with a reason, or as an explicit TBD/TBR with an owner or resolution condition; do not fill gaps with speculation.
3. Capture the operational context, stakeholders, users, external systems, assumptions, constraints, and dependencies that bound the requirements. Use scenarios or models where they clarify behavior, and label them as supporting material rather than normative requirements.
4. Organize requirements by behavior and consumer, not by implementation class or development phase. Give each independently verifiable requirement a stable ID and intention-revealing title.
5. For each requirement, make the subject, condition or trigger, required capability or behavior, data boundary, constraints, failure behavior, and observable verification outcome clear. Use examples or tables where they improve retrieval.
6. Add bidirectional traceability from needs or stakeholder expectations to derived software requirements and verification evidence when those artifacts exist. Identify derived requirements and unresolved conflicts instead of hiding the derivation.
7. Update Markdown links, anchors, and cross-references after restructuring. Keep section numbering, information-item boundaries, and requirement IDs consistent across files.

## Audience and content discipline

Write for both HUMAN and AGENT readers:

- Use concise domain language, intention-revealing headings, short requirement blocks, examples, and tables that help a human review decisions quickly.
- Use stable requirement IDs, predictable section/file names, explicit normative keywords, machine-retrievable anchors, and Markdown links for agent navigation and traceability.
- Include only project-specific needs, decisions, constraints, interfaces, behavior, quality criteria, verification, and traceability. Common knowledge, generic tutorials, textbook definitions, and explanations that do not change a project decision SHALL NOT be included in the SRS.
- If a term is necessary for unambiguous interpretation, define it briefly in the document glossary; do not add general educational material.

## Review checklist

- README is the only canonical start point, its body contains only the table of contents, read order, and history, and every table link resolves.
- README frontmatter contains only the feature `name` and document `version`; its History table has exactly `Version` and `Short summary of changes` columns, and `MD041` is disabled for the intentionally heading-less body.
- The files follow the tailored ISO/IEC/IEEE 29148:2018 section structure and contain no stale duplicate document.
- The SRS contains project-specific knowledge only and is useful to both HUMAN reviewers and AGENT retrieval/execution.
- The SRS identifies its 29148 information-item scope and tailoring decisions; it does not claim full standard conformance unless the evidence supports that claim.
- Scope, operational context, stakeholders, assumptions, dependencies, constraints, and out-of-scope behavior are explicit.
- Requirements are atomic enough to verify but grouped into readable sections.
- Requirements are necessary, feasible, consistent, complete enough for their scope, singular, unambiguous, correct, verifiable, and traceable—or any exception is explicit.
- Normative language is consistent and non-normative rationale is distinguishable.
- Public interfaces, persistence effects, authorization/security rules, failure modes, freshness/consistency, and performance limits are not ambiguous.
- All internal references use Markdown links rather than unlinked section notation. No stale duplicate document, broken anchor, unexplained acronym, or development-only phrase remains.
- Run the repository’s Markdown lint and link/format checks when available; report actual results separately from checks that could not run.
