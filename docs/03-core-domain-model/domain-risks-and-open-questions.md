# Domain Risks and Open Questions: شريك

**المرحلة:** Phase 04 - Core Domain Model, Conceptual Data Model & Business Invariants  
**نوع الوثيقة:** Domain Risks & Owner Decisions  
**الحالة:** Draft for owner review  
**آخر تحديث:** 2026-06-22  

## 1. الغرض

هذه الوثيقة تجمع مخاطر نموذج المجال والأسئلة التي تحتاج اعتماد المالك. لا تحسم الأسئلة المفتوحة كقرارات تقنية أو معمارية.

## 2. Risk Register

| Risk ID | الوصف | الاحتمالية | الأثر | المؤشرات المبكرة | طريقة المنع | القرار المطلوب | المرحلة |
| --- | --- | --- | --- | --- | --- | --- | --- |
| R-001 | الخلط بين Tenant وClient | متوسط | حرج | عميل يعامل كTenant في الوثائق | تثبيت Tenant=agency وClient داخل Tenant | اعتماد المالك للنموذج | قبل UX/Specs |
| R-002 | الخلط بين Deliverable وTask | عالي | عالي | المهام تظهر للعميل كالتزامات | Deliverable هو commitment، Task internal | لا قرار إضافي | مستمر |
| R-003 | استخدام Kanban Stage كحالة تجارية كاملة | عالي | عالي | drag يرسل للعميل | Transition Policy وأوامر صريحة | لا قرار إضافي | Specs لاحقا |
| R-004 | Giant Status Enum | متوسط | عالي | status واحد لكل شيء | State machines مستقلة | لا قرار إضافي | قبل Spec Kit |
| R-005 | تعديل عداد الباقة دون Ledger | متوسط | حرج | remaining يتغير بلا سبب | Usage Ledger append-only | اعتماد Ledger model | قبل data model |
| R-006 | تعديل SLA دون Timeline | متوسط | حرج | due date يتغير لإخفاء تأخير | SLA Segments وAudit | اعتماد Timeline model | قبل data model |
| R-007 | اعتماد نسخة ثم استبدالها بصمت | عالي | حرج | ملف approved يتغير | Version immutability وCycle جديد | لا قرار إضافي | Specs |
| R-008 | تسرب Internal Comment | متوسط | حرج | نفس التعليق يستخدم للعميل | Visibility Policy غير قابلة للتحويل | اختبارات لاحقة | Specs/QA |
| R-009 | نقل ملف للعميل دون إجراء صريح | متوسط | حرج | visibility تتغير تلقائيا | Permission مستقل + Audit | لا قرار إضافي | Specs |
| R-010 | حذف Audit History | منخفض | حرج | delete حقيقي للسجلات | Audit append-only مفاهيميا | retention policy لاحقا | Architecture/Security |
| R-011 | ربط مخرج بعقد من عميل آخر | متوسط | حرج | اختيار عقد من قائمة عامة | Scope invariants | لا قرار إضافي | Specs |
| R-012 | ربط مستخدم بنطاق خاطئ | متوسط | حرج | دور بلا Client/Deliverable scope | Role Assignment scoped | اعتماد Client Admin policy | قبل UX/Specs |
| R-013 | إعادة فتح المخرج دون عكس الأثر التجاري | متوسط | عالي | delivered يعود in_progress مباشرة | Reopen command + SLA/Credit policy | حسم إعادة الفتح | قبل Specs |
| R-014 | تغييرات العقد أثناء مخرجات مفتوحة | عالي | عالي | تعديل كمية يؤثر على القديم | Contract Version/Amendment | سياسة open deliverables | قبل data model |
| R-015 | تعدد المعتمدين دون سياسة واضحة | متوسط | عالي | أكثر من approver وقرارات متضاربة | V1 assumes single approver/cycle | حسم multi-approval | قبل UX/Specs |
| R-016 | Circular Dependencies بين Aggregates | متوسط | متوسط | Deliverable يملك كل شيء | identity references بين Aggregates | لا قرار إضافي | data model |
| R-017 | تضخم Aggregate واحد ليملك كل شيء | عالي | عالي | Deliverable يحتوي comments/files/ledger بالكامل | Context boundaries | لا قرار إضافي | architecture |
| R-018 | Platform Support يفتح محتوى حساس | منخفض | حرج | support role عام | Break-glass/support session | حسم Platform Support | Security |
| R-019 | إظهار delay owner الداخلي للعميل | متوسط | متوسط | العميل يرى أسماء أو خلافات داخلية | نسخة مبسطة للعميل | حسم visibility | UX |
| R-020 | مخرج خارج الباقة يصبح مسارا عاديا | متوسط | عالي | extra بلا موافقة | Approved Extra Deliverable | حسم out-of-package | قبل Specs |

## 3. Open Questions

| السؤال | لماذا يؤثر على Domain Model؟ | الخيارات | مزايا ومخاطر | توصية V1 | ما يمكن تصميمه الآن؟ | ما لا يمكن تأجيله؟ | التصنيف |
| --- | --- | --- | --- | --- | --- | --- | --- |
| هل يوجد اعتماد متعدد من العميل في V1؟ | يغير Approval Cycle وState Machine. | معتمد واحد / عدة بنفس الدور / متوازي / متسلسل | البساطة مقابل حوكمة أعلى وتعقيد. | معتمد واحد أو عدة بنفس الدور دون sequencing. | Cycle قابل للتوسع. | عدم بناء تدفق متسلسل ضمنيا. | Open Question |
| هل رفض العميل حالة مستقلة؟ | يؤثر على حالات المخرج والأحداث. | Treat as change / rejection state / cancellation escalation | الحالة المستقلة أوضح لكنها تزيد التعقيد. | اعتراض/طلب تعديل موثق أو تصعيد إلغاء. | Event باسم rejection recorded. | عدم إغلاق تلقائي. | Open Question |
| هل يسمح بمخرج خارج عقد/باقة؟ | يؤثر على Ledger والنطاق. | منع / استثناء موثق / عادي | الاستثناء عملي، العادي يضعف التحكم. | Approved Extra Deliverable فقط. | Extra flag/decision concept. | منع الاستهلاك التلقائي. | Open Question |
| هل توجد أوزان تحويل بين أنواع المخرجات؟ | يؤثر على Package Balance. | لا تحويل / قواعد لكل عقد / أوزان عامة | الأوزان العامة خطرة مبكرا. | لا أوزان عامة في V1. | Unit per Package Line. | منع التحويل الصامت. | Assumed |
| كيف يعالج SLA عند إعادة الفتح؟ | يؤثر على التقارير. | استئناف / Segment جديد / مخرج جديد | Segment جديد يحفظ التاريخ. | حسب سبب الفتح، مع Segment جديد غالبا. | Reopen reason + policy hook. | عدم direct state change. | Open Question |
| هل Client Admin يدير مستخدمي العميل؟ | يؤثر على Membership lifecycle. | self-service / request-only / deferred | self-service مفيد لكنه خطر. | request-only أو محدود. | Client Membership model. | منع دعوات بلا Scope. | Open Question |
| هل يرى العميل delay owner؟ | يؤثر على Client Portal visibility. | كامل / مبسط / لا يظهر | الكامل قد يكشف داخلي. | مبسط أو لا يظهر. | Delay Owner داخلي + public status. | عدم كشف أسماء/خلافات داخلية. | Open Question |
| هل Audit export في V1؟ | يؤثر على Audit permissions. | نعم / restricted / later | التصدير حساس. | restricted أو later. | Audit Event model. | عدم حذف audit. | Open Question |
| هل الفريق يرى كل عملاء Tenant؟ | يؤثر على Scope. | كل العملاء / assigned clients / assigned deliverables | كل العملاء أسهل لكنه أضعف عزل. | assigned clients/deliverables. | Assignment Scope. | منع access العام افتراضيا. | Open Question |
| هل Partial Delivery مطلوب؟ | يؤثر على Ledger وDelivery. | لا / نعم لبعض الأنواع | يزيد التعقيد. | يؤجل. | Final/partial hooks. | عدم استهلاك جزئي ضمنيا. | Open Question |

## 4. تعارضات مكتشفة

| التعارض | الملفات المتأثرة | القراءة المقترحة | التصنيف |
| --- | --- | --- | --- |
| AGENTS القديم يقول "كل عميل = tenant أو client scope"، بينما Phase 02/03 حسمت Tenant=agency وClient داخل Tenant. | AGENTS.md، docs/01، docs/02 | لا تعارض عملي: نستخدم tenant/client scope، لكن Client ليس Tenant. | Confirmed |
| AGENTS يستخدم `samawah_admin` بينما شريك SaaS عام. | AGENTS.md، role docs | يترجم إلى Tenant Owner/Admin، وسماوة أول Tenant. | Confirmed |
| رفض العميل مذكور كقرار، لكن لا توجد حالة مستقلة مؤكدة. | client approval، deliverables lifecycle | يعامل كطلب تعديل/اعتراض أو تصعيد إلغاء حتى قرار المالك. | Open Question |
| Audit Export يظهر كرغبة محتملة، لكنه حساس. | permission catalog، audit model | يبقى Restricted/Open. | Open Question |
| إعادة الفتح مؤكدة كصلاحية، لكن أثر SLA/رصيد غير محسوم. | deliverables، SLA، ledger | نثبت Reopen command ولا نحسم أثره المالي والزمني. | Open Question |

## 5. قرارات تحتاج اعتماد المالك

1. اعتماد Tenant=agency وClient داخل Tenant كنموذج نهائي للمرحلة القادمة.
2. اعتماد Ledger كمصدر تاريخ الرصيد بدل عداد mutable.
3. اعتماد SLA Timeline/Segments كمصدر حساب الزمن.
4. حسم تعدد معتمدي العميل في V1.
5. حسم معنى رفض العميل.
6. حسم المخرجات خارج الباقة.
7. حسم أثر إعادة الفتح على SLA والرصيد.
8. حسم Client Admin self-service.
9. حسم ظهور delay owner للعميل.
10. حسم Audit export في V1.

## 6. Readiness Assessment للانتقال إلى UX & User Flows

| المجال | الجاهزية | الملاحظات |
| --- | --- | --- |
| لغة المجال | جاهزة للمراجعة | Glossary يغطي المصطلحات الأساسية. |
| Bounded Contexts | جاهزة | Core/Supporting/Generic موثقة. |
| Aggregates/Invariants | جاهزة | أهم Invariants موثقة. |
| State Machines | جاهزة مبدئيا | تحتاج اختصار/تفصيل لاحق في Specs. |
| Package Ledger | جاهز مبدئيا | الأسئلة حول partial/carry forward باقية. |
| SLA Timeline | جاهز مبدئيا | أيام العمل والعتبات تحتاج اعتمادا. |
| Traceability | جاهزة | المتطلبات الحساسة مربوطة. |
| UX readiness | مشروطة | يمكن بدء User Flows مع وضع Open Questions كافتراضات ظاهرة. |

## 7. Compliance Checklist

| البند | الحالة |
| --- | --- |
| لم يتم تعديل أي كود. | Confirmed |
| لم يتم إنشاء SQL أو migrations. | Confirmed |
| لم يتم تصميم جداول قاعدة بيانات أو أعمدة أو indexes. | Confirmed |
| لم يتم كتابة RLS Policies. | Confirmed |
| لم يتم إنشاء API endpoints. | Confirmed |
| لم يتم إنشاء spec.md أو plan.md أو tasks.md. | Confirmed |
| لم يتم إنشاء ADRs. | Confirmed |
| لم يتم إنشاء C4 Containers أو Deployment Architecture. | Confirmed |
| كل قرار مصنف Confirmed / Assumed / Open Question حيث يلزم. | Confirmed |

