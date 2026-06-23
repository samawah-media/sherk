# Core Entities and Value Objects: شريك

**المرحلة:** Phase 04 - Core Domain Model, Conceptual Data Model & Business Invariants  
**نوع الوثيقة:** Conceptual Entity Classification  
**الحالة:** Draft for owner review  
**آخر تحديث:** 2026-06-22  

## 1. الغرض

هذه الوثيقة تصنف عناصر مجال شريك إلى Entities وAggregate Roots وValue Objects وPolicies وLedgers وRead Models وUI Representations. التصنيف مفاهيمي ولا يمثل تصميم قاعدة بيانات.

## 2. قواعد التصنيف

| النوع | متى نستخدمه؟ | مثال |
| --- | --- | --- |
| Entity | له هوية ودورة حياة مستقلة نسبيا. | Client، Deliverable، Contract. |
| Aggregate Root | يملك حدود اتساق وقرارات داخلية. | Deliverable، Approval Cycle، Usage Ledger. |
| Value Object | يعرف بالقيمة لا بالهوية. | Date Range، Quantity، Visibility Level. |
| Policy | قاعدة تقرر السماح أو الحساب. | Approval Policy، Progress Policy. |
| Domain Service | منطق يعبر أكثر من Aggregate دون امتلاك حالة مستقلة. | Reservation Decision Service. |
| Ledger | سجل أحداث مالية/كمية مشتق منه الرصيد. | Usage Ledger. |
| Event | شيء حدث بالفعل في المجال. | DeliverableCreated. |
| Read Model / Projection | عرض مشتق للقراءة والتقارير. | Client Dashboard Summary. |
| UI Representation | تمثيل واجهة لا يجب أن يملك قواعد المجال. | Kanban Card. |

## 3. الكيانات وAggregate Roots

| الاسم | النوع | الغرض | الهوية | Scope | المالك | دورة الحياة | علاقات مفاهيمية | أوامر مؤثرة | أحداث ناتجة | الرؤية | الأرشفة/الحذف | Audit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Platform | Entity | حوكمة المنتج متعدد Tenants | Platform identity | Platform | Platform Owner | مستمر | يضم Tenants | Create Tenant | TenantCreated | Restricted | لا يحذف في V1 | إدارة Tenants |
| Tenant | Aggregate Root | يمثل الوكالة المشغلة | Tenant identity | Platform | Tenant Owner | إنشاء، تفعيل، تعطيل | يضم Clients ومستخدمين | Activate/Suspend Tenant | TenantCreated | Tenant scoped | تعطيل لا حذف | كل تغيير حوكمة |
| Client | Aggregate Root | يمثل شركة عميلة داخل Tenant | Client identity | Tenant/Client | Tenant Admin/PM | إنشاء، تفعيل، أرشفة | عقود، مخرجات، أعضاء | Create/Update/Archive Client | ClientCreated | Client scoped | أرشفة فقط | إنشاء وتعديل وأرشفة |
| User Identity | Entity | حساب شخص عالمي | User identity | Platform | المستخدم/Platform | إنشاء، تفعيل، تعطيل | Memberships | Create Identity | PlatformUserCreated | Restricted | لا يحذف إذا له Audit | إنشاء وتعطيل |
| Membership | Aggregate Root | ارتباط هوية بنطاق ودور | Membership identity | Tenant/Client | Tenant Admin | دعوة، تفعيل، تعليق، إزالة | Role Assignments | Invite/Activate/Suspend | TenantMembershipActivated | Scoped | إزالة لا تمحو التاريخ | كل تغيير دور |
| Role Assignment | Entity | منح دور ضمن Scope | Assignment identity | Scope محدد | Tenant Admin | منح، تعديل، إلغاء | Role، Scope، User | Assign/Revoke Role | RoleAssigned | Management | أرشفة تاريخية | إلزامي |
| Contract | Aggregate Root | اتفاق تجاري زمني | Contract identity | Client | PM/Executive | Draft، Active، Amended، Ended | Versions، Package Lines | Create/Amend/Renew | ContractActivated | Client limited | أرشفة النسخ | كل تعديل |
| Package Commitment | Aggregate Root | التزامات كمية أو غير كمية | Commitment identity | Contract/Client | PM/Executive | إنشاء، تعديل، انتهاء | Lines، Usage Ledger | Add Line/Amend | PackageLineCreated | Client limited | لا حذف للتاريخ | تعديلات الكمية |
| Deliverable | Aggregate Root | المخرج المتفق عليه ودورة حياته | Deliverable identity | Client/Contract | PM/AM حسب الصلاحية | من الإنشاء إلى التسليم/الإلغاء/الأرشفة | Tasks، Versions، Approval، SLA، Ledger refs | Create/Start/Deliver/Reopen | DeliverableCreated | حسب المرحلة | أرشفة بعد الإغلاق | كل انتقال |
| Deliverable Version | Entity | نسخة عمل أو إرسال للمخرج | Version identity | Deliverable | Owner/PM | رفع، مراجعة، إرسال، نهائية | Files، Approvals | Upload/Mark candidate | FileVersionCreated | Visibility scoped | لا overwrite صامت | رفع واعتماد |
| Task | Aggregate Root أو Entity تابعة حسب التعقيد | وحدة عمل داخلية | Task identity | Deliverable/Client | PM/Owner | Open، In Progress، Done، Archived | Deliverable، Assignees | Create/Assign/Complete | TaskCompleted | Internal | أرشفة لا حذف | تغييرات مهمة |
| Board | Entity / UI-operational | تنظيم Kanban داخلي | Board identity | Tenant/Client | PM | إنشاء، تحديث أعمدة، أرشفة | Cards، Stages | Configure Board | BoardConfigured | Internal | أرشفة | تغيرات مهمة |
| Card | UI Representation | تمثيل مرئي لمخرج أو مهمة | Derived reference | Board | Board | يظهر ويختفي حسب المصدر | Deliverable أو Task | Move Card | CardMoved | Internal | لا تاريخ مستقل غالبا | الحركة إذا غيرت حالة |
| Approval Cycle | Aggregate Root | دورة قرار على نسخة محددة | Cycle identity | Deliverable | PM/Approver | Open، Decided، Superseded | Decisions، Version | Request/Grant/Request Change | InternalApprovalGranted | حسب النوع | محفوظ تاريخيا | إلزامي |
| Comment Thread | Aggregate Root | محادثة مرتبطة بسياق ورؤية | Thread identity | Deliverable/File/Approval | Context owner | Open، Resolved، Archived | Comments | Add/Edit/Resolve | CommentAdded | Visibility scoped | لا حذف أثر | تعديل/حذف حساس |
| File Asset | Aggregate Root | أصل ملف بسياق ورؤية | File identity | Tenant/Client/Deliverable | Uploader/PM | Uploaded، Versioned، Final، Archived | Versions، Visibility | Upload/Change Visibility | FileUploaded | حسب الرؤية | soft delete فقط | التنزيل/الرؤية |
| SLA Timeline | Aggregate Root | تاريخ حساب SLA بالمقاطع | Timeline identity | Deliverable | SLA Policy owner | Not started، Running، Paused، Completed | Segments، Escalations | Start/Pause/Resume | SLAPaused | Management/client limited | محفوظ | كل pause/resume |
| Usage Ledger | Aggregate Root / Ledger | سجل حجز واستهلاك الرصيد | Ledger identity | Contract/Package/Client | PM/Executive | Open، Closed per period | Entries | Reserve/Consume/Release | PackageQuantityReserved | Client limited | لا حذف | كل entry |
| Audit Event | Entity/Event | سجل تدقيق | Event identity | Scope event | System | Append-only | Actor، Scope، Target | Record Audit | AuditEntryRecorded | Audit scoped | غير قابل للمحو مفاهيميا | هو التدقيق |

## 4. Value Objects

| الاسم | لماذا Value Object؟ | الخصائص المفاهيمية | القواعد | يستخدم في |
| --- | --- | --- | --- | --- |
| TenantId | يعرف بالقيمة ويشير للنطاق. | معرف Tenant | لا يخلط مع ClientId | كل Aggregate Tenant-owned |
| ClientId | قيمة نطاق العميل. | معرف Client داخل Tenant | لا يستخدم وحده دون Tenant context مفاهيميا | Deliverable، Contract، File |
| DeliverableId | مرجع لمخرج. | معرف مخرج | لا يمنح صلاحية وحده | Task، Approval، SLA |
| DateRange | فترة لها بداية ونهاية. | start، end مفاهيميا | النهاية لا تسبق البداية | Contract، SLA |
| Quantity | كمية بعدد ووحدة. | amount، unit | لا تخلط وحدات مختلفة بلا سياسة | Package Line، Ledger |
| UnitOfMeasure | نوع وحدة الالتزام. | post، reel، report، design | لا تحويل عام في V1 | Package Line |
| PackageBalance | قيمة مشتقة من Ledger. | committed/reserved/consumed/released | لا تخزن كمصدر حقيقة وحيد | Reports |
| VersionNumber | ترتيب نسخة داخل سياق. | رقم أو label | لا يعاد استخدامه لنفس السياق | File، Deliverable Version |
| VisibilityLevel | حكم رؤية. | Internal Only، Client Visible، Final | Internal Only لا يظهر للعميل | Files، Comments |
| ApprovalPolicy | قواعد اعتماد. | required approver، separation، cycle rule | لا تعتمد نسخة غير مرسلة | Approval Cycle |
| SLA Duration | مدة مستهدفة. | مقدار وزمن | يحسب عبر Business Calendar | SLA Policy |
| SLA Calendar Policy | قواعد أيام العمل. | timezone، working days | Tenant timezone في V1 | SLA Timeline |
| Progress Percentage | قيمة تقدم مشتقة. | 0-100 | ترتبط بالحالة ولا تكفي وحدها | Deliverable |
| Timezone | منطقة زمنية. | Tenant timezone | لا يستخدم توقيت المستخدم لحساب SLA | SLA |
| Pause Reason | سبب توقف. | waiting_client، internal_decision | مطلوب لكل Pause | SLA Segment |
| Delay Owner | مالك وقت. | team، client، internal_decision | يظهر للعميل فقط بنسخة مبسطة عند الاعتماد | SLA |
| Assignment Scope | نطاق صلاحية. | Platform/Tenant/Client/Deliverable | الصلاحية لا تعمل بلا scope | Permissions |

## 5. Policies and Domain Services

| الاسم | النوع | المسؤولية |
| --- | --- | --- |
| Progress Policy | Policy | اشتقاق progress من حالة المخرج وحالات فرعية. |
| Approval Policy | Policy | تحديد هل يحتاج المخرج اعتماد عميل ومن يملك القرار. |
| Visibility Policy | Policy | تحديد من يرى ملفا أو تعليقا أو نسخة. |
| SLA Policy | Policy | تحديد target وrisk وpause/resume rules. |
| Package Reservation Policy | Policy | هل يمكن حجز كمية أو يحتاج overage approval. |
| Permission Evaluation | Domain Service | تقييم Action + Resource + Scope + Conditions. |
| Ledger Balance Calculator | Domain Service | اشتقاق الرصيد من entries دون تعديل التاريخ. |
| SLA Timeline Calculator | Domain Service | حساب elapsed/paused/business time من segments. |

## 6. Read Models / Projections

| Read Model | مصدره | لا يمتلك |
| --- | --- | --- |
| Client Dashboard Summary | Deliverables، Ledger، Approvals، Files | قواعد اعتماد أو رصيد |
| Admin SLA Dashboard | SLA Timeline، Deliverables | تعديل SLA |
| Team Kanban View | Tasks، Deliverables، Board config | تخطي transitions |
| Package Balance View | Usage Ledger | تعديل الرصيد |
| External Approval History | Approval Decisions، Audit Events filtered | Audit الداخلي الكامل |

## 7. UI Representations فقط

| العنصر | لماذا UI فقط؟ | المصدر |
| --- | --- | --- |
| Kanban Card | يمثل Deliverable أو Task ولا يقرر وحده. | Deliverable/Task state + Board config |
| Dashboard Badge | عرض مشتق لا يغير المجال. | Projection |
| Sidebar Item | Navigation فقط. | Role/Workspace |
| Progress Bar | تمثيل progress مشتق. | Progress Policy |

