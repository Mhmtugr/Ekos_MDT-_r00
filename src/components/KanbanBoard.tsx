import React, { useState } from 'react';
import {
  Filter,
  Search,
  Clock,
  UserCheck,
  AlertCircle,
  Building,
  Layers,
} from 'lucide-react';
import { MDTRequest, Project, User, MDTStatus } from '../types';

interface KanbanBoardProps {
  mdts: MDTRequest[];
  projects: Project[];
  users: User[];
  onSelectMDT: (mdt: MDTRequest) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  mdts,
  projects,
  users,
  onSelectMDT,
}) => {
  // Filters
  const [filterProject, setFilterProject] = useState<string>('ALL');
  const [filterAssigned, setFilterAssigned] = useState<string>('ALL');
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const columns: { id: MDTStatus; title: string; color: string }[] = [
    { id: 'YENI', title: '1. Yönetici Değerlendirmesi', color: 'border-slate-300' },
    { id: 'TASARIMDA', title: '2. Tasarımda', color: 'border-blue-500' },
    { id: 'MEKANIK_ONAYDA', title: '3. Mekanik Onayda', color: 'border-amber-500' },
    { id: 'MEHMET_ONAYINDA', title: '4. Yönetici Onayında', color: 'border-amber-600' },
    { id: 'UST_ONAYDA', title: '5. Üst Onayda', color: 'border-purple-600' },
    { id: 'SATIS_KONTROLUNDE', title: '6. Satış / Talep Sahibi Onayında', color: 'border-sky-500' },
    { id: 'MUSTERI_ONAYINDA', title: '7. Müşteri Onayında', color: 'border-indigo-500' },
    { id: 'REVIZYON_ISTENDI', title: '8. Revizyon İstendi', color: 'border-rose-500' },
    { id: 'KAPATILDI', title: '9. Kapatıldı', color: 'border-emerald-600' },
  ];

  // Filter MDTs
  const filteredMDTs = mdts.filter((m) => {
    if (filterProject !== 'ALL' && m.projectId !== filterProject) return false;
    if (filterAssigned !== 'ALL' && m.assignedToId !== filterAssigned) return false;
    if (filterPriority !== 'ALL' && m.priority !== filterPriority) return false;
    if (filterType !== 'ALL' && m.requestType !== filterType) return false;

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const project = projects.find((p) => p.id === m.projectId);
      const matchesNo = m.mdtNo.toLowerCase().includes(q);
      const matchesTitle = m.title.toLowerCase().includes(q);
      const matchesClient = project?.clientName.toLowerCase().includes(q);
      const matchesCanias = project?.caniasProjeNo.toLowerCase().includes(q);
      if (!matchesNo && !matchesTitle && !matchesClient && !matchesCanias) return false;
    }
    return true;
  });

  const getPriorityStripColor = (priority: string) => {
    switch (priority) {
      case 'KRITIK':
        return 'bg-red-600';
      case 'YUKSEK':
        return 'bg-amber-500';
      case 'ORTA':
        return 'bg-blue-500';
      default:
        return 'bg-slate-300';
    }
  };

  const getDaysWaiting = (createdAt: string) => {
    const diffTime = Math.abs(new Date().getTime() - new Date(createdAt).getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 0 ? 'Bugün' : `${diffDays} gündür`;
  };

  return (
    <div className="p-6 space-y-4 max-w-full overflow-x-auto flex flex-col h-[calc(100vh-4rem)]">
      {/* Header & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-slate-800">Kanban İş Akışı</h1>
            <p className="text-xs text-slate-500">
              MDT Süreç Adımları ve Onay Takip Panosu (Tıklayarak Onay/Aksiyon Uygulayın)
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded">
            Toplam {filteredMDTs.length} Talepler
          </span>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center space-x-1.5 text-slate-500 font-semibold">
            <Filter className="w-3.5 h-3.5" />
            <span>Filtreler:</span>
          </div>

          {/* Project Filter */}
          <select
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 font-medium focus:outline-hidden"
          >
            <option value="ALL">Tüm Projeler</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.caniasProjeNo} - {p.clientName}
              </option>
            ))}
          </select>

          {/* Assigned Filter */}
          <select
            value={filterAssigned}
            onChange={(e) => setFilterAssigned(e.target.value)}
            className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 font-medium focus:outline-hidden"
          >
            <option value="ALL">Tüm Atananlar</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.title})
              </option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 font-medium focus:outline-hidden"
          >
            <option value="ALL">Tüm Öncelikler</option>
            <option value="KRITIK">Kritik</option>
            <option value="YUKSEK">Yüksek</option>
            <option value="ORTA">Orta</option>
            <option value="DUSUK">Düşük</option>
          </select>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 font-medium focus:outline-hidden"
          >
            <option value="ALL">Tüm Talep Türleri</option>
            <option value="ELEKTRIK">Elektrik</option>
            <option value="MEKANIK">Mekanik</option>
            <option value="ELEKTRIK_MEKANIK">Elektrik + Mekanik</option>
          </select>

          {/* Search */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Arama terimi..."
            className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 focus:outline-hidden w-48"
          />

          {(filterProject !== 'ALL' ||
            filterAssigned !== 'ALL' ||
            filterPriority !== 'ALL' ||
            filterType !== 'ALL' ||
            searchQuery !== '') && (
            <button
              onClick={() => {
                setFilterProject('ALL');
                setFilterAssigned('ALL');
                setFilterPriority('ALL');
                setFilterType('ALL');
                setSearchQuery('');
              }}
              className="text-[11px] text-[#D32F2F] font-semibold hover:underline"
            >
              Filtreleri Temizle
            </button>
          )}
        </div>
      </div>

      {/* 8 Kanban Columns Container */}
      <div className="flex-1 flex space-x-3 overflow-x-auto pb-4 min-h-0">
        {columns.map((col) => {
          const colMdts = filteredMDTs.filter((m) => m.currentStatus === col.id);

          return (
            <div
              key={col.id}
              className="w-72 shrink-0 bg-slate-100/70 border border-slate-200 rounded-xl flex flex-col max-h-full overflow-hidden"
            >
              {/* Column Header */}
              <div
                className={`p-3 border-t-4 ${col.color} bg-white border-b border-slate-200 flex items-center justify-between shrink-0`}
              >
                <h3 className="text-xs font-bold text-slate-800 tracking-tight">
                  {col.title}
                </h3>
                <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-full border border-slate-200">
                  {colMdts.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="p-2 flex-1 overflow-y-auto space-y-2.5">
                {colMdts.length === 0 ? (
                  <div className="py-8 text-center text-[11px] text-slate-400 font-medium">
                    Talep Yok
                  </div>
                ) : (
                  colMdts.map((m) => {
                    const project = projects.find((p) => p.id === m.projectId);
                    const assignedUser = users.find((u) => u.id === m.assignedToId);

                    return (
                      <div
                        key={m.id}
                        onClick={() => onSelectMDT(m)}
                        className="bg-white rounded-lg border border-slate-200 p-3 shadow-2xs hover:shadow-md hover:border-slate-300 transition cursor-pointer relative overflow-hidden group"
                      >
                        {/* Priority Strip on Left */}
                        <div
                          className={`absolute left-0 top-0 bottom-0 w-1 ${getPriorityStripColor(
                            m.priority
                          )}`}
                        />

                        {/* Top Card Bar */}
                        <div className="pl-1.5 flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-slate-800 group-hover:text-[#D32F2F] transition">
                            {m.mdtNo}
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium">
                            {m.revisionNumber}
                          </span>
                        </div>

                        {/* Card Title */}
                        <div className="pl-1.5 text-xs font-medium text-slate-800 mb-2 line-clamp-2 leading-snug">
                          {m.title}
                        </div>

                        {/* Client & Project */}
                        <div className="pl-1.5 text-[10px] text-slate-500 space-y-0.5 mb-2 border-t border-slate-50 pt-1.5">
                          <div className="font-semibold text-slate-700 truncate">
                            {project?.clientName}
                          </div>
                          <div className="text-slate-400">
                            {project?.caniasProjeNo}
                          </div>
                        </div>

                        {/* Process Type Badge & Mechanical Tag */}
                        <div className="pl-1.5 mb-2 flex flex-wrap gap-1">
                          {m.currentStatus === 'UST_ONAYDA' ? (
                            <span className="text-[9px] bg-purple-50 text-purple-900 border border-purple-200 px-1.5 py-0.5 rounded font-bold">
                              {m.reason?.toLowerCase().includes('yasin') || m.reason?.toLowerCase().includes('genel müdür')
                                ? 'Stratejik Onay'
                                : 'Ar-Ge Riskli Onay'}
                            </span>
                          ) : (
                            <span className="text-[9px] bg-blue-50 text-blue-800 border border-blue-200 px-1.5 py-0.5 rounded font-bold">
                              Standart Revizyon
                            </span>
                          )}

                          {m.hasMechanicalEffect ? (
                            <span className="text-[9px] bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded border border-amber-200 font-semibold">
                              Mekanik Etkili
                            </span>
                          ) : (
                            <span className="text-[9px] bg-slate-50 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200">
                              Sadece Elektrik
                            </span>
                          )}
                        </div>

                        {/* Bottom Card Footer */}
                        <div className="pl-1.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                          <div className="flex items-center space-x-1.5">
                            <div className="w-5 h-5 rounded-full bg-slate-800 text-white font-bold text-[9px] flex items-center justify-center">
                              {assignedUser
                                ? assignedUser.name
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')
                                : '?'}
                            </div>
                            <span className="truncate max-w-[90px]">
                              {assignedUser ? assignedUser.name.split(' ')[0] : 'Atanmadı'}
                            </span>
                          </div>

                          <div className="flex items-center space-x-1 text-slate-400">
                            <Clock className="w-3 h-3" />
                            <span>{getDaysWaiting(m.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
