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

export type TransactionalResource = {
  snapshot: () => unknown;
  restore: (snapshot: unknown) => void;
};

export class InMemoryAuditSink implements AuditSink {
  readonly events: AuditEvent[] = [];

  async append(event: AuditEvent) {
    this.events.push({
      ...event,
      occurredAt: event.occurredAt ?? new Date().toISOString(),
    });
  }

  snapshot() {
    return this.events.map((event) => ({ ...event }));
  }

  restore(snapshot: unknown) {
    this.events.length = 0;
    this.events.push(...(snapshot as AuditEvent[]).map((event) => ({ ...event })));
  }
}

export class FailingAuditSink implements AuditSink {
  async append() {
    throw new Error("AUDIT_APPEND_FAILED");
  }
}

export const runAuditAtomicMutation = async <T>({
  resources,
  operation,
}: {
  resources: TransactionalResource[];
  operation: () => Promise<T>;
}) => {
  const snapshots = resources.map((resource) => resource.snapshot());

  try {
    return await operation();
  } catch (error) {
    for (let index = resources.length - 1; index >= 0; index -= 1) {
      resources[index].restore(snapshots[index]);
    }

    throw error;
  }
};

export const transactionalResources = (
  resources: unknown[],
): TransactionalResource[] =>
  resources.filter(
    (resource): resource is TransactionalResource =>
      Boolean(resource) &&
      typeof (resource as TransactionalResource).snapshot === "function" &&
      typeof (resource as TransactionalResource).restore === "function",
  );

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
