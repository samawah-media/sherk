# Domain Glossary: شريك

**المرحلة:** Phase 04 - Core Domain Model, Conceptual Data Model & Business Invariants  
**نوع الوثيقة:** Ubiquitous Language  
**الحالة:** Draft for owner review  
**آخر تحديث:** 2026-06-22  

## 1. الغرض

هذه الوثيقة تثبت لغة المجال الموحدة لشريك. المصطلحات هنا مفاهيم أعمال، وليست أسماء جداول أو أعمدة أو API. أي وثيقة لاحقة يجب أن تستخدم هذه الأسماء أو توثق سبب الانحراف عنها كسؤال مفتوح.

## 2. قواعد اللغة الموحدة

- نستخدم "Tenant" للوكالة أو الجهة المشغلة، وسماوة هي أول Tenant.
- نستخدم "Client" للشركة العميلة داخل Tenant، وليس Tenant مستقل.
- نستخدم "Deliverable" للمخرج المتفق عليه، وليس Request أو Ticket.
- نستخدم "Task" لوحدة عمل داخلية تنتج المخرج.
- نستخدم "Card" كتمثيل تشغيلي في Kanban، وليس كيان أعمال مستقل افتراضيا.
- نستخدم "Internal Approval" للتعميد الداخلي، و"Client Approval" لاعتماد العميل، ولا نخلط بينهما.
- نستخدم "Usage Ledger" لتاريخ الرصيد، ولا نستخدم عدادا mutable وحيدا كمصدر حقيقة.
- نستخدم "SLA Timeline" أو "SLA Segment" لحساب الزمن، وليس تاريخا نهائيا واحدا فقط.

## 3. Glossary

| المصطلح العربي | English | التعريف الدقيق | لا يعني | مثال صحيح | يختلط خطأ مع | المجال | الحالة |
| --- | --- | --- | --- | --- | --- | --- | --- |
| المنصة | Platform | منتج شريك SaaS الذي يستضيف Tenants متعددة ويدير حوكمة عامة دون وصول روتيني لمحتوى العملاء. | Tenant أو وكالة تشغيل بعينها. | شريك كمنتج يستضيف Tenant سماوة. | Tenant، Backend. | Platform Administration | Assumed |
| الجهة المشغلة | Tenant | الوكالة أو الجهة التي تشغل شريك لعملائها. | العميل النهائي. | سماوة Tenant يدير عدة عملاء. | Client، Organization. | Tenant & Membership | Confirmed |
| العميل | Client | شركة أو جهة عميلة داخل Tenant لها عقود ومخرجات ومستخدمون. | Tenant مستقل في V1. | عيادة النور داخل Tenant سماوة. | Tenant، Account. | Client Management | Confirmed |
| هوية المستخدم | User Identity | حساب الشخص العالمي الذي يمكن ربطه بعضويات مختلفة. | دورا أو صلاحية ثابتة. | نفس البريد قد ينضم مستقبلا لأكثر من Tenant. | Membership، Role. | Identity | Assumed |
| عضوية Tenant | Tenant Membership | ارتباط هوية مستخدم بTenant مع حالة وصلاحيات. | حساب المستخدم نفسه. | مصمم داخل سماوة كعضو Tenant. | User Identity. | Tenant & Membership | Confirmed |
| عضوية العميل | Client Membership | ارتباط مستخدم بClient محدد داخل Tenant. | صلاحية Tenant-wide. | معتمد عميل A داخل سماوة. | Tenant Membership. | Client Management | Confirmed |
| تعيين الدور | Role Assignment | منح دور صلاحية ضمن Scope محدد. | مسمى وظيفي. | `client_approver` على Client A. | Job Title. | Permissions | Confirmed |
| نطاق التعيين | Assignment Scope | حدود سريان دور أو صلاحية: Platform أو Tenant أو Client أو Deliverable أو Task. | مجرد فلتر واجهة. | Account Manager على Client B فقط. | Role. | Permissions | Confirmed |
| العقد | Contract | اتفاق زمني أو نطاق تجاري مع Client يحدد التزامات ومخرجات. | فاتورة أو نظام محاسبة. | عقد شهري ل20 منشورا و4 Reels. | Package. | Contracts & Commitments | Confirmed |
| نسخة العقد | Contract Version | لقطة تاريخية من العقد أو تعديله تحفظ أساس القرارات. | ملف PDF فقط. | مخرج أنشئ على نسخة عقد قبل تعديل الكمية. | Amendment. | Contracts & Commitments | Assumed |
| الباقة | Package | تجميع تجاري لكميات أو خدمات ضمن عقد أو فترة. | اشتراك دفع متقدم. | باقة شهرية تحتوي 20 منشورا. | Contract، Billing Plan. | Contracts & Commitments | Confirmed |
| بند الباقة | Package Line | وحدة التزام كمية أو غير كمية داخل باقة أو عقد. | عمود قاعدة بيانات. | بند "4 Reels" أو "تقرير شهري". | Deliverable Type. | Package Usage | Assumed |
| الالتزام التجاري | Commercial Commitment | وعد قابل للتتبع بين Tenant والعميل بشأن كمية أو خدمة أو تسليم. | فاتورة أو مطالبة مالية. | "خطة محتوى شهرية واحدة". | Package Line. | Contracts & Commitments | Confirmed |
| المخرج | Deliverable | نتيجة متفق عليها مع العميل، وهي قلب دورة التشغيل. | طلب عشوائي أو مهمة داخلية. | Reel، تصميم، تقرير، خطة محتوى. | Task، Ticket. | Deliverables Management | Confirmed |
| قالب المخرج | Deliverable Template | وصف قابل لإعادة الاستخدام يحدد قواعد افتراضية لنوع مخرج. | نسخة فعلية من مخرج. | قالب Reel يحتاج اعتماد عميل. | Deliverable Type. | Deliverables Management | Assumed |
| نوع المخرج | Deliverable Type | تصنيف أعمال للمخرج يساعد في SLA والاعتماد والقوالب. | بند باقة بالضرورة. | منشور، Reel، تقرير. | Package Line. | Deliverables Management | Confirmed |
| نسخة المخرج | Deliverable Version | نسخة عمل أو نسخة مرسلة أو معتمدة من مخرج محدد. | ملف واحد فقط. | نسخة تصميم v2 أرسلت للعميل. | File Version. | Deliverables Management | Confirmed |
| المهمة | Task | وحدة عمل داخلية مطلوبة لإنتاج أو مراجعة مخرج. | مخرج متفق عليه مع العميل. | كتابة النص، تصميم الغلاف، مراجعة الأداء. | Deliverable. | Internal Work Management | Confirmed |
| اللوحة | Board | تنظيم تشغيلي للمخرجات أو المهام داخل Kanban. | عقد أو Workflow قانوني. | لوحة مخرجات عميل A. | Dashboard. | Internal Work Management | Confirmed |
| العمود أو المرحلة | Column / Stage | موضع تشغيلي على اللوحة. | حالة أعمال كاملة. | "جاهز للمراجعة الداخلية". | Deliverable Lifecycle State. | Internal Work Management | Confirmed |
| الكارت | Card | تمثيل مرئي لمخرج أو مهمة على Board. | كيان تجاري مستقل افتراضيا. | كارت مخرج تصميم في Kanban. | Deliverable، Task. | Internal Work Management | Confirmed |
| المراجعة الداخلية | Internal Review | عملية فحص نسخة قبل التعميد الداخلي. | اعتماد نهائي أو إرسال للعميل. | مدير مشروع يراجع ملفا مرفوعا. | Internal Approval. | Approvals & Collaboration | Confirmed |
| التعميد الداخلي | Internal Approval | قرار داخلي موثق بأن نسخة محددة صالحة للخطوة التالية. | اعتماد العميل أو تسليم نهائي. | اعتماد مدير التسويق لتصميم قبل الإرسال. | Client Approval. | Approvals & Collaboration | Confirmed |
| مراجعة العميل | Client Review | مشاهدة العميل لنسخة مرسلة وإبداء ملاحظات. | صلاحية اعتماد بالضرورة. | Client Reviewer يعلق على نسخة. | Client Approval. | Approvals & Collaboration | Assumed |
| اعتماد العميل | Client Approval | قرار مستخدم عميل مخول على نسخة مرسلة له. | إغلاق تلقائي أو استهلاك رصيد وحده. | Client Approver يعتمد التصميم. | Internal Approval. | Approvals & Collaboration | Confirmed |
| سياسة الاعتماد | Approval Policy | قواعد من يراجع ويعتمد ومتى وما النسخة المطلوبة. | كود تنفيذ أو محرك Workflow نهائي. | معتمد واحد في V1. | Permission Matrix. | Approvals & Collaboration | Assumed |
| دورة الاعتماد | Approval Cycle | جولة مراجعة/قرار مرتبطة بنسخة محددة. | كل تاريخ المخرج. | دورة أولى رفضت، دورة ثانية اعتمدت. | Approval Decision. | Approvals & Collaboration | Confirmed |
| قرار الاعتماد | Approval Decision | نتيجة موثقة: اعتماد، طلب تعديل، سحب تعميد، اعتراض. | تعليق عادي. | اعتماد داخلي على نسخة v3. | Comment. | Approvals & Collaboration | Confirmed |
| طلب التعديل | Change Request | قرار يطلب إعادة العمل مع سبب. | إلغاء تلقائي. | العميل يطلب تعديل نص. | Rejection، Cancellation. | Approvals & Collaboration | Confirmed |
| التعليق | Comment | رسالة مرتبطة بمخرج أو نسخة أو ملف أو قرار ولها رؤية محددة. | Audit Event. | تعليق داخلي من مدير المشروع. | System Event. | Collaboration | Confirmed |
| سلسلة التعليقات | Comment Thread | مجموعة تعليقات مرتبطة بسياق واحد. | حالة أعمال. | نقاش حول نسخة التصميم. | Approval Cycle. | Collaboration | Assumed |
| مستوى الرؤية | Visibility Level | حكم مفاهيمي يحدد من يرى المحتوى. | صلاحية تنفيذ كاملة. | Internal Only، Client Final. | Role. | Files & Collaboration | Confirmed |
| أصل الملف | File Asset | ملف مرتبط بسياق أعمال ورؤية ومالك. | تخزين عام. | ملف PSD داخلي على مخرج. | File Version. | Files & Assets | Confirmed |
| نسخة الملف | File Version | إصدار من أصل ملف أو رفع جديد يحفظ التاريخ. | استبدال صامت. | v1 وv2 من تصميم. | Deliverable Version. | Files & Assets | Confirmed |
| الأصل النهائي | Final Asset | ملف أو نسخة تم تعليمها كتسليم نهائي. | أي ملف مرئي للعميل. | ملف PDF النهائي بعد التسليم. | Client Visible File. | Files & Assets | Confirmed |
| سياسة SLA | SLA Policy | قواعد زمنية تحدد البداية والتوقف والخطر والتأخير. | موعد نهائي واحد. | سياسة Reels خلال 5 أيام عمل. | SLA Clock. | SLA & Escalation | Assumed |
| عداد SLA | SLA Clock | الحالة الزمنية الجارية للمخرج حسب السياسة والخط الزمني. | حقل يدوي ثابت. | Running أو Paused. | SLA Status. | SLA & Escalation | Confirmed |
| مقطع SLA | SLA Segment | فترة زمنية لها بداية ونهاية ومالك وقت. | تاريخ واحد mutable. | مقطع انتظار العميل من 5 إلى 9 يوليو. | SLA Clock. | SLA & Escalation | Confirmed |
| تقويم العمل | Business Calendar | أيام وساعات العمل والمنطقة الزمنية التي تحكم حساب الزمن. | Calendar UI. | أيام عمل Tenant سماوة. | Timeline. | SLA & Escalation | Assumed |
| سبب التوقف | Pause Reason | تفسير موثق لتوقف SLA. | ملاحظة حرة فقط. | Waiting Client Approval. | Delay Owner. | SLA & Escalation | Confirmed |
| مالك التأخير | Delay Owner | الطرف المسؤول عن وقت التأخير أو الانتظار. | اسم موظف يظهر للعميل بالضرورة. | Client، Team، Internal Decision. | Owner. | SLA & Escalation | Confirmed |
| التصعيد | Escalation | رفع حالة خطر أو تأخير لصاحب قرار أعلى. | عقوبة أو غرامة. | تنبيه الإدارة عند Overdue. | Notification. | SLA & Escalation | Assumed |
| حجز الباقة | Package Reservation | حجز كمية من بند باقة لمخرج غير مسلم. | استهلاك نهائي. | حجز منشور واحد عند إنشاء مخرج. | Consumption. | Package Usage | Confirmed |
| استهلاك الباقة | Package Consumption | تحويل الحجز إلى منجز مستهلك عند التسليم النهائي. | حجز أو اعتماد عميل فقط. | استهلاك Reel بعد التسليم. | Reservation. | Package Usage | Confirmed |
| تحرير الباقة | Package Release | إعادة كمية محجوزة عند الإلغاء أو الاستبدال قبل الاستهلاك. | عكس استهلاك بعد التسليم. | إلغاء منشور يعيد الحجز. | Reversal. | Package Usage | Confirmed |
| تعديل الباقة | Package Adjustment | تصحيح أو قرار إداري يغير الرصيد مع سبب. | تعديل صامت للعداد. | إضافة رصيد بسبب تعديل عقد. | Amendment. | Package Usage | Assumed |
| سجل الاستخدام | Usage Ledger | سجل أحداث الرصيد الذي تشتق منه الكميات. | عداد متبقي وحيد. | Commitment Added ثم Reserved ثم Consumed. | Audit Log. | Package Usage | Confirmed |
| حدث التدقيق | Audit Event | سجل من فعل ماذا ومتى وفي أي نطاق. | مصدر وحيد لحالة المجال. | `client_approval_granted`. | Domain Event. | Audit & Activity | Confirmed |
| حدث المجال | Domain Event | شيء تجاري حدث بالفعل داخل المجال. | إشعار واجهة فقط. | DeliverableCreated. | Audit Event. | Domain Events | Confirmed |
| التقدم | Progress | قيمة مشتقة تعبر عن تقدم المخرج بناء على الحالة والقواعد. | نسبة يدوية حرة فقط. | delivered = 100%. | SLA. | Deliverables Management | Confirmed |
| التسليم | Delivery | إجراء نهائي يسلم المخرج ويغلقه تشغيليا ويستهلك الرصيد. | اعتماد عميل فقط. | تسليم الملف النهائي للعميل. | Client Approval. | Deliverables Management | Confirmed |
| الإلغاء | Cancellation | قرار إداري يوقف المخرج قبل أو بعد مسار معين مع أثر رصيد. | رفض العميل تلقائيا. | إلغاء مخرج غير مطلوب. | Change Request. | Deliverables Management | Confirmed |
| إعادة الفتح | Reopening | فتح مخرج مسلم لمعالجة سبب موثق. | رجوع مباشر إلى قيد التنفيذ بلا أثر. | تصحيح خطأ بعد التسليم. | New Deliverable. | Deliverables Management | Confirmed |
| الأرشفة | Archive | حفظ كيان مغلق أو قديم للرجوع دون تشغيل نشط. | حذف التاريخ. | أرشفة مخرج Delivered. | Delete. | Audit & Activity | Confirmed |

## 4. مصطلحات ممنوعة أو تحتاج توضيح

| المصطلح | القرار |
| --- | --- |
| Request | لا يستخدم كقلب V1؛ إن ورد فهو قناة إدخال مستقبلية فقط. |
| Ticket | لا يستخدم لوصف المخرج. |
| Customer as Tenant | غير صحيح في V1؛ العميل Client داخل Tenant. |
| Status واحد لكل شيء | ممنوع؛ يجب فصل حالات المخرج، المهمة، الاعتماد، SLA، الملف، العضوية. |
| Remaining Counter | ليس مصدر حقيقة للباقة؛ الرصيد مشتق من Ledger. |
| Admin | لا يستخدم دون تحديد Platform/Tenant/Executive/Project scope. |

