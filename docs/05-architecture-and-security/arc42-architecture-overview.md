# arc42 Architecture Overview: شريك

## 1. Goals

- حماية عزل Tenant وClient كأولوية أعلى من السرعة.
- إبقاء UX العميل بسيطا مع Enforcement صارم في الخادم والقاعدة.
- جعل كل قرار حساس قابلا للتدقيق.
- دعم MVP سريع دون إغلاق طريق التوسع.

## 2. Constraints

- Next.js وTypeScript وSupabase/PostgreSQL هي الخيارات المرشحة.
- لا كود ولا SQL في هذه المرحلة.
- Spec Kit مؤجل.
- Social scheduling وAI والفوترة المتقدمة خارج V1.

## 3. System Context

شريك يربط العميل وفريق سماوة والإدارة حول المخرجات المتفق عليها. الأنظمة الخارجية في V1 محدودة: Supabase Auth/DB/Storage، مزود البريد، منصة الاستضافة، وأدوات المراقبة.

## 4. Building Blocks

| Block | المسؤولية |
| --- | --- |
| Web App | RTL UX، بوابات الأدوار، عرض البيانات scoped |
| Server Command Layer | تنفيذ العمليات الحساسة والتحقق من الصلاحيات |
| Domain Modules | Deliverables, Approvals, SLA, Ledger, Files |
| PostgreSQL | الحالة التشغيلية، RLS، transactions |
| Storage | الملفات الفعلية مع metadata محكومة |
| Jobs | SLA scan, notifications, cleanup |
| Observability | logs, metrics, audit-friendly traces |

## 5. Runtime View

كل طلب يبدأ بجلسة مستخدم، ثم Tenant Context، ثم Permission Evaluation، ثم تنفيذ قراءة أو Command. العمليات الحساسة تكتب Domain Event/Audit Event ضمن نفس حدود الاتساق أو عبر Outbox عند الحاجة.

## 6. Deployment View

بيئات مقترحة: local, preview, staging, production. كل بيئة لها Supabase project أو إعداد معزول، وأسرار منفصلة، ونسخ احتياطي وخطة استرجاع.

## 7. Cross-Cutting Concepts

- Deny by default.
- Least privilege.
- Scope-aware permissions.
- Append-only auditability.
- Explicit state transitions.
- Idempotency للعمليات القابلة للتكرار.
- Data minimization في بوابة العميل.

## 8. Quality Requirements

| الجودة | معيار V1 |
| --- | --- |
| Security | لا تسرب cross-tenant/client أو internal content |
| Availability | مناسب لـPilot مع مراقبة وتنبيه |
| Performance | لوحات أساسية تستجيب دون تحميل زائد |
| Auditability | كل قرار حساس له actor/scope/target/time |
| Recoverability | Backups واختبار Restore قبل Production |

## 9. Risks

أكبر المخاطر: الاعتماد على RLS وحده، تسرب Tenant Context، تضخم المونوليث، Signed URLs طويلة، وتعارض انتقالات الحالة مع Drag and Drop.

