export type AuditDecision = "allowed" | "denied";

export type AuditEvent = {
  tenantId: string;
  clientId?: string;
  actorUserId?: string;
  action: string;
  decision: AuditDecision;
  targetType: string;
  targetId: string;
  reason?: string;
  occurredAt?: string;
};

export type AuditSink = {
  append: (event: AuditEvent) => Promise<void>;
};

export class InMemoryAuditSink implements AuditSink {
  readonly events: AuditEvent[] = [];

  async append(event: AuditEvent) {
    this.events.push({
      ...event,
      occurredAt: event.occurredAt ?? new Date().toISOString(),
    });
  }
}

export const createAuditGuard = (sink: AuditSink) => ({
  async runSensitive<T>({
    auditEvent,
    operation,
  }: {
    auditEvent?: AuditEvent;
    operation: () => Promise<T>;
  }) {
    if (!auditEvent) {
      throw new Error("AUDIT_EVENT_REQUIRED");
    }

    const result = await operation();
    await sink.append(auditEvent);
    return result;
  },
});
