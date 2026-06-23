# UX Risks and Open Questions: شريك

**المرحلة:** Phase 05 - Information Architecture, UX Model & Role-Based User Flows  
**نوع الوثيقة:** UX Risks and Open Questions  
**الحالة:** Draft for owner review  
**آخر تحديث:** 2026-06-23  

## 1. Risk Register

| Risk ID | Description | Affected Roles | Probability | Impact | Early Signal | Prevention | Recovery | Owner Decision Required | Phase |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| UX-R01 | ازدحام واجهة العميل | العميل | متوسط | عالي | العميل لا يستخدم البوابة | التابات الخمسة وProgressive Disclosure | تبسيط الرئيسية | لا | UX |
| UX-R02 | خلط التعميد الداخلي باعتماد العميل | الجميع | متوسط | حرج | مستخدم يسأل "هل اعتمد العميل؟" | فصل بصري ولغوي | مراجعة النصوص | لا | UX/Specs |
| UX-R03 | اعتماد نسخة خاطئة | العميل/الإدارة | متوسط | حرج | اعتراض بعد الاعتماد | Version awareness | إبطال النسخ القديمة | لا | Specs |
| UX-R04 | كشف تعليق داخلي | العميل/الفريق | منخفض | حرج | ظهور عداد داخلي للعميل | Visibility صارمة | Incident flow | لا | Security |
| UX-R05 | خلط المخرج بالمهمة | الفريق/الإدارة | عالي | عالي | Task يظهر للعميل | لغة المجال | إعادة تسمية | لا | UX |
| UX-R06 | Kanban يتجاوز Business Rules | الفريق/الإدارة | عالي | حرج | سحب يرسل للعميل | Transition guards | rollback | لا | Specs |
| UX-R07 | إخفاء سبب التأخير | الإدارة | متوسط | عالي | SLA غير مفهوم | delay owner داخلي | Activity review | هل يظهر مبسط للعميل | UX |
| UX-R08 | عرض SLA معقد للعميل | العميل | متوسط | متوسط | أسئلة كثيرة | نصوص مبسطة | إخفاء التفاصيل | لا | UX |
| UX-R09 | كثرة الإشعارات | الجميع | متوسط | متوسط | تجاهل الإشعارات | Action Center وتصنيف | إعدادات | لا | UX |
| UX-R10 | صعوبة إدارة 4+ عملاء | الإدارة/AM | متوسط | عالي | فلاتر غير كافية | Global Search وPortfolio filters | تحسين الفلاتر | لا | UX |
| UX-R11 | عدم وضوح الخطوة التالية | الجميع | متوسط | عالي | توقف المخرج | One Clear Next Action | CTA أوضح | لا | UX |
| UX-R12 | كثرة الأدوار والصلاحيات | الإدارة/العميل | متوسط | متوسط | أخطاء دعوات | قوالب أدوار | Wizard دعوة | نعم جزئيا | UX/Permissions |
| UX-R13 | أزرار خطرة دون تأكيد | الإدارة/العميل | متوسط | عالي | اعتماد/حذف بالخطأ | Confirm dialogs | Undo حيث يسمح | لا | UX |
| UX-R14 | ضعف استخدام الجوال | العميل/الفريق | متوسط | عالي | اعتماد يعود لواتساب | Mobile flows | تحسين responsive | لا | UX |
| UX-R15 | ضعف Accessibility في Drag | الفريق/الإدارة | عالي | متوسط | عدم قدرة مستخدم على النقل | بديل قائمة | Keyboard support | لا | UX |
| UX-R16 | خلط الملفات النهائية بالمسودات | الجميع | متوسط | حرج | عميل ينزل مسودة | شارات visibility | Mark Final واضح | لا | UX |
| UX-R17 | عدم وضوح المتبقي من الباقة | العميل/الإدارة | متوسط | عالي | أسئلة خارجية | cards كمية | Tooltips بسيطة | لا | UX |
| UX-R18 | فقد المدخلات عند الخطأ | الجميع | متوسط | متوسط | إعادة كتابة التعليق | حفظ مسودة | restore draft | لا | UX |
| UX-R19 | اعتماد جماعي خاطئ | العميل | متوسط | عالي | اعتماد عناصر غير مقصودة | Review before confirm | per-item result | لا | UX |
| UX-R20 | اختلاف الواجهة عن Business Rules | الجميع | متوسط | حرج | زر متاح لحالة ممنوعة | traceability review | hide/disable | لا | UX/Specs |

## 2. Open Questions

| السؤال | الخيارات | مزايا ومخاطر | توصية V1 | أثر UX | ما يؤجل | التصنيف |
| --- | --- | --- | --- | --- | --- | --- |
| هل التقارير Tab مستقل؟ | مستقل / داخل الملفات | المستقل أوضح لكنه يزحم العميل | داخل الملفات | إشعار وتصفية تقارير | Tab مستقل | Confirmed |
| هل Magic Link يدخل V1؟ | نعم / لا | أسهل للعميل لكن يحتاج أمان خاص | لا، تسجيل عادي | Login عادي ودعوات | Magic link | Confirmed |
| هل Bulk Approval يدخل V1؟ | نعم / لا | أسرع لكن خطر اعتماد خاطئ | نعم بضوابط | Select + review | workflow متقدم | Confirmed |
| هل تعليقات الصور/الفيديو الموضعية تدخل V1؟ | نعم / لاحق | مفيدة لكن تزيد التعقيد | لاحق ما لم يثبت Pilot | تعليق حر عام | annotation tools | Open Question |
| هل العميل يرى كل تاريخ النسخ؟ | كل النسخ / المرسلة فقط | كل النسخ يزيد الالتباس | المرسلة والنهائية فقط | بساطة وأمان | تاريخ داخلي | Assumed |
| ما تفاصيل SLA للعميل؟ | كامل / مبسط / لا يظهر | الكامل شفاف لكنه معقد | مبسط | نصوص مفهومة | segments | Confirmed |
| هل يسمح للعميل بإعادة فتح مخرج؟ | ذاتيا / طلب متابعة | الذاتي سريع لكنه يربك الرصيد | طلب متابعة | طلب للفريق | Reopen self-service | Confirmed |
| هل Client Admin يدعو مباشرة؟ | مباشرة / طلب دعوة / الاثنين | مباشرة أسرع لكن حساسة | إدارة محدودة أو طلب | إعدادات العميل | self-service كامل | Confirmed جزئيا |
| دعم الجوال للفريق | قراءة / كل شيء مهم | كل شيء يزيد تعقيد UX | كل شيء مهم | مهامي/إشعارات/رفع | Kanban كامل بالسحب | Confirmed |
| White Label | نعم / لاحق | مفيد تجاريا لكنه مشتت | لاحق | لا إعدادات White Label | branding | Confirmed |
| الإنجليزية | V1 / لاحق | مهمة للتوسع | بعد العربية السعودية | نصوص قابلة للتوطين | إطلاق إنجليزي | Confirmed |
| Global Search | نعم / لا | مفيد لكنه حساس للصلاحيات | نعم scoped | شريط بحث للفريق/الإدارة | بحث متقدم | Confirmed |
| Bulk Deliverable Creation | نعم / لا | يوفر وقت لكنه ليس مطلوبا | لا | إنشاء فردي | Bulk create | Confirmed |
| Activity Feed قابل للفلترة؟ | نعم / لا | ضروري للإدارة | نعم | فلاتر واضحة | export | Confirmed |
| أنواع الملفات القابلة للمعاينة | كل الأنواع / حسب الدعم | كل الأنواع كهدف، fallback ضروري | هدف واسع مع fallback | Preview/download | محرك معاينة متقدم | Confirmed/Assumed |
| تنزيل عدة ملفات دفعة واحدة | نعم / لا | مفيد لكن ليس أساسيا | لا | تنزيل فردي | bulk download | Confirmed |

## 3. Owner Decisions Applied

| القرار | الحالة |
| --- | --- |
| شريك هو المنتج، وسماوة المالكة وأول Tenant. | Confirmed |
| Platform Administration تبقى كحوكمة. | Confirmed |
| التقارير داخل الملفات. | Confirmed |
| تسجيل دخول عادي. | Confirmed |
| SLA للعميل مبسط. | Confirmed |
| Client Admin أو الإدارة يمكنهم دعوة مستخدمين. | Confirmed |
| النبرة سعودية ودودة وعملية. | Confirmed |

## 4. Readiness Assessment

| المجال | الجاهزية |
| --- | --- |
| IA | جاهزة للمراجعة. |
| Navigation | جاهز مع قرارات مالك واضحة. |
| User Flows | تغطي الأساسي والاستثنائي. |
| Demo Mapping | جاهز كمرجع UX فقط. |
| Accessibility/RTL | جاهز كتخطيط، يحتاج اختبار لاحقا. |
| الانتقال للمعمارية والأمان | ممكن بعد اعتماد المالك مع عدم تحويل Open Questions إلى قرارات تقنية. |

## 5. Compliance Checklist

| البند | الحالة |
| --- | --- |
| لم يتم تعديل أي كود. | Confirmed |
| لم يتم تعديل dependencies. | Confirmed |
| لم يتم إنشاء Specs أو plan.md أو tasks.md. | Confirmed |
| لم يتم إنشاء ADRs. | Confirmed |
| لم يتم تصميم SQL أو APIs أو RLS. | Confirmed |
| تم تصنيف القرارات إلى Confirmed / Assumed / Open Question. | Confirmed |
| تم اعتبار الديمو مرجعا UX فقط. | Confirmed |
