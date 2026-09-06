# [ISO/IEC/IEEE 29148](https://committee.iso.org/standard/72089.html) SRS Outline

Use this reference when creating or reorganizing an SRS. It is practical guidance for tailoring the information item; it is not a substitute for the standard text. Use the linked standard above unless the user or repository specifies another edition.

## Information-item boundary

The standard covers requirements engineering processes and the content and format of related information items across the life cycle. Before drafting, identify which level is in scope:

| Information item                              | Primary concern                                                                                     | Keep distinct from the SRS                                  |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| Business Requirements Specification (BRS)     | Business or mission problem, opportunity, desired outcomes, and solution conditions                 | Detailed software behavior                                  |
| Stakeholder Requirements Specification (StRS) | Stakeholder needs, context, concepts, constraints, and priorities                                   | Derived technical design                                    |
| System Requirements Specification (SyRS)      | System functions, performance, design constraints, attributes, environment, and external interfaces | Software-only implementation detail                         |
| Software Requirements Specification (SRS)     | Software capabilities, qualities, interfaces, data, constraints, and externally observable behavior | Unapproved design or implementation plan                    |
| Concept of Operations / Operational Concept   | How the organization and users intend to operate and use the system                                 | Normative software requirements unless explicitly allocated |
| Requirements Traceability Matrix (RTM)        | Relationships among needs, requirements, design elements, and verification evidence                 | A replacement for requirement content                       |

Related items may be linked or included as clearly labeled supporting material. Do not silently mix abstraction levels or duplicate a related specification that can drift.

## Tailored SRS structure

There is no universal mandatory heading sequence for every SRS. Tailor the following structure to the product, lifecycle, audience, and repository conventions while preserving complete navigation:

```text
# Software Requirements Specification
## Document control and conformance
## 1. Purpose, scope, and product boundary
## 2. Terms, definitions, references, and abbreviations
## 3. Product context and operational scenarios
## 4. Stakeholders, users, roles, and assumptions
## 5. External interfaces and interoperability
## 6. Functional and behavioral requirements
## 7. Data and information requirements
## 8. Quality and performance requirements
## 9. Design, implementation, regulatory, and other constraints
## 10. Requirements allocation, dependencies, and derived requirements
## 11. Verification, validation, and acceptance evidence
## 12. Traceability and unresolved issues
## Appendices: glossary, models, examples, or supporting matrices
```

Combine or reorder sections when that improves comprehension, but retain explicit coverage of:

- Purpose, scope, system-of-interest, boundaries, and intended use;
- Operational environment, scenarios, stakeholders, users, and external actors;
- Assumptions, dependencies, constraints, risks, priorities, and out-of-scope behavior;
- Functional behavior, states, modes, timing, business rules, and error handling;
- User and external-system interfaces, protocols, inputs, outputs, and interoperability;
- Data entities, lifecycle, integrity, retention, privacy, and persistence effects;
- Measurable performance, capacity, availability, reliability, safety, security, usability, maintainability, portability, and other applicable quality attributes;
- Allocation or derivation relationships and the verification method or objective evidence for each requirement.

If a topic does not apply, write `Not applicable` with a short reason. For information that is not yet known, use `TBD` or `TBR` only with an owner, resolution condition, or due context. Do not turn an unresolved issue into a guessed requirement.

## Requirement writing pattern

Use a stable ID and intention-revealing title for every independently verifiable requirement:

```text
#### <stable-id> — <intention-revealing title>

The <subject> SHALL <capability or behavior> when <condition or trigger>,
subject to <constraint>, and SHALL produce <observable result> within <measure>.

Verification: <inspection, analysis, demonstration, test, or other objective evidence>.
Traceability: <parent need, stakeholder requirement, or derived-from relationship>.
```

Use `SHALL` for mandatory behavior, `MAY` for bounded permitted behavior, and `SHOULD` only for a justified preference. Avoid vague terms such as “fast,” “user-friendly,” “appropriate,” “as needed,” and “support” unless they are operationally defined. Keep rationale, examples, and design suggestions visibly separate from the normative statement.

Check individual requirements for necessity, feasibility, singularity, unambiguity, verifiability, correctness, and traceability. Check the set for consistency, completeness within its declared scope, and comprehensibility. Do not claim conformance to the linked standard from a well-formed Markdown outline alone; state the tailored scope and available evidence.

## README-first split

Keep the canonical navigation in `README.md` and split the substantive SRS by the tailored standard's information-item sections:

| File                                             | Content                                                                                                           |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| `01-introduction.md`                             | Purpose, scope, terms, references, and document control                                                           |
| `02-overall-description.md`                      | Product context, stakeholders, users, operational scenarios, assumptions, dependencies, and out-of-scope behavior |
| `03-external-interface-requirements.md`          | User, external-system, and interoperability interfaces                                                            |
| `04-functional-and-behavioral-requirements.md`   | Functional behavior and stable requirement IDs                                                                    |
| `05-data-and-information-requirements.md`        | Data entities, persistence, integrity, lifecycle, privacy, and retention                                          |
| `06-quality-and-performance-requirements.md`     | Security, consistency, performance, reliability, usability, and other applicable attributes                       |
| `07-constraints.md`                              | Design, implementation, regulatory, and other constraints                                                         |
| `08-requirements-allocation-and-dependencies.md` | Allocation, dependencies, assumptions, and derived requirements                                                   |
| `09-verification-validation-and-acceptance.md`   | Verification objectives, validation conditions, and acceptance evidence                                           |
| `10-traceability-and-unresolved-issues.md`       | Bidirectional traceability and unresolved issues                                                                  |
| `11-appendices.md`                               | Glossary, models, examples, and deferred extensions                                                               |

Use additional files only when the document becomes genuinely unwieldy or the user requests finer separation. Keep one canonical version and update all Markdown links and traceability references after restructuring.

The README SHALL contain navigation metadata only. Its frontmatter SHALL contain only nested `metadata.version` and `metadata.changelog` fields; its body SHALL contain a `Table of contents` and a `Read order` section. It SHALL not contain a `History` table, a history section, release notes, or duplicated change descriptions. Because the README intentionally has no level-one heading, it SHALL include `<!-- markdownlint-disable MD041 -->` immediately before the first heading. The README is navigation metadata, not a place for common knowledge or duplicated SRS content.

Use one descriptive Markdown link for each issue, pull request, ticket, external document, standard, website, or other artifact outside the repository on its first mention in each document, or in that document's References section. Use a short, unambiguous name for later mentions unless the reader could lose the reference context. Do not leave bare URLs or unlinked external identifiers before the canonical link is established. Validate every relative Markdown link to another repository file by checking both its target path and fragment anchor, including after files are renamed or moved. External link availability is outside the repository's control and does not need to be validated by the internal-link check.

## Language quality

Begin every prose sentence, bullet-point item, and table-cell sentence with an uppercase letter. Preserve the spelling and case of code identifiers, requirement IDs, URLs, file names, and other literal values.

No Common Knowledge: Omit self-evident facts and elementary background information. Include only information that changes a project decision or supports a verifiable requirement.

No Repeated Information: Do not re-explain previously stated points. Cross-reference existing sections with verified Markdown links, such as [README-first split](#readme-first-split) within this reference or a relative file-and-anchor link for another Markdown file.

Prefer:

- “The system SHALL …” for externally observable mandatory behavior.
- “The system SHALL reject … and SHALL …” for validation and failure behavior.
- “The system MAY …” for bounded optional behavior.
- “Not applicable” with a reason for an omitted topic.
- `TBD` or `TBR` with ownership and a resolution condition for incomplete information.

Avoid:

- Reproducing the standard text or claiming certification from a document layout;
- Implementation phases, migration checklists, TODOs, or “Definition of Done” sections;
- Requirements that only name a class, framework, pattern, or test without stating system behavior;
- Unqualified “current behavior” claims when the baseline is not identified;
- Duplicate full documents or links that force readers to guess the canonical version.
