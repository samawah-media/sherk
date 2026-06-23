# ADR-008: SLA and Background Job Strategy

## Status
Accepted for planning.

## Context
SLA إلزامي في V1 ويتوقف عند انتظار العميل.

## Decision
تمثيل SLA كTimeline Segments، وتشغيل Jobs للفحص والتنبيهات، مع تحديثات ناتجة من state transitions.

## Alternatives
حقل status وحيد، حساب في الواجهة، نظام workflow خارجي.

## Consequences
إيجابي: عدالة وتأريخ. سلبي: يحتاج حسابات زمنية واختبارات.

## Risks
timezone/business calendar ambiguity، وإعادة الفتح.

