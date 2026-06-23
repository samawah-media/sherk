# ADR-002: Next.js and TypeScript

## Status
Accepted for planning.

## Context
المنتج يحتاج SaaS RTL حديث، بوابات أدوار، وServer-side enforcement.

## Considered Options
Next.js, Remix, SPA منفصلة مع Backend مستقل.

## Decision
Next.js App Router وTypeScript كمنصة Full-stack V1.

## Consequences
إيجابي: سرعة MVP، SSR، Server Actions/Route Handlers. سلبي: خطر وضع منطق أعمال داخل UI إذا لم تضبط الحدود.

## Risks
يجب منع business logic الحساس في Client Components.

## Related Requirements
Server-only commands، RTL UX، responsive client approval.

