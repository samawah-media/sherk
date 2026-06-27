# F-001B Cycle 2D - Hosted Staging Client Write UAT

Date: 2026-06-27
Worktree: `D:\code - projects\sherk-f001b-uat`
Branch: `feat/f001b-staging-uat-enablement`
Scope: Apply hardened client write workflow migration to hosted staging and run UAT smoke
Status: **PASS - hosted staging UAT passed**

## Scope Control

Confirmed not started:

- Production Supabase.
- Real client data.
- Invitations.
- Role/member mutations.
- Deliverables.
- Contracts/packages.
- Files.
- SLA.
- Approvals.
- Kanban.
- New feature work.

## Governance and Preflight Context

Read before action:

- `AGENTS.md`
- `.specify/memory/constitution.md`
- `specs/001-secure-tenant-client-onboarding/spec.md`
- `specs/001-secure-tenant-client-onboarding/plan.md`
- `specs/001-secure-tenant-client-onboarding/tasks.md`
- `specs/001-secure-tenant-client-onboarding/evidence/f001b/cycle-2b-hosted-staging-uat.md`
- `specs/001-secure-tenant-client-onboarding/evidence/f001b/reviews/cycle-2b-migration-security-review.md`
- `specs/001-secure-tenant-client-onboarding/evidence/f001b/cycle-2c-h001-hardening-decision.md`
- `specs/001-secure-tenant-client-onboarding/evidence/f001b/cycle-2c-h001-hardening-evidence.md`
- `supabase/migrations/202606270001_f001b_client_write_workflows.sql`
- `supabase/tests/database/a1r_rls_foundation.test.sql`

Cycle 2C hardening was present and not reversed:

- Direct `insert` and `update` grants on `public.clients` are revoked from `anon` and `authenticated`.
- Client write RPC functions are constrained `SECURITY DEFINER` functions.
- Default/public function execution is revoked before granting only approved RPC execute access to `authenticated`.
- pgTAP plan is updated from 34 to 37 assertions and covers direct write denial, RPC audit, revision update, stale revision failure, and unauthorized RPC denial.

## Local Preflight

| Command | Result |
|---|---:|
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `npm run test:rls` | PASS: RLS simulator 5 files / 16 tests; pgTAP 1 file / 37 tests |
| `npm run secret:scan` | PASS: no high-confidence secrets |
| `npm audit --audit-level=high` | PASS high/critical threshold; 2 moderate PostCSS advisories through Next.js remain |

No HIGH/CRITICAL audit finding, secret finding, production signal, or real-data signal was observed during preflight.

## Staging Project Verification

Linked Supabase project:

- Name: `samawah-f001-preview-staging`
- Ref: `kbntdgjzsfuqqdythmrn`
- Region: `eu-west-1`
- Status from project list: `ACTIVE_HEALTHY`

The linked project was verified via `supabase/.temp/linked-project.json`, `supabase/.temp/project-ref`, and `npx supabase@2.107.0 projects list --output json`.

Other Supabase projects were not linked. No production project was selected or mutated.

## Migration Application

Before application, `npx supabase@2.107.0 migration list --linked` showed:

| Migration | Local | Remote |
|---|---:|---:|
| `202606230001` | present | applied |
| `202606230002` | present | applied |
| `20260624083439` | present | applied |
| `20260624095927` | present | applied |
| `20260625174600` | present | applied |
| `202606270001` | present | **not applied** |

Dry run:

```text
npx supabase@2.107.0 db push --linked --dry-run
Would push these migrations:
 • 202606270001_f001b_client_write_workflows.sql
```

Applied to hosted staging:

```text
npx supabase@2.107.0 db push --linked
Applying migration 202606270001_f001b_client_write_workflows.sql...
Finished supabase db push.
```

Post-application verification:

| Migration | Local | Remote |
|---|---:|---:|
| `202606270001` | present | applied |

CLI note: `db push` returned exit 0 but printed a non-blocking warning while caching the pg-delta migrations catalog after the migration was applied. A follow-up `migration list --linked` confirmed the remote migration history is correct.

## Hosted UAT Smoke Matrix

Smoke used staging-only dummy UAT accounts from `.env.uat.local`, Supabase Auth sign-in, and the staging anon key fetched in-memory from Supabase CLI. No keys, passwords, or tokens were printed or stored.

Final smoke result: **PASS, 18/18 checks**.

Created dummy staging client:

- Client ID: `f5e2024b-3142-4f58-b425-3efe3a64d9a3`
- Final slug: `f001b-uat-updated-20260627103914-687fbd10`

| Check | Result | Evidence |
|---|---:|---|
| Tenant admin sign-in | PASS | Supabase Auth session established |
| Create client via approved RPC | PASS | `f001_create_client_write` returned revision `1` |
| Verify `ClientCreated` audit | PASS | Audit action `ClientCreated` found for created client |
| Update client via approved RPC with `expected_revision` | PASS | `f001_update_client_write` returned revision `2` |
| Verify `ClientUpdated` audit | PASS | Audit action `ClientUpdated` found for updated client |
| Stale `expected_revision` fails safely | PASS | RPC returned `P0002` |
| Direct insert on `public.clients` denied via Data API | PASS | Returned `42501` |
| Direct update on `public.clients` denied via Data API | PASS | Returned `42501` |
| Unauthorized account manager sign-in | PASS | Supabase Auth session established |
| Unauthorized actor cannot create via RPC | PASS | Returned `42501` |
| Unauthorized actor cannot update via RPC | PASS | Returned `42501` |
| Client viewer sign-in | PASS | Supabase Auth session established |
| Cross-client read denied for client viewer | PASS | Returned `0` rows for newly-created unassigned client |
| Client viewer cannot update cross-client target via RPC | PASS | Returned `42501` |
| `audit_events` update denied | PASS | Returned `42501` |
| `audit_events` delete denied | PASS | Returned `42501` |
| Safe Arabic copy for permission/conflict codes | PASS | Runtime source maps `42501` and `P0002` to non-technical Arabic copy |
| Cross-tenant fixture availability | PASS with caveat | Not exercised because staging seed has one tenant fixture; cross-client denial was exercised safely |

Two earlier smoke harness runs reached staging successfully and passed all Supabase checks, but marked the Arabic-copy check false because the harness embedded Arabic text through PowerShell stdin encoding. The final passing run reads the runtime source file as UTF-8 instead of embedding Arabic strings in the harness.

## Result

Staging UAT result: **PASS**.

Merge gate status from this Cycle 2D evidence:

- H-001 is no longer blocking hosted staging UAT.
- Migration `202606270001` is applied to hosted staging.
- Client create/update works through RPC with same-transaction audit and revision guard.
- Direct Data API writes to `public.clients` are denied.
- Unauthorized write actors are denied.
- Audit records remain append-only.

Merge should still wait for normal review and commit/staging of the current Cycle 2C/Cycle 2D worktree changes, but there is no remaining F-001B hosted staging UAT blocker from this cycle.

