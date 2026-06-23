# Architecture Risks and Open Questions: شريك

## 1. Risks

| ID | Risk | Probability | Impact | Mitigation | ADR |
| --- | --- | --- | --- | --- | --- |
| R01 | الاعتماد على RLS وحده | Medium | Critical | command authorization + tests | ADR-005 |
| R02 | Tenant Context leak | Medium | Critical | derive scope server-side | ADR-004 |
| R03 | Business logic in UI | Medium | High | server-only commands | ADR-006 |
| R04 | Modular monolith يتضخم | Medium | Medium | module boundaries | ADR-001 |
| R05 | Missing transaction in approval/ledger | Medium | High | transaction boundary docs | ADR-006/009 |
| R06 | Public or long signed URLs | Medium | High | short URL + metadata auth | ADR-007 |
| R07 | Realtime leakage | Low/Med | High | scoped channels | ADR-010 |
| R08 | Audit log growth | Medium | Medium | retention/archive plan | ADR-009 |
| R09 | Ledger reversal complexity | Medium | High | explicit reversal rules | ADR-009 |
| R10 | Video cost | Medium | Medium | monitor + R2 trigger | ADR-007 |
| R11 | Weak backup testing | Medium | High | restore drill | ADR-011 |
| R12 | Role model complexity | Medium | Medium | granular permissions + scopes | ADR-005 |
| R13 | Demo code over-trusted | Low | Medium | demo UX reference only | ADR-001 |
| R14 | Supabase lock-in | Medium | Medium | abstraction boundaries | ADR-003 |
| R15 | Approval of superseded version | Medium | High | version-aware approvals | ADR-006 |

## 2. Open Questions

| Question | V1 Recommendation | Classification |
| --- | --- | --- |
| هل توجد approvals متسلسلة للعميل؟ | لا، عدة approvers بنفس الصلاحية فقط | Assumed |
| هل يظهر delay owner للعميل؟ | يظهر للإدارة، وللعميل صياغة مبسطة فقط | Open |
| هل يسمح بمخرج خارج الباقة؟ | مشروط بموافقة إدارية | Assumed |
| كيف يعالج SLA بعد reopening؟ | سياسة موثقة قبل Specs | Open |
| هل Audit export في V1؟ | restricted أو مؤجل | Open |

