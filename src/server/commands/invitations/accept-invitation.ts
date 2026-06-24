import type { AuditSink } from "@/modules/audit/audit-service";
import type { AuthSession } from "@/modules/auth/session";
import type { InvitationRepository } from "@/modules/invitations/invitation-repository";
import type { MembershipRepository } from "@/modules/memberships/membership-repository";

const normalizeEmail = (email: string) => email.trim().toLowerCase();

export const acceptInternalInvitationCommand = async ({
  session,
  invitationId,
  invitations,
  memberships,
  audit,
  membershipIdFactory = crypto.randomUUID,
  roleAssignmentIdFactory = crypto.randomUUID,
  now = () => new Date(),
}: {
  session: AuthSession;
  invitationId: string;
  invitations: InvitationRepository;
  memberships: MembershipRepository;
  audit: AuditSink;
  membershipIdFactory?: () => string;
  roleAssignmentIdFactory?: () => string;
  now?: () => Date;
}) => {
  const invitation = await invitations.findById(invitationId);

  if (!invitation || invitation.membershipType !== "internal") {
    return { ok: false as const, error: "INVITATION_NOT_FOUND" as const };
  }

  if (normalizeEmail(session.email) !== normalizeEmail(invitation.invitedEmail)) {
    await audit.append({
      tenantId: invitation.tenantId,
      actorUserId: session.userId,
      action: "InvitationAcceptanceDenied",
      decision: "denied",
      targetType: "invitation",
      targetId: invitation.id,
      reason: "EMAIL_MISMATCH",
    });

    return { ok: false as const, error: "EMAIL_MISMATCH" as const };
  }

  if (invitation.status === "accepted") {
    return { ok: true as const, value: invitation, idempotent: true as const };
  }

  if (invitation.status !== "pending") {
    return { ok: false as const, error: "INVITATION_NOT_FOUND" as const };
  }

  const acceptedAt = now();

  if (acceptedAt > new Date(invitation.expiresAt)) {
    await audit.append({
      tenantId: invitation.tenantId,
      actorUserId: session.userId,
      action: "InvitationAcceptanceDenied",
      decision: "denied",
      targetType: "invitation",
      targetId: invitation.id,
      reason: "INVITATION_EXPIRED",
    });

    return { ok: false as const, error: "INVITATION_EXPIRED" as const };
  }

  const tenantMembership = await memberships.activateTenantMembership({
    id: membershipIdFactory(),
    tenantId: invitation.tenantId,
    userId: session.userId,
  });

  const roleAssignments = [];

  for (const clientId of invitation.clientIds) {
    roleAssignments.push(
      await memberships.assignRole({
        id: roleAssignmentIdFactory(),
        tenantId: invitation.tenantId,
        membershipId: tenantMembership.id,
        roleKey: invitation.roleKey,
        scopeType: "client",
        scopeId: clientId,
      }),
    );
  }

  const accepted = await invitations.accept({
    invitationId: invitation.id,
    acceptedBy: session.userId,
    acceptedAt: acceptedAt.toISOString(),
  });

  await audit.append({
    tenantId: invitation.tenantId,
    clientId: invitation.clientIds[0],
    actorUserId: session.userId,
    action: "TenantMembershipActivated",
    decision: "allowed",
    targetType: "tenant_membership",
    targetId: tenantMembership.id,
  });
  await audit.append({
    tenantId: invitation.tenantId,
    clientId: invitation.clientIds[0],
    actorUserId: session.userId,
    action: "InvitationAccepted",
    decision: "allowed",
    targetType: "invitation",
    targetId: invitation.id,
  });

  return {
    ok: true as const,
    value: {
      invitation: accepted ?? invitation,
      tenantMembership,
      roleAssignments,
    },
  };
};

export const acceptClientInvitationCommand = async ({
  session,
  invitationId,
  invitations,
  memberships,
  audit,
  membershipIdFactory = crypto.randomUUID,
  roleAssignmentIdFactory = crypto.randomUUID,
  now = () => new Date(),
}: {
  session: AuthSession;
  invitationId: string;
  invitations: InvitationRepository;
  memberships: MembershipRepository;
  audit: AuditSink;
  membershipIdFactory?: () => string;
  roleAssignmentIdFactory?: () => string;
  now?: () => Date;
}) => {
  const invitation = await invitations.findById(invitationId);

  if (!invitation || invitation.membershipType !== "client") {
    return { ok: false as const, error: "INVITATION_NOT_FOUND" as const };
  }

  if (normalizeEmail(session.email) !== normalizeEmail(invitation.invitedEmail)) {
    await audit.append({
      tenantId: invitation.tenantId,
      clientId: invitation.clientIds[0],
      actorUserId: session.userId,
      action: "InvitationAcceptanceDenied",
      decision: "denied",
      targetType: "invitation",
      targetId: invitation.id,
      reason: "EMAIL_MISMATCH",
    });

    return { ok: false as const, error: "EMAIL_MISMATCH" as const };
  }

  if (invitation.status === "accepted") {
    return { ok: true as const, value: invitation, idempotent: true as const };
  }

  if (invitation.status !== "pending") {
    return { ok: false as const, error: "INVITATION_NOT_FOUND" as const };
  }

  const acceptedAt = now();

  if (acceptedAt > new Date(invitation.expiresAt)) {
    await audit.append({
      tenantId: invitation.tenantId,
      clientId: invitation.clientIds[0],
      actorUserId: session.userId,
      action: "InvitationAcceptanceDenied",
      decision: "denied",
      targetType: "invitation",
      targetId: invitation.id,
      reason: "INVITATION_EXPIRED",
    });

    return { ok: false as const, error: "INVITATION_EXPIRED" as const };
  }

  const [clientId] = invitation.clientIds;

  if (!clientId || invitation.clientIds.length !== 1) {
    await audit.append({
      tenantId: invitation.tenantId,
      actorUserId: session.userId,
      action: "InvitationAcceptanceDenied",
      decision: "denied",
      targetType: "invitation",
      targetId: invitation.id,
      reason: "VALIDATION_FAILED",
    });

    return { ok: false as const, error: "VALIDATION_FAILED" as const };
  }

  const clientMembership = await memberships.activateClientMembership({
    id: membershipIdFactory(),
    tenantId: invitation.tenantId,
    clientId,
    userId: session.userId,
  });

  const roleAssignment = await memberships.assignRole({
    id: roleAssignmentIdFactory(),
    tenantId: invitation.tenantId,
    membershipId: clientMembership.id,
    roleKey: invitation.roleKey,
    scopeType: "client",
    scopeId: clientId,
  });

  const accepted = await invitations.accept({
    invitationId: invitation.id,
    acceptedBy: session.userId,
    acceptedAt: acceptedAt.toISOString(),
  });

  await audit.append({
    tenantId: invitation.tenantId,
    clientId,
    actorUserId: session.userId,
    action: "ClientMembershipActivated",
    decision: "allowed",
    targetType: "client_membership",
    targetId: clientMembership.id,
  });
  await audit.append({
    tenantId: invitation.tenantId,
    clientId,
    actorUserId: session.userId,
    action: "InvitationAccepted",
    decision: "allowed",
    targetType: "invitation",
    targetId: invitation.id,
  });

  return {
    ok: true as const,
    value: {
      invitation: accepted ?? invitation,
      clientMembership,
      roleAssignments: [roleAssignment],
    },
  };
};
