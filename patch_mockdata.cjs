const fs = require('fs');
let code = fs.readFileSync('src/data/mockData.ts', 'utf8');

const splitPoint = "export const INITIAL_PROJECTS: Project[] = [";
const beforeSplit = code.split(splitPoint)[0];

const newMockData = `export const INITIAL_PROJECTS: Project[] = [
  { id: 'p1', caniasProjeNo: '24020022', clientName: 'ASELSAN', productGroup: 'Sekonder Projeler', serverFolderPath: '\\\\\\\\EKOSFILESRV\\\\ekos\\\\PROJELER\\\\2024\\\\ASELSAN\\\\24020022\\\\Sekonder Projeler', year: 2024, createdAt: '2024-10-01T08:00:00Z' },
  { id: 'p2', caniasProjeNo: '24020019', clientName: 'CEGELEC', productGroup: 'Sekonder Projeler', serverFolderPath: '\\\\\\\\EKOSFILESRV\\\\ekos\\\\PROJELER\\\\2024\\\\CEGELEC\\\\24020019\\\\Sekonder Projeler', year: 2024, createdAt: '2024-10-05T08:00:00Z' },
  { id: 'p3', caniasProjeNo: '25080025', clientName: 'EDIEL', productGroup: 'Sekonder Projeler', serverFolderPath: '\\\\\\\\EKOSFILESRV\\\\ekos\\\\PROJELER\\\\2025\\\\EDIEL\\\\25080025\\\\Sekonder Projeler\\\\36kV', year: 2025, createdAt: '2025-11-01T08:00:00Z' },
  { id: 'p4', caniasProjeNo: '25080003', clientName: 'JAYME DA COSTA', productGroup: 'Sekonder Projeler', serverFolderPath: '\\\\\\\\EKOSFILESRV\\\\ekos\\\\PROJELER\\\\2025\\\\JAYME DA COSTA\\\\25080003\\\\Sekonder Projeler', year: 2025, createdAt: '2025-12-01T08:00:00Z' },
  { id: 'p5', caniasProjeNo: 'MC-2025', clientName: 'GEAT MC PROJELERİ', productGroup: '10kV ve 36kV MC', serverFolderPath: '\\\\\\\\EKOSFILESRV\\\\ekos\\\\PROJELER\\\\2025\\\\MC\\\\GEAT\\\\10KV PROJELER', year: 2025, createdAt: '2025-09-01T08:00:00Z' },
  { id: 'p6', caniasProjeNo: 'WISE-GREENVILLE', clientName: 'WISE / GREENVILLE', productGroup: 'Sekonder Projeler', serverFolderPath: '\\\\\\\\EKOSFILESRV\\\\ekos\\\\PROJELER\\\\2026\\\\WISE\\\\Sekonder Projeler\\\\Greenville', year: 2026, createdAt: '2026-03-01T08:00:00Z' }
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
  { id: 'l1', userId: 'u1', userName: 'Mehmet Uğur', action: 'Geçmiş Veriler İçeri Aktarıldı (Legacy Data Migration)', recordType: 'SISTEM', recordId: 'SYS-MIGRATE', timestamp: '2026-07-28T09:00:00Z' }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];
`;

fs.writeFileSync('src/data/mockData.ts', beforeSplit + newMockData);
