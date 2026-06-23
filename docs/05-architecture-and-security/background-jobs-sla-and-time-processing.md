# Background Jobs, SLA and Time Processing: شريك

## 1. SLA Model

SLA يحسب من Timeline Segments:

- running.
- paused_waiting_client.
- paused_waiting_internal_decision.
- completed.
- cancelled.

لا يعتمد على حقل mutable واحد.

## 2. Triggers

| Event | أثر SLA |
| --- | --- |
| WorkStarted | start running segment |
| DeliverableSentToClient | pause waiting client |
| ClientChangesRequested | resume running |
| ClientApprovalGranted | ينتقل للتسليم أو يظل حسب السياسة |
| DeliverableDelivered | complete |
| DeliverableCancelled | cancel |

## 3. Jobs

- scan at-risk.
- scan overdue.
- send reminders.
- close stale upload records.
- process notification outbox.
- rebuild reporting projections عند الحاجة.

## 4. Time Rules

- timezone الافتراضي حسب Tenant، وسماوة تستخدم Africa/Cairo في بيئة العمل الحالية ما لم تعتمد منطقة أخرى.
- Business Calendar مفهوم V1 بسيط، لا FullCalendar.
- انتظار العميل لا يحسب على سماوة.

## 5. Safe Multi-Tenant Jobs

كل job يعالج tenants على دفعات، ولا يحمل نتائج Tenant إلى آخر. logs تشمل tenant_id دون محتوى حساس.

