/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Deliverable, DeliverableStatus, SlaStatus, UserRole, TeamMember, FileAsset } from "../types";
import { SlaBadge, StatusBadge, PriorityBadge } from "./Badges";
import { getStatusProgress } from "../data";
import { motion, AnimatePresence } from "motion/react";
import {
  X, CheckSquare, MessageSquare, Paperclip, ClipboardList, Info, FileText, Send, Plus, 
  Trash2, User, RefreshCw, Layers, CheckCircle2, AlertTriangle, Play, HelpCircle
} from "lucide-react";

interface DeliverableDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  deliverable: Deliverable | null;
  role: UserRole;
  teamMembers: TeamMember[];
  allFiles: FileAsset[];
  onUpdateDeliverable: (updated: Deliverable) => void;
}

export const DeliverableDrawer: React.FC<DeliverableDrawerProps> = ({
  isOpen,
  onClose,
  deliverable,
  role,
  teamMembers,
  allFiles,
  onUpdateDeliverable
}) => {
  if (!deliverable) return null;

  const [activeTab, setActiveTab] = useState<"details" | "tasks" | "files" | "comments" | "quality" | "history">("details");
  const [newCommentText, setNewCommentText] = useState("");
  const [commentIsInternal, setCommentIsInternal] = useState(role !== UserRole.CLIENT);
  const [newFileUploaderOpen, setNewFileUploaderOpen] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [uploadedFileType, setUploadedFileType] = useState<"JPG" | "PNG" | "PDF" | "MP4" | "XLS">("PNG");
  const [uploadedFileCategory, setUploadedFileCategory] = useState<any>("الصور");

  // Get active members initials
  const owner = teamMembers.find(t => t.id === deliverable.ownerId) || { name: "غير معين", title: "", avatar: "؟" };
  const collaborators = teamMembers.filter(t => (deliverable.collaboratorIds || []).includes(t.id));

  // Linked files
  const linkedFiles = (allFiles || []).filter(f => (deliverable.fileIds || []).includes(f.id));

  // Filter comments based on role
  const visibleComments = (deliverable.comments || []).filter(c => {
    if (role === UserRole.CLIENT) {
      return !c.isInternal; // Client never sees internal comments
    }
    return true; // Team and Admin see both
  });

  // Toggle tasks
  const handleToggleTask = (taskId: string) => {
    if (role === UserRole.CLIENT) return; // Clients cannot modify internal subtasks

    const updatedTasks = deliverable.subTasks.map(t => {
      if (t.id === taskId) return { ...t, completed: !t.completed };
      return t;
    });

    onUpdateDeliverable({
      ...deliverable,
      subTasks: updatedTasks,
      // Log audit
      auditLogs: [
        {
          id: `audit_${Date.now()}`,
          action: `قام بتحديث حالة المهمة الفرعية: "${updatedTasks.find(t=>t.id===taskId)?.title}"`,
          performedBy: role === UserRole.ADMIN ? "مدير النظام" : owner.name,
          userRole: role,
          timestamp: new Date().toISOString(),
          isInternalOnly: true
        },
        ...deliverable.auditLogs
      ]
    });
  };

  // Toggle quality checklist items (Internal only)
  const handleToggleQuality = (itemId: string) => {
    if (role === UserRole.CLIENT) return;

    const updatedChecklist = deliverable.qualityChecklist.map(item => {
      if (item.id === itemId) return { ...item, checked: !item.checked };
      return item;
    });

    onUpdateDeliverable({
      ...deliverable,
      qualityChecklist: updatedChecklist,
      auditLogs: [
        {
          id: `audit_${Date.now()}`,
          action: `تعديل بند الجودة الداخلي: "${updatedChecklist.find(t=>t.id===itemId)?.text}"`,
          performedBy: role === UserRole.ADMIN ? "مدير النظام" : owner.name,
          userRole: role,
          timestamp: new Date().toISOString(),
          isInternalOnly: true
        },
        ...deliverable.auditLogs
      ]
    });
  };

  // Add Comment
  const handleAddComment = () => {
    if (!newCommentText.trim()) return;

    const newComment = {
      id: `comm_${Date.now()}`,
      authorName: role === UserRole.CLIENT ? "أحمد الميمان" : "أحمد محمد (مدير الحساب)",
      authorAvatar: role === UserRole.CLIENT ? "أ م" : "أ م",
      isInternal: role === UserRole.CLIENT ? false : commentIsInternal,
      text: newCommentText,
      timestamp: new Date().toISOString(),
      authorRole: role === UserRole.CLIENT ? "العميل - شركة النخبة" : "فريق سماوة"
    };

    onUpdateDeliverable({
      ...deliverable,
      comments: [...deliverable.comments, newComment],
      auditLogs: [
        {
          id: `audit_${Date.now()}`,
          action: `أضاف تعليقًا جديدًا: "${newCommentText.slice(0, 30)}..."`,
          performedBy: newComment.authorName,
          userRole: role,
          timestamp: new Date().toISOString(),
          isInternalOnly: newComment.isInternal
        },
        ...deliverable.auditLogs
      ]
    });

    setNewCommentText("");
  };

  // Trigger Client Approval Selection
  const handleClientDecision = (decision: "approve" | "revision") => {
    let newStatus: DeliverableStatus;
    let actionText = "";

    if (decision === "approve") {
      newStatus = DeliverableStatus.APPROVED_BY_CLIENT;
      actionText = "اعتماد المخرج وتعميده بصفة موافق من طرف العميل";
    } else {
      newStatus = DeliverableStatus.NEEDS_CLIENT_REVISION;
      actionText = "طلب العميل مراجعة وتعديل النسخة وتقديم تعليقات إيضاحية";
    }

    onUpdateDeliverable({
      ...deliverable,
      status: newStatus,
      progress: getStatusProgress(newStatus),
      slaStatus: decision === "approve" ? SlaStatus.ON_TIME : SlaStatus.WAITING_CLIENT,
      auditLogs: [
        {
          id: `audit_${Date.now()}`,
          action: actionText,
          performedBy: "أحمد الميمان",
          userRole: "العميل",
          timestamp: new Date().toISOString(),
          isInternalOnly: false
        },
        ...deliverable.auditLogs
      ]
    });
  };

  // Internal approval flow for Admin or Account Manager (Send to Client)
  const handleInternalApproval = () => {
    const newStatus = DeliverableStatus.PENDING_CLIENT_APPROVAL;
    onUpdateDeliverable({
      ...deliverable,
      status: newStatus,
      progress: getStatusProgress(newStatus),
      slaStatus: SlaStatus.WAITING_CLIENT,
      auditLogs: [
        {
          id: `audit_${Date.now()}`,
          action: "تم المراجعة والتعميد الداخلي وإرسال المخرج لبوابة العميل لطلب موافقته",
          performedBy: "راشد سالم (مدير المشروع)",
          userRole: "الإدارة",
          timestamp: new Date().toISOString(),
          isInternalOnly: false
        },
        ...deliverable.auditLogs
      ]
    });
  };

  // Status changer for workers
  const handleStatusChange = (status: DeliverableStatus) => {
    onUpdateDeliverable({
      ...deliverable,
      status,
      progress: getStatusProgress(status),
      auditLogs: [
        {
          id: `audit_${Date.now()}`,
          action: `تم تحديث حالة المخرج إلى: [${status}]`,
          performedBy: role === UserRole.ADMIN ? "إدارة سماوة" : owner.name,
          userRole: role,
          timestamp: new Date().toISOString(),
          isInternalOnly: status !== DeliverableStatus.DELIVERED
        },
        ...deliverable.auditLogs
      ]
    });
  };

  // Handle custom mock file uploading
  const handleMockUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedFileName.trim()) return;

    const newFile: FileAsset = {
      id: `file_${Date.now()}`,
      name: uploadedFileName.endsWith(uploadedFileType.toLowerCase()) 
        ? uploadedFileName 
        : `${uploadedFileName}.${uploadedFileType.toLowerCase()}`,
      size: "2.4 MB",
      type: uploadedFileType,
      category: uploadedFileCategory,
      uploaderName: role === UserRole.CLIENT ? "العميل" : owner.name,
      uploaderRole: role === UserRole.CLIENT ? "العميل" : "فريق سماوة",
      uploadedAt: new Date().toISOString().split('T')[0],
      downloadUrl: "#",
      linkedDeliverableId: deliverable.id,
      status: role === UserRole.CLIENT ? "نهائي" : "مسودة"
    };

    // Append to global file list simulation inside parent
    allFiles.unshift(newFile);

    onUpdateDeliverable({
      ...deliverable,
      fileIds: [...deliverable.fileIds, newFile.id],
      auditLogs: [
        {
          id: `audit_${Date.now()}`,
          action: `تم رفع ملف مرفق جديد: ${newFile.name}`,
          performedBy: newFile.uploaderName,
          userRole: role,
          timestamp: new Date().toISOString(),
          isInternalOnly: false
        },
        ...deliverable.auditLogs
      ]
    });

    setUploadedFileName("");
    setNewFileUploaderOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay mask */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40"
          />

          {/* Slide panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white shadow-2xl z-50 flex flex-col h-full text-slate-800"
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/80 sticky top-0">
              <div className="flex-1 space-y-2 text-right">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={deliverable.status} />
                  <SlaBadge status={deliverable.slaStatus} daysRemaining={deliverable.slaDaysRemaining} />
                  <PriorityBadge priority={deliverable.priority} />
                </div>
                <h2 className="text-xl font-bold text-slate-900 pr-1 tracking-tight">{deliverable.title}</h2>
                <p className="text-xs text-slate-500 mr-1 font-semibold flex items-center gap-1.5">
                  <span>نوع المخرج:</span>
                  <span className="text-slate-700 bg-slate-200/60 px-2 py-0.5 rounded-md font-bold">{deliverable.type}</span>
                  {deliverable.platforms && (
                    <>
                      <span className="text-slate-300">|</span>
                      <span>المنصات المستهدفة:</span>
                      <span className="text-indigo-600 font-bold">{deliverable.platforms.join("، ")}</span>
                    </>
                  )}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-slate-200/80 transition-colors mr-3 text-slate-400 hover:text-slate-700 focus:outline-none"
              >
                <X className="w-5.5 h-5.5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-100 bg-white sticky top-0 px-5 text-sm overflow-x-auto">
              <button
                onClick={() => setActiveTab("details")}
                className={`py-3 px-3.5 font-bold transition-all border-b-2 leading-none whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === "details"
                    ? "border-primary-500 text-primary-500"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <Info className="w-4 h-4" />
                المحتوى والمعاينة
              </button>

              {role !== UserRole.CLIENT && (
                <button
                  onClick={() => setActiveTab("tasks")}
                  className={`py-3 px-3.5 font-bold transition-all border-b-2 leading-none whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === "tasks"
                      ? "border-primary-500 text-primary-500"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <CheckSquare className="w-4 h-4" />
                  مهام التنفيذ ({(deliverable.subTasks || []).filter(t=>t.completed).length}/{(deliverable.subTasks || []).length})
                </button>
              )}

              <button
                onClick={() => setActiveTab("files")}
                className={`py-3 px-3.5 font-bold transition-all border-b-2 leading-none whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === "files"
                    ? "border-primary-500 text-primary-500"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <Paperclip className="w-4 h-4" />
                الملفات والنسخ ({linkedFiles.length})
              </button>

              <button
                onClick={() => setActiveTab("comments")}
                className={`py-3 px-3.5 font-bold transition-all border-b-2 leading-none whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === "comments"
                    ? "border-primary-500 text-primary-500"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                التعليقات والملاحظات ({visibleComments.length})
              </button>

              {role !== UserRole.CLIENT && (
                <button
                  onClick={() => setActiveTab("quality")}
                  className={`py-3 px-3.5 font-bold transition-all border-b-2 leading-none whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === "quality"
                      ? "border-primary-500 text-primary-500"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <ClipboardList className="w-4 h-4" />
                  معايير جودة سماوة
                </button>
              )}

              <button
                onClick={() => setActiveTab("history")}
                className={`py-3 px-3.5 font-bold transition-all border-b-2 leading-none whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === "history"
                    ? "border-primary-500 text-primary-500"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <RefreshCw className="w-4 h-4" />
                سجل النشاط
              </button>
            </div>

            {/* Content Body Scrollable */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">

              {/* TAB 1: DETAILS */}
              {activeTab === "details" && (
                <div className="space-y-6 text-right">

                  {/* Summary Block */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-xs text-slate-400 block font-semibold">تاريخ البداية</span>
                      <span className="text-sm font-bold text-slate-700">{deliverable.startDate}</span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 block font-semibold">تاريخ التسليم النهائي</span>
                      <span className="text-sm font-bold text-slate-700">{deliverable.dueDate}</span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 block font-semibold">المسؤول عن العمل</span>
                      <span className="text-sm font-bold text-indigo-700 flex items-center gap-1.5 mt-0.5 justify-end">
                        <span className="w-5 h-5 bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded-full flex items-center justify-center">
                          {owner.avatar}
                        </span>
                        <span>{owner.name}</span>
                      </span>
                    </div>
                    {role !== UserRole.CLIENT && collaborators.length > 0 && (
                      <div className="col-span-2">
                        <span className="text-xs text-slate-400 block font-semibold">المشاركون الآخرون</span>
                        <div className="flex items-center gap-1.5 mt-1 justify-end">
                          {collaborators.map(c => (
                            <span key={c.id} className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-bold">
                              {c.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="col-span-2 md:col-span-1">
                      <span className="text-xs text-slate-400 block font-semibold">حالة التأخير / SLA</span>
                      <span className="text-xs font-bold text-slate-700 bg-slate-200/50 px-2.5 py-1 rounded inline-block mt-1">
                        مسؤولية التأخير: {deliverable.slaResponsibility}
                      </span>
                    </div>
                  </div>

                  {/* Copywriting captions */}
                  <div className="space-y-2">
                    <h3 className="font-bold text-slate-900 border-r-3 border-primary-500 pr-2">النص الإعلاني والمحتوى الموجه (Caption)</h3>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 font-sans text-sm leading-relaxed text-slate-800 whitespace-pre-wrap select-all">
                      {deliverable.contentText || "لا يوجد نص محدد لهذا المخرج."}
                    </div>
                  </div>

                  {/* Premium mockup visual display */}
                  <div className="space-y-2">
                    <h3 className="font-bold text-slate-900 border-r-3 border-primary-500 pr-2">معاينة الملف المرفوع للمخرج</h3>
                    <div className="border border-slate-100 rounded-xl overflow-hidden shadow-sm relative group bg-slate-950 flex items-center justify-center min-h-[260px]">
                      {deliverable.previewUrl ? (
                        <>
                          <img
                            src={deliverable.previewUrl}
                            alt={deliverable.title}
                            className="w-full h-full object-cover max-h-[340px] opacity-90 group-hover:opacity-100 transition-opacity"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded text-white text-[11px] font-bold">
                            نسخة مرئية من سماوة
                          </div>
                        </>
                      ) : (
                        <div className="text-center p-8 space-y-2 text-slate-400">
                          <AlertTriangle className="w-10 h-10 mx-auto text-amber-500" />
                          <p className="font-bold text-sm">لم يتم رفع نسخة صور/فيديو نهائية لهذا المخرج بعد</p>
                          <p className="text-xs text-slate-500">يقوم فريق سماوة برفعها عند اكتمال مهام التصميم والمونتاج</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Client Portal Feedback Box (Pending Approval specific) */}
                  {role === UserRole.CLIENT && deliverable.status === DeliverableStatus.PENDING_CLIENT_APPROVAL && (
                    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 space-y-4 shadow-sm">
                      <div className="flex gap-2 items-start">
                        <CheckCircle2 className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
                        <div>
                          <h4 className="font-extrabold text-[14px] text-indigo-900">هذا المخرج بانتظار قرارك الكريم</h4>
                          <p className="text-xs text-indigo-700">يمكنك اعتماد المخرج فوراً ليتم رفعه بشكل نهائي، أو طلب تعديلات ليقوم الفريق بتعديله في الحال.</p>
                        </div>
                      </div>
                      <div className="flex gap-3 justify-end pt-1">
                        <button
                          onClick={() => handleClientDecision("approve")}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition-transform hover:scale-103 shadow-sm flex items-center gap-1.5"
                        >
                          اعتماد المخرج ✔
                        </button>
                        <button
                          onClick={() => handleClientDecision("revision")}
                          className="bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 font-bold text-xs px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5"
                        >
                          طلب تعديل ✏
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Internal Admin Decision box */}
                  {role === UserRole.ADMIN && deliverable.status === DeliverableStatus.READY_INTERNAL_REVIEW && (
                    <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 space-y-4 shadow-sm">
                      <div className="flex gap-2 items-start">
                        <Layers className="w-5 h-5 text-primary-500 mt-0.5 shrink-0" />
                        <div>
                          <h4 className="font-bold text-sm text-primary-900">مراجعة الجودة الإدارية والتعميد الداخلي</h4>
                          <p className="text-xs text-primary-700">المخرج جاهز ومكتمل وخاضع لمراقبة جودة سماوة. اضغط لإرساله لبوابة العميل لاعتماده رسمياً.</p>
                        </div>
                      </div>
                      <div className="flex gap-2 justify-end pt-1">
                        <button
                          onClick={handleInternalApproval}
                          className="bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs px-4 py-2 rounded-lg transition-transform hover:scale-103 shadow-sm"
                        >
                          تعميد داخلي وإرسال للعميل 📥
                        </button>
                        <button
                          onClick={() => handleStatusChange(DeliverableStatus.NEEDS_INTERNAL_REVISION)}
                          className="bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200 font-bold text-xs px-3 py-2 rounded-lg transition-colors"
                        >
                          إرجاع للفريق للتعديل الداخلي ↩
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* TAB 2: SUBTASKS (Internal only) */}
              {activeTab === "tasks" && role !== UserRole.CLIENT && (
                <div className="space-y-4 text-right">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-500">تم إنجاز {(deliverable.subTasks || []).filter(t=>t.completed).length} من أصل {(deliverable.subTasks || []).length} من الأعمال الفرعية</span>
                    <h3 className="font-bold text-slate-900">قائمة المهام الداخلية</h3>
                  </div>

                  <div className="space-y-2.5">
                    {(deliverable.subTasks || []).length > 0 ? (
                      (deliverable.subTasks || []).map(task => (
                        <div
                          key={task.id}
                          onClick={() => handleToggleTask(task.id)}
                          className={`p-3.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                            task.completed
                              ? "bg-slate-50 border-slate-200 text-slate-400 line-through"
                              : "bg-white border-slate-200 hover:border-indigo-200 hover:shadow-sm text-slate-700"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                              task.completed ? "bg-emerald-500 border-transparent text-white" : "border-slate-350 bg-white text-transparent"
                            }`}>
                              ✔
                            </span>
                            <span className="font-semibold text-sm">{task.title}</span>
                          </div>
                          {task.assignedTo && (
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                              {teamMembers.find(t=>t.id===task.assignedTo)?.name || "الفريق"}
                            </span>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 text-center py-6">لا توجد مهام فرعية مخصصة لهذه الخدمة.</p>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: FILES */}
              {activeTab === "files" && (
                <div className="space-y-4 text-right">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <button
                      onClick={() => setNewFileUploaderOpen(!newFileUploaderOpen)}
                      className="text-primary-500 hover:text-primary-600 font-bold text-xs flex items-center gap-1 bg-primary-50 hover:bg-primary-100 px-2.5 py-1.5 rounded-lg transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      رفع نسخة ملف
                    </button>
                    <h3 className="font-bold text-slate-900">النسخ ومرفقات العمل</h3>
                  </div>

                  {/* Simulated Upload Area */}
                  {newFileUploaderOpen && (
                    <motion.form
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      onSubmit={handleMockUpload}
                      className="bg-slate-50 p-4 rounded-xl border border-dashed border-indigo-200/80 space-y-3"
                    >
                      <h4 className="text-xs font-bold text-indigo-900">محاكاة رفع ملف لهذا المخرج</h4>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-500 block">اسم الملف</label>
                        <input
                          type="text"
                          required
                          value={uploadedFileName}
                          onChange={e => setUploadedFileName(e.target.value)}
                          placeholder="مثال: التصميم_النهائي_لمشروع_الياسمين"
                          className="w-full text-xs p-2 rounded-lg border bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 text-right"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] font-bold text-slate-500 block mb-1">نوع الملف</label>
                          <select
                            value={uploadedFileType}
                            onChange={e => setUploadedFileType(e.target.value as any)}
                            className="w-full text-xs p-1.5 rounded-lg border bg-white focus:outline-none"
                          >
                            <option value="PNG">PNG Image</option>
                            <option value="JPG">JPG Image</option>
                            <option value="PDF">PDF Report</option>
                            <option value="MP4">MP4 Video</option>
                            <option value="XLS">Excel Sheet</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-slate-500 block mb-1">مجلد التصنيف</label>
                          <select
                            value={uploadedFileCategory}
                            onChange={e => setUploadedFileCategory(e.target.value as any)}
                            className="w-full text-xs p-1.5 rounded-lg border bg-white focus:outline-none"
                          >
                            <option value="الصور">الصور</option>
                            <option value="الفيديوهات">الفيديوهات</option>
                            <option value="التقارير">التقارير</option>
                            <option value="مرفوعات العميل">مرفوعات العميل</option>
                            <option value="الملفات المعتمدة">الملفات المعتمدة</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex gap-2 justify-end pt-1">
                        <button
                          type="submit"
                          className="bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold px-3 py-1.5 rounded"
                        >
                          تأكيد الرفع ✔
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewFileUploaderOpen(false)}
                          className="bg-slate-200 text-slate-600 text-[11px] font-bold px-3 py-1.5 rounded"
                        >
                          إلغاء
                        </button>
                      </div>
                    </motion.form>
                  )}

                  <div className="space-y-2">
                    {linkedFiles.length > 0 ? (
                      linkedFiles.map(file => (
                        <div key={file.id} className="p-3 rounded-xl border border-slate-100 flex items-center justify-between hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center font-bold text-xs uppercase">
                              {file.type}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-800">{file.name}</p>
                              <p className="text-[10px] text-slate-400">
                                الحجم: {file.size} | بواسطة: {file.uploaderName} | تاريخ الرفع: {file.uploadedAt}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-extrabold bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                              {file.status}
                            </span>
                            <a
                              href="#download"
                              onClick={(e) => { e.preventDefault(); alert(`محاكاة تحميل ملف: ${file.name}`); }}
                              className="text-xs text-indigo-600 hover:underline font-bold"
                            >
                              تحميل 📥
                            </a>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-slate-400 border border-dashed rounded-xl">
                        <FileText className="w-8 h-8 mx-auto text-slate-300 mb-1" />
                        <p className="text-xs font-semibold">لا توجد ملفات نهائية مرفوعة ومربوطة بهذا المخرج حالياً.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: COMMENTS */}
              {activeTab === "comments" && (
                <div className="space-y-4 text-right">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-semibold text-slate-400">العرض للعميل مقتصر على التعليقات العامة فقط</span>
                    <h3 className="font-bold text-slate-900">سجل التعليقات</h3>
                  </div>

                  {/* Comments Feed */}
                  <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
                    {visibleComments.length > 0 ? (
                      visibleComments.map(comment => (
                        <div
                          key={comment.id}
                          className={`p-3.5 rounded-xl border space-y-1.5 ${
                            comment.isInternal
                              ? "bg-purple-50/50 border-purple-100"
                              : "bg-slate-50 border-slate-100"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              {comment.isInternal && (
                                <span className="text-[9px] font-extrabold text-purple-700 bg-purple-100 border border-purple-200 px-1.5 py-0.5 rounded">
                                  داخلي للفريق 🔒
                                </span>
                              )}
                              <span className="text-[10px] text-slate-400 font-semibold">
                                {new Date(comment.timestamp).toLocaleTimeString("ar-SA", {hour: "2-digit", minute:"2-digit"})}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div>
                                <span className="text-xs font-bold text-slate-800">{comment.authorName}</span>
                                <span className="text-[9px] text-slate-400 block -mt-0.5 font-semibold">{comment.authorRole}</span>
                              </div>
                              <span className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center border border-slate-300">
                                {comment.authorAvatar}
                              </span>
                            </div>
                          </div>
                          <p className="text-xs text-slate-700 leading-relaxed font-sans">{comment.text}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 text-center py-6">لا يوجد تعليقات وملاحظات حتى الآن.</p>
                    )}
                  </div>

                  {/* Feed box input */}
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-3">
                    <textarea
                      value={newCommentText}
                      onChange={e => setNewCommentText(e.target.value)}
                      placeholder={role === UserRole.CLIENT ? "اكتب استفسارك للوكالة أو ملحوظات التعديل المطلوبة هنا..." : "أضف توجيهك للمصمم أو مقترحات التعديل الإداري..."}
                      className="w-full text-xs p-2.5 rounded-lg border bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 h-20 text-right font-sans"
                    />
                    <div className="flex items-center justify-between">
                      <button
                        onClick={handleAddComment}
                        className="bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 transition-transform hover:scale-103"
                      >
                        <Send className="w-3.5 h-3.5" />
                        إرسال التعليق
                      </button>

                      {/* Internal check toggle for workers */}
                      {role !== UserRole.CLIENT && (
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-600">
                          <input
                            type="checkbox"
                            checked={commentIsInternal}
                            onChange={e => setCommentIsInternal(e.target.checked)}
                            className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 w-4 h-4"
                          />
                          <span>تعليق داخلي🔒 (مخفي عن بوابات العملاء)</span>
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: QUALITY CHECKLIST */}
              {activeTab === "quality" && role !== UserRole.CLIENT && (
                <div className="space-y-4 text-right">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex gap-3 items-center">
                    <ClipboardList className="w-5 h-5 text-indigo-500 shrink-0" />
                    <p className="text-xs text-slate-600 leading-relaxed">
                      <strong>مراقبة الجودة تمنع إحراج الوكالة:</strong> يمنع النظام آلياً إصدار أي مخرج تسويقي للعميل إلا بعد استيفاء جميع معايير التدقيق اللغوي، مطابقة كود الهوية، والتعميد الإداري.
                    </p>
                  </div>

                  <div className="space-y-2">
                    {(deliverable.qualityChecklist || []).map(item => (
                      <div
                        key={item.id}
                        onClick={() => handleToggleQuality(item.id)}
                        className="p-3.5 rounded-xl border bg-white flex items-center justify-between cursor-pointer hover:border-slate-350 transition-all"
                      >
                        <span className="text-[10px] font-extrabold px-2 py-0.5 bg-rose-50 text-rose-600 border border-rose-100 rounded">
                          {item.required ? "إلزامي للمخرج" : "اختياري للشكل"}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-slate-800">{item.text}</span>
                          <span className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                            item.checked ? "bg-indigo-600 text-white border-transparent" : "border-slate-300 bg-white"
                          }`}>
                            ✓
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: AUDIT HISTORY */}
              {activeTab === "history" && (
                <div className="space-y-4 text-right">
                  <h3 className="font-bold text-slate-900 border-r-3 border-primary-500 pr-2 pb-1">تاريخ تحديث وإجراءات السجل</h3>
                  <div className="relative border-r-2 border-slate-100 pr-4 mr-2 space-y-5">
                    {(deliverable.auditLogs || []).map((log, index) => {
                      if (role === UserRole.CLIENT && log.isInternalOnly) return null; // client doesn't see internal logs

                      return (
                        <div key={log.id} className="relative">
                          {/* Indicator dot */}
                          <div className={`absolute -right-[21px] top-1.5 w-2.5 h-2.5 rounded-full border border-white ${
                            log.isInternalOnly ? "bg-purple-500" : "bg-teal-500"
                          }`} />

                          <div>
                            <p className="text-xs font-bold text-slate-800 flex items-center gap-2">
                              <span>{log.performedBy}</span>
                              <span className="text-[9px] text-slate-400 bg-slate-100 border px-1.5 p-0.5 rounded font-extrabold">{log.userRole}</span>
                              {log.isInternalOnly && (
                                <span className="text-[8px] bg-purple-50 text-purple-700 px-1 py-0.2 rounded font-bold">داخلي🔒</span>
                              )}
                            </p>
                            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed font-sans">{log.action}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              {new Date(log.timestamp).toLocaleString("ar-SA", { dateStyle: "short", timeStyle: "short" })}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>

            {/* Sticky bottom buttons based on active role */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex flex-wrap gap-2 justify-between items-center sticky bottom-0">
              
              {/* Left action tags */}
              <div className="text-[11px] text-slate-400 font-bold flex items-center gap-1">
                <span>رقم المجمع:</span>
                <span>{deliverable.id}</span>
              </div>

              {/* Right role workflows */}
              <div className="flex gap-2">
                {/* Admin full override selectors */}
                {role === UserRole.ADMIN && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-500">الحالة الإدارية:</span>
                    <select
                      value={deliverable.status}
                      onChange={(e) => handleStatusChange(e.target.value as DeliverableStatus)}
                      className="bg-white border text-xs font-bold rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      {Object.values(DeliverableStatus).map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Writer/Designer status workflows */}
                {role === UserRole.TEAM && (
                  <div className="flex gap-1.5">
                    {deliverable.status === DeliverableStatus.NEEDS_INTERNAL_REVISION && (
                      <button
                        onClick={() => handleStatusChange(DeliverableStatus.READY_INTERNAL_REVIEW)}
                        className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg shadow-sm"
                      >
                        إعادة تشغيل وإرسال للمراجعة الداخلية ↩
                      </button>
                    )}
                    {deliverable.status === DeliverableStatus.IN_PROGRESS && (
                      <button
                        onClick={() => handleStatusChange(DeliverableStatus.READY_INTERNAL_REVIEW)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg shadow-sm"
                      >
                        تقديم المخرج للمراجعة الإدارية 📥
                      </button>
                    )}
                  </div>
                )}

                {/* Client Close workflow */}
                {role === UserRole.CLIENT && deliverable.status === DeliverableStatus.APPROVED_BY_CLIENT && (
                  <div className="text-emerald-600 font-bold text-xs flex items-center gap-1 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-lg">
                    ✔ هذا المخرج معتمد وحالة الخدمة مغلقة ومحسوبة بالباقة
                  </div>
                )}
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
