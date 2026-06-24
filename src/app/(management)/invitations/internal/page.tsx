import {
  InternalInviteEmptyState,
  InternalInviteForm,
} from "@/ui/management/internal-invite-form";

export default function InternalInvitationPage() {
  return (
    <main className="grid gap-6">
      <h1 className="text-2xl font-semibold">دعوة عضو داخلي</h1>
      <InternalInviteEmptyState />
      <InternalInviteForm />
    </main>
  );
}
