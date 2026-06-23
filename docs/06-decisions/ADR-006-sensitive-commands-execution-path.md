# ADR-006: Sensitive Commands Execution Path

## Status
Accepted for planning.

## Context
الاعتماد، الإرسال، التسليم، ledger، SLA، وتغيير visibility لا يجب أن تكون mutations عادية من الواجهة.

## Decision
كل عملية حساسة تمر عبر Command Layer server-side تتحقق من permission/scope/state/version وتكتب Audit.

## Alternatives
Direct client SDK writes، API endpoints لكل شاشة، DB triggers only.

## Consequences
إيجابي: invariants قابلة للاختبار. سلبي: يحتاج تصميم commands واضح في Specs.

## Risks
تكرار منطق الصلاحيات إن لم توجد واجهة موحدة.

