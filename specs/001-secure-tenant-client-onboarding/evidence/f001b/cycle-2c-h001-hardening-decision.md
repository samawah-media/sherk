# F-001B Cycle 2C - H-001 Hardening Decision

Date: 2026-06-27
Worktree: `D:\code - projects\sherk-f001b-uat`
Scope: H-001 only, before hosted staging UAT

## Decision

Use the RPC path as the only authenticated client write path:

- Revoke direct `insert` and `update` grants on `public.clients` from `authenticated`.
- Keep explicit `execute` grants for `public.f001_create_client_write(...)` and `public.f001_update_client_write(...)`.
- Change the client write RPC functions to `SECURITY DEFINER` and keep explicit actor, tenant membership, management role, target tenant/client, active status, and `expected_revision` checks inside the function body.
- Revoke default/public execution from these functions before granting only the intended `authenticated` execution surface.

## Why SECURITY DEFINER Is Needed

With direct table write grants removed, a `SECURITY INVOKER` RPC would execute with the authenticated caller's table privileges and would no longer be able to insert/update `public.clients`. A definer-owned RPC is the smallest safe pattern that can keep the table write surface closed while preserving the approved command path.

## Alternatives Reviewed

1. Keep direct table grants and rely on RLS.
   - Rejected: this is H-001. RLS authorizes the row but does not force audit append or optimistic revision checks.

2. Add database triggers for every `public.clients` insert/update.
   - Rejected for Cycle 2C: this is broader and still does not reliably enforce caller-supplied stale revision guards for generic Data API updates.

3. Revoke table writes and use `SECURITY DEFINER` RPC.
   - Accepted: direct Data API writes fail at the privilege layer, while the constrained RPC performs authorization, mutation, audit append, and revision checks in one database transaction.

## Guardrails

- No new feature scope.
- No hosted staging migration in Cycle 2C before local verification is green.
- No Production Supabase.
- No real client data.
- No invitations, role/member mutations, deliverables, contracts, files, SLA, approvals, or Kanban.
- If verification finds a new HIGH/CRITICAL issue, staging remains blocked.
