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
  { id: 'p1', caniasProjeNo: '26040006 ENTEK', clientName: 'ENTEK ELEKTRİK A.Ş.', productGroup: '36kV RMU & Hücre Sanayi', serverFolderPath: '\\\\Ekosfilesrv\\ekos\\PROJELER\\2026\\ENTEK\\26040006 ENTEK', year: 2026, createdAt: '2026-01-10' },
  { id: 'p2', caniasProjeNo: '26040007 ENERJİSA', clientName: 'ENERJİSA DAĞITIM A.Ş.', productGroup: 'Trafo Merkezi & Modüler Hücre', serverFolderPath: '\\\\Ekosfilesrv\\ekos\\PROJELER\\2026\\ENERJİSA\\26040007 ENERJİSA', year: 2026, createdAt: '2026-01-15' },
  { id: 'p3', caniasProjeNo: '26040008 AKSA', clientName: 'AKSA ENERJİ', productGroup: 'Gas Insulated Switchgear (GIS)', serverFolderPath: '\\\\Ekosfilesrv\\ekos\\PROJELER\\2026\\AKSA\\26040008 AKSA', year: 2026, createdAt: '2026-02-01' },
  { id: 'p4', caniasProjeNo: '25030012 TEİAŞ 154kV', clientName: 'TEİAŞ GENEL MÜDÜRLÜĞÜ', productGroup: '154kV Sekonder Koruma ve Kumanda Pano', serverFolderPath: '\\\\Ekosfilesrv\\ekos\\PROJELER\\2025\\TEIAS\\25030012 TEİAŞ 154kV', year: 2025, createdAt: '2025-05-12' },
  { id: 'p5', caniasProjeNo: '24020088 TREDAŞ', clientName: 'TREDAŞ TRAFO MERKEZİ', productGroup: '36kV Metal Clad Şalt Panoları', serverFolderPath: '\\\\Ekosfilesrv\\ekos\\PROJELER\\2024\\TREDAS\\24020088 TREDAŞ', year: 2024, createdAt: '2024-09-04' },
];

export const INITIAL_MDTS: MDTRequest[] = [
  {
    id: 'mdt-1',
    mdtNo: 'MDT-2026-014',
    revisionNumber: 'Rev.01',
    projectId: 'p1',
    title: 'Sekonder Koruma Rölesi ve Kilitleme Diyagramı Güncellemesi',
    requestType: 'ELEKTRIK_MEKANIK',
    hasMechanicalEffect: true,
    priority: 'KRITIK',
    clientSpecialRequest: 'Müşteri mevcut SEL-751 rölesi yerine ABB REF615 kullanımı ve kesici kilit mekanizmasında ek solenoid kilit talep etmektedir.',
    reason: 'Saha şartnamesi gereği acil revizyon.',
    openedById: 'u4', // Osman Çelen (Satış)
    assignedToId: 'u2', // Halil Kerçin
    currentStatus: 'MEKANIK_ONAYDA',
    createdAt: '2026-07-20T09:30:00Z',
    targetDate: '2026-07-26T17:00:00Z',
    year: 2026,
    technicalDocs: {
      secondaryProjectNo: '26040006-SEC-02',
      secondaryProjectDate: '2026-07-21',
      secondaryProjectClientApproved: 'BEKLIYOR',
      sldLayoutNo: '26040006-SLD-01',
      sldLayoutDate: '2026-07-20',
      drawnById: 'u2',
      checkedElectricalById: 'u1',
      checkedMechanicalById: 'u17',
    },
    approvals: [
      {
        id: 'a1',
        type: 'ELEKTRIK',
        requesterId: 'u4',
        approverId: 'u2',
        approverName: 'Halil Kerçin',
        decision: 'ONAY',
        reason: 'Elektrik şeması hazırladı, mekanik onay başlatıldı.',
        date: '2026-07-21T11:00:00Z',
      },
    ],
    comments: [
      { id: 'c1', userId: 'u2', userName: 'Halil Kerçin', text: 'Pano kapak ölçüleri röle değişimi sebebiyle derinleşebilir, Erhan Bey mekanik kontrol yapabilir mi?', createdAt: '2026-07-21T11:05:00Z' },
      { id: 'c2', userId: 'u17', userName: 'Erhan Gürbüz', text: 'Derinlik +45mm artıyor, klemens ve montaj sacı kiti revize edildi.', createdAt: '2026-07-22T14:20:00Z' },
    ],
    files: [
      { id: 'f1', name: 'ENTEK_Sekonder_Sema_Rev01.pdf', size: '3.4 MB', uploadedById: 'u2', uploadedByName: 'Halil Kerçin', createdAt: '2026-07-21T11:00:00Z' },
      { id: 'f2', name: 'Solenoid_Kilit_Mekanik_Baski.dxf', size: '1.2 MB', uploadedById: 'u17', uploadedByName: 'Erhan Gürbüz', createdAt: '2026-07-22T14:15:00Z' },
    ],
  },
  {
    id: 'mdt-2',
    mdtNo: 'MDT-2026-015',
    revisionNumber: 'Rev.00',
    projectId: 'p2',
    title: 'Enerjisa Trafo Fideri Akım Trafosu Oranı Değişikliği',
    requestType: 'ELEKTRIK',
    hasMechanicalEffect: false,
    priority: 'YUKSEK',
    clientSpecialRequest: 'Fider 3 akım trafosu dönüştürme oranı 600-1200/5A iken 800-1600/5A olarak değiştirilecek.',
    reason: 'Müşteri güç artırımı talebi.',
    openedById: 'u10', // Burak Gür (Proje Yönetimi)
    assignedToId: 'u3', // İlayda Karan
    currentStatus: 'MEHMET_ONAYINDA',
    createdAt: '2026-07-22T10:00:00Z',
    targetDate: '2026-07-28T17:00:00Z',
    year: 2026,
    technicalDocs: {
      secondaryProjectNo: '26040007-SEC-01',
      secondaryProjectDate: '2026-07-23',
      secondaryProjectClientApproved: 'BEKLIYOR',
      sldLayoutNo: '26040007-SLD-01',
      sldLayoutDate: '2026-07-22',
      drawnById: 'u3',
      checkedElectricalById: 'u3',
      approvedById: 'u1',
    },
    approvals: [],
    comments: [
      { id: 'c3', userId: 'u3', userName: 'İlayda Karan', text: 'Akım trafosu etiketi ve sekonder doyma hesapları tamamlandı, Mehmet Bey onayına sunuldu.', createdAt: '2026-07-23T15:30:00Z' },
    ],
    files: [
      { id: 'f3', name: 'Enerjisa_AkımTrafosu_Hesap_Cetveli.pdf', size: '1.8 MB', uploadedById: 'u3', uploadedByName: 'İlayda Karan', createdAt: '2026-07-23T15:28:00Z' },
    ],
  },
  {
    id: 'mdt-3',
    mdtNo: 'MDT-2026-016',
    revisionNumber: 'Rev.00',
    projectId: 'p3',
    title: 'Aksa GIS Şalt Saha Veri Haberleşme Katman Düzenlemesi',
    requestType: 'ELEKTRIK',
    hasMechanicalEffect: false,
    priority: 'KRITIK',
    clientSpecialRequest: 'IEC 61850 GOOSE mesajlaşması ve yedekli PRP/HSR switch konfigürasyonu istemi.',
    reason: 'Kritik sistem güvenliği ve ihale teknik şartnamesi.',
    openedById: 'u5', // Oğuz Yalçınkaya
    assignedToId: 'u2', // Halil Kerçin
    currentStatus: 'UST_ONAYDA',
    createdAt: '2026-07-18T08:00:00Z',
    targetDate: '2026-07-24T17:00:00Z',
    year: 2026,
    technicalDocs: {
      secondaryProjectNo: '26040008-SEC-01',
      secondaryProjectDate: '2026-07-19',
      secondaryProjectClientApproved: 'BEKLIYOR',
      sldLayoutNo: '26040008-SLD-01',
      drawnById: 'u2',
      checkedElectricalById: 'u1',
      approvedById: 'u16',
    },
    approvals: [
      { id: 'a2', type: 'ELEKTRIK', requesterId: 'u2', approverId: 'u1', approverName: 'Mehmet Uğur', decision: 'ONAY', reason: 'Özel yazılım lisansı ve Arge onayı için Tamer Özkahraman Bey üst onayına sevk edildi.', date: '2026-07-20T16:00:00Z' },
    ],
    comments: [
      { id: 'c4', userId: 'u1', userName: 'Mehmet Uğur', text: 'Tamer Bey, Arge özel Ethernet switch ve mimari standart onayı beklenmektedir.', createdAt: '2026-07-20T16:02:00Z' },
    ],
    files: [
      { id: 'f4', name: 'Aksa_GIS_IEC61850_Mimari.pdf', size: '5.1 MB', uploadedById: 'u2', uploadedByName: 'Halil Kerçin', createdAt: '2026-07-19T14:00:00Z' },
    ],
  },
  {
    id: 'mdt-4',
    mdtNo: 'MDT-2026-017',
    revisionNumber: 'Rev.00',
    projectId: 'p1',
    title: 'Yeni Trafo Giriş Pano Düzenlemesi (Teklif Aşaması)',
    requestType: 'ELEKTRIK_MEKANIK',
    hasMechanicalEffect: true,
    priority: 'ORTA',
    clientSpecialRequest: 'Satış ekibinin teklif verirken müşteri talebi üzerine şema ve baralama alternatifi hazırlanması.',
    reason: 'Satış öncesi teknik fizibilite talebi.',
    openedById: 'u6', // Egemen Biçgin
    assignedToId: 'u3', // İlayda Karan
    currentStatus: 'TASARIMDA',
    createdAt: '2026-07-23T11:00:00Z',
    targetDate: '2026-07-30T17:00:00Z',
    year: 2026,
    technicalDocs: {
      drawnById: 'u3',
    },
    approvals: [],
    comments: [],
    files: [],
  },
  {
    id: 'mdt-5',
    mdtNo: 'MDT-2025-089',
    revisionNumber: 'Rev.02',
    projectId: 'p4',
    title: 'TEİAŞ 154kV Pano Kilitleme Şeması ve Tip Test Onayı',
    requestType: 'ELEKTRIK_MEKANIK',
    hasMechanicalEffect: true,
    priority: 'ORTA',
    clientSpecialRequest: 'Müşteri TEİAŞ şartnamesi madde 4.2 gereği yapılan revizyon.',
    reason: 'Müşteri resmi onay belgesi tamamlandı.',
    openedById: 'u11', // Halime Yılmaz
    assignedToId: 'u2', // Halil Kerçin
    currentStatus: 'KAPATILDI',
    createdAt: '2025-08-10T09:00:00Z',
    targetDate: '2025-08-25T17:00:00Z',
    closedAt: '2025-08-24T14:30:00Z',
    isHistorical: true,
    year: 2025,
    technicalDocs: {
      secondaryProjectNo: '25030012-SEC-03',
      secondaryProjectDate: '2025-08-15',
      secondaryProjectClientApproved: 'ONAYLANDI',
      secondaryProjectClientApprovedDate: '2025-08-22',
      sldLayoutNo: '25030012-SLD-02',
      sldLayoutDate: '2025-08-12',
      sldLayoutClientApproved: 'ONAYLANDI',
      sldLayoutClientApprovedDate: '2025-08-20',
      drawnById: 'u2',
      checkedElectricalById: 'u1',
      checkedMechanicalById: 'u17',
      approvedById: 'u1',
    },
    approvals: [
      { id: 'a3', type: 'MEKANIK', requesterId: 'u2', approverId: 'u17', approverName: 'Erhan Gürbüz', decision: 'ONAY', reason: 'Mekanik kilitleme projesi TEİAŞ standartlarına uygun.', date: '2025-08-16T10:00:00Z' },
      { id: 'a4', type: 'ELEKTRIK', requesterId: 'u2', approverId: 'u1', approverName: 'Mehmet Uğur', decision: 'ONAY', reason: 'Sekonder proje ve tip test sertifikaları onaylandı.', date: '2025-08-18T11:00:00Z' },
    ],
    comments: [
      { id: 'c5', userId: 'u11', userName: 'Halime Yılmaz', text: 'TEİAŞ resmi kabul mektubu sisteme eklenmiş olup MDT kapatılmıştır.', createdAt: '2025-08-24T14:28:00Z' },
    ],
    files: [
      { id: 'f5', name: 'TEIAS_Resmi_Kabul_Mektubu.pdf', size: '890 KB', uploadedById: 'u11', uploadedByName: 'Halime Yılmaz', createdAt: '2025-08-24T14:25:00Z' },
    ],
  },
  {
    id: 'mdt-6',
    mdtNo: 'MDT-2024-042',
    revisionNumber: 'Rev.01',
    projectId: 'p5',
    title: 'TREDAŞ Metal Clad Şalt Panosu Yardımcı Kontak Düzenlemesi',
    requestType: 'ELEKTRIK',
    hasMechanicalEffect: false,
    priority: 'DUSUK',
    clientSpecialRequest: 'Geriye dönük arşiv kaydı.',
    reason: 'Proje tamamlandı.',
    openedById: 'u4', // Osman Çelen
    assignedToId: 'u3', // İlayda Karan
    currentStatus: 'KAPATILDI',
    createdAt: '2024-10-05T09:00:00Z',
    targetDate: '2024-10-15T17:00:00Z',
    closedAt: '2024-10-14T16:00:00Z',
    isHistorical: true,
    year: 2024,
    technicalDocs: {
      secondaryProjectNo: '24020088-SEC-01',
      secondaryProjectDate: '2024-10-08',
      secondaryProjectClientApproved: 'ONAYLANDI',
      secondaryProjectClientApprovedDate: '2024-10-12',
      drawnById: 'u3',
      approvedById: 'u1',
    },
    approvals: [
      { id: 'a5', type: 'ELEKTRIK', requesterId: 'u3', approverId: 'u1', approverName: 'Mehmet Uğur', decision: 'ONAY', reason: 'Uygun.', date: '2024-10-10T11:00:00Z' },
    ],
    comments: [],
    files: [],
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  { id: 'l1', userId: 'u1', userName: 'Mehmet Uğur', action: 'Kullanıcı yetkileri güncellendi', recordType: 'SISTEM', recordId: 'SYS-01', timestamp: '2026-07-24T00:00:00Z' },
  { id: 'l2', userId: 'u4', userName: 'Osman Çelen', action: 'Yeni MDT talebi oluşturuldu: MDT-2026-014', recordType: 'MDT', recordId: 'mdt-1', newValue: 'Yeni -> Tasarımda', timestamp: '2026-07-20T09:30:00Z' },
  { id: 'l3', userId: 'u2', userName: 'Halil Kerçin', action: 'Mekanik Onay Talebi Açıldı (Erhan Gürbüz)', recordType: 'MDT', recordId: 'mdt-1', oldValue: 'Tasarımda', newValue: 'Mekanik Onayda', timestamp: '2026-07-21T11:00:00Z' },
  { id: 'l4', userId: 'u1', userName: 'Mehmet Uğur', action: 'Üst Onay Talebi Gönderildi (Tamer Özkahraman)', recordType: 'MDT', recordId: 'mdt-3', oldValue: 'Mehmet Onayında', newValue: 'Üst Onayda', timestamp: '2026-07-20T16:00:00Z' },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  { id: 'n1', userId: 'u17', mdtId: 'mdt-1', mdtNo: 'MDT-2026-014', message: 'Mekanik onayınızı bekleyen yeni talep var: Sekonder Koruma Rölesi ve Kilitleme Diyagramı', read: false, createdAt: '2026-07-21T11:00:00Z' },
  { id: 'n2', userId: 'u1', mdtId: 'mdt-2', mdtNo: 'MDT-2026-015', message: 'Mehmet Bey, onayınızı bekleyen yeni elektrik talebi: Enerjisa Trafo Fideri Akım Trafosu', read: false, createdAt: '2026-07-23T15:30:00Z' },
  { id: 'n3', userId: 'u16', mdtId: 'mdt-3', mdtNo: 'MDT-2026-016', message: 'Tamer Bey, üst onayınızı bekleyen kritik talep: Aksa GIS Şalt Saha Veri Haberleşme', read: false, createdAt: '2026-07-20T16:00:00Z' },
];
