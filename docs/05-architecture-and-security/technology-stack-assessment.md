# Technology Stack Assessment: شريك

**الحالة:** Draft for owner review  
**الغرض:** تقييم الـStack المرشح دون اعتماد أي مكتبة لمجرد ورودها في خطة سابقة.

## 1. Summary

| Choice | Purpose | Alternatives | Benefits | Risks | Security | Cost | MVP Speed | Recommendation | ADR |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Next.js App Router | Web/full-stack shell | Remix, SPA+API | SSR, routing, server commands | خلط UI/business logic | جيد إذا فصلت commands | hosting حسب الاستخدام | High | Adopt | ADR-002 |
| TypeScript | type safety | JavaScript | يقلل أخطاء العقود | types قد تصبح شكلية | يساعد validation | منخفض | High | Adopt | ADR-002 |
| React | UI | Vue, Svelte | ecosystem واسع | re-render complexity | محايد | منخفض | High | Adopt | ADR-002 |
| Tailwind CSS | styling | CSS modules, Chakra | سرعة وتناسق | classes كثيفة | محايد | منخفض | High | Adopt |
| shadcn/ui | components | custom, MUI | ownership + Radix | يحتاج ضبط RTL | جيد مع Radix | منخفض | High | Adopt |
| Radix UI | primitives | Headless UI | accessibility primitives | styling مطلوب | جيد للأمان UX | منخفض | High | Adopt |
| Lucide Icons | icons | Heroicons | بسيط وخفيف | لا خطر جوهري | محايد | منخفض | High | Adopt |
| Supabase | backend platform | custom backend, Firebase | Auth/DB/Storage/RLS | lock-in متوسط | قوي إذا ضبط RLS | usage-based | High | Adopt | ADR-003 |
| PostgreSQL | relational source | MySQL, Firestore | transactions وconstraints | يحتاج خبرة | قوي | حسب الاستضافة | High | Adopt | ADR-003 |
| Supabase Auth | identity/session | Auth0, Clerk | مدمج وسريع | lock-in وclaims freshness | جيد مع app_metadata | usage-based | High | Adopt | ADR-003 |
| RLS | DB isolation | app-only auth | defense in depth | misconfig خطر | حاسم | منخفض | Medium | Adopt with server auth | ADR-005 |
| Supabase Storage | files | R2/S3 | سريع ومتكامل | egress/lock-in | جيد مع metadata auth | storage/egress | High | Adopt, revisit video | ADR-007 |
| Supabase Realtime | live updates | polling, custom WS | UX أسرع | channel leakage | حساس | usage-based | Medium | Proposed limited | ADR-010 |
| Server Actions/Route Handlers | commands/API | RPC only, separate API | قريب من Next.js | سوء الفصل | جيد إذا server-only | منخفض | High | Adopt | ADR-006 |
| TanStack Query | client cache | SWR, native fetch | caching/invalidations | تعقيد زائد إن أفرط | محايد | منخفض | Medium | Adopt for data-heavy screens |
| TanStack Table | tables | custom tables | sorting/filtering | setup زائد للبساطة | محايد | منخفض | Medium | Adopt for admin tables |
| React Hook Form | forms | Formik, native | أداء جيد | تعلم patterns | محايد | منخفض | High | Adopt |
| Zod | validation | Yup, Valibot | shared schemas | schemas لا تكفي وحدها | قوي للinput validation | منخفض | High | Adopt |
| dnd-kit | Kanban DnD | react-beautiful-dnd | حديث ومرن | accessibility/edge cases | يحتاج server validation | منخفض | Medium | Adopt |
| Uppy | uploads | native upload, Dropzone | resumable/plugins | bundle size | جيد مع server guard | منخفض | Medium | Adopt |
| Tiptap | rich comments | textarea/Markdown | محرر قوي | complexity | sanitize required | منخفض/متوسط | Medium | Defer until need proven |
| Vitest | unit tests | Jest | سريع مع TS | محايد | يدعم security logic tests | منخفض | High | Adopt |
| Testing Library | component tests | Enzyme | user-focused | محايد | جيد UX auth states | منخفض | High | Adopt |
| Playwright | E2E | Cypress | cross-browser flows | وقت إعداد | حاسم للعزل | منخفض | Medium | Adopt |

## 2. Licensing Notes

الخيارات المرشحة عامة ومقبولة عادة لمشاريع SaaS، لكن يجب التحقق من نسخ التراخيص عند تثبيت dependencies فعليا. BrightBean وPostiz وPlanka لا تستخدم كقواعد بناء في V1.

## 3. Vendor Lock-in Notes

أعلى Lock-in في Supabase Auth/Storage/Realtime. Postgres يقلل lock-in جزئيا. يجب إبقاء domain commands وfile metadata داخل التطبيق حتى يسهل الانتقال لاحقا.

## 4. Deferred Decisions

- Tiptap يعتمد بعد حسم حاجة محرر متقدم؛ fallback textarea/Markdown يحتاج ADR إذا خالف AGENTS.
- Realtime يستخدم بعد إثبات قنوات scoped.
- R2/S3 يؤجل حتى يظهر ضغط فيديو أو egress.

