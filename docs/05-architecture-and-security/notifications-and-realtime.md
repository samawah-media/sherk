# Notifications and Realtime: شريك

## 1. Scope

V1 يحتاج إشعارات عملية لا نظام مراسلة كامل.

## 2. Notification Types

- دعوة مستخدم.
- مخرج بانتظار اعتماد العميل.
- طلب تعديل داخلي.
- طلب تعديل من العميل.
- ملف تقرير جديد.
- SLA at-risk/overdue.

## 3. Realtime

Realtime يستخدم بحذر للـKanban أو activity فقط داخل scope. لا تبث payload يحتوي internal content إلى قناة يمكن أن يشترك بها العميل.

## 4. Delivery Pattern

Domain event -> notification outbox -> job sends email/in-app -> delivery attempt recorded.

## 5. Failure Handling

فشل البريد لا يفشل القرار التجاري بعد نجاحه، لكنه يظهر كdelivery failure ويعاد المحاولة بحدود.

