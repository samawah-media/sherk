# ADR-004: Shared Database and Shared Schema Multitenancy

## Status
Accepted for planning.

## Context
البداية تقارب أربعة عملاء وسماوة أول Tenant. Client داخل Tenant وليس Tenant مستقل.

## Decision
Shared database/shared schema مع `tenant_id` و`client_id` وRLS وسياسات Scope.

## Alternatives
Database per tenant، schema per tenant، hybrid.

## Consequences
إيجابي: تكلفة وتشغيل أبسط. سلبي: خطأ scope قد يكون خطيرا.

## Risks
Tenant Context leak. يعالج بالتحقق server-side وRLS واختبارات tenant isolation.

## Revisit Triggers
Tenants كبار، متطلبات عزل قانونية، أو noisy neighbor واضح.

