import React, { useState } from 'react';
import { X, Plus, AlertCircle, Search, Folder, Check } from 'lucide-react';
import { MDTRequest, Project, User, MDTPriority, MDTRequestType } from '../types';

interface NewMDTModalProps {
  projects: Project[];
  users: User[];
  currentUser: User;
  isRetroactive?: boolean;
  onClose: () => void;
  onCreateMDT: (newMDT: Partial<MDTRequest>, newProj?: Partial<Project>) => void;
}

export const NewMDTModal: React.FC<NewMDTModalProps> = ({
  projects,
  users,
  currentUser,
  isRetroactive = false,
  onClose,
  onCreateMDT,
}) => {
  // Project selection mode: 'EXISTING' or 'NEW'
  const [projectMode, setProjectMode] = useState<'EXISTING' | 'NEW'>('EXISTING');
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    projects.length > 0 ? projects[0].id : ''
  );
  const [projectSearchQuery, setProjectSearchQuery] = useState('');

  // New project fields
  const [newCaniasNo, setNewCaniasNo] = useState('');
  const [newClientName, setNewClientName] = useState('');
  const [newProductGroup, setNewProductGroup] = useState('36kV RMU & Hücre');

  // MDT fields
  const [title, setTitle] = useState('');
  const [requestType, setRequestType] = useState<MDTRequestType>('ELEKTRIK_MEKANIK');
  const [hasMechanicalEffect, setHasMechanicalEffect] = useState(true);
  const [priority, setPriority] = useState<MDTPriority>('ORTA');
  const [clientSpecialRequest, setClientSpecialRequest] = useState('');
  const [reason, setReason] = useState('');
  const [assignedToId, setAssignedToId] = useState('u2'); // Halil Kerçin default
  const [assignedMechanicalId, setAssignedMechanicalId] = useState('u17'); // Erhan Gürbüz default
  const [retroYear, setRetroYear] = useState<number>(2025);
  const [retroClosedDate, setRetroClosedDate] = useState('2025-06-15');

  // Mechanical approval users list
  const mechanicalUsers = users.filter(
    (u) => u.role === 'mechanical_approval' || u.name.includes('Erhan') || u.name.includes('Erol')
  );

  const isEngineeringOrAdmin = currentUser.role === 'admin' || currentUser.role === 'electrical_design';

  // Filter projects by search query
  const filteredProjects = projects.filter((p) => {
    if (!projectSearchQuery.trim()) return true;
    const q = projectSearchQuery.toLowerCase();
    return (
      p.caniasProjeNo.toLowerCase().includes(q) ||
      p.clientName.toLowerCase().includes(q) ||
      p.productGroup.toLowerCase().includes(q)
    );
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !clientSpecialRequest.trim()) return;

    let projId = selectedProjectId;
    let createdProject: Partial<Project> | undefined = undefined;

    if (projectMode === 'NEW' || !selectedProjectId) {
      projId = 'p-' + Date.now();
      createdProject = {
        id: projId,
        caniasProjeNo: newCaniasNo || '26040099 ÖZEL',
        clientName: newClientName || 'MÜŞTERİ A.Ş.',
        productGroup: newProductGroup,
        serverFolderPath: `\\\\Ekosfilesrv\\ekos\\PROJELER\\${
          isRetroactive ? retroYear : 2026
        }\\${(newClientName || 'MUSTERI').toUpperCase()}\\${newCaniasNo || 'PROJE'}`,
        year: isRetroactive ? retroYear : 2026,
        createdAt: new Date().toISOString().split('T')[0],
      };
    }

    const newMDT: Partial<MDTRequest> = {
      projectId: projId,
      title,
      requestType,
      hasMechanicalEffect,
      priority,
      clientSpecialRequest,
      reason,
      openedById: currentUser.id,
      assignedToId: currentUser.role === 'admin' ? assignedToId : undefined,
      currentStatus: isRetroactive ? 'KAPATILDI' : 'TASARIMDA',
      createdAt: isRetroactive ? `${retroYear}-01-15T09:00:00Z` : new Date().toISOString(),
      targetDate: isRetroactive
        ? `${retroYear}-02-15T17:00:00Z`
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      closedAt: isRetroactive ? `${retroClosedDate}T16:00:00Z` : undefined,
      isHistorical: isRetroactive,
      year: isRetroactive ? retroYear : 2026,
      revisionNumber: 'Rev.00',
      technicalDocs: {
        drawnById: currentUser.role === 'admin' ? assignedToId : undefined,
        checkedElectricalById: 'u1',
        checkedMechanicalById: (currentUser.role === 'admin' && hasMechanicalEffect) ? assignedMechanicalId : undefined,
        secondaryProjectClientApproved: isRetroactive ? 'ONAYLANDI' : 'BEKLIYOR',
      },
      approvals: [],
      comments: [],
      files: [],
    };

    onCreateMDT(newMDT, createdProject);
    onClose();
  };

  const selectedProjectObj = projects.find((p) => p.id === selectedProjectId);

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-150 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-[#D32F2F]" />
            <h2 className="text-sm font-bold text-slate-800">
              {isRetroactive ? 'Geçmişe Dönük MDT Kaydı Ekle (2024-2025 Arşiv)' : 'Yeni MDT Talebi Oluştur'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {isRetroactive && (
            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Geçmişe Dönük Kayıt Modu:</strong> Bu modda girilen talepler doğrudan "Kapatıldı" statüsünde arşive eklenir. Canlı onay akışından geçirilmez ve yıl filtresinde (2024 / 2025) yer alır.
              </div>
            </div>
          )}

          {/* Project selection tabs */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="block font-bold text-slate-800">İlişkili Proje Seçimi</label>
              <span className="text-[10px] text-slate-500">Mevcut dizinden seçin veya yeni proje tanımlayın</span>
            </div>

            {/* Mode switch pills */}
            <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => setProjectMode('EXISTING')}
                className={`py-1.5 px-3 rounded-md text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer ${
                  projectMode === 'EXISTING'
                    ? 'bg-white text-slate-800 shadow-2xs border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Folder className="w-3.5 h-3.5 text-blue-600" />
                <span>Mevcut Projelerden Seç ({projects.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setProjectMode('NEW')}
                className={`py-1.5 px-3 rounded-md text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer ${
                  projectMode === 'NEW'
                    ? 'bg-white text-slate-800 shadow-2xs border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Plus className="w-3.5 h-3.5 text-emerald-600" />
                <span>+ Yeni Proje Tanımla</span>
              </button>
            </div>

            {/* EXISTING PROJECT SELECTOR WITH SEARCH & QUICK SELECT */}
            {projectMode === 'EXISTING' && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={projectSearchQuery}
                    onChange={(e) => setProjectSearchQuery(e.target.value)}
                    placeholder="Proje ara (ör. ENTEK, ENERJİSA, 26040006)..."
                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded text-xs text-slate-800 focus:outline-hidden focus:border-red-500"
                  />
                </div>

                {/* Quick Select Recent Tags */}
                <div>
                  <div className="text-[10px] text-slate-500 font-semibold mb-1.5">
                    Hızlı Seçim (Mevcut Son Projeler Dizini):
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {projects.slice(0, 5).map((p) => {
                      const isSelected = selectedProjectId === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setSelectedProjectId(p.id)}
                          className={`px-2.5 py-1 rounded text-[11px] font-medium border transition flex items-center space-x-1 cursor-pointer ${
                            isSelected
                              ? 'bg-red-50 text-[#D32F2F] border-red-300 font-bold'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 text-[#D32F2F]" />}
                          <span>{p.caniasProjeNo}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Filtered Dropdown */}
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold mb-1">
                    Proje Listesi
                  </label>
                  <select
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-xs font-semibold text-slate-800 focus:outline-hidden"
                  >
                    {filteredProjects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.caniasProjeNo} — {p.clientName} ({p.productGroup})
                      </option>
                    ))}
                  </select>
                </div>

                {selectedProjectObj && (
                  <div className="p-2 bg-white rounded border border-slate-200/80 text-[11px] text-slate-600 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800">{selectedProjectObj.caniasProjeNo}</span>
                      <span className="mx-1 text-slate-400">•</span>
                      <span>{selectedProjectObj.clientName}</span>
                    </div>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                      {selectedProjectObj.productGroup}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* NEW PROJECT FIELDS */}
            {projectMode === 'NEW' && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
                <div className="font-bold text-slate-800 text-xs flex items-center space-x-1.5">
                  <Plus className="w-4 h-4 text-emerald-600" />
                  <span>Yeni Proje / Canias Kaydı Oluştur</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">
                      Canias / Proje Referans No *
                    </label>
                    <input
                      type="text"
                      value={newCaniasNo}
                      onChange={(e) => setNewCaniasNo(e.target.value)}
                      placeholder="ör. 26040012 OEDAŞ"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs text-slate-800"
                      required={projectMode === 'NEW'}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">
                      Müşteri Ünvanı *
                    </label>
                    <input
                      type="text"
                      value={newClientName}
                      onChange={(e) => setNewClientName(e.target.value)}
                      placeholder="ör. OEDAŞ ELEKTRİK A.Ş."
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs text-slate-800"
                      required={projectMode === 'NEW'}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold mb-1">
                    Ürün Grubu
                  </label>
                  <input
                    type="text"
                    value={newProductGroup}
                    onChange={(e) => setNewProductGroup(e.target.value)}
                    placeholder="ör. 36kV RMU & Hücre Sanayi"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs text-slate-800"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Retroactive year settings */}
          {isRetroactive && (
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Geçmiş Proje Yılı</label>
                <select
                  value={retroYear}
                  onChange={(e) => setRetroYear(parseInt(e.target.value, 10))}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded text-xs font-bold text-slate-800"
                >
                  <option value={2025}>2025 Yılı Kaydı</option>
                  <option value={2024}>2024 Yılı Kaydı</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kapanış Tarihi</label>
                <input
                  type="date"
                  value={retroClosedDate}
                  onChange={(e) => setRetroClosedDate(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded text-xs text-slate-800"
                />
              </div>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Talep Konusu / Başlık *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ör. Sekonder Koruma Rölesi ve Kilitleme Diyagramı Güncellemesi"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800"
              required
            />
          </div>

          {/* Type & Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Talep Türü</label>
              <select
                value={requestType}
                onChange={(e) => setRequestType(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800"
              >
                <option value="ELEKTRIK_MEKANIK">Elektrik + Mekanik</option>
                <option value="ELEKTRIK">Yalnızca Elektrik</option>
                <option value="MEKANIK">Yalnızca Mekanik</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Öncelik Derecesi</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs font-semibold text-slate-800"
              >
                <option value="DUSUK">Düşük</option>
                <option value="ORTA">Orta</option>
                <option value="YUKSEK">Yüksek</option>
                <option value="KRITIK">Kritik</option>
              </select>
            </div>
          </div>

          {/* Mechanical & Assignment Section */}
          {isEngineeringOrAdmin ? (
            <>
              {/* Mechanical Checkbox */}
              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="mechCheck"
                  checked={hasMechanicalEffect}
                  onChange={(e) => setHasMechanicalEffect(e.target.checked)}
                  className="rounded text-[#D32F2F] focus:ring-[#D32F2F]"
                />
                <label htmlFor="mechCheck" className="font-semibold text-slate-700 cursor-pointer">
                  Mekanik Tasarım Etkisi Var (Mekanik onay gerektirir)
                </label>
              </div>

              {/* Assigned Engineer Assignment Section */}
              {currentUser.role === 'admin' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                {/* Electrical Engineer */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Atanacak Elektrik Tasarım Mühendisi
                  </label>
                  <select
                    value={assignedToId}
                    onChange={(e) => setAssignedToId(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-xs text-slate-800 font-medium"
                  >
                    {users
                      .filter((u) => u.role === 'electrical_design' || u.role === 'admin')
                      .map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.title})
                        </option>
                      ))}
                  </select>
                </div>

                {/* Mechanical Engineer */}
                {hasMechanicalEffect ? (
                  <div className="animate-in fade-in duration-200">
                    <label className="block font-bold text-amber-900 mb-1 flex items-center justify-between">
                      <span>Atanacak Mekanik Tasarım Mühendisi</span>
                      <span className="text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded">Mekanik Onay</span>
                    </label>
                    <select
                      value={assignedMechanicalId}
                      onChange={(e) => setAssignedMechanicalId(e.target.value)}
                      className="w-full px-3 py-2 bg-amber-50/50 border border-amber-300 rounded text-xs text-amber-950 font-semibold focus:outline-hidden focus:border-amber-500"
                    >
                      {mechanicalUsers.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.title})
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="flex items-center text-[11px] text-slate-400 italic px-2">
                    Mekanik tasarım etkisi seçilmedi.
                  </div>
                )}
              </div>
              )}
            </>
          ) : (
            /* Non-engineering simplified route info */
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
              <div className="flex items-center space-x-2 text-slate-800 font-bold text-xs">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span>Mühendislik Birimi Yönlendirmesi</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Talebiniz doğrudan <strong>Elektrik Proje Tasarım Birimi</strong>'ne iletilecektir. Talebin mekanik tasarım revizyonu gerektirip gerektirmediği Mühendislik Birimi incelemesinde değerlendirilecek ve gerek duyulursa Mekanik Tasarım Birimi sürece dahil edilecektir.
              </p>
            </div>
          )}

          {/* Detailed Description */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Müşteri Talebi / Teknik Şartname Açıklaması *
            </label>
            <textarea
              rows={4}
              value={clientSpecialRequest}
              onChange={(e) => setClientSpecialRequest(e.target.value)}
              placeholder="Müşterinin veya satış öncesi toplantının teknik gereksinim detaylarını yazınız..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800"
              required
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded text-xs transition cursor-pointer"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#D32F2F] hover:bg-red-700 text-white font-bold rounded text-xs transition shadow-xs cursor-pointer"
            >
              {isRetroactive ? 'Geçmiş Kaydı Ekle' : 'Talebi Oluştur & Başlat'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
