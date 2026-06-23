/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { UserRole, Organization } from "../types";
import { Shield, Users, User, RefreshCw, Layers } from "lucide-react";

interface SwitcherControlProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeClient: Organization;
  onClientChange: (client: Organization) => void;
  clientsList: Organization[];
}

export const SwitcherControl: React.FC<SwitcherControlProps> = ({
  currentRole,
  onRoleChange,
  activeClient,
  onClientChange,
  clientsList
}) => {
  return (
    <header className="bg-white border-b border-slate-200 py-3.5 px-6 md:px-8 flex flex-col md:flex-row gap-4 items-center justify-between relative z-50 shadow-xs" dir="rtl">
      {/* Platform Title & Client Selector */}
      <div className="flex flex-wrap items-center gap-4 md:gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#5B35F5] rounded-xl flex items-center justify-center text-white shadow-lg shadow-purple-200 shrink-0">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight text-slate-900 block md:inline">
              سماوة
            </span>
            <span className="text-[10px] text-[#5B35F5] bg-[#5B35F5]/5 border border-[#5B35F5]/10 mr-2 px-1.5 py-0.5 rounded-md font-mono hidden sm:inline-block">
              التميز السحابي
            </span>
          </div>
        </div>

        <div className="h-6 w-px bg-slate-200 hidden md:block"></div>

        {/* Client Swapper */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">العميل الحالي:</span>
          <select
            value={activeClient.id}
            onChange={(e) => {
              const matched = clientsList.find((c) => c.id === e.target.value);
              if (matched) onClientChange(matched);
            }}
            className="text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200/70 transition-colors px-3 py-1.5 rounded-full border-none focus:ring-2 focus:ring-[#5B35F5]/20 cursor-pointer"
          >
            {clientsList.map((client) => (
              <option key={client.id} value={client.id}>
                {client.logo} {client.name}
              </option>
            ))}
          </select>

          {currentRole === UserRole.CLIENT && (
            <span className="text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full font-bold">
              بوابة العميل الرسمية
            </span>
          )}
        </div>
      </div>

      {/* Controller Buttons Selector */}
      <div className="flex items-center gap-3 bg-slate-120/95 p-1 bg-slate-100 rounded-xl">
        {/* Client Role Button */}
        <button
          onClick={() => onRoleChange(UserRole.CLIENT)}
          className={`px-4 py-1.5 rounded-lg text-xs transition-all duration-200 cursor-pointer ${
            currentRole === UserRole.CLIENT
              ? "text-[#5B35F5] font-bold bg-white shadow-sm"
              : "text-slate-500 font-medium hover:bg-white"
          }`}
        >
          بوابة العميل
        </button>

        {/* Team Role Button */}
        <button
          onClick={() => onRoleChange(UserRole.TEAM)}
          className={`px-4 py-1.5 rounded-lg text-xs transition-all duration-200 cursor-pointer ${
            currentRole === UserRole.TEAM
              ? "text-[#5B35F5] font-bold bg-white shadow-sm"
              : "text-slate-500 font-medium hover:bg-white"
          }`}
        >
          فريق العمل
        </button>

        {/* Admin Role Button */}
        <button
          onClick={() => onRoleChange(UserRole.ADMIN)}
          className={`px-4 py-1.5 rounded-lg text-xs transition-all duration-200 cursor-pointer ${
            currentRole === UserRole.ADMIN
              ? "text-[#5B35F5] font-bold bg-white shadow-sm"
              : "text-slate-500 font-medium hover:bg-white"
          }`}
        >
          لوحة الإدارة
        </button>
      </div>

      {/* Micro Info widget */}
      <div className="hidden xl:flex items-center gap-2 text-[11px] text-slate-400 font-medium">
        <RefreshCw className="w-3.5 h-3.5 text-[#5B35F5] animate-spin" style={{ animationDuration: '8s' }} />
        <span>بنية بيانات متزامنة تلقائياً</span>
      </div>
    </header>
  );
};
