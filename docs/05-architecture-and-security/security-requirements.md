# Security Requirements: شريك

## 1. Requirements

| ID | Requirement | V1 | Test Type | Owner |
| --- | --- | --- | --- | --- |
| SEC-001 | كل طلب حساس يثبت Tenant Context من العضوية | Yes | integration | Backend |
| SEC-002 | Client users لا يرون Client آخر | Yes | E2E/RLS | Backend/QA |
| SEC-003 | Internal comments ممنوعة على client roles | Yes | E2E | Backend/QA |
| SEC-004 | Internal files لا تولد signed URL للعميل | Yes | integration | Backend |
| SEC-005 | Approval requires current sent version | Yes | unit/integration | Backend |
| SEC-006 | No client send before internal approval | Yes | unit/E2E | Backend |
| SEC-007 | All approvals/change requests audited | Yes | integration | Backend |
| SEC-008 | Ledger entries append-only | Yes | DB/integration | Backend |
| SEC-009 | Role changes require scope and audit | Yes | integration | Backend |
| SEC-010 | Service role never in browser | Yes | static/config | DevOps |
| SEC-011 | RLS enabled on exposed tables | Yes | DB advisor | Backend |
| SEC-012 | Views do not bypass RLS | Yes | DB review | Backend |
| SEC-013 | Signed URLs short-lived | Yes | integration | Backend |
| SEC-014 | Input validation on commands | Yes | unit | Backend |
| SEC-015 | Realtime scoped by tenant/client | Yes if used | integration | Backend |
| SEC-016 | Audit logs not visible internally to client | Yes | E2E | QA |
| SEC-017 | Background jobs scoped per tenant | Yes | unit/integration | Backend |
| SEC-018 | Break-glass audited and rare | Restricted | review | Owner |
| SEC-019 | Backups and restore tested | Before production | manual | DevOps |
| SEC-020 | Access denied events logged for sensitive attempts | Yes | integration | Backend |

