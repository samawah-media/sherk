import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SignInForm } from "@/ui/auth/sign-in-form";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: vi.fn(),
    replace: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(() => null),
  }),
}));

vi.mock("@/lib/supabase/browser", () => ({
  createSupabaseBrowserClient: () => ({
    auth: {
      signInWithPassword: vi.fn(),
    },
  }),
}));

describe("sign-in form", () => {
  it("lets users show and hide the password value", async () => {
    const user = userEvent.setup();
    render(<SignInForm />);

    const passwordInput = screen.getByLabelText("كلمة المرور");
    expect(passwordInput).toHaveAttribute("type", "password");

    await user.click(screen.getByRole("button", { name: "إظهار كلمة المرور" }));
    expect(passwordInput).toHaveAttribute("type", "text");
    expect(
      screen.getByRole("button", { name: "إخفاء كلمة المرور" }),
    ).toHaveAttribute("aria-pressed", "true");

    await user.click(screen.getByRole("button", { name: "إخفاء كلمة المرور" }));
    expect(passwordInput).toHaveAttribute("type", "password");
  });
});
