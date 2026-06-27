# F-001B Cycle 2B Code Quality and Security Review

Date: 2026-06-27
Branch: `feat/f001b-staging-uat-enablement`
HEAD: `a22a5f596fc9d298246d223bea9a1187808a47a0`
Result: **BLOCKED**

## Findings

### H-001: Direct Data API client writes bypass audit and revision guard

Severity: HIGH

Files:

- `supabase/migrations/202606270001_f001b_client_write_workflows.sql:22`
- `supabase/migrations/202606230002_f001a_rls_helpers_and_policies.sql:112-144`
- `supabase/tests/database/a1r_rls_foundation.test.sql:181-193`

The Cycle 2A migration grants `insert, update` on `public.clients` to `authenticated`. Existing RLS policies allow tenant owners/administrators to insert and update `public.clients`. That means an authenticated tenant administrator can write the clients table directly through the Data API, bypassing the intended Server Action/RPC path.

Impact:

- `ClientCreated` / `ClientUpdated` audit append is not guaranteed for direct writes.
- `expected_revision` optimistic conflict protection is not guaranteed for direct updates.
- Hosted staging migration would validate an unsafe surface if applied as-is.

Recommendation:

- Do not apply this migration to hosted staging.
- Harden the database write model before UAT. The fix should either remove direct write reachability from `authenticated` or enforce audit/revision protections at the database level for every direct write path.

## Reviewed Positive Controls

- Server Action validates with Zod and maps database failures to safe Arabic messages.
- Form mapping ignores browser-supplied tenant scope.
- Runtime context derives actor from Supabase claims plus membership/role rows.
- RPC functions are `SECURITY INVOKER`, keep RLS active, and use `auth.uid()`.
- RPC create/update path writes audit in the same database transaction.
- RPC update path checks `expected_revision`.
- No service-role key was found in browser code.
- `npm run secret:scan` passed.

## Automated Checks

| Check | Result |
|---|---:|
| TypeScript | PASS |
| ESLint | PASS |
| Unit tests | PASS |
| Integration tests | PASS |
| Component tests | PASS |
| RLS simulator | PASS |
| pgTAP RLS DB tests | PASS |
| Secret scan | PASS |
| Build | PASS |
| npm audit high threshold | PASS |
| Hosted E2E/UAT | NOT RUN because migration is blocked |

## Out of Scope

No review or mutation was performed for:

- Invitations.
- Membership or role lifecycle changes.
- Deliverables, contracts, files, SLA, approvals, Kanban, or billing.
- Production Supabase.
