import { isActive, type TenantMembership } from "../memberships/membership";

export type RlsActor = {
  userId: string;
  tenantMemberships: TenantMembership[];
};

export type TenantScopedRow = {
  tenantId: string;
};

export type TenantSelectPolicy =
  | "tenant_member_select"
  | "own_membership_select"
  | "own_client_membership_select"
  | "role_assignment_select_by_tenant_member"
  | "audit_select_tenant_management";

export type TenantInsertPolicy = "audit_insert_own_tenant";

const hasActiveTenantMembership = (actor: RlsActor, tenantId: string) =>
  actor.tenantMemberships.some(
    (membership) =>
      membership.userId === actor.userId &&
      membership.tenantId === tenantId &&
      isActive(membership.status),
  );

export const canSelectTenantScopedRow = ({
  actor,
  row,
}: {
  actor: RlsActor;
  row: TenantScopedRow;
  policy: TenantSelectPolicy;
}) => hasActiveTenantMembership(actor, row.tenantId);

export const canInsertTenantScopedRow = ({
  actor,
  row,
}: {
  actor: RlsActor;
  row: TenantScopedRow;
  policy: TenantInsertPolicy;
}) => hasActiveTenantMembership(actor, row.tenantId);
