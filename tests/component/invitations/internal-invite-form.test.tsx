import { cleanup, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AssignedClients } from "@/ui/management/assigned-clients";
import {
  InternalInviteEmptyState,
  InternalInviteForm,
  InternalInviteLoadingState,
  InternalInviteSaveFailure,
} from "@/ui/management/internal-invite-form";

describe("internal invitation UI", () => {
  it("renders Arabic RTL-ready invite fields", () => {
    render(<InternalInviteForm />);

    expect(
      screen.getByRole("form", { name: "Ø¯Ø¹ÙˆØ© Ø¹Ø¶Ùˆ Ø¯Ø§Ø®Ù„ÙŠ" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Ø¨Ø±ÙŠØ¯ Ø§Ù„Ø¹Ø¶Ùˆ")).toBeRequired();
    expect(screen.getByLabelText("Ø§Ù„Ø¯ÙˆØ±")).toBeRequired();
    expect(screen.getByLabelText("Ù†Ø·Ø§Ù‚ Ø§Ù„Ø¹Ù…ÙŠÙ„")).toBeRequired();
    expect(
      screen.getByRole("button", { name: "Ø¥Ø±Ø³Ø§Ù„ Ø§Ù„Ø¯Ø¹ÙˆØ©" }),
    ).toBeInTheDocument();
  });

  it("renders empty, loading, and save failure states without client leakage", () => {
    render(
      <>
        <InternalInviteEmptyState />
        <InternalInviteLoadingState />
        <InternalInviteSaveFailure />
      </>,
    );

    expect(
      screen.getByText("Ù„Ø§ ØªÙˆØ¬Ø¯ Ø¯Ø¹ÙˆØ§Øª Ø¯Ø§Ø®Ù„ÙŠØ© Ø¨Ø¹Ø¯"),
    ).toBeInTheDocument();
    expect(screen.getByText("Ø¬Ø§Ø±ÙŠ ØªØ¬Ù‡ÙŠØ² Ø§Ù„Ø¯Ø¹ÙˆØ©...")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.queryByText("Client B")).not.toBeInTheDocument();
  });
});

describe("assigned clients UI", () => {
  it("shows assigned client portfolio only", () => {
    cleanup();
    render(<AssignedClients clients={[{ id: "client_a", name: "Client A" }]} />);

    expect(screen.getByText("Client A")).toBeInTheDocument();
    expect(screen.queryByText("Client B")).not.toBeInTheDocument();
  });

  it("renders no-assigned-client state", () => {
    render(<AssignedClients clients={[]} />);

    expect(screen.getByText("Ù„Ø§ ÙŠÙˆØ¬Ø¯ Ø¹Ù…Ù„Ø§Ø¡ Ù…Ø³Ù†Ø¯ÙˆÙ†")).toBeInTheDocument();
  });
});
