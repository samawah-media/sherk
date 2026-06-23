# Domain Events and Audit Model: شريك

**المرحلة:** Phase 04 - Core Domain Model, Conceptual Data Model & Business Invariants  
**نوع الوثيقة:** Domain Event Catalog  
**الحالة:** Draft for owner review  
**آخر تحديث:** 2026-06-22  

## 1. الغرض

هذه الوثيقة تفصل بين Domain Event وAudit Event وNotification Event. لا يستخدم Audit Log كمصدر وحيد لحالة المجال، بل كأثر تدقيقي لمن فعل ماذا ومتى وضمن أي Scope.

## 2. أنواع الأحداث

| النوع | التعريف | مثال | لا يستخدم كـ |
| --- | --- | --- | --- |
| Domain Event | شيء تجاري حدث بالفعل ويهم المجال. | DeliverableCreated | سجل أمني كامل |
| Audit Event | سجل من فعل ماذا ومتى وعلى أي مورد وScope. | actor X granted approval | مصدر حالة المجال الوحيد |
| Notification Event | طلب إشعار مستخدم بناء على حدث. | notify client approver | قرار مجال |

## 3. Event Catalog

| Event | الوصف | Aggregate | Command | Actor | Scope | Preconditions | Payload مفاهيمي | النتائج | Consumers | Notify | Audit | Sensitive | Idempotency | Reversible | Reverse Event |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| PlatformUserCreated | إنشاء هوية مستخدم | User Identity | Create user identity | Platform/System | Platform | هوية غير موجودة | user reference | هوية قابلة للعضوية | Membership | No | Yes | Yes | Yes | No | none |
| TenantCreated | إنشاء Tenant | Tenant | Create tenant | Platform Owner/Admin | Platform | اسم ونطاق واضح | tenant reference | Tenant جاهز للتهيئة | Membership، Audit | Yes | Yes | Yes | Yes | Conditional | TenantSuspended |
| TenantMembershipInvited | دعوة عضو Tenant | Membership | Invite tenant member | Tenant Admin | Tenant | Scope ودور واضحان | invitee، scope، role | دعوة معلقة | Notifications | Yes | Yes | Yes | Yes | Yes | InvitationExpired/Revoked |
| TenantMembershipActivated | قبول/تفعيل عضوية Tenant | Membership | Accept invitation | Invited user/System | Tenant | دعوة صالحة | member، role scope | عضوية نشطة | Permissions | Yes | Yes | Yes | Yes | Yes | MembershipSuspended |
| RoleAssigned | منح دور | Membership | Assign role | Tenant Admin | Scope محدد | الفاعل يملك الصلاحية | role، scope، conditions | دور نشط | Permissions، Audit | Yes | Yes | Yes | Yes | Yes | RoleRevoked |
| RoleRevoked | إلغاء دور | Membership | Revoke role | Tenant Admin | Scope محدد | لا يترك فراغا حرجا | role، reason | الدور غير نشط | Permissions | Yes | Yes | Yes | Yes | Conditional | RoleAssigned |
| TemporaryDelegationStarted | بدء تفويض مؤقت | Membership | Delegate authority | Executive/Tenant Admin | Client/Deliverable | مدة وسبب ونطاق | delegate، dates، scope | تفويض نشط | Approvals | Yes | Yes | Yes | Yes | Yes | DelegationRevoked |
| ClientCreated | إنشاء Client | Client | Create client | PM/Tenant Admin | Tenant | Tenant صحيح | client reference | Client scope جاهز | Contracts، Membership | Yes | Yes | Yes | Yes | Yes | ClientArchived |
| ClientMemberInvited | دعوة مستخدم عميل | Client Membership | Invite client member | PM/Client Admin conditional | Client | Client scope واضح | invitee، client role | دعوة عميل | Notifications | Yes | Yes | Yes | Yes | Yes | InvitationExpired |
| ContractCreated | إنشاء عقد | Contract | Create contract | PM | Client | Client داخل Tenant | contract، period | عقد draft/active | Package | No | Yes | Yes | Yes | Conditional | ContractCancelled |
| ContractActivated | تفعيل عقد | Contract | Activate contract | PM/Executive | Client | بنود واضحة | version، period | يسمح بPackage/Deliverables | Deliverables | Yes | Yes | Yes | Yes | Conditional | ContractEnded |
| ContractAmended | تعديل عقد | Contract | Amend contract | PM/Executive | Client/Contract | سبب وتاريخ | amendment، changed commitment | نسخة/تعديل تاريخي | Ledger، Reporting | Yes | Yes | Yes | Yes | Conditional | New Amendment |
| PackageLineCreated | إنشاء بند باقة | Package Commitment | Add package line | PM | Contract | Unit وQuantity واضحان | unit، quantity | commitment available | Ledger | No | Yes | Yes | Yes | Conditional | PackageAdjustment |
| DeliverableCreated | إنشاء مخرج | Deliverable | Create deliverable | PM/AM conditional | Client/Contract | Client وscope صحيحان | deliverable، type، owner | مخرج not_started | SLA، Ledger | Yes | Yes | Yes | Yes | Yes | DeliverableCancelled |
| PackageQuantityReserved | حجز كمية | Usage Ledger | Reserve quantity | System/PM | Package Line | رصيد كاف أو overage approved | quantity، unit، deliverable | reserved entry | Reporting | No | Yes | Yes | Yes | Yes | PackageReservationReleased |
| DeliverableAssigned | إسناد مخرج | Deliverable | Assign owner/contributor | PM/AM | Deliverable | المستخدم داخل scope | assignee، role | مسؤولية واضحة | Notifications | Yes | Yes | Yes | Yes | Yes | OwnerChanged |
| WorkStarted | بدء العمل | Deliverable | Start work | Owner/PM | Deliverable | owner وSLA context | start marker | المخرج in_progress | SLA | Yes | Yes | Yes | Yes | No | DeliverableCancelled |
| TaskCompleted | إكمال مهمة | Task | Complete task | Assignee | Task | task active | task reference | task done | Deliverables/Reporting | Optional | Yes | No | Yes | Conditional | TaskReopened |
| InternalReviewRequested | طلب مراجعة داخلية | Approval Cycle | Submit for internal review | Owner/Contributor | Deliverable | نسخة/محتوى قابل للمراجعة | version، notes | ready_for_internal_review | PM/MM | Yes | Yes | Yes | Yes | Yes | InternalChangesRequested |
| InternalChangesRequested | تعديل داخلي مطلوب | Approval Cycle | Request internal changes | PM/MM/QR | Deliverable | تعليق داخلي مطلوب | reason، version | internal_changes_requested | Team | Yes | Yes | Yes | Yes | Yes | InternalReviewRequested |
| InternalApprovalGranted | تعميد داخلي | Approval Cycle | Grant internal approval | PM/MM/QR | Deliverable | نسخة محددة وصلاحية | approver، version | internally_approved | Deliverables، Files | Yes | Yes | Yes | Yes | Yes | InternalApprovalWithdrawn |
| InternalApprovalWithdrawn | سحب تعميد داخلي | Approval Cycle | Revoke internal approval | PM/MM/Executive | Deliverable | قبل الإرسال أو سبب تصحيح | reason، version | cycle superseded | Team | Yes | Yes | Yes | Yes | Conditional | InternalApprovalGranted |
| DeliverableSentToClient | إرسال للعميل | Deliverable/Approval | Send to client | PM/MM/AM conditional | Client/Deliverable | internally_approved | version، recipients | waiting_client_approval | SLA، Notifications | Yes | Yes | Yes | Yes | Conditional | SendWithdrawn/Open Question |
| ClientCommentAdded | تعليق عميل | Comment Thread | Add client comment | Client role | Client/Deliverable | visible deliverable | body، context | comment visible scoped | Team/PM | Yes | Yes | Yes | Yes | Conditional | CommentRemoved |
| ClientChangesRequested | تعديل من العميل | Approval Cycle | Request changes | Client Approver | Client/Deliverable | نسخة مرسلة وتعليق | reason، version | client_changes_requested | SLA، Team | Yes | Yes | Yes | Yes | Yes | InternalReviewRequested after rework |
| ClientApprovalGranted | اعتماد العميل | Approval Cycle | Approve client version | Client Approver | Client/Deliverable | نسخة مرسلة وصلاحية | approver، version | client_approved | Deliverables | Yes | Yes | Yes | Yes | Conditional | Reopening/Correction |
| DeliverableDelivered | تسليم نهائي | Deliverable | Deliver final | PM/MM/AM conditional | Deliverable | final asset، approvals satisfied | final version | delivered | SLA، Ledger | Yes | Yes | Yes | Yes | Conditional | DeliverableReopened |
| PackageQuantityConsumed | استهلاك كمية | Usage Ledger | Consume reservation | System/PM | Package Line | delivered وreservation موجود | quantity، unit | consumed entry | Reporting | No | Yes | Yes | Yes | Yes | ConsumptionReversed |
| DeliverableCancelled | إلغاء مخرج | Deliverable | Cancel deliverable | PM/Executive | Deliverable | سبب وأثر رصيد | reason | cancelled | Ledger، SLA | Yes | Yes | Yes | Yes | Conditional | DeliverableReopened/New Deliverable |
| PackageReservationReleased | تحرير حجز | Usage Ledger | Release reservation | System/PM | Package Line | reservation غير مستهلك | quantity، reason | released entry | Reporting | No | Yes | Yes | Yes | Yes | QuantityReserved |
| DeliverableReopened | إعادة فتح مخرج | Deliverable | Reopen deliverable | PM/Executive | Deliverable | سبب وسياسة SLA/credit | reason، prior state | active follow-up | SLA، Ledger | Yes | Yes | Yes | Yes | Conditional | DeliverableDelivered |
| SLAStarted | بدء SLA | SLA Timeline | Start SLA | System/PM | Deliverable | WorkStarted | timestamp، policy | running segment | Reporting | Optional | Yes | Yes | Yes | No | SLACancelled |
| SLAPaused | توقف SLA | SLA Timeline | Pause SLA | System/PM | Deliverable | running segment | reason، delay owner | paused segment | Reporting | Optional | Yes | Yes | Yes | Yes | SLAResumed |
| SLAResumed | استئناف SLA | SLA Timeline | Resume SLA | System/PM | Deliverable | paused segment مفتوح | reason | running segment | Reporting | Optional | Yes | Yes | Yes | Yes | SLAPaused |
| SLAAtRisk | SLA معرض للخطر | SLA Timeline | Mark at risk | System | Deliverable | risk threshold | threshold، remaining | at_risk | Notifications | Yes | Yes | No | Yes | Conditional | SLACompleted |
| SLABreached | خرق SLA | SLA Timeline | Mark breached | System | Deliverable | target exceeded on owner time | breached target | overdue/breached | PM/Reporting | Yes | Yes | Yes | Yes | No | Resolution |
| SLAOverrideApplied | تجاوز SLA | SLA Timeline | Apply override | Executive/PM | Deliverable | سبب وتأكيد | old/new، reason | correction entry | Audit/Reporting | Yes | Yes | Yes | Yes | Yes | SLAOverrideApplied opposite |
| DelayOwnerChanged | تغيير مالك التأخير | SLA Timeline | Record delay owner | PM/MM | Deliverable | سبب واضح | from/to، reason | reporting updated | Reporting | Optional | Yes | Yes | Yes | Yes | DelayOwnerChanged |
| FileUploaded | رفع ملف | File Asset | Upload file | Team/Client/PM | File scope | permission + context | file ref، visibility | file asset/version | Approvals | Optional | Yes | Yes | Yes | Conditional | FileRemoved |
| FileVersionCreated | إنشاء نسخة ملف | File Asset | Upload version | Team/PM | File/Deliverable | file exists أو new asset | version، uploader | version history | Approvals | Optional | Yes | Yes | Yes | Conditional | FileVersionSuperseded |
| FileVisibilityChanged | تغيير رؤية ملف | File Asset | Change visibility | PM/MM/AM conditional | File | permission + approval gates | from/to، reason | visibility updated | Client Portal | Yes | Yes | Yes | Yes | Yes | FileVisibilityChanged |
| FileMarkedFinal | تحديد ملف نهائي | File Asset | Mark final asset | PM/MM | Deliverable/File | approval/delivery rules | version | final asset marker | Client Portal، Ledger | Yes | Yes | Yes | Yes | Yes | FinalMarkerRevoked |
| CommentAdded | إضافة تعليق | Comment Thread | Add comment | Authorized user | Comment scope | visibility allowed | body، visibility | comment in thread | Notifications | Optional | Yes | Depends | Yes | Conditional | CommentRemoved |
| CommentEdited | تعديل تعليق | Comment Thread | Edit comment | Author/PM | Comment | edit policy | old/new summary | corrected comment | Audit | Optional | Yes | Yes | Yes | Conditional | CommentEdited |
| CommentRemoved | إزالة تعليق | Comment Thread | Remove comment | Author/PM | Comment | لا يمحو قرارا | reason | hidden/removed state | Audit | Optional | Yes | Yes | Yes | Conditional | CommentRestored |
| AuditExportRequested | طلب تصدير Audit | Audit | Request audit export | Executive/Tenant Owner | Tenant/Client | سبب ونطاق زمني | period، scope | export request | Compliance | Yes | Yes | Yes | Yes | Conditional | none |

## 4. قواعد Audit

- كل إجراء يغير صلاحية أو اعتماد أو SLA أو رصيد أو Visibility يجب أن يولد Audit Event.
- Audit Event يجب أن يحتوي مفاهيميا على Actor وRole/Delegation وScope وTarget وAction ووقت وسبب عند الحساسية.
- Audit Log لا يستخدم لبناء الحالة التشغيلية وحده؛ الحالة تعيش في Aggregates وسجلات المجال، والتدقيق يثبت الأثر.
- محاولات الرفض الحساسة مثل cross-client access أو client_viewer approval يجب أن تسجل حسب سياسة الأمن.

