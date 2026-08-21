import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Plus,
  History,
  Download,
  Search,
  Filter,
  ArrowUpDown,
} from 'lucide-react';
import { MDTRequest, Project, User } from '../types';

interface MDTListProps {
  mdts: MDTRequest[];
  projects: Project[];
  users: User[];
  currentUser: User;
  initialFilter?: string;
  onSelectMDT: (mdt: MDTRequest) => void;
  onOpenNewMDT: (isRetro?: boolean) => void;
}

export const MDTList: React.FC<MDTListProps> = ({
  mdts,
  projects,
  users,
  currentUser,
  initialFilter = 'ALL',
  onSelectMDT,
  onOpenNewMDT,
}) => {
  const [selectedYear, setSelectedYear] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>(initialFilter);
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');

  useEffect(() => {
    if (initialFilter) {
      setStatusFilter(initialFilter);
    }
  }, [initialFilter]);

  const now = new Date();

  // Filter MDTs
  const filteredMDTs = mdts.filter((m) => {
    if (selectedYear !== 'ALL' && m.year !== parseInt(selectedYear, 10)) {
      return false;
    }
    
    // Special Filters from KPI cards
    if (statusFilter === 'WAITING_FOR_ME') {
      let isWaiting = false;
      if (currentUser.role === 'admin') isWaiting = m.currentStatus === 'MEHMET_ONAYINDA';
      else if (currentUser.role === 'electrical_design') isWaiting = m.assignedToId === currentUser.id && (m.currentStatus === 'TASARIMDA' || m.currentStatus === 'REVIZYON_ISTENDI');
      else if (currentUser.role === 'mechanical_approval') isWaiting = m.currentStatus === 'MEKANIK_ONAYDA';
      else if (currentUser.role === 'executive_approval') isWaiting = m.currentStatus === 'UST_ONAYDA';
      else if (currentUser.role === 'project_management') isWaiting = m.currentStatus === 'MUSTERI_ONAYINDA';
      else if (currentUser.role === 'sales') isWaiting = m.openedById === currentUser.id && m.currentStatus === 'YENI';
      
      if (!isWaiting) return false;
    } else if (statusFilter === 'DELAYED') {
      if (m.currentStatus === 'KAPATILDI' || m.currentStatus === 'REDDEDILDI') return false;
      if (!m.targetDate || new Date(m.targetDate) >= now) return false;
    } else if (statusFilter === 'CLOSED_THIS_MONTH') {
      if (m.currentStatus !== 'KAPATILDI' || !m.closedAt) return false;
      const closedDate = new Date(m.closedAt);
      if (closedDate.getMonth() !== now.getMonth() || closedDate.getFullYear() !== now.getFullYear()) return false;
    } else if (statusFilter !== 'ALL' && m.currentStatus !== statusFilter) {
      return false;
    }

    if (priorityFilter !== 'ALL' && m.priority !== priorityFilter) {
      return false;
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const project = projects.find((p) => p.id === m.projectId);
      const matchesNo = m.mdtNo.toLowerCase().includes(q);
      const matchesTitle = m.title.toLowerCase().includes(q);
      const matchesClient = project?.clientName.toLowerCase().includes(q);
      const matchesCanias = project?.caniasProjeNo.toLowerCase().includes(q);
      if (!matchesNo && !matchesTitle && !matchesClient && !matchesCanias) {
        return false;
      }
    }
    return true;
  });

  // Export CSV helper
  const exportToCSV = () => {
    const headers = [
      'MDT No',
      'Revizyon',
      'Müşteri',
      'Canias Proje No',
      'Talep Konusu',
      'Talep Türü',
      'Mekanik Etki',
      'Öncelik',
      'Durum',
      'Atanan',
      'Açılış Tarihi',
      'Hedef Tarih',
      'Kapanış Tarihi',
    ];

    const rows = filteredMDTs.map((m) => {
      const project = projects.find((p) => p.id === m.projectId);
      const assigned = users.find((u) => u.id === m.assignedToId);
      return [
        m.mdtNo,
        m.revisionNumber,
        `"${project?.clientName || ''}"`,
        `"${project?.caniasProjeNo || ''}"`,
        `"${m.title.replace(/"/g, '""')}"`,
        m.requestType,
        m.hasMechanicalEffect ? 'Evet' : 'Hayır',
        m.priority,
        m.currentStatus,
        `"${assigned?.name || 'Atanmadı'}"`,
        m.createdAt ? new Date(m.createdAt).toLocaleDateString('tr-TR') : '',
        m.targetDate ? new Date(m.targetDate).toLocaleDateString('tr-TR') : '',
        m.closedAt ? new Date(m.closedAt).toLocaleDateString('tr-TR') : '',
      ];
    });

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `EKOS_MDT_Listesi_${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'YENI':
        return <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-semibold">1. Değerlendirme</span>;
      case 'TASARIMDA':
        return <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[10px] font-semibold">2. Tasarımda</span>;
      case 'MEKANIK_ONAYDA':
        return <span className="bg-amber-50 text-amber-800 px-2 py-0.5 rounded text-[10px] font-semibold">3. Mekanik Onayda</span>;
      case 'MEHMET_ONAYINDA':
        return <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded text-[10px] font-bold">4. Yönetici Onayında</span>;
      case 'UST_ONAYDA':
        return <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded text-[10px] font-semibold">5. Üst Onayda</span>;
      case 'SATIS_KONTROLUNDE':
        return <span className="bg-sky-50 text-sky-700 px-2 py-0.5 rounded text-[10px] font-semibold">6. Satış Onayında</span>;
      case 'MUSTERI_ONAYINDA':
        return <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-[10px] font-semibold">7. Müşteri Onayında</span>;
      case 'REVIZYON_ISTENDI':
        return <span className="bg-rose-50 text-rose-700 px-2 py-0.5 rounded text-[10px] font-semibold">8. Revizyon İstendi</span>;
      case 'KAPATILDI':
        return <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-semibold">9. Kapatıldı</span>;
      case 'REDDEDILDI':
        return <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded text-[10px] font-semibold">Reddedildi</span>;
      case 'IPTAL_EDILDI':
        return <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded text-[10px] font-semibold line-through">İptal Edildi</span>;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-4 max-w-7xl mx-auto">
      {/* Header & Controls */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-base font-bold text-slate-800">Tüm MDT Talepleri</h1>
            <p className="text-xs text-slate-500">
              EKOS Elektrik Mühendislik-Tasarım Proje & Revizyon Kayıt Listesi
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={exportToCSV}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-semibold border border-slate-200 transition"
              title="Excel / CSV Olarak İndir"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Dışa Aktar (Excel)</span>
            </button>

            

            <button
              onClick={() => onOpenNewMDT(false)}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#D32F2F] hover:bg-red-700 text-white rounded-md text-xs font-semibold transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Yeni MDT Talebi</span>
            </button>
          </div>
        </div>

        {/* Filter Bar with Year Selector */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            {/* Year selector buttons */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              {['ALL', '2026', '2025', '2024'].map((yr) => (
                <button
                  key={yr}
                  onClick={() => setSelectedYear(yr)}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition ${
                    selectedYear === yr
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {yr === 'ALL' ? 'Tüm Yıllar' : yr}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-700 font-medium focus:outline-hidden focus:border-red-500"
            >
              <option value="ALL">Tüm Durumlar</option>
              <option value="WAITING_FOR_ME">⚡ Onayımı Bekleyenler</option>
              <option value="DELAYED">⚠️ Geciken Talepler</option>
              <option value="CLOSED_THIS_MONTH">✅ Bu Ay Kapatılanlar</option>
              <option value="YENI">1. Yönetici Değerlendirmesi</option>
              <option value="TASARIMDA">2. Tasarımda</option>
              <option value="MEKANIK_ONAYDA">3. Mekanik Onayda</option>
              <option value="MEHMET_ONAYINDA">4. Yönetici Onayında</option>
              <option value="UST_ONAYDA">5. Üst Onayda</option>
              <option value="SATIS_KONTROLUNDE">6. Satış Onayında</option>
              <option value="MUSTERI_ONAYINDA">7. Müşteri Onayında</option>
              <option value="REVIZYON_ISTENDI">8. Revizyon İstendi</option>
              <option value="KAPATILDI">9. Kapatıldı</option>
            </select>

            {/* Search Input */}
            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="MDT No, Müşteri, Canias arayın..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-800 focus:outline-hidden"
              />
            </div>
          </div>

          <span className="text-xs text-slate-500 font-medium">
            Görüntülenen: <strong className="text-slate-800">{filteredMDTs.length}</strong> kayıt
          </span>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3">MDT No</th>
                <th className="px-4 py-3">Müşteri</th>
                <th className="px-4 py-3">Proje / Canias No</th>
                <th className="px-4 py-3">Talep Konusu</th>
                <th className="px-4 py-3">Tür</th>
                <th className="px-4 py-3">Öncelik</th>
                <th className="px-4 py-3">Durum</th>
                <th className="px-4 py-3">Atanan</th>
                <th className="px-4 py-3">Açılış Tarihi</th>
                <th className="px-4 py-3">Hedef Tarih</th>
                <th className="px-4 py-3">Kapanış</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMDTs.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-4 py-12 text-center text-slate-400">
                    Seçilen kriterlere uygun MDT talebi bulunamadı.
                  </td>
                </tr>
              ) : (
                filteredMDTs.map((m) => {
                  const project = projects.find((p) => p.id === m.projectId);
                  const assigned = users.find((u) => u.id === m.assignedToId);

                  return (
                    <tr
                      key={m.id}
                      onClick={() => onSelectMDT(m)}
                      className="hover:bg-slate-50/80 cursor-pointer transition"
                    >
                      <td className="px-4 py-3 font-bold text-slate-900 whitespace-nowrap">
                        <div className="flex items-center space-x-1">
                          <span>{m.mdtNo}</span>
                          <span className="text-[10px] text-slate-400 font-normal">
                            ({m.revisionNumber})
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-800 max-w-[160px] truncate">
                        {project?.clientName || '-'}
                      </td>
                      <td className="px-4 py-3 text-slate-600 font-medium whitespace-nowrap">
                        {project?.caniasProjeNo || '-'}
                      </td>
                      <td className="px-4 py-3 text-slate-800 font-medium max-w-[240px] truncate">
                        {m.title}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {m.requestType === 'ELEKTRIK_MEKANIK' ? (
                          <span className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-medium">
                            Elk + Mek
                          </span>
                        ) : m.requestType === 'MEKANIK' ? (
                          <span className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded font-medium">
                            Mekanik
                          </span>
                        ) : (
                          <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-medium">
                            Elektrik
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {m.priority === 'KRITIK' ? (
                          <span className="text-red-700 font-bold bg-red-100 text-[10px] px-1.5 py-0.5 rounded">
                            Kritik
                          </span>
                        ) : m.priority === 'YUKSEK' ? (
                          <span className="text-amber-700 font-semibold bg-amber-100 text-[10px] px-1.5 py-0.5 rounded">
                            Yüksek
                          </span>
                        ) : (
                          <span className="text-slate-600 bg-slate-100 text-[10px] px-1.5 py-0.5 rounded">
                            {m.priority}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {getStatusBadge(m.currentStatus)}
                      </td>
                      <td className="px-4 py-3 text-slate-700 font-medium whitespace-nowrap">
                        {assigned?.name || 'Atanmadı'}
                      </td>
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                        {new Date(m.createdAt).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                        {m.targetDate
                          ? new Date(m.targetDate).toLocaleDateString('tr-TR')
                          : '-'}
                      </td>
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                        {m.closedAt
                          ? new Date(m.closedAt).toLocaleDateString('tr-TR')
                          : '-'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
