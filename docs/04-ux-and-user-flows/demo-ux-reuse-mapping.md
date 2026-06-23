# Demo UX Reuse Mapping: شريك

**المرحلة:** Phase 05 - Information Architecture, UX Model & Role-Based User Flows  
**نوع الوثيقة:** Demo UX Reuse Mapping  
**الحالة:** Draft for owner review  
**آخر تحديث:** 2026-06-23  

## 1. الغرض

فحص كود الديمو والتصميمات الحالية كمرجع UX فقط، دون تعديلها ودون اعتبارها مصدر حقيقة للمتطلبات.

## 2. Matrix

| Screen / Component | Current Purpose | Target Role | Product Fit | UX Quality | Accessibility Risk | RTL Readiness | التصنيف | Reason | Licensing Concern |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| App role switcher | تبديل بين العميل والفريق والإدارة | Demo only | جيد كشرح | جيد | منخفض | جيد | Adapt | في المنتج الحقيقي الأدوار من الصلاحيات لا زر تبديل. | لا |
| Client sidebar | تابات العميل | Client | مناسب | جيد | متوسط | جيد | Preserve with changes | يطابق التابات الخمسة تقريبا. | لا |
| Client home cards | ملخص الحالة | Client | مناسب | متوسط | منخفض | جيد | Adapt | اختصر النصوص وأزل المالية المتقدمة. | لا |
| Approvals cards | اعتماد/تعديل | Client Approver | مناسب | جيد | متوسط | جيد | Adapt | أضف تأكيد نسخة وBulk Approval. | لا |
| Contract follow-up | تقدم الباقة | Client | مناسب جزئيا | متوسط | منخفض | جيد | Adapt | لا تعرض ماليات حساسة في V1. | لا |
| Files grid | مكتبة ملفات | Client/Team/Admin | مناسب | جيد | متوسط | جيد | Preserve with changes | أضف visibility وأنواع التقرير. | لا |
| Settings | جهات الاعتماد والإشعارات | Client Admin | مناسب جزئيا | متوسط | متوسط | جيد | Adapt | أزل واتساب، أدخل طلب/دعوة مستخدم. | لا |
| Team tasks | مهامي | Team | مناسب | جيد | منخفض | جيد | Preserve with changes | نبرة أبسط وأقل عبارات زخرفية. | لا |
| Team Kanban | تشغيل داخلي | Team | مناسب | متوسط | عالي | جيد | Rebuild | DnD يحتاج قواعد وانتقالات وبديل Accessible. | لا |
| Team list filters | جدول مخرجات | Team/Admin | مناسب | جيد | منخفض | جيد | Preserve with changes | يدعم البحث والفلاتر. | لا |
| Admin dashboard | مؤشرات الإدارة | Management | مناسب | متوسط | متوسط | جيد | Adapt | أزل العبارات المبالغة والمالية المتقدمة. | لا |
| Admin send directly | إرسال مباشر/تجاوز | Management | خطر | ضعيف | متوسط | جيد | Remove | يكسر قاعدة لا إرسال قبل التعميد. | لا |
| Deliverable drawer | تفاصيل المخرج | All roles | عالي | جيد | متوسط | جيد | Preserve with changes | أفضل نمط مركزي، مع فصل تبويبات العميل. | لا |
| Quality checklist | مراجعة داخلية | Management/Team | مناسب | جيد | منخفض | جيد | Adapt | لا تظهر للعميل أبدا. | لا |
| Comment toggle internal | فصل التعليقات | Team/Admin | عالي | جيد | متوسط | جيد | Preserve with changes | اجعل الداخلي افتراضيا لسماوة. | لا |
| File drawer | تفاصيل ملف | All roles | مناسب | متوسط | متوسط | جيد | Adapt | يحتاج معاينات حقيقية وfallback. | لا |
| Status badges | عرض الحالة | All | مناسب | جيد | متوسط | جيد | Preserve with changes | لا تعتمد على اللون فقط. | لا |
| Progress bars | تقدم | All | مناسب | متوسط | منخفض | جيد | Adapt | يشتق من الحالة. | لا |
| WhatsApp/Slack settings | تكاملات | Admin | خارج V1 | متوسط | منخفض | جيد | Remove | خارج النطاق. | لا |
| White Label settings | تخصيص | Platform/Admin | مؤجل | متوسط | منخفض | جيد | Remove | المالك أجل White Label. | لا |

## 3. Preserve

- Sidebar role-specific.
- Drawer للتفاصيل.
- Cards مع badges.
- Files grid.
- Comments separation.
- Filters and tables.

## 4. Adapt

- لغة الواجهة إلى سعودية ودودة وعملية.
- SLA للعميل بشكل مبسط.
- العقد والمتابعة بدون مالية متقدمة.
- الإعدادات لإدارة الدعوات والإشعارات داخل التطبيق.
- File Drawer لدعم كل الأنواع مع fallback.

## 5. Rebuild

- Drag/drop logic.
- Approval confirmation.
- إرسال للعميل.
- حالة الملفات والرؤية.
- Activity Feed بالفلاتر.

## 6. Remove

- تجاوز التعميد الداخلي.
- WhatsApp/Slack automation.
- White Label في V1.
- عبارات social publishing والنشر المباشر.
- أي نص يوحي بأن شريك منصة جدولة سوشيال.
