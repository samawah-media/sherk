/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Organization, Deliverable, DeliverableStatus, SlaStatus, FileAsset, ClientApprover } from "../types";
import { SlaBadge, StatusBadge } from "./Badges";
import { mockClientApprovers } from "../data";
import { 
  Briefcase, Calendar, CheckCircle2, Clock, FileText, Folder, HelpCircle, 
  Layers, Lock, Paperclip, Plus, Search, Settings, Shield, User, Users,
  Wallet, ChevronLeft, ArrowLeft, Download, PlusCircle
} from "lucide-react";

interface ClientWorkspaceProps {
  organization: Organization;
  deliverables: Deliverable[];
  files: FileAsset[];
  onOpenDeliverable: (d: Deliverable) => void;
  onOpenFile: (f: FileAsset) => void;
  onUpdateDeliverables: (list: Deliverable[]) => void;
}

export const ClientWorkspace: React.FC<ClientWorkspaceProps> = ({
  organization,
  deliverables,
  files,
  onOpenDeliverable,
  onOpenFile,
  onUpdateDeliverables
}) => {
  const [activeTab, setActiveTab] = useState<"home" | "approvals" | "contract" | "files" | "settings">("home");
  const [fileCategoryFilter, setFileCategoryFilter] = useState<string>("الكل");
  const [fileSearch, setFileSearch] = useState<string>("");
  const [settingsActiveSubTab, setSettingsActiveSubTab] = useState<"approvers" | "notifications" | "company">("approvers");

  // Filter deliverables belonging to this organization
  const orgDeliverables = deliverables.filter(d => d.orgId === organization.id);
  const orgFiles = files.filter(f => f.linkedDeliverableId ? orgDeliverables.some(d => d.id === f.linkedDeliverableId) : f.category === "العقود والفواتير" || f.category === "مرفوعات العميل" || f.status === "نهائي");

  // Metrics calculations
  const totalAgreed = orgDeliverables.length;
  const completed = orgDeliverables.filter(d => d.status === DeliverableStatus.DELIVERED || d.status === DeliverableStatus.APPROVED_BY_CLIENT).length;
  const pendingApproval = orgDeliverables.filter(d => d.status === DeliverableStatus.PENDING_CLIENT_APPROVAL).length;
  const remaining = totalAgreed - completed;
  const overallProgressPercentage = totalAgreed > 0 ? Math.round((completed / totalAgreed) * 100) : 0;

  // Recent deliverables awaiting client approval
  const awaitingClientApprovalList = orgDeliverables.filter(d => d.status === DeliverableStatus.PENDING_CLIENT_APPROVAL);

  // Home Page quick actions / approval updates
  const handleApproveImmediate = (delId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent opening drawer
    const list = deliverables.map(d => {
      if (d.id === delId) {
        return {
          ...d,
          status: DeliverableStatus.APPROVED_BY_CLIENT,
          slaStatus: SlaStatus.ON_TIME,
          progress: 90,
          auditLogs: [
            {
              id: `audit_${Date.now()}`,
              action: "اعتماد فوري بنقرة واحدة من بوابة العميل الرئيسية",
              performedBy: "أحمد الميمان",
              userRole: "العميل",
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
  };

  const handleRequestRevisionImmediate = (delId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const comment = prompt("فضلاً أكتب ملحوظة التعديل المطلوبة على هذا الملف للفريق:");
    if (comment === null) return; // cancelled
    
    const list = deliverables.map(d => {
      if (d.id === delId) {
        return {
          ...d,
          status: DeliverableStatus.NEEDS_CLIENT_REVISION,
          progress: 75,
          slaStatus: SlaStatus.WAITING_CLIENT,
          comments: [
            ...d.comments,
            {
              id: `comm_${Date.now()}`,
              authorName: "أحمد الميمان",
              authorAvatar: "أ م",
              isInternal: false,
              text: comment.trim() || "أرجو مراجعة التنسيق بناء على التعديلات الموضحة بملاحظات الصورة.",
              timestamp: new Date().toISOString(),
              authorRole: "العميل - شركة النخبة"
            }
          ],
          auditLogs: [
            {
              id: `audit_${Date.now()}`,
              action: `طلب مراجعة من العميل: ${comment.trim() || 'يرجى مراجعة المخرج مجملاً'}`,
              performedBy: "أحمد الميمان",
              userRole: "العميل",
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
  };

  const handleExportSlaReport = () => {
    let reportText = `==================================================\n`;
    reportText += `       بوابة سماوة للتميز الرقمي - تقرير أداء الـ SLA\n`;
    reportText += `       اسم الجهة: ${organization.name}\n`;
    reportText += `       تاريخ التصدير: ${new Date().toLocaleDateString('ar-EG')} - ${new Date().toLocaleTimeString('ar-EG')}\n`;
    reportText += `==================================================\n\n`;

    reportText += `📊 ملخص التزام المخرجات لمشروعكم:\n`;
    reportText += `--------------------------------------------------\n`;
    reportText += `• إجمالي البنود المتفق عليها: ${totalAgreed} مخرج\n`;
    reportText += `• المخرجات المكتملة والمسلمة: ${completed} منجز (${overallProgressPercentage}%)\n`;
    reportText += `• بانتظار اعتمادكم الحالي: ${pendingApproval} بنود جارية\n`;
    reportText += `• المتبقية قيد المونتاج والتجهيز: ${remaining} بنود تحت التنمية\n\n`;

    reportText += `📋 التفصيل الشامل للمخرجات ومستوياتها الزمنية (SLA):\n`;
    reportText += `--------------------------------------------------\n`;

    orgDeliverables.forEach((d, idx) => {
      reportText += `${idx + 1}. [${d.type}] ${d.title}\n`;
      reportText += `   - الحالة الحالية: ${d.status}\n`;
      reportText += `   - معيار التوقيت والـ SLA: ${d.slaStatus} (${d.slaDaysRemaining} أيام متبقية)\n`;
      reportText += `   - تاريخ النشر المخطط: ${d.dueDate}\n`;
      reportText += `   - تقدم العمل الفني: ${d.progress}%\n`;
      if (d.comments && d.comments.length > 0) {
        reportText += `   - نقاش المراجعة الحالية: ${d.comments.length} ملاحظات مسجلة\n`;
      }
      reportText += `\n`;
    });

    reportText += `==================================================\n`;
    reportText += `نشكر ثقتكم في سماوة - شريككم التقني والإعلامي المعتمد.\n`;

    const blob = new Blob([reportText], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `تقرير_SLA_سماوة_${organization.name}_${new Date().toISOString().split('T')[0]}.txt`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-62px)]">
      {/* Sidebar - RTL aligned */}
      <aside className="w-full lg:w-64 bg-white border-l border-slate-100 flex flex-col shrink-0">
        <div className="p-5 border-b border-slate-150 flex items-center gap-3">
          <span className="text-2xl">{organization.logo}</span>
          <div className="text-right">
            <h3 className="font-extrabold text-[15px] text-slate-800 leading-tight">{organization.name}</h3>
            <span className="text-[10px] text-slate-400 font-bold block mt-1">{organization.sector}</span>
          </div>
        </div>

        {/* Sidebar Nav links */}
        <nav className="p-3.5 space-y-1 flex-1 text-right">
          <button
            onClick={() => setActiveTab("home")}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "home"
                ? "bg-[#5B35F5]/5 text-[#5B35F5] font-extrabold"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-950"
            }`}
          >
            <span>الرئيسية</span>
            <Layers className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={() => setActiveTab("approvals")}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "approvals"
                ? "bg-[#5B35F5]/5 text-[#5B35F5] font-extrabold"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-950"
            }`}
          >
            <div className="flex items-center gap-1.5 justify-end">
              {pendingApproval > 0 && (
                <span className="bg-rose-500 text-white rounded-full text-[9px] w-4 h-4 flex items-center justify-center font-bold">
                  {pendingApproval}
                </span>
              )}
              <span>بانتظار موافقتي</span>
            </div>
            <Clock className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={() => setActiveTab("contract")}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "contract"
                ? "bg-[#5B35F5]/5 text-[#5B35F5] font-extrabold"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-950"
            }`}
          >
            <span>العقد والمتابعة</span>
            <Briefcase className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={() => setActiveTab("files")}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "files"
                ? "bg-[#5B35F5]/5 text-[#5B35F5] font-extrabold"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-950"
            }`}
          >
            <span>الملفات والمستندات</span>
            <Folder className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "settings"
                ? "bg-[#5B35F5]/5 text-[#5B35F5] font-extrabold"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-950"
            }`}
          >
            <span>جهات الاعتماد والضبط</span>
            <Settings className="w-4 h-4 text-slate-400" />
          </button>
        </nav>

        {/* Small team widget */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-right">
          <p className="text-[10px] text-slate-400 font-extrabold mb-2 uppercase">مدير حسابك المخصص</p>
          <div className="flex gap-2 items-center justify-end">
            <div>
              <p className="text-xs font-bold text-slate-800">أحمد محمد</p>
              <p className="text-[9px] text-indigo-500 font-semibold text-left">مدير حسابات سماوة</p>
            </div>
            <span className="w-7 h-7 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-extrabold text-xs">
              أ م
            </span>
          </div>
        </div>
      </aside>

      {/* Main Panel content */}
      <main className="flex-1 bg-slate-50 p-6 space-y-6">

        {/* ==================================== HOME TAB ==================================== */}
        {activeTab === "home" && (
          <div className="space-y-6 text-right">
            
            {/* Header Greeting Banner */}
            <div className="bg-white rounded-2xl p-6 border border-slate-150/80 shadow-xs flex flex-col md:flex-row gap-5 items-center justify-between">
              <div className="space-y-1.5">
                <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 leading-tight">مرحباً بك، أ. أحمد الميمان 👋</h2>
                <p className="text-xs text-slate-400 font-medium">مرحباً بك في مساحتك ببوابة سماوة. تتابع هنا مخرجاتك المتكاملة وتصميماتك وجدول النشر لحظة بلحظة.</p>
              </div>
              <div className="flex gap-3 shrink-0">
                <button
                  onClick={() => setActiveTab("approvals")}
                  className="bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-1.5 transition-transform hover:scale-102"
                >
                  مراجعة الموافقات ({pendingApproval})
                  <Clock className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setActiveTab("contract")}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2 px-4 rounded-xl transition-colors border border-slate-200 cursor-pointer"
                >
                  تفاصيل الباقة والعقد
                </button>
                <button
                  onClick={handleExportSlaReport}
                  className="bg-[#5B35F5]/10 hover:bg-[#5B35F5]/15 text-[#5B35F5] font-bold text-xs py-2 px-4 rounded-xl transition-colors border border-[#5B35F5]/10 flex items-center gap-1.5 cursor-pointer"
                  title="تصدير ملخص حالة المخرجات ومؤشرات مستويات اتفاقية الخدمة"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>تصدير تقرير SLA 📥</span>
                </button>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4.5 rounded-2xl border border-slate-150 shadow-xs space-y-2">
                <span className="text-xs font-semibold text-slate-400 block">إجمالي بنود المحتوى المتفق عليها</span>
                <span className="text-3xl font-black block text-slate-900">{totalAgreed} مخرج</span>
                <span className="text-[10px] text-slate-400 block font-medium">موزعة حسب الخطة السنوية</span>
              </div>
              <div className="bg-white p-4.5 rounded-2xl border border-slate-150 shadow-xs space-y-2">
                <span className="text-xs font-semibold text-slate-400 block">المخرجات المنجزة والمسلمة</span>
                <span className="text-3xl font-black block text-emerald-600">{completed} منجز</span>
                <span className="text-[10px] text-emerald-500 font-bold block">بمعدل إنجاز {overallProgressPercentage}%</span>
              </div>
              <div className="bg-white p-4.5 rounded-2xl border border-slate-150 shadow-xs space-y-2">
                <span className="text-xs font-semibold text-slate-400 block">بانتظار اعتمادك</span>
                <span className={`text-3xl font-black block ${pendingApproval > 0 ? "text-rose-500 animate-pulse" : "text-slate-900"}`}>{pendingApproval} بنود</span>
                <span className="text-[10px] text-slate-400 block font-medium">مستندات جاهزة للموافقة الفورية</span>
              </div>
              <div className="bg-white p-4.5 rounded-2xl border border-slate-150 shadow-xs space-y-2">
                <span className="text-xs font-semibold text-slate-400 block">المخرجات المتبقية قيد التنفيذ</span>
                <span className="text-3xl font-black block text-indigo-500">{remaining} باقٍ</span>
                <span className="text-[10px] text-slate-400 block font-semibold text-indigo-600">يعمل عليها فريق سماوة الآن</span>
              </div>
            </div>

            {/* Overall Progress Progressbar */}
            <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-xs space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-indigo-600">{overallProgressPercentage}% مكتمل</span>
                <span className="font-bold text-slate-450">مستوى الإنجاز التراكمي لعقد خدماتكم</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-primary-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${overallProgressPercentage}%` }}
                />
              </div>
            </div>

            {/* Awaiting Review list & activities container */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Deliverables currently awaiting action */}
              <div className="lg:col-span-2 space-y-3">
                <div className="flex items-center justify-between">
                  <button onClick={() => setActiveTab("approvals")} className="text-xs text-primary-500 hover:underline font-bold">كل المراجعات</button>
                  <h3 className="font-extrabold text-base text-slate-900">مخرجات عاجلة بانتظار قرارك</h3>
                </div>

                {awaitingClientApprovalList.length > 0 ? (
                  <div className="space-y-3">
                    {awaitingClientApprovalList.slice(0, 3).map(del => (
                      <div 
                        key={del.id}
                        onClick={() => onOpenDeliverable(del)}
                        className="bg-white p-4 rounded-xl border border-slate-150 hover:border-primary-100 hover:shadow-xs transition-all cursor-pointer flex flex-col md:flex-row gap-4 items-start md:items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-primary-500 font-extrabold text-xs uppercase shrink-0">
                            {del.type}
                          </div>
                          <div>
                            <span className="text-[10px] font-extrabold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full mb-1 inline-block">
                              {del.type}
                            </span>
                            <h4 className="font-bold text-[13px] text-slate-800 leading-snug">{del.title}</h4>
                            <p className="text-[10px] text-slate-400 mt-1">تاريخ التسليم المتوقع: {del.dueDate}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 self-stretch md:self-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-slate-50">
                          <button
                            onClick={(e) => handleApproveImmediate(del.id, e)}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-extrabold px-3 py-1.5 rounded-lg transition-colors"
                          >
                            اعتماد فوري ✔
                          </button>
                          <button
                            onClick={(e) => handleRequestRevisionImmediate(del.id, e)}
                            className="text-slate-600 hover:text-rose-600 hover:bg-rose-50 text-[11px] font-bold px-3 py-1.5 rounded-lg border border-slate-200"
                          >
                            طلب تعديل ✏
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl p-8 border border-slate-150 text-center text-slate-400">
                    <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500 mb-2" />
                    <p className="font-bold text-sm">أهلاً بك! جميع المخرجات معتمدة تماماً</p>
                    <p className="text-xs text-slate-400 mt-1">لا توجد أي مخرجات تسويقية متأخرة أو بحاجة لتعليقك حالياً.</p>
                  </div>
                )}
              </div>

              {/* Sidebar updates */}
              <div className="space-y-3">
                <h3 className="font-extrabold text-base text-slate-900">آخر المستجدات والتعديلات</h3>
                <div className="bg-white rounded-2xl p-4 border border-slate-150 space-y-4">
                  <div className="space-y-3.5">
                    <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-right">
                      <span className="text-[10px] text-slate-400 block font-semibold">اليوم - 11:30 ص</span>
                      <p className="text-xs font-bold text-slate-800">سارة علي (المصممة)</p>
                      <p className="text-xs text-slate-600">رفعت مسودة ومقاسات إنستغرام جديدة لمنشور "الباقة العقارية".</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-right">
                      <span className="text-[10px] text-slate-400 block font-semibold">أمس - 04:15 م</span>
                      <p className="text-xs font-bold text-slate-800">أحمد محمد (مدير حسابك)</p>
                      <p className="text-xs text-slate-600">اعتمد داخلياً مخرج "روتين الصباح" وأرسله لبوابتكم للاعتماد.</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ==================================== APPROVALS QUEUE TAB ==================================== */}
        {activeTab === "approvals" && (
          <div className="space-y-4 text-right">
            <div className="flex flex-col md:flex-row gap-3 items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-xs text-slate-400 font-bold">اضغط على أي مخرج تسويقي لمشاهدة نصه وتصميمه أو ريلز الفيديو الخاص به والتعليق عليه</span>
              <h2 className="text-lg font-bold text-slate-900">مخرجات بانتظار موافقتك واعتمادك الكريم</h2>
            </div>

            {orgDeliverables.filter(d => d.status === DeliverableStatus.PENDING_CLIENT_APPROVAL).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {orgDeliverables
                  .filter(d => d.status === DeliverableStatus.PENDING_CLIENT_APPROVAL)
                  .map(del => (
                    <div
                      key={del.id}
                      onClick={() => onOpenDeliverable(del)}
                      className="bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer overflow-hidden flex flex-col justify-between"
                    >
                      {/* Image Thumbnail Preview */}
                      {del.previewUrl && (
                        <div className="w-full h-40 bg-slate-100 overflow-hidden relative">
                          <img 
                            src={del.previewUrl} 
                            alt={del.title} 
                            className="w-full h-full object-cover" 
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute top-2 right-2 bg-indigo-600 text-white font-extrabold text-[9px] px-2 py-0.5 rounded uppercase">
                            {del.type}
                          </div>
                        </div>
                      )}

                      <div className="p-4 space-y-3 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-indigo-600">{del.dueDate} :موعد النشر</span>
                          <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-extrabold">{del.type}</span>
                        </div>
                        
                        <h3 className="font-extrabold text-[14px] text-slate-800 leading-snug">{del.title}</h3>
                        
                        {del.contentText && (
                          <p className="text-xs text-slate-550 line-clamp-2 h-8 font-sans leading-relaxed">
                            {del.contentText}
                          </p>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-slate-50 text-[11px] text-slate-400">
                          <span className="font-semibold text-indigo-700">اضغط لمشاهدة التفاصيل 👁</span>
                          <span className="font-bold flex items-center gap-1">
                            {del.comments.length} تعليقات
                            <Clock className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>

                      {/* Action buttons footer inside card */}
                      <div className="p-3 bg-slate-50 flex gap-2 justify-end border-t border-slate-100">
                        <button
                          onClick={(e) => handleApproveImmediate(del.id, e)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] px-3.5 py-1.5 rounded-lg transition-transform hover:scale-102"
                        >
                          اعتماد فوري ✔
                        </button>
                        <button
                          onClick={(e) => handleRequestRevisionImmediate(del.id, e)}
                          className="text-slate-700 hover:bg-rose-50 hover:text-rose-700 border border-slate-200 font-bold text-[11px] px-3 py-1.5 rounded-lg transition-colors"
                        >
                          طلب تعديل ✏
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 border border-slate-150 text-center text-slate-400 space-y-3">
                <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-500" />
                <p className="font-extrabold text-base text-slate-800">بوابتك خالية تماماً من الموافقات الملقاة على عاتقك</p>
                <p className="text-xs text-slate-400 max-w-md mx-auto">عمل رائع! فريق سماوة لا زال يصيغ ويصمم المخرجات التالية وعند اكتمال المراجعة الجودة الداخلية ستظهر لك هنا فوراً.</p>
              </div>
            )}
          </div>
        )}

        {/* ==================================== CONTRACT TAB ==================================== */}
        {activeTab === "contract" && (
          <div className="space-y-6 text-right">
            
            {/* Header info contract */}
            <div className="bg-slate-950 text-white rounded-2xl p-6 border border-slate-800 relative overflow-hidden shadow-md">
              <div className="space-y-2 relative z-10 max-w-xl">
                <span className="bg-emerald-500/10 text-emerald-400 font-extrabold text-[10px] px-2.5 py-1 rounded inline-block border border-emerald-900/45">
                  حالة العقد: نشط وساري ⚡
                </span>
                <h2 className="text-xl md:text-2xl font-black">{organization.contractTitle}</h2>
                <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-slate-300 font-bold pt-2">
                  <span>تاريخ البدء: {organization.startDate}</span>
                  <span>تاريخ الانتهاء: {organization.endDate}</span>
                  <span className="text-indigo-400">متبقي على نهاية العقد: 198 يوم</span>
                </div>
              </div>
              <div className="absolute w-36 h-36 bg-indigo-500/10 rounded-full blur-3xl -bottom-10 -left-10 pointer-events-none" />
            </div>

            {/* Contract package quota balances */}
            <div className="space-y-3">
              <h3 className="font-extrabold text-base text-slate-900">بنود وحصص باقتك المتعاقد عليها</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* 30 Posts quota card */}
                <div className="bg-white p-4 rounded-xl border border-slate-150 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded">منشورات</span>
                    <h4 className="font-extrabold text-xs text-slate-700">منشورات السوشيال</h4>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-[10px] text-slate-400 font-semibold">المنجز: 18 / 30</span>
                    <span className="text-xl font-black text-slate-900">30 بند</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-primary-500 h-full rounded-full" style={{ width: '60%' }} />
                  </div>
                </div>

                {/* 8 Reels quota card */}
                <div className="bg-white p-4 rounded-xl border border-slate-150 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded">Reels</span>
                    <h4 className="font-extrabold text-xs text-slate-700 font-sans">ريلز مقاطع قصيرة</h4>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-[10px] text-slate-400 font-semibold">المنجز: 4 / 8</span>
                    <span className="text-xl font-black text-slate-900">8 بنود</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-primary-500 h-full rounded-full" style={{ width: '50%' }} />
                  </div>
                </div>

                {/* 3 Reports quota card */}
                <div className="bg-white p-4 rounded-xl border border-slate-150 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded">تقارير</span>
                    <h4 className="font-extrabold text-xs text-slate-700">تقارير الأداء الفني</h4>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-[10px] text-slate-400 font-semibold">المنجز: 2 / 3</span>
                    <span className="text-xl font-black text-slate-900">3 تقارير</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-primary-500 h-full rounded-full" style={{ width: '66%' }} />
                  </div>
                </div>

                {/* 1 Content Plan quota card */}
                <div className="bg-white p-4 rounded-xl border border-slate-150 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded">استراتيجية</span>
                    <h4 className="font-extrabold text-xs text-slate-700">خطة المحتوى السنوية</h4>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-[10px] text-slate-400 font-semibold">المنجز: 1 / 1</span>
                    <span className="text-xl font-black text-slate-900">1 خطة</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-primary-500 h-full rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>

              </div>
            </div>

            {/* Campaign Contract Timeline */}
            <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-xs space-y-5">
              <h3 className="font-bold text-slate-900">خارطة التدفق الزمني للملف التعاقدي</h3>
              <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch">
                
                {/* Node 1 */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl relative flex-1 text-right flex flex-col justify-between">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 block mb-1.5 bg-white rounded-full" />
                  <div>
                    <h4 className="text-xs font-black text-slate-800">مرحلة التعاقد والتحليل</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-1">تحديد المأرب والجمهور والمنصات (مكتملة)</p>
                  </div>
                </div>

                {/* Node 2 */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl relative flex-1 text-right flex flex-col justify-between">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 block mb-1.5 bg-white rounded-full" />
                  <div>
                    <h4 className="text-xs font-black text-slate-800">هيكل الاستراتيجية والخطة</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-1">بناء الجدولة واعتماد المواضيع (مكتملة)</p>
                  </div>
                </div>

                {/* Node 3 */}
                <div className="p-3.5 bg-indigo-50 border border-indigo-150 rounded-xl relative flex-1 text-right flex flex-col justify-between shadow-xs">
                  <Clock className="w-4 h-4 text-indigo-500 block mb-1.5 bg-white rounded-full animate-spin" style={{ animationDuration: '4s' }} />
                  <div>
                    <h4 className="text-xs font-black text-indigo-900">مرحلة إعداد المحتوى والتصميم</h4>
                    <p className="text-[10px] text-indigo-700 font-bold mt-1">يجري صياغة البنود والمونتاج للمسودات (نشطة)</p>
                  </div>
                </div>

                {/* Node 4 */}
                <div className="p-3.5 bg-white border border-slate-200 rounded-xl relative flex-1 text-right flex flex-col justify-between">
                  <div className="w-4 h-4 rounded-full border-2 border-slate-200 block mb-1.5" />
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400">التقييم والتقرير الشهري</h4>
                    <p className="text-[10px] text-slate-400 mt-1">رصد أرقام مبيعات يوليو المقبل</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Financial tracking summary */}
            <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-950">الملخص المالي والذمم الدائنة لك</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-right">
                  <span className="text-[10px] text-slate-400 font-bold block mb-1">إجمالي قيمة العقد السنوي</span>
                  <span className="text-lg font-black text-slate-800">{organization.billingSummary.total.toLocaleString("ar-SA")} ر.س</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-right">
                  <span className="text-[10px] text-emerald-600 font-bold block mb-1">المدفوع والمسدد</span>
                  <span className="text-lg font-black text-emerald-600">{organization.billingSummary.paid.toLocaleString("ar-SA")} ر.س</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-right">
                  <span className="text-[10px] text-rose-600 font-bold block mb-1">المبلغ المتبقي</span>
                  <span className="text-lg font-black text-rose-600">{organization.billingSummary.remaining.toLocaleString("ar-SA")} ر.س</span>
                </div>

                <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 text-right">
                  <span className="text-[10px] text-indigo-600 font-bold block mb-1">موعد الفاتورة القادمة</span>
                  <span className="text-sm font-black text-indigo-800 block mt-1">{organization.billingSummary.nextInvoiceDate}</span>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* ==================================== FILES MANAGER TAB ==================================== */}
        {activeTab === "files" && (
          <div className="space-y-6 text-right font-sans">
            
            {/* Header filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex gap-2 w-full md:w-auto relative items-center">
                <input
                  type="text"
                  value={fileSearch}
                  onChange={e => setFileSearch(e.target.value)}
                  placeholder="ابحث بالاسم عن ملف أو تقرير..."
                  className="bg-white border rounded-xl px-3 py-2 pr-9 text-xs w-full text-right focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-3 pointer-events-none" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">مكتبة ملفات ومرفوعات الوكالة</h2>
            </div>

            {/* Folder shortcuts */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              
              {["الكل", "الصور", "الفيديوهات", "التقارير", "الهوية البصرية", "مرفوعات العميل"].map((category) => (
                <div
                  key={category}
                  onClick={() => setFileCategoryFilter(category)}
                  className={`p-3.5 rounded-xl border text-center cursor-pointer transition-all ${
                    fileCategoryFilter === category
                      ? "bg-primary-500 text-white border-transparent shadow"
                      : "bg-white border-slate-150 text-slate-700 hover:border-slate-350"
                  }`}
                >
                  <Folder className={`w-6 h-6 mx-auto mb-2 ${fileCategoryFilter === category ? "text-white" : "text-indigo-400"}`} />
                  <span className="text-xs font-extrabold">{category}</span>
                </div>
              ))}

            </div>

            {/* File grid displaying files matching search and category */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {orgFiles
                .filter(f => fileCategoryFilter === "الكل" || f.category === fileCategoryFilter)
                .filter(f => f.name.toLowerCase().includes(fileSearch.toLowerCase()))
                .map(file => (
                  <div
                    key={file.id}
                    onClick={() => onOpenFile(file)}
                    className="p-4 bg-white rounded-2xl border border-slate-150/80 hover:border-indigo-400 cursor-pointer shadow-xs hover:shadow transition-all space-y-3 flex flex-col justify-between"
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-[9px] font-extrabold bg-slate-100 text-slate-500 border border-slate-200 px-1.5 py-0.5 rounded leading-none">
                        {file.status}
                      </span>
                      <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-extrabold uppercase text-xs">
                        {file.type}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-xs text-slate-800 block truncate">{file.name}</h4>
                      <p className="text-[10px] text-slate-400 mt-1">الحجم: {file.size} • بواسطة {file.uploaderName}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-50 flex items-center justify-between text-[11px] text-indigo-600 font-bold">
                      <span>عرض تفاصيل ومراجعات الملف 👁</span>
                      <span>تنزيل المرفق 📥</span>
                    </div>
                  </div>
                ))}

              {orgFiles.filter(f => fileCategoryFilter === "الكل" || f.category === fileCategoryFilter).length === 0 && (
                <div className="col-span-full py-12 text-slate-400 text-center border-2 border-dashed rounded-2xl space-y-2">
                  <FileText className="w-10 h-10 mx-auto text-slate-350" />
                  <p className="font-bold text-xs">لا توجد ملفات مرفوعة تحت تصنيف "{fileCategoryFilter}" حالياً</p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ==================================== SETTINGS TAB ==================================== */}
        {activeTab === "settings" && (
          <div className="space-y-6 text-right font-sans">
            
            {/* Header title */}
            <div className="pb-3 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900 leading-tight">جهات الاعتماد وضبط الصلاحيات</h2>
              <p className="text-xs text-slate-400 mt-1">قم بتحديد جهات القرار من منسوبي مؤسستكم المخولين بالمصادقة على التصاميم والتقارير المالية.</p>
            </div>

            {/* Sub Nav */}
            <div className="flex gap-4 border-b border-slate-100 text-xs">
              <button
                onClick={() => setSettingsActiveSubTab("approvers")}
                className={`pb-2.5 px-1 font-bold ${settingsActiveSubTab === "approvers" ? "border-b-2 border-primary-500 text-primary-500" : "text-slate-500"}`}
              >
                جهات الاعتماد المعتمدة
              </button>
              <button
                onClick={() => setSettingsActiveSubTab("notifications")}
                className={`pb-2.5 px-1 font-bold ${settingsActiveSubTab === "notifications" ? "border-b-2 border-primary-500 text-primary-500" : "text-slate-500"}`}
              >
                مصفوفة الإشعارات والتنبيهات
              </button>
              <button
                onClick={() => setSettingsActiveSubTab("company")}
                className={`pb-2.5 px-1 font-bold ${settingsActiveSubTab === "company" ? "border-b-2 border-primary-500 text-primary-500" : "text-slate-500"}`}
              >
                المعلومات الرسمية للشركة
              </button>
            </div>

            {/* Subtab 1: Approvers List */}
            {settingsActiveSubTab === "approvers" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <button
                    onClick={() => alert("محاكاة إضافة جهة اعتماد جديدة")}
                    className="p-1 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-bold transition-all"
                  >
                    إضافة جهة اعتماد ➕
                  </button>
                  <span className="font-extrabold text-slate-700">الأفراد المخولين بالاختيار والقرار</span>
                </div>

                <div className="space-y-3.5">
                  {(mockClientApprovers[organization.id] || []).map(approver => (
                    <div key={approver.id} className="bg-white p-4 rounded-xl border border-slate-150 shadow-xs flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-10 h-10 bg-indigo-50 text-indigo-700 rounded-xl flex items-center justify-center font-extrabold text-xs">
                          {approver.name.slice(0, 2)}
                        </span>
                        <div>
                          <h4 className="font-bold text-sm text-slate-800">{approver.name}</h4>
                          <p className="text-xs text-slate-400 font-semibold">{approver.title}</p>
                        </div>
                      </div>

                      {/* Permission Chips */}
                      <div className="flex flex-wrap gap-1.5 justify-end mt-2 md:mt-0">
                        {approver.permissions.map((perm, idx) => (
                          <span key={idx} className="bg-indigo-50 text-indigo-700 font-bold text-[10px] px-2.5 py-1 rounded-md border border-indigo-100">
                            {perm}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Subtab 2: Notifications Preference */}
            {settingsActiveSubTab === "notifications" && (
              <div className="bg-white p-5 rounded-2xl border border-slate-150 space-y-4">
                <h3 className="font-extrabold text-sm text-slate-800">قنوات الإشعار الرقمي التلقائي</h3>
                
                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex gap-4">
                      <label className="flex items-center gap-1.5 cursor-pointer font-bold">
                        <input type="checkbox" defaultChecked className="rounded text-indigo-600 w-4 h-4" />
                        <span>على المنصة</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer font-bold">
                        <input type="checkbox" defaultChecked className="rounded text-indigo-600 w-4 h-4" />
                        <span>البريد الإلكتروني</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer font-bold">
                        <input type="checkbox" defaultChecked className="rounded text-indigo-600 w-4 h-4" />
                        <span>واتساب</span>
                      </label>
                    </div>
                    <span className="font-bold text-slate-700">منشور جديد بانتظار المراجعة</span>
                  </div>

                  <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex gap-4">
                      <label className="flex items-center gap-1.5 cursor-pointer font-bold">
                        <input type="checkbox" defaultChecked className="rounded text-indigo-600 w-4 h-4" />
                        <span>على المنصة</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer font-bold">
                        <input type="checkbox" className="rounded text-indigo-600 w-4 h-4" />
                        <span>البريد الإلكتروني</span>
                      </label>
                    </div>
                    <span className="font-bold text-slate-700">تم نشر وتنزيل المخرج على حساب السوشيال ميديا الخاص بك</span>
                  </div>

                  <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex gap-4">
                      <label className="flex items-center gap-1.5 cursor-pointer font-bold">
                        <input type="checkbox" defaultChecked />
                        <span>على المنصة</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer font-bold">
                        <input type="checkbox" defaultChecked />
                        <span>واتساب</span>
                      </label>
                    </div>
                    <span className="font-bold text-slate-700">اقتراب انتهاء الباقة الشهرية أو الحصة</span>
                  </div>
                </div>
              </div>
            )}

            {/* Subtab 3: Company Data */}
            {settingsActiveSubTab === "company" && (
              <div className="bg-white p-5 rounded-2xl border border-slate-150 space-y-4">
                <h3 className="font-bold text-sm text-slate-800">بيانات التوثيق والفوترة لـ {organization.name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="text-slate-400 font-semibold block">العنوان الوطني</label>
                    <input type="text" readOnly value="7823 طريق الملك فهد، حي الصحافة، الرياض، المملكة العربية السعودية" className="w-full p-2.5 bg-slate-50 rounded-lg border text-right" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 font-semibold block">الرقم الضريبي (VAT)</label>
                    <input type="text" readOnly value="300982341500003" className="w-full p-2.5 bg-slate-50 rounded-lg border text-right font-mono" />
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

      </main>
    </div>
  );
};
