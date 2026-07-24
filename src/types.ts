export type RoleGroup =
  | 'admin'                  // Mehmet Uğur (Mühendislik Yöneticisi)
  | 'electrical_design'      // Halil Kerçin, İlayda Karan
  | 'sales'                  // Osman, Oğuz, Egemen, Ayşegül, Murat, Tayfun
  | 'project_management'     // Burak, Halime, Najlae, Nurdan, Babür
  | 'mechanical_approval'    // Erhan Gürbüz, Erol Bingül
  | 'executive_approval'     // Yasin Çakar (GM), Tamer Özkahraman (Arge)
  | 'viewer';                // Salt okur

export interface User {
  id: string;
  name: string;
  email: string;
  username?: string;
  password?: string;
  title: string;
  role: RoleGroup;
  avatar?: string;
  active: boolean;
}

export interface Project {
  id: string;
  caniasProjeNo: string;
  clientName: string;
  productGroup: string;
  serverFolderPath: string; // e.g. \\Ekosfilesrv\ekos\PROJELER\2026\ENTEK\26040006 ENTEK
  year: number;
  createdAt: string;
}

export type MDTStatus =
  | 'YENI'               // 1. Yeni Talep (satış açtı, atanmadı)
  | 'TASARIMDA'          // 2. Tasarımda (elektrik tasarım)
  | 'MEKANIK_ONAYDA'     // 3. Mekanik Onayda (Erhan Gürbüz)
  | 'MEHMET_ONAYINDA'    // 4. Mehmet Uğur Onayında
  | 'UST_ONAYDA'         // 5. Üst Onayda (Tamer / Yasin)
  | 'MUSTERI_ONAYINDA'   // 6. Müşteri Onayında
  | 'REVIZYON_ISTENDI'   // 7. Revizyon İstendi
  | 'KAPATILDI'          // 8. Kapatıldı
  | 'REDDEDILDI';        // Reddedildi

export type MDTPriority = 'DUSUK' | 'ORTA' | 'YUKSEK' | 'KRITIK';

export type MDTRequestType = 'ELEKTRIK' | 'MEKANIK' | 'ELEKTRIK_MEKANIK';

export interface TechnicalDocsTracking {
  secondaryProjectNo?: string;
  secondaryProjectDate?: string;
  secondaryProjectClientApproved?: 'BEKLIYOR' | 'ONAYLANDI' | 'REVIZYON';
  secondaryProjectClientApprovedDate?: string;
  
  sldLayoutNo?: string;
  sldLayoutDate?: string;
  sldLayoutClientApproved?: 'BEKLIYOR' | 'ONAYLANDI' | 'REVIZYON';
  sldLayoutClientApprovedDate?: string;
  
  drawnById?: string;              // Çizen
  checkedMechanicalById?: string; // Kontrol Eden (Mekanik)
  checkedElectricalById?: string; // Kontrol Eden (Elektrik)
  approvedById?: string;          // Onaylayan
}

export interface ApprovalRecord {
  id: string;
  type: 'ELEKTRIK' | 'MEKANIK' | 'UST';
  requesterId: string;
  approverId: string;
  approverName: string;
  decision: 'ONAY' | 'RED' | 'REVIZYON';
  reason?: string;
  date: string;
}

export interface MDTComment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
}

export interface MDTFile {
  id: string;
  name: string;
  size: string;
  uploadedById: string;
  uploadedByName: string;
  createdAt: string;
}

export interface MDTRequest {
  id: string;
  mdtNo: string; // e.g. MDT-2026-014
  revisionNumber: string; // e.g. Rev.00, Rev.01
  projectId: string;
  title: string;
  requestType: MDTRequestType;
  hasMechanicalEffect: boolean;
  priority: MDTPriority;
  clientSpecialRequest: string;
  reason?: string;
  openedById: string;
  assignedToId?: string;
  currentStatus: MDTStatus;
  
  createdAt: string;
  targetDate: string;
  closedAt?: string;
  
  isHistorical?: boolean; // For 2024-2025 retro entries
  year: number;
  
  technicalDocs: TechnicalDocsTracking;
  approvals: ApprovalRecord[];
  comments: MDTComment[];
  files: MDTFile[];
  
  parentMdtId?: string; // Connection to previous revision
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  recordType: 'MDT' | 'KULLANICI' | 'PROJE' | 'SISTEM';
  recordId: string;
  oldValue?: string;
  newValue?: string;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  mdtId: string;
  mdtNo: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface PermissionMatrix {
  [role: string]: {
    createMDT: boolean;
    viewAll: boolean;
    processAssigned: boolean;
    approveElectrical: boolean;
    requestMechanical: boolean;
    approveMechanical: boolean;
    requestExecutive: boolean;
    approveExecutive: boolean;
    closeMDT: boolean;
    manageUsers: boolean;
    viewAuditLogs: boolean;
  };
}
