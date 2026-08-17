import React from 'react';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  FolderOpen,
  ArrowRight,
  UserCheck,
  Zap,
  PlusCircle,
  Sparkles,
} from 'lucide-react';
import { MDTRequest, Project, User } from '../types';

interface DashboardProps {
  mdts: MDTRequest[];
  projects: Project[];
  users: User[];
  currentUser: User;
  onSelectMDT: (mdt: MDTRequest) => void;
  onNavigateTab: (tab: string, filter?: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  mdts,
  projects,
  users,
  currentUser,
  onSelectMDT,
  onNavigateTab,
}) => {
  const now = new Date();

  // 1. KPI Calculations
  const openMDTs = mdts.filter((m) => m.currentStatus !== 'KAPATILDI' && m.currentStatus !== 'REDDEDILDI');

  // Personalized "Onayımı Bekleyen" filter
  const waitingForMe = openMDTs.filter((m) => {
    if (currentUser.role === 'viewer') return false;
    
    if (currentUser.role === 'admin') {
      return m.currentStatus === 'MEHMET_ONAYINDA' || m.assignedToId === currentUser.id;
    }
    if (currentUser.role === 'electrical_design') {
      return m.assignedToId === currentUser.id && (m.currentStatus === 'TASARIMDA' || m.currentStatus === 'REVIZYON_ISTENDI');
    }
    if (currentUser.role === 'mechanical_approval') {
      return m.currentStatus === 'MEKANIK_ONAYDA' && (m.technicalDocs?.checkedMechanicalById === currentUser.id || !m.technicalDocs?.checkedMechanicalById);
    }
    if (currentUser.role === 'executive_approval') {
      return m.currentStatus === 'UST_ONAYDA';
    }
    if (currentUser.role === 'project_management') {
      return m.currentStatus === 'MUSTERI_ONAYINDA';
    }
    if (currentUser.role === 'sales') {
      return m.openedById === currentUser.id && m.currentStatus === 'YENI';
    }
    return false;
  });

  const inClientApproval = mdts.filter((m) => m.currentStatus === 'MUSTERI_ONAYINDA');

  const delayedMDTs = openMDTs.filter((m) => {
    if (!m.targetDate) return false;
    return new Date(m.targetDate) < now;
  });

  const closedThisMonth = mdts.filter((m) => {
    if (m.currentStatus !== 'KAPATILDI' || !m.closedAt) return false;
    const closedDate = new Date(m.closedAt);
    return (
      closedDate.getMonth() === now.getMonth() &&
      closedDate.getFullYear() === now.getFullYear()
    );
  });

  // Newly Created MDTs (Sorted by creation time descending - max 3 items as requested)
  const newlyCreatedMDTs = [...mdts]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  // 2. Critical/Urgent MDTs
  const criticalMDTs = openMDTs
    .filter((m) => m.priority === 'KRITIK' || m.priority === 'YUKSEK')
    .sort((a, b) => {
      if (a.priority === 'KRITIK' && b.priority !== 'KRITIK') return -1;
      if (a.priority !== 'KRITIK' && b.priority === 'KRITIK') return 1;
      return new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime();
    });

  // Helper for status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'YENI':
        return <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-semibold">Yeni</span>;
      case 'TASARIMDA':
        return <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[10px] font-semibold">Tasarımda</span>;
      case 'MEKANIK_ONAYDA':
        return <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded text-[10px] font-semibold">Mekanik Onayda</span>;
      case 'MEHMET_ONAYINDA':
        return <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[10px] font-bold">Yönetici Onayında</span>;
      case 'UST_ONAYDA':
        return <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded text-[10px] font-semibold">Üst Onayda</span>;
      case 'MUSTERI_ONAYINDA':
        return <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-[10px] font-semibold">Müşteri Onayında</span>;
      case 'REVIZYON_ISTENDI':
        return <span className="bg-rose-50 text-rose-700 px-2 py-0.5 rounded text-[10px] font-semibold">Revizyon İstendi</span>;
      case 'KAPATILDI':
        return <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-semibold">Kapatıldı</span>;
      case 'REDDEDILDI':
        return <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded text-[10px] font-semibold">Reddedildi</span>;
      default:
        return null;
    }
  };

  // Helper for priority badge
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'KRITIK':
        return <span className="text-red-700 font-bold text-[10px] bg-red-100 px-1.5 py-0.5 rounded">Kritik</span>;
      case 'YUKSEK':
        return <span className="text-amber-700 font-semibold text-[10px] bg-amber-100 px-1.5 py-0.5 rounded">Yüksek</span>;
      case 'ORTA':
        return <span className="text-blue-700 font-semibold text-[10px] bg-blue-100 px-1.5 py-0.5 rounded">Orta</span>;
      default:
        return <span className="text-slate-600 text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">Düşük</span>;
    }
  };

  // Staff Workload calculation
  const staffWorkload = users
    .filter((u) => u.role === 'electrical_design' || u.role === 'mechanical_approval')
    .map((u) => {
      const assignedCount = openMDTs.filter((m) => m.assignedToId === u.id).length;
      return { user: u, count: assignedCount };
    });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Title */}
      <div>
        <h1 className="text-lg font-bold text-slate-800 tracking-tight">
          Gösterge Paneli
        </h1>
        <p className="text-xs text-slate-500">
          EKOS Mühendislik-Tasarım Proje & Revizyon Takip Özeti
        </p>
      </div>

      {/* Top Row: 5 Clickable KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Açık Talepler */}
        <div
          onClick={() => onNavigateTab('mdt-list', 'ALL')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-[#D32F2F] shadow-2xs hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between text-slate-500 group-hover:text-[#D32F2F] transition">
            <span className="text-xs font-semibold">Açık Talepler</span>
            <FolderOpen className="w-4 h-4 text-slate-400 group-hover:text-[#D32F2F]" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-800 group-hover:text-[#D32F2F] transition">{openMDTs.length}</span>
            <span className="text-[10px] text-slate-400 group-hover:text-red-600 font-medium flex items-center gap-0.5">
              <span>Listele</span>
              <ArrowRight className="w-2.5 h-2.5" />
            </span>
          </div>
        </div>

        {/* Card 2: Onayımı Bekleyen */}
        <div
          onClick={() => onNavigateTab('mdt-list', 'WAITING_FOR_ME')}
          className="bg-white p-4 rounded-xl border-2 border-amber-300 hover:border-amber-500 bg-amber-50/20 shadow-2xs hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between text-amber-800">
            <span className="text-xs font-bold">Onayımı Bekleyen</span>
            <Clock className="w-4 h-4 text-amber-600 group-hover:scale-110 transition" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-amber-900">{waitingForMe.length}</span>
            <span className="text-[10px] text-amber-700 font-semibold flex items-center gap-0.5">
              <span>Aksiyonunuz</span>
              <ArrowRight className="w-2.5 h-2.5" />
            </span>
          </div>
        </div>

        {/* Card 3: Müşteri Onayında */}
        <div
          onClick={() => onNavigateTab('mdt-list', 'MUSTERI_ONAYINDA')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-indigo-400 shadow-2xs hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between text-slate-500 group-hover:text-indigo-600 transition">
            <span className="text-xs font-semibold">Müşteri Onayında</span>
            <UserCheck className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-800 group-hover:text-indigo-700 transition">{inClientApproval.length}</span>
            <span className="text-[10px] text-indigo-500 font-medium flex items-center gap-0.5">
              <span>Süreçte</span>
              <ArrowRight className="w-2.5 h-2.5" />
            </span>
          </div>
        </div>

        {/* Card 4: Geciken Talepler */}
        <div
          onClick={() => onNavigateTab('mdt-list', 'DELAYED')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-red-400 shadow-2xs hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between text-slate-500 group-hover:text-red-600 transition">
            <span className="text-xs font-semibold">Geciken Talepler</span>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className={`text-2xl font-bold ${delayedMDTs.length > 0 ? 'text-red-700' : 'text-slate-800'}`}>
              {delayedMDTs.length}
            </span>
            <span className="text-[10px] text-red-500 font-medium flex items-center gap-0.5">
              <span>Termin Geçti</span>
              <ArrowRight className="w-2.5 h-2.5" />
            </span>
          </div>
        </div>

        {/* Card 5: Bu Ay Kapatılan */}
        <div
          onClick={() => onNavigateTab('mdt-list', 'KAPATILDI')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-emerald-400 shadow-2xs hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between text-slate-500 group-hover:text-emerald-600 transition">
            <span className="text-xs font-semibold">Bu Ay Kapatılan</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-800 group-hover:text-emerald-700 transition">{closedThisMonth.length}</span>
            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
              <span>Tamamlandı</span>
              <ArrowRight className="w-2.5 h-2.5" />
            </span>
          </div>
        </div>
      </div>

      {/* Middle Section: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Stacked - 1. Newly Created MDTs, 2. Assigned / Waiting for Me */}
        <div className="space-y-6 flex flex-col">
          {/* Block 1: "YENİ GİRİŞİ YAPILAN MDT TALEPLERİ" (New Incoming Requests) */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col">
            <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Yeni Girişi Yapılan MDT Talepleri
                </h2>
              </div>
              <button
                onClick={() => onNavigateTab('mdt-list', 'ALL')}
                className="text-[10px] text-slate-600 hover:text-slate-900 font-semibold flex items-center space-x-1"
              >
                <span>Tümünü Gör</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="p-4 flex-1 divide-y divide-slate-100">
              {newlyCreatedMDTs.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  Henüz bir MDT kaydı bulunmuyor.
                </div>
              ) : (
                newlyCreatedMDTs.map((m) => {
                  const project = projects.find((p) => p.id === m.projectId);
                  const openedUser = users.find((u) => u.id === m.openedById);
                  return (
                    <div
                      key={m.id}
                      onClick={() => onSelectMDT(m)}
                      className="py-3 cursor-pointer hover:bg-slate-50 transition p-2 rounded-lg flex items-center justify-between group"
                    >
                      <div className="space-y-1 min-w-0 flex-1 pr-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-slate-800 group-hover:text-[#D32F2F] transition">
                            {m.mdtNo}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            ({m.revisionNumber})
                          </span>
                          {getPriorityBadge(m.priority)}
                          {getStatusBadge(m.currentStatus)}
                        </div>
                        <div className="text-xs font-medium text-slate-700 truncate">
                          {m.title}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center space-x-2">
                          <span>Müşteri: {project?.clientName || 'Bilinmiyor'}</span>
                          <span>•</span>
                          <span>Açan: {openedUser?.name || 'Sistem'}</span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 shrink-0" />
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Block 2: "BANA ATANAN / ONAYIMI BEKLEYENLER" (Moved directly below) */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col">
            <div className="px-5 py-3.5 border-b border-slate-100 bg-amber-50/40 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-amber-600" />
                <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Bana Atanan / Onayımı Bekleyenler
                </h2>
              </div>
              <span className="text-[10px] text-amber-900 font-bold bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
                {waitingForMe.length} Aksiyon
              </span>
            </div>

            <div className="p-4 flex-1 divide-y divide-slate-100">
              {waitingForMe.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  Şu anda üzerinizde bekleyen aktif bir onay veya aksiyon bulunmuyor.
                </div>
              ) : (
                waitingForMe.map((m) => {
                  const project = projects.find((p) => p.id === m.projectId);
                  return (
                    <div
                      key={m.id}
                      onClick={() => onSelectMDT(m)}
                      className="py-3 cursor-pointer hover:bg-slate-50 transition p-2 rounded-lg flex items-center justify-between group"
                    >
                      <div className="space-y-1 min-w-0 flex-1 pr-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-slate-800 group-hover:text-[#D32F2F] transition">
                            {m.mdtNo}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            ({m.revisionNumber})
                          </span>
                          {getPriorityBadge(m.priority)}
                          {getStatusBadge(m.currentStatus)}
                        </div>
                        <div className="text-xs font-medium text-slate-700 truncate">
                          {m.title}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center space-x-2">
                          <span>Müşteri: {project?.clientName || 'Bilinmiyor'}</span>
                          <span>•</span>
                          <span>Canias: {project?.caniasProjeNo}</span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 shrink-0" />
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: "Kritik / Acil Talepler" */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col h-full">
          <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Kritik / Acil Talepler
              </h2>
            </div>
            <button
              onClick={() => onNavigateTab('kanban')}
              className="text-[10px] text-slate-600 hover:text-slate-900 font-semibold flex items-center space-x-1"
            >
              <span>Kanban'da Gör</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="p-4 flex-1 divide-y divide-slate-100">
            {criticalMDTs.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                Kritik veya yüksek öncelikli açık talep bulunmuyor.
              </div>
            ) : (
              criticalMDTs.map((m) => {
                const project = projects.find((p) => p.id === m.projectId);
                const assignedUser = users.find((u) => u.id === m.assignedToId);
                return (
                  <div
                    key={m.id}
                    onClick={() => onSelectMDT(m)}
                    className="py-3 cursor-pointer hover:bg-slate-50 transition p-2 rounded-lg flex items-center justify-between group"
                  >
                    <div className="space-y-1 min-w-0 flex-1 pr-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-800 group-hover:text-[#D32F2F] transition">
                          {m.mdtNo}
                        </span>
                        {getPriorityBadge(m.priority)}
                        {getStatusBadge(m.currentStatus)}
                      </div>
                      <div className="text-xs font-medium text-slate-700 truncate">
                        {m.title}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center space-x-2">
                        <span>Atanan: {assignedUser?.name || 'Atanmadı'}</span>
                        <span>•</span>
                        <span>Termin: {new Date(m.targetDate).toLocaleDateString('tr-TR')}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 shrink-0" />
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section: Active Projects Progress & Staff Workload */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Projects Progress (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-2xs p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Aktif Proje İlerleme Durumu (% Tamamlanma)
            </h2>
            <span className="text-[10px] text-slate-400">Talep Kapanış Oranları</span>
          </div>

          <div className="space-y-4">
            {projects.map((proj) => {
              const projMdts = mdts.filter((m) => m.projectId === proj.id);
              const total = projMdts.length;
              const closed = projMdts.filter((m) => m.currentStatus === 'KAPATILDI').length;
              const percent = total > 0 ? Math.round((closed / total) * 100) : 0;

              return (
                <div key={proj.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{proj.caniasProjeNo}</span>
                    <span className="text-slate-500 font-medium">
                      {closed} / {total} MDT Kapatıldı ({percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-[#D32F2F] h-full rounded-full transition-all duration-300"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Staff Workload Table (1 Col) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">
            Tasarım Mühendisi İş Yükü
          </h2>
          <div className="divide-y divide-slate-100">
            {staffWorkload.map((st) => (
              <div key={st.user.id} className="py-2.5 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-full bg-slate-800 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                    {st.user.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <div className="text-xs font-medium text-slate-800">{st.user.name}</div>
                    <div className="text-[10px] text-slate-400">{st.user.title}</div>
                  </div>
                </div>
                <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                  {st.count} Açık İş
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

