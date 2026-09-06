---
name: srs-writer
description: Draft, restructure, or review software requirements specifications with tailored information-item content, README-first navigation, stable requirement IDs, and human- and agent-friendly traceability.
---

# SRS Writer

Use this skill when the requested deliverable is a Software Requirements Specification: creating one, reorganizing an existing SRS, or reviewing its completeness and clarity. Do not use it for ordinary API documentation, implementation plans, or code changes unless the user explicitly asks for an SRS.

## Required outcome

Produce a decision-ready Software Requirements Specification (SRS) that expresses an agreed software need as verifiable requirements and preserves its context, constraints, dependencies, and traceability without turning the specification into a development task list.

- Use [ISO/IEC/IEEE 29148:2018](https://committee.iso.org/standard/72089.html) as the governing requirements-engineering framework. Treat the SRS as a tailored information item rather than imposing a fixed universal template. Cover the information needed for the product boundary and audience, including purpose and scope, operational context, stakeholders and users, assumptions and dependencies, interfaces, functional and quality requirements, data, constraints, verification, and traceability.
- Distinguish the SRS from related information items. Use a Business Requirements Specification (BRS), Stakeholder Requirements Specification (StRS), System Requirements Specification (SyRS), Concept/Operational Concept, or Requirements Traceability Matrix (RTM) when the requested content belongs there; link related items rather than silently combining incompatible abstraction levels.
- Keep requirements normative and testable. Use SHALL for mandatory behavior, MAY for permitted options, and SHOULD only for justified preferences.
- Preserve existing requirement IDs, domain terms, public contracts, and user decisions. Do not silently invent business rules, wire formats, roles, fallbacks, or acceptance behavior.
- Separate product requirements from implementation choices. Avoid roadmap language such as implementation phases, migration tasks, TODOs, “Done” statements, or development-only instructions.
- Write each requirement so its subject, condition, action or capability, and measurable outcome are clear. Check the individual requirement and the requirement set for necessity, feasibility, consistency, completeness, singularity, unambiguity, verifiability, correctness, and traceability; tailor the checks to the deliverable instead of asserting unsupported conformance.
- Include failure behavior, security boundaries, consistency, performance, persistence, and conformance criteria when they affect the requested system.

For the detailed standard information-item mapping and requirement-writing pattern, read [references/iso-iec-ieee-29148-outline.md](references/iso-iec-ieee-29148-outline.md).

## Repository and document structure

When working in a repository, inspect the current branch/worktree, existing specification files, links, lint configuration, and relevant project conventions before editing. Preserve unrelated user changes and use the repository’s existing terminology as the source of truth.

The canonical entry point for a split SRS SHALL be `README.md`. It SHALL contain:

- YAML frontmatter containing only the feature `name` and document `version`;
- a Markdown `Table of contents`;
- a `Read order` section;
- a Markdown table of contents with section number, title, purpose, and relative document link.

The README body SHALL contain only navigation metadata: the table of contents and read order. It SHALL not repeat the SRS purpose, scope, requirements, history, or common knowledge. Because the README body intentionally has no level-one heading, it SHALL include `<!-- markdownlint-disable MD041 -->` immediately before the first heading.

The README SHALL not contain a `History` table, release notes, or duplicated change descriptions.

Use Markdown links for all internal navigation and traceability. Replace bare section notation such as `2.2.2` with a link to the relevant file and anchor, for example [Shared Object Filter](../../specification/002.%20Authorization/02-overall-description.md#222-shared-object-filter). Do not leave unlinked section notation in the SRS. Whenever prose refers to another Markdown file, verify that the relative target path exists and that any fragment identifies a heading in the target file; repair or remove broken links before finalizing. Check links again after restructuring, renaming, or moving files. Validate internal links with the repository's link checker when available, or perform an equivalent local path-and-anchor check when it is not.

Any issue, pull request, ticket, external document, standard, website, or other artifact outside the repository SHALL be referenced with a descriptive Markdown link on its first mention in each document, or in that document's References section. After the first linked mention, use a short, unambiguous name without repeating the URL unless the reader could lose the reference context. Do not leave a bare URL or unlinked external identifier before its canonical link is established; if a reliable link is unavailable, identify the item as unresolved instead of inventing a destination. External link availability is outside the repository's control and does not need to be validated by the internal-link check.

Split the SRS according to the tailored standard's information-item structure:

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
- Begin every prose sentence, bullet-point item, and table-cell sentence with an uppercase letter. Preserve the spelling and case of code identifiers, requirement IDs, URLs, file names, and other literal values.
- No Common Knowledge: Omit self-evident facts, elementary background information, generic tutorials, textbook definitions, and explanations that do not change a project decision. Include only project-specific needs, decisions, constraints, interfaces, behavior, quality criteria, verification, and traceability.
- No Repeated Information: Do not re-explain a point that is already stated. Cross-reference the existing content with a verified Markdown link, such as [Review checklist](#review-checklist) for a same-file reference, or a relative file-and-anchor link for content in another Markdown file.
- If a term is necessary for unambiguous interpretation, define it briefly in the document glossary; do not add general educational material.

## Review checklist

- README is the only canonical start point, its body contains only the table of contents and read order, and every navigation link resolves.
- README frontmatter contains only the feature `name` and document `version`; README has no duplicate History table; and `MD041` is disabled for the intentionally heading-less body.
- Markdown table cells use the Unicode bullet character • for in-cell bullet items, and every literal `|` inside a table cell is escaped or encoded so it cannot become a column separator.
- The files follow the tailored standard section structure and contain no stale duplicate document.
- The SRS contains project-specific knowledge only, omits self-evident facts and elementary background information, and is useful to both HUMAN reviewers and AGENT retrieval/execution.
- The SRS does not repeat information; repeated points are replaced with verified Markdown cross-references to the existing section or requirement.
- The SRS identifies its information-item scope and tailoring decisions; it does not claim full standard conformance unless the evidence supports that claim.
- Scope, operational context, stakeholders, assumptions, dependencies, constraints, and out-of-scope behavior are explicit.
- Requirements are atomic enough to verify but grouped into readable sections.
- Requirements are necessary, feasible, consistent, complete enough for their scope, singular, unambiguous, correct, verifiable, and traceable—or any exception is explicit.
- Normative language is consistent and non-normative rationale is distinguishable.
- Public interfaces, persistence effects, authorization/security rules, failure modes, freshness/consistency, and performance limits are not ambiguous.
- All internal references use Markdown links rather than unlinked section notation. Every relative link to another Markdown file resolves to an existing file and valid anchor, including after restructuring. Each external issue, pull request, and artifact has one canonical descriptive Markdown link per document, with later mentions using the established short name where context remains clear. No stale duplicate document, broken anchor, unexplained acronym, or development-only phrase remains.
- Every prose sentence, bullet-point item, and table-cell sentence begins with an uppercase letter, except where a literal value must retain its original case.
- Run the repository’s Markdown lint and link/format checks when available; report actual results separately from checks that could not run.
