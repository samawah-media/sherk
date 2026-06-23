# UX Traceability Matrix: شريك

**المرحلة:** Phase 05 - Information Architecture, UX Model & Role-Based User Flows  
**نوع الوثيقة:** UX Traceability Matrix  
**الحالة:** Draft for owner review  
**آخر تحديث:** 2026-06-23  

## 1. الغرض

ربط متطلبات المنتج والأدوار وقواعد التشغيل والصلاحيات والمجال بالشاشات والرحلات وحالات الخطأ.

## 2. Matrix

| Product Requirement | Persona / Role | JTBD | Operating Rule | Permission ID | Domain Entity | User Flow | Screen ID | Primary Action | Error State | Accessibility | V1/Later | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Multi-Tenant Isolation | كل الأدوار | رؤية النطاق الصحيح | Tenant=agency | PERM.CLIENT.VIEW scoped | Tenant/Client | Access denied | كل الشاشات | عرض داخل scope | Permission Denied | نص لا يكشف بيانات | V1 | Confirmed |
| Client Isolation | Client User | عدم رؤية عميل آخر | Client scope | PERM.DELIV.VIEW | Client Membership | فتح رابط خاطئ | CP-* | Deny | Permission Denied | رسالة عامة | V1 | Confirmed |
| Deliverable Creation | PM/AM | إدخال العمل المتفق عليه | حجز عند الإنشاء | PERM.DELIV.CREATE | Deliverable | إنشاء مخرج | MC-05 | حفظ | Package exhausted | حقول واضحة | V1 | Confirmed |
| Internal Work | Team | تنفيذ المخرج الصحيح | Task داخلي | PERM.DELIV.START | Task/Deliverable | مهامي | TW-01 | بدء | Missing owner | أزرار واضحة | V1 | Confirmed |
| Kanban | Team/Admin | متابعة الحالة | لا تجاوز للبوابات | PERM.KANBAN.MOVE_CARD | Card/Deliverable | نقل كارت | TW-02/MC-11 | Move | Invalid transition | بديل قائمة | V1 | Confirmed |
| Internal Comments | Team/Admin | نقاش داخلي | لا يظهر للعميل | PERM.COMMENT.INTERNAL_ADD | Comment | تعليق داخلي | TW-06/MC-07 | إضافة | Save failed | label واضح | V1 | Confirmed |
| Internal Approval | PM/MM/QR | حماية الجودة | قبل العميل | PERM.APPROVAL.INTERNAL_GRANT | Approval Cycle | تعميد | MC-08 | اعتماد | maker conflict | تأكيد | V1 | Confirmed |
| Client Approval | Client Approver | قرار سريع | نسخة مرسلة | PERM.APPROVAL.CLIENT_GRANT | Client Approval | اعتماد | CP-03/07 | اعتماد | Superseded | زر واضح | V1 | Confirmed |
| Bulk Approval | Client Approver | اعتماد سريع | نفس العميل والنسخ صالحة | PERM.APPROVAL.CLIENT_GRANT | Approval Cycle | Bulk Approval | CP-04 | اعتماد المحدد | mixed invalid | مراجعة قائمة | V1 | Confirmed |
| SLA Pause/Resume | PM/Client | عدالة الوقت | pause waiting client | PERM.SLA.VIEW | SLA Timeline | قرار العميل | CP-03/MC-12 | عرض/تحديث | SLA changed | لا لون فقط | V1 | Confirmed |
| Package Reservation | PM | ضبط المتبقي | reserve/consume | PERM.CONTRACT.VIEW | Usage Ledger | عقد وباقة | CP-08/MC-04 | عرض | Contract expired | progress text | V1 | Confirmed |
| File Visibility | All | ملف صحيح | visibility scoped | PERM.FILE.DOWNLOAD/MARK | File Asset | ملفات | CP-09/TW-08/MC-14 | معاينة | unsupported | fallback | V1 | Confirmed |
| Reports in Files | Client | قراءة التقرير | report_file | PERM.FILE.DOWNLOAD | File Asset | تقرير جديد | CP-10/12 | فتح | not found | إشعار واضح | V1 | Confirmed |
| Contract Follow-up | Client | معرفة المتبقي | ملخص فقط | PERM.CONTRACT.VIEW | Contract/Package | متابعة | CP-08 | عرض | no contract | responsive | V1 | Confirmed |
| Reopening | Client/PM | طلب متابعة | لا فتح ذاتي | PERM.DELIV.REOPEN | Deliverable | طلب متابعة | CP-05/MC-07 | طلب/فتح | invalid state | تأكيد | V1 | Assumed |
| Cancellation | PM | إلغاء موثق | release reservation | PERM.DELIV.CANCEL | Deliverable/Ledger | إلغاء | MC-07 | إلغاء | no reason | dialog | V1 | Confirmed |
| Extra Deliverables | PM/Executive | عمل خارج الباقة | استثناء موثق | PERM.PACKAGE.OUT_OF_SCOPE_CREATE | Deliverable | مخرج إضافي | MC-05 | إنشاء | package exhausted | نص واضح | V1 | Assumed |
| Membership Invitation | Client Admin/Admin | دعوة مستخدم | scope واضح | PERM.USR.INVITE | Membership | دعوة | CP-11/MC-17 | دعوة | expired | form errors | V1 | Confirmed |
| Temporary Delegation | Admin | تغطية غياب | مدة وسبب | PERM.APPROVAL.DELEGATE | Delegation | تفويض | MC-17 | تفويض | open-ended | confirmation | V1 | Confirmed |
| Audit Trail | Management | مراجعة القرار | كل قرار حساس | PERM.AUDIT.* | Audit Event | Activity Feed | MC-16 | فلترة | no results | table readable | V1 | Confirmed |
| Global Search | Team/Admin | إيجاد سريع | scoped results | Multiple | Read Models | بحث | TW-10/MC-18 | فتح نتيجة | no results | keyboard | V1 | Confirmed |
| Mobile Support | All | العمل من الجوال | responsive | N/A | UI | عدة رحلات | CP/TW/MC | actions | overflow | touch targets | V1 | Confirmed |
| White Label | Platform | تخصيص | مؤجل | N/A | Platform | N/A | N/A | N/A | N/A | N/A | Later | Confirmed |
| Bulk Deliverable Creation | PM | إدخال جماعي | غير مطلوب | N/A | Deliverable | N/A | N/A | N/A | N/A | N/A | Later | Confirmed |

## 3. Coverage Assessment

| المجال | التغطية |
| --- | --- |
| بوابة العميل | مغطاة بالتابات الخمسة والرحلات الأساسية. |
| الفريق | مغطى بالمهام، Kanban، الملفات، الإشعارات، البحث. |
| الإدارة | مغطاة بالعملاء، المخرجات، SLA، الفريق، العقود، الملفات. |
| Platform Admin | مغطى كحوكمة محدودة. |
| Accessibility | مغطى كمتطلبات تخطيطية، يحتاج اختبار لاحقا. |
