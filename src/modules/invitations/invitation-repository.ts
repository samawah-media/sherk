import type { RoleKey } from "@/modules/memberships/membership";

export type InvitationStatus = "pending" | "accepted" | "revoked" | "superseded";
export type InvitationMembershipType = "internal";
export type InvitationDeliveryState = "queued" | "sent" | "failed";

export type InvitationRecord = {
  id: string;
  tenantId: string;
  invitedEmail: string;
  membershipType: InvitationMembershipType;
  roleKey: RoleKey;
  clientIds: string[];
  status: InvitationStatus;
  token: string;
  expiresAt: string;
  createdBy: string;
  createdAt: string;
  acceptedBy?: string;
  acceptedAt?: string;
  deliveryState: InvitationDeliveryState;
  idempotencyKey?: string;
};

export type InvitationCreateInput = {
  id: string;
  tenantId: string;
  invitedEmail: string;
  membershipType: InvitationMembershipType;
  roleKey: RoleKey;
  clientIds: string[];
  token: string;
  expiresAt: string;
  createdBy: string;
  deliveryState: InvitationDeliveryState;
  idempotencyKey?: string;
};

export type InvitationRepository = {
  create(input: InvitationCreateInput): Promise<InvitationRecord>;
  findById(id: string): Promise<InvitationRecord | undefined>;
  findPendingInternalInvite(input: {
    tenantId: string;
    invitedEmail: string;
    roleKey: RoleKey;
    clientIds: string[];
    idempotencyKey?: string;
  }): Promise<InvitationRecord | undefined>;
  markDeliveryState(
    invitationId: string,
    deliveryState: InvitationDeliveryState,
  ): Promise<InvitationRecord | undefined>;
  accept(input: {
    invitationId: string;
    acceptedBy: string;
    acceptedAt: string;
  }): Promise<InvitationRecord | undefined>;
  listByTenant(tenantId: string): Promise<InvitationRecord[]>;
};

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const sameClientScope = (left: string[], right: string[]) => {
  const leftSorted = [...left].sort();
  const rightSorted = [...right].sort();
  return (
    leftSorted.length === rightSorted.length &&
    leftSorted.every((clientId, index) => clientId === rightSorted[index])
  );
};

export class InMemoryInvitationRepository implements InvitationRepository {
  private readonly invitations = new Map<string, InvitationRecord>();

  constructor(initialInvitations: InvitationRecord[] = []) {
    for (const invitation of initialInvitations) {
      this.invitations.set(invitation.id, invitation);
    }
  }

  async create(input: InvitationCreateInput) {
    const now = new Date().toISOString();
    const record: InvitationRecord = {
      ...input,
      invitedEmail: normalizeEmail(input.invitedEmail),
      clientIds: [...input.clientIds].sort(),
      status: "pending",
      createdAt: now,
    };

    this.invitations.set(record.id, record);
    return record;
  }

  async findById(id: string) {
    return this.invitations.get(id);
  }

  async findPendingInternalInvite(input: {
    tenantId: string;
    invitedEmail: string;
    roleKey: RoleKey;
    clientIds: string[];
    idempotencyKey?: string;
  }) {
    const invitedEmail = normalizeEmail(input.invitedEmail);

    return Array.from(this.invitations.values()).find(
      (invitation) =>
        invitation.tenantId === input.tenantId &&
        invitation.invitedEmail === invitedEmail &&
        invitation.roleKey === input.roleKey &&
        invitation.membershipType === "internal" &&
        invitation.status === "pending" &&
        sameClientScope(invitation.clientIds, input.clientIds) &&
        (!input.idempotencyKey ||
          invitation.idempotencyKey === input.idempotencyKey),
    );
  }

  async markDeliveryState(
    invitationId: string,
    deliveryState: InvitationDeliveryState,
  ) {
    const invitation = this.invitations.get(invitationId);

    if (!invitation) {
      return undefined;
    }

    const updated = { ...invitation, deliveryState };
    this.invitations.set(invitationId, updated);
    return updated;
  }

  async accept(input: {
    invitationId: string;
    acceptedBy: string;
    acceptedAt: string;
  }) {
    const invitation = this.invitations.get(input.invitationId);

    if (!invitation || invitation.status !== "pending") {
      return undefined;
    }

    const accepted: InvitationRecord = {
      ...invitation,
      status: "accepted",
      acceptedBy: input.acceptedBy,
      acceptedAt: input.acceptedAt,
    };

    this.invitations.set(accepted.id, accepted);
    return accepted;
  }

  async listByTenant(tenantId: string) {
    return Array.from(this.invitations.values())
      .filter((invitation) => invitation.tenantId === tenantId)
      .sort((left, right) => left.createdAt.localeCompare(right.createdAt));
  }
}
