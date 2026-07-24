import React, { useState } from 'react';
import { History, Download, Search, ShieldCheck } from 'lucide-react';
import { AuditLog } from '../types';

interface AuditLogsProps {
  logs: AuditLog[];
}

export const AuditLogs: React.FC<AuditLogsProps> = ({ logs }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const filteredLogs = logs.filter((l) => {
    if (typeFilter !== 'ALL' && l.recordType !== typeFilter) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchUser = l.userName.toLowerCase().includes(q);
      const matchAction = l.action.toLowerCase().includes(q);
      const matchRecord = l.recordId.toLowerCase().includes(q);
      if (!matchUser && !matchAction && !matchRecord) return false;
    }
    return true;
  });

  const exportCSV = () => {
    const headers = ['Tarih/Saat', 'Kullanıcı', 'İşlem Türü', 'Kayıt ID', 'Açıklama', 'Eski Değer', 'Yeni Değer'];
    const rows = filteredLogs.map((l) => [
      new Date(l.timestamp).toLocaleString('tr-TR'),
      `"${l.userName}"`,
      l.recordType,
      l.recordId,
      `"${l.action.replace(/"/g, '""')}"`,
      `"${(l.oldValue || '').replace(/"/g, '""')}"`,
      `"${(l.newValue || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'EKOS_Denetim_Loglari.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 space-y-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-slate-900 text-white rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-800">
                Sistem Denetim Logları (Audit Trails)
              </h1>
              <p className="text-xs text-slate-500">
                ISO 9001 & Mühendislik Değişiklik Yönetimi Tam İzlenebilirlik Kayıtları
              </p>
            </div>
          </div>

          <button
            onClick={exportCSV}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-md text-xs font-semibold transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Denetim Raporu İndir (Excel)</span>
          </button>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center space-x-3">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 font-medium"
            >
              <option value="ALL">Tüm Kayıt Türleri</option>
              <option value="MDT">MDT İşlemleri</option>
              <option value="KULLANICI">Kullanıcı Yetkileri</option>
              <option value="PROJE">Proje Tanımları</option>
              <option value="SISTEM">Sistem Yapılandırması</option>
            </select>

            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Kullanıcı, işlem veya MDT arayın..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 focus:outline-hidden"
              />
            </div>
          </div>

          <span className="text-xs text-slate-500 font-medium">
            Toplam <strong className="text-slate-800">{filteredLogs.length}</strong> log kaydı
          </span>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3">Tarih / Saat</th>
                <th className="px-4 py-3">Kullanıcı</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3">Kayıt ID</th>
                <th className="px-4 py-3">İşlem Detayı</th>
                <th className="px-4 py-3">Eski Değer → Yeni Değer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                    Sistem denetim kaydı bulunamadı.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap font-sans text-xs">
                      {new Date(log.timestamp).toLocaleString('tr-TR')}
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-800 font-sans text-xs">
                      {log.userName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-sans">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-bold">
                        {log.recordType}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-700 whitespace-nowrap">
                      {log.recordId}
                    </td>
                    <td className="px-4 py-3 text-slate-800 font-sans text-xs">
                      {log.action}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {log.oldValue || log.newValue ? (
                        <span>
                          <span className="text-rose-600">{log.oldValue || '—'}</span>
                          <span className="mx-1 text-slate-400">→</span>
                          <span className="text-emerald-600">{log.newValue || '—'}</span>
                        </span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
