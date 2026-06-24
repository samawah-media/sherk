import type {
  ClientMembership,
  RoleKey,
  RoleAssignment,
  TenantMembership,
} from "./membership";

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
  activateClientMembership(input: {
    id: string;
    tenantId: string;
    clientId: string;
    userId: string;
  }): Promise<ClientMembership>;
  assignRole(input: {
    id: string;
    tenantId: string;
    membershipId: string;
    roleKey: RoleKey;
    scopeType: "client";
    scopeId: string;
  }): Promise<RoleAssignment>;
  listTenantMemberships(tenantId: string): Promise<TenantMembership[]>;
  listClientMemberships(tenantId: string): Promise<ClientMembership[]>;
  listRoleAssignments(tenantId: string): Promise<RoleAssignment[]>;
};

export class InMemoryMembershipRepository implements MembershipRepository {
  private readonly tenantMemberships = new Map<string, TenantMembership>();
  private readonly clientMemberships = new Map<string, ClientMembership>();
  private readonly roleAssignments = new Map<string, RoleAssignment>();

  constructor({
    tenantMemberships = [],
    clientMemberships = [],
    roleAssignments = [],
  }: {
    tenantMemberships?: TenantMembership[];
    clientMemberships?: ClientMembership[];
    roleAssignments?: RoleAssignment[];
  } = {}) {
    for (const membership of tenantMemberships) {
      this.tenantMemberships.set(membership.id, membership);
    }

    for (const membership of clientMemberships) {
      this.clientMemberships.set(membership.id, membership);
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

  async activateClientMembership(input: {
    id: string;
    tenantId: string;
    clientId: string;
    userId: string;
  }) {
    const existing = Array.from(this.clientMemberships.values()).find(
      (membership) =>
        membership.tenantId === input.tenantId &&
        membership.clientId === input.clientId &&
        membership.userId === input.userId,
    );

    if (existing) {
      const activated: ClientMembership = { ...existing, status: "active" };
      this.clientMemberships.set(activated.id, activated);
      return activated;
    }

    const membership: ClientMembership = {
      id: input.id,
      tenantId: input.tenantId,
      clientId: input.clientId,
      userId: input.userId,
      status: "active",
    };

    this.clientMemberships.set(membership.id, membership);
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

  async listClientMemberships(tenantId: string) {
    return Array.from(this.clientMemberships.values()).filter(
      (membership) => membership.tenantId === tenantId,
    );
  }

  async listRoleAssignments(tenantId: string) {
    return Array.from(this.roleAssignments.values()).filter(
      (assignment) => assignment.tenantId === tenantId,
    );
  }
}
