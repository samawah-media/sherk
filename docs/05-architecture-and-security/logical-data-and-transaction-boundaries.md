# Logical Data and Transaction Boundaries: شريك

## 1. Aggregates

يعتمد V1 على Aggregates المثبتة في نموذج المجال: Tenant, Client, Membership, Contract, Package Commitment, Deliverable, Approval Cycle, File Asset, SLA Timeline, Usage Ledger, Audit Event.

## 2. Transaction Boundaries

| Command | Boundary |
| --- | --- |
| Create deliverable | deliverable + reservation ledger + audit |
| Submit internal review | deliverable state + approval cycle + audit |
| Grant internal approval | approval + version binding + deliverable state + audit |
| Send to client | deliverable state + SLA pause + audit + notification event |
| Client approve | approval + deliverable state + SLA transition + audit |
| Deliver | deliverable + ledger consume + SLA complete + audit |
| Cancel before delivery | deliverable + reservation release + SLA cancel + audit |

## 3. Event-Driven Candidates

- email notifications.
- realtime board updates.
- reporting projections.
- SLA at-risk notifications.
- audit exports.

## 4. Concurrency

استخدم optimistic concurrency مفاهيميا عبر version/revision. أي قرار اعتماد يجب أن يتحقق أن version ما زالت current وموجهة لنفس العميل.

## 5. Idempotency

الأوامر المعرضة للتكرار تحمل idempotency key أو unique business constraint لاحقا: client approval، send notification، consume reservation، upload finalize.

