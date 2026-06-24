type InvitationStatus =
  | "pending"
  | "accepted"
  | "expired"
  | "revoked"
  | "superseded"
  | "already-used"
  | "email-mismatch";

const statusCopy: Record<
  InvitationStatus,
  { title: string; body: string; action: string }
> = {
  pending: {
    title: "Ø§Ù„Ø¯Ø¹ÙˆØ© Ø¬Ø§Ù‡Ø²Ø©",
    body: "Ø³Ø¬Ù„ Ø§Ù„Ø¯Ø®ÙˆÙ„ Ø¨Ù†ÙØ³ Ø§Ù„Ø¨Ø±ÙŠØ¯ Ø§Ù„Ù…Ø¯Ø¹Ùˆ Ù„Ø¥ÙƒÙ…Ø§Ù„ Ø§Ù„Ø§Ù†Ø¶Ù…Ø§Ù….",
    action: "Ù…ØªØ§Ø¨Ø¹Ø© Ø§Ù„Ø¯Ø¹ÙˆØ©",
  },
  accepted: {
    title: "ØªÙ… Ù‚Ø¨ÙˆÙ„ Ø§Ù„Ø¯Ø¹ÙˆØ©",
    body: "ØªÙ… ØªÙØ¹ÙŠÙ„ Ø§Ù„ÙˆØµÙˆÙ„ Ø¶Ù…Ù† Ø§Ù„Ù†Ø·Ø§Ù‚ Ø§Ù„Ù…Ø³Ù…ÙˆØ­ ÙÙ‚Ø·.",
    action: "Ø§Ù„Ø¯Ø®ÙˆÙ„ Ù„Ù„Ù…Ù†ØµØ©",
  },
  expired: {
    title: "Ø§Ù†ØªÙ‡Øª ØµÙ„Ø§Ø­ÙŠØ© Ø§Ù„Ø¯Ø¹ÙˆØ©",
    body: "Ø§Ø·Ù„Ø¨ Ø±Ø§Ø¨Ø· Ø¯Ø¹ÙˆØ© Ø¬Ø¯ÙŠØ¯ Ù…Ù† Ù…Ø¯ÙŠØ± Ø§Ù„Ø­Ø³Ø§Ø¨.",
    action: "Ø§Ù„Ø¹ÙˆØ¯Ø© Ù„ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø¯Ø®ÙˆÙ„",
  },
  revoked: {
    title: "Ø§Ù„Ø¯Ø¹ÙˆØ© ØºÙŠØ± Ù…ØªØ§Ø­Ø©",
    body: "ØªÙ… Ø¥ÙŠÙ‚Ø§Ù Ù‡Ø°Ù‡ Ø§Ù„Ø¯Ø¹ÙˆØ© Ø¨Ø£Ù…Ø§Ù† ÙˆÙ„Ù… ÙŠØªÙ… Ù…Ù†Ø­ Ø£ÙŠ ØµÙ„Ø§Ø­ÙŠØ©.",
    action: "Ø·Ù„Ø¨ Ù…Ø³Ø§Ø¹Ø¯Ø©",
  },
  superseded: {
    title: "ÙŠÙˆØ¬Ø¯ Ø±Ø§Ø¨Ø· Ø£Ø­Ø¯Ø«",
    body: "Ù‡Ø°Ø§ Ø§Ù„Ø±Ø§Ø¨Ø· Ù„Ù… ÙŠØ¹Ø¯ ØµØ§Ù„Ø­Ù‹Ø§. Ø§Ø³ØªØ®Ø¯Ù… Ø¢Ø®Ø± Ø±Ø§Ø¨Ø· ØªÙ… Ø¥Ø±Ø³Ø§Ù„Ù‡.",
    action: "ÙÙ‡Ù…Øª",
  },
  "already-used": {
    title: "ØªÙ… Ø§Ø³ØªØ®Ø¯Ø§Ù… Ø§Ù„Ø¯Ø¹ÙˆØ©",
    body: "Ø§Ù„Ø¹Ø¶ÙˆÙŠØ© Ø§Ù„Ù…Ø±ØªØ¨Ø·Ø© Ø¨Ù‡Ø°Ù‡ Ø§Ù„Ø¯Ø¹ÙˆØ© Ù…Ø¹Ø§Ù„Ø¬Ø© Ù…Ø³Ø¨Ù‚Ù‹Ø§.",
    action: "Ø§Ù„Ø¯Ø®ÙˆÙ„",
  },
  "email-mismatch": {
    title: "Ø§Ù„Ø¨Ø±ÙŠØ¯ ØºÙŠØ± Ù…Ø·Ø§Ø¨Ù‚",
    body: "Ø§Ø³ØªØ®Ø¯Ù… Ø§Ù„Ø¨Ø±ÙŠØ¯ Ø§Ù„Ø°ÙŠ Ø§Ø³ØªÙ„Ù… Ø§Ù„Ø¯Ø¹ÙˆØ©. Ù„Ù… ÙŠØªÙ… Ù…Ù†Ø­ Ø£ÙŠ ØµÙ„Ø§Ø­ÙŠØ©.",
    action: "ØªØ¨Ø¯ÙŠÙ„ Ø§Ù„Ø­Ø³Ø§Ø¨",
  },
};

export function InvitationStatusView({
  status = "pending",
}: {
  status?: InvitationStatus;
}) {
  const copy = statusCopy[status];

  return (
    <main className="mx-auto grid min-h-dvh w-full max-w-xl content-center gap-6 px-4 py-8">
      <section className="grid gap-4 rounded-lg border border-border p-6">
        <p className="text-sm font-medium text-muted">Ø¯Ø¹ÙˆØ© Ø§Ù„Ù…Ù†ØµØ©</p>
        <h1 className="text-2xl font-semibold">{copy.title}</h1>
        <p className="text-sm leading-6 text-muted">{copy.body}</p>
        <a
          className="w-fit rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          href="/sign-in"
        >
          {copy.action}
        </a>
      </section>
    </main>
  );
}
