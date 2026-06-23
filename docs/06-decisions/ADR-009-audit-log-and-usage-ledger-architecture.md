# ADR-009: Audit Log and Usage Ledger Architecture

## Status
Accepted for planning.

## Context
لا قرار حساس دون Audit، ولا رصيد قابل للتعديل المباشر.

## Decision
Audit Events وUsage Ledger append-only، مع projections للعرض.

## Alternatives
عدادات mutable، audit مبسط في activity فقط، event sourcing كامل.

## Consequences
إيجابي: قابلية تدقيق قوية. سلبي: يحتاج retention وprojection strategy.

## Risks
نمو السجلات وتعقيد reversals.

