# ADR-005: RLS Plus Server-Side Authorization

## Status
Accepted for planning.

## Context
AGENTS.md يمنع أي Query/API/RLS دون tenant/client isolation.

## Decision
استخدام RLS كطبقة قاعدة بيانات مع Authorization Layer server-side لكل العمليات الحساسة.

## Alternatives
RLS only، server authorization only، backend service with no direct DB exposure.

## Consequences
إيجابي: Defense in depth. سلبي: يتطلب اختبارات ومصفوفة سياسات.

## Risks
سياسات عامة زائدة، اعتماد على claims قديمة، أو views تتجاوز RLS.

## Related Threats
T02, T04, T07, T14.

