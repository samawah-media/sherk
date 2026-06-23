# Screen Inventory: شريك

**المرحلة:** Phase 05 - Information Architecture, UX Model & Role-Based User Flows  
**نوع الوثيقة:** Screen Inventory  
**الحالة:** Draft for owner review  
**آخر تحديث:** 2026-06-23  

## 1. الغرض

جرد شاشات V1 وربط كل شاشة بدور وصلاحية وScope، بدون تحويلها إلى Specs تنفيذية.

## 2. Client Portal Screens

| ID | الشاشة | الدور | Scope | Primary Action | Permissions | حالات أساسية |
| --- | --- | --- | --- | --- | --- | --- |
| CP-01 | تسجيل الدخول | Client Users | User | دخول عادي | Membership active | Session expired, invalid login |
| CP-02 | الرئيسية | كل أدوار العميل | Client | فتح الموافقات/الملفات | PERM.CLIENT.VIEW | Loading, empty approvals |
| CP-03 | بانتظار موافقتي | Approver/Reviewer/Viewer limited | Client/Deliverable | اعتماد/طلب تعديل | PERM.APPROVAL.CLIENT_GRANT | no approvals, permission denied |
| CP-04 | Bulk Approval Review | Client Approver | Client/Approval | اعتماد المحدد | PERM.APPROVAL.CLIENT_GRANT | mixed invalid selection |
| CP-05 | تفاصيل مخرج العميل | Client roles | Deliverable | مراجعة النسخة | PERM.DELIV.VIEW | version superseded |
| CP-06 | طلب تعديل | Client Approver | Approval | إرسال ملاحظة حرة | PERM.APPROVAL.CHANGE_REQUEST | empty comment, save failed |
| CP-07 | تأكيد الاعتماد | Client Approver | Approval | تأكيد القرار | PERM.APPROVAL.CLIENT_GRANT | already completed |
| CP-08 | العقد والمتابعة | Client roles | Client/Contract | مراجعة المتبقي | PERM.CONTRACT.VIEW | no active contract |
| CP-09 | الملفات | Client roles | File | معاينة/تنزيل | PERM.FILE.DOWNLOAD | no files, unsupported preview |
| CP-10 | تفاصيل ملف/تقرير | Client roles | File | تنزيل أو تعليق | PERM.FILE.DOWNLOAD | not found, permission denied |
| CP-11 | الإعدادات | Client Admin/User | Client/User | إدارة إشعارات/دعوات | PERM.USR.INVITE conditional | no permission |
| CP-12 | الإشعارات | Client roles | Client/User | فتح إشعار | scoped view | no notifications |

## 3. Team Workspace Screens

| ID | الشاشة | الدور | Scope | Primary Action | Permissions | حالات أساسية |
| --- | --- | --- | --- | --- | --- | --- |
| TW-01 | مهامي | Execution roles | User/Deliverable | بدء/فتح عمل | PERM.DELIV.VIEW | empty tasks |
| TW-02 | لوحة العمل | Team/AM/PM | Client/Team | نقل كارت | PERM.KANBAN.MOVE_CARD | invalid transition, rollback |
| TW-03 | قائمة المخرجات | Team/AM | Client/Deliverable | بحث وفتح | PERM.DELIV.VIEW | no results |
| TW-04 | تفاصيل مخرج داخلي | Team/AM | Deliverable | رفع/تعليق/مراجعة | multiple | internal/client visibility split |
| TW-05 | رفع نسخة | Team/AM | File/Deliverable | رفع داخلي | PERM.FILE.UPLOAD_VERSION | upload failed, file too large |
| TW-06 | التعليقات الداخلية | Team/AM | Comment | تعليق داخلي | PERM.COMMENT.INTERNAL_ADD | save failed |
| TW-07 | طلب مراجعة داخلية | Owner/Contributor | Approval | إرسال للمراجعة | PERM.APPROVAL.REQUEST_INTERNAL | missing version |
| TW-08 | الملفات | Team/AM | File | معاينة/تنزيل | PERM.FILE.INTERNAL_VIEW | unsupported file |
| TW-09 | الإشعارات | Team/AM | User | فتح سياق | scoped view | no notifications |
| TW-10 | البحث العام | Team/AM | Scoped resources | فتح نتيجة | scoped permissions | no results |

## 4. Management Console Screens

| ID | الشاشة | الدور | Scope | Primary Action | Permissions | حالات أساسية |
| --- | --- | --- | --- | --- | --- | --- |
| MC-01 | نظرة عامة | Management | Tenant/Portfolio | فتح اختناق | PERM.SLA.ALL_CLIENTS_VIEW | loading, no data |
| MC-02 | العملاء | PM/Admin | Tenant/Client | فتح/إضافة عميل | PERM.CLIENT.VIEW/CREATE | no clients |
| MC-03 | تفاصيل العميل | PM/AM | Client | متابعة العميل | PERM.CLIENT.VIEW | archived client |
| MC-04 | العقود والباقات | PM/Executive | Client/Contract | إدارة المتبقي | PERM.CONTRACT.VIEW | expired contract |
| MC-05 | إنشاء مخرج | PM/AM conditional | Client/Contract | إنشاء | PERM.DELIV.CREATE | package exhausted |
| MC-06 | المخرجات | Management/AM | Portfolio | بحث/فلترة | PERM.DELIV.VIEW | no results |
| MC-07 | تفاصيل مخرج إداري | Management/AM | Deliverable | تعميد/إرسال/تسليم | approvals perms | invalid state |
| MC-08 | مراجعة داخلية | PM/MM/QR | Approval | تعميد أو تعديل | PERM.APPROVAL.INTERNAL_GRANT | maker/checker conflict |
| MC-09 | إرسال للعميل | PM/MM/AM conditional | Deliverable | إرسال | PERM.APPROVAL.SEND_CLIENT | not internally approved |
| MC-10 | التسليم النهائي | PM/MM/AM conditional | Deliverable/File | تسليم | PERM.DELIV.DELIVER | missing final asset |
| MC-11 | Kanban إداري | Management | Tenant/Client | نقل/فتح | PERM.KANBAN.MOVE_CARD | rollback |
| MC-12 | SLA والجودة | Management | Tenant | تصعيد/إعادة إسناد | PERM.SLA.* | SLA changed |
| MC-13 | الفريق | Management | Tenant/User | نقل مسؤوليات | PERM.USR.RESPONSIBILITY_TRANSFER | user removed |
| MC-14 | الملفات | Management/AM | File | Mark Visible/Final | PERM.FILE.MARK_* | internal leak risk |
| MC-15 | التقارير الإدارية | Management | Tenant | فلترة/عرض | PERM.REPORT.ADMIN_VIEW | no data |
| MC-16 | Activity Feed | Management/AM | Scope | فلترة سجل | PERM.AUDIT.* | no results |
| MC-17 | الإعدادات | Tenant Admin/Owner | Tenant | أدوار/دعوات | PERM.USR.* | permission denied |
| MC-18 | البحث العام | Management/AM | Tenant/Portfolio | فتح نتيجة | scoped permissions | no results |

## 5. Platform Administration Screens

| ID | الشاشة | الدور | Scope | Primary Action | قيود |
| --- | --- | --- | --- | --- |
| PA-01 | Tenants | Platform Owner/Admin | Platform | إدارة Tenant | لا محتوى عملاء روتيني |
| PA-02 | Platform Users | Platform Owner/Admin | Platform | إدارة أدوار المنصة | Audit إلزامي |
| PA-03 | Support Sessions | Platform Owner/Admin | Restricted | فتح جلسة دعم | سبب، مدة، موافقة |
| PA-04 | Platform Health | Platform Admin | Platform | مراجعة مؤشرات | لا ملفات/تعليقات |

## 6. Screen Count

| التجربة | العدد |
| --- | --- |
| Client Portal | 12 |
| Team Workspace | 10 |
| Management Console | 18 |
| Platform Administration | 4 |
| الإجمالي التخطيطي | 44 |

## 7. شاشات مؤجلة أو ليست V1

| الشاشة | السبب |
| --- | --- |
| Bulk Deliverable Creation | المالك أكد أنها غير مطلوبة في V1. |
| White Label Setup | مؤجل. |
| Social Scheduling Calendar | خارج V1. |
| WhatsApp Automation Settings | خارج V1. |
| Advanced Billing | خارج V1. |
| Sequential Approval Builder | اعتماد متسلسل مؤجل/Open Question. |
