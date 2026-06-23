# Aggregates and Business Invariants: شريك

**المرحلة:** Phase 04 - Core Domain Model, Conceptual Data Model & Business Invariants  
**نوع الوثيقة:** Aggregates & Invariants Catalog  
**الحالة:** Draft for owner review  
**آخر تحديث:** 2026-06-22  

## 1. الغرض

هذه الوثيقة تحدد Aggregate Roots وحدود الاتساق والقواعد التي يجب ألا تكسر. هي نموذج مفاهيمي وليست تصميم جداول أو معاملات قاعدة بيانات.

## 2. Aggregate Roots المقترحة

| Aggregate Root | العناصر التابعة | حدود الاتساق | من ينشئ | من يغير | أحداث يصدرها | علاقات بالهوية فقط | Invariants مركزية |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Tenant | إعدادات Tenant، سياسات عامة، Business Calendar الافتراضي | Tenant لا يتداخل مع Tenant آخر | Platform Owner/Admin | Tenant Owner/Admin | TenantCreated، TenantSuspended | Clients، Memberships | لا Cross-tenant access |
| Client | Client profile، Client memberships، client visibility defaults | كل بيانات العميل داخل Tenant | Tenant Admin/PM | PM/AM conditional | ClientCreated، ClientArchived | Contracts، Deliverables | Client ليس Tenant |
| Membership | Role assignments، temporary delegations | العضوية مرتبطة بScope واضح | Tenant Admin/Client Admin conditional | Tenant Admin | RoleAssigned، MembershipSuspended | User Identity، Client | لا دور بلا Scope |
| Contract | Contract versions، amendments، package commitments refs | لا تعديل للتاريخ السابق بصمت | PM/Executive | PM/Executive | ContractCreated، ContractAmended | Deliverables، Usage Ledger | لا تغيير كمية تاريخية بلا نسخة/تعديل |
| Package Commitment | Package lines، commitment policy | وحدات الالتزام لا تختلط بلا سياسة | PM | PM/Executive | PackageLineCreated | Usage Ledger، Deliverables | لا تحويل عام بين الأنواع في V1 |
| Deliverable | lifecycle، current version ref، assigned refs، progress | انتقالات المخرج والبوابات | PM/AM conditional | PM/Owner/Approver حسب القرار | DeliverableCreated، DeliverableDelivered | Contract، Approval، SLA، Ledger | لا إرسال للعميل قبل التعميد |
| Task | assignees، task status، due date | المهمة لا تكسر حالة المخرج | PM/Owner | assignee/PM | TaskCompleted | Deliverable | لا Task لClient مختلف عن الأب |
| Approval Cycle | decisions، candidate version، policy snapshot | القرار على نسخة محددة | System/PM | Approver مخول | InternalApprovalGranted، ClientApprovalGranted | Deliverable، File/Version | لا اعتماد لنسخة غير مرسلة/غير حالية |
| File Asset | versions، visibility، final marker | الرؤية والنسخ لا تستبدل بصمت | Team/PM | Uploader/PM | FileUploaded، FileVisibilityChanged | Deliverable، Approval | Internal Only لا يظهر للعميل |
| SLA Timeline | segments، pause reasons، escalations | لا Running وPaused معا | System/PM | System/PM/Executive | SLAStarted، SLAPaused، SLAResumed | Deliverable | لا Resume دون Pause سابق |
| Usage Ledger | entries، balance projection | entries append-only | System/PM | PM/Executive | PackageQuantityReserved، Consumed، Released | Contract، Deliverable | لا استهلاك قبل التسليم |
| Audit Event Stream | audit entries | append-only scoped history | System | لا يعدل إلا تصحيح بسياسة | AuditEntryRecorded | Actor، Target | لا حذف Audit History |

## 3. علاقات يجب ألا تتحول إلى امتلاك مباشر

- Deliverable يشير إلى Contract/Package Line بالهوية ولا يملك العقد.
- Deliverable يشير إلى SLA Timeline ولا يحسب الزمن من حقل mutable داخله فقط.
- Approval Cycle يشير إلى Deliverable Version ولا يملك كل ملفات المخرج.
- Kanban Card يشير إلى Deliverable أو Task ولا يملك حالة الأعمال.
- Usage Ledger يشير إلى Deliverable ولا يملك دورة حياته.
- Audit Event يشير إلى Actor وScope وTarget ولا يملك حالة أي Aggregate.

## 4. Invariants Catalog

| ID | Invariant | المجال | الكيانات المتأثرة | متى يتحقق | أثر كسره | Permission/Policy | Audit Event |
| --- | --- | --- | --- | --- | --- | --- | --- |
| INV-001 | لا يمكن ربط Deliverable بClient من Tenant مختلف. | Tenancy | Tenant، Client، Deliverable | إنشاء/تعديل المخرج | خرق عزل حاسم | Visibility/Permission Policy | access_denied أو deliverable_update_denied |
| INV-002 | Client ليس Tenant مستقلًا في V1. | Tenancy | Tenant، Client | النمذجة والدعوات | تشوه الصلاحيات | Assignment Scope | role_assignment_denied |
| INV-003 | لا دور أو صلاحية بلا Scope واضح. | Permissions | Membership، Role Assignment | الدعوة/تعديل الدور | صلاحيات زائدة | Deny by Default | RoleAssigned/Denied |
| INV-004 | مستخدم العميل لا يملك Tenant-wide access. | Permissions | Client Membership | تقييم كل فعل | تسرب بيانات عملاء | Permission Evaluation | access_denied_cross_client |
| INV-005 | لا يظهر مخرج للعميل قبل التعميد الداخلي إذا كان موجهًا له. | Approvals | Deliverable، Approval Cycle | إرسال للعميل | كشف عمل غير جاهز | Approval Policy | deliverable_send_denied |
| INV-006 | التعميد الداخلي منفصل عن اعتماد العميل. | Approvals | Internal Approval، Client Approval | كل قرار | خلط مسؤوليات | Approval Policy | internal/client approval event |
| INV-007 | لا يمكن اعتماد نسخة غير النسخة المرسلة أو المعروضة للاعتماد. | Approvals | Approval Cycle، Version | اعتماد العميل | اعتماد ملف خاطئ | Approval Policy | client_approval_denied |
| INV-008 | رفع نسخة جديدة بعد التعميد يبطل أهلية الإرسال حتى تعميد جديد أو يبدأ Cycle جديدة. | Approvals/Files | Version، Approval Cycle | رفع نسخة | إرسال نسخة غير مراجعة | Approval Policy | file_version_created |
| INV-009 | طلب تعديل العميل لا يلغي المخرج تلقائيا. | Deliverables | Deliverable، Approval Cycle | client change/rejection | إلغاء غير مصرح | Cancellation Policy | client_changes_requested |
| INV-010 | لا يمكن تسليم مخرج يتطلب اعتماد عميل قبل Client Approval. | Deliverables | Deliverable، Approval Cycle | التسليم | تسليم غير مصرح | Delivery Policy | deliverable_delivery_denied |
| INV-011 | لا يمكن استهلاك رصيد قبل التسليم النهائي. | Package Usage | Usage Ledger، Deliverable | consume | نزاع تجاري | Ledger Policy | package_consumption_denied |
| INV-012 | إلغاء مخرج قبل التسليم يحرر الحجز، لا يستهلكه. | Package Usage | Deliverable، Usage Ledger | cancellation | رصيد خاطئ | Ledger Policy | package_reservation_released |
| INV-013 | لا يمكن إلغاء مخرج مستهلك دون Adjustment أو Reversal إداري موثق. | Package Usage | Usage Ledger | بعد التسليم | فقد أثر تجاري | Adjustment Policy | package_adjustment_recorded |
| INV-014 | لا يتم تعديل رصيد الباقة بصمت أو خارج Ledger. | Package Usage | Usage Ledger | أي تعديل | تاريخ مفقود | Ledger Policy | package_adjustment_recorded |
| INV-015 | لا يمكن أن يكون SLA Running وPaused في الوقت نفسه. | SLA | SLA Timeline | start/pause/resume | حساب خاطئ | SLA Timeline Policy | sla_state_denied |
| INV-016 | لا يمكن تسجيل Resume دون Pause سابق مفتوح. | SLA | SLA Segment | resume | تزوير مدة | SLA Policy | sla_resume_denied |
| INV-017 | انتظار العميل لا يحسب كتأخير على سماوة. | SLA | SLA Segment، Delay Owner | التقارير | SLA غير عادل | Delay Owner Policy | sla_paused_waiting_client |
| INV-018 | تعديل موعد أو سبب SLA يحتاج سبب وAudit. | SLA | SLA Timeline | due/pause update | إخفاء التأخير | PERM.SLA.* | sla_override_applied |
| INV-019 | Internal Comment لا يظهر لأي دور عميل. | Collaboration | Comment، Visibility | view/comment queries | تسرب داخلي | Visibility Policy | access_denied_internal_comment |
| INV-020 | File Internal Only لا يظهر ولا ينزل من بوابة العميل. | Files | File Asset | view/download | تسرب ملفات | File Visibility Policy | file_access_denied |
| INV-021 | تغيير Visibility للملف إجراء حساس مستقل. | Files | File Asset | mark client visible/final | كشف غير مقصود | PERM.FILE.MARK_* | file_visibility_changed |
| INV-022 | لا يمكن حذف Audit Event مفاهيميا. | Audit | Audit Event | retention | فقد تدقيق | Audit Policy | audit_delete_denied |
| INV-023 | لا يعتمد صاحب العمل عمله داخليا إذا كانت السياسة تتطلب maker/checker. | Approvals | Approval Cycle، Membership | internal approve | ضعف جودة | Separation Policy | internal_approval_denied |
| INV-024 | Task لا يرتبط بClient مختلف عن Client المخرج الأب. | Internal Work | Task، Deliverable | create/update task | خلط بيانات | Scope Policy | task_create_denied |
| INV-025 | Kanban Stage لا يكفي وحده لتغيير قرار اعتماد أو تسليم. | Internal Work | Board/Card، Deliverable | move card | تجاوز workflow | Transition Policy | kanban_move_denied |
| INV-026 | مغادرة مستخدم لا تمحو تاريخه ولا تترك مخرجات نشطة بلا Owner. | Membership | Membership، Deliverable | offboarding | فقد مسؤولية | Responsibility Transfer Policy | responsibility_transferred |
| INV-027 | Approved Extra Deliverable يحتاج موافقة إدارية مسجلة ولا يستهلك باقة تلقائيا. | Contracts/Packages | Deliverable، Ledger | out-of-package create | عمل خارج نطاق بلا ضبط | Overage Policy | package_overage_approved |
| INV-028 | إعادة فتح مخرج مسلم تحتاج سبب وأثر SLA/رصيد موثق. | Deliverables | Deliverable، SLA، Ledger | reopen | عبث بالتاريخ | Reopening Policy | deliverable_reopened |

## 5. أهم 20 Invariants للانتقال للمرحلة التالية

1. Tenant يمثل الوكالة، وClient داخل Tenant.
2. لا cross-tenant ولا cross-client access.
3. الصلاحية = Action + Resource + Scope + Conditions.
4. Deliverable هو القلب وليس Request.
5. Task عمل داخلي وليس Deliverable.
6. Kanban Card تمثيل لا يتجاوز قواعد المجال.
7. لا ظهور للعميل قبل التعميد الداخلي.
8. الاعتماد الداخلي منفصل عن اعتماد العميل.
9. الاعتماد مرتبط بنسخة محددة.
10. رفع نسخة جديدة بعد التعميد يحتاج دورة جديدة.
11. طلب تعديل العميل لا يلغي المخرج تلقائيا.
12. التسليم فقط يستهلك الرصيد.
13. الرصيد مشتق من Ledger.
14. لا تعديل رصيد بلا Entry وسبب.
15. SLA يحسب من Segments.
16. انتظار العميل يوقف SLA على سماوة.
17. لا Resume دون Pause.
18. Internal Comments وInternal Files لا تظهر للعميل.
19. Audit History غير قابل للمحو.
20. إعادة الفتح والإلغاء والاستثناءات تحتاج سبب وAudit.

## 6. Open Questions مؤثرة على Invariants

| السؤال | الأثر |
| --- | --- |
| هل يوجد اعتماد عميل متعدد في V1؟ | يغير Approval Cycle Invariants. |
| هل الرفض حالة مستقلة؟ | يغير Deliverable وClient Approval transitions. |
| هل يسمح بمخرج خارج باقة؟ | يغير Ledger وContract invariants. |
| كيف يعالج SLA عند إعادة الفتح؟ | يغير SLA Timeline. |
| هل Client Admin يدير مستخدميه ذاتيا؟ | يغير Membership invariants. |

