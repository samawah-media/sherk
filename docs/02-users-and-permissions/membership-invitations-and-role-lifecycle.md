# Membership, Invitations, and Role Lifecycle: شريك

**المرحلة:** Phase 03 - Roles, Permissions, Visibility & Delegation Model  
**نوع الوثيقة:** Membership and Role Lifecycle  
**الحالة:** Draft for owner review  
**آخر تحديث:** 2026-06-22  

## 1. الغرض

هذه الوثيقة تحدد دورة حياة المستخدم من الدعوة حتى مغادرته، وكيف تنقل المسؤوليات دون فقدان Audit Log أو كسر العزل بين Tenants والعملاء.

## 2. دورة حياة المستخدم

| المرحلة | الوصف | صاحب الإجراء | Audit Event | التصنيف |
| --- | --- | --- | --- | --- |
| الدعوة | إنشاء دعوة لمستخدم داخل Tenant أو Client | Tenant Admin/PM/Client Admin conditional | `membership_invited` | Confirmed |
| الدعوة المعلقة | دعوة لم تقبل بعد | النظام/الإدارة | `invitation_pending` اختياري | Assumed |
| انتهاء الدعوة | انتهاء صلاحية الدعوة | النظام/الإدارة | `invitation_expired` | Assumed |
| قبول الدعوة | المستخدم يقبل وينشأ ارتباطه بالنطاق | المستخدم | `invitation_accepted` | Confirmed |
| التعيين على Tenant | منح دور Tenant أو فريق | Tenant Owner/Admin | `tenant_role_assigned` | Confirmed |
| التعيين على Client | ربط مستخدم بعميل محدد | PM/TA/AM conditional | `client_assignment_created` | Confirmed |
| تغيير الدور | تعديل Permission Role | Tenant Owner/Admin | `role_updated` | Confirmed |
| التفويض المؤقت | منح صلاحية مؤقتة | Tenant Admin/Executive/Client Admin conditional | `approval_delegated` | Confirmed |
| تعليق الحساب | منع الدخول مؤقتا | Tenant Admin/PM | `membership_suspended` | Confirmed |
| إلغاء العضوية | إزالة المستخدم من نطاق | Tenant Owner/Admin | `membership_removed` | Confirmed |
| مغادرة الموظف | Offboarding من Tenant | Tenant Admin/PM | `employee_offboarded` | Confirmed |
| نقل ملكية الأعمال | نقل owner للمخرجات والمهام | PM/TA | `responsibility_transferred` | Confirmed |
| الاحتفاظ بسجل النشاط | حفظ Audit history باسم المستخدم السابق | النظام/الإدارة | لا يمحى | Confirmed |

## 3. قواعد الدعوات

| القاعدة | التصنيف |
| --- | --- |
| لا ترسل دعوة دون Scope واضح: Platform/Tenant/Client. | Confirmed |
| الدعوة لا تمنح صلاحية قبل قبولها وتفعيلها. | Confirmed |
| إعادة إرسال الدعوة لا تغير الدور أو النطاق. | Confirmed |
| دعوة مستخدم عميل لا تمنحه أي رؤية قبل ربطه بClient محدد. | Confirmed |
| Client Admin في V1 قد يطلب دعوة بدلا من إنشائها مباشرة، حسب اعتماد المالك. | Open Question |

## 4. تغيير الدور والتفويض

| العملية | الشروط | Audit | التصنيف |
| --- | --- | --- | --- |
| رفع صلاحية مستخدم | لا يرفع المستخدم صلاحية أعلى من صلاحية الفاعل؛ سبب مطلوب | `role_updated` | Confirmed |
| خفض صلاحية مستخدم | يجب ألا يترك مخرجات بلا owner | `role_updated` | Confirmed |
| تفويض مؤقت | نطاق ومدة وسبب؛ ينتهي تلقائيا | `approval_delegated` | Confirmed |
| إلغاء تفويض | سبب أو انتهاء مدة | `delegation_revoked` | Confirmed |
| تعارض أدوار | يمنع أو يرفع للمالك حسب التعارض | `role_conflict_detected` | Assumed |

## 5. مغادرة الموظف

عند مغادرة موظف من سماوة أو أي Tenant:

1. تعليق الوصول أولا.
2. استخراج قائمة المخرجات المفتوحة والمهام والملفات التي يملكها.
3. نقل owner لكل مخرج نشط.
4. نقل أو إغلاق التفويضات المؤقتة.
5. الاحتفاظ بكل Audit Events باسم المستخدم السابق.
6. منع حذف التعليقات أو الملفات التي تؤثر على سجل القرار.

| القاعدة | التصنيف |
| --- | --- |
| لا يعطل مستخدم له مخرجات مفتوحة دون خطة نقل مسؤوليات. | Confirmed |
| مغادرة المستخدم لا تمحو تاريخ قراراته. | Confirmed |
| المخرجات المفتوحة يجب أن يكون لها Owner جديد قبل نهاية offboarding. | Confirmed |

## 6. حالات واقعية

| # | Actor | Role | Scope | Requested Action | Expected Decision | Reason | Audit Event |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | مدير حساب | `account_manager` | Client A + Client B | عرض ومتابعة مخرجات العميلين | Allow | له assignment على العميلين داخل نفس Tenant | `client_assignment_created` سابقا، ثم activity عادي |
| 2 | مصمم | `designer` | Client A فقط | فتح مخرج Client B | Deny | ليس مسندا للعميل B | `access_denied_unassigned_client` |
| 3 | معتمد من العميل A | `client_approver` | Client A | فتح رابط Client B | Deny | cross-client isolation | `access_denied_cross_client` |
| 4 | كاتب محتوى | `content_writer` | Deliverable assigned | رفع نسخة وإرسال للمراجعة | Allow | إجراء تنفيذي ضمن النطاق | `file_uploaded`, `submitted_for_internal_review` |
| 5 | مدير تسويق | `marketing_manager` | Client assigned | طلب تعديل داخلي ثم تعميد نسخة جديدة | Allow | يملك سلطة مراجعة وتعميد | `internal_change_requested`, `internal_approval_granted` |
| 6 | مدير حساب | `account_manager` | Client assigned | اعتماد داخلي دون تفويض | Deny | Confirmed أنه لا يعتمد نهائيا إلا بصلاحية صريحة | `internal_approval_denied` |
| 7 | جهة عميل لديها Viewer وReviewer وApprover | Client roles | Client A | Viewer يشاهد، Reviewer يعلق، Approver يعتمد | Conditional by role | كل فعل حسب دور منفصل | `client_comment_added`, `client_approval_granted` |
| 8 | موظف في إجازة | owner + delegate | Deliverables assigned | تفويض مهامه مؤقتا | Allow with conditions | التفويض مؤقت ومحدود ولا يتجاوز الأصل | `approval_delegated` |
| 9 | موظف غادر سماوة | former execution user | Open deliverables | تعطيل العضوية | Conditional | يجب نقل owner أولا | `responsibility_transferred`, `membership_suspended` |
| 10 | مدير | PM/Executive | SLA أو Package | تعديل SLA أو رصيد الباقة | Conditional | إجراء حساس يحتاج سبب وتأكيد | `sla_due_date_updated` أو `package_credit_adjusted` |
| 11 | حساب عميل | `client_viewer` أو `client_approver` | Client A | مشاهدة تعليق داخلي | Deny | internal_comment لا يظهر للعميل | `access_denied_internal_comment` |
| 12 | مستخدم من Tenant آخر | أي دور داخل Tenant B | Tenant B | فتح بيانات Tenant A | Deny | cross-tenant isolation | `access_denied_cross_tenant` |

## 7. حالات الدعوة والقبول

| الحالة | القرار المتوقع | السبب | التصنيف |
| --- | --- | --- | --- |
| دعوة Client Approver دون تحديد Client | Deny | لا Scope واضح | Confirmed |
| دعوة مستخدم بفريق تنفيذ دون دور أو Scope | Deny | لا صلاحية غير محددة | Confirmed |
| إعادة إرسال دعوة منتهية | Conditional | يسمح إذا لم توجد سياسة حظر | Assumed |
| قبول دعوة مستخدم ثم تغيير الدور مباشرة | Allow with audit | قد يكون تصحيحا إداريا | Assumed |
| Client Admin يدعو مستخدما كApprover | Open | يحتاج قرار هل Client Admin self-service في V1 | Open Question |

## 8. Business Rules

| ID | القاعدة | التصنيف |
| --- | --- | --- |
| BR-MRL-01 | كل عضوية مرتبطة بنطاق واضح. | Confirmed |
| BR-MRL-02 | لا حذف لسجل نشاط مستخدم بعد مغادرته. | Confirmed |
| BR-MRL-03 | نقل المسؤوليات شرط قبل تعطيل مستخدم يملك مخرجات مفتوحة. | Confirmed |
| BR-MRL-04 | التفويض المؤقت لا يتجاوز صلاحيات المفوض الأصلي. | Confirmed |
| BR-MRL-05 | Client Admin self-service يبقى Open Question. | Open Question |

