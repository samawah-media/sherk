# Team Workspace Permissions: شريك

**المرحلة:** Phase 03 - Roles, Permissions, Visibility & Delegation Model  
**نوع الوثيقة:** Team Workspace Permissions  
**الحالة:** Draft for owner review  
**آخر تحديث:** 2026-06-22  

## 1. الغرض

مساحة الفريق هي مساحة تشغيل داخلية. هدفها تمكين التنفيذ السريع دون إعطاء الفريق صلاحيات إرسال أو اعتماد أو تعديل عقود افتراضيا.

| التصنيف | النقطة |
| --- | --- |
| Confirmed | Kanban داخلي للفريق والإدارة وليس للعميل. |
| Confirmed | الفريق لا يرسل للعميل مباشرة افتراضيا. |
| Confirmed | الفريق لا يعتمد داخليا أو نهائيا افتراضيا. |
| Assumed | الفريق يرى مخرجاته المسندة، وقد يرى Client scope أوسع إذا قرر المالك ذلك. |

## 2. قاعدة الرؤية الافتراضية

الأصل في V1:

- عضو الفريق يرى المخرجات المسندة له أو التي يشارك فيها.
- يمكن منحه رؤية Client-level إذا كان دوره يتطلب ذلك.
- لا يرى عملاء غير مسندين إليه.
- لا يرى بيانات مالية حساسة.
- لا يرى صلاحيات الإدارة.

| الخيار | المزايا | المخاطر | توصية V1 | التصنيف |
| --- | --- | --- | --- | --- |
| رؤية حسب المخرج فقط | أقوى عزل وأقل تسرب | قد يبطئ التعاون | مناسب للأدوار الحساسة أو العملاء الكبار | Assumed |
| رؤية حسب العميل المسند | أسهل للفريق ومدير الحساب | يكشف سياق أوسع | التوصية الافتراضية العملية للفريق الأساسي | Assumed |
| رؤية كل عملاء Tenant | أسرع للفرق الصغيرة | خطر خصوصية وتسرب | لا يعتمد افتراضيا | Open Question |

## 3. صلاحيات أدوار التنفيذ

| الإجراء | Marketing Specialist | Content Writer | Designer | Motion Designer | Performance Analyst | Publisher | Contributor | الشروط |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| عرض المخرج المسند | Allow | Allow | Allow | Allow | Allow | Allow | Allow | assigned scope |
| عرض Kanban الداخلي | Conditional | Conditional | Conditional | Conditional | Conditional | Conditional | Conditional | board scoped |
| بدء التنفيذ | Conditional | Conditional | Conditional | Conditional | Conditional | Conditional | Conditional | owner أو مخول |
| رفع ملف داخلي | Allow | Allow | Allow | Allow | Allow | Conditional | Conditional | deliverable assigned |
| رفع نسخة جديدة | Allow | Allow | Allow | Allow | Allow | Conditional | Conditional | بعد التعميد تحتاج مراجعة جديدة |
| إضافة تعليق داخلي | Allow | Allow | Allow | Allow | Allow | Allow | Allow | لا يظهر للعميل |
| مشاهدة تعليقات العميل | Conditional | Conditional | Conditional | Conditional | Conditional | Conditional | Conditional | حسب need-to-know |
| إرسال للمراجعة الداخلية | Conditional | Conditional | Conditional | Conditional | Conditional | Conditional | Conditional | owner أو contributor مخول |
| طلب تعديل داخلي | Deny | Deny | Deny | Deny | Deny | Deny | Deny | مراجع/إدارة فقط |
| تعميد داخلي | Deny | Deny | Deny | Deny | Deny | Deny | Deny | إلا إذا حمل دور QR/PM منفصل |
| إرسال للعميل | Deny | Deny | Deny | Deny | Deny | Deny | Deny | إدارة أو AM مخول |
| تعديل عقد/باقة | Deny | Deny | Deny | Deny | Deny | Deny | Deny | إدارة فقط |
| تعديل SLA | Deny | Deny | Deny | Deny | Deny | Deny | Deny | إدارة فقط |

## 4. Kanban والمهام

| الإجراء | الفريق | مدير الحساب | مدير المشروع/التسويق | Audit | التصنيف |
| --- | --- | --- | --- | --- | --- |
| عرض الكروت | Conditional | Allow ضمن عملائه | Allow ضمن نطاقه | No | Confirmed |
| نقل كارت داخل المراحل التنفيذية | Conditional | Conditional | Allow | Yes | Confirmed |
| النقل إلى `waiting_client_approval` | Deny | Conditional بعد التعميد | Allow بعد التعميد | Yes | Confirmed |
| النقل إلى `delivered` | Deny | Conditional | Allow | Yes | Confirmed |
| تغيير الأولوية | Conditional | Allow | Allow | Yes | Assumed |
| تعديل موعد مهمة | Conditional | Allow | Allow | Yes | Assumed |
| حذف/أرشفة مهمة | Deny افتراضيا | Conditional | Allow | Yes | Assumed |

## 5. الملفات والتعليقات

| النوع | الفريق يرى؟ | الفريق ينشئ؟ | يظهر للعميل؟ | التصنيف |
| --- | --- | --- | --- | --- |
| `internal_comment` | نعم ضمن النطاق | نعم | لا أبدا | Confirmed |
| `client_comment` | نعم إذا مصرح على المخرج | لا كعميل؛ يمكن الرد بتعليق client-visible إذا مخول | نعم | Confirmed |
| `internal_only` file | نعم ضمن النطاق | نعم | لا | Confirmed |
| `client_visible` file | نعم | لا يحوله للعميل إلا مخول | نعم | Confirmed |
| `final_delivery` file | نعم | لا يحدده نهائيا إلا مخول | نعم بعد التسليم/السماح | Confirmed |

## 6. فصل التنفيذ عن الاعتماد

| السيناريو | القرار المتوقع | السبب | Audit |
| --- | --- | --- | --- |
| كاتب محتوى رفع نسخة ويحاول اعتمادها داخليا | Deny | لا اعتماد ذاتي ولا دور اعتماد | محاولة مرفوضة اختيارية |
| مصمم يحاول جعل ملف Client Visible | Deny أو Conditional إذا خول | تحويل الرؤية حساس | `file_visibility_changed` عند السماح |
| محلل أداء يحاول رؤية عميل غير مسند | Deny | client isolation داخل Tenant | access denied event حسب سياسة الأمن |
| Publisher يريد توثيق نشر يدوي | Conditional | النشر المباشر خارج V1، لكن يمكن توثيق حالة تسليم إن خول | `manual_publish_recorded` مؤجل |

## 7. Business Rules

| ID | القاعدة | التصنيف |
| --- | --- | --- |
| BR-TW-01 | الأدوار التنفيذية تعمل ضمن assigned scope افتراضيا. | Confirmed |
| BR-TW-02 | التنفيذ لا يمنح حق التعميد أو الإرسال للعميل. | Confirmed |
| BR-TW-03 | أي تعليق داخلي لا يظهر للعميل مهما كان صاحبه. | Confirmed |
| BR-TW-04 | رفع نسخة بعد التعميد يعيد الحاجة إلى مراجعة قبل الإرسال. | Confirmed |
| BR-TW-05 | رؤية الفريق لكل عملاء Tenant ليست افتراضية وتحتاج قرار مالك. | Open Question |

