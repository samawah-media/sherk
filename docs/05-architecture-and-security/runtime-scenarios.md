# Runtime Scenarios: شريك

**الغرض:** توثيق سيناريوهات runtime الإلزامية كمصفوفة قبل Specs والكود.

## 1. Legend

| Field | Meaning |
| --- | --- |
| AuthN | طريقة إثبات الهوية |
| AuthZ | أهم تحقق صلاحية |
| Tx | حدود المعاملة |
| Audit | الحدث التدقيقي |
| Failure | نمط فشل أساسي |

## 2. Scenarios

| # | Scenario | Actors | Containers | AuthN | AuthZ/Tenant Context | Tx/Data | Events/Audit | Failure/Retry/Observability |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | تسجيل دخول وتحديد Tenant Context | User | Web, Auth, DB | password/session | active membership | read memberships | login/session audit optional | invalid user, no membership |
| 2 | انتقال مستخدم بين عميلين مسندين | Team/AM | Web, DB | session | both client scopes | read scoped clients | scope_selected | deny if unassigned |
| 3 | وصول إلى Client غير مصرح | Any | Web, DB | session | missing client scope | no write | access_denied_cross_client | generic 404/denied |
| 4 | إنشاء مخرج وحجز باقة | PM | Web, Command, DB | session | PERM.DELIV.CREATE | deliverable + ledger + audit | DeliverableCreated, PackageReserved | rollback if no credit |
| 5 | رفع ملف Internal Only | Team | Web, Storage, DB | session | assigned + PERM.FILE.UPLOAD_INTERNAL | storage object + metadata | FileUploaded | cleanup orphan upload |
| 6 | تغيير ملف إلى Client Visible | PM/MM | Command, DB, Storage | session | PERM.FILE.MARK_CLIENT_VISIBLE + approval gate | metadata visibility + audit | FileVisibilityChanged | deny if no internal approval |
| 7 | طلب مراجعة داخلية | Owner | Command, DB | session | PERM.APPROVAL.REQUEST_INTERNAL | deliverable state + approval cycle | InternalReviewRequested | reject missing version |
| 8 | التعميد الداخلي | PM/MM/QR | Command, DB | session/reauth optional | PERM.APPROVAL.INTERNAL_GRANT + maker/checker | approval + state + audit | InternalApprovalGranted | deny stale version |
| 9 | إرسال المخرج للعميل | PM/MM/AM | Command, DB, Jobs | session | PERM.APPROVAL.SEND_CLIENT + internally approved | state + SLA pause + outbox | DeliverableSentToClient, SLAPaused | email retry via outbox |
| 10 | اعتماد العميل لنسخة محددة | Client Approver | Web, Command, DB | session | PERM.APPROVAL.CLIENT_GRANT + client scope | approval + state + audit | ClientApprovalGranted | deny wrong client |
| 11 | محاولة اعتماد نسخة Superseded | Client Approver | Command, DB | session | version freshness fails | no write | approval_denied_superseded | show refresh message |
| 12 | توقف SLA بانتظار العميل | System | Command/DB | derived event | deliverable waiting client | SLA segment close/open | SLAPaused | idempotent pause |
| 13 | استئناف SLA | Client/PM/System | Command, DB | session/system | change request or return to team | close pause + running | SLAResumed | deny no open pause |
| 14 | اكتشاف SLA Breach | Job | Jobs, DB | service identity | per-tenant scoped job | update SLA status/projection | SLABreached | retry tenant batch |
| 15 | إلغاء مخرج وتحرير الحجز | PM/Executive | Command, DB | session | PERM.DELIV.CANCEL | deliverable + ledger release + SLA cancel | DeliverableCancelled, ReservationReleased | deny consumed without reversal |
| 16 | تسليم واستهلاك الرصيد | PM/MM | Command, DB | session | PERM.DELIV.DELIVER | deliverable + ledger consume + SLA complete | DeliverableDelivered, QuantityConsumed | rollback if no reservation |
| 17 | إعادة فتح مخرج مستهلك | PM/Executive | Command, DB | session | PERM.DELIV.REOPEN | reopen + policy-specific SLA/ledger | DeliverableReopened | open question for credit |
| 18 | تعليق داخلي لا يصل للعميل | Team | Web, DB | session | PERM.COMMENT.INTERNAL_ADD | insert internal comment | InternalCommentAdded | client read denied |
| 19 | موظف يغادر ونقل مسؤولياته | Tenant Admin/PM | Command, DB | session | PERM.USR.RESPONSIBILITY_TRANSFER | membership + assignments | ResponsibilityTransferred | block if owner missing |
| 20 | Break-Glass | Tenant Owner/Executive | Command, DB | strong session/reauth | restricted override | scoped session + audit | BreakGlassStarted/Ended | review required |
| 21 | Background Job يعالج عدة Tenants | System | Jobs, DB | service | tenant loop scope | per-tenant batch | JobRunRecorded | no cross-tenant cache |
| 22 | Realtime update داخل Kanban | Team | DB, Realtime, Web | session | scoped channel | publish minimal payload | CardUpdated | fallback polling |
| 23 | فشل رفع ملف | Team/Client | Web, Storage, DB | session | upload permission | partial object cleanup | UploadFailed | retry/resume via Uppy |
| 24 | فشل إرسال بريد | Job | Jobs, Email | service | notification scope | delivery attempt | EmailDeliveryFailed | retry with backoff |
| 25 | استعادة البيانات بعد حذف أو عطل | Admin/DevOps | DB, Storage, Backup | admin | incident scope | restore procedure | RecoveryStarted/Completed | RPO/RTO measured |

## 3. Required Sequence Diagrams Later

عند الانتقال إلى Specs، يجب تحويل السيناريوهات 4، 8، 9، 10، 16، 21 إلى sequence diagrams تفصيلية لأنها تحمل أعلى مخاطر عزل واتساق.

