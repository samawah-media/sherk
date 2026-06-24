import {
  InternalInviteEmptyState,
  InternalInviteForm,
} from "@/ui/management/internal-invite-form";

export default function InternalInvitationPage() {
  return (
    <main className="grid gap-6">
      <h1 className="text-2xl font-semibold">Ø¯Ø¹ÙˆØ© Ø¹Ø¶Ùˆ Ø¯Ø§Ø®Ù„ÙŠ</h1>
      <InternalInviteEmptyState />
      <InternalInviteForm />
    </main>
  );
}
