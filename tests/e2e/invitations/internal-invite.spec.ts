import { expect, test } from "@playwright/test";

test("shows internal invite form and assigned-client portfolio surface", async ({
  page,
}) => {
  await page.goto("/invitations/internal");

  await expect(
    page.getByRole("heading", { name: "Ø¯Ø¹ÙˆØ© Ø¹Ø¶Ùˆ Ø¯Ø§Ø®Ù„ÙŠ" }),
  ).toBeVisible();
  await expect(page.getByLabel("Ø¨Ø±ÙŠØ¯ Ø§Ù„Ø¹Ø¶Ùˆ")).toBeVisible();
  await expect(page.getByLabel("Ø§Ù„Ø¯ÙˆØ±")).toBeVisible();
  await expect(page.getByLabel("Ù†Ø·Ø§Ù‚ Ø§Ù„Ø¹Ù…ÙŠÙ„")).toBeVisible();

  await page.goto("/portfolio");

  await expect(page.getByRole("heading", { name: "Ø¹Ù…Ù„Ø§Ø¦ÙŠ" })).toBeVisible();
  await expect(page.getByText("Client A")).toBeVisible();
  await expect(page.getByText("Client B")).toHaveCount(0);
});
