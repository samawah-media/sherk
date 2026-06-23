# ADR-010: Realtime Usage Strategy

## Status
Proposed.

## Context
Kanban وتجربة الفريق تستفيد من Realtime، لكن التسرب عبر القنوات خطر.

## Decision
استخدام Realtime فقط للبيانات scoped وغير الحساسة، وبـpayloads مختصرة.

## Alternatives
Polling فقط، Realtime واسع، WebSocket مخصص.

## Consequences
إيجابي: UX أفضل. سلبي: يحتاج channel authorization دقيقة.

## Revisit Triggers
إذا زادت مخاطر التسرب أو فشلت قنوات Supabase في التحكم الدقيق.

