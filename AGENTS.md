# AGENTS.md

Instructions for AI agents reading and working with this specification repository.

## Repository purpose

- Treat this repository as the authoritative source for Taskmigo product and system specifications.
- Use the specifications here to understand required behavior, constraints, interfaces, quality attributes, verification expectations, and unresolved decisions before changing an implementation repository.
- Do not infer requirements from implementation code when this repository defines the behavior explicitly. If implementation and specification disagree, report the conflict instead of silently choosing one.

## How to read the repository

- Specifications live under `specification/`.
- Each numbered feature directory is an independent specification set, for example `specification/002. Authorization/`.
- Start with the feature directory's `README.md`. It is the canonical entry point and defines the document version, section map, read order, and history.
- For complete understanding, read the linked section files in the order declared by the feature `README.md`.
- For focused retrieval, use the `README.md` table of contents to jump directly to the section relevant to the task, then follow Markdown links and requirement references to their source sections.
- Do not treat one isolated requirement or section as complete context when it references assumptions, constraints, interfaces, dependencies, or verification criteria elsewhere in the same specification.

## How to interpret specifications

- Treat normative requirements as authoritative. `SHALL` denotes mandatory behavior, `MAY` denotes permitted behavior, and `SHOULD` denotes a justified preference.
- Preserve the distinction between normative requirements and supporting material such as rationale, examples, scenarios, notes, and appendices.
- Requirement IDs, section anchors, domain terms, interface names, and defined constraints are stable references. Use them when explaining implementation decisions or traceability.
- Check the constraints, quality/performance, dependency, verification, and unresolved-issues sections before concluding that a behavior is fully specified.
- Do not invent missing business rules, defaults, wire formats, failure behavior, permissions, or acceptance criteria. Treat unresolved or unspecified behavior as such.

## Cross-repository use

- When implementing or reviewing Taskmigo code in another repository, identify the applicable specification here before making behavior-affecting changes.
- Use the specification as the source of product intent and the implementation repository as the source of code-level structure and local engineering conventions.
- A code change that alters specified behavior, interfaces, constraints, or acceptance conditions may require a corresponding specification change.

## Repository skills

- Repository skills live under `skills/<skill-name>/SKILL.md`.
- Read `skills/srs-writer/SKILL.md` before creating, restructuring, or materially revising an SRS.
- Do not apply the SRS-writing skill to ordinary reading or implementation work unless the task also changes specification content.

## Pull requests and verification

- Before creating or updating a pull request, read `.github/pull_request_template.md` and keep its structure.
- Keep specification changes focused and preserve existing requirement IDs and terminology unless the change intentionally revises them.
- Run the repository checks that apply to Markdown changes:

```bash
npm run markdown:check
npm run style:check
```

- Only mark CI-related checklist items complete after the required checks pass.
