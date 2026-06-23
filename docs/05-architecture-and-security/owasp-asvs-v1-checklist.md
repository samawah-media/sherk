# OWASP ASVS V1 Checklist: شريك

## 1. Scope

هذه قائمة مخصصة لا تنسخ ASVS كاملا. الهدف ASVS Level 1 قدر الإمكان، وLevel 2 للضوابط الحساسة لمنصة SaaS متعددة العملاء.

## 2. Checklist

| Area | Control | Priority | ASVS Ref |
| --- | --- | --- | --- |
| Architecture | threat model for tenant/client isolation | Required V1 | V1 |
| Architecture | security requirements trace to tests | Required V1 | V1 |
| Auth | traditional login with secure sessions | Required V1 | V2 |
| Auth | no authorization from user-editable metadata | Required V1 | V2/V4 |
| Session | logout/session expiry documented | Before Pilot | V3 |
| Access Control | deny by default | Required V1 | V4 |
| Access Control | object-level authorization on every resource | Required V1 | V4 |
| Access Control | client cannot access other client links | Required V1 | V4 |
| Access Control | maker/checker for internal approval where policy requires | Before Pilot | V4 |
| Validation | server-side validation for commands | Required V1 | V5 |
| Files | file download authorized per metadata | Required V1 | V12 |
| Files | signed URLs short-lived | Required V1 | V12 |
| API | rate limit sensitive endpoints | Before Production | V13 |
| Logging | audit sensitive decisions | Required V1 | V7 |
| Logging | logs avoid sensitive content | Required V1 | V7 |
| Data Protection | internal comments/files hidden from clients | Required V1 | V8 |
| Configuration | secrets not exposed to browser | Required V1 | V14 |
| Business Logic | no send before internal approval | Required V1 | V11 |
| Business Logic | no approve superseded version | Required V1 | V11 |
| Business Logic | SLA waiting client excluded from Samawah delay | Required V1 | V11 |

