/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { FileAsset, Deliverable } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { X, FileText, Download, Calendar, Tag, ShieldAlert, Link, MessageSquare } from "lucide-react";

interface FileDrawerProps {
  file: FileAsset | null;
  onClose: () => void;
  onUpdateFile: (file: FileAsset) => void;
  deliverables: Deliverable[];
}

export const FileDrawer: React.FC<FileDrawerProps> = ({
  file,
  onClose,
  onUpdateFile,
  deliverables
}) => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<string[]>([
    "تم التحقق من جودة أبعاد هذا الملف ومطابقته لكود العلامة التجارية.",
    "الرجاء تنزيل النسخة عالية الجودة واستخدامها مباشرة في النشر."
  ]);

  // Load comments if present or reset when file changes
  useEffect(() => {
    if (file) {
      setComments([
        "تم التحقق من جودة أبعاد هذا الملف ومطابقته لكود العلامة التجارية.",
        "الرجاء تنزيل النسخة عالية الجودة واستخدامها مباشرة في النشر."
      ]);
    }
  }, [file]);

  if (!file) return null;

  // Find linked deliverable from parent store
  const linkedDeliverable = file.linkedDeliverableId
    ? deliverables.find(d => d.id === file.linkedDeliverableId) || null
    : null;

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const newComments = [...comments, commentText.trim()];
    setComments(newComments);
    setCommentText("");
    
    // Simulate updating file asset logs or flags in parent
    onUpdateFile({
      ...file,
      commentsCount: (file.commentsCount || 0) + 1
    });
  };

  return (
    <AnimatePresence>
      {file && (
        <>
          {/* Backdrop Clicker Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-45"
          />

          {/* Drawer Body Column */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col h-full text-slate-800 text-right font-sans"
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <button
                onClick={onClose}
                className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="font-bold text-slate-900 text-base">تفاصيل الملف والمستند</h3>
            </div>

            {/* Scrollable container with core contents */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              
              {/* Thumbnail Display Visual */}
              <div className="bg-slate-950 p-6 rounded-2xl flex flex-col items-center justify-center text-center text-white border border-slate-800 shadow-sm relative overflow-hidden min-h-[160px]">
                <div className="w-14 h-14 bg-indigo-500/10 text-primary-500 rounded-2xl flex items-center justify-center font-extrabold text-2xl uppercase mb-3 border border-indigo-500/20">
                  {file.type}
                </div>
                <h4 className="font-extrabold text-xs w-full truncate px-4">{file.name}</h4>
                <p className="text-[10px] text-slate-400 mt-1">{file.size} • تنسيق {file.type}</p>
                
                <div className="absolute w-28 h-28 bg-indigo-500/15 rounded-full blur-2xl -bottom-10 -right-10 pointer-events-none" />
              </div>

              {/* File Specs metadata info card */}
              <div className="space-y-3">
                <h5 className="font-extrabold text-[13px] text-slate-900 border-r-3 border-indigo-500 pr-2">معلومات الملف الذكية</h5>
                <div className="grid grid-cols-2 gap-3.5 text-xs text-slate-650 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-slate-400 block font-semibold mb-0.5">تاريخ الرفع</span>
                    <span className="font-bold text-slate-705 flex items-center gap-1 justify-end">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {file.uploadedAt}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold mb-0.5">تصنيف المجلد</span>
                    <span className="font-bold text-slate-705 flex items-center gap-1 justify-end">
                      <Tag className="w-3.5 h-3.5 text-indigo-500" />
                      {file.category}
                    </span>
                  </div>
                  <div className="col-span-2 border-t pt-2 mt-1">
                    <span className="text-slate-400 block font-semibold mb-0.5">بواسطة</span>
                    <span className="font-bold text-slate-800">{file.uploaderName}</span>
                    <span className="text-[10px] text-slate-400 font-semibold block">{file.uploaderRole}</span>
                  </div>
                </div>
              </div>

              {/* Linked Deliverable info card */}
              {linkedDeliverable && (
                <div className="space-y-2.5">
                  <h5 className="font-extrabold text-[13px] text-slate-900 border-r-3 border-indigo-500 pr-2">المخرج التسويقي المرتبط</h5>
                  <div className="p-3.5 rounded-xl border border-indigo-50 bg-indigo-50/20 flex gap-3 items-start hover:border-indigo-100 transition-colors">
                    <Link className="w-4 h-4 text-indigo-550 shrink-0 mt-0.5" />
                    <div>
                      <h6 className="font-bold text-xs text-slate-800">{linkedDeliverable.title}</h6>
                      <p className="text-[10px] text-slate-450 mt-1">
                        الباقة: {linkedDeliverable.type} | النشر: {linkedDeliverable.dueDate}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* File Auditing comment logs and form */}
              <div className="space-y-3">
                <h5 className="font-extrabold text-[13px] text-slate-900 border-r-3 border-indigo-500 pr-2 flex items-center gap-1.5 justify-end">
                  <MessageSquare className="w-4 h-4 text-indigo-500" />
                  نقاش الفحص والتدقيق
                </h5>
                
                <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                  {comments.map((comm, idx) => (
                    <div key={idx} className="bg-slate-50 p-2.5 rounded-lg border text-xs text-slate-700 leading-relaxed font-sans">
                      <p className="font-extrabold text-[9px] text-slate-400 pb-0.5 mb-1 border-b border-slate-200">ملاحظة التدقيق والفحص</p>
                      {comm}
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddComment} className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-3 rounded-lg flex items-center justify-center transition-colors shrink-0"
                  >
                    أضف
                  </button>
                  <input
                    type="text"
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    placeholder="اكتب ملاحظة تخص هذا الملف..."
                    className="w-full text-xs p-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-indigo-500 text-right leading-none font-sans"
                  />
                </form>
              </div>

            </div>

            {/* Direct Instant Action download button */}
            <div className="p-4 border-t border-slate-100 bg-slate-50">
              <button
                onClick={() => alert(`محاكاة لطلب تحميل وتنزيل الملف: ${file.name}`)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-transform hover:scale-102 shadow-sm"
              >
                <Download className="w-4 h-4" />
                تحميل المخرج بجودته الفائقة (Original HD)
              </button>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
