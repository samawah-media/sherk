export function InternalInviteForm() {
  return (
    <form aria-label="Ø¯Ø¹ÙˆØ© Ø¹Ø¶Ùˆ Ø¯Ø§Ø®Ù„ÙŠ">
      <div className="grid gap-4">
        <label className="grid gap-2 text-sm font-medium">
          Ø¨Ø±ÙŠØ¯ Ø§Ù„Ø¹Ø¶Ùˆ
          <input
            className="rounded-md border border-border bg-background px-3 py-2"
            name="email"
            required
            type="email"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Ø§Ù„Ø¯ÙˆØ±
          <select
            className="rounded-md border border-border bg-background px-3 py-2"
            name="roleKey"
            required
          >
            <option value="account_manager">Ù…Ø¯ÙŠØ± Ø­Ø³Ø§Ø¨</option>
            <option value="content_writer">ÙƒØ§ØªØ¨ Ù…Ø­ØªÙˆÙ‰</option>
            <option value="designer">Ù…ØµÙ…Ù…</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Ù†Ø·Ø§Ù‚ Ø§Ù„Ø¹Ù…ÙŠÙ„
          <select
            className="rounded-md border border-border bg-background px-3 py-2"
            name="clientIds"
            required
          >
            <option value="client_a">Client A</option>
          </select>
        </label>
        <button
          className="w-fit rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          type="submit"
        >
          Ø¥Ø±Ø³Ø§Ù„ Ø§Ù„Ø¯Ø¹ÙˆØ©
        </button>
      </div>
    </form>
  );
}

export function InternalInviteEmptyState() {
  return (
    <section
      aria-label="Ø­Ø§Ù„Ø© Ø§Ù„Ø¯Ø¹ÙˆØ§Øª Ø§Ù„ÙØ§Ø±ØºØ©"
      className="rounded-lg border border-dashed border-border p-6"
    >
      <h2 className="text-lg font-semibold">Ù„Ø§ ØªÙˆØ¬Ø¯ Ø¯Ø¹ÙˆØ§Øª Ø¯Ø§Ø®Ù„ÙŠØ© Ø¨Ø¹Ø¯</h2>
      <p className="mt-2 text-sm text-muted">
        Ø£Ø±Ø³Ù„ Ø¯Ø¹ÙˆØ© Ù„Ø¹Ø¶Ùˆ Ø¯Ø§Ø®Ù„ÙŠ Ù…Ø¹ ØªØ­Ø¯ÙŠØ¯ Ø§Ù„Ø¹Ù…ÙŠÙ„ Ø§Ù„Ù…Ø³Ù…ÙˆØ­ Ù„Ù‡.
      </p>
    </section>
  );
}

export function InternalInviteLoadingState() {
  return <p className="text-sm text-muted">Ø¬Ø§Ø±ÙŠ ØªØ¬Ù‡ÙŠØ² Ø§Ù„Ø¯Ø¹ÙˆØ©...</p>;
}

export function InternalInviteSaveFailure() {
  return (
    <p role="alert" className="text-sm font-medium text-destructive">
      ØªØ¹Ø°Ø± Ø¥Ø±Ø³Ø§Ù„ Ø§Ù„Ø¯Ø¹ÙˆØ©. Ø±Ø§Ø¬Ø¹ Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª ÙˆØ­Ø§ÙˆÙ„ Ù…Ø±Ø© Ø£Ø®Ø±Ù‰.
    </p>
  );
}
