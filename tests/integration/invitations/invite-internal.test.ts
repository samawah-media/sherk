import { describe, expect, it } from "vitest";
import { InMemoryAuditSink } from "@/modules/audit/audit-service";
import { InMemoryClientRepository } from "@/modules/clients/client-repository";
import { LocalInvitationEmailDispatcher } from "@/modules/invitations/email-dispatcher";
import { InMemoryInvitationRepository } from "@/modules/invitations/invitation-repository";
import { InMemoryMembershipRepository } from "@/modules/memberships/membership-repository";
import { acceptInternalInvitationCommand } from "@/server/commands/invitations/accept-invitation";
import { inviteInternalMemberCommand } from "@/server/commands/invitations/invite-internal-member";
import { assignedInternalA, clientA, tenantAdminA, tenantViewerA } from "../../fixtures/f001-fixtures";

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

describe("invite internal member command", () => {
  it("creates a pending scoped internal invitation and audit intent", async () => {
    const audit = new InMemoryAuditSink();
    const invitations = new InMemoryInvitationRepository();
    const dispatcher = new LocalInvitationEmailDispatcher();

    const result = await inviteInternalMemberCommand({
      actor: tenantAdminA.authorizationActor,
      clients: seededClients(),
      invitations,
      audit,
      dispatcher,
      input: {
        email: "internal-a@example.test",
        roleKey: "account_manager",
        clientIds: [clientA.id],
        idempotencyKey: "invite-internal-a",
      },
      idFactory: () => "inv_internal_a",
      tokenFactory: () => "token_internal_a",
      now: () => new Date("2026-06-24T08:00:00.000Z"),
    });

    expect(result).toMatchObject({
      ok: true,
      value: {
        ok: true,
        value: {
          id: "inv_internal_a",
          tenantId: clientA.tenantId,
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
          action: "TenantMembershipInvited",
          decision: "allowed",
          targetId: "inv_internal_a",
        }),
        expect.objectContaining({
          action: "RoleAssigned",
          reason: "intent_pending_acceptance",
        }),
      ]),
    );
  });

  it("denies users without invite permission before creating invitations", async () => {
    const audit = new InMemoryAuditSink();
    const invitations = new InMemoryInvitationRepository();

    const result = await inviteInternalMemberCommand({
      actor: tenantViewerA.authorizationActor,
      clients: seededClients(),
      invitations,
      audit,
      dispatcher: new LocalInvitationEmailDispatcher(),
      input: {
        email: "internal-a@example.test",
        roleKey: "account_manager",
        clientIds: [clientA.id],
      },
      idFactory: () => "denied_invitation",
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

describe("accept internal invitation command", () => {
  it("activates tenant membership and assigned client role without broad scope", async () => {
    const audit = new InMemoryAuditSink();
    const invitations = new InMemoryInvitationRepository();
    const dispatcher = new LocalInvitationEmailDispatcher();
    const memberships = new InMemoryMembershipRepository();

    await inviteInternalMemberCommand({
      actor: tenantAdminA.authorizationActor,
      clients: seededClients(),
      invitations,
      audit,
      dispatcher,
      input: {
        email: assignedInternalA.session.email,
        roleKey: "account_manager",
        clientIds: [clientA.id],
      },
      idFactory: () => "inv_to_accept",
      tokenFactory: () => "token_to_accept",
      now: () => new Date("2026-06-24T08:00:00.000Z"),
    });

    const result = await acceptInternalInvitationCommand({
      session: assignedInternalA.session,
      invitationId: "inv_to_accept",
      invitations,
      memberships,
      audit,
      membershipIdFactory: () => "tm_internal_accepted",
      roleAssignmentIdFactory: () => "ra_internal_accepted_client_a",
      now: () => new Date("2026-06-24T09:00:00.000Z"),
    });

    expect(result).toMatchObject({
      ok: true,
      value: {
        tenantMembership: {
          id: "tm_internal_accepted",
          tenantId: clientA.tenantId,
          userId: assignedInternalA.session.userId,
        },
        roleAssignments: [
          {
            roleKey: "account_manager",
            scopeType: "client",
            scopeId: clientA.id,
          },
        ],
      },
    });
    expect(audit.events).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ action: "TenantMembershipActivated" }),
        expect.objectContaining({ action: "InvitationAccepted" }),
      ]),
    );
  });
});
