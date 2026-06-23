# Audit Events and Ledger Architecture: شريك

## 1. Audit

Audit Event يسجل من فعل ماذا ومتى وضمن أي نطاق وعلى أي مورد. لا يستخدم وحده كمصدر الحالة التشغيلية.

## 2. Audit Payload

- actor_user_id.
- actor_role_snapshot.
- tenant_id.
- client_id عند وجوده.
- target_type وtarget_id.
- action.
- before/after summary لا يحتوي أسرار غير لازمة.
- reason عند الحساسية.
- request_id/ip/user_agent عند الحاجة.

## 3. Usage Ledger

الرصيد مشتق من entries:

- commitment_added.
- quantity_reserved.
- reservation_released.
- quantity_consumed.
- consumption_reversed.
- adjustment.

## 4. Ledger Rules

- append-only.
- لا تعديل عداد مباشر.
- consume فقط عند delivery.
- cancellation قبل delivery يحرر reservation.
- reversal بعد consumption يحتاج قرار إداري وسبب.

## 5. Audit vs Ledger

Ledger يثبت الأثر التجاري للرصيد. Audit يثبت actor والقرار. العملية الحساسة غالبا تكتب الاثنين.

