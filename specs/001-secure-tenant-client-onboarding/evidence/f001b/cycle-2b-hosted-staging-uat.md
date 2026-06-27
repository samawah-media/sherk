# F-001B Cycle 2B - Hosted Staging Migration and UAT Gate

Date: 2026-06-27
Worktree: `D:\code - projects\sherk-f001b-uat`
Branch: `feat/f001b-staging-uat-enablement`
HEAD: `a22a5f596fc9d298246d223bea9a1187808a47a0`
Cycle 2A commit: `a22a5f596fc9d298246d223bea9a1187808a47a0`
Staging project: `samawah-f001-preview-staging`
Cycle 2B status: **BLOCKED**

## Executive Summary

Cycle 2B did not apply the migration to hosted staging. Preflight found Cycle 2A was not committed, so Cycle 2A was first committed as `feat(F-001B): add client write workflows`. Local validation passed, and the linked Supabase remote is a staging project. The migration security review then found a HIGH risk in the new grants: direct authenticated writes to `public.clients` can bypass the intended RPC path, audit append, and revision guard.

Per the Cycle 2B stop conditions, the staging migration and hosted UAT smoke tests were stopped.

## Scope Control

Confirmed not started:

- Invitations.
- Role/member mutations beyond verification.
- Deliverables.
- Contracts/packages.
- Files.
- SLA.
- Approvals.
- Kanban.
- Production Supabase.
- Real client data.
- Merge to `main`.

## Preflight

| Item | Result | Evidence |
|---|---:|---|
| Correct worktree | PASS | `D:\code - projects\sherk-f001b-uat` |
| Branch | PASS | `feat/f001b-staging-uat-enablement` |
| Cycle 2A initially committed | FAIL then fixed | Worktree had uncommitted Cycle 2A files; committed as `a22a5f5` |
| Migration tracked | PASS after commit | `supabase/migrations/202606270001_f001b_client_write_workflows.sql` committed |
| Production connection avoided | PASS | No production project was used; linked remote is staging |
| Secrets in Git | PASS | `npm run secret:scan` found no high-confidence secrets |
| Local Supabase tests | PASS | `test:rls:db` passed 34 pgTAP assertions |
| Feature scope expansion | PASS | No new product feature started |

## Supabase Remote State

`supabase migration list --linked` before application showed:

| Migration | Local | Remote |
|---|---:|---:|
| `202606230001` | present | applied |
| `202606230002` | present | applied |
| `20260624083439` | present | applied |
| `20260624095927` | present | applied |
| `20260625174600` | present | applied |
| `202606270001` | present | **not applied** |

No `db push` or manual SQL was run against staging.

## Migration Review Result

Result: **BLOCKED - HIGH finding**

Summary:

- RPC functions use `SECURITY INVOKER`.
- RLS remains active.
- Execute grants are explicit.
- The RPC path writes audit events and enforces expected revision.
- However, `grant insert, update on public.clients to authenticated` exposes direct Data API writes under existing tenant-management RLS policies.
- Direct writes can bypass `ClientCreated` / `ClientUpdated` audit and optimistic revision protection.

Detailed review: `specs/001-secure-tenant-client-onboarding/evidence/f001b/reviews/cycle-2b-migration-security-review.md`.

## Hosted Smoke Tests

Not run.

Reason: migration gate failed before remote mutation. Running hosted create/update smoke tests without applying the migration would not validate the intended hosted write path, and applying the migration is blocked by H-001.

Required smoke matrix remains pending:

- Tenant admin sign-in.
- Create client through hosted runtime.
- Audit event creation.
- Update with correct revision.
- Conflict on stale revision.
- Unauthorized create/update denial.
- URL/clientId tampering denial.
- Cross-tenant/cross-client denial where available.
- Audit log immutability.
- Safe Arabic error copy.

## Automated Verification

| Command | Result |
|---|---:|
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `npm run test:unit` | PASS, 18 files / 51 tests |
| `npm run test:integration` | PASS, 13 files / 44 tests |
| `npm run test:component` | PASS, 7 files / 20 tests |
| `npm run test:rls:simulator` | PASS, 5 files / 16 tests as part of first `test:rls` run |
| `npm run test:rls:db` | PASS, 1 file / 34 pgTAP tests with telemetry disabled |
| `npm run secret:scan` | PASS |
| `npm run build` | PASS |
| `npm audit --audit-level=high` | PASS high/critical threshold; two moderate PostCSS advisories remain |
| `npm run test:e2e` | NOT RUN |

Skipped test note:

- `npm run test:e2e` is acceptance-critical for a passing Cycle 2B, but it was not run because the cycle stopped at the migration security gate before hosted runtime UAT.

## Audit Evidence

Local pgTAP evidence proves the RPC path appends audit:

- `ClientCreated` audit via `f001_create_client_write`.
- `ClientUpdated` audit via `f001_update_client_write`.

Residual blocker:

- Direct Data API writes to `public.clients` are not proven to append audit.

## Revision Conflict Evidence

Local pgTAP evidence proves the RPC path increments revision when `expected_revision` matches.

Residual blocker:

- Direct Data API updates are not forced through `expected_revision`.

## Safe Arabic Error Evidence

Server Action mapping exists for:

- `42501` to a safe permission message.
- `P0002` / `PGRST116` to a safe conflict message.
- validation failures to safe Arabic form review copy.

Residual blocker:

- Hosted runtime copy was not smoke-tested because staging migration was not applied.

## Security Findings

| ID | Severity | Status | Summary |
|---|---:|---:|---|
| H-001 | HIGH | OPEN | Direct authenticated `public.clients` writes can bypass audit and revision guard |

## Residual Risks

- Staging has not received migration `202606270001`.
- Hosted write workflow has not been UAT-smoke-tested.
- The current committed Cycle 2A migration needs owner/architect decision before staging.
- `react-hook-form` is not installed or used in the current client form; see stack compliance note.
- `clsx` and `tailwind-merge` are installed but unused in `src`/`tests`; pending cleanup or future shadcn utility use.

## Final Gate

Cycle 2B result: **BLOCKED**

Readiness:

- Not ready to merge.
- Not ready to continue to hosted UAT until H-001 is resolved or explicitly accepted by the owner and architect.
- Production Supabase was not used.
- No new feature was started.
- Invitations were not implemented or exercised.
