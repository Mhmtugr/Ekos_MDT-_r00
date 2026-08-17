import { User, Project, MDTRequest, AuditLog, NotificationItem, PermissionMatrix } from '../types';

export const INITIAL_USERS: User[] = [
  { id: 'u1', name: 'Mehmet Uğur', email: 'mehmet.ugur@ekoselectric.com', username: 'mehmet.ugur', password: '123', title: 'Mühendislik Yöneticisi', role: 'admin', active: true },
  { id: 'u2', name: 'Halil Kerçin', email: 'halil.kercin@ekoselectric.com', username: 'halil.kercin', password: '123', title: 'Elektrik Proje Tasarım Mühendisi', role: 'electrical_design', active: true },
  { id: 'u3', name: 'İlayda Karan', email: 'ilayda.karan@ekoselectric.com', username: 'ilayda.karan', password: '123', title: 'Elektrik Proje Tasarım Mühendisi', role: 'electrical_design', active: true },
  { id: 'u4', name: 'Osman Çelen', email: 'osman.celen@ekoselectric.com', username: 'osman.celen', password: '123', title: 'Yurt İçi Satış Müdürü', role: 'sales', active: true },
  { id: 'u5', name: 'Oğuz Yalçınkaya', email: 'oguz.yalcinkaya@ekoselectric.com', username: 'oguz.yalcinkaya', password: '123', title: 'Yurt Dışı Bölge Satış Şefi', role: 'sales', active: true },
  { id: 'u6', name: 'Egemen Biçgin', email: 'egemen.bicgin@ekoselectric.com', username: 'egemen.bicgin', password: '123', title: 'Satış Mühendisi', role: 'sales', active: true },
  { id: 'u7', name: 'Ayşegül Şimşek', email: 'aysegul.simsek@ekoselectric.com', username: 'aysegul.simsek', password: '123', title: 'Satış Mühendisi', role: 'sales', active: true },
  { id: 'u8', name: 'Murat Akbıyık', email: 'murat.akbiyik@ekoselectric.com', username: 'murat.akbiyik', password: '123', title: 'Satış Mühendisi', role: 'sales', active: true },
  { id: 'u9', name: 'Tayfun Kırkık', email: 'tayfun.kirkik@ekoselectric.com', username: 'tayfun.kirkik', password: '123', title: 'Yurt Dışı Satış Yöneticisi', role: 'sales', active: true },
  { id: 'u10', name: 'Burak Gür', email: 'burak.gur@ekoselectric.com', username: 'burak.gur', password: '123', title: 'Proje Yönetim Şefi', role: 'project_management', active: true },
  { id: 'u11', name: 'Halime Yılmaz', email: 'halime.yilmaz@ekoselectric.com', username: 'halime.yilmaz', password: '123', title: 'Proje Yönetim Mühendisi', role: 'project_management', active: true },
  { id: 'u12', name: 'Najlae El Amal', email: 'najlae.elamal@ekoselectric.com', username: 'najlae.elamal', password: '123', title: 'Proje Yönetim Mühendisi', role: 'project_management', active: true },
  { id: 'u13', name: 'Nurdan Doğan', email: 'nurdan.dogan@ekoselectric.com', username: 'nurdan.dogan', password: '123', title: 'Proje Yönetim Mühendisi', role: 'project_management', active: true },
  { id: 'u14', name: 'Babür Yoldaş', email: 'babur.yoldas@ekoselectric.com', username: 'babur.yoldas', password: '123', title: 'Proje Yönetim Mühendisi', role: 'project_management', active: true },
  { id: 'u15', name: 'Yasin Çakar', email: 'yasin.cakar@ekoselectric.com', username: 'yasin.cakar', password: '123', title: 'Genel Müdür', role: 'executive_approval', active: true },
  { id: 'u16', name: 'Tamer Özkahraman', email: 'tamer.ozkahraman@ekoselectric.com', username: 'tamer.ozkahraman', password: '123', title: 'Arge Müdürü', role: 'executive_approval', active: true },
  { id: 'u17', name: 'Erhan Gürbüz', email: 'erhan.gurbuz@ekoselectric.com', username: 'erhan.gurbuz', password: '123', title: 'Mekanik Tasarım Mühendisi', role: 'mechanical_approval', active: true },
  { id: 'u18', name: 'Erol Bingül', email: 'erol.bingul@ekoselectric.com', username: 'erol.bingul', password: '123', title: 'Mekanik Tasarım Yöneticisi', role: 'mechanical_approval', active: true },
  { id: 'u-guest', name: 'Misafir İzleyici', email: 'misafir@ekoselectric.com', username: 'misafir', password: 'guest', title: 'Gözlemci / İzleyici Modu', role: 'viewer', active: true },
];

export const DEFAULT_PERMISSION_MATRIX: PermissionMatrix = {
  admin: { createMDT: true, viewAll: true, processAssigned: true, approveElectrical: true, requestMechanical: true, approveMechanical: true, requestExecutive: true, approveExecutive: true, closeMDT: true, manageUsers: true, viewAuditLogs: true },
  electrical_design: { createMDT: true, viewAll: true, processAssigned: true, approveElectrical: false, requestMechanical: true, approveMechanical: false, requestExecutive: false, approveExecutive: false, closeMDT: false, manageUsers: false, viewAuditLogs: false },
  sales: { createMDT: true, viewAll: true, processAssigned: false, approveElectrical: false, requestMechanical: false, approveMechanical: false, requestExecutive: false, approveExecutive: false, closeMDT: false, manageUsers: false, viewAuditLogs: false },
  project_management: { createMDT: true, viewAll: true, processAssigned: true, approveElectrical: false, requestMechanical: false, approveMechanical: false, requestExecutive: false, approveExecutive: false, closeMDT: true, manageUsers: false, viewAuditLogs: false },
  mechanical_approval: { createMDT: false, viewAll: true, processAssigned: true, approveElectrical: false, requestMechanical: false, approveMechanical: true, requestExecutive: false, approveExecutive: false, closeMDT: false, manageUsers: false, viewAuditLogs: false },
  executive_approval: { createMDT: false, viewAll: true, processAssigned: true, approveElectrical: false, requestMechanical: false, approveMechanical: false, requestExecutive: false, approveExecutive: true, closeMDT: false, manageUsers: false, viewAuditLogs: false },
  viewer: { createMDT: false, viewAll: true, processAssigned: false, approveElectrical: false, requestMechanical: false, approveMechanical: false, requestExecutive: false, approveExecutive: false, closeMDT: false, manageUsers: false, viewAuditLogs: false },
};

export const INITIAL_PROJECTS: Project[] = [
  { id: 'p1', caniasProjeNo: '24020022', clientName: 'ASELSAN', productGroup: 'Sekonder Projeler', serverFolderPath: '\\\\EKOSFILESRV\\ekos\\PROJELER\\2024\\ASELSAN\\24020022\\Sekonder Projeler', year: 2024, createdAt: '2024-10-01T08:00:00Z' },
  { id: 'p2', caniasProjeNo: '24020019', clientName: 'CEGELEC', productGroup: 'Sekonder Projeler', serverFolderPath: '\\\\EKOSFILESRV\\ekos\\PROJELER\\2024\\CEGELEC\\24020019\\Sekonder Projeler', year: 2024, createdAt: '2024-10-05T08:00:00Z' },
  { id: 'p3', caniasProjeNo: '25080025', clientName: 'EDIEL', productGroup: 'Sekonder Projeler', serverFolderPath: '\\\\EKOSFILESRV\\ekos\\PROJELER\\2025\\EDIEL\\25080025\\Sekonder Projeler\\36kV', year: 2025, createdAt: '2025-11-01T08:00:00Z' },
  { id: 'p4', caniasProjeNo: '25080003', clientName: 'JAYME DA COSTA', productGroup: 'Sekonder Projeler', serverFolderPath: '\\\\EKOSFILESRV\\ekos\\PROJELER\\2025\\JAYME DA COSTA\\25080003\\Sekonder Projeler', year: 2025, createdAt: '2025-12-01T08:00:00Z' },
  { id: 'p5', caniasProjeNo: 'MC-2025', clientName: 'GEAT MC PROJELERİ', productGroup: '10kV ve 36kV MC', serverFolderPath: '\\\\EKOSFILESRV\\ekos\\PROJELER\\2025\\MC\\GEAT\\10KV PROJELER', year: 2025, createdAt: '2025-09-01T08:00:00Z' },
  { id: 'p6', caniasProjeNo: 'WISE-GREENVILLE', clientName: 'WISE / GREENVILLE', productGroup: 'Sekonder Projeler', serverFolderPath: '\\\\EKOSFILESRV\\ekos\\PROJELER\\2026\\WISE\\Sekonder Projeler\\Greenville', year: 2026, createdAt: '2026-03-01T08:00:00Z' }
];

export const INITIAL_MDTS: MDTRequest[] = [
  {
    id: 'mdt-1',
    mdtNo: 'MDT-2024-001',
    revisionNumber: 'Rev.01',
    projectId: 'p1',
    title: 'Emniyet (Safety) Rölesi İlavesi',
    requestType: 'ELEKTRIK',
    hasMechanicalEffect: false,
    priority: 'KRITIK',
    clientSpecialRequest: 'Müşteri revizyon şartnamesine uygun olarak SSR10 safety rölesinin projelere eklenmesi (r01 versiyon geçişi). Gerekli proje yönlendirmeleri Mühendislik Yöneticisi gözetiminde uygulanmıştır.',
    reason: 'Proje Yönetimi Talebi / Müşteri',
    openedById: 'u1',
    assignedToId: 'u2',
    currentStatus: 'KAPATILDI',
    createdAt: '2024-10-15T09:00:00Z',
    targetDate: '2024-11-15T17:00:00Z',
    closedAt: '2024-11-20T14:30:00Z',
    isHistorical: true,
    year: 2024,
    technicalDocs: {
      drawnById: 'u2',
      approvedById: 'u1'
    },
    approvals: [],
    comments: [],
    files: []
  },
  {
    id: 'mdt-2',
    mdtNo: 'MDT-2024-002',
    revisionNumber: 'Rev.01',
    projectId: 'p2',
    title: 'Elektriksel-Mekaniksel kilitleme eklemeleri ve geçiş bağlantıları değişiklikleri',
    requestType: 'ELEKTRIK',
    hasMechanicalEffect: false,
    priority: 'YUKSEK',
    clientSpecialRequest: 'Müşterinin 9 ayrı merkezin birbirine en uygun şekilde gerekli kilitlemelerinin ve ara geçişlerinin yapılması talebi yerine getirilmiştir. Gerekli proje yönlendirmeleri Mühendislik Yöneticisi gözetiminde uygulanmıştır.',
    reason: 'Proje Yönetimi Talebi / Müşteri',
    openedById: 'u1',
    assignedToId: 'u2',
    currentStatus: 'KAPATILDI',
    createdAt: '2024-10-20T10:00:00Z',
    targetDate: '2024-11-25T17:00:00Z',
    closedAt: '2024-11-28T16:00:00Z',
    isHistorical: true,
    year: 2024,
    technicalDocs: {
      drawnById: 'u2',
      approvedById: 'u1'
    },
    approvals: [],
    comments: [],
    files: []
  },
  {
    id: 'mdt-3',
    mdtNo: 'MDT-2025-001',
    revisionNumber: 'Rev.00',
    projectId: 'p3',
    title: '36kV Sekonder Entegrasyon Değişiklikleri',
    requestType: 'ELEKTRIK',
    hasMechanicalEffect: false,
    priority: 'YUKSEK',
    clientSpecialRequest: 'Proje yönetim birimi üzerinden iletilen resmi değişiklik bildirimi doğrultusunda; pano içi güç bağlantıları, akım trafosu devreleri ve koruma rölesi selektivitesi müşteri standartlarına (baseline) revize edilerek 36kV sekonder projesi yeniden yayımlanmıştır.',
    reason: 'Proje Yönetimi Talebi',
    openedById: 'u1',
    assignedToId: 'u2',
    currentStatus: 'KAPATILDI',
    createdAt: '2025-11-05T09:00:00Z',
    targetDate: '2025-12-10T17:00:00Z',
    closedAt: '2025-12-15T15:00:00Z',
    isHistorical: true,
    year: 2025,
    technicalDocs: {
      drawnById: 'u2',
      approvedById: 'u1'
    },
    approvals: [],
    comments: [],
    files: []
  },
  {
    id: 'mdt-4',
    mdtNo: 'MDT-2025-002',
    revisionNumber: 'Rev.02',
    projectId: 'p4',
    title: 'Elektro-Mekaniksel Kilitleme (Interlocking) Değişikliği',
    requestType: 'ELEKTRIK_MEKANIK',
    hasMechanicalEffect: true,
    priority: 'KRITIK',
    clientSpecialRequest: 'İşletme güvenliği gereği projede müşterinin ilave donanım kilit (interlock) ihtiyacı. Elektriksel ve mekanik kilitlemelerle ilgili çoklu müşteri yorumları üzerine şematik revizyonlar sağlanmış, Ar-Ge doğrulamasının ardından süreç sonlandırılmıştır.',
    reason: 'Elektrik ve Mekanik Tasarım Talebi',
    openedById: 'u1',
    assignedToId: 'u2',
    currentStatus: 'KAPATILDI',
    createdAt: '2025-12-10T09:00:00Z',
    targetDate: '2026-01-15T17:00:00Z',
    closedAt: '2026-01-20T11:00:00Z',
    isHistorical: true,
    year: 2025,
    technicalDocs: {
      drawnById: 'u2',
      checkedMechanicalById: 'u17',
      approvedById: 'u1'
    },
    approvals: [
      { id: 'a-hist-1', type: 'MEKANIK', requesterId: 'u2', approverId: 'u17', approverName: 'Erhan Gürbüz', decision: 'ONAY', reason: 'Mekanik interlocking uyumlu.', date: '2026-01-18T10:00:00Z' }
    ],
    comments: [],
    files: []
  },
  {
    id: 'mdt-5',
    mdtNo: 'MDT-2025-003',
    revisionNumber: 'Rev.01',
    projectId: 'p5',
    title: '10kV ve 36kV Metal Clad (MC) Sistemleri Devre Adaptasyonu',
    requestType: 'ELEKTRIK',
    hasMechanicalEffect: false,
    priority: 'ORTA',
    clientSpecialRequest: '10kV ve 36kV OG (Orta Gerilim) Metal Clad hücre tipleri projelerinde, Proje Yönetimi aracılığıyla gelen resmi revizyon ile koruma röle lojik devreleri ve enerji analizör bağlantılarında ortak standart uyumlaştırması sağlanmıştır.',
    reason: 'Standart Uyumlaştırması',
    openedById: 'u1',
    assignedToId: 'u2',
    currentStatus: 'KAPATILDI',
    createdAt: '2025-09-15T09:00:00Z',
    targetDate: '2025-11-05T17:00:00Z',
    closedAt: '2025-11-10T14:00:00Z',
    isHistorical: true,
    year: 2025,
    technicalDocs: {
      drawnById: 'u2',
      approvedById: 'u1'
    },
    approvals: [],
    comments: [],
    files: []
  },
  {
    id: 'mdt-6',
    mdtNo: 'MDT-2026-001',
    revisionNumber: 'Rev.00',
    projectId: 'p6',
    title: 'Greenville Tesisi Şalt Donanımları Revizyonu',
    requestType: 'ELEKTRIK',
    hasMechanicalEffect: false,
    priority: 'YUKSEK',
    clientSpecialRequest: 'Müşteri ile sözleşilen şartnameler doğrultusunda; Kilitleme kontak diyagramları, gerilim/koruma seçicilik (selectivity) bağları ve panolar arası köprü (ara geçiş) devresi bağlantılarında değişiklik uygulanmış; Elektrik proje tasarımı yeniden müşteri/PY departmanı onayından geçirilmiştir.',
    reason: 'Müşteri Revizyon Talebi',
    openedById: 'u1',
    assignedToId: 'u2',
    currentStatus: 'KAPATILDI',
    createdAt: '2026-03-10T09:00:00Z',
    targetDate: '2026-05-15T17:00:00Z',
    closedAt: '2026-05-20T16:00:00Z',
    isHistorical: true,
    year: 2026,
    technicalDocs: {
      drawnById: 'u2',
      approvedById: 'u1'
    },
    approvals: [],
    comments: [],
    files: []
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  { id: 'l1', userId: 'u11', userName: 'Halime Yılmaz', action: 'Yeni MDT talebi oluşturuldu: MDT-2024-001 (ASELSAN)', recordType: 'MDT', recordId: 'mdt-1', newValue: 'Yeni -> Tasarımda', timestamp: '2024-10-15T09:00:00Z' },
  { id: 'l2', userId: 'u1', userName: 'Mehmet Uğur', action: 'Tasarım Onaylandı ve Kapatıldı: MDT-2024-001', recordType: 'MDT', recordId: 'mdt-1', oldValue: 'Tasarımda', newValue: 'Kapatıldı', timestamp: '2024-11-20T14:30:00Z' },
  { id: 'l3', userId: 'u10', userName: 'Burak Gür', action: 'Yeni MDT talebi oluşturuldu: MDT-2024-002 (CEGELEC)', recordType: 'MDT', recordId: 'mdt-2', newValue: 'Yeni -> Tasarımda', timestamp: '2024-10-20T10:00:00Z' },
  { id: 'l4', userId: 'u1', userName: 'Mehmet Uğur', action: 'Tasarım Onaylandı ve Kapatıldı: MDT-2024-002', recordType: 'MDT', recordId: 'mdt-2', oldValue: 'Tasarımda', newValue: 'Kapatıldı', timestamp: '2024-11-28T16:00:00Z' },
  { id: 'l5', userId: 'u12', userName: 'Najlae El Amal', action: 'Yeni MDT talebi oluşturuldu: MDT-2025-001 (EDIEL)', recordType: 'MDT', recordId: 'mdt-3', newValue: 'Yeni -> Tasarımda', timestamp: '2025-11-05T09:00:00Z' },
  { id: 'l6', userId: 'u1', userName: 'Mehmet Uğur', action: 'Tasarım Onaylandı ve Kapatıldı: MDT-2025-001', recordType: 'MDT', recordId: 'mdt-3', oldValue: 'Tasarımda', newValue: 'Kapatıldı', timestamp: '2025-12-15T15:00:00Z' },
  { id: 'l7', userId: 'u12', userName: 'Najlae El Amal', action: 'Yeni MDT talebi oluşturuldu: MDT-2025-002 (JAYME DA COSTA)', recordType: 'MDT', recordId: 'mdt-4', newValue: 'Yeni -> Tasarımda', timestamp: '2025-12-10T09:00:00Z' },
  { id: 'l8', userId: 'u1', userName: 'Mehmet Uğur', action: 'Tasarım Onaylandı ve Kapatıldı: MDT-2025-002', recordType: 'MDT', recordId: 'mdt-4', oldValue: 'Tasarımda', newValue: 'Kapatıldı', timestamp: '2026-01-20T11:00:00Z' },
  { id: 'l9', userId: 'u10', userName: 'Burak Gür', action: 'Yeni MDT talebi oluşturuldu: MDT-2025-003 (GEAT MC PROJELERİ)', recordType: 'MDT', recordId: 'mdt-5', newValue: 'Yeni -> Tasarımda', timestamp: '2025-09-15T09:00:00Z' },
  { id: 'l10', userId: 'u1', userName: 'Mehmet Uğur', action: 'Tasarım Onaylandı ve Kapatıldı: MDT-2025-003', recordType: 'MDT', recordId: 'mdt-5', oldValue: 'Tasarımda', newValue: 'Kapatıldı', timestamp: '2025-11-10T14:00:00Z' },
  { id: 'l11', userId: 'u13', userName: 'Nurdan Doğan', action: 'Yeni MDT talebi oluşturuldu: MDT-2026-001 (WISE / GREENVILLE)', recordType: 'MDT', recordId: 'mdt-6', newValue: 'Yeni -> Tasarımda', timestamp: '2026-03-10T09:00:00Z' },
  { id: 'l12', userId: 'u1', userName: 'Mehmet Uğur', action: 'Tasarım Onaylandı ve Kapatıldı: MDT-2026-001', recordType: 'MDT', recordId: 'mdt-6', oldValue: 'Tasarımda', newValue: 'Kapatıldı', timestamp: '2026-05-20T16:00:00Z' },
  { id: 'l-init', userId: 'u1', userName: 'Mehmet Uğur', action: 'EKOS MDT Portalı v1.0 Kurulumu Tamamlandı ve Kullanıma Açıldı.', recordType: 'SISTEM', recordId: 'SYS-INIT', timestamp: '2024-01-15T08:30:00Z' }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];
