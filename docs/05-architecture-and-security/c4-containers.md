# C4 Containers: شريك

## 1. الحاويات

| Container | التقنية | المسؤولية |
| --- | --- | --- |
| Browser UI | React, shadcn/ui, Tailwind | عرض scoped UX، optimistic UI، لا أسرار |
| Next.js App | App Router, Server Actions/Route Handlers | routing، SSR، command orchestration |
| Domain Command Layer | TypeScript server modules | authorization، invariants، transactions |
| PostgreSQL | Supabase Postgres | state, RLS, constraints, ledger |
| Auth | Supabase Auth | users, sessions, invitations integration |
| Storage | Supabase Storage | binary files with guarded access |
| Jobs | Scheduled/queued workers | SLA, notifications, cleanup, outbox |
| Observability | Logs/metrics/error tracking | runtime health and security signals |

## 2. الاتصالات

- UI يقرأ عبر server/client data layer scoped، ولا يستدعي عمليات حساسة مباشرة.
- Commands الحساسة تنفذ server-side فقط.
- Database تستخدم RLS على الجداول المكشوفة، وprivate schemas عند الحاجة.
- Storage downloads تمر عبر signed URL قصير بعد authorization.

## 3. Containers المؤجلة

- Search service.
- Data warehouse.
- Social publishing integration.
- Dedicated media transcoding service.
- Tenant-specific databases.

