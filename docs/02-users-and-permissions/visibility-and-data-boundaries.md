# Visibility and Data Boundaries: شريك

**المرحلة:** Phase 03 - Roles, Permissions, Visibility & Delegation Model  
**نوع الوثيقة:** Visibility and Data Boundaries  
**الحالة:** Draft for owner review  
**آخر تحديث:** 2026-06-22  

## 1. الغرض

هذه الوثيقة تحدد من يرى كل نوع بيانات داخل شريك. الهدف هو تثبيت حدود الرؤية قبل نموذج البيانات أو Specs، خصوصا أن شريك SaaS متعدد Tenants والعميل لا يجب أن يرى أي محتوى داخلي أو بيانات عميل آخر.

## 2. مستويات الرؤية

| المستوى | المعنى | أمثلة |
| --- | --- | --- |
| Internal Only | يظهر لفريق Tenant والإدارة المصرح لهم فقط | تعليقات داخلية، ملفات عمل، Checklist |
| Management Only | يظهر للإدارة أو من يفوض لها فقط | بيانات مالية، صلاحيات، تقارير أداء الفريق |
| Client Visible | يظهر للعميل بعد تحقق visibility والنطاق | مخرج مرسل، تعليق عميل، ملف client_visible |
| Client Final Only | يظهر للعميل عند التسليم أو بعد تحديد نسخة نهائية | final_delivery |
| Restricted | يحتاج تفويض خاص وسبب | Audit export، support access، override |
| Audit Only | يظهر كسجل تدقيق لا كمحتوى تشغيل | أحداث صلاحيات، محاولات منع، قرارات حساسة |

## 3. حدود البيانات

| نوع البيانات | من يراه؟ | من لا يراه؟ | مستوى الرؤية | التصنيف |
| --- | --- | --- | --- | --- |
| بيانات Tenant آخر | Platform roles فقط بإدارة محدودة، وليس محتوى | أي Tenant أو Client آخر | Restricted | Confirmed |
| عميل آخر داخل نفس Tenant | الإدارة ذات النطاق، وليس Client users | مستخدمو العميل الآخر والفريق غير المسند | Restricted | Confirmed |
| بيانات العميل الأساسية | إدارة Tenant، AM، الفريق المسند، مستخدمو العميل ضمن نطاقهم | غير المسندين | Client/Management scoped | Confirmed |
| العقود والباقات | الإدارة وAM، العميل بنسخة مبسطة | الفريق غير المخول والعملاء الآخرون | Management / Client Visible limited | Confirmed |
| قيمة العقود والمدفوعات | الإدارة العليا أو من يخول | الفريق والعميل إلا بقرار | Management Only | Assumed |
| المخرجات قبل التعميد | الفريق والإدارة | العميل | Internal Only | Confirmed |
| المخرجات بعد الإرسال | العميل المعني والإدارة والفريق المصرح | عملاء آخرون | Client Visible | Confirmed |
| المسودات والنسخ غير المعتمدة | الفريق والإدارة المصرح لهم | العميل | Internal Only | Confirmed |
| التعليقات الداخلية | الفريق والإدارة المصرح لهم | كل أدوار العميل | Internal Only | Confirmed |
| تعليقات العميل | العميل المعني، الإدارة، الفريق المصرح | عملاء آخرون | Client Visible / scoped | Confirmed |
| الملفات الداخلية | الفريق والإدارة المصرح لهم | العميل | Internal Only | Confirmed |
| الملفات النهائية | العميل المعني بعد السماح/التسليم | عملاء آخرون | Client Final Only | Confirmed |
| بيانات SLA | الإدارة والفريق، العميل بنسخة مبسطة عند الاعتماد | عملاء آخرون | Management / Client Visible limited | Confirmed |
| delay owner | الإدارة؛ ظهوره للعميل Open Question | العميل افتراضيا حتى اعتماد القرار | Management Only | Open Question |
| أداء الموظفين | الإدارة | العميل والفريق غير المخول | Management Only | Confirmed |
| Audit Logs | الإدارة حسب النطاق، العميل يرى سجل قرارات خارجي فقط | العميل لا يرى الداخلي | Audit Only / Restricted | Confirmed |
| إعدادات الصلاحيات | Tenant Owner/Admin والإدارة المخولة | العميل والفريق | Management Only | Confirmed |

## 4. إثبات قواعد العزل

### 4.1 مستخدم العميل لا يرى بيانات عميل آخر

كل Client user يجب أن يكون scoped على Client محدد. حتى داخل نفس Tenant، عميل A وعميل B معزولان. أي رابط مباشر إلى مخرج أو ملف أو تعليق خارج Client scope يجب أن يرفض.

### 4.2 مستخدم العميل لا يرى التعليقات الداخلية

نوع التعليق `internal_comment` لا يتحول إلى Client Visible. إذا احتاجت الإدارة نقل معنى التعليق للعميل، تكتب تعليقا جديدا موجها للعميل دون كشف نص المراجعة الداخلية.

### 4.3 العميل لا يرى النسخ غير المعتمدة داخليا

النسخة تظهر للعميل فقط إذا:

1. كانت مرتبطة بالمخرج الصحيح.
2. كانت ضمن Client scope.
3. كانت معتمدة داخليا أو نهائية حسب نوع المخرج.
4. تم إرسالها أو تعليمها Client Visible / Final Delivery.

### 4.4 عضو الفريق لا يرى عميلا غير مسند

الفريق يعمل بنطاق assigned Client أو Deliverable. رؤية كل العملاء داخل Tenant ليست افتراضية وتحتاج قرار مالك.

### 4.5 مدير الحساب يرى عملاءه فقط

Account Manager يرى العملاء المسندين إليه فقط، إلا إذا منح Portfolio scope أوسع بقرار واضح.

### 4.6 Platform Support لا يطلع على المحتوى الحساس

Platform Support لا يرى ملفات أو تعليقات أو مخرجات حساسة دون support session موثق. الوصول يجب أن يكون مؤقتا ومحددا وقابلا للتدقيق.

## 5. محاولات الوصول المرفوضة

| المحاولة | القرار | Audit المقترح | التصنيف |
| --- | --- | --- | --- |
| Client A يفتح رابط ملف Client B | Deny | `access_denied_cross_client` | Confirmed |
| Client Viewer يضغط اعتماد عبر رابط قديم | Deny | `approval_denied_missing_permission` | Confirmed |
| فريق غير مسند يفتح مخرج عميل غير مسند | Deny | `access_denied_unassigned_client` | Assumed |
| Platform Support يطلب محتوى حساس دون session | Deny | `support_access_denied` | Assumed |
| AM يحاول اعتماد داخلي دون تفويض | Deny | `internal_approval_denied` | Confirmed |

## 6. Business Rules

| ID | القاعدة | التصنيف |
| --- | --- | --- |
| BR-VDB-01 | Tenant isolation لا يعتمد على الدور وحده؛ يجب وجود scope صحيح. | Confirmed |
| BR-VDB-02 | Client isolation داخل Tenant شرط أساسي. | Confirmed |
| BR-VDB-03 | Internal Only لا يمكن عرضه للعميل. | Confirmed |
| BR-VDB-04 | Client Visible لا يعني قابل للتعديل أو الاعتماد. | Confirmed |
| BR-VDB-05 | Audit Logs الداخلية ليست جزءا من بوابة العميل. | Confirmed |
| BR-VDB-06 | delay owner يظهر للإدارة؛ ظهوره للعميل يحتاج قرار مالك. | Open Question |

