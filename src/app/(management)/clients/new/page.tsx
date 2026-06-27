import {
  guardManagementRoute,
  resolveRouteRuntime,
} from "@/server/navigation/route-guards";
import { createClientAction } from "@/server/actions/clients";
import { ClientForm } from "@/ui/management/client-form";
import {
  AccessDeniedState,
  MembershipDisabledState,
  SessionExpiredState,
} from "@/ui/shared/access-states";

export default async function NewClientPage({
  searchParams,
}: {
  searchParams?: Promise<{ as?: string }>;
}) {
  const params = await searchParams;
  const runtime = await resolveRouteRuntime(params?.as);

  if (!runtime.ok) {
    if (runtime.reason === "auth_required" || runtime.reason === "session_expired") {
      return <SessionExpiredState />;
    }

    if (runtime.reason === "membership_disabled") {
      return <MembershipDisabledState returnHref="/sign-in" />;
    }

    return <AccessDeniedState returnHref="/sign-in" />;
  }

  const access = guardManagementRoute({ actor: runtime.actor, route: "clientWrite" });

  if (!access.allowed) {
    return <AccessDeniedState />;
  }

  return (
    <main className="grid max-w-2xl gap-6">
      <h1 className="text-2xl font-semibold">إضافة عميل</h1>
      <ClientForm action={createClientAction} />
    </main>
  );
}
