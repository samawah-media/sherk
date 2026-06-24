import { expect, test } from "@playwright/test";

test.setTimeout(60_000);

const states = [
  ["expired", "Ø§Ù†ØªÙ‡Øª ØµÙ„Ø§Ø­ÙŠØ© Ø§Ù„Ø¯Ø¹ÙˆØ©"],
  ["revoked", "Ø§Ù„Ø¯Ø¹ÙˆØ© ØºÙŠØ± Ù…ØªØ§Ø­Ø©"],
  ["superseded", "ÙŠÙˆØ¬Ø¯ Ø±Ø§Ø¨Ø· Ø£Ø­Ø¯Ø«"],
  ["used", "ØªÙ… Ø§Ø³ØªØ®Ø¯Ø§Ù… Ø§Ù„Ø¯Ø¹ÙˆØ©"],
  ["mismatch", "Ø§Ù„Ø¨Ø±ÙŠØ¯ ØºÙŠØ± Ù…Ø·Ø§Ø¨Ù‚"],
] as const;

for (const [token, heading] of states) {
  test(`shows safe ${token} invitation lifecycle state`, async ({ page }) => {
    await page.goto(`/invite/${token}`, { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("heading", { name: heading })).toBeVisible();
    await expect(page.getByText("Client B")).toHaveCount(0);
    await expect(page.getByText("tenant_b")).toHaveCount(0);
  });
}
