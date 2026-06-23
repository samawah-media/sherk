تمام. بناءً على فهمي الحالي لمنصة سماوة، أنا لا أرى أننا نحتاج “كل” المكتبات/الأطر الموجودة في الملف. نحتاج **Stack عملي ومخفف** يخدم فكرة المنصة تحديدًا:

**منصة Automation Bridge لإدارة المخرجات المتفق عليها بين العميل، فريق سماوة، والإدارة، مع SLA، لوحة Trello داخلية، ملفات، تعليقات، تعميد داخلي، واعتماد عميل.**

الملف الذي أرسلته يقترح مجموعة قوية للتخطيط تشمل BMAD، Product Manager Skills، GitHub Spec Kit، Agent OS، C4، arc42، ADR، AWS/Azure SaaS Multitenancy، OWASP ASVS، وShape Up، مع تقسيم واضح بين مرحلة المنتج، الـ specs، المعمارية، الأمان، والتنفيذ. 

## قراري النهائي: لا نستخدم كل شيء

سأقسم الاختيار إلى 3 طبقات:

| الطبقة                  | ماذا نستخدم؟                                           | القرار               |
| ----------------------- | ------------------------------------------------------ | -------------------- |
| تخطيط المنتج            | Product Manager Skills + BMAD                          | أساسي                |
| تحويل التخطيط إلى تنفيذ | GitHub Spec Kit + Agent OS                             | أساسي                |
| معمارية SaaS وأمان      | C4 + arc42 + ADR + AWS/Azure Multitenancy + OWASP ASVS | أساسي لكن بشكل خفيف  |
| إدارة التنفيذ           | Shape Up                                               | أساسي                |
| أفكار/اكتشاف إضافي      | Lean Canvas + JTBD                                     | مرة واحدة فقط        |
| أدوات AI إضافية         | SuperClaude                                            | اختياري وليس ضروريًا |
| جدولة السوشيال          | BrightBean / Mixpost / Postiz                          | لاحقًا، وليس في MVP  |

---

# الاختيار الأفضل من القائمة الموجودة عندك

## 1. Product Manager Skills — نستخدمه أولًا

هذا سيكون أول إطار نستخدمه في التخطيط؛ لأنه مناسب جدًا لتفكيك المنتج إلى:

* Personas: العميل، فريق سماوة، الإدارة.
* User stories.
* PRD.
* Roadmap.
* SaaS metrics.
* Journey لكل دور.

الريبو الرسمي يذكر أنه يحتوي على 49 مهارة جاهزة وworkflows لتعليم وكلاء الذكاء الاصطناعي تنفيذ عمل إدارة المنتج بطريقة احترافية، وليس مجرد “اكتب PRD”. ([GitHub][1])

**كيف نستخدمه في مشروع سماوة؟**

نخرج منه هذه الملفات:

```text
prd.md
personas.md
user-stories.md
roles-and-permissions.md
customer-journey.md
admin-journey.md
team-journey.md
roadmap.md
success-metrics.md
```

هذا مهم لأن المنصة عندنا ليست شاشة واحدة؛ لدينا 3 تجارب مختلفة:

* تجربة العميل.
* تجربة فريق العمل.
* تجربة الإدارة.

---

## 2. BMAD Method — نستخدمه كفريق تخطيط ذكي

BMAD مناسب جدًا لأن المشروع ليس مجرد كود. عندنا منتج، تجربة مستخدم، صلاحيات، SLA، معمارية، أمن، وتخطيط مراحل. الريبو الرسمي يصفه كإطار Agile AI Driven Development مجاني ومفتوح المصدر، ويستهدف العمل من مستوى bug fixes إلى أنظمة enterprise. ([GitHub][2])

**كيف نستخدمه؟**

نستخدمه كجلسات منظمة:

```text
Analyst
→ يفهم المشكلة والعميل وفريق سماوة

Product Manager
→ يحولها إلى PRD وRoadmap

UX
→ يراجع التابات وتجربة العميل والفريق والإدارة

Architect
→ يحدد المعمارية والـ multi-tenancy والصلاحيات

QA
→ يحول المتطلبات إلى اختبارات
```

**رأيي:** BMAD لا يكتب المنتج بدلنا، لكنه ممتاز جدًا لمنع العشوائية.

---

## 3. GitHub Spec Kit — نستخدمه قبل أي كود

هذا من أهم الخيارات. Spec Kit سيحول كل Feature إلى ملفات واضحة:

```text
spec.md
plan.md
tasks.md
```

GitHub تصف Spec Kit بأنه Toolkit للـ Spec-Driven Development، بحيث تصبح المواصفات مركز التطوير بدل القفز مباشرة للكود. ([GitHub][3])

**كيف نستخدمه في منصة سماوة؟**

كل ميزة لها spec مستقل:

```text
features/
  deliverables/
    spec.md
    plan.md
    tasks.md

  approvals/
    spec.md
    plan.md
    tasks.md

  kanban-board/
    spec.md
    plan.md
    tasks.md

  sla/
    spec.md
    plan.md
    tasks.md

  files/
    spec.md
    plan.md
    tasks.md

  client-portal/
    spec.md
    plan.md
    tasks.md
```

هذا مهم جدًا لأن منصة سماوة فيها تفاصيل كثيرة، ولو بدأنا coding بدون specs سيحدث تداخل بين “المخرجات”، “المهام”، “العقود”، “التعميد”، و“SLA”.

---

## 4. Agent OS — نستخدمه من بداية إنشاء الريبو

Agent OS ليس لتخطيط المنتج نفسه، لكنه مهم عندما نبدأ الكود. هو يحافظ على standards المشروع حتى لا تكون كل جلسة AI أو كل مطور يعمل بطريقة مختلفة. الموقع الرسمي يذكر أنه يساعد على إدارة معايير الكود في التطوير المدعوم بالذكاء الاصطناعي، ويحافظ على الاتساق أثناء كتابة specs أو prompting agents. ([buildermethods.com][4])

**نستخدمه لتثبيت قواعد مثل:**

```text
- كل عميل = tenant منفصل منطقيًا.
- لا Query بدون tenant_id.
- لا Feature بدون spec.
- لا Feature بدون acceptance tests.
- لا File upload بدون صلاحيات.
- لا Approval بدون audit log.
- لا SLA بدون paused state عند انتظار العميل.
```

---

## 5. C4 + arc42 + ADR — نستخدمها لكن بنسخة خفيفة

لا نحتاج وثائق معمارية ضخمة في أول أسبوع، لكن نحتاج توثيق واضح. arc42 قالب معماري مفتوح المصدر للتوثيق العملي والبراغماتي، وC4 مناسب لرسم النظام على مستويات: Context, Container, Component. ([GitHub][5])

**نستخدم C4 لرسم:**

```text
Client Portal
Admin Portal
Team Workspace
API Layer
Database
Storage
Notification Service
Future Publishing Integration
```

**ونستخدم ADR لتسجيل قرارات مثل:**

```text
ADR-001: لماذا المنصة مبنية حول Deliverables وليس Requests
ADR-002: اختيار Supabase/Postgres وRLS
ADR-003: اختيار dnd-kit للوحة Trello الداخلية
ADR-004: تأجيل جدولة السوشيال للمرحلة الثانية
ADR-005: كيفية احتساب SLA عند انتظار العميل
```

هذا سيحمي المشروع من تغيير القرارات كل أسبوع.

---

## 6. AWS/Azure Multitenant Guidance — نستخدمه كمرجع وليس كاستضافة

لأن المنصة عندنا Multi-client من أول يوم. كل عميل له بياناته، ملفاته، مخرجاته، اعتماداته، تقاريره، وجهات اعتماده. AWS SaaS Factory يوضح مفاهيم مهمة مثل tenant onboarding، tenant/user management، authorization، data partitioning، tenant isolation، وobservability. ([GitHub][6])

Azure أيضًا يشرح أن الـ tenant غالبًا يمثل عميلًا أو منظمة في حلول SaaS متعددة العملاء، وأن تصميم multitenant يحتاج قرارات معمارية واضحة. ([Microsoft Learn][7])

**نستخدمه لتحديد:**

```text
Organization = شركة العميل
Tenant = مساحة العميل داخل سماوة
User = شخص داخل عميل أو فريق سماوة
Role = صلاحية المستخدم
Deliverable = المخرج المتفق عليه
```

---

## 7. OWASP ASVS — أساسي من أول إصدار

هذا ليس رفاهية. المنصة ستحتوي على:

* ملفات عقود.
* ملفات عملاء.
* تصاميم.
* تعليقات داخلية.
* صلاحيات اعتماد.
* روابط مشاركة.
* بيانات أكثر من عميل.

OWASP ASVS يوفر أساسًا لاختبار ضوابط الأمان ومتطلبات التطوير الآمن لتطبيقات الويب والـ APIs. ([OWASP][8])

**في V1 نستخدم منه Checklist مبسطة:**

```text
Auth
Session security
Access control
File upload security
API security
Tenant isolation
Audit logs
Password reset
Magic links
```

---

## 8. Shape Up — نستخدمه لإدارة التنفيذ

Shape Up ممتاز لأنه يمنعنا من فتح backlog ضخم لا ينتهي. في مشروعنا، الأفضل أن نقسم التنفيذ إلى “دورات بناء” واضحة.

مثال:

```text
Cycle 1: Core data model + auth + roles
Cycle 2: Deliverables + SLA
Cycle 3: Kanban + internal comments
Cycle 4: Client approval portal
Cycle 5: Files + reports
Cycle 6: Testing + launch
```

الملف الذي أرسلته يضع Shape Up في مرحلة التنفيذ مع BMAD وAgent OS لتقسيم العمل إلى دورات واضحة بدل العشوائية. 

---

# أشياء من القائمة أؤجلها أو أستخدمها بشكل خفيف

## Lean Canvas

نستخدمه في جلسة واحدة فقط.
ليس مستندًا يوميًا.

الهدف:

```text
من هو العميل؟
ما المشكلة؟
لماذا يدفع؟
ما القيمة؟
ما البديل الحالي؟
```

## Jobs To Be Done

مفيد جدًا للرسائل التسويقية.
مثال JTBD الحقيقي للعميل:

> عندما أتعاقد مع وكالة تسويق، أريد أن أعرف ماذا تم، ماذا تبقى، وما الذي يحتاج موافقتي، بدون الرجوع للواتساب كل يوم.

نستخدمه في مرحلة التمركز والرسائل فقط، وليس كإطار تنفيذي يومي.

## Opportunity Solution Tree

مفيد لو عندنا فريق Product كبير وتجارب كثيرة.
حاليًا لا أراه ضروريًا في أول نسخة. ممكن نستخدمه لاحقًا لترتيب الميزات بعد تجربة أول عميلين.

## SuperClaude

اختياري.
لو سنستخدم Claude Code بكثافة يمكن إضافته، لكنه ليس أساس المشروع. Agent OS + Spec Kit + BMAD كافيين كبداية.

---

# المكتبات والأدوات غير الموجودة في الملف والتي أنصح بها للمشروع

هنا سأدخل في **مكتبات التنفيذ**، وليست فقط أطر التخطيط.

## Frontend

| المكتبة                  | القرار     | لماذا مناسبة؟                                                                                                                                                  |
| ------------------------ | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Next.js + TypeScript** | أساسي      | مناسب لبناء SaaS كامل بسرعة، ويدعم واجهات العميل والفريق والإدارة في تطبيق واحد. Next.js موصوف رسميًا كإطار React لبناء تطبيقات ويب full-stack. ([Next.js][9]) |
| **Tailwind CSS**         | أساسي      | مناسب جدًا لتكرار الستايل الذي اعتمدناه: كروت، ظلال خفيفة، spacing، RTL.                                                                                       |
| **shadcn/ui**            | أساسي      | أفضل اختيار لواجهة حديثة؛ يعطيك مكونات قابلة للتخصيص وليس UI مغلق. الموقع الرسمي يصفه كأساس Design System بمكونات يمكنك تخصيصها وتوسيعها. ([Shadcn UI][10])    |
| **Radix UI**             | ضمن shadcn | مفيد للمودالات، القوائم، tabs، dropdowns، accessibility.                                                                                                       |
| **Lucide Icons**         | أساسي      | أيقونات نظيفة ومناسبة لنمط المنصة.                                                                                                                             |

**قراري:**
نستخدم **Next.js + TypeScript + Tailwind + shadcn/ui**.

---

## Backend & Database

| الأداة                                | القرار            | لماذا؟                                                                                                                                          |
| ------------------------------------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **Supabase**                          | أفضل خيار للـ MVP | يعطينا Postgres + Auth + Storage + Realtime بسرعة. وثائق Supabase تذكر Database/Postgres، Auth، Storage، وRealtime ضمن المنصة. ([Supabase][11]) |
| **PostgreSQL**                        | أساسي             | مناسب جدًا للعقود، المخرجات، الصلاحيات، SLA، audit logs.                                                                                        |
| **Row Level Security - RLS**          | أساسي جدًا        | Supabase يوضح أن RLS يمكن دمجه مع Auth لحماية البيانات من المتصفح إلى قاعدة البيانات، وأنه يوفر defense in depth. ([Supabase][12])              |
| **Supabase Storage أو Cloudflare R2** | أساسي             | للملفات والتقارير والتصاميم والفيديوهات.                                                                                                        |
| **Edge Functions / Server Actions**   | للمنطق الحساس     | لحساب SLA، إرسال الإشعارات، التعميد، audit logs.                                                                                                |

**قراري:**
ابدأ بـ **Supabase** بدل بناء Backend كامل من الصفر.
لكن نكتب المعمارية بطريقة تسمح لاحقًا بنقل أجزاء إلى NestJS إذا كبر المشروع.

---

## لوحة Trello الداخلية

| المكتبة     | القرار   | لماذا؟                                                                                                                                                                              |
| ----------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **dnd-kit** | أساسي    | أفضل اختيار لبناء Kanban مخصص؛ يدعم drag/drop/sort/reorder، ومصمم للأداء والوصول accessibility. ([dnd kit][13])                                                                     |
| **Planka**  | مرجع فقط | ممتاز كإلهام للـ Kanban لأنه يدعم boards/lists/cards وreal-time وMarkdown وnotifications، لكنه مرخص Fair Use/Pro وليس MIT صريح، لذلك لا أنصح بالنسخ منه داخل منتجنا. ([GitHub][14]) |

**قراري:**
نبني Kanban بأنفسنا باستخدام **dnd-kit**.
ننظر إلى Planka كمرجع UX/Features فقط.

---

## الجداول ولوحات الإدارة

| المكتبة            | القرار | لماذا؟                                                                                                                                                                         |
| ------------------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **TanStack Table** | أساسي  | للإدارة سنحتاج جداول قوية: العملاء، المخرجات، SLA، الفريق، الملفات. TanStack Table مكتبة headless لبناء جداول وdatagrids قوية مع تحكم كامل في الشكل. ([TanStack][15])          |
| **TanStack Query** | أساسي  | لإدارة server state، caching، refetching، optimistic updates عند تحريك الكروت أو اعتماد المخرجات. TanStack Query متخصص في إدارة server state والـ async data. ([TanStack][16]) |

**قراري:**
نستخدم **TanStack Query + TanStack Table** في لوحة الإدارة والفريق.

---

## النماذج والتحقق من البيانات

| المكتبة             | القرار | لماذا؟                                                                                                                                 |
| ------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| **Zod**             | أساسي  | مهم جدًا للتحقق من مدخلات المخرجات، SLA، العقود، الصلاحيات. Zod مكتبة TypeScript-first لتعريف schemas والتحقق من البيانات. ([Zod][17]) |
| **React Hook Form** | أساسي  | مع Zod لبناء فورمات سهلة وسريعة.                                                                                                       |

**قراري:**
كل فورم في المنصة يكون له Zod schema.
مثال:

```text
Create Deliverable
Create Contract
Create Approval
Create SLA Rule
Invite User
Upload File Metadata
```

---

## الملفات والرفع

| المكتبة                        | القرار | لماذا؟                                                                                                                                                   |
| ------------------------------ | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Uppy**                       | أساسي  | مناسب لتجربة رفع ملفات احترافية، ويدعم مصادر متعددة وواجهة Dashboard. الموقع الرسمي يصفه كـ JavaScript file uploader مفتوح المصدر وmodular. ([Uppy][18]) |
| **Supabase Storage / R2**      | أساسي  | التخزين الفعلي للملفات.                                                                                                                                  |
| **Image preview / thumbnails** | مهم    | لعرض صور وفيديوهات وتقرير PDF داخل تاب الملفات.                                                                                                          |

**قراري:**
استخدم **Uppy + Supabase Storage** في V1.
لو الملفات كبيرة جدًا أو الفيديوهات كثيرة، ننتقل إلى **Cloudflare R2** لاحقًا.

---

## التعليقات والمحتوى النصي

| المكتبة           | القرار   | لماذا؟                                                                                                                                                          |
| ----------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Tiptap**        | جيد جدًا | لبناء محرر نصوص للملاحظات، وصف المخرج، النصوص، المراجعات الداخلية. Tiptap هو headless open-source editor framework، ويدعم أكثر من 100 extension. ([Tiptap][19]) |
| **Markdown بسيط** | بديل MVP | لو نريد أبسط نسخة، نبدأ بـ textarea + Markdown preview.                                                                                                         |

**قراري:**
لو نريد سرعة: نبدأ بتعليقات بسيطة.
لو نريد تجربة عالمية من أول نسخة: نستخدم **Tiptap**.

---

## التقويم والجدول الزمني

| المكتبة             | القرار  | لماذا؟                                                                                                                               |
| ------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| **FullCalendar**    | مناسب   | لتاب التقويم لاحقًا أو داخل الإدارة. FullCalendar يوفر React component قوي ويدعم event calendar بإعدادات كثيرة. ([FullCalendar][20]) |
| **Custom Timeline** | للـ SLA | للـ contract timeline يمكن نبنيه بالكروت والـ CSS بدل مكتبة ضخمة.                                                                    |

**قراري:**
في V1 لا نحتاج تقويم معقد.
نستخدم Custom Timeline للمخرجات والـ SLA.
نضيف FullCalendar عندما نحتاج تقويم محتوى فعلي.

---

## الاختبارات والجودة

| الأداة              | القرار | لماذا؟                                                                                                                                                                              |
| ------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Vitest**          | أساسي  | لاختبارات الدوال: SLA calculation، permissions، progress calculation. Vitest إطار اختبار حديث مبني على Vite. ([Vitest][21])                                                         |
| **Playwright**      | أساسي  | لاختبار رحلة المستخدم end-to-end: إنشاء مخرج، رفع ملف، تعميد داخلي، إرسال للعميل، اعتماد العميل. Playwright يدعم تشغيل الاختبارات على Chromium وFirefox وWebKit. ([Playwright][22]) |
| **Testing Library** | جيد    | لاختبار مكونات React.                                                                                                                                                               |

**قراري:**
لا نؤجل الاختبارات.
من أول إصدار نكتب اختبارات لـ:

```text
tenant isolation
roles permissions
sla pause/resume
approval flow
file visibility
client cannot see internal comments
```

---

# ماذا عن BrightBean وMixpost وPostiz؟

هذه ليست أدوات نستخدمها في قلب V1، لكنها مهمة جدًا لاحقًا.

## BrightBean

BrightBean ممتاز كمرجع UX ووظائف مستقبلية. GitHub يذكر أن لديه multi-workspace، RBAC، Client role، composer، calendar، publishing engine، approval workflows، threaded comments، audit trail، media library، وclient portal عبر magic link. ([GitHub][23])

**قراري:**
نستخدمه كمرجع قوي في:

```text
approval workflow
client portal
media library
calendar
audit trail
```

لكن لا أنصح بنسخ الكود أو بناء المنتج عليه الآن، خاصة أن منتجنا أوسع من social scheduling؛ منتجنا هو Deliverables + SLA + Internal Workflows.

## Mixpost

Mixpost مناسب لاحقًا لمرحلة جدولة السوشيال، خصوصًا أنه MIT في نسخة Lite ويحتوي على social account management، analytics، media library، team collaboration، workspaces، queue/calendar، وقوالب. ([GitHub][24])

**قراري:**
لو أردنا لاحقًا إضافة جدولة سوشيال مفتوحة المصدر، Mixpost أفضل من ناحية الترخيص مقارنة بـ AGPL.

## Postiz

Postiz قوي جدًا كـ social scheduling، ويستخدم NextJS وNestJS وPrisma وPostgreSQL وTemporal وResend، كما يوضح أنه يستخدم OAuth رسمي ولا يعتمد على scraping. لكنه مرخص AGPL-3.0. ([GitHub][25])

**قراري:**
نستفيد من معماريته كمرجع فقط، ولا نبني عليه تجاريًا قبل حسم الترخيص.

---

# الـ Stack الذي أنصح به فعليًا لمنصة سماوة

## مرحلة التخطيط

```text
Product Manager Skills
BMAD Method
GitHub Spec Kit
Agent OS
C4 + arc42 + ADR
AWS/Azure Multitenant Guidance
OWASP ASVS
Shape Up
```

هذا قريب من الخلاصة الموجودة في الملف، لكنني سأجعله عمليًا أكثر وأخفّف Lean Canvas وJTBD إلى جلسات قصيرة فقط. 

---

## مرحلة التصميم

```text
Figma
shadcn/ui
Tailwind CSS
Lucide Icons
C4 diagrams
```

---

## مرحلة التنفيذ

```text
Next.js
TypeScript
Supabase
PostgreSQL
RLS
Supabase Storage أو Cloudflare R2
TanStack Query
TanStack Table
dnd-kit
Zod
React Hook Form
Uppy
Tiptap
FullCalendar لاحقًا
```

---

## مرحلة الاختبارات

```text
Vitest
Playwright
OWASP ASVS checklist
Manual QA scenarios
Role-based permission tests
SLA calculation tests
Tenant isolation tests
```

---

# ما الذي لا أنصح به الآن؟

| الأداة                        | القرار      | السبب                                                            |
| ----------------------------- | ----------- | ---------------------------------------------------------------- |
| BrightBean كقاعدة بناء مباشرة | لا الآن     | رائع للسوشيال، لكن منصتنا مركزها المخرجات وSLA والتعميد الداخلي. |
| Postiz كقاعدة مباشرة          | لا الآن     | قوي، لكن AGPL ويخص الجدولة أكثر من إدارة المخرجات.               |
| Planka كقاعدة مباشرة          | لا الآن     | مفيد كمرجع Kanban، لكن الترخيص ليس MIT صريحًا.                   |
| Microservices                 | لا          | مبكر جدًا.                                                       |
| NestJS backend كامل           | لا في V1    | Supabase أسرع وأبسط كبداية.                                      |
| FullCalendar من أول يوم       | ليس ضروريًا | يمكن تأجيله حتى نحتاج تقويم متقدم.                               |
| AI features                   | لا في V1    | لا نشتت المنتج قبل تثبيت التشغيل الأساسي.                        |

---

# ترتيب العمل من الآن

## الأسبوع 1: Product Planning

نستخدم:

```text
Product Manager Skills
BMAD
Lean Canvas خفيف
JTBD خفيف
```

نخرج:

```text
product-vision.md
prd.md
personas.md
roles-and-permissions.md
deliverables-model.md
sla-model.md
approval-flow.md
```

---

## الأسبوع 2: Specs

نستخدم:

```text
GitHub Spec Kit
Agent OS
```

نخرج:

```text
specs/deliverables/spec.md
specs/sla/spec.md
specs/kanban/spec.md
specs/files/spec.md
specs/approvals/spec.md
specs/client-portal/spec.md
```

---

## الأسبوع 3: Architecture

نستخدم:

```text
C4
arc42
ADR
AWS/Azure SaaS Multitenancy
OWASP ASVS
```

نخرج:

```text
c4-context.md
c4-container.md
data-model.md
tenant-isolation.md
rls-policy-matrix.md
security-checklist.md
ADR-001-deliverables-not-requests.md
ADR-002-supabase-rls.md
```

---

## الأسبوع 4 وما بعده: Build Cycles

نستخدم:

```text
Shape Up
BMAD
Agent OS
Vitest
Playwright
```

ونقسم التنفيذ:

```text
Cycle 1: Auth + tenants + roles
Cycle 2: Contracts + deliverables + SLA
Cycle 3: Kanban + internal comments
Cycle 4: Internal approval + client approval
Cycle 5: Files + audit logs
Cycle 6: dashboards + reports + testing
```

---

# أهم ملفات لازم نبدأ بها الآن

أقترح أن يكون مجلد docs هكذا، لكن مخصص لمنصة سماوة:

```text
docs/
  00-product/
    product-vision.md
    prd.md
    personas.md
    jobs-to-be-done.md
    roadmap.md

  01-core-model/
    deliverables-model.md
    contracts-and-packages.md
    sla-model.md
    approval-workflow.md
    progress-calculation.md

  02-users-and-permissions/
    roles-and-permissions.md
    client-portal-permissions.md
    team-workspace-permissions.md
    admin-permissions.md

  03-ux/
    information-architecture.md
    client-user-flow.md
    team-user-flow.md
    admin-user-flow.md
    kanban-ux.md
    files-ux.md

  04-architecture/
    c4-context.md
    c4-containers.md
    data-model.md
    rls-policy-matrix.md
    integration-map.md

  05-decisions/
    ADR-001-deliverables-core.md
    ADR-002-supabase.md
    ADR-003-kanban-dnd-kit.md
    ADR-004-scheduling-later.md

  06-security/
    owasp-asvs-v1-checklist.md
    tenant-isolation.md
    file-access-control.md
    audit-log-policy.md

  07-delivery/
    cycles.md
    milestones.md
    acceptance-tests.md
    release-checklist.md
```

---

# الخلاصة النهائية

أفضل اختيار لنا هو:

```text
Product Manager Skills
+ BMAD
+ GitHub Spec Kit
+ Agent OS
+ C4/arc42/ADR
+ AWS/Azure Multitenant Guidance
+ OWASP ASVS
+ Shape Up
```

وأفضل مكتبات التنفيذ:

```text
Next.js
+ Supabase/Postgres/RLS
+ shadcn/ui/Tailwind
+ dnd-kit
+ TanStack Query/Table
+ Zod
+ Uppy
+ Tiptap
+ Vitest
+ Playwright
```

أما BrightBean وMixpost وPostiz، فأراها **مراجع قوية جدًا للمرحلة الثانية الخاصة بالجدولة والسوشيال**، لكن لا أجعلها قلب V1. قلب V1 يجب أن يكون:

**المخرجات المتفق عليها + SLA + لوحة العمل + التعميد الداخلي + اعتماد العميل + الملفات + الصلاحيات.**

[1]: https://github.com/deanpeters/Product-Manager-Skills?utm_source=chatgpt.com "deanpeters/Product-Manager-Skills ..."
[2]: https://github.com/bmad-code-org/bmad-method?utm_source=chatgpt.com "bmad-code-org/BMAD-METHOD: Breakthrough Method for ..."
[3]: https://github.com/github/spec-kit?utm_source=chatgpt.com "github/spec-kit: 💫 Toolkit to help you get started with ..."
[4]: https://buildermethods.com/agent-os?utm_source=chatgpt.com "Agent OS | Coding standards for AI-powered development"
[5]: https://github.com/arc42/arc42-template?utm_source=chatgpt.com "arc42 - the template for software architecture ..."
[6]: https://github.com/aws-samples/aws-saas-factory-ref-solution-serverless-saas/blob/main/DOCUMENTATION.md?utm_source=chatgpt.com "aws-samples/aws-saas-factory-ref-solution-serverless-saas"
[7]: https://learn.microsoft.com/en-us/azure/architecture/guide/multitenant/overview?utm_source=chatgpt.com "Architect Multitenant Solutions on Azure"
[8]: https://owasp.org/www-project-application-security-verification-standard/?utm_source=chatgpt.com "OWASP Application Security Verification Standard (ASVS)"
[9]: https://nextjs.org/docs?utm_source=chatgpt.com "Next.js Docs | Next.js"
[10]: https://ui.shadcn.com/?utm_source=chatgpt.com "The Foundation for your Design System - shadcn/ui"
[11]: https://supabase.com/docs?utm_source=chatgpt.com "Supabase Docs"
[12]: https://supabase.com/docs/guides/database/postgres/row-level-security?utm_source=chatgpt.com "Row Level Security | Supabase Docs"
[13]: https://dndkit.com/?utm_source=chatgpt.com "dnd kit – The modern toolkit for building drag and drop interfaces"
[14]: https://github.com/plankanban/planka "GitHub - plankanban/planka: PLANKA is the Kanban-style project mastering tool for everyone · GitHub"
[15]: https://tanstack.com/table/latest/docs/introduction?utm_source=chatgpt.com "Introduction | TanStack Table Docs"
[16]: https://tanstack.com/query/latest?utm_source=chatgpt.com "TanStack Query"
[17]: https://zod.dev/?utm_source=chatgpt.com "Zod: Intro"
[18]: https://uppy.io/?utm_source=chatgpt.com "Uppy"
[19]: https://tiptap.dev/?utm_source=chatgpt.com "Tiptap - Dev Toolkit Editor Suite"
[20]: https://fullcalendar.io/?utm_source=chatgpt.com "FullCalendar - JavaScript Event Calendar"
[21]: https://vitest.dev/guide/?utm_source=chatgpt.com "Getting Started | Guide"
[22]: https://playwright.dev/?utm_source=chatgpt.com "Playwright: Fast and reliable end-to-end testing for modern ..."
[23]: https://github.com/brightbeanxyz/brightbean-studio "GitHub - brightbeanxyz/brightbean-studio: Open-source, self-hostable social media management platform. Schedule, publish, and manage content across 10+ platforms from a single dashboard. Free alternative to Buffer, Sendible, and SocialPilot. · GitHub"
[24]: https://github.com/inovector/mixpost "GitHub - inovector/mixpost:  Schedule,  publish, and ⚡ manage your social media content on your server. No subscriptions, no limits. (Buffer alternative) · GitHub"
[25]: https://github.com/gitroomhq/postiz-app "GitHub - gitroomhq/postiz-app:  The ultimate agentic social media scheduling tool  · GitHub"
