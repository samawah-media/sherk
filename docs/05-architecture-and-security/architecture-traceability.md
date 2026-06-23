# Architecture Traceability: شريك

| Requirement | Domain | Permission | Component | Security Control | NFR | ADR |
| --- | --- | --- | --- | --- | --- | --- |
| Tenant Isolation | Tenant/Membership | PERM.CLIENT.VIEW | RLS + Command Layer | SEC-001/002 | NFR-001 | ADR-004/005 |
| Client Isolation | Client | PERM.DELIV.VIEW | Access Policy | object auth | NFR-001 | ADR-005 |
| Internal Comment Protection | Comments | PERM.COMMENT.INTERNAL_VIEW | Comments Module | visibility deny | NFR-002 | ADR-005 |
| Internal File Protection | Files | PERM.FILE.INTERNAL_VIEW | Storage Gateway | signed URL auth | NFR-014 | ADR-007 |
| Internal Approval | Approval | PERM.APPROVAL.INTERNAL_GRANT | Approval Commands | state/version/audit | NFR-011 | ADR-006 |
| Client Approval | Approval | PERM.APPROVAL.CLIENT_GRANT | Client Approval Command | version-aware | NFR-015 | ADR-006 |
| SLA Pause/Resume | SLA | PERM.SLA.TIMER_CONTROL | SLA Timeline/Jobs | segment audit | NFR-004 | ADR-008 |
| Package Reservation | Ledger | PERM.DELIV.CREATE | Ledger Command | transaction | NFR-011 | ADR-009 |
| Package Consumption | Ledger | PERM.DELIV.DELIVER | Ledger Command | append-only | NFR-011 | ADR-009 |
| Auditability | Audit | PERM.AUDIT.* | Audit Module | append-only | NFR-011 | ADR-009 |
| User Offboarding | Membership | PERM.USR.RESPONSIBILITY_TRANSFER | Membership Module | ownership transfer | NFR-004 | ADR-005 |
| File Visibility Change | Files | PERM.FILE.MARK_CLIENT_VISIBLE | File Command | confirmation/audit | NFR-014 | ADR-007 |

