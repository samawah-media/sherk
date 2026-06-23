/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { DeliverableStatus, SlaStatus } from "../types";

// SLA Badge Component
export const SlaBadge: React.FC<{ status: SlaStatus; daysRemaining?: number }> = ({
  status,
  daysRemaining
}) => {
  let bg = "bg-emerald-50 text-emerald-700 border-emerald-200/60";
  let dotColor = "bg-emerald-500";
  let text = status;

  if (status === SlaStatus.RISK) {
    bg = "bg-amber-50 text-amber-700 border-amber-200/60";
    dotColor = "bg-amber-500";
    text = `${status} (${daysRemaining} يوم)`;
  } else if (status === SlaStatus.LATE) {
    bg = "bg-rose-50 text-rose-700 border-rose-200/60";
    dotColor = "bg-rose-500";
    const absoluteDays = daysRemaining ? Math.abs(daysRemaining) : 0;
    text = `${status} (متأخر ${absoluteDays} يوم)`;
  } else if (status === SlaStatus.WAITING_CLIENT) {
    bg = "bg-blue-50 text-blue-700 border-blue-200/60";
    dotColor = "bg-blue-500";
    text = "بانتظار العميل";
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border ${bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor} animate-pulse`} />
      <span>{text}</span>
    </span>
  );
};

// Deliverable Status Badge Component
export const StatusBadge: React.FC<{ status: DeliverableStatus }> = ({ status }) => {
  let bg = "bg-slate-100 text-slate-700 border-slate-200";

  switch (status) {
    case DeliverableStatus.NOT_STARTED:
      bg = "bg-slate-100 text-slate-600 border-slate-200";
      break;
    case DeliverableStatus.IN_PROGRESS:
      bg = "bg-indigo-50 text-indigo-700 border-indigo-200/60";
      break;
    case DeliverableStatus.READY_INTERNAL_REVIEW:
      bg = "bg-amber-50 text-amber-700 border-amber-200/50";
      break;
    case DeliverableStatus.NEEDS_INTERNAL_REVISION:
      bg = "bg-orange-50 text-orange-700 border-orange-200/50";
      break;
    case DeliverableStatus.APPROVED_INTERNALLY:
      bg = "bg-purple-50 text-purple-700 border-purple-200/60";
      break;
    case DeliverableStatus.PENDING_CLIENT_APPROVAL:
      bg = "bg-sky-50 text-sky-700 border-sky-200/60";
      break;
    case DeliverableStatus.NEEDS_CLIENT_REVISION:
      bg = "bg-rose-50 text-rose-700 border-rose-200/50";
      break;
    case DeliverableStatus.APPROVED_BY_CLIENT:
      bg = "bg-emerald-50 text-emerald-700 border-emerald-200/60";
      break;
    case DeliverableStatus.DELIVERED:
      bg = "bg-teal-500 text-white border-transparent shadow-sm";
      break;
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-1 text-[11px] font-bold rounded-lg border leading-none ${bg}`}>
      {status}
    </span>
  );
};

// Priority Badge
export const PriorityBadge: React.FC<{ priority: "عالية" | "متوسطة" | "منخفضة" }> = ({ priority }) => {
  let bg = "bg-slate-50 text-slate-500";
  if (priority === "عالية") bg = "bg-rose-50 text-rose-600 font-bold border border-rose-100";
  else if (priority === "متوسطة") bg = "bg-amber-50 text-amber-600 font-medium border border-amber-100";

  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-[11px] rounded ${bg}`}>
      {priority}
    </span>
  );
};
