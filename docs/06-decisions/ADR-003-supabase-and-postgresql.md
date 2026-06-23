# ADR-003: Supabase and PostgreSQL

## Status
Accepted for planning.

## Context
شريك يحتاج Auth، Postgres، RLS، Storage، وMVP سريع.

## Considered Options
Supabase, custom backend + managed Postgres, Firebase.

## Decision
اعتماد Supabase/PostgreSQL/Auth/Storage في V1.

## Consequences
إيجابي: سرعة وRLS وStorage جاهز. سلبي: lock-in متوسط في Auth/Storage وبعض APIs.

## Risks
RLS misconfiguration، views bypassing RLS، service role exposure.

## Revisit Triggers
متطلبات compliance أقوى، egress مرتفع، أو حدود Supabase تشغيلية.

