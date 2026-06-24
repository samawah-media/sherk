import type { RoleKey, TenantMembership, RoleAssignment } from "./membership";

export type MembershipRepository = {
  findTenantMembership(input: {
    tenantId: string;
    userId: string;
  }): Promise<TenantMembership | undefined>;
  activateTenantMembership(input: {
    id: string;
    tenantId: string;
    userId: string;
  }): Promise<TenantMembership>;
  assignRole(input: {
    id: string;
    tenantId: string;
    membershipId: string;
    roleKey: RoleKey;
    scopeType: "client";
    scopeId: string;
  }): Promise<RoleAssignment>;
  listTenantMemberships(tenantId: string): Promise<TenantMembership[]>;
  listRoleAssignments(tenantId: string): Promise<RoleAssignment[]>;
};

export class InMemoryMembershipRepository implements MembershipRepository {
  private readonly tenantMemberships = new Map<string, TenantMembership>();
  private readonly roleAssignments = new Map<string, RoleAssignment>();

  constructor({
    tenantMemberships = [],
    roleAssignments = [],
  }: {
    tenantMemberships?: TenantMembership[];
    roleAssignments?: RoleAssignment[];
  } = {}) {
    for (const membership of tenantMemberships) {
      this.tenantMemberships.set(membership.id, membership);
    }

    for (const assignment of roleAssignments) {
      this.roleAssignments.set(assignment.id, assignment);
    }
  }

  async findTenantMembership(input: { tenantId: string; userId: string }) {
    return Array.from(this.tenantMemberships.values()).find(
      (membership) =>
        membership.tenantId === input.tenantId &&
        membership.userId === input.userId,
    );
  }

  async activateTenantMembership(input: {
    id: string;
    tenantId: string;
    userId: string;
  }) {
    const existing = await this.findTenantMembership(input);

    if (existing) {
      const activated: TenantMembership = { ...existing, status: "active" };
      this.tenantMemberships.set(activated.id, activated);
      return activated;
    }

    const membership: TenantMembership = {
      id: input.id,
      tenantId: input.tenantId,
      userId: input.userId,
      status: "active",
    };

    this.tenantMemberships.set(membership.id, membership);
    return membership;
  }

  async assignRole(input: {
    id: string;
    tenantId: string;
    membershipId: string;
    roleKey: RoleKey;
    scopeType: "client";
    scopeId: string;
  }) {
    const existing = Array.from(this.roleAssignments.values()).find(
      (assignment) =>
        assignment.tenantId === input.tenantId &&
        assignment.membershipId === input.membershipId &&
        assignment.roleKey === input.roleKey &&
        assignment.scopeType === input.scopeType &&
        assignment.scopeId === input.scopeId &&
        assignment.status === "active",
    );

    if (existing) {
      return existing;
    }

    const assignment: RoleAssignment = { ...input, status: "active" };
    this.roleAssignments.set(assignment.id, assignment);
    return assignment;
  }

  async listTenantMemberships(tenantId: string) {
    return Array.from(this.tenantMemberships.values()).filter(
      (membership) => membership.tenantId === tenantId,
    );
  }

  async listRoleAssignments(tenantId: string) {
    return Array.from(this.roleAssignments.values()).filter(
      (assignment) => assignment.tenantId === tenantId,
    );
  }
}
