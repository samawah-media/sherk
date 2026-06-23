/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Organization,
  TeamMember,
  Deliverable,
  DeliverableType,
  DeliverableStatus,
  SlaStatus,
  FileAsset,
  ClientApprover,
  AuditLog
} from "./types";

// Dynamic status-to-progress helper
export function getStatusProgress(status: DeliverableStatus): number {
  switch (status) {
    case DeliverableStatus.NOT_STARTED:
      return 0;
    case DeliverableStatus.IN_PROGRESS:
      return 30;
    case DeliverableStatus.READY_INTERNAL_REVIEW:
      return 50;
    case DeliverableStatus.NEEDS_INTERNAL_REVISION:
      return 40;
    case DeliverableStatus.APPROVED_INTERNALLY:
      return 70;
    case DeliverableStatus.PENDING_CLIENT_APPROVAL:
      return 80;
    case DeliverableStatus.NEEDS_CLIENT_REVISION:
      return 75;
    case DeliverableStatus.APPROVED_BY_CLIENT:
      return 90;
    case DeliverableStatus.DELIVERED:
      return 100;
  }
}

// Global Team Members configuration
export const mockTeam: TeamMember[] = [
  {
    id: "team_1",
    name: "أحمد محمد",
    title: "مدير حساب",
    role: "admin",
    avatar: "أ م",
    tasksCount: 6,
    lateTasksCount: 0,
    rating: 98,
    averageSlaDays: 2.1
  },
  {
    id: "team_2",
    name: "سارة علي",
    title: "مصممة إبداعية",
    role: "worker",
    avatar: "س ع",
    tasksCount: 8,
    lateTasksCount: 1,
    rating: 94,
    averageSlaDays: 3.4
  },
  {
    id: "team_3",
    name: "محمد خالد",
    title: "كاتب محتوى تسويقي",
    role: "worker",
    avatar: "م خ",
    tasksCount: 5,
    lateTasksCount: 0,
    rating: 96,
    averageSlaDays: 1.8
  },
  {
    id: "team_4",
    name: "خالد إبراهيم",
    title: "محلل أداء رقمي",
    role: "worker",
    avatar: "خ إ",
    tasksCount: 4,
    lateTasksCount: 1,
    rating: 92,
    averageSlaDays: 4.2
  },
  {
    id: "team_5",
    name: "نورة فيصل",
    title: "أخصائية تسويق",
    role: "worker",
    avatar: "ن ف",
    tasksCount: 7,
    lateTasksCount: 2,
    rating: 89,
    averageSlaDays: 3.9
  },
  {
    id: "team_6",
    name: "راشد سالم",
    title: "مدير مشروع",
    role: "admin",
    avatar: "ر س",
    tasksCount: 3,
    lateTasksCount: 0,
    rating: 99,
    averageSlaDays: 1.5
  }
];

// Organizations
export const mockClients: Organization[] = [
  {
    id: "org_1",
    name: "شركة النخبة",
    sector: "قطاع التطوير العقاري الفاخر",
    logo: "🏢",
    contractTitle: "إدارة حسابات السوشيال ميديا وتطوير الهوية البصرية",
    contractStatus: "نشط",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    billingSummary: {
      total: 120000,
      paid: 60000,
      remaining: 60000,
      nextInvoiceDate: "2026-07-01"
    },
    metrics: {
      agreed: 42,
      completed: 24,
      pendingApproval: 12,
      remaining: 6
    }
  },
  {
    id: "org_2",
    name: "هداية",
    sector: "برامج المسؤولية المجتمعية وثقافة العطاء",
    logo: "🎁",
    contractTitle: "حملة كسوة عيد الأضحى وصناعة المحتوى الرقمي الموجه",
    contractStatus: "نشط",
    startDate: "2026-05-15",
    endDate: "2026-08-15",
    billingSummary: {
      total: 45000,
      paid: 30000,
      remaining: 15000,
      nextInvoiceDate: "2026-07-15"
    },
    metrics: {
      agreed: 35,
      completed: 18,
      pendingApproval: 10,
      remaining: 7
    }
  }
];

// Client Portal Approvers list
export const mockClientApprovers: Record<string, ClientApprover[]> = {
  org_1: [
    {
      id: "ca_1",
      name: "أحمد الميمان",
      title: "مدير التسويق بشركة النخبة",
      permissions: ["اعتماد المنشورات", "طلب تعديل", "عرض التقارير"]
    },
    {
      id: "ca_2",
      name: "سارة الجاسم",
      title: "الرئيس التنفيذي للعمليات",
      permissions: ["اعتماد التقارير", "طلب تعديل", "اعتماد نهائي فقط"]
    },
    {
      id: "ca_3",
      name: "خالد السديري",
      title: "مدير العلامة التجارية الفاخرة",
      permissions: ["اعتماد المنشورات", "طلب تعديل"]
    }
  ],
  org_2: [
    {
      id: "ca_4",
      name: "الشيخ عبد الله الساجد",
      title: "المشرف العام لهدايا العطاء",
      permissions: ["اعتماد المنشورات", "اعتماد التقارير", "اعتماد نهائي فقط"]
    },
    {
      id: "ca_5",
      name: "نورة المحيميد",
      title: "مديرة المبادرات والشراكات",
      permissions: ["طلب تعديل", "اعتماد المنشورات"]
    }
  ]
};

// Complete Mock Files
export const mockFiles: FileAsset[] = [
  // Org 1 Files
  {
    id: "file_101",
    name: "فلل_النخبة_الهوية_البصرية.pdf",
    size: "4.8 MB",
    type: "PDF",
    category: "الهوية البصرية",
    uploaderName: "سارة علي",
    uploaderRole: "مصممة إبداعية",
    uploadedAt: "2026-05-20",
    downloadUrl: "#",
    linkedDeliverableId: "del_1",
    status: "معتمد"
  },
  {
    id: "file_102",
    name: "روتين_صباحي_مجمع_الياسمين.mp4",
    size: "42 MB",
    type: "MP4",
    category: "الفيديوهات",
    uploaderName: "سارة علي",
    uploaderRole: "مصممة إبداعية",
    uploadedAt: "2026-06-12",
    downloadUrl: "#",
    linkedDeliverableId: "del_2",
    status: "قيد المراجعة"
  },
  {
    id: "file_103",
    name: "صورة_بوستر_عرض_الصيف_النهائي.png",
    size: "3.2 MB",
    type: "PNG",
    category: "الصور",
    uploaderName: "سارة علي",
    uploaderRole: "مصممة إبداعية",
    uploadedAt: "2026-06-14",
    downloadUrl: "#",
    linkedDeliverableId: "del_5",
    status: "نهائي"
  },
  {
    id: "file_104",
    name: "خطة_محتوى_النخبة_شهر_7.xls",
    size: "1.2 MB",
    type: "XLS",
    category: "التقارير",
    uploaderName: "نورة فيصل",
    uploaderRole: "أخصائية تسويق",
    uploadedAt: "2026-06-10",
    downloadUrl: "#",
    linkedDeliverableId: "del_3",
    status: "معتمد"
  },
  {
    id: "file_105",
    name: "تقرير_رصد_أداء_إعلانات_مايو_النخبة.pdf",
    size: "2.4 MB",
    type: "PDF",
    category: "التقارير",
    uploaderName: "خالد إبراهيم",
    uploaderRole: "محلل أداء رقمي",
    uploadedAt: "2026-06-02",
    downloadUrl: "#",
    linkedDeliverableId: "del_4",
    status: "نهائي"
  },
  {
    id: "file_106",
    name: "صور_موقع_مجمع_الياسمين_بعد_الفرش.zip",
    size: "185 MB",
    type: "JPG",
    category: "مرفوعات العميل",
    uploaderName: "أحمد الميمان",
    uploaderRole: "العميل - مدير التسويق",
    uploadedAt: "2026-06-08",
    downloadUrl: "#",
    status: "معتمد"
  },
  // Org 2 Files
  {
    id: "file_201",
    name: "شعار_مبادرة_كسوة_العيد_مفرغ.png",
    size: "1.5 MB",
    type: "PNG",
    category: "الهوية البصرية",
    uploaderName: "سارة علي",
    uploaderRole: "مصممة إبداعية",
    uploadedAt: "2026-05-16",
    downloadUrl: "#",
    status: "نهائي"
  },
  {
    id: "file_202",
    name: "فيديو_خطوات_تغليف_هدايا_اليتيم.mp4",
    size: "68 MB",
    type: "MP4",
    category: "الفيديوهات",
    uploaderName: "سارة علي",
    uploaderRole: "مصممة إبداعية",
    uploadedAt: "2026-06-11",
    downloadUrl: "#",
    linkedDeliverableId: "del_15",
    status: "قيد المراجعة"
  },
  {
    id: "file_203",
    name: "تقرير_مؤشرات_الموسم_الأسبوع_3.pdf",
    size: "3.1 MB",
    type: "PDF",
    category: "التقارير",
    uploaderName: "خالد إبراهيم",
    uploaderRole: "محلل أداء رقمي",
    uploadedAt: "2026-06-13",
    downloadUrl: "#",
    linkedDeliverableId: "del_16",
    status: "مسودة"
  },
  {
    id: "file_204",
    name: "تصاميم_بوسترات_المساجد_توعية.pdf",
    size: "12.8 MB",
    type: "PDF",
    category: "الملفات المعتمدة",
    uploaderName: "راشد سالم",
    uploaderRole: "مدير مشروع",
    uploadedAt: "2026-06-05",
    downloadUrl: "#",
    status: "نهائي"
  }
];

// Rich, complex 25 Deliverables set
export const mockDeliverables: Deliverable[] = [
  // ==================== شركة النخبة (org_1) - 13 Deliverables ====================
  {
    id: "del_1",
    orgId: "org_1",
    title: "منتج جديد للعناية بالبشرة وباقة الفلل الطبية",
    type: DeliverableType.POST,
    status: DeliverableStatus.READY_INTERNAL_REVIEW,
    progress: 50,
    slaStatus: SlaStatus.ON_TIME,
    slaDaysRemaining: 2,
    slaResponsibility: "من فريق سماوة",
    dueDate: "2026-06-18",
    startDate: "2026-06-13",
    internalReviewDueDate: "2026-06-15",
    clientApprovalDueDate: "2026-06-17",
    ownerId: "team_3", // كاتب محتوى
    collaboratorIds: ["team_2"], // المصممة
    platforms: ["Instagram", "Threads"],
    previewUrl: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600&auto=format&fit=crop",
    contentText: "#عناية_طبيعية ببشرة صحية وجميدة ✨\nنطلق اليوم في مجمع النخبة باقة العناية بالبشرة بالتعاون مع أرقى الأخصائيين المعتمدين والمعدات الحصرية سويسرية الصنع لخدمتكم يومياً.",
    subTasks: [
      { id: "st_1", title: "كتابة المسودة الأولى للنص التسويقي", completed: true, assignedTo: "team_3" },
      { id: "st_2", title: "تصميم العينة ثلاثية الأبعاد", completed: true, assignedTo: "team_2" },
      { id: "st_3", title: "التدقيق اللغوي وصياغة الهشتاجات", completed: false, assignedTo: "team_3" }
    ],
    qualityChecklist: [
      { id: "q_1", text: "النص خالٍ تماماً من الأخطاء اللغوية والإملائية", checked: true, required: true },
      { id: "q_2", text: "التصميم يطابق دليل الهوية البصرية والمساحات السلبية المعتمدة للنخبة", checked: true, required: true },
      { id: "q_3", text: "الأبعاد مناسبة لمقاسات إنستقرام الرسمية 4:5", checked: true, required: true },
      { id: "q_4", text: "الرسالة البيعية واضحة بوجود حافز على الفعل (CTA)", checked: false, required: true }
    ],
    comments: [
      {
        id: "c_1",
        authorName: "أحمد محمد",
        authorAvatar: "أ م",
        isInternal: true,
        text: "يرجى تعديل درجة لون الخلفية إلى اللون البنفسجي الفاخر لإبراز الهوية العقارية أكثر والابتعاد عن درجات البيج الدافئ.",
        timestamp: "2026-06-14T09:12:00Z",
        authorRole: "مدير حساب"
      },
      {
        id: "c_2",
        authorName: "سارة علي",
        authorAvatar: "س ع",
        isInternal: true,
        text: "عدلتها الآن يا أحمد يرجى مراجعة اللون الجديد في المعاينة ومقارنته بـ Hex Code المعتمد لهوية النخبة.",
        timestamp: "2026-06-14T11:45:00Z",
        authorRole: "مصممة إبداعية"
      }
    ],
    fileIds: ["file_101"],
    priority: "عالية",
    auditLogs: [
      { id: "a_1", action: "إنشاء المخرج وربطه بالجدول الزمني", performedBy: "راشد سالم", userRole: "مدير مشروع", timestamp: "2026-06-13T08:00:00Z", isInternalOnly: false },
      { id: "a_2", action: "رفع النسخة الإبداعية الأولى والمسودة رقم 1", performedBy: "سارة علي", userRole: "مصممة إبداعية", timestamp: "2026-06-14T11:40:00Z", isInternalOnly: true }
    ]
  },
  {
    id: "del_2",
    orgId: "org_1",
    title: "تغطية مجمع الياسمين الفاخر وروتين الصباح",
    type: DeliverableType.REEL,
    status: DeliverableStatus.PENDING_CLIENT_APPROVAL,
    progress: 80,
    slaStatus: SlaStatus.ON_TIME,
    slaDaysRemaining: 5,
    slaResponsibility: "بانتظار العميل",
    dueDate: "2026-06-20",
    startDate: "2026-06-11",
    internalReviewDueDate: "2026-06-13",
    clientApprovalDueDate: "2026-06-18",
    ownerId: "team_2", // مصممة (المونتاج)
    collaboratorIds: ["team_3", "team_5"],
    platforms: ["Instagram Reels", "TikTok"],
    previewUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop",
    contentText: "ابتسامة دافئة وقهوة هادئة تفصلك عن ضجيج العالم الخارجي.. مرحبًا بك في روتينك الصباحي الجديد هنا في مجمع الياسمين السكني ☕🌿",
    subTasks: [
      { id: "st_4", title: "كتابة سيناريو الـ Reel والفكره الأساسية", completed: true, assignedTo: "team_3" },
      { id: "st_5", title: "تصوير المقاطع السكنية والمناطق الخضراء بمجمع الياسمين", completed: true, assignedTo: "team_5" },
      { id: "st_6", title: "المونتاج وإضافة الموسيقى الهادئة ومؤثرات الانتقال", completed: true, assignedTo: "team_2" },
      { id: "st_7", title: "حصول المخرج على الموافقة الإدارية الداخلية بـ 5 صفقات متكاملة", completed: true, assignedTo: "team_1" }
    ],
    qualityChecklist: [
      { id: "q_5", text: "جودة الفيديو لا تقل عن 1080p بمعدل 60 إطاراً في الثانية", checked: true, required: true },
      { id: "q_6", text: "النص المتحدث به يلتزم بالأسلوب العقاري الشاعري الحصري", checked: true, required: true },
      { id: "q_7", text: "الموسيقى المستخدمة خالية من حقوق الملكية وتناسب الطابع الراقي", checked: true, required: true }
    ],
    comments: [
      {
        id: "c_3",
        authorName: "أحمد الميمان",
        authorAvatar: "أ م",
        isInternal: false,
        text: "العمل رائع جداً واللقطات الجوية تأخذ العقل! حبذا لو تمت إضافة شعار شركتنا بحجم ميني بأسفل واجهة الفيديو اليسرى.",
        timestamp: "2026-06-15T07:22:00Z",
        authorRole: "العميل - مدير التسويق"
      },
      {
        id: "c_4",
        authorName: "أحمد محمد",
        authorAvatar: "أ م",
        isInternal: true,
        text: "تذكرة للفريق: العميل طلب تعديل طفيف بإضافة الشعار الصغير. سارة من فضلك أضيفي اللمسة الأخيرة اليوم لإغلاق المخرج.",
        timestamp: "2026-06-15T08:10:00Z",
        authorRole: "مدير حساب"
      }
    ],
    fileIds: ["file_102"],
    priority: "عالية",
    auditLogs: [
      { id: "a_3", action: "رفع الفيديو الممنتج والموافقة عليه داخلياً", performedBy: "أحمد محمد", userRole: "مدير حساب", timestamp: "2026-06-14T17:00:00Z", isInternalOnly: false },
      { id: "a_4", action: "إرسال رابط المعاينة لبوابة العميل لاعتمادها نهائياً", performedBy: "راشد سالم", userRole: "مدير مشروع", timestamp: "2026-06-14T18:30:00Z", isInternalOnly: false }
    ]
  },
  {
    id: "del_3",
    orgId: "org_1",
    title: "خطة المحتوى الرقمي الموجه - شهر يوليو 2026",
    type: DeliverableType.CONTENT_PLAN,
    status: DeliverableStatus.APPROVED_BY_CLIENT,
    progress: 90,
    slaStatus: SlaStatus.ON_TIME,
    slaDaysRemaining: 15,
    slaResponsibility: "لا يوجد تأخير",
    dueDate: "2026-06-25",
    startDate: "2026-06-05",
    internalReviewDueDate: "2026-06-12",
    clientApprovalDueDate: "2026-06-15",
    ownerId: "team_5", // أخصائية تسويق
    collaboratorIds: ["team_3", "team_1"],
    platforms: ["كل المنصات المعتمدة"],
    previewUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop",
    contentText: "خطة تسويق يوليو لعام 2026: ترتكز بشكل أساسي على تصوير الفلل الجاهزة، شهادات ملاك النخبة الجدد، وحملات العقار المنافس.",
    subTasks: [
      { id: "st_8", title: "صياغة المحاور الرئيسية ومطابقة الجدولة مع الإجازات", completed: true, assignedTo: "team_5" },
      { id: "st_9", title: "وضع أفكار منشورات ريلز المتكررة وتوزيع المنصات", completed: true, assignedTo: "team_3" },
      { id: "st_10", title: "مراجعة فنية مع مدير الحساب واعتماد الخطة الاستراتيجية", completed: true, assignedTo: "team_1" }
    ],
    qualityChecklist: [
      { id: "q_8", text: "محتوى الخطة يغطي 30 يوماً متكاملة", checked: true, required: true },
      { id: "q_9", text: "تضمين أوقات النشر المقترحة مع تحليل الأوقات الذهبية للنشاط", checked: true, required: true }
    ],
    comments: [
      {
        id: "c_5",
        authorName: "سارة الجاسم",
        authorAvatar: "س ج",
        isInternal: false,
        text: "معتمدة تماماً! شكراً لجهودكم في سماوة على دقة التوزيع وربط المحاور بالمناسبات المحلية بشكل ذكي للغاية.",
        timestamp: "2026-06-15T06:15:00Z",
        authorRole: "العميل - الرئيس التنفيذي"
      }
    ],
    fileIds: ["file_104"],
    priority: "متوسطة",
    auditLogs: [
      { id: "a_5", action: "اعتماد كلي من العميل للخطة الشهرية وتأكيد البدء بالتجهيز", performedBy: "سارة الجاسم", userRole: "العميل", timestamp: "2026-06-15T06:15:00Z", isInternalOnly: false }
    ]
  },
  {
    id: "del_4",
    orgId: "org_1",
    title: "تقرير الأداء الرقمي وتحليل الحملات التسويقية - مايو 2026",
    type: DeliverableType.REPORT,
    status: DeliverableStatus.DELIVERED,
    progress: 100,
    slaStatus: SlaStatus.ON_TIME,
    slaDaysRemaining: 0,
    slaResponsibility: "لا يوجد تأخير",
    dueDate: "2026-06-05",
    startDate: "2026-05-28",
    internalReviewDueDate: "2026-06-01",
    clientApprovalDueDate: "2026-06-04",
    ownerId: "team_4", // محلل أداء
    collaboratorIds: ["team_6", "team_1"],
    platforms: ["Analytics Suite"],
    previewUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop",
    contentText: "التقرير الشهري الشامل لتقييم العائد على الاستثمار الإعلاني وحجم الاتصالات الواردة لأرقام مبيعات شركة النخبة العقارية لشهر مايو.",
    subTasks: [
      { id: "st_11", title: "تجميع أرقام الصرف والزيارات والتحويلات لكل حملة", completed: true, assignedTo: "team_4" },
      { id: "st_12", title: "تحليل كفاءة تكلفة الاستحواذ على العملاء (CAC) مقارنة بالعقود", completed: true, assignedTo: "team_4" },
      { id: "st_13", title: "تسليم التقرير وبث التوصيات العقارية للمرحلة القادمة", completed: true, assignedTo: "team_1" }
    ],
    qualityChecklist: [
      { id: "q_10", text: "أرقام الصرف مطابقة لحسابات ميتا وسناب شات الإعلانية بدقة", checked: true, required: true },
      { id: "q_11", text: "التوصيات لا تقل عن 5 نقاط تطبيقية تشغيلية", checked: true, required: true }
    ],
    comments: [],
    fileIds: ["file_105"],
    priority: "متوسطة",
    auditLogs: [
      { id: "a_6", action: "أرشفة التقرير وتسليم النسخة النهائية للعميل مدمجة بشرح المبيعات", performedBy: "أحمد محمد", userRole: "مدير حساب", timestamp: "2026-06-05T10:00:00Z", isInternalOnly: false }
    ]
  },
  {
    id: "del_5",
    orgId: "org_1",
    title: "حملة الصيف العقارية للتملك الميسر",
    type: DeliverableType.CAMPAIGN,
    status: DeliverableStatus.NEEDS_CLIENT_REVISION,
    progress: 75,
    slaStatus: SlaStatus.RISK,
    slaDaysRemaining: 1,
    slaResponsibility: "بانتظار العميل",
    dueDate: "2026-06-16",
    startDate: "2026-06-01",
    internalReviewDueDate: "2026-06-08",
    clientApprovalDueDate: "2026-06-14",
    ownerId: "team_1", // مدير الحساب
    collaboratorIds: ["team_2", "team_3", "team_5"],
    platforms: ["Snapchat Ads", "Google Search", "Meta Ads"],
    previewUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&auto=format&fit=crop",
    contentText: "العرض الجديد لتملك أحدث فلل النخبة في الرياض وجدة بهامش ربح تمويلي مرن يبدأ من 1.99% سنويًا بالتعاون مع كبرى المصارف الشريكة 🏘️💳",
    subTasks: [
      { id: "st_14", title: "صياغة المادة الإعلانية والبروشور الدعائي للحملة", completed: true, assignedTo: "team_3" },
      { id: "st_15", title: "تحديد معايير استهداف كبار المستثمرين والمهتمين بالمرتبة الأولى", completed: true, assignedTo: "team_5" },
      { id: "st_16", title: "بناء البانرات الإعلانية ومقاسات شاشات العرض الكبيرة", completed: true, assignedTo: "team_2" },
      { id: "st_17", title: "اعتماد صيغة العقود مع الخبراء القانونيين", completed: false, assignedTo: "team_1" }
    ],
    qualityChecklist: [
      { id: "q_12", text: "استخدام صور حية حقيقية للفلل وليست تصاميم نمطية مكررة", checked: true, required: true },
      { id: "q_13", text: "بيان هامش الربح والشركاء بشكل مباشر بلا غموض تنظيمي لتفادي الرفض القانوني", checked: true, required: true }
    ],
    comments: [
      {
        id: "c_6",
        authorName: "خالد السديري",
        authorAvatar: "خ س",
        isInternal: false,
        text: "نحتاج تعديل قائمة البنوك المشاركة في البانر، حيث انسحب البنك السعودي الأول مؤقتًا من مبادرتنا، يرجى إزالة شعاره من التصميم حتى إشعار آخر.",
        timestamp: "2026-06-14T19:30:00Z",
        authorRole: "العميل - مدير العلامة التجارية"
      }
    ],
    fileIds: ["file_103"],
    priority: "عالية",
    auditLogs: [
      { id: "a_7", action: "طلب تعديل عاجل من طرف العميل لاستبعاد البنك المنسحب", performedBy: "خالد السديري", userRole: "العميل", timestamp: "2026-06-14T19:30:00Z", isInternalOnly: false }
    ]
  },
  {
    id: "del_6",
    orgId: "org_1",
    title: "منشور: قصة التأسيس والهوية المعمارية للنخبة",
    type: DeliverableType.POST,
    status: DeliverableStatus.NEEDS_INTERNAL_REVISION,
    progress: 40,
    slaStatus: SlaStatus.ON_TIME,
    slaDaysRemaining: 7,
    slaResponsibility: "من فريق سماوة",
    dueDate: "2026-06-22",
    startDate: "2026-06-10",
    internalReviewDueDate: "2026-06-16",
    clientApprovalDueDate: "2026-06-20",
    ownerId: "team_3",
    collaboratorIds: ["team_2"],
    platforms: ["LinkedIn", "X"],
    previewUrl: "https://images.unsplash.com/photo-1541976590-7139414bc5c6?w=600&auto=format&fit=crop",
    contentText: "نحن لا نبني جدراناً فقط.. نحن نوظف الإرث النجدي في تفاصيل العمران العصري لنحكي قصة جيل يطمح للأفضل 🏛️✨",
    subTasks: [
      { id: "st_18", title: "كتابة المقال التعريفي المستلهم من مذكرات المهندسين", completed: true, assignedTo: "team_3" },
      { id: "st_19", title: "استخراج الصور القديمة قبل الفرش ومطابقتها بالتصاميم الحديثة", completed: false, assignedTo: "team_2" }
    ],
    qualityChecklist: [
      { id: "q_14", text: "تناغم الظل والضوء في الفلتر المعتمد لصور الهوية", checked: false, required: true }
    ],
    comments: [
      {
        id: "c_7",
        authorName: "أحمد محمد",
        authorAvatar: "أ م",
        isInternal: true,
        text: "الصياغة ضعيفة قليلاً في مطلع المنشور، بحاجة لأن تكون أكثر تأثيراً وعاطفية لجذب العميل كجزء من الهوية الفخمة لشركة النخبة.",
        timestamp: "2026-06-15T01:00:00Z",
        authorRole: "مدير حساب"
      }
    ],
    fileIds: [],
    priority: "منخفضة",
    auditLogs: []
  },
  {
    id: "del_7",
    orgId: "org_1",
    title: "فيديو موشن جرافيك كدليل للاشتراك بنظام التملك",
    type: DeliverableType.VIDEO,
    status: DeliverableStatus.IN_PROGRESS,
    progress: 30,
    slaStatus: SlaStatus.ON_TIME,
    slaDaysRemaining: 12,
    slaResponsibility: "من فريق سماوة",
    dueDate: "2026-06-27",
    startDate: "2026-06-12",
    internalReviewDueDate: "2026-06-20",
    clientApprovalDueDate: "2026-06-24",
    ownerId: "team_2", // سارة (المصممة/موشن)
    collaboratorIds: ["team_3", "team_1"],
    platforms: ["YouTube", "Vimeo", "Web Portal"],
    previewUrl: "https://images.unsplash.com/photo-1626544827763-d516dce335e2?w=600&auto=format&fit=crop",
    contentText: "كيف تسجل وتستعرض خطط التمويل الحصرية لفلل النخبة السكنية والمنتجعات؟ شرح مبسط خطوة بخطوة بالصوت والصورة.",
    subTasks: [
      { id: "st_20", title: "تجهيز السكربت الصوتي والسيناريو الحركي", completed: true, assignedTo: "team_3" },
      { id: "st_21", title: "تسجيل المعلق الصوتي المحترف النبرة الهادئة المتحدثة باسم النخبة", completed: false, assignedTo: "team_1" },
      { id: "st_22", title: "تحريك العناصر وبناء النماذج البيانية المتحركة", completed: false, assignedTo: "team_2" }
    ],
    qualityChecklist: [
      { id: "q_15", text: "استخدام التعليق الصوتي المعتمد والموقع مع سماوة", checked: true, required: true },
      { id: "q_16", text: "خلفيات الموشن متناسقة تماماً مع ألوان الهوية العقارية", checked: false, required: true }
    ],
    comments: [],
    fileIds: [],
    priority: "متوسطة",
    auditLogs: []
  },
  {
    id: "del_8",
    orgId: "org_1",
    title: "مجموعة ستوريز: فعاليات وتغطية الافتتاح التجريبي للفلل الجديدة",
    type: DeliverableType.STORY,
    status: DeliverableStatus.NOT_STARTED,
    progress: 0,
    slaStatus: SlaStatus.ON_TIME,
    slaDaysRemaining: 14,
    slaResponsibility: "لا يوجد تأخير",
    dueDate: "2026-06-29",
    startDate: "2026-06-15",
    internalReviewDueDate: "2026-06-25",
    clientApprovalDueDate: "2026-06-28",
    ownerId: "team_5", // أخصائية تسويق
    collaboratorIds: ["team_2"],
    platforms: ["Instagram Story", "Snapchat Story"],
    previewUrl: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=600&auto=format&fit=crop",
    contentText: "استعدوا معنا اليوم لنأخذكم بجولة فريدة ومباشرة عبر حساب النخبة لافتتاح الفلل النموذجية، بوابتنا مفتوحة لاستقبالكم 🥂✨",
    subTasks: [
      { id: "st_23", title: "إعداد الاستفتاءات التفاعلية والعد التنازلي المسبق", completed: false, assignedTo: "team_5" },
      { id: "st_24", title: "تصميم قوالب الأسئلة والأجوبة العقارية المصاحبة", completed: false, assignedTo: "team_2" }
    ],
    qualityChecklist: [],
    comments: [],
    fileIds: [],
    priority: "منخفضة",
    auditLogs: []
  },
  // Additional items to hit 25 deliverables (9, 10, 11, 12, 13 for Org 1)
  {
    id: "del_9",
    orgId: "org_1",
    title: "منشور: نصائح عقارية وقانونية لتملك العقار المناسب",
    type: DeliverableType.POST,
    status: DeliverableStatus.APPROVED_INTERNALLY,
    progress: 70,
    slaStatus: SlaStatus.ON_TIME,
    slaDaysRemaining: 4,
    slaResponsibility: "من فريق سماوة",
    dueDate: "2026-06-19",
    startDate: "2026-06-14",
    internalReviewDueDate: "2026-06-16",
    clientApprovalDueDate: "2026-06-18",
    ownerId: "team_3",
    collaboratorIds: ["team_1"],
    platforms: ["X", "LinkedIn"],
    previewUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&auto=format&fit=crop",
    contentText: "نصائح قانونية تضمن استثمارك العقاري دون تعقيدات.. إليك أبرز 3 أمور يجب التأكد منها قبل توقيع العقد النهائي 📜⚖️",
    subTasks: [
      { id: "st_25", title: "مراجعة بنود المستشار القانوني للنخبة وترجمتها للغة تسويقية مبسطة", completed: true, assignedTo: "team_3" }
    ],
    qualityChecklist: [
      { id: "q_17", text: "النص موثق وقانوني بنسبة 100%", checked: true, required: true }
    ],
    comments: [],
    fileIds: [],
    priority: "منخفضة",
    auditLogs: []
  },
  {
    id: "del_10",
    orgId: "org_1",
    title: "تصميم: البوسترات الدعائية لتهنئة عيد الأضحى المبارك",
    type: DeliverableType.DESIGN,
    status: DeliverableStatus.DELIVERED,
    progress: 100,
    slaStatus: SlaStatus.ON_TIME,
    slaDaysRemaining: 0,
    slaResponsibility: "لا يوجد تأخير",
    dueDate: "2026-06-10",
    startDate: "2026-06-01",
    internalReviewDueDate: "2026-06-05",
    clientApprovalDueDate: "2026-06-08",
    ownerId: "team_2",
    collaboratorIds: ["team_3"],
    platforms: ["كل المنصات", "الموقع الإلكتروني"],
    previewUrl: "https://images.unsplash.com/photo-1543257580-7269da773bf5?w=600&auto=format&fit=crop",
    contentText: "شركة النخبة العقارية تهنئكم بحلول عيد الأضحى المبارك، كل عام وأنتم بخير وصحة وسلام 🕋💐",
    subTasks: [],
    qualityChecklist: [],
    comments: [],
    fileIds: [],
    priority: "متوسطة",
    auditLogs: []
  },
  {
    id: "del_11",
    orgId: "org_1",
    title: "Reel: ماذا يقول عملاء النخبة الجدد؟ شهادات مصورة",
    type: DeliverableType.REEL,
    status: DeliverableStatus.IN_PROGRESS,
    progress: 30,
    slaStatus: SlaStatus.LATE,
    slaDaysRemaining: -2,
    slaResponsibility: "من فريق سماوة",
    dueDate: "2026-06-13",
    startDate: "2026-06-04",
    internalReviewDueDate: "2026-06-08",
    clientApprovalDueDate: "2026-06-11",
    ownerId: "team_5", // أخصائية تسويق (التنسيق مع العملاء)
    collaboratorIds: ["team_2", "team_1"],
    platforms: ["Instagram Reels"],
    previewUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop",
    contentText: "شهادة رجل الأعمال الأستاذ غانم البدر حول تجربته الحية في تملك فيلا الدوبلكس الفاخرة بـ مجمع الياسمين وحياتهم اليومية الرائعة.",
    subTasks: [
      { id: "st_26", title: "تنسيق موعد التصوير الميداني مع السيد غانم البدر", completed: true, assignedTo: "team_5" },
      { id: "st_27", title: "زيارة الموقع والتصوير بالكاميرات الاحترافية", completed: false, assignedTo: "team_5" },
      { id: "st_28", title: "قص المقطع وسرعة المونتاج الصوتي والمرئي", completed: false, assignedTo: "team_2" }
    ],
    qualityChecklist: [
      { id: "q_18", text: "موافقة العميل خطياً على نشر الفيديو على منصات النخبة", checked: false, required: true }
    ],
    comments: [
      {
        id: "c_8",
        authorName: "راشد سالم",
        authorAvatar: "ر س",
        isInternal: true,
        text: "انتبهوا هذا المخرج دخل في حالة التأخير المتراكم (SLA LATE). نورة من فضلك عاجلي بالتصوير النهائي يوم غد الاثنين كحد أقصى لتجنب غرامات تأخر مخرجات العقد.",
        timestamp: "2026-06-14T20:00:00Z",
        authorRole: "مدير مشروع"
      }
    ],
    fileIds: [],
    priority: "عالية",
    auditLogs: []
  },
  {
    id: "del_12",
    orgId: "org_1",
    title: "تقرير: رصد وتحليل سمعة العلامة التجارية وتفاعل المنافسين",
    type: DeliverableType.REPORT,
    status: DeliverableStatus.NOT_STARTED,
    progress: 0,
    slaStatus: SlaStatus.ON_TIME,
    slaDaysRemaining: 18,
    slaResponsibility: "لا يوجد تأخير",
    dueDate: "2026-07-03",
    startDate: "2026-06-15",
    internalReviewDueDate: "2026-06-25",
    clientApprovalDueDate: "2026-06-30",
    ownerId: "team_4",
    collaboratorIds: ["team_1"],
    platforms: ["Social Listening Software"],
    previewUrl: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&auto=format&fit=crop",
    contentText: "دراسة استقصائية لمستوى وعي الجمهور وفهم القيمة المقترحة لشركة النخبة من وجهة نظر المشترين في شمال الرياض.",
    subTasks: [],
    qualityChecklist: [],
    comments: [],
    fileIds: [],
    priority: "منخفضة",
    auditLogs: []
  },
  {
    id: "del_13",
    orgId: "org_1",
    title: "تصميم: بطاقات الدعوى لكبار الشخصيات لزيارة واحة النخبة",
    type: DeliverableType.DESIGN,
    status: DeliverableStatus.DELIVERED,
    progress: 100,
    slaStatus: SlaStatus.ON_TIME,
    slaDaysRemaining: 0,
    slaResponsibility: "لا يوجد تأخير",
    dueDate: "2026-06-08",
    startDate: "2026-06-01",
    internalReviewDueDate: "2026-06-04",
    clientApprovalDueDate: "2026-06-07",
    ownerId: "team_2",
    collaboratorIds: ["team_3"],
    platforms: ["مطبوعات ورقية فاخرة"],
    previewUrl: "https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?w=600&auto=format&fit=crop",
    contentText: "يسرنا في شركة النخبة دعوتكم لحضور الأمسية الفاخرة للاطلاع على مجسمات الخياطة والاستثمار الفريد من نوعه.",
    subTasks: [],
    qualityChecklist: [],
    comments: [],
    fileIds: [],
    priority: "متوسطة",
    auditLogs: []
  },

  // ==================== هداية (org_2) - 12 Deliverables ====================
  {
    id: "del_14",
    orgId: "org_2",
    title: "منشور: قيمة العطاء المستدام وأثر الكلمة الطيبة",
    type: DeliverableType.POST,
    status: DeliverableStatus.PENDING_CLIENT_APPROVAL,
    progress: 80,
    slaStatus: SlaStatus.ON_TIME,
    slaDaysRemaining: 3,
    slaResponsibility: "بانتظار العميل",
    dueDate: "2026-06-18",
    startDate: "2026-06-12",
    internalReviewDueDate: "2026-06-14",
    clientApprovalDueDate: "2026-06-17",
    ownerId: "team_3", // كاتب محتوى
    collaboratorIds: ["team_2"],
    platforms: ["Twitter (X)", "Facebook"],
    previewUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop",
    contentText: "صدقتك هي ظلّك يوم القيامة، وبها تنير دروباً أظلمها الاحتياج.. ساهم معنا في هداية بإدخال السرور على قلوب الأسر المتعففة 🌸🎁",
    subTasks: [
      { id: "st_29", title: "صياغة المادة الشرعية والتسويقية المناسبة للمجتمع العربي المحب للخير", completed: true, assignedTo: "team_3" },
      { id: "st_30", title: "تصميم غلاف رمزي باللون الأخضر المميز لجمعية هداية", completed: true, assignedTo: "team_2" }
    ],
    qualityChecklist: [
      { id: "q_19", text: "تضمين الآيات الكريمة والأحاديث بخط وتدقيق معتمد شرعياً وموثق", checked: true, required: true },
      { id: "q_20", text: "أبعاد البانر مخصصة ومحسنة لموقع إكس تويتر بنسبة 16:9", checked: true, required: true }
    ],
    comments: [
      {
        id: "c_9",
        authorName: "نورة المحيميد",
        authorAvatar: "ن م",
        isInternal: false,
        text: "صياغة تلمس الحواس وتحرك الوجدان، لكن نتمنى تعديل كلمة 'صدقتك' العريضة إلى 'مكرمتك الكريمة' لتكون متناغمة مع توجه مبادرة هذا العام.",
        timestamp: "2026-06-14T14:20:00Z",
        authorRole: "العميل - مديرة الشراكات"
      }
    ],
    fileIds: [],
    priority: "عالية",
    auditLogs: []
  },
  {
    id: "del_15",
    orgId: "org_2",
    title: "فيديو: خطوات التغليف الإبداعي بحب لكسوة العيد",
    type: DeliverableType.REEL,
    status: DeliverableStatus.READY_INTERNAL_REVIEW,
    progress: 50,
    slaStatus: SlaStatus.ON_TIME,
    slaDaysRemaining: 4,
    slaResponsibility: "من فريق سماوة",
    dueDate: "2026-06-19",
    startDate: "2026-06-10",
    internalReviewDueDate: "2026-06-14",
    clientApprovalDueDate: "2026-06-17",
    ownerId: "team_2", // سارة المصممة
    collaboratorIds: ["team_5"],
    platforms: ["Instagram Reels", "Snapchat Spotlight"],
    previewUrl: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop",
    contentText: "لأننا نوصل هديتكم بمستواكم.. هكذا يسهر متطوعو هداية في تفصيل وكي وتغليف ثياب العيد للأطفال الأيتام لنزرع البسمة كما يجب 🧸💗",
    subTasks: [
      { id: "st_31", title: "كتابة الـ Hook وسكربت الشرح المرئي السريع", completed: true, assignedTo: "team_3" },
      { id: "st_32", title: "تصوير الخطوات الميدانية بمقر الجمعية ببريدة", completed: true, assignedTo: "team_5" },
      { id: "st_33", title: "المونتاج وإضافة الموسيقى الإيقاعية الحماسية والجميلة", completed: true, assignedTo: "team_2" }
    ],
    qualityChecklist: [
      { id: "q_21", text: "الألوان زاهية وتدعو للبهجة والفرح", checked: true, required: true },
      { id: "q_22", text: "الشعار يظهر في مطلع الفيديو ونهايته بوضوح تام", checked: false, required: true }
    ],
    comments: [
      {
        id: "c_10",
        authorName: "خالد إبراهيم",
        authorAvatar: "خ إ",
        isInternal: true,
        text: "الفيديو يتميز بإيقاع ممتاز جداً، سارة تأكدي من حفظ الفيديو وتسميته بالرمز الرسمي للمشروع لتسهيل الفهرسة قبل إرساله للمدير.",
        timestamp: "2026-06-14T22:30:00Z",
        authorRole: "محلل أداء"
      }
    ],
    fileIds: ["file_202"],
    priority: "متوسطة",
    auditLogs: []
  },
  {
    id: "del_16",
    orgId: "org_2",
    title: "تقرير: إحصائيات موسم العطاء والنمو الاجتماعي",
    type: DeliverableType.REPORT,
    status: DeliverableStatus.IN_PROGRESS,
    progress: 30,
    slaStatus: SlaStatus.RISK,
    slaDaysRemaining: 1,
    slaResponsibility: "من فريق سماوة",
    dueDate: "2026-06-16",
    startDate: "2026-06-08",
    internalReviewDueDate: "2026-06-12",
    clientApprovalDueDate: "2026-06-14",
    ownerId: "team_4", // محلل الأداء
    collaboratorIds: ["team_6"],
    platforms: ["Google Sheets", "PDF Deck"],
    previewUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop",
    contentText: "تقرير يعكس حجم المستفيدين الفعليين وقنوات الدعم الأكثر وصولاً للمتبرعين لحملة كسوة عيد الأضحى المبارك لجمعية هداية.",
    subTasks: [
      { id: "st_34", title: "سحب إحصائيات بوابات الدفع الإلكترونية وربط رمز الإحالة", completed: true, assignedTo: "team_4" },
      { id: "st_35", title: "رسم الرسومات البيانية لبيان أداء المؤثرين", completed: false, assignedTo: "team_4" }
    ],
    qualityChecklist: [],
    comments: [],
    fileIds: ["file_203"],
    priority: "عالية",
    auditLogs: []
  },
  {
    id: "del_17",
    orgId: "org_2",
    title: "الحملة الإعلانية المفتوحة: كفالة كسوة الأيتام السنوية",
    type: DeliverableType.CAMPAIGN,
    status: DeliverableStatus.APPROVED_INTERNALLY,
    progress: 70,
    slaStatus: SlaStatus.ON_TIME,
    slaDaysRemaining: 4,
    slaResponsibility: "من فريق سماوة",
    dueDate: "2026-06-19",
    startDate: "2026-06-05",
    internalReviewDueDate: "2026-06-12",
    clientApprovalDueDate: "2026-06-16",
    ownerId: "team_1",
    collaboratorIds: ["team_5", "team_2"],
    platforms: ["Snapchat", "Insta Ads"],
    previewUrl: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=600&auto=format&fit=crop",
    contentText: "بـ 150 ريالًا فقط.. تكفي يتيمًا بكسوة تليق بقدوم العيد وتصنع فرحته. ساهم الآن بكل يسر عبر متجر هداية الرسمي المعتمد 🧸🎁",
    subTasks: [],
    qualityChecklist: [],
    comments: [],
    fileIds: [],
    priority: "عالية",
    auditLogs: []
  },
  {
    id: "del_18",
    orgId: "org_2",
    title: "منشور: أثر العطاء في تماسك المجتمع وتخفيف كاهل الأسر",
    type: DeliverableType.POST,
    status: DeliverableStatus.DELIVERED,
    progress: 100,
    slaStatus: SlaStatus.ON_TIME,
    slaDaysRemaining: 0,
    slaResponsibility: "لا يوجد تأخير",
    dueDate: "2026-06-08",
    startDate: "2026-06-01",
    internalReviewDueDate: "2026-06-04",
    clientApprovalDueDate: "2026-06-07",
    ownerId: "team_3",
    collaboratorIds: ["team_2"],
    platforms: ["X"],
    previewUrl: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=600&auto=format&fit=crop",
    contentText: "عندما تساهم ميسرة هداية، لا تدفع عبئاً عن أسرة فقط.. بل تبني سداً اجتماعياً يحمي قلوباً طاهرة من الهموم والمحن.",
    subTasks: [],
    qualityChecklist: [],
    comments: [],
    fileIds: [],
    priority: "منخفضة",
    auditLogs: []
  },
  {
    id: "del_19",
    orgId: "org_2",
    title: "خطة المحتوى والتوعية التفاعلية لعشر ذي الحجة المباركة",
    type: DeliverableType.CONTENT_PLAN,
    status: DeliverableStatus.DELIVERED,
    progress: 100,
    slaStatus: SlaStatus.ON_TIME,
    slaDaysRemaining: 0,
    slaResponsibility: "لا يوجد تأخير",
    dueDate: "2026-06-05",
    startDate: "2026-05-15",
    internalReviewDueDate: "2026-05-25",
    clientApprovalDueDate: "2026-06-01",
    ownerId: "team_5",
    collaboratorIds: ["team_3"],
    platforms: ["جميع منصات النشر"],
    previewUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop",
    contentText: "جدول موضوعات العشر من ذي الحجة: أذكار، رسائل عطاء يومية، فضل صيام الوقف، وروايات نجاح المستفيدين من مواسم هداية السابقة.",
    subTasks: [],
    qualityChecklist: [],
    comments: [],
    fileIds: [],
    priority: "عالية",
    auditLogs: []
  },
  {
    id: "del_20",
    orgId: "org_2",
    title: "فيديو: فلوج توثيقي ممتع لنشاط توزيع الهدايا بمصل الأطفال",
    type: DeliverableType.VIDEO,
    status: DeliverableStatus.IN_PROGRESS,
    progress: 30,
    slaStatus: SlaStatus.ON_TIME,
    slaDaysRemaining: 8,
    slaResponsibility: "من فريق سماوة",
    dueDate: "2026-06-23",
    startDate: "2026-06-11",
    internalReviewDueDate: "2026-06-17",
    clientApprovalDueDate: "2026-06-21",
    ownerId: "team_5",
    collaboratorIds: ["team_2"],
    platforms: ["YouTube Shorts", "Snap Spotlight"],
    previewUrl: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&auto=format&fit=crop",
    contentText: "مقتطفات سريعة وبسيطة مليئة بالضحكات البريئة أثناء جولة المتطوعين بهدايا العيد بمستشفى الملك فيصل بالرياض.",
    subTasks: [],
    qualityChecklist: [],
    comments: [],
    fileIds: [],
    priority: "متوسطة",
    auditLogs: []
  },
  {
    id: "del_21",
    orgId: "org_2",
    title: "مجموعة ستوريز: العد التنازلي لإطلاق حجز الأضاحي بهدايا العطاء",
    type: DeliverableType.STORY,
    status: DeliverableStatus.NOT_STARTED,
    progress: 0,
    slaStatus: SlaStatus.ON_TIME,
    slaDaysRemaining: 10,
    slaResponsibility: "لا يوجد تأخير",
    dueDate: "2026-06-25",
    startDate: "2026-06-14",
    internalReviewDueDate: "2026-06-18",
    clientApprovalDueDate: "2026-06-23",
    ownerId: "team_3",
    collaboratorIds: ["team_2"],
    platforms: ["Instagram Story", "WhatsApp Status"],
    previewUrl: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=600&auto=format&fit=crop",
    contentText: "تفصلنا ساعات قليلة عن فتح التسجيل لأضاحي عيد 1447هـ.. احجز أضحيتك وأنت آمن ومطمئن لتقديمها بجودة ومعيار طبي رفيع.",
    subTasks: [],
    qualityChecklist: [],
    comments: [],
    fileIds: [],
    priority: "متوسطة",
    auditLogs: []
  },
  {
    id: "del_22",
    orgId: "org_2",
    title: "تصميم: إنفوجرافيك السنن اليومية لعشر ذي الحجة",
    type: DeliverableType.DESIGN,
    status: DeliverableStatus.NEEDS_CLIENT_REVISION,
    progress: 75,
    slaStatus: SlaStatus.WAITING_CLIENT,
    slaDaysRemaining: 3,
    slaResponsibility: "بانتظار العميل",
    dueDate: "2026-06-18",
    startDate: "2026-06-10",
    internalReviewDueDate: "2026-06-14",
    clientApprovalDueDate: "2026-06-16",
    ownerId: "team_2",
    collaboratorIds: ["team_3"],
    platforms: ["Social Platforms", "Printable PDF"],
    previewUrl: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop",
    contentText: "تذكيرنا بالصالحات في خير الأيام.. السنن والتهليلات والأعمال المستحبة خلال عشر ذي الحجة المباركة بشكل مبسط ويسير للنشر.",
    subTasks: [],
    qualityChecklist: [],
    comments: [
      {
        id: "c_11",
        authorName: "الشيخ عبد الله الساجد",
        authorAvatar: "ع س",
        isInternal: false,
        text: "تصميم غاية في التميز، ولكن هناك خطأ إملائي بكلمة 'التكبير' كُتبت بالتاء المفتوحة بدلاً من التراص الفقهي الصحيح بالهمزة، يرجى تعديلها.",
        timestamp: "2026-06-14T11:00:00Z",
        authorRole: "العميل - المشرف العام"
      }
    ],
    fileIds: [],
    priority: "متوسطة",
    auditLogs: []
  },
  {
    id: "del_23",
    orgId: "org_2",
    title: "منشور: كيف تختار هديتك المناسبة بموسم العيد؟",
    type: DeliverableType.POST,
    status: DeliverableStatus.NOT_STARTED,
    progress: 0,
    slaStatus: SlaStatus.ON_TIME,
    slaDaysRemaining: 15,
    slaResponsibility: "لا يوجد تأخير",
    dueDate: "2026-06-30",
    startDate: "2026-06-15",
    internalReviewDueDate: "2026-06-24",
    clientApprovalDueDate: "2026-06-27",
    ownerId: "team_3",
    collaboratorIds: ["team_5"],
    platforms: ["Instagram", "Pinterest"],
    previewUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop",
    contentText: "ثلاث خطوات ذهبية ومحاور مهمة تساعدك في اختيار الهدية الأجمل لأحبائك دون القلق من الميزانية أو حيرة الاختيار.",
    subTasks: [],
    qualityChecklist: [],
    comments: [],
    fileIds: [],
    priority: "منخفضة",
    auditLogs: []
  },
  {
    id: "del_24",
    orgId: "org_2",
    title: "تقرير: رصد وتحليل كفالة الأضاحي ومستويات إقبال الأسر",
    type: DeliverableType.REPORT,
    status: DeliverableStatus.DELIVERED,
    progress: 100,
    slaStatus: SlaStatus.ON_TIME,
    slaDaysRemaining: 0,
    slaResponsibility: "لا يوجد تأخير",
    dueDate: "2026-06-09",
    startDate: "2026-05-25",
    internalReviewDueDate: "2026-06-03",
    clientApprovalDueDate: "2026-06-07",
    ownerId: "team_4",
    collaboratorIds: ["team_6"],
    platforms: ["Dashboard Portal"],
    previewUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop",
    contentText: "تقرير مرجعي يغطي حجم وتوزيع مستفيدي برامج العطاء لعام 2025/1446 وتجهيز الخرائط الاسترشادية للمواقع الأكثر احتياجاً.",
    subTasks: [],
    qualityChecklist: [],
    comments: [],
    fileIds: ["file_204"],
    priority: "متوسطة",
    auditLogs: []
  },
  {
    id: "del_25",
    orgId: "org_2",
    title: "منشور: حساب العودة للمقاعد الدراسية وتأمين المبادرة",
    type: DeliverableType.POST,
    status: DeliverableStatus.READY_INTERNAL_REVIEW,
    progress: 50,
    slaStatus: SlaStatus.ON_TIME,
    slaDaysRemaining: 5,
    slaResponsibility: "من فريق سماوة",
    dueDate: "2026-06-20",
    startDate: "2026-06-14",
    internalReviewDueDate: "2026-06-16",
    clientApprovalDueDate: "2026-06-18",
    ownerId: "team_3",
    collaboratorIds: ["team_2"],
    platforms: ["X", "LinkedIn"],
    previewUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop",
    contentText: "نجهز حقيبتهم اليوم المدروسة لتكون معبأة بالعلم والمستقبل المشرق.. ساهموا بتوفير حقيبة متكاملة لكل طفل يتيم 🎒✏️",
    subTasks: [],
    qualityChecklist: [],
    comments: [],
    fileIds: [],
    priority: "متوسطة",
    auditLogs: []
  }
];

// Rich Activities set feed
export interface Activity {
  id: string;
  authorName: string;
  authorAvatar: string;
  role: string;
  action: string;
  targetName: string;
  timestamp: string;
  orgId: string;
  isInternal: boolean;
}

export const mockActivities: Activity[] = [
  {
    id: "act_1",
    authorName: "أحمد الميمان",
    authorAvatar: "أ م",
    role: "العميل",
    action: "طلب تعديل على مخرج",
    targetName: "حملة الصيف العقارية للتملك الميسر",
    timestamp: "منذ ساعتين",
    orgId: "org_1",
    isInternal: false
  },
  {
    id: "act_2",
    authorName: "سارة علي",
    authorAvatar: "س ع",
    role: "المصممة",
    action: "رفعت نسخة تصميم جديدة مسودة نهائية لـ",
    targetName: "فيديو: خطوات التغليف الإبداعي بحب لكسوة العيد",
    timestamp: "منذ 4 ساعات",
    orgId: "org_2",
    isInternal: true
  },
  {
    id: "act_3",
    authorName: "أحمد محمد",
    authorAvatar: "أ م",
    role: "مدير حساب",
    action: "اعتمد المخرج داخلياً وأرسله للعميل",
    targetName: "تغطية مجمع الياسمين الفاخر وروتين الصباح",
    timestamp: "منذ 6 ساعات",
    orgId: "org_1",
    isInternal: false
  },
  {
    id: "act_4",
    authorName: "سارة الجاسم",
    authorAvatar: "س ج",
    role: "العميل",
    action: "اعتمدت بالكامل مخرجات",
    targetName: "خطة المحتوى الرقمي الموجه - شهر يوليو 2026",
    timestamp: "منذ يوم ونصف",
    orgId: "org_1",
    isInternal: false
  },
  {
    id: "act_5",
    authorName: "خالد إبراهيم",
    authorAvatar: "خ إ",
    role: "محلل أداء",
    action: "رفع نسخة التقرير الشهري النهائي لـ",
    targetName: "تقرير الأداء الرقمي وتحليل الحملات التسويقية - مايو 2026",
    timestamp: "منذ يومين",
    orgId: "org_1",
    isInternal: false
  }
];
