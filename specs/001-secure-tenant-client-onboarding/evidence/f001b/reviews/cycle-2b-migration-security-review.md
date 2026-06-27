# F-001B Cycle 2B Migration Security Review

Date: 2026-06-27
Worktree: `D:\code - projects\sherk-f001b-uat`
Branch: `feat/f001b-staging-uat-enablement`
Reviewed HEAD: `a22a5f596fc9d298246d223bea9a1187808a47a0`
Migration reviewed: `supabase/migrations/202606270001_f001b_client_write_workflows.sql`
Result: **BLOCKED - do not apply to hosted staging**

## Executive Summary

Cycle 2A is now committed, local verification is green, and the linked Supabase project is `samawah-f001-preview-staging`. The migration must not be applied to hosted staging yet because the write grants expose a direct Data API write path to `public.clients`.

The intended safe path is the RPC functions, which create/update a client and append `ClientCreated` or `ClientUpdated` audit records in the same transaction. However, the migration also grants direct `insert, update` on `public.clients` to `authenticated`. Existing RLS policies allow tenant owners/administrators to insert/update client rows directly. That direct path bypasses the RPC transaction, audit append, and optimistic revision guard.

Severity: **HIGH** because it affects audit completeness and silent overwrite protection for a sensitive customer-scoped write workflow.

## Review Checklist

| Check | Result | Evidence |
|---|---:|---|
| RPC uses `SECURITY INVOKER` | PASS | `202606270001...sql:29`, `:89`, `:179` |
| RLS remains enabled | PASS | Base migration enables RLS for `public.clients` and `public.audit_events`; local pgTAP confirms active policies |
| No `SECURITY DEFINER` in new RPC | PASS | New migration only uses `security invoker` |
| No service role in browser code | PASS | `npm run secret:scan` passed; `rg` only found service-role placeholders/server config/tests |
| No broad `anon` write grants | PASS | New write grants target `authenticated`; no `anon` write grant found |
| Execute permissions are explicit | PASS | `202606270001...sql:245-247` grants execute to `authenticated` |
| Tenant/client scope derived from auth/membership | PASS | RPC calls `f001_actor_tenant_for_client_write()` and uses `auth.uid()` plus active membership/role checks |
| Create/update + audit in one transaction through RPC | PASS for RPC path | `f001_create_client_write` and `f001_update_client_write` insert audit after mutation |
| Revision optimistic guard prevents silent overwrite | PASS for RPC path | `f001_update_client_write` requires `public.clients.revision = expected_revision` |
| Error messages avoid unauthorized resource disclosure | PASS | RPC raises generic `not authorized`; Server Action maps safe Arabic messages |
| Data API grants are safe | **FAIL - HIGH** | Direct `grant insert, update on public.clients to authenticated` plus RLS write policy allows direct writes outside RPC |
| No SQL adds real customer data | PASS | Migration contains schema/grant/function changes only |
| Rollback/mitigation known | PARTIAL | Do not apply. Candidate mitigations require owner decision: remove direct grants and use a safer RPC privilege model, or add enforced DB-side audit/revision protections for every direct table write |

## HIGH Finding

### H-001: Direct authenticated client writes can bypass audit and revision guard

Evidence:

- `supabase/migrations/202606270001_f001b_client_write_workflows.sql:22` grants `insert, update` on `public.clients` to `authenticated`.
- `supabase/migrations/202606230002_f001a_rls_helpers_and_policies.sql:112-123` allows tenant management roles to insert `public.clients`.
- `supabase/migrations/202606230002_f001a_rls_helpers_and_policies.sql:125-144` allows tenant management roles to update `public.clients`.
- `supabase/tests/database/a1r_rls_foundation.test.sql:181-193` demonstrates a tenant administrator can insert a client directly.
- `supabase/tests/database/a1r_rls_foundation.test.sql:223-248` proves the RPC path writes audit and increments revision, but this does not cover direct table writes.

Impact:

- An authenticated tenant administrator could write `public.clients` directly through the Data API instead of calling `f001_create_client_write` / `f001_update_client_write`.
- Direct writes would not necessarily create `ClientCreated` / `ClientUpdated` audit events.
- Direct updates can bypass `expected_revision`, causing silent overwrites.
- This conflicts with AGENTS.md audit requirements, the constitution append-only auditability principle, and the Cycle 2B requirement that create/update client + audit + revision guard work safely in hosted staging.

Recommended next action:

- Do not apply migration `202606270001` to staging.
- Get owner/architect decision on the hardening path.
- Preferred mitigation options to evaluate in a fix-only follow-up:
  - avoid exposing direct table writes to `authenticated` and move the privileged mutation into a tightly constrained database function/schema pattern; or
  - keep direct grants only if database triggers or constraints enforce audit append and revision checks for all writes, including direct Data API writes.

## Local Verification Completed Before Block

| Command | Result |
|---|---:|
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `npm run secret:scan` | PASS |
| `npm run test:unit` | PASS, 18 files / 51 tests |
| `npm run test:integration` | PASS, 13 files / 44 tests |
| `npm run test:component` | PASS, 7 files / 20 tests |
| `npm run test:rls:db` with telemetry disabled | PASS, 1 pgTAP file / 34 tests |
| `npm run build` | PASS |
| `npm audit --audit-level=high` | PASS threshold; moderate PostCSS advisory remains through Next.js |

Note: `npm run test:rls` initially completed simulator and pgTAP successfully but returned exit 1 due a Supabase CLI PostHog shutdown timeout. Re-running `test:rls:db` with `SUPABASE_TELEMETRY_DISABLED=1` and `DO_NOT_TRACK=1` returned exit 0.

## Staging Decision

Migration status before application:

- Linked project: `samawah-f001-preview-staging`
- `202606270001` status: local only, not remote

Decision:

- **Not applied to hosted staging.**
- Hosted smoke tests were not run because the database migration gate failed before remote mutation.
- Production Supabase was not used.
- No real client data was used.
