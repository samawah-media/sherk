import type { ClientRecord } from "@/modules/clients/client-repository";

export function AssignedClients({
  clients,
}: {
  clients: Pick<ClientRecord, "id" | "name">[];
}) {
  if (clients.length === 0) {
    return (
      <section
        aria-label="Ø­Ø§Ù„Ø© Ø¹Ø¯Ù… ÙˆØ¬ÙˆØ¯ Ø¹Ù…Ù„Ø§Ø¡ Ù…Ø³Ù†Ø¯ÙŠÙ†"
        className="rounded-lg border border-dashed border-border p-6"
      >
        <h2 className="text-lg font-semibold">Ù„Ø§ ÙŠÙˆØ¬Ø¯ Ø¹Ù…Ù„Ø§Ø¡ Ù…Ø³Ù†Ø¯ÙˆÙ†</h2>
        <p className="mt-2 text-sm text-muted">
          Ø³ØªØ¸Ù‡Ø± Ù‡Ù†Ø§ Ø§Ù„Ø¹Ù…Ù„Ø§Ø¡ Ø§Ù„Ø°ÙŠÙ† ØªÙ… Ø¥Ø³Ù†Ø§Ø¯Ù‡Ù… Ù„Ùƒ Ø¨Ø¹Ø¯ Ù‚Ø¨ÙˆÙ„ Ø§Ù„Ø¯Ø¹ÙˆØ©.
        </p>
      </section>
    );
  }

  return (
    <section aria-label="Ø¹Ù…Ù„Ø§Ø¦ÙŠ Ø§Ù„Ù…Ø³Ù†Ø¯ÙˆÙ†" className="grid gap-3">
      {clients.map((client) => (
        <article
          className="rounded-lg border border-border p-4"
          key={client.id}
        >
          <h2 className="text-base font-semibold">{client.name}</h2>
          <p className="mt-1 text-sm text-muted">Ø¯Ø§Ø®Ù„ Ù†Ø·Ø§Ù‚ ØµÙ„Ø§Ø­ÙŠØ§ØªÙƒ</p>
        </article>
      ))}
    </section>
  );
}
