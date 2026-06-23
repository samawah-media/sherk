# ADR-007: File Storage Strategy

## Status
Accepted for planning.

## Context
الملفات جزء من المخرج ويجب حمايتها حسب visibility وscope.

## Decision
Supabase Storage للملفات، وPostgreSQL metadata كمصدر قرار الوصول، مع signed URLs قصيرة العمر.

## Alternatives
Public buckets، S3/R2 مباشرة، تخزين داخل قاعدة البيانات.

## Consequences
إيجابي: MVP سريع. سلبي: تكلفة egress وlock-in متوسط.

## Revisit Triggers
Video-heavy usage، تكلفة egress مرتفعة، أو حاجة CDN/transformations.

