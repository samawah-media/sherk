/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Deliverable Type Enum
export enum DeliverableType {
  POST = "منشور",
  REEL = "Reel",
  STORY = "Story",
  REPORT = "تقرير",
  CONTENT_PLAN = "خطة محتوى",
  CAMPAIGN = "حملة إعلانية",
  DESIGN = "تصميم",
  VIDEO = "فيديو"
}

// Deliverable Status Enum
export enum DeliverableStatus {
  NOT_STARTED = "لم يبدأ",
  IN_PROGRESS = "قيد التنفيذ",
  READY_INTERNAL_REVIEW = "جاهز للمراجعة الداخلية",
  NEEDS_INTERNAL_REVISION = "يحتاج تعديل داخلي",
  APPROVED_INTERNALLY = "معتمد داخليًا",
  PENDING_CLIENT_APPROVAL = "بانتظار موافقة العميل",
  NEEDS_CLIENT_REVISION = "يحتاج تعديل من العميل",
  APPROVED_BY_CLIENT = "معتمد من العميل",
  DELIVERED = "تم التسليم"
}

// SLA Status Enum
export enum SlaStatus {
  ON_TIME = "في الوقت",
  RISK = "خطر",
  LATE = "متأخر",
  WAITING_CLIENT = "متوقف بانتظار العميل"
}

// User Role Enum for Top Switcher
export enum UserRole {
  CLIENT = "العميل",
  TEAM = "فريق العمل",
  ADMIN = "الإدارة"
}

// Client Organizations
export interface Organization {
  id: string;
  name: string;
  logo: string; // Tailwind icon or custom graphic
  sector: string;
  contractTitle: string;
  contractStatus: "نشط" | "منتهي" | "قيد المراجعة";
  startDate: string;
  endDate: string;
  billingSummary: {
    total: number;
    paid: number;
    remaining: number;
    nextInvoiceDate: string;
  };
  metrics: {
    agreed: number;
    completed: number;
    pendingApproval: number;
    remaining: number;
  };
}

// Team Member details
export interface TeamMember {
  id: string;
  name: string;
  title: string;
  role: "admin" | "worker";
  avatar: string; // Initial or color CSS
  tasksCount: number;
  lateTasksCount: number;
  rating: number; // Quality Score out of 100
  averageSlaDays: number;
}

// Client Approver details
export interface ClientApprover {
  id: string;
  name: string;
  title: string;
  permissions: string[]; // e.g. "اعتماد المنشورات", "طلب تعديل"
  photoUrl?: string;
}

// Internal Quality Checklist
export interface QualityItem {
  id: string;
  text: string;
  checked: boolean;
  required: boolean;
}

// Sub-task under a Deliverable
export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  assignedTo?: string; // TeamMember ID
}

// Comments
export interface Comment {
  id: string;
  authorName: string;
  authorAvatar: string;
  isInternal: boolean; // internal comments visible to Samawah team/admin only
  text: string;
  timestamp: string;
  authorRole: string;
}

// Files
export interface FileAsset {
  id: string;
  name: string;
  size: string;
  type: "JPG" | "PNG" | "PDF" | "MP4" | "XLS" | "PPT";
  category: "الصور" | "الفيديوهات" | "التقارير" | "العقود والفواتير" | "الهوية البصرية" | "مرفوعات العميل" | "الملفات المعتمدة";
  uploaderName: string;
  uploaderRole: string;
  uploadedAt: string;
  downloadUrl: string;
  linkedDeliverableId?: string;
  status: "مسودة" | "قيد المراجعة" | "معتمد" | "نهائي";
}

// Audit Logs
export interface AuditLog {
  id: string;
  deliverableId?: string;
  action: string;
  performedBy: string;
  userRole: string;
  timestamp: string;
  isInternalOnly: boolean;
}

// Main Deliverable structure
export interface Deliverable {
  id: string;
  orgId: string; // Client organization ID
  title: string;
  type: DeliverableType;
  status: DeliverableStatus;
  progress: number; // percentage generated from progress rules
  slaStatus: SlaStatus;
  slaDaysRemaining: number;
  slaResponsibility: "من فريق سماوة" | "من الإدارة" | "بانتظار العميل" | "بسبب ملفات ناقصة" | "لا يوجد تأخير";
  dueDate: string;
  startDate: string;
  internalReviewDueDate: string;
  clientApprovalDueDate: string;
  ownerId: string; // TeamMember ID
  collaboratorIds: string[]; // TeamMember IDs
  platforms?: string[]; // e.g. "انستغرام", "تيك توك", "سناب شات"
  previewUrl?: string; // Optional image representing thumbnail
  contentText?: string; // Marketing captions/copywriting
  subTasks: SubTask[];
  comments: Comment[];
  fileIds: string[];
  qualityChecklist: QualityItem[];
  priority: "عالية" | "متوسطة" | "منخفضة";
  auditLogs: AuditLog[];
}
