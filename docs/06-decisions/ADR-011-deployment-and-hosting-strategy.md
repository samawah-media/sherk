# ADR-011: Deployment and Hosting Strategy

## Status
Proposed.

## Context
Next.js يحتاج استضافة مستقرة وبيئات Preview/Staging/Production.

## Decision
استضافة Next.js على Vercel أو منصة متوافقة، مع Supabase project منفصل للـproduction وأسرار منفصلة.

## Alternatives
Self-hosted Node، Netlify، VPS.

## Consequences
إيجابي: سرعة إطلاق. سلبي: lock-in متوسط وتكلفة حسب الاستخدام.

## Revisit Triggers
متطلبات compliance، التكلفة، أو قيود وظائف server/runtime.

