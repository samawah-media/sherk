# Role Permission Matrix: شريك

**المرحلة:** Phase 03 - Roles, Permissions, Visibility & Delegation Model  
**نوع الوثيقة:** Role x Permission Matrix  
**الحالة:** Draft for owner review  
**آخر تحديث:** 2026-06-22  

## 1. الغرض

هذه المصفوفة تربط كل Permission من `permission-catalog.md` بالأدوار الافتراضية. هي مصفوفة أعمال قابلة للتحويل لاحقا إلى Specs واختبارات، وليست تصميم RBAC/ABAC تقني.

## 2. الرموز

| الرمز | المعنى |
| --- | --- |
| `A` | Allow |
| `D` | Deny |
| `C` | Conditional - يحتاج شرطا موضحا في قسم الشروط |
| `NA` | Not Applicable |

## 3. اختصارات الأدوار

| الرمز | الدور |
| --- | --- |
| PO | Platform Owner |
| PA | Platform Administrator |
| PS | Platform Support |
| TO | Tenant Owner |
| TA | Tenant Administrator |
| EX | الإدارة العليا |
| MM | مدير التسويق |
| PM | مدير المشروع |
| AM | مدير الحساب |
| QR | مراجع الجودة |
| EXEC | أدوار التنفيذ: أخصائي التسويق، كاتب المحتوى، المصمم، الموشن، محلل الأداء، مسؤول النشر، Contributor |
| CA | Client Administrator |
| CAP | Client Approver |
| CR | Client Reviewer / Commenter |
| CV | Client Viewer |

ملاحظة: أدوار التنفيذ السبعة تشترك في صلاحيات baseline واحدة في هذه المصفوفة، ويقيد كل دور بنطاق الإسناد ونوع المخرج. أي فرق نوعي بينها يجب أن يوثق لاحقا في Specs بعد اعتماد المالك.

## 4. شروط Conditional

| الرمز | الشرط |
| --- | --- |
| C1 | داخل Tenant/Client/Deliverable assigned scope فقط |
| C2 | تفويض صريح مؤقت أو دائم بنطاق محدد |
| C3 | دعم أو تحقيق موثق ومؤقت، غالبا بدون محتوى حساس |
| C4 | بعد التعميد الداخلي فقط |
| C5 | إذا كان المستخدم يحمل دورا إضافيا مناسبا، مثل Client Admin + Client Approver |
| C6 | قرار مالك أو إدارة عليا مطلوب لأنه Open Question أو Override |
| C7 | نسخة مبسطة أو خارجية فقط، وليست داخلا كاملا |

## 5. Matrix - المستخدمون والعملاء والعقود

| Permission ID | PO | PA | PS | TO | TA | EX | MM | PM | AM | QR | EXEC | CA | CAP | CR | CV | V1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `PERM.USR.VIEW` | C | C | C3 | A | A | C | C | C | D | D | D | C1 | D | D | D | V1 |
| `PERM.USR.INVITE` | C | C | D | A | A | C | D | C | D | D | D | C5 | D | D | D | V1 |
| `PERM.USR.ROLE_UPDATE` | C | C | D | A | A | C6 | D | D | D | D | D | D | D | D | D | V1 |
| `PERM.USR.SUSPEND` | C | C | D | A | A | C | D | C | D | D | D | C5 | D | D | D | V1 |
| `PERM.USR.REMOVE` | C | C | D | A | A | C | D | D | D | D | D | C5 | D | D | D | V1 |
| `PERM.USR.INVITE_RESEND` | C | C | C3 | A | A | C | D | C | D | D | D | C5 | D | D | D | V1 |
| `PERM.USR.RESPONSIBILITY_TRANSFER` | C | C | D | A | A | C | C | A | C | D | D | D | D | D | D | V1 |
| `PERM.CLIENT.VIEW` | C7 | C7 | C3 | A | A | A | A | A | C1 | C1 | C1 | C1 | C1 | C1 | C1 | V1 |
| `PERM.CLIENT.CREATE` | D | D | D | A | A | C | C | A | D | D | D | D | D | D | D | V1 |
| `PERM.CLIENT.UPDATE` | D | D | D | A | A | C | C | A | C1 | D | D | D | D | D | D | V1 |
| `PERM.CLIENT.ASSIGN_TEAM` | D | D | D | A | A | C | C | A | C1 | D | D | D | D | D | D | V1 |
| `PERM.CLIENT.ARCHIVE` | D | D | D | A | A | A | D | C | D | D | D | D | D | D | D | V1 |
| `PERM.CLIENT.VIEW_ALL_IN_TENANT` | C7 | C7 | D | A | A | A | A | A | C1 | C1 | D | D | D | D | D | V1 |
| `PERM.CONTRACT.VIEW` | C7 | C7 | D | A | A | A | C | A | C1 | D | D | C7 | C7 | C7 | C7 | V1 |
| `PERM.CONTRACT.MANAGE` | D | D | D | A | A | C | C | A | C2 | D | D | D | D | D | D | V1 |
| `PERM.PACKAGE.ITEM_MANAGE` | D | D | D | A | A | C | C | A | D | D | D | D | D | D | D | V1 |
| `PERM.PACKAGE.CREDIT_ADJUST` | D | D | D | A | C | A | D | C2 | D | D | D | D | D | D | D | V1 |
| `PERM.PACKAGE.OUT_OF_SCOPE_CREATE` | D | D | D | A | C | A | C | C | D | D | D | D | D | D | D | V1 |
| `PERM.PACKAGE.OVERAGE_APPROVE` | D | D | D | A | D | A | D | D | D | D | D | D | D | D | D | V1 |
| `PERM.CONTRACT.FINANCIAL_VIEW` | C7 | C7 | D | A | A | A | C | C | D | D | D | C7 | C7 | D | D | V1 |

## 6. Matrix - المخرجات وKanban والمهام

| Permission ID | PO | PA | PS | TO | TA | EX | MM | PM | AM | QR | EXEC | CA | CAP | CR | CV | V1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `PERM.DELIV.CREATE` | D | D | D | A | A | C | A | A | C1 | D | D | D | D | D | D | V1 |
| `PERM.DELIV.VIEW` | C7 | C7 | C3 | A | A | A | A | A | C1 | C1 | C1 | C7 | C7 | C7 | C7 | V1 |
| `PERM.DELIV.UPDATE` | D | D | D | A | A | C | A | A | C1 | D | D | D | D | D | D | V1 |
| `PERM.DELIV.ASSIGN` | D | D | D | A | A | C | A | A | C1 | D | D | D | D | D | D | V1 |
| `PERM.DELIV.START` | D | D | D | A | A | C | A | A | C1 | D | C1 | D | D | D | D | V1 |
| `PERM.DELIV.STATUS_CHANGE` | D | D | D | A | A | C | A | A | C1 | C1 | C1 | D | D | D | D | V1 |
| `PERM.DELIV.SUBMIT_INTERNAL` | D | D | D | A | A | C | A | A | C1 | D | C1 | D | D | D | D | V1 |
| `PERM.DELIV.INTERNAL_CHANGE_REQUEST` | D | D | D | A | A | C | A | A | C2 | A | D | D | D | D | D | V1 |
| `PERM.DELIV.INTERNAL_APPROVE` | D | D | D | A | C | C | A | A | C2 | C2 | D | D | D | D | D | V1 |
| `PERM.DELIV.SEND_CLIENT` | D | D | D | A | C | C | A | A | C4 | D | D | D | D | D | D | V1 |
| `PERM.DELIV.CLIENT_CHANGE_REQUEST` | D | D | D | D | D | D | D | C2 | C2 | D | D | D | A | D | D | V1 |
| `PERM.DELIV.CLIENT_APPROVE` | D | D | D | D | D | D | D | D | D | D | D | C5 | A | D | D | V1 |
| `PERM.DELIV.DELIVER` | D | D | D | A | C | C | A | A | C2 | D | D | D | D | D | D | V1 |
| `PERM.DELIV.CANCEL` | D | D | D | A | C | A | C | A | D | D | D | D | D | D | D | V1 |
| `PERM.DELIV.REOPEN` | D | D | D | A | C | A | C | A | D | D | D | D | D | D | D | V1 |
| `PERM.DELIV.REPLACE` | D | D | D | A | C | A | C | A | D | D | D | D | D | D | D | V1 |
| `PERM.DELIV.OWNER_CHANGE` | D | D | D | A | A | C | A | A | C1 | D | D | D | D | D | D | V1 |
| `PERM.DELIV.DUE_DATE_UPDATE` | D | D | D | A | C | C | A | A | C2 | D | D | D | D | D | D | V1 |
| `PERM.DELIV.SLA_UPDATE` | D | D | D | A | C | A | C | C | D | D | D | D | D | D | D | V1 |
| `PERM.KANBAN.VIEW` | D | D | D | A | A | A | A | A | C1 | C1 | C1 | NA | NA | NA | NA | V1 |
| `PERM.TASK.CREATE` | D | D | D | A | A | C | A | A | C1 | D | C1 | NA | NA | NA | NA | V1 |
| `PERM.KANBAN.MOVE_CARD` | D | D | D | A | A | C | A | A | C1 | C1 | C1 | NA | NA | NA | NA | V1 |
| `PERM.TASK.PRIORITY_UPDATE` | D | D | D | A | A | C | A | A | C1 | D | C1 | NA | NA | NA | NA | V1 |
| `PERM.TASK.ASSIGN_USER` | D | D | D | A | A | C | A | A | C1 | D | C1 | NA | NA | NA | NA | V1 |
| `PERM.TASK.DUE_UPDATE` | D | D | D | A | A | C | A | A | C1 | D | C1 | NA | NA | NA | NA | V1 |
| `PERM.TASK.ARCHIVE_DELETE` | D | D | D | A | A | C | A | A | C2 | D | D | NA | NA | NA | NA | V1 |

## 7. Matrix - التعليقات والملفات

| Permission ID | PO | PA | PS | TO | TA | EX | MM | PM | AM | QR | EXEC | CA | CAP | CR | CV | V1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `PERM.COMMENT.INTERNAL_ADD` | D | D | D | A | A | C | A | A | C1 | A | C1 | D | D | D | D | V1 |
| `PERM.COMMENT.INTERNAL_VIEW` | C7 | C7 | D | A | A | A | A | A | C1 | C1 | C1 | D | D | D | D | V1 |
| `PERM.COMMENT.CLIENT_ADD` | D | D | D | C | C | C | C | C | C1 | D | D | C5 | A | A | D | V1 |
| `PERM.COMMENT.CLIENT_VIEW` | C7 | C7 | C3 | A | A | A | A | A | C1 | C1 | C1 | A | A | A | A | V1 |
| `PERM.COMMENT.EDIT_DELETE` | D | D | D | C | C | C | C | C | C1 | C1 | C1 | C1 | C1 | C1 | D | V1 |
| `PERM.COMMENT.MENTION` | D | D | D | A | A | C | A | A | C1 | C1 | C1 | C1 | C1 | C1 | D | V1 |
| `PERM.COMMENT.RESOLVE` | D | D | D | A | A | C | A | A | C1 | C1 | C1 | D | D | C1 | D | V1 |
| `PERM.FILE.UPLOAD_INTERNAL` | D | D | D | A | A | C | A | A | C1 | C1 | C1 | D | D | D | D | V1 |
| `PERM.FILE.UPLOAD_VERSION` | D | D | D | A | A | C | A | A | C1 | C1 | C1 | D | D | D | D | V1 |
| `PERM.FILE.INTERNAL_VIEW` | C7 | C7 | D | A | A | A | A | A | C1 | C1 | C1 | D | D | D | D | V1 |
| `PERM.FILE.MARK_CLIENT_VISIBLE` | D | D | D | A | C | C | A | A | C4 | D | D | D | D | D | D | V1 |
| `PERM.FILE.MARK_FINAL` | D | D | D | A | C | C | A | A | C2 | D | D | D | D | D | D | V1 |
| `PERM.FILE.DOWNLOAD` | C7 | C7 | C3 | C1 | C1 | C1 | C1 | C1 | C1 | C1 | C1 | C1 | C1 | C1 | C1 | V1 |
| `PERM.FILE.DELETE` | D | D | D | A | A | C | C | A | D | D | D | D | D | D | D | V1 |
| `PERM.FILE.VERSION_HISTORY_VIEW` | C7 | C7 | D | A | A | A | A | A | C1 | C1 | C1 | C7 | C7 | C7 | C7 | V1 |

## 8. Matrix - الاعتمادات وSLA والتقارير

| Permission ID | PO | PA | PS | TO | TA | EX | MM | PM | AM | QR | EXEC | CA | CAP | CR | CV | V1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `PERM.APPROVAL.REQUEST_INTERNAL` | D | D | D | A | A | C | A | A | C1 | D | C1 | D | D | D | D | V1 |
| `PERM.APPROVAL.INTERNAL_GRANT` | D | D | D | A | C | C | A | A | C2 | C2 | D | D | D | D | D | V1 |
| `PERM.APPROVAL.INTERNAL_REVOKE` | D | D | D | A | C | A | A | A | D | D | D | D | D | D | D | V1 |
| `PERM.APPROVAL.SEND_CLIENT` | D | D | D | A | C | C | A | A | C4 | D | D | D | D | D | D | V1 |
| `PERM.APPROVAL.CLIENT_GRANT` | D | D | D | D | D | D | D | D | D | D | D | C5 | A | D | D | V1 |
| `PERM.APPROVAL.CHANGE_REQUEST` | D | D | D | A | C | C | A | A | C1 | A | D | C5 | A | D | D | V1 |
| `PERM.APPROVAL.DELEGATE` | C6 | C6 | D | A | A | C | D | D | D | D | D | C6 | D | D | D | V1 |
| `PERM.APPROVAL.EMERGENCY_OVERRIDE` | C6 | D | D | A | D | A | D | D | D | D | D | D | D | D | D | V1 Restricted |
| `PERM.SLA.VIEW` | C7 | C7 | D | A | A | A | A | A | C1 | C1 | C1 | C7 | C7 | C7 | C7 | V1 |
| `PERM.SLA.TIMER_CONTROL` | D | D | D | A | C | C | C | C | C2 | D | D | D | D | D | D | V1 |
| `PERM.SLA.DUE_DATE_UPDATE` | D | D | D | A | C | A | C | C | D | D | D | D | D | D | D | V1 |
| `PERM.SLA.PAUSE_REASON_UPDATE` | D | D | D | A | C | A | C | C | D | D | D | D | D | D | D | V1 |
| `PERM.SLA.DELAY_OWNER_RECORD` | D | D | D | A | C | A | C | C | C2 | D | D | D | D | D | D | V1 |
| `PERM.SLA.OVERRIDE` | D | D | D | A | D | A | D | D | D | D | D | D | D | D | D | V1 Restricted |
| `PERM.SLA.ESCALATION_CLOSE` | D | D | D | A | C | A | A | A | C2 | D | D | D | D | D | D | V1 |
| `PERM.SLA.ALL_CLIENTS_VIEW` | C7 | C7 | D | A | A | A | A | A | C1 | D | D | D | D | D | D | V1 |
| `PERM.AUDIT.DELIVERABLE_VIEW` | C7 | C7 | D | A | A | A | A | A | C1 | C1 | D | C7 | C7 | C7 | C7 | V1 |
| `PERM.AUDIT.USER_VIEW` | D | D | D | A | A | A | D | D | D | D | D | D | D | D | D | V1 |
| `PERM.AUDIT.CLIENT_VIEW` | C7 | C7 | D | A | A | A | A | A | C1 | D | D | D | D | D | D | V1 |
| `PERM.AUDIT.EXPORT` | D | D | D | A | C | A | D | C2 | D | D | D | D | D | D | D | Open Question |
| `PERM.REPORT.TEAM_VIEW` | C7 | C7 | D | A | A | A | A | A | C1 | D | D | D | D | D | D | V1 |
| `PERM.REPORT.ADMIN_VIEW` | C7 | C7 | D | A | A | A | A | A | C1 | D | D | D | D | D | D | V1 |

## 9. ملاحظات على الصلاحيات المؤجلة

| المجال | القرار |
| --- | --- |
| Platform Support content access | Deferred أو Restricted في V1. |
| Audit export | Open Question بسبب حساسية السجلات. |
| Emergency Override | موجود كمفهوم حوكمة، لكنه Restricted ولا يستخدم كمسار عادي. |
| Multi-approver client approval | Open Question؛ المصفوفة الحالية تدعم صلاحية approver واحدة أو عدة مستخدمين بنفس الدور، لا تدفقا متسلسلا. |

