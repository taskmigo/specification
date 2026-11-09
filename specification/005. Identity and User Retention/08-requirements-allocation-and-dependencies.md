# 8. Requirements Allocation and Dependencies

## 8.1 Owning Modules

- **`:modules:identity`:** User/Group/Membership domain and application services, normalized User data, lifecycle, configuration, and query/persistence.
- **`:modules:authorization`:** Direct subject grants and effective policy resolution.
- **`:modules:audit`:** Transaction-bound audit storage and privacy scrubbing.
- **`:apps:web`:** Public User, Group and Configuration API request/response contract.
- **`:apps:worker`:** Hourly retention scheduling.
- **`:apps:migration`:** Managed installation of System User, Admin User, groups, roles and associated policies.
- **`:modules:database`:** Flyway major-version schema and runtime persistence support.

## 8.2 Interface Dependencies

Identity SHALL call provider-owned Authorization and Audit use cases for access grants and audit cleanup instead of manipulating their private ORM rows. Worker SHALL depend only on Identity's published User retention service. Web SHALL use Identity use-case interfaces for registration, listing and deletion.

## 8.3 External Integration

Authentication/authorization of token-bearing calls SHALL follow [Authentication and Provisioning](../008.%20Authentication%20and%20Provisioning/README.md) and [Authorization](../002.%20Authorization/README.md).

## 8.4 Transaction Allocation

Runtime registration, User deletion, and assignment mutations SHALL be transactionally coordinated by Identity application implementations. Worker candidate eligibility SHALL be rechecked within a separate transaction per claimed User.
