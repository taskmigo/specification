# 5. Data and Information Requirements

## 5.1 Authorization State

The canonical Statement contract and operation snapshot define the authorization state used for one operation.

An `ObjectAuthorizationSchema<Q>` SHALL have a stable identity sufficient to distinguish incompatible changes to API-visible object paths, types, nullability, collection element contracts, and accepted operators.

An `ObjectAuthorizationPredicate<Q>` SHALL retain enough internal identity to prevent persistence binding under an incompatible Object Authorization Schema.

Verification: Change Object Authorization Schema properties independently and confirm stale compiled policies/predicates are not treated as compatible.
Traceability: AUTH-API-004; POLICY-004.

### STATE-001 — Effective Statement revision metadata

Every effective persisted Statement resolved for an authorization operation SHALL include database-owned revision metadata sufficient to distinguish successive committed versions of the same Statement.

A persistence timestamp such as `updated_at` MAY be used as that revision when it strictly advances for successive committed changes to the corresponding Statement row. The revision is internal persistence metadata and SHALL NOT become part of the canonical Statement contract defined by STMT-001 and STMT-007.

The effective-Statement persistence adapter SHALL return the current revision together with the current Statement after the required database lookup.

Verification: Persist a Statement, resolve it, update the persisted Statement, resolve it again, and confirm the revision changes while the canonical Statement representation remains unchanged by the metadata field.
Traceability: POLICY-004; PERF-004.

### STATE-002 — Derived artifact revision identity

After current Statement state has been loaded from the database, Authorization MAY use the effective Statement revision from STATE-001 as the Statement-revision component of derived execution-artifact identity.

Reuse SHALL additionally require compatible Language/compiler identity, Environment Schema identity, Compilation Profile identity, and applicable Object Authorization Schema identities as required by POLICY-004.

The effective Statement revision is an Authorization-layer freshness signal. It SHALL NOT replace the exact-source and compilation-contract metadata required inside a Language compiled artifact by [Language DATA-003](../003.%20Language/05-data-and-information-requirements.md#data-003--compiled-artifact-metadata).

Verification: Reuse a derived artifact for the same database revision, then independently change the Statement revision, compiler contract, Environment Schema, Compilation Profile, and applicable Object Authorization Schema identity and confirm each incompatible case prevents reuse.
Traceability: POLICY-004; [Language DATA-003](../003.%20Language/05-data-and-information-requirements.md#data-003--compiled-artifact-metadata).

## 5.2 Object Target Applicability Metadata

### TARGET-001 — Framework-neutral applicability resolver

Core Authorization SHALL obtain the Object Authorization Schemas applicable to a Statement API target through a framework-neutral target-resolution contract with behavior equivalent to:

```java
public interface ObjectAuthorizationTargetResolver {
    List<ObjectAuthorizationSchema<?>> applicable(String method, String path);
}
```

`applicable(method, path)` SHALL return every Object Authorization Schema whose application route may be governed by the supplied Statement target under STMT-006 target semantics.

Core Authorization SHALL NOT require a transport-specific route registry as part of its Object Authorization Schema contract. Applications without transport-derived target metadata MAY provide an application-composed resolver through the same contract.

Verification: Resolve exact-method, wildcard-method, matching-regex, and non-matching targets through the target resolver without exposing Spring MVC types to core Authorization.
Traceability: STMT-006; POLICY-003; AUTH-API-004; ARCH-MOD-005.

### TARGET-002 — Spring MVC-derived target metadata

In a Spring MVC application, `web` SHALL derive Object Authorization target applicability from the application's actual MVC handler mappings rather than requiring callers to duplicate HTTP method/path registrations in Authorization configuration.

A handler participating in Object Authorization SHALL expose exactly one typed `ObjectAuthorizationPredicate<Q>` parameter or an equivalent typed integration point. The generic object type `Q` SHALL identify the registered `ObjectAuthorizationSchema<Q>` associated with that handler route.

Handlers without an Object Authorization predicate integration point SHALL NOT contribute Object Authorization target metadata. Versioned MVC mappings SHALL be resolved to their effective application route pattern before Statement target matching.

Verification: Add or change a versioned MVC handler route with a typed `ObjectAuthorizationPredicate<Q>` parameter and confirm target applicability follows the handler mapping without adding a second manual route registration.
Traceability: AUTH-API-005; TARGET-001; ARCH-MOD-008.

## 5.3 Data Integrity and Lifecycle

Statement state read from the database SHALL be authoritative for the current operation.

Authorization Snapshot, Authorization Context, and request-derived Object Authorization Predicates SHALL remain operation-scoped and SHALL NOT be reused as authorization input for unrelated later operations.

Policy inputs SHALL NOT expose repositories, entities, or arbitrary host APIs.

Verification: Execute sequential operations with changed Statement/schema state and inspect isolation.
Traceability: SNAPSHOT-002; SNAPSHOT-004; TECH-003.
