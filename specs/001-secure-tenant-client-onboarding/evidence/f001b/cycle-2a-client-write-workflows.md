# F-001B Cycle 2A Evidence - Client Write Workflows

Date: 2026-06-27

Branch: `feat/f001b-staging-uat-enablement`

## Scope Completed

- Enabled hosted tenant administrators to reach `/clients/new` and `/clients/[clientId]/edit` through the real runtime actor instead of local route fixtures only.
- Added Server Actions for client create/update with Zod validation, safe Arabic failure states, `revalidatePath`, and redirect after successful writes.
- Added security-invoker Supabase RPC functions for client create/update so client mutation and `ClientCreated` / `ClientUpdated` audit append happen in one database transaction while RLS remains active.
- Added explicit Data API grants for authenticated `insert/update` on `public.clients`, `insert` on `public.audit_events`, and RPC execution.
- Added `public.clients.revision` for optimistic update checks.
- Kept tenant/client scope out of browser-submitted form data; runtime derives tenant and authority from Supabase Auth claims plus database memberships/roles.
- Added edit links only when the server-side `clientWrite` guard permits the actor.

## Quality Evidence

- `npm run typecheck`: PASS.
- `npm run lint`: PASS.
- `npm run test:unit -- tests/unit/clients/client-write-mappers.test.ts tests/unit/auth/runtime-context.test.ts`: PASS, 2 files / 8 tests.
- `npm run test:component -- tests/component/clients/client-form.test.tsx`: PASS, 1 file / 4 tests.
- Manual pgTAP through `docker exec ... psql`: PASS, 34/34 assertions after applying the new migration to the local container for verification.
- `npm run test:rls:db`: PASS, 1 pgTAP file / 34 tests.
- Targeted E2E: `npm run test:e2e -- tests/e2e/management/create-client.spec.ts --project=desktop-chromium --timeout=60000`: PASS, 1 test.
- `npm run test:unit`: PASS, 18 files / 51 tests.
- `npm run test:integration`: PASS, 13 files / 44 tests.
- `npm run test:component`: PASS, 7 files / 20 tests.
- `npm run test:rls`: PASS, simulator 5 files / 16 tests and pgTAP 1 file / 34 tests.
- `npm run secret:scan`: PASS, no high-confidence secrets found.
- `npm run build`: PASS.
- `npm run test:e2e`: PASS, 52 passed / 2 existing skips.
- `npm audit --audit-level=high`: PASS for high/critical threshold; existing moderate PostCSS advisory remains through Next.js.

## Out of Scope Confirmed

- No invitation acceptance or invitation write workflow changes.
- No role mutation, membership disablement, deliverables, contracts, packages, files, SLA, approvals, Kanban, billing, or social scheduling changes.
- No service-role key usage in browser or Server Actions.
- No real client data, passwords, screenshots, traces, or production data added to Git.
