# ADR-001: Modular Monolith for V1

## Status
Accepted for planning.

## Context
شريك يبدأ بـPilot صغير لكنه يحتاج حدود مجال واضحة وقابلية توسع لاحقة.

## Decision Drivers
سرعة MVP، العزل، تقليل التعقيد، قابلية فصل modules لاحقا.

## Considered Options
- Modular Monolith.
- Microservices.
- Monolith غير منظم.

## Decision
استخدام Modular Monolith داخل تطبيق واحد وقاعدة واحدة، مع modules واضحة.

## Consequences
إيجابي: أسرع وأبسط. سلبي: يحتاج انضباط حدود modules.

## Risks
تضخم الحدود الداخلية. يعالج بمراجعة architecture-traceability.

## Revisit Triggers
زيادة الفريق، متطلبات عزل compute، أو حمل Jobs عال.

