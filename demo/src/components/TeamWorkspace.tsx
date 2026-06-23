/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Organization, Deliverable, DeliverableStatus, SlaStatus, FileAsset, TeamMember } from "../types";
import { SlaBadge, StatusBadge, PriorityBadge } from "./Badges";
import { getStatusProgress } from "../data";
import { 
  Briefcase, Calendar, CheckCircle2, Clock, FileText, Folder, HelpCircle, 
  Layers, Lock, Paperclip, Plus, Search, Settings, Shield, User, Users,
  Wallet, AlertTriangle, CheckSquare, MessageSquare, Bell, Kanban, 
  ListFilter, Eye, MoreHorizontal, ArrowLeft, ArrowRight
} from "lucide-react";

interface TeamWorkspaceProps {
  activeClient: Organization;
  deliverables: Deliverable[];
  files: FileAsset[];
  teamMembers: TeamMember[];
  onOpenDeliverable: (d: Deliverable) => void;
  onOpenFile: (f: FileAsset) => void;
  onUpdateDeliverables: (list: Deliverable[]) => void;
}

export const TeamWorkspace: React.FC<TeamWorkspaceProps> = ({
  activeClient,
  deliverables,
  files,
  teamMembers,
  onOpenDeliverable,
  onOpenFile,
  onUpdateDeliverables
}) => {
  const [activeTab, setActiveTab] = useState<"tasks" | "board" | "list" | "files" | "notifications">("board");
  
  // States of filterings
  const [clientFilter, setClientFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [slaFilter, setSlaFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Simulated drag state for custom HTML5 Drag & Drop
  const [draggingCardId, setDraggingCardId] = useState<string | null>(null);

  // Hardcode current logged in worker for "مهامي" tab
  // Selected as: سارة علي (Designer)
  const myMemberId = "team_2"; 
  const myDetails = teamMembers.find(t => t.id === myMemberId) || teamMembers[1];

  // Filters calculation
  const filteredDeliverables = deliverables.filter(d => {
    // Client Swapper or general team toggler
    if (clientFilter !== "all" && d.orgId !== clientFilter) return false;
    if (typeFilter !== "all" && d.type !== typeFilter) return false;
    if (statusFilter !== "all" && d.status !== statusFilter) return false;
    if (slaFilter !== "all" && d.slaStatus !== slaFilter) return false;
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      return d.title.toLowerCase().includes(q) || (d.contentText && d.contentText.toLowerCase().includes(q));
    }
    return true;
  });

  // Kanban status columns list
  const kanbanColumns = [
    { title: "لم يبدأ", status: DeliverableStatus.NOT_STARTED, bg: "bg-slate-100/80 border-slate-200" },
    { title: "قيد التنفيذ", status: DeliverableStatus.IN_PROGRESS, bg: "bg-indigo-50/45 border-indigo-100" },
    { title: "جاهز للمراجعة الداخلية", status: DeliverableStatus.READY_INTERNAL_REVIEW, bg: "bg-amber-50/45 border-amber-100" },
    { title: "يحتاج تعديل داخلي", status: DeliverableStatus.NEEDS_INTERNAL_REVISION, bg: "bg-orange-50/45 border-orange-100" },
    { title: "معتمد داخليًا", status: DeliverableStatus.APPROVED_INTERNALLY, bg: "bg-purple-50/45 border-purple-100" },
    { title: "بانتظار موافقة العميل", status: DeliverableStatus.PENDING_CLIENT_APPROVAL, bg: "bg-sky-50/45 border-sky-100" },
    { title: "يحتاج تعديل من العميل", status: DeliverableStatus.NEEDS_CLIENT_REVISION, bg: "bg-rose-50/35 border-rose-100" },
    { title: "تم التسليم", status: DeliverableStatus.DELIVERED, bg: "bg-emerald-50/35 border-emerald-150" }
  ];

  // Drag and drop handlers
  const handleDragStart = (cardId: string) => {
    setDraggingCardId(cardId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // allow drops
  };

  const handleDrop = (columnStatus: DeliverableStatus) => {
    if (!draggingCardId) return;

    const list = deliverables.map(d => {
      if (d.id === draggingCardId) {
        return {
          ...d,
          status: columnStatus,
          progress: getStatusProgress(columnStatus),
          // automatic SLA rules:
          slaStatus: columnStatus === DeliverableStatus.PENDING_CLIENT_APPROVAL 
            ? SlaStatus.WAITING_CLIENT 
            : d.slaStatus,
          auditLogs: [
            {
              id: `audit_${Date.now()}`,
              action: `سحب المخرج في لوحة المخرجات إلى مرحلة: [${columnStatus}]`,
              performedBy: "سارة علي (المصممة)",
              userRole: "فريق العمل",
              timestamp: new Date().toISOString(),
              isInternalOnly: true
            },
            ...d.auditLogs
          ]
        };
      }
      return d;
    });

    onUpdateDeliverables(list);
    setDraggingCardId(null);
  };

  // Immediate Team Actions
  const handleStartWorkItem = (delId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const list = deliverables.map(d => {
      if (d.id === delId) {
        return {
          ...d,
          status: DeliverableStatus.IN_PROGRESS,
          progress: 30,
          auditLogs: [
            {
              id: `audit_${Date.now()}`,
              action: "بدء العمل على المخرج وتسجيله بقائمة قيد التشغيل",
              performedBy: "سارة علي (المصممة)",
              userRole: "فريق العمل",
              timestamp: new Date().toISOString(),
              isInternalOnly: true
            },
            ...d.auditLogs
          ]
        };
      }
      return d;
    });
    onUpdateDeliverables(list);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-62px)]">
      {/* Side list tabs - RTL */}
      <aside className="w-full lg:w-64 bg-white border-l border-slate-100 flex flex-col shrink-0">
        <div className="p-5 border-b border-slate-150 text-right">
          <div className="flex gap-2.5 items-center justify-end">
            <div>
              <h3 className="font-extrabold text-[14px] text-slate-800">{myDetails.name}</h3>
              <span className="text-[10px] text-indigo-500 font-bold block">{myDetails.title}</span>
            </div>
            <span className="w-10 h-10 bg-primary-500 text-white rounded-xl flex items-center justify-center font-extrabold text-xs">
              {myDetails.avatar}
            </span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs text-slate-650 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            <div>
              <span className="text-slate-400 block font-semibold text-[9px] mb-0.5">تقييم الجودة</span>
              <span className="font-bold text-emerald-600">{myDetails.rating}%</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold text-[9px] mb-0.5">معدل SLA</span>
              <span className="font-bold text-slate-700">{myDetails.averageSlaDays} يوم</span>
            </div>
          </div>
        </div>

        {/* Sidebar Nav */}
        <nav className="p-3.5 space-y-1 flex-1 text-right">
          <button
            onClick={() => setActiveTab("tasks")}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "tasks"
                ? "bg-[#5B35F5]/5 text-[#5B35F5] font-extrabold"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-950"
            }`}
          >
            <div className="flex items-center gap-1.5 justify-end">
              <span className="bg-indigo-500 text-white rounded-full text-[9px] w-4 h-4 flex items-center justify-center font-bold">
                {deliverables.filter(d => d.ownerId === myMemberId && d.status !== DeliverableStatus.DELIVERED).length}
              </span>
              <span>مهامي النشطة</span>
            </div>
            <CheckSquare className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={() => setActiveTab("board")}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "board"
                ? "bg-[#5B35F5]/5 text-[#5B35F5] font-extrabold"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-950"
            }`}
          >
            <span>لوحة عمل Trello الكبرى</span>
            <Kanban className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={() => setActiveTab("list")}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "list"
                ? "bg-[#5B35F5]/5 text-[#5B35F5] font-extrabold"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-950"
            }`}
          >
            <span>جدول كشوفات المخرجات</span>
            <ListFilter className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={() => setActiveTab("files")}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "files"
                ? "bg-[#5B35F5]/5 text-[#5B35F5] font-extrabold"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-950"
            }`}
          >
            <span>ملفات العمل والهويات</span>
            <Folder className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={() => setActiveTab("notifications")}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "notifications"
                ? "bg-[#5B35F5]/5 text-[#5B35F5] font-extrabold"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-950"
            }`}
          >
            <div className="flex items-center gap-1.5 justify-end">
              <span className="bg-rose-500 text-white rounded-full text-[9px] w-4 h-4.5 flex items-center justify-center font-bold">
                3
              </span>
              <span>الإشعارات الداخلية</span>
            </div>
            <Bell className="w-4 h-4 text-slate-400" />
          </button>
        </nav>

        {/* Current Active client view inside sidebar */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-right">
          <p className="text-[10px] text-slate-400 font-extrabold uppercase">العميل الذي تطلّع عليه</p>
          <p className="text-xs font-black text-slate-800 mt-1">{activeClient.logo} {activeClient.name}</p>
        </div>
      </aside>

      {/* Workspace Panel */}
      <main className="flex-1 overflow-x-auto bg-slate-50 p-6 space-y-6">

        {/* ==================================== MY TASKS TAB ==================================== */}
        {activeTab === "tasks" && (
          <div className="space-y-6 text-right font-sans">
            <h2 className="text-lg font-bold text-slate-900 border-r-3 border-indigo-500 pr-2 pb-1">مخرجاتي النشطة - المسندة لي مباشرة</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {deliverables
                .filter(d => d.ownerId === myMemberId && d.status !== DeliverableStatus.DELIVERED)
                .map(del => {
                  const client = del.orgId === "org_1" ? "شركة النخبة" : "هداية";
                  return (
                    <div
                      key={del.id}
                      onClick={() => onOpenDeliverable(del)}
                      className="bg-white rounded-2xl p-4.5 border border-slate-200/80 hover:border-indigo-400 hover:shadow shadow-xs transition-all cursor-pointer space-y-4"
                    >
                      <div className="flex items-start justify-between">
                        <SlaBadge status={del.slaStatus} daysRemaining={del.slaDaysRemaining} />
                        <div>
                          <span className="text-[9px] font-bold text-slate-450 block">{client}</span>
                          <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-extrabold block mt-0.5">{del.type}</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <h4 className="font-bold text-sm text-slate-900">{del.title}</h4>
                        <p className="text-[11px] text-slate-400">تاريخ تسليم الداخلي المتوقع: {del.internalReviewDueDate}</p>
                      </div>

                      <div className="flex items-center justify-between pt-3.5 border-t border-slate-50">
                        <div className="flex gap-1.5">
                          {del.status === DeliverableStatus.NOT_STARTED && (
                            <button
                              onClick={(e) => handleStartWorkItem(del.id, e)}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] px-3.5 py-1.5 rounded transition-colors"
                            >
                              بدء العمل وطبخ الفكرة ⚙
                            </button>
                          )}
                          <span className="text-[11px] text-indigo-600 font-bold self-center">عرض المخرج للمراجعة الجودة 👁</span>
                        </div>
                        <span className="text-[11px] font-extrabold bg-indigo-50 text-indigo-700 px-2 py-1 rounded border border-indigo-100">
                          {del.status}
                        </span>
                      </div>
                    </div>
                  );
                })}

              {deliverables.filter(d => d.ownerId === myMemberId && d.status !== DeliverableStatus.DELIVERED).length === 0 && (
                <div className="col-span-full py-12 text-slate-400 text-center border-2 border-dashed bg-white rounded-2xl">
                  <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500" />
                  <p className="font-extrabold text-sm text-slate-800 mt-2">عظيـم! ليس لديك أي مخرج نشط بالانتظار</p>
                  <p className="text-xs text-slate-400">جميع مخرجاتك تم ترحيلها وتعميدها ورفعها للعملاء.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================================== KANBAN BOARD TAB ==================================== */}
        {activeTab === "board" && (
          <div className="space-y-4 text-right flex flex-col h-full min-w-[1240px]">
            
            {/* Header info */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-450 font-bold flex items-center gap-1">
                <span>اسحب الكارد لليمين أو اليسار لتغيير مرحلة العمل وإنجاز المهام</span>
                <AlertTriangle className="w-4 h-4 text-amber-500" />
              </span>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">لوحة العمل التفاعلية (Kanban) لـ {activeClient.name}</h2>
            </div>

            {/* Live Board Grid Columns */}
            <div className="grid grid-cols-8 gap-3.5 items-stretch overflow-x-auto pb-4 pt-1.5">
              {kanbanColumns.map(col => {
                // filter deliverables of selected active client matching this column status
                const colDeliverables = deliverables
                  .filter(d => d.orgId === activeClient.id && d.status === col.status);

                return (
                  <div
                    key={col.status}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(col.status)}
                    className={`p-3 rounded-2xl border ${col.bg} flex flex-col min-h-[500px] w-52 shrink-0 space-y-3.5 transition-all relative ${
                      draggingCardId ? "hover:ring-2 hover:ring-indigo-400/50" : ""
                    }`}
                  >
                    {/* Header stats column */}
                    <div className="flex items-start justify-between pb-2 border-b border-slate-200/50 text-right">
                      <span className="bg-slate-200/80 text-slate-700 text-[10px] w-5 h-5 rounded-full font-bold flex items-center justify-center">
                        {colDeliverables.length}
                      </span>
                      <h4 className="font-extrabold text-xs text-slate-800 tracking-tight leading-snug">{col.title}</h4>
                    </div>

                    {/* Column deliverables list */}
                    <div className="space-y-3.5 flex-1 overflow-y-auto max-h-[460px] pr-0.5">
                      {colDeliverables.map(del => (
                        <div
                          key={del.id}
                          draggable={true}
                          onDragStart={() => handleDragStart(del.id)}
                          onClick={() => onOpenDeliverable(del)}
                          className="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-indigo-400 shadow-xs hover:shadow transition-all cursor-grab active:cursor-grabbing text-right space-y-3 relative group"
                        >
                          {/* Image thumbnail inside kanban if uploaded */}
                          {del.previewUrl && (
                            <div className="w-full h-20 rounded-lg overflow-hidden relative">
                              <img src={del.previewUrl} alt={del.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              <div className="absolute inset-0 bg-black/5" />
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <span className="bg-slate-100 text-slate-500 p-0.5 px-1.5 rounded text-[9px] font-extrabold uppercase leading-none">
                              {del.type}
                            </span>
                            <PriorityBadge priority={del.priority} />
                          </div>

                          <h5 className="font-bold text-[11px] text-slate-800 leading-snug tracking-tight group-hover:text-indigo-600 transition-colors">
                            {del.title}
                          </h5>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-50 text-[10px] text-slate-400 font-semibold">
                            {/* Collaborator */}
                            <span className="flex items-center gap-1 text-slate-500">
                              <span className="w-4 h-4 bg-slate-100 text-slate-700 text-[8px] font-bold rounded-full flex items-center justify-center">
                                {teamMembers.find(t=>t.id===del.ownerId)?.avatar || "؟"}
                              </span>
                              <span>{teamMembers.find(t=>t.id===del.ownerId)?.name.split(" ")[0]}</span>
                            </span>

                            {/* Meta values */}
                            <span className="flex items-center gap-1.5 font-bold">
                              <span>{del.comments.length} تعليق</span>
                              <MessageSquare className="w-3 h-3 text-slate-350" />
                            </span>
                          </div>

                          {/* Quick SLA meter indicator inside kanban bar */}
                          <div className="flex justify-between items-center text-[9px] text-slate-400 pt-1 font-bold">
                            <span className={`${del.slaStatus === SlaStatus.LATE ? "text-rose-500" : "text-emerald-600"}`}>
                              {del.slaStatus}
                            </span>
                            <span>موعد: {del.dueDate.split("-")[2]}/{del.dueDate.split("-")[1]}</span>
                          </div>
                        </div>
                      ))}

                      {colDeliverables.length === 0 && (
                        <div className="h-28 border border-dashed border-slate-200/80 rounded-xl flex items-center justify-center text-center text-[10px] text-slate-400 p-4 leading-relaxed bg-white/20">
                          لا توجد مخرجات في هذه المرحلة
                        </div>
                      )}
                    </div>

                    {/* Drag indicator area */}
                    <div className="absolute inset-0 bg-indigo-500/5 opacity-0 hover:opacity-100 border-2 border-dashed border-indigo-400/40 rounded-2xl pointer-events-none transition-opacity flex items-center justify-center">
                      <span className="text-[11px] text-indigo-500 font-black tracking-wide bg-white border border-indigo-100 px-3 py-1 rounded-lg">إفلات الكارت هنا ⚡</span>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* ==================================== DELIVERABLES LIST TAB ==================================== */}
        {activeTab === "list" && (
          <div className="space-y-4 text-right font-sans">
            
            {/* Filter widgets row */}
            <div className="bg-white p-4.5 rounded-2xl border border-slate-150 shadow-xs grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
              
              {/* Query search */}
              <div className="space-y-1">
                <label className="text-slate-400 block font-semibold">بحث بالكلمة</label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="ابحث بالنص أو العنوان..."
                  className="w-full p-2 bg-slate-50 rounded-lg border text-right focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Client selector */}
              <div className="space-y-1">
                <label className="text-slate-400 block font-semibold">تصفية حسب العميل</label>
                <select
                  value={clientFilter}
                  onChange={e => setClientFilter(e.target.value)}
                  className="w-full p-2 bg-slate-50 rounded-lg border text-right font-bold"
                >
                  <option value="all">كل العملاء</option>
                  <option value="org_1">شركة النخبة</option>
                  <option value="org_2">هداية</option>
                </select>
              </div>

              {/* Type selector */}
              <div className="space-y-1">
                <label className="text-slate-400 block font-semibold">نوع المخرج</label>
                <select
                  value={typeFilter}
                  onChange={e => setTypeFilter(e.target.value)}
                  className="w-full p-2 bg-slate-50 rounded-lg border text-right font-bold"
                >
                  <option value="all">كل الأنواع</option>
                  <option value="منشور">منشور</option>
                  <option value="Reel">Reel</option>
                  <option value="Story">Story</option>
                  <option value="تقرير">تقرير</option>
                  <option value="خطة محتوى">خطة محتوى</option>
                  <option value="حملة إعلانية">حملة إعلانية</option>
                  <option value="فيديو">فيديو</option>
                </select>
              </div>

              {/* Status selector */}
              <div className="space-y-1">
                <label className="text-slate-400 block font-semibold">حالة العمل</label>
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="w-full p-2 bg-slate-50 rounded-lg border text-right font-bold"
                >
                  <option value="all">كل الحالات</option>
                  {Object.values(DeliverableStatus).map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* SLA filter */}
              <div className="space-y-1">
                <label className="text-slate-400 block font-semibold">حالة اتفاقية SLA</label>
                <select
                  value={slaFilter}
                  onChange={e => setSlaFilter(e.target.value)}
                  className="w-full p-2 bg-slate-50 rounded-lg border text-right font-bold"
                >
                  <option value="all">كل الـ SLA</option>
                  <option value="في الوقت">في الوقت</option>
                  <option value="خطر">خطر</option>
                  <option value="متأخر">متأخر</option>
                  <option value="متوقف بانتظار العميل">بانتظار العميل</option>
                </select>
              </div>

            </div>

            {/* Results Table list */}
            <div className="bg-white rounded-2xl border border-slate-150 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px] text-right text-xs">
                  <thead className="bg-slate-50 border-b border-slate-150 text-slate-500 font-extrabold uppercase">
                    <tr>
                      <th className="p-4 rounded-r-lg">المخرج الإعلاني</th>
                      <th className="p-4">العميل</th>
                      <th className="p-4">نوع المخرجة</th>
                      <th className="p-4">المرحلة الحالية</th>
                      <th className="p-4">اتفاقية SLA</th>
                      <th className="p-4">نسبة التقدم</th>
                      <th className="p-4">موعد التسليم</th>
                      <th className="p-4 rounded-l-lg text-center">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredDeliverables.map(del => {
                      const client = del.orgId === "org_1" ? "شركة النخبة" : "هداية";
                      return (
                        <tr key={del.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-4 font-bold text-slate-900">{del.title}</td>
                          <td className="p-4 text-slate-600">{client}</td>
                          <td className="p-4"><span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-[10px] font-extrabold">{del.type}</span></td>
                          <td className="p-4"><StatusBadge status={del.status} /></td>
                          <td className="p-4"><SlaBadge status={del.slaStatus} daysRemaining={del.slaDaysRemaining} /></td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[10px] shrink-0 text-indigo-600">{del.progress}%</span>
                              <div className="w-16 bg-slate-100 h-1 rounded-full overflow-hidden">
                                <div className="bg-primary-500 h-full rounded" style={{ width: `${del.progress}%` }} />
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-slate-500 font-mono font-semibold">{del.dueDate}</td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => onOpenDeliverable(del)}
                              className="text-primary-500 hover:underline font-bold"
                            >
                              عرض المفصل 👁
                            </button>
                          </td>
                        </tr>
                      );
                    })}

                    {filteredDeliverables.length === 0 && (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-slate-400 font-bold">لا توجد مخرجات تطابق خيارات التصفية المدخلة</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ==================================== TEAM FILES TAB ==================================== */}
        {activeTab === "files" && (
          <div className="space-y-6 text-right font-sans">
            
            {/* Header filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-xs text-slate-400 font-semibold">تطلع على ملفات العمل، الهوية البصرية والمستندات المسلمة من العميل مباشرة</span>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">مستودع الأصول الإعلانية للفريق</h2>
            </div>

            {/* Folder categories */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              
              <div className="p-4 bg-white border rounded-xl hover:border-indigo-400 cursor-pointer space-y-1.5 shadow-xs">
                <Folder className="w-7 h-7 text-indigo-500" />
                <h4 className="font-extrabold text-xs">أصول الهوية البصرية المعتمدة</h4>
                <p className="text-[10px] text-slate-400">الشعارات والخطوط المعتمدة من العملاء</p>
              </div>

              <div className="p-4 bg-white border rounded-xl hover:border-indigo-400 cursor-pointer space-y-1.5 shadow-xs">
                <Folder className="w-7 h-7 text-indigo-500" />
                <h4 className="font-extrabold text-xs">ملفات التصميم الخام (PSD, AI)</h4>
                <p className="text-[10px] text-slate-400">مسودات عمل المصممين للتوزيع</p>
              </div>

              <div className="p-4 bg-white border rounded-xl hover:border-indigo-400 cursor-pointer space-y-1.5 shadow-xs">
                <Folder className="w-7 h-7 text-indigo-500" />
                <h4 className="font-extrabold text-xs">المنتجات النهائية المعتمدة</h4>
                <p className="text-[10px] text-slate-400">جاهز للنشر على قنوات العميل</p>
              </div>

              <div className="p-4 bg-white border rounded-xl hover:border-indigo-400 cursor-pointer space-y-1.5 shadow-xs">
                <Folder className="w-7 h-7 text-indigo-500" />
                <h4 className="font-extrabold text-xs">مرفوعات العميل وصور المقر</h4>
                <p className="text-[10px] text-slate-400">ملفات أرسلها العميل مباشرة</p>
              </div>

            </div>

            {/* Grid item rendering */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {files.map(file => (
                <div
                  key={file.id}
                  onClick={() => onOpenFile(file)}
                  className="p-4 bg-white rounded-2xl border border-slate-150 hover:border-indigo-400 cursor-pointer hover:shadow-sm transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold bg-slate-100 text-slate-500 border px-1.5 rounded uppercase">
                      {file.status}
                    </span>
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black uppercase text-xs">
                      {file.type}
                    </div>
                  </div>

                  <div>
                    <h5 className="font-bold text-xs text-slate-800 truncate">{file.name}</h5>
                    <p className="text-[10px] text-slate-400 mt-1">الحجم: {file.size} | المجلد: {file.category}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-50 flex items-center justify-between text-[11px] text-indigo-600 font-bold">
                    <span>نقاش الملاحظات والنسخة 👁</span>
                    <span>تحميل 📥</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ==================================== NOTIFICATIONS TAB ==================================== */}
        {activeTab === "notifications" && (
          <div className="space-y-4 text-right font-sans">
            <h2 className="text-lg font-bold text-slate-900 border-r-3 border-indigo-500 pr-2 pb-1">موجز الإشعارات والتنبيهات الداخلية للفريق</h2>
            
            <div className="bg-white rounded-2xl border border-slate-150 divide-y divide-slate-100 overflow-hidden shadow-xs">
              
              <div className="p-4 bg-rose-50/45 flex items-start gap-3 text-sm">
                <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <span className="text-rose-600 font-extrabold text-[10px] bg-rose-100 border border-rose-200 px-1.5 rounded">عاجل جداً 🔥</span>
                    <span className="text-xs text-slate-400 font-semibold">• منذ نصف ساعة</span>
                  </div>
                  <p className="font-extrabold text-xs text-slate-800">تنبيه ذكي: المخرج "Reel: شهادات العملاء المصورة" متأخر عن موعد تسليم الـ SLA!</p>
                  <p className="text-xs text-slate-500">تم تسجيل التأخير في سجل النظام. يرجى المسارعة بالتصوير لإغلاق الخدمة.</p>
                </div>
              </div>

              <div className="p-4 flex items-start gap-3 text-sm">
                <Clock className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                <div className="space-y-1 bg-white">
                  <div className="flex items-center gap-1.5 font-bold">
                    <span className="text-indigo-600 font-extrabold text-[10px] bg-indigo-100 border border-indigo-200 px-1.5 rounded">توجيه عميل ✏</span>
                    <span className="text-xs text-slate-400 font-semibold">• منذ 3 ساعات</span>
                  </div>
                  <p className="font-bold text-xs text-slate-850">طلب العميل (أحمد الميمان) تعديل طفيف على الـ Reel "روتين الصباح"</p>
                  <p className="text-xs text-slate-550">مذكور بالملحوظة: "إضافة شعار الشركة في أسفل الفيديو من جهة اليسار بحجم ميني".</p>
                </div>
              </div>

              <div className="p-4 flex items-start gap-3 text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div className="space-y-1 bg-white">
                  <div className="flex items-center gap-1.5 font-bold">
                    <span className="text-emerald-600 font-extrabold text-[10px] bg-emerald-100 border border-emerald-200 px-1.5 rounded">اعتماد العميل ✔</span>
                    <span className="text-xs text-slate-400 font-semibold">• منذ أمس</span>
                  </div>
                  <p className="font-bold text-xs text-slate-850">تم اعتماد المخرج "خطة المحتوى الرقمي - يوليو 2026" بالكامل من شركة النخبة</p>
                  <p className="text-xs text-slate-550">تلقى المخرج موافقة الرئيس التنفيذي سارة الجاسم، وحالة الخدمة مغلقة بنجاح.</p>
                </div>
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
};
