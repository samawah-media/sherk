# F-001B Cycle 2B Stack Compliance

Date: 2026-06-27
Branch: `feat/f001b-staging-uat-enablement`
HEAD: `a22a5f596fc9d298246d223bea9a1187808a47a0`
Result: **CONDITIONAL PASS - blocked by migration security, not by dependency drift**

## Reviewed Stack

| Area | Current Evidence | Result |
|---|---|---:|
| Next.js | `package.json` uses `next@16.2.9`; build passed | PASS |
| TypeScript | `typescript@5.9.3`; `npm run typecheck` passed | PASS |
| Supabase | `@supabase/ssr@0.12.0`, `@supabase/supabase-js@2.108.2`, CLI `2.107.0` via scripts | PASS |
| PostgreSQL / RLS | pgTAP `test:rls:db` passed 34 tests | PASS for local verification |
| Zod | `zod@4.4.3`; client write Server Actions validate through existing schemas | PASS |
| React Hook Form | Not installed and not used in Cycle 2A/2B client form | REVIEW NEEDED before merge if AGENTS gate is enforced strictly |
| Vitest | `vitest@4.1.9`; unit/integration/component/rls simulator passed | PASS |
| Testing Library | `@testing-library/*` packages present; component tests passed | PASS |
| Playwright | `@playwright/test@1.61.0`; not run in Cycle 2B due migration block | PENDING |
| pgTAP | `create extension if not exists pgtap`; DB tests passed | PASS |

## Dependencies

No dependencies were added during Cycle 2B.

Dependency notes:

- `clsx@2.1.1` and `tailwind-merge@3.4.0` remain in `package.json`.
- `rg` found no use of `clsx`, `tailwind-merge`, `twMerge`, or `clsx(` in `src` or `tests`.
- Treat them as pending cleanup or future shadcn utility dependencies; no removal was performed in this blocked UAT cycle.

## Prohibited Codebase References

Search result:

- References to BrightBean/Postiz/Planka/Mixpost exist in product docs, AGENTS, ADRs, and pasted planning notes as explicitly deferred/reference-only material.
- No product source code under `src` was found to use those projects as a base.

## Security Notes

- Secret scan passed.
- `service_role` references are limited to `.env.example`, server env schema, tests, and Supabase config comments.
- No `NEXT_PUBLIC_*SERVICE*` exposure was found.
- Supabase changelog review confirmed explicit Data API grants are now important for new entities; this makes the H-001 grant review blocker directly relevant.

## Conclusion

The dependency stack did not drift during Cycle 2B. The cycle remains blocked by the migration grant model, not by new package installation. React Hook Form usage should be resolved by owner decision or ADR before final merge if strict AGENTS form-stack compliance is required.
