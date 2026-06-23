# Roadmap: شريك

**المرحلة:** Phase 01 - Product Planning  
**نوع الوثيقة:** Product Roadmap  
**الحالة:** Draft for owner review  
**آخر تحديث:** 2026-06-22  

## 1. ملاحظة منهجية

هذه خارطة منتج وليست خطة تنفيذ تفصيلية. تعتمد على Now/Next/Later وShape Up cycles، مع الحفاظ على أن Spec Kit والمعمارية تأتيان بعد اعتماد التخطيط.

| التصنيف | المعلومة |
| --- | --- |
| Confirmed | Shape Up يستخدم لاحقا لتقسيم التنفيذ إلى دورات بناء. |
| Confirmed | Spec Kit لاحق لتحويل الخطة إلى `spec.md`, `plan.md`, `tasks.md`. |
| Assumed | ترتيب الدورات أدناه مناسب لبناء أساس آمن قبل الواجهات المتقدمة. |
| Open Question | ما appetite الزمني لكل Cycle: أسبوعان، أربعة أسابيع، أم ستة أسابيع؟ |

## 2. Strategic Themes

### Theme 1: Trust and Isolation

الهدف: ضمان أن كل عميل يرى بياناته فقط، وأن الداخلي لا يظهر للعميل.

### Theme 2: Deliverable Operating Core

الهدف: جعل المخرج مركز العمل، مرتبطا بالعقد والملفات والتعليقات والحالة.

### Theme 3: Approval and SLA Clarity

الهدف: توثيق التعميد الداخلي واعتماد العميل واحتساب SLA بعدل.

### Theme 4: Usable Workspaces

الهدف: واجهة عميل بسيطة، Kanban داخلي للفريق، Dashboard إداري.

## 3. Now / Next / Later

### Now: Product Foundation and MVP Specs

يدخل في المرحلة الحالية والقريبة:

- اعتماد وثائق `docs/00-product`.
- حسم الأسئلة المفتوحة الحرجة.
- إعداد نموذج التشغيل التالي.
- تحويل المجالات الأساسية إلى Spec Kit بعد الاعتماد.
- إنشاء Docs لبنية المنتج، الأدوار، permissions، lifecycle، SLA، approval.

### Next: MVP Build Cycles

بعد اعتماد التخطيط والSpecs:

- Auth, tenants, roles, permissions.
- clients/contracts/packages.
- deliverables lifecycle.
- SLA pause/resume.
- Kanban الداخلي.
- internal approvals.
- client approvals.
- files/comments.
- dashboards مبسطة.
- اختبارات أمن وصلاحيات وSLA.

### Later: Expansion

بعد نجاح MVP:

- social scheduling.
- advanced analytics.
- AI suggestions أو content generation.
- WhatsApp automation.
- billing/subscriptions.
- mobile apps.
- integrations مع أدوات خارجية.
- advanced reports وBI.

| التصنيف | المعلومة |
| --- | --- |
| Confirmed | social scheduling وAI وbilling المتقدم مؤجلة. |
| Assumed | إعداد Specs يأتي قبل أي كود. |
| Open Question | هل تريد Phase 02 أن تكون نموذج التشغيل أم Spec Kit لأول Feature؟ |

## 4. Shape Up Cycles المقترحة

### Cycle 0: Product and Operating Model Readiness

**الهدف:** تحويل الرؤية إلى نموذج تشغيل واضح قبل التنفيذ.

**المخرجات:**

- اعتماد ملفات Phase 01.
- نموذج تشغيل مخرج end-to-end.
- قرار الأسئلة المفتوحة الحرجة.
- قائمة Features لـSpec Kit.
- Quality gates المعتمدة.

**No-gos:**

- لا تنفيذ كود.
- لا إدخال جدولة سوشيال.
- لا اختيار تقنيات جديدة خارج AGENTS.md.

### Cycle 1: Security Foundation

**الهدف:** تأسيس الهوية والعزل والصلاحيات قبل أي بيانات تشغيلية.

**نطاق عالي المستوى:**

- Auth.
- tenants/clients.
- users.
- roles/permissions.
- basic RLS/server-side isolation.
- Audit Log foundation.

**مؤشر النجاح:**

- مستخدم من عميل A لا يرى عميل B.
- كل جدول عميل لاحق له tenant/client scope في التصميم.

### Cycle 2: Clients, Contracts, Packages, Deliverables

**الهدف:** إدخال الاتفاقات والمخرجات وتشغيلها ككيان أساسي.

**نطاق عالي المستوى:**

- clients.
- contracts/packages.
- deliverable types.
- deliverable creation.
- owner/contributors.
- status/progress logic.

**مؤشر النجاح:**

- يمكن إنشاء عميلين، باقة لكل عميل، و10-20 مخرجا لكل عميل.

### Cycle 3: SLA Core

**الهدف:** جعل SLA جزءا مبكرا من دورة المخرج.

**نطاق عالي المستوى:**

- SLA fields.
- status calculation.
- pause waiting client.
- resume on client changes.
- at-risk/overdue.
- delay owner.
- SLA events.

**مؤشر النجاح:**

- انتظار العميل لا يحسب كتأخير على الفريق.

### Cycle 4: Internal Kanban and Comments

**الهدف:** تمكين الفريق من تشغيل العمل اليومي.

**نطاق عالي المستوى:**

- Kanban board.
- status transitions.
- assigned cards.
- internal comments.
- client comments visibility.
- optimistic UI and rollback.

**مؤشر النجاح:**

- الفريق يدير المخرجات من Kanban دون كشف الداخلي للعميل.

### Cycle 5: Internal Approval and Client Approval

**الهدف:** تثبيت بوابات الجودة والقرار الخارجي.

**نطاق عالي المستوى:**

- submit for internal review.
- internal change request.
- internal approval.
- send to client.
- client approval.
- client change request.
- approval log.

**مؤشر النجاح:**

- لا يصل مخرج للعميل قبل التعميد الداخلي.

### Cycle 6: Files and Versioning

**الهدف:** ربط الملفات بسياق المخرج والعميل والرؤية.

**نطاق عالي المستوى:**

- uploads.
- visibility.
- client files.
- final delivery.
- basic versioning.
- file download permissions.

**مؤشر النجاح:**

- internal file invisible to client، final file visible after approval/delivery.

### Cycle 7: Dashboards and Reporting Basics

**الهدف:** تمكين العميل والإدارة من معرفة الحالة بسرعة.

**نطاق عالي المستوى:**

- client dashboard.
- admin dashboard.
- team dashboard.
- SLA summaries.
- contract progress.
- pending approvals.

**مؤشر النجاح:**

- العميل يعرف ما ينتظر موافقته خلال أقل من دقيقة.

### Cycle 8: QA, Security, Pilot

**الهدف:** تجربة حقيقية مع عملاء حاليين وتحسين المنتج.

**نطاق عالي المستوى:**

- unit tests للمنطق الحساس.
- E2E لمسار المخرج.
- permission tests.
- tenant isolation tests.
- SLA pause/resume tests.
- pilot fixes.
- release checklist.

**مؤشر النجاح:**

- تشغيل عميلين تجريبيين دون تسرب بيانات أو كسر في الاعتماد/SLA.

## 5. خارج الرودماب القريب

- جدولة ونشر السوشيال.
- تكاملات منصات اجتماعية.
- AI content generation.
- advanced CRM.
- advanced billing.
- mobile native app.
- marketplace.
- نسخ BrightBean أو Postiz أو Planka أو استخدامها كقاعدة مباشرة.

## 6. Dependencies and Decisions

قبل التنفيذ:

- اعتماد هذه الوثائق.
- حسم نموذج tenancy.
- حسم صلاحيات مدير الحساب.
- حسم متى يحتسب المخرج ضمن الباقة.
- حسم حدود اعتماد العميل في V1.
- كتابة Spec Kit لكل Feature مع acceptance criteria.

## 7. Roadmap Risks

| الخطر | أثره | تخفيفه |
| --- | --- | --- |
| بناء واجهات قبل العزل | خطر أمني | Cycle 1 أولا |
| تضخم Cycle approval | تأخير MVP | اعتماد/تعديل فقط أولا |
| دخول social scheduling مبكرا | ضياع قلب المنتج | وضعه Later فقط |
| تأجيل SLA | فقدان قيمة أساسية | Cycle 3 مبكر |
| اعتماد الديمو كمنتج نهائي | متطلبات مشوهة | الديمو مرجع UX فقط |

