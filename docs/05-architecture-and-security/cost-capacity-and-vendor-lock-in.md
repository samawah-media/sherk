# Cost, Capacity and Vendor Lock-in: شريك

## 1. Scenarios

| Scenario | Shape |
| --- | --- |
| Pilot | 1 Tenant, نحو 4 Clients، ملفات محدودة |
| Small Production | عدة Tenants أو عشرات العملاء |
| Growth | read/write أعلى، بحث وتقارير أكثر |
| Video-heavy | تخزين وegress مرتفع |

## 2. Cost Drivers

- hosting.
- database size and compute.
- auth monthly active users.
- storage.
- file egress.
- email.
- monitoring.
- backups.
- preview environments.
- background jobs.

## 3. No Final Prices

لا تعتمد هذه الوثيقة أسعارا نهائية. الأسعار يجب تأكيدها من مزودي الخدمة عند اعتماد الإنتاج.

## 4. Lock-in

| Service | Lock-in | Exit Strategy |
| --- | --- | --- |
| Supabase Auth | متوسط | export users where possible; adapter around auth calls |
| Supabase Postgres | منخفض/متوسط | PostgreSQL standard, migrations portable جزئيا |
| Supabase Storage | متوسط | metadata abstraction, migrate objects to S3/R2 |
| Realtime | متوسط | use only for non-critical scoped updates |
| Vercel/Hosting | متوسط | keep Next.js standard deployment |
| Email Provider | منخفض | provider adapter |

## 5. Revisit Triggers

- egress grows بسبب الفيديو.
- SLA jobs تصبح ثقيلة.
- tenant isolation needs dedicated compute.
- compliance requires stronger data residency.

