# Admin and Platform Permissions: شريك

**المرحلة:** Phase 03 - Roles, Permissions, Visibility & Delegation Model  
**نوع الوثيقة:** Admin and Platform Permissions  
**الحالة:** Draft for owner review  
**آخر تحديث:** 2026-06-22  

## 1. الغرض

هذه الوثيقة تفصل صلاحيات الإدارة داخل Tenant وصلاحيات Platform خارج Tenant. الهدف هو منع تحول "Admin" إلى صلاحية غير محددة تسمح برؤية أو تعديل كل شيء بلا شروط.

| التصنيف | النقطة |
| --- | --- |
| Confirmed | الإدارة ترى العملاء المصرح بهم والمخرجات وSLA والتعميدات. |
| Confirmed | الإدارة لا تعتمد باسم العميل. |
| Confirmed | كل إجراء تعديل صلاحيات أو SLA أو باقة أو اعتماد يحتاج Audit Event. |
| Open Question | هل يوجد Super Admin كامل في V1 أم يقتصر على مالك المنصة خارج تجربة سماوة؟ |

## 2. مستويات الإدارة

| المستوى | الأدوار | النطاق | الغرض |
| --- | --- | --- | --- |
| Platform Governance | Platform Owner, Platform Administrator | Platform | إدارة Tenants والحوكمة والدعم المحدود |
| Tenant Governance | Tenant Owner, Tenant Administrator | Tenant | إدارة الوكالة ومستخدميها وعملائها |
| Executive Control | الإدارة العليا | Tenant / Portfolio | حسم الاستثناءات والتجاوزات الحساسة |
| Operational Management | Marketing Manager, Project Manager | Client / Deliverable | تشغيل ومراجعة وتعميد وتسليم |
| Account Coordination | Account Manager | Client / Contract | تنسيق العميل والإرسال بعد التعميد إذا مخول |
| Quality Authority | Quality Reviewer | Deliverable / Type | مراجعة جودة وتعميد أو تعديل حسب التفويض |

## 3. صلاحيات الإدارة داخل Tenant

| الإجراء | Tenant Owner | Tenant Admin | Executive | Marketing Manager | Project Manager | Account Manager | Quality Reviewer | التصنيف |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| إدارة مستخدمي Tenant | Allow | Allow | Conditional | Deny | Conditional | Deny | Deny | Assumed |
| إنشاء عميل | Allow | Allow | Conditional | Conditional | Allow | Deny/Conditional | Deny | Confirmed |
| تعديل بيانات عميل | Allow | Allow | Conditional | Conditional | Allow | Conditional | Deny | Confirmed |
| إنشاء عقد/باقة | Allow | Allow | Conditional | Conditional | Allow | Deny/Conditional | Deny | Confirmed |
| تعديل رصيد باقة | Allow | Conditional | Allow | Deny/Conditional | Conditional | Deny | Deny | Confirmed |
| إنشاء مخرج | Allow | Allow | Conditional | Allow | Allow | Conditional | Deny | Confirmed |
| إسناد فريق | Allow | Allow | Conditional | Allow | Allow | Conditional | Deny | Confirmed |
| طلب تعديل داخلي | Allow | Allow | Conditional | Allow | Allow | Deny/Conditional | Allow | Confirmed |
| التعميد الداخلي | Allow | Conditional | Conditional | Allow | Allow | Deny/Conditional | Conditional | Confirmed |
| إرسال للعميل | Allow | Conditional | Conditional | Allow | Allow | Conditional | Deny | Confirmed |
| التسليم النهائي | Allow | Conditional | Conditional | Allow | Allow | Conditional | Deny | Confirmed |
| تعديل SLA | Allow | Conditional | Allow | Conditional | Conditional | Deny/Conditional | Deny | Confirmed |
| تصدير Audit Logs | Conditional | Conditional | Allow | Deny/Conditional | Conditional | Deny | Deny | Open Question |

## 4. صلاحيات Platform

| الإجراء | Platform Owner | Platform Administrator | Platform Support | الشروط | التصنيف |
| --- | --- | --- | --- | --- | --- |
| إنشاء Tenant | Conditional | Conditional | Deny | إذا قرر المالك تجربة أكثر من Tenant | Open Question |
| تعطيل Tenant | Conditional | Deny/Conditional | Deny | قرار مالك، أثر بيانات، إشعار | Open Question |
| إدارة إعدادات Platform | Allow | Conditional | Deny | دون دخول محتوى العملاء | Assumed |
| مشاهدة مؤشرات صحية عامة | Allow | Allow | Conditional | بدون محتوى حساس | Assumed |
| دخول محتوى Tenant | Conditional | Conditional | Deny افتراضيا | support session موثق أو تحقيق أمني | Assumed |
| دعم دعوات أو دخول مستخدم | Conditional | Conditional | Conditional | لا يكشف ملفات أو تعليقات | Assumed |
| Emergency Platform Override | Conditional | Deny/Conditional | Deny | سبب، موافقة، مراجعة لاحقة | Open Question |

## 5. إجراءات حساسة تحتاج تأكيدا إضافيا

| الإجراء | سبب الحساسية | من يملك؟ | Audit Event |
| --- | --- | --- | --- |
| تعديل دور مستخدم | تصعيد صلاحيات | Tenant Owner/Admin | `role_updated` |
| تعطيل مستخدم له مخرجات مفتوحة | خطر ضياع ملكية | Tenant Admin/PM | `membership_suspended`, `responsibility_transferred` |
| تعديل رصيد الباقة | أثر عقدي ومالي | Executive/Tenant Owner | `package_credit_adjusted` |
| تجاوز الباقة | عمل خارج الاتفاق | Executive/Tenant Owner | `package_overage_approved` |
| تعديل SLA | أثر تقارير ومسؤولية تأخير | PM/MM/Executive | `sla_due_date_updated` |
| تغيير delay owner | أثر مساءلة | PM/MM/Executive | `sla_delay_owner_recorded` |
| سحب تعميد | أثر جودة وإرسال | PM/MM/Executive | `internal_approval_revoked` |
| Emergency Override | كسر مسار عادي | Executive/Tenant Owner | `emergency_override_used` |

## 6. حدود المديرين

| الدور | الحدود |
| --- | --- |
| Marketing Manager | لا يعدل بيانات مالية حساسة إلا بتفويض؛ لا يعتمد باسم العميل. |
| Project Manager | لا يكسر التعميد الداخلي؛ لا يرسل للعميل قبل الاعتماد الداخلي. |
| Account Manager | يرى فقط عملاءه المسندين؛ يرسل للعميل بعد التعميد فقط إذا خول؛ لا يعتمد نهائيا. |
| Quality Reviewer | يراجع الجودة ولا يغير العقود أو SLA أو الرصيد. |
| Executive Management | يحسم الاستثناءات، لكن لا يلغي الحاجة إلى Audit Log. |

## 7. Business Rules

| ID | القاعدة | التصنيف |
| --- | --- | --- |
| BR-AP-01 | لا توجد صلاحية "إدارة كل شيء" دون تفصيل إجراءات. | Confirmed |
| BR-AP-02 | Platform roles لا تعني content access افتراضيا. | Assumed |
| BR-AP-03 | Tenant Admin لا يتجاوز Tenant الخاص به. | Confirmed |
| BR-AP-04 | Account Manager scoped على عملائه المسندين. | Confirmed |
| BR-AP-05 | كل تعديل صلاحيات أو SLA أو باقة أو اعتماد يحتاج Audit Event. | Confirmed |
| BR-AP-06 | Emergency Override استثناء لا مسار عمل عادي. | Confirmed |

