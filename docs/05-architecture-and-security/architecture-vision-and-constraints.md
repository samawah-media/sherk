# Architecture Vision and Constraints: شريك

**المرحلة:** Phase 06 - Architecture, Multitenancy, Security & NFR  
**الحالة:** Draft for owner review  
**آخر تحديث:** 2026-06-23  

## 1. الهدف

تحويل وثائق المنتج والتشغيل والصلاحيات ونموذج المجال وUX إلى معمارية V1 قابلة للتنفيذ، آمنة، وقابلة للتدقيق، دون كتابة كود أو SQL أو Feature Specs.

## 2. توصية V1

| البند | القرار |
| --- | --- |
| النمط | Modular Monolith داخل تطبيق Next.js واحد |
| البيانات | قاعدة PostgreSQL مشتركة ومخطط مشترك مع `tenant_id` و`client_id` حسب السياق |
| العزل | RLS + تحقق server-side + صلاحيات Scope-aware |
| الملفات | Supabase Storage مع Metadata داخل قاعدة البيانات وSigned URLs قصيرة العمر |
| العمليات الحساسة | Server-only commands أو RPC/Functions محكومة ومراجعة |
| الزمن | SLA Timeline مبني على Segments لا على حقل واحد قابل للتعديل |
| الرصيد | Usage Ledger append-only مع projections |

## 3. نطاق V1 المعماري

- Auth تقليدي بدعوات وعضويات.
- Tenants وClients وMemberships وRoles وPermissions.
- Clients وContracts وPackages وDeliverables.
- Kanban داخلي مبني على حالة المخرج والمهام.
- Internal approvals وClient approvals منفصلان.
- Files وComments مع Visibility صارمة.
- Audit Event Stream وUsage Ledger.
- SLA Background processing ومؤشرات لوحة الإدارة.
- Notifications داخلية وبريدية أساسية عند الحاجة.

## 4. خارج نطاق V1

- Microservices.
- قاعدة بيانات مستقلة لكل Tenant.
- Social publishing.
- AI content generation.
- CRM أو فوترة متقدمة.
- Mobile apps أصلية.
- White label.
- اعتماد BrightBean أو Postiz أو Planka كقاعدة بناء.

## 5. قيود تجارية مؤكدة

- شريك منتج مملوك لسماوة، وسماوة أول Tenant.
- Tenant هو الوكالة أو الجهة المشغلة، وClient جهة عميلة داخل Tenant.
- البداية التشغيلية المتوقعة تقارب أربعة عملاء.
- المخرج هو القلب، وليس Request أو Ticket.
- التعميد الداخلي شرط قبل ظهور المخرج للعميل.
- العميل لا يرى Internal comments أو Internal files أو النسخ غير المعتمدة داخليا.
- SLA في V1 ويتوقف عند انتظار العميل.
- حجز الباقة عند إنشاء المخرج والاستهلاك عند التسليم فقط.

## 6. قيود تقنية

- كل كيان عميل يحمل `tenant_id` و`client_id` أو يرثهما من أصل مثبت.
- لا API أو Query بدون Tenant Context.
- لا استخدام لـ`service_role` في الواجهة.
- لا اعتماد على بيانات قابلة لتعديل المستخدم في قرارات الصلاحيات.
- أي عملية اعتماد أو Visibility أو Ledger أو SLA يجب أن تمر عبر server-side command.
- RLS دفاع أساسي لكنه ليس الطبقة الوحيدة.

## 7. افتراضات تشغيلية

| الافتراض | أثره |
| --- | --- |
| حجم Pilot صغير | يسمح بقاعدة مشتركة ومونوليث منظم |
| الفريق صغير إلى متوسط | يقلل الحاجة لمنظومة IAM معقدة مبكرا |
| الملفات قد تشمل فيديو | يجب مراقبة egress وتخطيط R2 لاحقا عند الحاجة |
| الجوال مهم للقرارات | الواجهات الحساسة يجب أن تعمل Responsive |

## 8. ما لن نحسنه مبكرا

- لا تحسين مبكر لتقسيم الخدمات.
- لا تقويم متقدم قبل ثبوت الحاجة.
- لا workflow اعتماد متسلسل قبل قرار مالك.
- لا نظام بحث شامل قبل ضبط Scoping.
- لا أرشفة باردة أو Data warehouse في V1.

## 9. ما يجب ألا يصعب تغييره لاحقا

- فصل Modules إلى خدمات لاحقا.
- نقل Storage إلى R2 أو S3-compatible.
- إضافة social publishing عبر Integration Boundary.
- إضافة read models أو search index.
- إضافة Tenant tiers وحدود استخدام.

