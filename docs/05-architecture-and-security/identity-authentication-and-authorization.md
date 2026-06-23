# Identity, Authentication and Authorization: شريك

## 1. Authentication

V1 يعتمد تسجيل دخول تقليدي مع دعوات مستخدمين. Magic Links ليست تجربة أساسية.

## 2. Identity Records

- Supabase Auth يملك user identity والجلسة.
- قاعدة التطبيق تملك profiles, memberships, roles, scopes, delegations.
- لا تستخدم `user_metadata` في قرارات authorization.

## 3. Authorization Model

الصلاحية = Actor + Role + Permission + Scope + Conditions + Resource State.

مثال: Client Approver يمكنه `PERM.APPROVAL.CLIENT_GRANT` فقط على Deliverable داخل Client scope، وعلى نسخة مرسلة وغير superseded.

## 4. Scope Types

| Scope | الاستخدام |
| --- | --- |
| Platform | حوكمة المنتج |
| Tenant | إدارة الوكالة |
| Client | العميل داخل Tenant |
| Contract/Package | نطاق الرصيد والاتفاق |
| Deliverable | العمل والاعتماد |
| File/Comment | visibility وحماية المحتوى |

## 5. Server-Only Commands

- grant internal approval.
- send to client.
- client approval/change request.
- deliver/cancel/reopen.
- package reserve/consume/release.
- file visibility change.
- SLA override/pause reason update.
- role assignment/delegation.

## 6. Break-Glass

Break-glass صلاحية مقيدة للإدارة العليا، تتطلب سبب، مدة، Audit، ومراجعة لاحقة. لا تستخدم كمسار تشغيل عادي.

