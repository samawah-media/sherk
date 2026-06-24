import { describe, expect, it } from "vitest";
import { InMemoryAuditSink } from "@/modules/audit/audit-service";
import { InMemoryClientRepository } from "@/modules/clients/client-repository";
import { LocalInvitationEmailDispatcher } from "@/modules/invitations/email-dispatcher";
import { InMemoryInvitationRepository } from "@/modules/invitations/invitation-repository";
import { InMemoryMembershipRepository } from "@/modules/memberships/membership-repository";
import { acceptClientInvitationCommand } from "@/server/commands/invitations/accept-invitation";
import { inviteClientMemberCommand } from "@/server/commands/invitations/invite-client-member";
import { clientA, tenantAdminA } from "../../fixtures/f001-fixtures";

const seededClients = () =>
  new InMemoryClientRepository([
    {
      id: clientA.id,
      tenantId: clientA.tenantId,
      name: clientA.name,
      slug: "client-a",
      status: "active",
      createdBy: tenantAdminA.session.userId,
      createdAt: new Date(0).toISOString(),
      updatedAt: new Date(0).toISOString(),
      revision: 1,
    },
  ]);

describe("invite client member command", () => {
  it("creates a pending one-client client invitation and audit intent", async () => {
    const audit = new InMemoryAuditSink();
    const invitations = new InMemoryInvitationRepository();
    const dispatcher = new LocalInvitationEmailDispatcher();

    const result = await inviteClientMemberCommand({
      actor: tenantAdminA.authorizationActor,
      clients: seededClients(),
      invitations,
      audit,
      dispatcher,
      input: {
        email: "client-viewer-a@example.test",
        roleKey: "client_viewer",
        clientId: clientA.id,
        idempotencyKey: "invite-client-a",
      },
      idFactory: () => "inv_client_a",
      tokenFactory: () => "token_client_a",
      now: () => new Date("2026-06-24T08:00:00.000Z"),
    });

    expect(result).toMatchObject({
      ok: true,
      value: {
        ok: true,
        value: {
          id: "inv_client_a",
          tenantId: clientA.tenantId,
          membershipType: "client",
          clientIds: [clientA.id],
          status: "pending",
          deliveryState: "sent",
        },
      },
    });
    expect(dispatcher.sent).toHaveLength(1);
    expect(audit.events).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          action: "ClientMemberInvited",
          clientId: clientA.id,
          targetId: "inv_client_a",
        }),
        expect.objectContaining({
          action: "RoleAssigned",
          reason: "intent_pending_acceptance",
        }),
      ]),
    );
  });

  it("denies client self-service actors without creating invitations", async () => {
    const audit = new InMemoryAuditSink();
    const invitations = new InMemoryInvitationRepository();
    const clientAdminActor = {
      userId: "client_admin_a",
      tenantId: clientA.tenantId,
      tenantMembership: {
        id: "tm_client_admin_a",
        tenantId: clientA.tenantId,
        userId: "client_admin_a",
        status: "active" as const,
      },
      roleAssignments: [
        {
          id: "ra_client_admin_a",
          tenantId: clientA.tenantId,
          membershipId: "cm_client_admin_a",
          roleKey: "client_admin" as const,
          scopeType: "client" as const,
          scopeId: clientA.id,
          status: "active" as const,
        },
      ],
    };

    const result = await inviteClientMemberCommand({
      actor: clientAdminActor,
      clients: seededClients(),
      invitations,
      audit,
      dispatcher: new LocalInvitationEmailDispatcher(),
      input: {
        email: "client-viewer-a@example.test",
        roleKey: "client_admin",
        clientId: clientA.id,
      },
      idFactory: () => "denied_client_invitation",
    });

    expect(result).toMatchObject({ ok: false });
    expect(await invitations.listByTenant(clientA.tenantId)).toEqual([]);
    expect(audit.events).toContainEqual(
      expect.objectContaining({
        action: "AuthorizationDenied",
        decision: "denied",
      }),
    );
  });
});

describe("accept client invitation command", () => {
  it("activates client membership and scoped client role for an existing user", async () => {
    const audit = new InMemoryAuditSink();
    const invitations = new InMemoryInvitationRepository();
    const memberships = new InMemoryMembershipRepository();

    await inviteClientMemberCommand({
      actor: tenantAdminA.authorizationActor,
      clients: seededClients(),
      invitations,
      audit,
      dispatcher: new LocalInvitationEmailDispatcher(),
      input: {
        email: "client-viewer-a@example.test",
        roleKey: "client_viewer",
        clientId: clientA.id,
      },
      idFactory: () => "inv_client_accept",
      tokenFactory: () => "token_client_accept",
      now: () => new Date("2026-06-24T08:00:00.000Z"),
    });

    const result = await acceptClientInvitationCommand({
      session: {
        userId: "client_viewer_a",
        email: "client-viewer-a@example.test",
      },
      invitationId: "inv_client_accept",
      invitations,
      memberships,
      audit,
      membershipIdFactory: () => "cm_client_viewer_a",
      roleAssignmentIdFactory: () => "ra_client_viewer_a",
      now: () => new Date("2026-06-24T09:00:00.000Z"),
    });

    expect(result).toMatchObject({
      ok: true,
      value: {
        clientMembership: {
          id: "cm_client_viewer_a",
          tenantId: clientA.tenantId,
          clientId: clientA.id,
          userId: "client_viewer_a",
        },
        roleAssignments: [
          {
            roleKey: "client_viewer",
            scopeType: "client",
            scopeId: clientA.id,
          },
        ],
      },
    });
    expect(await memberships.listTenantMemberships(clientA.tenantId)).toEqual([]);
    expect(audit.events).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ action: "ClientMembershipActivated" }),
        expect.objectContaining({ action: "InvitationAccepted" }),
      ]),
    );
  });

  it("uses the same path for a newly created auth user session", async () => {
    const audit = new InMemoryAuditSink();
    const invitations = new InMemoryInvitationRepository();
    const memberships = new InMemoryMembershipRepository();

    await inviteClientMemberCommand({
      actor: tenantAdminA.authorizationActor,
      clients: seededClients(),
      invitations,
      audit,
      dispatcher: new LocalInvitationEmailDispatcher(),
      input: {
        email: "new-client-user@example.test",
        roleKey: "client_approver",
        clientId: clientA.id,
      },
      idFactory: () => "inv_new_client_accept",
      tokenFactory: () => "token_new_client_accept",
      now: () => new Date("2026-06-24T08:00:00.000Z"),
    });

    const result = await acceptClientInvitationCommand({
      session: {
        userId: "new_client_user",
        email: "new-client-user@example.test",
      },
      invitationId: "inv_new_client_accept",
      invitations,
      memberships,
      audit,
      membershipIdFactory: () => "cm_new_client_user",
      roleAssignmentIdFactory: () => "ra_new_client_user",
      now: () => new Date("2026-06-24T09:00:00.000Z"),
    });

    expect(result).toMatchObject({
      ok: true,
      value: {
        roleAssignments: [
          {
            roleKey: "client_approver",
            scopeId: clientA.id,
          },
        ],
      },
    });
  });
});
