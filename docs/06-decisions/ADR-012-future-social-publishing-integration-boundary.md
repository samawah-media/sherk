# ADR-012: Future Social Publishing Integration Boundary

## Status
Accepted for planning as out-of-scope boundary.

## Context
Social scheduling خارج V1، وBrightBean/Mixpost/Postiz مراجع لا قواعد بناء.

## Decision
عدم بناء social publishing في V1، وترك Integration Boundary مستقبلية مرتبطة بالمخرج والملفات والاعتماد.

## Alternatives
دمج Mixpost/Postiz مبكرا، بناء جدولة داخلية، تجاهل الحدود.

## Consequences
إيجابي: يحمي MVP من التشعب. سلبي: قد يحتاج إعادة تصميم جزئي عند الإضافة لاحقا إذا لم نحافظ على boundary.

## Revisit Triggers
اعتماد مالك بإضافة الجدولة، مراجعة ترخيص، وADR جديد.

