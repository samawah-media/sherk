# Evidence Checklist: Internal Online MVP UAT

Date: 2026-06-29

This checklist separates local evidence from hosted evidence. Do not mark hosted checks as passed unless they were run against the approved protected non-production online environment.

## Baseline

| ID | Check | Status | Evidence |
|---|---|---:|---|
| BASE-001 | PR #17 merged to `main` | PASS | `gh pr view 17` reported `MERGED` at `2026-06-29T12:30:38Z`, merge commit `6c406049203230c6b7e34eb0708bac0f82c981f8`. |
| BASE-002 | UAT branch isolated after PR #17 | PASS | Branch/worktree `codex/internal-online-mvp-uat` at PR #17 merge commit. |
| BASE-003 | `AGENTS.md` and project progress reviewed | PASS | Reviewed before edits. |
| BASE-004 | Hosted Supabase approval | BLOCKED | Resume approval text named `REAL_PROJECT_REF_HERE`; this is not a valid Supabase project ref format, so H1 did not pass and no hosted migration/seed was run. |
| BASE-005 | Hosted Preview deployment | BLOCKED | Vercel CLI is authenticated as `omarhussien2`; `vercel teams ls` shows only `omarhussien2s-projects`, not the approved Samawah scope. |
| BASE-006 | Spec Kit prerequisite check on `codex/*` branch | PASS | `check-prerequisites.ps1` now honors `.specify/feature.json` when it pins the active feature directory. |
| BASE-007 | PR #18 and PR #19 merged on `main` | PASS | `origin/main` is `466b9eddbbcd2465fb2106907b4b38fb0880196c`; log shows PR #18 merge `9dac378` followed by PR #19 merge `466b9ed`. |
| BASE-008 | CI/checks for latest `main` merge commit | NOT RUN | GitHub check-runs for `466b9eddbbcd2465fb2106907b4b38fb0880196c` returned zero checks; combined commit status has no contexts. Latest visible `main` Actions run is older than PR #18/#19. |

## Local Verification

| ID | Command | Status | Notes |
|---|---|---:|---|
| LOCAL-001 | `git diff --check` | PASS | No whitespace errors; Git reported line-ending warnings only. |
| LOCAL-002 | `npm run typecheck` | PASS | TypeScript completed successfully. |
| LOCAL-003 | `npm run lint` | PASS | ESLint completed successfully. |
| LOCAL-004 | `npm run test:unit` | PASS | 23 files / 72 tests passed. |
| LOCAL-005 | `npm run test:integration` | PASS | 19 files / 76 tests passed. |
| LOCAL-006 | `npm run test:rls` | PASS | RLS simulator 7 files / 21 tests and pgTAP 2 files / 110 tests passed. |
| LOCAL-007 | `npm run test:component` | PASS | 12 files / 39 tests passed. |
| LOCAL-008 | `npm run test:e2e` | PASS | 61 passed / 2 expected skips. |
| LOCAL-009 | `npm run secret:scan` | PASS | No high-confidence secrets found. |
| LOCAL-010 | `npm audit --audit-level=high` | PASS | No high/critical findings; existing moderate PostCSS advisory through Next remains. |
| LOCAL-011 | `npm run build` | PASS | Next.js production build completed successfully. |
| LOCAL-012 | `npx supabase@2.107.0 db reset --local --no-seed` | PASS | Local migrations replayed successfully before seed validation. |
| LOCAL-013 | R-004 seed local apply via `psql` | PASS | `supabase/seeds/r004_internal_online_mvp_uat.sql` applied twice locally with `ON_ERROR_STOP=1`; second run stayed idempotent and did not mutate append-only package ledger rows. |
| LOCAL-014 | R-004 seed row-count validation | PASS | Local DB shows 2 clients, 5 auth users, 2 contracts, 2 packages, 2 package lines, 7 deliverables, 6 Alpha deliverables, and 1 Beta deliverable. |

## Resume Verification - 2026-06-29

| ID | Command | Status | Notes |
|---|---|---:|---|
| RESUME-001 | `git diff --check` | PASS | No whitespace errors; Git reported line-ending warnings only. |
| RESUME-002 | `npm run secret:scan` | PASS | No high-confidence secrets found. |
| RESUME-003 | `npm run lint` | PASS | ESLint completed successfully after installing lockfile dependencies in the resume worktree. |
| RESUME-004 | `npm run test:unit` | PASS | 23 files / 72 tests passed. |
| RESUME-005 | `npm run test:integration` | PASS | 19 files / 76 tests passed. |
| RESUME-006 | `npm run test:component` | PASS | 12 files / 39 tests passed. |
| RESUME-007 | `npm run test:rls:simulator` | PASS | 7 files / 21 tests passed. |
| RESUME-008 | `npm audit --audit-level=high` | PASS | No high/critical findings; existing moderate PostCSS advisory through Next remains. |
| RESUME-009 | `npm run typecheck` | FAIL | Current baseline fails in unmodified source files and Next type declarations; this docs-only resume changed only `docs/PROJECT_PROGRESS.md`, `docs/08-release/R-004-internal-online-mvp-uat.md`, and this evidence file. |
| RESUME-010 | `npm run build` | FAIL | Next compiled successfully, then failed TypeScript validation on missing declaration for `next/types.js`; no product source code was changed in this resume branch. |

## Hosted Environment Gates

| ID | Check | Status | Notes |
|---|---|---:|---|
| HOST-001 | Vercel account/scope approved | BLOCKED | `vercel whoami` returned `omarhussien2`; `vercel teams ls` showed only `omarhussien2s-projects`, not the approved Samawah scope. No Vercel project link exists in this worktree. |
| HOST-002 | Preview protection enabled | BLOCKED | Requires approved Vercel project/scope access. |
| HOST-003 | Preview env vars are non-production only | BLOCKED | Requires approved Vercel project/scope access. |
| HOST-004 | Production env vars untouched | NOT RUN | No deployment/env mutation was attempted from the wrong account. |
| HOST-005 | Hosted Supabase project non-production | BLOCKED | Cannot verify because `REAL_PROJECT_REF_HERE` is not a valid Supabase project ref format. No hosted link or project mutation was attempted. |
| HOST-006 | Hosted migration applied | BLOCKED | Not run because H1 failed project-ref validation and the target could not be verified as non-production. |
| HOST-007 | Synthetic seed prepared | PASS | Dedicated guarded seed added at `supabase/seeds/r004_internal_online_mvp_uat.sql`; it is separate from `supabase/seed.sql`. |
| HOST-008 | Synthetic seed applied | BLOCKED | Not run; only `supabase/seeds/r004_internal_online_mvp_uat.sql` remains approved for R-004 hosted UAT after a valid non-production target is provided and verified. |
| HOST-009 | Hosted target has no real client data/users | BLOCKED | Cannot verify without a valid non-production Supabase project ref and approved connection path. The guarded R-004 seed was not applied to any hosted target. |

## Smoke Checks

| ID | Check | Status | Notes |
|---|---|---:|---|
| SM-001 | Protected Preview blocks unauthenticated access | NOT RUN | Requires approved Samawah Vercel scope and Preview URL; no deploy was attempted from the personal scope. |
| SM-002 | Sign-in surface loads | NOT RUN | Requires approved Samawah Vercel scope and Preview URL. |
| SM-003 | Hosted fixture actors disabled | NOT RUN | Requires approved Samawah Vercel scope and Preview URL. |
| SM-004 | Runtime health on accepted surfaces | NOT RUN | Requires approved Samawah Vercel scope, Preview URL, and data where applicable. |
| SM-005 | Browser response does not expose secrets | NOT RUN | Requires approved Samawah Vercel scope and Preview URL. |

## Security Checks

| ID | Check | Status | Notes |
|---|---|---:|---|
| SEC-001 | Client Alpha user cannot access Client Beta data | BLOCKED | Requires hosted synthetic data; no hosted seed was run. |
| SEC-002 | Client user cannot access management-only surfaces | BLOCKED | Requires hosted synthetic users; no hosted seed was run. |
| SEC-003 | Unauthorized deliverable/SLA access denies safely | BLOCKED | Requires hosted synthetic data; no hosted seed was run. |
| SEC-004 | Service role not exposed in browser | NOT RUN | Requires approved Samawah Preview URL. |
| SEC-005 | No real client data in seed/screenshots | BLOCKED | Seed file remains synthetic-only, but hosted target inspection and screenshots cannot run until a valid non-production target and approved Preview exist. |
| SEC-006 | Seed refuses non-R-004 client/auth data | PASS | Seed guards abort when existing client/auth data is outside the approved synthetic R-004 fixture set. |

## UAT Checks

| ID | Surface | Status | Notes |
|---|---|---:|---|
| UAT-001 | Client management | BLOCKED | Requires hosted migration/seed. |
| UAT-002 | Contracts | BLOCKED | Requires hosted migration/seed. |
| UAT-003 | Packages | BLOCKED | Requires hosted migration/seed. |
| UAT-004 | Deliverables | BLOCKED | Requires hosted migration/seed. |
| UAT-005 | Commercial summaries | BLOCKED | Requires hosted migration/seed. |
| UAT-006 | SLA MVP summaries | BLOCKED | Requires hosted migration/seed. |
| UAT-007 | `paused_waiting_internal_decision` hosted persisted case | BLOCKED | Current accepted MVP has no persisted SLA segment table; covered by F-003 domain/unit evidence only until a future approved schema change. |

## Out Of Scope Confirmed

- Production deployment.
- Production Supabase.
- Real client data.
- New dependencies.
- New product features.
- Database schema changes in this branch.
- Kanban.
- Files.
- Comments.
- Approvals.
- Social scheduling.
- AI.
- Background jobs.
- `RoleKey` changes.
- Standalone `project_manager` role.
- Merging PR without review.
