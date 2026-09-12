# 12. Build Conventions and Tooling Baseline

## 12.1 Purpose

This section fixes the cross-cutting Java build/tooling baseline required by [ARCH-MOD-012](04-functional-and-behavioral-requirements.md#arch-mod-012--build-convention-ownership).

The baseline exists to make module build files small and semantically meaningful while keeping compiler, nullness, formatting, style, and architecture-verification behavior reproducible across the repository.

This catalog covers repository-wide build and verification tools only. Capability/runtime libraries such as Jackson, Guava, ANTLR, Spring Security, persistence drivers, and feature-specific libraries remain owned and versioned by the module or dependency-management platform that requires their runtime behavior.

## 12.2 Fixed Tooling Catalog

The following versions and scopes are normative for the initial convention baseline:

| Tool or library                          | Fixed version | Required scope / boundary                                                                                                                                        | License at this version                                            |
| ---------------------------------------- | ------------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Gradle Build Tool / Wrapper              |       `9.7.1` | Repository build launcher only; wrapper distribution SHALL be checksum-pinned.                                                                                   | Apache License 2.0                                                 |
| Java toolchain                           |          `26` | Gradle Java toolchain language version. Vendor SHALL remain unspecified by this specification.                                                                   | Provider-specific; no JDK distribution license is mandated here.   |
| `org.jspecify:jspecify`                  |       `1.0.1` | `compileOnlyApi` for reusable Java libraries; `compileOnly` for executable/non-published Java projects. SHALL NOT be obtained transitively through `foundation`. | Apache License 2.0                                                 |
| `net.ltgt.errorprone` Gradle plugin      |       `5.1.0` | Build-logic/plugin classpath only.                                                                                                                               | Apache License 2.0                                                 |
| `com.google.errorprone:error_prone_core` |      `2.50.0` | Error Prone tool configuration only; SHALL NOT be a production runtime dependency.                                                                               | Apache License 2.0                                                 |
| `com.uber.nullaway:nullaway`             |      `0.14.0` | Error Prone tool configuration only; JSpecify mode SHALL be enabled for NullMarked Taskmigo code.                                                                | MIT License                                                        |
| `com.diffplug.spotless` Gradle plugin    |      `8.10.1` | Build-logic/plugin classpath only; owns repository formatting tasks and Java formatting/import cleanup configuration.                                            | Apache License 2.0                                                 |
| `com.puppycrawl.tools:checkstyle`        |      `14.1.0` | Checkstyle tool configuration only.                                                                                                                              | GNU Lesser General Public License 2.1                              |
| Spring Modulith                          |       `2.1.0` | BOM/version alignment for Modulith artifacts; module metadata SHOULD be compile-only where possible and verification support SHALL be test-scoped.               | Apache License 2.0                                                 |
| `com.tngtech.archunit:archunit-junit5`   |       `1.4.2` | `testImplementation` only for supplemental package-boundary architecture tests.                                                                                  | Apache License 2.0; redistributed ASM components are BSD-licensed. |

The Java toolchain row fixes the Java language/runtime level used for compilation but deliberately does not select a JDK vendor. Repository automation MAY select a vendor for CI reproducibility, but such vendor selection SHALL be documented separately with its distribution license.

## 12.3 Convention Responsibilities

The convention layer SHALL provide the following behavior:

1. Configure Java toolchains to Java 26.
2. Make JSpecify annotations available at compile time with the scope required by [ARCH-CON-014](07-constraints.md#arch-con-014--dependency-scope-discipline).
3. Apply the Error Prone Gradle integration and add Error Prone Core plus NullAway only to the analyzer/tool configuration.
4. Configure NullAway in JSpecify mode for NullMarked Taskmigo source.
5. Apply Spotless and repository Java formatting/import-cleanup rules.
6. Configure Checkstyle with the repository Checkstyle configuration.
7. Provide reusable Spring Modulith and ArchUnit architecture-test dependencies without putting them on production runtime classpaths.
8. Configure common Java compiler and test task behavior that is genuinely repository-wide and does not introduce feature semantics.

A module SHALL still declare every runtime, feature, adapter, persistence, parser, or protocol dependency required by behavior it owns.

## 12.4 Reproducibility and Upgrade Rules

The Gradle wrapper SHALL pin both the exact Gradle version and its distribution SHA-256 checksum.

The version catalog or build-logic dependency declarations SHALL use exact versions for every item in Section 12.2. Dynamic selectors and unbounded version ranges are prohibited.

An upgrade to a Section 12.2 item SHALL include:

- compatibility validation with Java 26 and the current Gradle wrapper;
- confirmation that the dependency remains restricted to its intended scope;
- review of the dependency's license for the proposed version;
- architecture/build verification showing no new production runtime dependency leakage; and
- an update to this catalog in the same specification change when the fixed baseline changes.

Transitive dependencies MAY change as a consequence of an explicitly reviewed fixed-version upgrade, but they SHALL be visible in dependency reports and SHALL NOT be used as undeclared APIs by Taskmigo source.

## 12.5 License Evidence

The initial license classification is based on the published artifact metadata or official project license for the exact fixed release where available:

- JSpecify `1.0.1`: Maven Central publishes Apache License 2.0 metadata.
- Error Prone Core `2.50.0`: the Error Prone project is Apache License 2.0.
- NullAway `0.14.0`: Maven Central publishes MIT license metadata.
- Spotless Gradle plugin `8.10.1`: Spotless source is Apache License 2.0.
- Checkstyle `14.1.0`: Checkstyle declares GNU LGPL v2.1.
- Spring Modulith `2.1.0`: Spring Modulith is released under Apache License 2.0.
- ArchUnit `1.4.2`: Maven Central publishes Apache License 2.0 and BSD metadata; the project identifies Apache License 2.0 as its primary license and documents redistributed ASM under BSD.
- Gradle Build Tool `9.7.1`: Gradle Build Tool source is Apache License 2.0.

License review in this specification records dependency-selection constraints; it is not legal advice and does not replace repository-level third-party notice or attribution obligations.
