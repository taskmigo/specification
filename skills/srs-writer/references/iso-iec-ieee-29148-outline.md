# ISO/IEC/IEEE 29148 SRS Outline

Use this reference when creating or reorganizing an SRS. It is practical guidance for tailoring the information item; it is not a substitute for the standard text. Use ISO/IEC/IEEE 29148:2018 unless the user or repository specifies another edition.

## Information-item boundary

29148 covers requirements engineering processes and the content and format of related information items across the life cycle. Before drafting, identify which level is in scope:

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

- purpose, scope, system-of-interest, boundaries, and intended use;
- operational environment, scenarios, stakeholders, users, and external actors;
- assumptions, dependencies, constraints, risks, priorities, and out-of-scope behavior;
- functional behavior, states, modes, timing, business rules, and error handling;
- user and external-system interfaces, protocols, inputs, outputs, and interoperability;
- data entities, lifecycle, integrity, retention, privacy, and persistence effects;
- measurable performance, capacity, availability, reliability, safety, security, usability, maintainability, portability, and other applicable quality attributes;
- allocation or derivation relationships and the verification method or objective evidence for each requirement.

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

Check individual requirements for necessity, feasibility, singularity, unambiguity, verifiability, correctness, and traceability. Check the set for consistency, completeness within its declared scope, and comprehensibility. Do not claim 29148 conformance from a well-formed Markdown outline alone; state the tailored scope and available evidence.

## README-first split

Keep the canonical navigation in `README.md` and split the substantive SRS by the tailored 29148 information-item sections:

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

The README frontmatter SHALL contain only the feature name and document version. Its body SHALL contain a `Table of contents`, `Read order`, and `History` table with exactly `Version` and `Short summary of changes` columns. It SHALL disable `MD041` because it intentionally has no level-one heading. The README is navigation metadata, not a place for common knowledge or duplicated SRS content.

## Language quality

Prefer:

- “The system SHALL …” for externally observable mandatory behavior.
- “The system SHALL reject … and SHALL …” for validation and failure behavior.
- “The system MAY …” for bounded optional behavior.
- “Not applicable” with a reason for an omitted topic.
- `TBD` or `TBR` with ownership and a resolution condition for incomplete information.

Avoid:

- reproducing the standard text or claiming certification from a document layout;
- implementation phases, migration checklists, TODOs, or “Definition of Done” sections;
- requirements that only name a class, framework, pattern, or test without stating system behavior;
- unqualified “current behavior” claims when the baseline is not identified;
- duplicate full documents or links that force readers to guess the canonical version.
