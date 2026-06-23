# C4 Component Boundaries: شريك

## 1. وحدات Modular Monolith

| Module | يملك | لا يملك |
| --- | --- | --- |
| Identity & Memberships | users, memberships, roles, delegations | محتوى العميل |
| Tenant Administration | tenant settings, calendars, platform governance | تفاصيل المخرجات |
| Client Management | client profile, client team scope | contracts ledger |
| Contracts & Packages | contracts, commitments, package policies | deliverable lifecycle |
| Deliverables | lifecycle, assignments, progress | file binary storage |
| Tasks & Kanban | cards/tasks and board projections | approval decisions |
| Approvals | internal/client decisions, version binding | package consumption |
| Comments | threads, visibility, mentions | approval records |
| Files & Assets | metadata, versions, visibility | business approval logic |
| SLA & Escalation | timeline segments, delay ownership | deliverable content |
| Usage Ledger | reservation/consumption/reversal entries | mutable balance counters |
| Audit & Activity | audit events and filtered activity | operational state source |
| Notifications | delivery attempts and preferences | domain decisions |
| Reporting | scoped read models | write-side invariants |

## 2. الاتصال بين الوحدات

- Commands تستدعي وحدات المجال عبر واجهات داخلية لا عبر queries عشوائية.
- Events تسجل بعد نجاح المعاملة أو عبر Outbox.
- Read models مسموحة بشرط ألا تكسر العزل.

## 3. معاملات يجب أن تكون Transaction واحدة

- إنشاء مخرج + حجز باقة + Audit.
- إلغاء مخرج + تحرير حجز + إيقاف SLA + Audit.
- تسليم نهائي + استهلاك الحجز + إكمال SLA + Audit.
- اعتماد داخلي + تثبيت version + Audit.
- تغيير رؤية ملف حساس + Audit.

## 4. عمليات يمكن تأجيلها كJobs

- إرسال بريد.
- تحديث read models غير حرجة.
- تنبيهات SLA at-risk.
- تنظيف uploads الفاشلة.
- توليد exports.

