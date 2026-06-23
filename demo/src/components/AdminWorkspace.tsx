/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Organization, Deliverable, DeliverableStatus, SlaStatus, FileAsset, TeamMember } from "../types";
import { SlaBadge, StatusBadge, PriorityBadge } from "./Badges";
import { getStatusProgress } from "../data";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend 
} from "recharts";
import { 
  Briefcase, Calendar, CheckCircle2, Clock, FileText, Folder, HelpCircle, 
  Layers, Lock, Paperclip, Plus, Search, Settings, Shield, User, Users,
  Wallet, AlertTriangle, CheckSquare, MessageSquare, Bell, Kanban, 
  ListFilter, Eye, MoreHorizontal, ArrowLeft, ArrowRight, Activity, TrendingUp, BarChart2
} from "lucide-react";

interface AdminWorkspaceProps {
  clientsList: Organization[];
  deliverables: Deliverable[];
  files: FileAsset[];
  teamMembers: TeamMember[];
  onOpenDeliverable: (d: Deliverable) => void;
  onOpenFile: (f: FileAsset) => void;
  onUpdateDeliverables: (list: Deliverable[]) => void;
}

export const AdminWorkspace: React.FC<AdminWorkspaceProps> = ({
  clientsList,
  deliverables,
  files,
  teamMembers,
  onOpenDeliverable,
  onOpenFile,
  onUpdateDeliverables
}) => {
  const [activeTab, setActiveTab] = useState<"dashboard" | "clients" | "deliverables" | "board" | "sla" | "team" | "contracts" | "files" | "settings">("dashboard");
  
  // State variables for search and filters in Master Deliverables Page
  const [searchQuery, setSearchQuery] = useState("");
  const [clientFilter, setClientFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Kanban drag state
  const [draggingCardId, setDraggingCardId] = useState<string | null>(null);

  // SLA calculations
  const totalDeliverables = deliverables.length;
  const onTimeCount = deliverables.filter(d => d.slaStatus === SlaStatus.ON_TIME).length;
  const riskCount = deliverables.filter(d => d.slaStatus === SlaStatus.RISK).length;
  const lateCount = deliverables.filter(d => d.slaStatus === SlaStatus.LATE).length;
  const waitingClientCount = deliverables.filter(d => d.slaStatus === SlaStatus.WAITING_CLIENT).length;

  const totalReviewsPending = deliverables.filter(d => d.status === DeliverableStatus.READY_INTERNAL_REVIEW).length;
  const totalClientsApprovalsPending = deliverables.filter(d => d.status === DeliverableStatus.PENDING_CLIENT_APPROVAL).length;

  // Recharts SLA Data
  const slaChartData = [
    { name: "في الوقت", value: onTimeCount, color: "#10b981" },
    { name: "خطر", value: riskCount, color: "#f59e0b" },
    { name: "متأخر", value: lateCount, color: "#ef4444" },
    { name: "بانتظار العميل", value: waitingClientCount, color: "#3b82f6" }
  ];

  // Recharts Status Data
  const statusChartData = [
    { name: "لم يبدأ", value: deliverables.filter(d => d.status === DeliverableStatus.NOT_STARTED).length },
    { name: "قيد التنفيذ", value: deliverables.filter(d => d.status === DeliverableStatus.IN_PROGRESS).length },
    { name: "مراجعة داخلية", value: deliverables.filter(d => d.status === DeliverableStatus.READY_INTERNAL_REVIEW).length },
    { name: "معتمد داخليًا", value: deliverables.filter(d => d.status === DeliverableStatus.APPROVED_INTERNALLY).length },
    { name: "قيد المراجعة للعميل", value: deliverables.filter(d => d.status === DeliverableStatus.PENDING_CLIENT_APPROVAL).length },
    { name: "تم التسليم", value: deliverables.filter(d => d.status === DeliverableStatus.DELIVERED || d.status === DeliverableStatus.APPROVED_BY_CLIENT).length }
  ];

  // Kanban Columns
  const kanbanColumns = [
    { title: "لم يبدأ", status: DeliverableStatus.NOT_STARTED, bg: "bg-slate-100/90" },
    { title: "قيد التنفيذ", status: DeliverableStatus.IN_PROGRESS, bg: "bg-indigo-50/50" },
    { title: "جاهز للمراجعة", status: DeliverableStatus.READY_INTERNAL_REVIEW, bg: "bg-amber-50/50" },
    { title: "معتمد داخليًا", status: DeliverableStatus.APPROVED_INTERNALLY, bg: "bg-purple-50/50" },
    { title: "بانتظار العميل", status: DeliverableStatus.PENDING_CLIENT_APPROVAL, bg: "bg-sky-50/50" },
    { title: "طلب تعديل لعميل", status: DeliverableStatus.NEEDS_CLIENT_REVISION, bg: "bg-rose-50/50" },
    { title: "تم التسليم", status: DeliverableStatus.DELIVERED, bg: "bg-emerald-50/50" }
  ];

  // Drag and Drop
  const handleDragStart = (cardId: string) => setDraggingCardId(cardId);
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (colStatus: DeliverableStatus) => {
    if (!draggingCardId) return;
    const list = deliverables.map(d => {
      if (d.id === draggingCardId) {
        return {
          ...d,
          status: colStatus,
          progress: getStatusProgress(colStatus),
          auditLogs: [
            {
              id: `audit_${Date.now()}`,
              action: `تعديل المسار وسحب المخرج إدارياً إلى: [${colStatus}]`,
              performedBy: "مدير المشروع (الإدارة)",
              userRole: "الإدارة",
              timestamp: new Date().toISOString(),
              isInternalOnly: false
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

  // Master override actions
  const handleSendToClientDirectly = (delId: string) => {
    const list = deliverables.map(d => {
      if (d.id === delId) {
        return {
          ...d,
          status: DeliverableStatus.PENDING_CLIENT_APPROVAL,
          progress: 80,
          slaStatus: SlaStatus.WAITING_CLIENT,
          auditLogs: [
            {
              id: `audit_${Date.now()}`,
              action: "تعميد وإرسال مباشر لبوابة العميل من لوحة التحكم الإدارية الكبرى",
              performedBy: "مدير المشروع (الإدارة)",
              userRole: "الإدارة",
              timestamp: new Date().toISOString(),
              isInternalOnly: false
            },
            ...d.auditLogs
          ]
        };
      }
      return d;
    });
    onUpdateDeliverables(list);
    alert("تم بنجاح تجاوز التدقيق الداخلي وتعميد وإرسال المخرج لبوابة العميل!");
  };

  const handleExportSlaReport = () => {
    let reportText = `==================================================\n`;
    reportText += `       سماوة للإنتاج والتسويق - تقرير الأداء الشامل والالتزام بالـ SLA\n`;
    reportText += `       بوابة الإشراف والمراقبة الكبرى\n`;
    reportText += `       تاريخ التحرير: ${new Date().toLocaleDateString('ar-EG')} - ${new Date().toLocaleTimeString('ar-EG')}\n`;
    reportText += `==================================================\n\n`;

    reportText += `📊 الخلاصة التنفيذية للإنتاجية والالتزام بالزمن:\n`;
    reportText += `--------------------------------------------------\n`;
    reportText += `• إجمالي البنود والمخرجات الكلية: ${totalDeliverables} منشور ومسودة\n`;
    reportText += `• مخرجات تلتزم بالوقت (On Time): ${onTimeCount}\n`;
    reportText += `• مخرجات في خط الخطر (Risk Zone): ${riskCount}\n`;
    reportText += `• مخرجات متجاوزة ومستحقة التسليم (Late): ${lateCount}\n`;
    reportText += `• مخرجات مجمدة/بانتظار قرار العميل: ${waitingClientCount}\n\n`;

    reportText += `🏢 تفاصيل المؤشرات حسب العميل والشركة:\n`;
    reportText += `--------------------------------------------------\n`;

    clientsList.forEach((client, idx) => {
      const clientDeliverables = deliverables.filter(d => d.orgId === client.id);
      const cOnTime = clientDeliverables.filter(d => d.slaStatus === SlaStatus.ON_TIME).length;
      const cRisk = clientDeliverables.filter(d => d.slaStatus === SlaStatus.RISK).length;
      const cLate = clientDeliverables.filter(d => d.slaStatus === SlaStatus.LATE).length;
      const cWait = clientDeliverables.filter(d => d.slaStatus === SlaStatus.WAITING_CLIENT).length;

      reportText += `${idx + 1}. العميل: ${client.name} | القطاع: ${client.sector}\n`;
      reportText += `   - باقة الخدمة: ${client.contractTitle}\n`;
      reportText += `   - إجمالي البنود النشطة: ${clientDeliverables.length} منشور وريلز\n`;
      reportText += `   - الإنجاز والـ SLA:\n`;
      reportText += `     * في الوقت المحدد: ${cOnTime}\n`;
      reportText += `     * جرس تذكير الخطر: ${cRisk}\n`;
      reportText += `     * المتأخر التراكمي: ${cLate}\n`;
      reportText += `     * بانتظار العميل: ${cWait}\n\n`;
      
      reportText += `   📋 قائمة المخرجات وحالة كل منها:\n`;
      clientDeliverables.forEach(d => {
        const ownerName = teamMembers.find(t=>t.id===d.ownerId)?.name || "غير معين";
        reportText += `     - [${d.type}] ${d.title}\n`;
        reportText += `       * الأولوية: ${d.priority} | التقدم الحقيقي: ${d.progress}%\n`;
        reportText += `       * الحالة التنفيذية: ${d.status}\n`;
        reportText += `       * الـ SLA الحالي: ${d.slaStatus} (${d.slaDaysRemaining} أيام متبقية)\n`;
        reportText += `       * المسؤول المباشر: ${ownerName}\n`;
      });
      reportText += `\n--------------------------------------------------\n\n`;
    });

    reportText += `==================================================\n`;
    reportText += `تم تصدير هذا التقرير من خادم الأتمتة الموحد ببوابة سماوة الرقمية.\n`;

    const blob = new Blob([reportText], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `تقرير_SLA_سماوة_الشامل_${new Date().toISOString().split('T')[0]}.txt`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-62px)] font-sans">
      
      {/* Admin Sidebar Navigation */}
      <aside className="w-full lg:w-64 bg-white border-l border-slate-200 text-slate-800 flex flex-col shrink-0">
        <div className="p-5 border-b border-slate-150 flex items-center justify-between">
          <span className="text-[10px] bg-[#5B35F5]/10 text-[#5B35F5] font-extrabold px-2.5 py-1 rounded inline-block border border-[#5B35F5]/10">MASTER PM</span>
          <div className="text-right">
            <h3 className="font-extrabold text-sm text-slate-800">بوابة الإشراف العام</h3>
            <span className="text-[10px] text-slate-400 block font-semibold mt-0.5">سماوة للإنتاج والتسويق</span>
          </div>
        </div>

        <nav className="p-3.5 space-y-1 flex-1 text-right text-xs">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === "dashboard" ? "bg-[#5B35F5]/5 text-[#5B35F5]" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <span>لوحة المؤشرات التنفيذية</span>
            <Activity className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveTab("clients")}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === "clients" ? "bg-[#5B35F5]/5 text-[#5B35F5]" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <span>العملاء وصحة الأرصدة ({clientsList.length})</span>
            <Users className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveTab("deliverables")}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === "deliverables" ? "bg-[#5B35F5]/5 text-[#5B35F5]" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <span>المخرجات الإعلانية الكبرى ({deliverables.length})</span>
            <ListFilter className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveTab("board")}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === "board" ? "bg-[#5B35F5]/5 text-[#5B35F5]" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <span>لوحة عمل Trello الإدارية</span>
            <Kanban className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveTab("sla")}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === "sla" ? "bg-[#5B35F5]/5 text-[#5B35F5]" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <div className="flex items-center gap-1.5 justify-end">
              {lateCount > 0 && (
                <span className="bg-rose-500 text-white rounded-full text-[9px] w-4.5 h-4.5 flex items-center justify-center font-bold">
                  {lateCount}
                </span>
              )}
              <span>اتفاقيات SLA والجودة</span>
            </div>
            <Clock className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveTab("team")}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === "team" ? "bg-[#5B35F5]/5 text-[#5B35F5]" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <span>أداء وضغط عمل الفريق ({teamMembers.length})</span>
            <User className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveTab("contracts")}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === "contracts" ? "bg-[#5B35F5]/5 text-[#5B35F5]" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <span>بيانات المحاضر والمالية</span>
            <Wallet className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveTab("files")}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === "files" ? "bg-[#5B35F5]/5 text-[#5B35F5]" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <span>الخزانة والمستندات الكبرى</span>
            <Folder className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === "settings" ? "bg-[#5B35F5]/5 text-[#5B35F5]" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <span>خيارات الأبيض والأتمتة</span>
            <Settings className="w-4 h-4" />
          </button>
        </nav>
      </aside>

      {/* Main Admin Screen content */}
      <main className="flex-1 bg-slate-50 p-6 space-y-6 overflow-x-auto">

        {/* ==================================== DASHBOARD TAB ==================================== */}
        {activeTab === "dashboard" && (
          <div className="space-y-6 text-right">

            {/* Quick KPIs Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-white p-4.5 rounded-2xl border border-slate-150 shadow-xs space-y-2">
                <span className="text-[11px] font-bold text-slate-400 block">إجمالي العملاء النشطين</span>
                <span className="text-3xl font-black block text-slate-900">{clientsList.length} شركات</span>
              </div>
              <div className="bg-white p-4.5 rounded-2xl border border-slate-150 shadow-xs space-y-2 bg-indigo-50/10 border-indigo-100">
                <span className="text-[11px] font-bold text-indigo-600 block">منشورات وخدمات بالخطة</span>
                <span className="text-3xl font-black block text-indigo-600">{deliverables.length} مخرج</span>
              </div>
              <div className="bg-white p-4.5 rounded-2xl border border-slate-150 shadow-xs space-y-2">
                <span className="text-[11px] font-bold text-amber-600 block">تنتظر المراجعة والتعميد الداخلي</span>
                <span className="text-3xl font-black block text-amber-600">{totalReviewsPending} بنود</span>
              </div>
              <div className="bg-white p-4.5 rounded-2xl border border-slate-150 shadow-xs space-y-2">
                <span className="text-[11px] font-bold text-sky-600 block">تنتظر اعتماد ومصادقة العميل</span>
                <span className="text-3xl font-black block text-sky-600">{totalClientsApprovalsPending} بنود</span>
              </div>
              <div className="bg-white p-4.5 rounded-2xl border border-slate-150 shadow-xs space-y-2 bg-rose-50 border-rose-100">
                <span className="text-[11px] font-bold text-rose-600 block">مخرجات مدة الخدمة المتأخرة</span>
                <span className="text-3xl font-black block text-rose-600">{lateCount} مخرج</span>
              </div>
            </div>

            {/* Real Stats charts from Recharts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* SLA Performance Pie chart */}
              <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-xs space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-400">توزيع مخرجات الوكالة حسب معايير التواقيت</span>
                  <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5 leading-none">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    مؤشر التزام اتفاقية مستويات الخدمة (SLA % Health)
                  </h3>
                </div>

                <div className="h-64 flex flex-col md:flex-row gap-4 items-center">
                  <div className="w-full md:w-1/2 h-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={slaChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {slaChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {/* Custom Arabic Legend display */}
                  <div className="w-full md:w-1/2 space-y-3">
                    {slaChartData.map((entry, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-500">{entry.value} خدمات ({Math.round((entry.value/totalDeliverables)*100)}%)</span>
                        <div className="flex items-center gap-2">
                          <span>{entry.name}</span>
                          <span className="w-3 h-3 rounded" style={{ backgroundColor: entry.color }} />
                        </div>
                      </div>
                    ))}
                    <div className="pt-2 border-t text-[10px] text-slate-400 font-semibold leading-relaxed">
                      يتم تحديث المؤشرات تلقائياً بناء على مدة استجابة فريق العمل وتأخر العميل بالرد المباشر.
                    </div>
                  </div>
                </div>
              </div>

              {/* Status lifecycle bar charts */}
              <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-xs space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-400">عدد المخرجات الإملائية المائة بكل التفرعات</span>
                  <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5 leading-none">
                    <BarChart2 className="w-4 h-4 text-indigo-500" />
                    تتبع حجم مخرجات المشاريع حسب الحالة
                  </h3>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={statusChartData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                      <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                      <YAxis tick={{ fontSize: 9 }} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#5b35f5" radius={[4, 4, 0, 0]}>
                        {statusChartData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={index === 5 ? "#10b981" : index === 2 ? "#f59e0b" : "#5b35f5"} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

            {/* Client healthcare profiles overview */}
            <div className="space-y-3">
              <h3 className="font-extrabold text-base text-slate-900">سجل العملاء التراكمي وتصنيف الصحة الفنية</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Elite company widget */}
                <div className="bg-white rounded-2xl p-5 border border-slate-150 space-y-4 shadow-xs">
                  <div className="flex items-start justify-between">
                    <span className="bg-emerald-50 text-emerald-700 font-extrabold text-[10px] px-2.5 py-1 rounded inline-block border border-emerald-100">
                      مستوى رضا كلي: ممتاز (96%) ✅
                    </span>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm text-slate-800">شركة النخبة</h4>
                      <span className="text-xl">🏢</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 block -mt-1 font-semibold leading-relaxed">العقد: {clientsList[0].contractTitle}</p>
                  
                  <div className="grid grid-cols-2 gap-2 text-center text-xs">
                    <div className="p-2 bg-slate-50 rounded-lg">
                      <span className="text-[10px] text-slate-400 block font-semibold">بانتظار اعتماد العميل</span>
                      <span className="font-bold text-slate-700 text-sm">4 مخرجات</span>
                    </div>
                    <div className="p-2 bg-rose-50/45 rounded-lg border border-rose-100">
                      <span className="text-[10px] text-rose-600 block font-bold">مخرجات متأخرة عن SLA</span>
                      <span className="font-bold text-rose-600 text-sm">1 مخرج</span>
                    </div>
                  </div>
                </div>

                {/* Hedaya company widget */}
                <div className="bg-white rounded-2xl p-5 border border-slate-150 space-y-4 shadow-xs">
                  <div className="flex items-start justify-between">
                    <span className="bg-amber-50 text-amber-700 font-extrabold text-[10px] px-2.5 py-1 rounded inline-block border border-amber-100">
                      مستوى رضا كلي: يحتاج متابعة لتأخر العميل بالرد ⚠
                    </span>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm text-slate-800">هداية</h4>
                      <span className="text-xl">🎁</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 block -mt-1 font-semibold leading-relaxed">العقد: {clientsList[1].contractTitle}</p>

                  <div className="grid grid-cols-2 gap-2 text-center text-xs">
                    <div className="p-2 bg-slate-50 rounded-lg">
                      <span className="text-[10px] text-slate-400 block font-semibold">بانتظار اعتماد العميل</span>
                      <span className="font-bold text-slate-700 text-sm">3 مخرجات</span>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-lg">
                      <span className="text-[10px] text-slate-400 block font-semibold">مخرجات متأخرة عن SLA</span>
                      <span className="font-bold text-slate-700 text-sm">0 لا يوجد</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* ==================================== CLIENTS GRID TAB ==================================== */}
        {activeTab === "clients" && (
          <div className="space-y-4 text-right">
            <h2 className="text-lg font-bold text-slate-900 border-r-3 border-indigo-500 pr-2">سجلات وإحصائيات ملاك العقود الفردية لكل عميل</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {clientsList.map(client => (
                <div key={client.id} className="bg-white rounded-2xl p-5 border border-slate-150 space-y-4 shadow-xs">
                  <div className="flex items-center gap-3 justify-end">
                    <div>
                      <h4 className="font-extrabold text-[15px] text-slate-800 leading-tight">{client.name}</h4>
                      <span className="text-[10px] text-indigo-550 font-bold block mt-1">{client.sector}</span>
                    </div>
                    <span className="text-2xl p-2 bg-slate-100 rounded-xl leading-none block">{client.logo}</span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-700 space-y-2 leading-relaxed">
                    <p className="font-extrabold text-slate-500">تفاصيل العقد الحالي:</p>
                    <p className="font-bold">{client.contractTitle}</p>
                    <div className="flex gap-4 pt-1 border-t text-[10px] text-slate-400">
                      <span>المدة: {client.startDate} إلى {client.endDate}</span>
                      <span>سداد: {client.billingSummary.paid.toLocaleString("ar-SA")} من {client.billingSummary.total.toLocaleString("ar-SA")} ر.س</span>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end pt-1">
                    <button
                      onClick={() => alert(`محاكاة لفتح إعدادات الفوترة الخاصة بـ ${client.name}`)}
                      className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-750 font-bold px-3 py-1.5 rounded-lg border transition-colors"
                    >
                      إدارة ملف الفواتير 📥
                    </button>
                    <button
                      onClick={() => alert(`تصفية لوحة Trello لإبراز مخرجات ${client.name} فقط`)}
                      className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3.5 py-1.5 rounded-lg transition-transform hover:scale-102"
                    >
                      مراجعة المخرجات ({deliverables.filter(d => d.orgId === client.id).length})
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================== GLOBAL LEDGER DELIVERABLES TAB ==================================== */}
        {activeTab === "deliverables" && (
          <div className="space-y-4 text-right">
            
            {/* Unified search controls */}
            <div className="bg-white p-4 rounded-xl border border-slate-150 shadow-xs flex flex-wrap gap-3 items-center justify-between text-xs">
              <div className="flex gap-2 shrink-0">
                <select value={clientFilter} onChange={e => setClientFilter(e.target.value)} className="p-2 border rounded-lg bg-slate-50 font-bold">
                  <option value="all">كل العمالء</option>
                  <option value="org_1">شركة النخبة</option>
                  <option value="org_2">هداية</option>
                </select>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="p-2 border rounded-lg bg-slate-50 font-bold">
                  <option value="all">كل الحالات</option>
                  {Object.values(DeliverableStatus).map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 w-full md:w-auto relative items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="ابحث بالاسم عن مخرج للتعميد..."
                  className="bg-white border text-right py-2 px-3 pr-8 rounded-lg text-xs w-full focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-2.5 pointer-events-none" />
              </div>
            </div>

            {/* Master Table Display */}
            <div className="bg-white rounded-2xl border border-slate-150 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-extrabold uppercase border-b border-slate-150">
                    <tr>
                      <th className="p-4 rounded-r-lg">المخرج المطلوب</th>
                      <th className="p-4">العميل</th>
                      <th className="p-4">نوع الخدمة</th>
                      <th className="p-4">الحالة التنفيذية</th>
                      <th className="p-4">SLA</th>
                      <th className="p-4">الموظف المسؤول</th>
                      <th className="p-4">نسبة التقدم</th>
                      <th className="p-4 text-center rounded-l-lg">إجراءات المدير والسوبر فايزر</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {deliverables
                      .filter(d => clientFilter === "all" || d.orgId === clientFilter)
                      .filter(d => statusFilter === "all" || d.status === statusFilter)
                      .filter(d => d.title.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map(del => {
                        const clientName = del.orgId === "org_1" ? "شركة النخبة" : "هداية";
                        const ownerName = teamMembers.find(t=>t.id===del.ownerId)?.name || "غير معين";
                        return (
                          <tr key={del.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="p-4 font-bold text-slate-900">{del.title}</td>
                            <td className="p-4 text-slate-600">{clientName}</td>
                            <td className="p-4"><span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-[10px] font-extrabold">{del.type}</span></td>
                            <td className="p-4"><StatusBadge status={del.status} /></td>
                            <td className="p-4"><SlaBadge status={del.slaStatus} daysRemaining={del.slaDaysRemaining} /></td>
                            <td className="p-4 text-slate-700 font-bold">{ownerName}</td>
                            <td className="p-4">
                              <span className="font-extrabold text-[10px] text-indigo-500">{del.progress}%</span>
                            </td>
                            <td className="p-4 text-center flex items-center justify-center gap-1.5 self-center mt-1 border-0">
                              <button
                                onClick={() => onOpenDeliverable(del)}
                                className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 h-7 w-7 rounded flex items-center justify-center border transition-colors"
                                title="عرض لوقائع الجودة"
                              >
                                👁
                              </button>
                              {del.status === DeliverableStatus.READY_INTERNAL_REVIEW && (
                                <button
                                  onClick={() => handleSendToClientDirectly(del.id)}
                                  className="bg-primary-500 hover:bg-primary-600 text-white font-extrabold text-[10px] px-2.5 py-1 rounded"
                                >
                                  إرسال فوراً للعميل 📥
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ==================================== TABS 4: KANBAN FOR ADMIN ==================================== */}
        {activeTab === "board" && (
          <div className="space-y-4 text-right flex flex-col h-full min-w-[1240px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-xs text-slate-400 font-bold">بوابة الإشراف: يمكنك سحب وتعديل كروت كل العملاء وتعديل الموقف على نطاق الإدارة العليا مباشرة</span>
              <h2 className="text-lg font-bold text-slate-900">لوحة المراقبة الشاملة Trello - كل المشاريع العقارية والخيرية</h2>
            </div>

            <div className="grid grid-cols-7 gap-3.5 items-stretch overflow-x-auto pb-4">
              {kanbanColumns.map(col => {
                const colDeliverables = deliverables.filter(d => d.status === col.status);

                return (
                  <div
                    key={col.status}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(col.status)}
                    className={`p-3 rounded-2xl border ${col.bg} flex flex-col min-h-[500px] w-52 shrink-0 space-y-3.5 transition-all relative ${
                      draggingCardId ? "hover:ring-2 hover:ring-indigo-500/25" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between pb-2 border-b border-slate-200/50 text-right">
                      <span className="bg-slate-200 text-slate-700 text-[10px] w-5 h-5 rounded-full font-bold flex items-center justify-center">
                        {colDeliverables.length}
                      </span>
                      <h4 className="font-extrabold text-xs text-slate-800 leading-none">{col.title}</h4>
                    </div>

                    <div className="space-y-3 flex-1 overflow-y-auto max-h-[460px] pr-0.5">
                      {colDeliverables.map(del => {
                        const clientLabel = del.orgId === "org_1" ? "شركة النخبة" : "هداية";
                        return (
                          <div
                            key={del.id}
                            draggable={true}
                            onDragStart={() => handleDragStart(del.id)}
                            onClick={() => onOpenDeliverable(del)}
                            className="bg-white p-3 rounded-xl border border-slate-200 hover:border-indigo-400 cursor-grab active:cursor-grabbing text-right space-y-2 relative"
                          >
                            <span className="text-[8px] font-extrabold bg-slate-100 text-slate-400 px-1 py-0.2 rounded block mb-1">
                              {clientLabel}
                            </span>
                            <h5 className="font-bold text-[11px] text-slate-800 leading-snug tracking-tight">{del.title}</h5>
                            <div className="flex items-center justify-between text-[9px] pt-1.5 border-t border-slate-50 text-slate-450">
                              <span>العارض: {teamMembers.find(t=>t.id===del.ownerId)?.avatar || "؟"}</span>
                              <PriorityBadge priority={del.priority} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* ==================================== TABS 5: SLA & QUALITY AUDITING ==================================== */}
        {activeTab === "sla" && (
          <div className="space-y-6 text-right font-sans">
            
            {/* SLA Header & Export Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-5 rounded-2xl border border-slate-150 shadow-xs">
              <div className="space-y-1">
                <h2 className="text-base font-black text-slate-800">إدارة مستويات الخدمة وجودة المخرجات (SLA Guard)</h2>
                <p className="text-[11px] text-slate-400">مراقبة الجداول الزمنية لتسليم المنشورات والمقاطع لكل عميل من العملاء المعتمدين وتأخيرات الرد المباشر.</p>
              </div>
              <button
                onClick={handleExportSlaReport}
                className="bg-[#5B35F5] hover:bg-[#4d28e6] text-white font-extrabold text-xs py-2.5 px-5 rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <FileText className="w-4 h-4 text-white" />
                <span>تحميل تقرير SLA لكل العملاء 📥</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-4.5 rounded-2xl border border-slate-150 text-right space-y-1">
                <span className="text-xs text-slate-400 block font-semibold">باق كلي على الزمن (SLA On Time)</span>
                <span className="text-2xl font-black block text-emerald-600">{onTimeCount} من المخرجات</span>
                <p className="text-[10px] text-slate-400">ملفات تلتزم بكود الزمن بدقة</p>
              </div>

              <div className="bg-white p-4.5 rounded-2xl border border-slate-150 text-right space-y-1 bg-amber-50/40 border-amber-200">
                <span className="text-xs text-amber-700 block font-semibold">في منطقة الخطر (SLA Risk)</span>
                <span className="text-2xl font-black block text-amber-600">{riskCount} مخرجات</span>
                <p className="text-[10px] text-slate-450">توقيت تسليمها غداً كحد أقصى</p>
              </div>

              <div className="bg-white p-4.5 rounded-2xl border border-slate-150 text-right space-y-1 bg-rose-50 border-rose-200">
                <span className="text-xs text-rose-700 block font-bold">متأخر متجاوز للزمن (SLA Late)</span>
                <span className="text-2xl font-black block text-rose-600">{lateCount} مخرج</span>
                <p className="text-[10px] text-rose-500 font-semibold">تسبب هذا في اهتزاز الرضا أو تأخر النشر</p>
              </div>

              <div className="bg-white p-4.5 rounded-2xl border border-slate-150 text-right space-y-1">
                <span className="text-xs text-slate-400 block font-semibold">متوقف بانتظار العميل</span>
                <span className="text-2xl font-black block text-blue-600">{waitingClientCount} مخرجات</span>
                <p className="text-[10px] text-slate-400">تم تجميد الـ SLA لتأخر موافقة العميل</p>
              </div>
            </div>

            {/* Delay Accountability Attribution widget */}
            <div className="bg-white p-5 rounded-2xl border border-slate-150 space-y-4 shadow-xs">
              <h3 className="font-extrabold text-sm text-slate-800 border-r-3 border-indigo-500 pr-2">توزيع وتنسيب المسؤولية عن التأخير (Delay Attribution)</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs text-slate-700">
                <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-center">
                  <span className="font-bold block text-rose-600">60%</span>
                  <p className="font-medium">بانتظار العميل (اعتماد أو ملاحظات)</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-center">
                  <span className="font-bold block text-indigo-600">25%</span>
                  <p className="font-medium">من فريق سماوة (تأخير مونتاج وتفاصيل)</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-center">
                  <span className="font-bold block text-slate-600">10%</span>
                  <p className="font-medium">بسبب ملفات ناقصة وصور غير مرسلة</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-center">
                  <span className="font-bold block text-amber-600">5%</span>
                  <p className="font-medium">من الإدارة (تأخر في التدقيق الفني المسبق)</p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ==================================== TABS 6: TEAM MEMBERS TAB ==================================== */}
        {activeTab === "team" && (
          <div className="space-y-4 text-right">
            <h2 className="text-lg font-bold text-slate-900 border-r-3 border-indigo-500 pr-2">أداء وضغط عمل فريق سماوة ومعدلات الالتزام بالجودة</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teamMembers.map(member => (
                <div key={member.id} className="bg-white rounded-2xl p-4.5 border border-slate-150 space-y-4 shadow-xs">
                  <div className="flex items-center gap-3 justify-end">
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-800">{member.name}</h4>
                      <p className="text-[10px] text-slate-400 font-semibold">{member.title}</p>
                    </div>
                    <span className="w-10 h-10 bg-indigo-50 text-indigo-700 rounded-xl flex items-center justify-center font-extrabold text-xs">
                      {member.avatar}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs border-t border-b py-3 font-semibold text-slate-600 border-slate-100">
                    <div>
                      <span className="text-[9px] text-slate-400 block mb-0.5">المهام الكلية</span>
                      <span className="font-bold text-slate-700">{member.tasksCount} مخرج</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block mb-0.5">تقييم الجودة</span>
                      <span className="font-bold text-indigo-600">{member.rating}%</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-rose-500 block mb-0.5">مهام متأخرة</span>
                      <span className="font-bold text-rose-600">{member.lateTasksCount} متجاوز</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold">
                    <span>معدل تسليم SLA الفردي: <strong className="text-slate-800">{member.averageSlaDays} أيام</strong></span>
                    <button
                      onClick={() => alert(`محاكاة لفتح ملف الأداء الفني لـ ${member.name}`)}
                      className="text-indigo-600 hover:underline"
                    >
                      تقييم الجودة والالتزام 👁
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================== TABS 7: CONTRACTS AND PACKAGES ==================================== */}
        {activeTab === "contracts" && (
          <div className="space-y-4 text-right">
            <h2 className="text-lg font-bold text-slate-900 border-r-3 border-indigo-500 pr-2 pb-1">إحصاء الباقات المتعاقد عليها وأرصدة المخرجات الكلي</h2>
            
            <div className="bg-white rounded-2xl border border-slate-150 overflow-hidden shadow-xs">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 font-extrabold text-slate-500 border-b border-slate-150">
                  <tr>
                    <th className="p-4 rounded-r-lg">الشركة المتعاقدة</th>
                    <th className="p-4">العقد / الباقة المعتمدة</th>
                    <th className="p-4">حيز المنشورات المستهلكة</th>
                    <th className="p-4">المقاطع المرئية المستهلكة</th>
                    <th className="p-4">الفواتير المدفوعة الكلية</th>
                    <th className="p-4 text-center rounded-l-lg">موعد التجديد القادم</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {clientsList.map(client => (
                    <tr key={client.id} className="hover:bg-slate-50/50">
                      <td className="p-4 font-bold text-slate-900">{client.name}</td>
                      <td className="p-4 text-slate-650 font-semibold">{client.contractTitle}</td>
                      <td className="p-4 block mt-2 text-slate-700">18 / 30 منشور (60%)</td>
                      <td className="p-4">4 / 8 Reels (50%)</td>
                      <td className="p-4 font-bold text-emerald-600">{client.billingSummary.paid.toLocaleString("ar-SA")} ر.س</td>
                      <td className="p-4 text-center">{client.billingSummary.nextInvoiceDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================================== TABS 8: GLOBAL FILES ==================================== */}
        {activeTab === "files" && (
          <div className="space-y-6 text-right font-sans">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-xs text-slate-400 font-bold">تطلع وتتحكم في كل الخصائص والمستندات السنوية وتقارير أداء ومرفوعات العمل لكل زبون</span>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">الخزنة السحابية الإدارية الشاملة</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {files.map(file => (
                <div
                  key={file.id}
                  onClick={() => onOpenFile(file)}
                  className="p-4 bg-white rounded-2xl border border-slate-150 hover:border-indigo-400 cursor-pointer shadow-xs hover:shadow transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-150 px-2.5 py-0.5 rounded leading-none">
                      {file.status}
                    </span>
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-extrabold uppercase text-xs">
                      {file.type}
                    </div>
                  </div>

                  <div>
                    <h5 className="font-bold text-xs text-slate-800 truncate">{file.name}</h5>
                    <p className="text-[10px] text-slate-405 mt-1">الحجم: {file.size} | بواسطة {file.uploaderName}</p>
                    <p className="text-[9px] font-bold text-slate-400 mt-1">المجلد: {file.category}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-55 flex items-center justify-between text-[11px] text-indigo-650 font-bold">
                    <span>نقاش الملاحظات والنسخة 👁</span>
                    <span>تحميل 📥</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ==================================== TABS 9: GLOBAL ADMIN SETTINGS ==================================== */}
        {activeTab === "settings" && (
          <div className="space-y-6 text-right font-sans">
            
            <div className="pb-3 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900 leading-tight">خيارات النظام الأبيض والأتمتة (White Label Setup)</h2>
              <p className="text-xs text-slate-400 mt-1">قم بتهيئة النظام وتعيين الربط وبوابات العملاء وشعارات شركتكم.</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-150 space-y-6">
              
              <div className="space-y-3">
                <h3 className="font-extrabold text-sm text-slate-800">بيانات وكالة سماوة للإنتاج والتسويق</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="text-slate-400 font-semibold block">العنوان المسجل للوكالة</label>
                    <input type="text" readOnly value="7823 طريق الملك فهد، حي الصحافة، بريدة، القصيم، المملكة العربية السعودية" className="w-full p-2.5 bg-slate-50 rounded-lg border text-right font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 font-semibold block">موقع النظاق الخاص بالبواباط (Custom Domain)</label>
                    <input type="text" readOnly value="bridge.samawah-marketing.agency" className="w-full p-2.5 bg-indigo-50/50 rounded-lg border text-left font-mono font-bold text-indigo-700" />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-extrabold text-sm text-slate-850">مكاملة التنبيهات مع واتساب وفريق Slack (قريباً)</h3>
                <p className="text-xs text-slate-400">يقوم النظام آلياً ببث الإشعارات وتنبيهات تأخر مخرجات SLA إلى جروب الإشراف الداخلي بالواتساب بشكل فوري مأتمت.</p>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                    <input type="checkbox" defaultChecked className="rounded text-indigo-600 w-4 h-4" />
                    <span>تفعيل ربط WhatsApp API للتعديلات العاجلة</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                    <input type="checkbox" defaultChecked className="rounded text-indigo-600 w-4 h-4" />
                    <span>تفعيل ربط Slack Webhooks للمصممين والكتاب</span>
                  </label>
                </div>
              </div>

            </div>

          </div>
        )}

      </main>
    </div>
  );
};
