"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { ClientRecord } from "@/modules/clients/client-repository";
import {
  initialClientFormState,
  type ClientFormState,
} from "@/modules/clients/client-form-state";

type ClientFormAction = (
  previousState: ClientFormState,
  formData: FormData,
) => Promise<ClientFormState>;

function SubmitButton({ mode }: { mode: "create" | "update" }) {
  const { pending } = useFormStatus();

  return (
    <button
      className="w-fit rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
      disabled={pending}
      type="submit"
    >
      {pending
        ? "جار الحفظ..."
        : mode === "create"
          ? "حفظ العميل"
          : "حفظ التعديلات"}
    </button>
  );
}

export function ClientForm({
  action,
  client,
  mode = "create",
}: {
  action?: ClientFormAction;
  client?: ClientRecord;
  mode?: "create" | "update";
}) {
  const [state, formAction] = useActionState(
    action ?? (async () => initialClientFormState),
    initialClientFormState,
  );

  return (
    <form
      action={formAction}
      aria-label={mode === "create" ? "إنشاء عميل" : "تعديل العميل"}
    >
      <div className="grid gap-4">
        {mode === "update" && client ? (
          <>
            <input name="clientId" type="hidden" value={client.id} />
            <input
              name="expectedRevision"
              type="hidden"
              value={client.revision}
            />
          </>
        ) : null}
        <label className="grid gap-2 text-sm font-medium">
          اسم العميل
          <input
            className="rounded-md border border-border bg-background px-3 py-2"
            name="name"
            required
            minLength={2}
            defaultValue={state.values?.name ?? client?.name}
          />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          اسم جهة التواصل
          <input
            className="rounded-md border border-border bg-background px-3 py-2"
            name="primaryContactName"
            defaultValue={
              state.values?.primaryContactName ?? client?.primaryContactName
            }
          />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          بريد جهة التواصل
          <input
            className="rounded-md border border-border bg-background px-3 py-2"
            name="primaryContactEmail"
            type="email"
            defaultValue={
              state.values?.primaryContactEmail ?? client?.primaryContactEmail
            }
          />
        </label>
        {state.status === "error" && state.message ? (
          <p
            aria-live="polite"
            className="rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger"
          >
            {state.message}
          </p>
        ) : null}
        <SubmitButton mode={mode} />
      </div>
    </form>
  );
}

export function ClientEmptyState() {
  return (
    <section aria-label="حالة العملاء الفارغة" className="rounded-lg border border-dashed border-border p-6">
      <h2 className="text-lg font-semibold">لا يوجد عملاء بعد</h2>
      <p className="mt-2 text-sm text-muted">
        ابدأ بإضافة أول عميل داخل نطاق سماوة الآمن.
      </p>
    </section>
  );
}

export function ClientDeniedState() {
  return (
    <section aria-label="تعذر الوصول" className="rounded-lg border border-border p-6">
      <h2 className="text-lg font-semibold">لا يمكنك الوصول إلى هذا المورد.</h2>
      <p className="mt-2 text-sm text-muted">
        لم يتم عرض أي بيانات خارج نطاق صلاحياتك.
      </p>
    </section>
  );
}
