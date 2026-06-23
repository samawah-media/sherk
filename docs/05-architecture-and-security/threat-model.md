# Threat Model: شريك

## 1. Method

STRIDE عملي على أهم flows: auth، tenant context، approvals، files، comments، ledger، SLA jobs.

## 2. Threats

| ID | STRIDE | Threat | Mitigation |
| --- | --- | --- | --- |
| T01 | Spoofing | جلسة مسروقة تعتمد مخرج | MFA لاحقا، short sessions، reauth للقرارات الحساسة |
| T02 | Tampering | تغيير `client_id` في request | server derives scope، RLS، FK checks |
| T03 | Repudiation | اعتماد دون سجل | audit mandatory in command transaction |
| T04 | Information Disclosure | client يرى internal comment | visibility predicates، separate read models، tests |
| T05 | Information Disclosure | signed URL طويل العمر | short TTL، metadata auth before URL |
| T06 | Denial of Service | tenant فيديو يستهلك egress | quotas/monitoring، R2 ADR trigger |
| T07 | Elevation | user_metadata يمنح role | app DB/app_metadata only، server checks |
| T08 | Tampering | approve superseded version | version binding and optimistic concurrency |
| T09 | Repudiation | ledger adjustment بلا سبب | reason required, audit, restricted permission |
| T10 | Information Disclosure | realtime channel leaks | scoped channels, no sensitive payloads |
| T11 | Tampering | drag card bypasses approval | command validates transition |
| T12 | Elevation | service role exposed | secret management, no browser secret |
| T13 | Information Disclosure | Platform support reads content | deny by default, break-glass audited |
| T14 | Tampering | background job crosses tenants | per-tenant loop, scoped queries |
| T15 | Repudiation | SLA pause reason changed silently | audit all overrides |

## 3. Highest Priority Controls

- Tenant/client scope enforcement.
- Internal visibility separation.
- Version-aware approvals.
- Append-only audit and ledger.
- Server-only sensitive commands.

