# F-001B Cycle 2C - H-001 Hardening Evidence

Date: 2026-06-27
Worktree: `D:\code - projects\sherk-f001b-uat`
Branch: `feat/f001b-staging-uat-enablement`
Scope: Harden `public.clients` write grants before hosted staging UAT
Status: **PASS - H-001 resolved locally**

## Summary

Cycle 2C closed H-001 by removing the direct authenticated table-write path to `public.clients`. Authenticated users now receive read access plus explicit execute access to the approved RPC write functions, while direct `insert`/`update` on `public.clients` is revoked.

The RPC functions now run as constrained `SECURITY DEFINER` functions because removing direct table grants would otherwise break `SECURITY INVOKER` mutations. The functions keep explicit authorization checks using `auth.uid()`, active tenant membership, tenant management role, target tenant/client status, same-transaction audit append, and `expected_revision` conflict protection.

No hosted staging migration was applied in Cycle 2C.

## Security Fix

Changed `supabase/migrations/202606270001_f001b_client_write_workflows.sql`:

- Replaced `grant insert, update on public.clients to authenticated` with `revoke insert, update on public.clients from anon, authenticated`.
- Changed `f001_actor_tenant_for_client_write`, `f001_create_client_write`, and `f001_update_client_write` to `SECURITY DEFINER`.
- Revoked default/public execution on the three functions.
- Granted execute only for the two approved client write RPC functions to `authenticated`.
- Did not grant direct execute on the internal tenant-resolution helper.

Decision record: `cycle-2c-h001-hardening-decision.md`.

## pgTAP Coverage Added

Updated `supabase/tests/database/a1r_rls_foundation.test.sql` from 34 to 37 assertions:

- Direct tenant-admin insert on `public.clients` fails with `42501`.
- Direct tenant-admin update on `public.clients` fails with `42501`.
- RPC create writes `ClientCreated` audit.
- RPC update writes `ClientUpdated` audit and increments revision.
- Stale `expected_revision` update fails with `P0002`.
- Unauthorized actor cannot use create RPC.
- Unauthorized actor cannot use update RPC.

## Local Supabase Reset

Ran a local-only reset to apply the modified migration cleanly:

```text
npx supabase@2.107.0 db reset --local --yes
```

No `--linked`, hosted staging, Production Supabase, or real data was used.

## Required Verification

| Command | Result |
|---|---:|
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `npm run test:unit` | PASS, 18 files / 51 tests |
| `npm run test:integration` | PASS, 13 files / 44 tests |
| `npm run test:component` | PASS, 7 files / 20 tests |
| `npm run test:rls` | PASS, simulator 5 files / 16 tests and pgTAP 1 file / 37 tests |
| `npm run secret:scan` | PASS, no high-confidence secrets |
| `npm run build` | PASS |
| `npm audit --audit-level=high` | PASS high/critical threshold; 2 moderate PostCSS advisories remain through Next.js |

Additional local-only check:

| Command | Result |
|---|---:|
| `npx supabase@2.107.0 db lint --local --fail-on error` | PASS, no schema errors |

## Staging Decision

H-001 is resolved by local migration review and verification. Hosted staging migration is no longer blocked by H-001, but it was **not applied** during Cycle 2C. The next staging/UAT step may proceed only with the normal staging preflight and smoke matrix.

## Scope Control

Confirmed not started:

- Invitations.
- Role/member mutations.
- Deliverables.
- Contracts/packages.
- Files.
- SLA.
- Approvals.
- Kanban.
- Production Supabase.
- Real client data.
- New product feature work.

## Notes

- Spec Kit `check-prerequisites.ps1 -Json -RequireTasks -IncludeTasks` was attempted and failed because the current branch name `feat/f001b-staging-uat-enablement` does not match Spec Kit's numeric feature-branch naming convention. The requested worktree/branch was preserved.
- Supabase CLI reported `v2.108.0` available while scripts pin `supabase@2.107.0`; no upgrade was performed.
