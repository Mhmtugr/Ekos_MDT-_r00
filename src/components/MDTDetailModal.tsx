import React, { useState } from 'react';
import {
  X,
  FolderSymlink,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Send,
  FileText,
  UserCheck,
  Paperclip,
  MessageSquare,
  Clock,
  ShieldAlert,
  ChevronRight,
  Copy,
  AlertCircle,
  ExternalLink,
  Trash2,
  Ban,
  FolderOpen,
} from 'lucide-react';
import { MDTRequest, Project, User, ApprovalRecord } from '../types';
import { apiService } from '../services/apiService';

interface MDTDetailModalProps {
  mdt: MDTRequest;
  projects: Project[];
  users: User[];
  currentUser: User;
  onClose: () => void;
  onUpdateMDT: (updated: MDTRequest, auditMsg: string) => void;
  onDeleteMDT?: (id: string) => void;
}

export const MDTDetailModal: React.FC<MDTDetailModalProps> = ({
  mdt,
  projects,
  users,
  currentUser,
  onClose,
  onUpdateMDT,
  onDeleteMDT,
}) => {
  const project = projects.find((p) => p.id === mdt.projectId);
  const openedByUser = users.find((u) => u.id === mdt.openedById);
  const assignedUser = users.find((u) => u.id === mdt.assignedToId);

  // Local state for actions
  const [commentText, setCommentText] = useState('');
  const [actionReason, setActionReason] = useState('');
  const [clientRequestText, setClientRequestText] = useState(mdt.clientSpecialRequest || '');
  const [showReasonInput, setShowReasonInput] = useState<string | null>(null);
  const [selectedExecutive, setSelectedExecutive] = useState<string>('u16'); // Tamer by default
  const [copiedServerPath, setCopiedServerPath] = useState(false);
  const [showNetworkToast, setShowNetworkToast] = useState(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Technical docs editing
  const [secNo, setSecNo] = useState(mdt.technicalDocs.secondaryProjectNo || '');
  const [sldNo, setSldNo] = useState(mdt.technicalDocs.sldLayoutNo || '');
  const [secStatus, setSecStatus] = useState(mdt.technicalDocs.secondaryProjectClientApproved || 'BEKLIYOR');

  // Determine user roles & permissions
  const isMehmet = currentUser.role === 'admin';
  const isElectricalDesign = currentUser.role === 'electrical_design';
  const isMechanical = currentUser.role === 'mechanical_approval';
  const isExecutive = currentUser.role === 'executive_approval';
  const isProjectManager = currentUser.role === 'project_management';
  const isSales = currentUser.role === 'sales';
  const isCreator = mdt.openedById === currentUser.id || isMehmet;

  // 24-Hour and untouched deletion condition
  const hoursSinceCreation = (Date.now() - new Date(mdt.createdAt).getTime()) / (1000 * 60 * 60);
  const isUntouched = (mdt.approvals?.length || 0) === 0 && (mdt.comments?.length || 0) === 0 && (mdt.files?.length || 0) === 0;
  const canDelete = isCreator && isUntouched && (hoursSinceCreation <= 24 || isMehmet) && mdt.currentStatus !== 'KAPATILDI';
  const canCancel = isCreator && mdt.currentStatus !== 'KAPATILDI' && mdt.currentStatus !== 'IPTAL_EDILDI';

  const copyServerPath = () => {
    const p = project?.serverFolderPath || `\\\\Ekosfilesrv\\ekos\\PROJELER\\${project?.caniasProjeNo || '26040006'}\\REV`;
    navigator.clipboard.writeText(p);
    setCopiedServerPath(true);
    setToastMessage('Sunucu dosya bağlantısı panoya kopyalandı.');
    setShowNetworkToast(true);
    setTimeout(() => setCopiedServerPath(false), 3000);
  };

  const handleOpenFolderExplorer = async () => {
    const p = project?.serverFolderPath || `\\\\Ekosfilesrv\\ekos\\PROJELER\\${project?.caniasProjeNo || '26040006'}\\REV`;
    try {
      const res = await apiService.openProjectFolder(p);
      setToastMessage(res.message || 'Klasör Windows Gezgininde açıldı.');
      setShowNetworkToast(true);
    } catch (err: any) {
      setToastMessage('Klasör açma komutu gönderildi.');
      setShowNetworkToast(true);
    }
  };

  // Helper to handle optimistic locking conflicts gracefully
  const handleOptimisticConflict = async (err: any) => {
    const msg = err.message || '';
    if (msg.includes('Optimistic Locking') || msg.includes('409') || msg.includes('Versiyon')) {
      alert('⚠️ Bilgi: Bu talep başka bir kullanıcı veya sekme tarafından güncellenmiştir. Son veriler getiriliyor, lütfen işleminizi tekrar deneyiniz.');
      try {
        const mdts = await apiService.getMDTs();
        const latest = mdts.find((m) => m.id === mdt.id);
        if (latest) {
          onUpdateMDT(latest, 'Veri güncellendi (Senkronizasyon)');
        }
      } catch (e) {
        // ignore
      }
    } else {
      alert(msg || 'İşlem gerçekleştirilemedi.');
    }
  };

  // Add Comment
  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    try {
      const updated = await apiService.addComment(mdt.id, commentText);
      onUpdateMDT(updated, `Yorum eklendi: "${commentText.slice(0, 30)}..."`);
      setCommentText('');
    } catch (err: any) {
      await handleOptimisticConflict(err);
    }
  };

  // Save Client Request Info
  const handleSaveClientRequest = async () => {
    try {
      const updated = await apiService.updateMDT(mdt.id, {
        version: mdt.version,
        clientSpecialRequest: clientRequestText,
      });
      onUpdateMDT(updated, 'Müşteri & Revizyon Talebi Detayı güncellendi.');
    } catch (err: any) {
      await handleOptimisticConflict(err);
    }
  };

  // Save Technical Docs Info
  const handleSaveTechDocs = async () => {
    const updatedDocs = {
      ...mdt.technicalDocs,
      secondaryProjectNo: secNo,
      sldLayoutNo: sldNo,
      secondaryProjectClientApproved: secStatus,
      drawnById: mdt.technicalDocs.drawnById || currentUser.id,
    };
    try {
      const updated = await apiService.updateMDT(mdt.id, {
        version: mdt.version,
        technicalDocs: updatedDocs,
      });
      onUpdateMDT(updated, 'Teknik doküman takip bilgileri güncellendi.');
    } catch (err: any) {
      await handleOptimisticConflict(err);
    }
  };

  // Assign Engineer (Only Mehmet Uğur)
  const handleAssignEngineer = async (engineerId: string) => {
    if (!isMehmet) return;
    try {
      const updated = await apiService.updateMDT(mdt.id, {
        version: mdt.version,
        assignedToId: engineerId || undefined,
      });
      const engName = users.find((u) => u.id === engineerId)?.name || 'Atanmadı';
      onUpdateMDT(updated, `Mühendislik Yöneticisi tarafından ${engName} atandı.`);
    } catch (err: any) {
      await handleOptimisticConflict(err);
    }
  };

  // Approval Action Execution
  const handleExecuteAction = async (
    newStatus: MDTRequest['currentStatus'],
    actionType: 'ONAY' | 'RED' | 'REVIZYON',
    actionLabel: string
  ) => {
    const approvalType =
      currentUser.role === 'mechanical_approval'
        ? 'MEKANIK'
        : currentUser.role === 'executive_approval'
        ? 'UST'
        : 'ELEKTRIK';

    try {
      // First add approval record
      await apiService.addApproval(mdt.id, approvalType, actionType, actionReason || 'Aksiyon tamamlandı.');

      // Second update status via server state machine
      const updated = await apiService.updateMDTStatus(mdt.id, newStatus, {
        reason: actionReason || 'Aksiyon tamamlandı.',
        closureNote: newStatus === 'KAPATILDI' ? (actionReason || 'Talep kapatıldı.') : undefined,
        rejectionReason: newStatus === 'REDDEDILDI' || newStatus === 'REVIZYON_ISTENDI' ? (actionReason || 'Reddedildi / Revizyon istendi.') : undefined,
        expectedVersion: mdt.version,
      });

      onUpdateMDT(
        updated,
        `Talep '${actionLabel}' işlemi ile ${newStatus} statüsüne alındı.`
      );
      setActionReason('');
      setShowReasonInput(null);
    } catch (err: any) {
      await handleOptimisticConflict(err);
    }
  };

  // Mechanical Approval trigger by Design Engineer (Atomic state update)
  const handleRequestMechanical = async () => {
    try {
      const updated = await apiService.updateMDTStatus(mdt.id, 'MEKANIK_ONAYDA', {
        reason: 'Mekanik tasarım kontrolü istendi.',
        expectedVersion: mdt.version,
      });
      onUpdateMDT(
        updated,
        'Mühendislik Birimi tarafından Mekanik Tasarım Etkisi tanımlandı ve talep Mekanik Tasarıma yönlendirildi (Erhan Gürbüz).'
      );
    } catch (err: any) {
      await handleOptimisticConflict(err);
    }
  };

  // Send to Mehmet Uğur (Atomic state update)
  const handleSendToMehmet = async () => {
    try {
      const updated = await apiService.updateMDTStatus(mdt.id, 'MEHMET_ONAYINDA', {
        reason: 'Mehmet Uğur onayına gönderildi.',
        expectedVersion: mdt.version,
      });
      onUpdateMDT(updated, 'Talep Mehmet Uğur onayına gönderildi.');
    } catch (err: any) {
      await handleOptimisticConflict(err);
    }
  };

  // Send to Executive Approval (Tamer / Yasin)
  const handleSendToExecutive = async () => {
    try {
      const execUser = users.find((u) => u.id === selectedExecutive);
      const updated = await apiService.updateMDTStatus(mdt.id, 'UST_ONAYDA', {
        reason: `Üst Onay Talebi açıldı (${execUser?.name || 'Üst Yönetim'} atandı: ${actionReason || 'Gerekçe belirtildi'}).`,
        expectedVersion: mdt.version,
      });
      onUpdateMDT(
        updated,
        `Üst Onay Talebi açıldı (${execUser?.name || 'Üst Yönetim'} atandı).`
      );
      setActionReason('');
      setShowReasonInput(null);
    } catch (err: any) {
      await handleOptimisticConflict(err);
    }
  };

  // Delete MDT within 24h by Creator
  const handleDeleteMDT = async () => {
    if (!window.confirm(`${mdt.mdtNo} numaralı MDT talebini kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`)) {
      return;
    }
    setIsDeleting(true);
    try {
      await apiService.deleteMDT(mdt.id);
      if (onDeleteMDT) {
        onDeleteMDT(mdt.id);
      }
      onClose();
    } catch (err: any) {
      setIsDeleting(false);
      await handleOptimisticConflict(err);
    }
  };

  // Cancel MDT by Creator
  const handleCancelMDT = async () => {
    if (!actionReason.trim()) {
      alert('Lütfen iptal gerekçesini belirtiniz.');
      return;
    }
    try {
      const updated = await apiService.cancelMDT(mdt.id, actionReason.trim());
      onUpdateMDT(updated, `Talep Sahibi Tarafından İptal Edildi: ${actionReason.trim()}`);
      setActionReason('');
      setShowReasonInput(null);
    } catch (err: any) {
      await handleOptimisticConflict(err);
    }
  };

  // Client Revision Request -> Creates Rev.01 / Rev.02
  const handleCreateNewRevision = async () => {
    const nextRevNum = `Rev.0${
      parseInt(mdt.revisionNumber.replace('Rev.0', ''), 10) + 1
    }`;
    try {
      const updated = await apiService.updateMDTStatus(mdt.id, 'TASARIMDA', {
        reason: 'Müşteri revizyonu açıldı.',
        expectedVersion: mdt.version,
      });
      await apiService.updateMDT(mdt.id, {
        version: updated.version,
        revisionNumber: nextRevNum,
      });
      onUpdateMDT(
        updated,
        `Müşteri revizyonu sebebiyle ${nextRevNum} oluşturuldu ve Tasarım aşamasına alındı.`
      );
    } catch (err: any) {
      await handleOptimisticConflict(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-150">
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3 min-w-0">
            <span className="bg-[#D32F2F] text-white font-bold text-xs px-2.5 py-1 rounded shadow-2xs">
              {mdt.mdtNo}
            </span>
            <span className="text-xs font-semibold text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded">
              {mdt.revisionNumber}
            </span>
            <h2 className="text-sm font-bold text-slate-800 truncate">
              {mdt.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Scroll Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-700">
          {/* UNC Server Folder Banner */}
          <div className="p-3 bg-slate-900 text-slate-200 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3 min-w-0">
              <FolderSymlink className="w-4 h-4 text-red-400 shrink-0" />
              <div className="min-w-0">
                <div className="font-semibold text-white">
                  Şirket Sunucu Dosya Bağlantısı (CANIAS UNC Path):
                </div>
                <div className="text-[11px] text-slate-300 font-mono mt-0.5 truncate select-all">
                  {project?.serverFolderPath || `\\\\Ekosfilesrv\\ekos\\PROJELER\\${project?.caniasProjeNo || '26040006'}\\REV`}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={handleOpenFolderExplorer}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded text-xs font-semibold transition shadow-xs"
                title="Windows Gezgininde Klasörü Aç"
              >
                <FolderOpen className="w-3.5 h-3.5" />
                <span>Klasörü Aç</span>
              </button>
              <button
                onClick={copyServerPath}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-semibold border border-slate-700 transition"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedServerPath ? 'Kopyalandı!' : 'Yolu Kopyala'}</span>
              </button>
            </div>
          </div>

          {showNetworkToast && (
            <div className="p-2.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-md text-[11px] flex items-center justify-between animate-in fade-in">
              <span>
                <strong>Bilgi:</strong> {toastMessage || 'Sunucu dosya bağlantısı kopyalandı. Bu bağlantıya yalnızca şirket ağından (LAN / VPN) erişilebilir.'}
              </span>
              <button
                onClick={() => setShowNetworkToast(false)}
                className="text-amber-600 font-bold ml-2 hover:underline"
              >
                Tamam
              </button>
            </div>
          )}

          {/* Section 1: Top Status & Overview Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">
                Müşteri Adı
              </div>
              <div className="font-bold text-slate-800 mt-0.5">
                {project?.clientName}
              </div>
            </div>

            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">
                Canias Proje No
              </div>
              <div className="font-bold text-slate-800 mt-0.5">
                {project?.caniasProjeNo}
              </div>
            </div>

            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">
                Mevcut Statü
              </div>
              <div className="font-bold text-[#D32F2F] mt-0.5">
                {mdt.currentStatus}
              </div>
            </div>

            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">
                Süreç Tipi (Turquality)
              </div>
              <div className="mt-0.5">
                {mdt.currentStatus === 'UST_ONAYDA' ? (
                  <span className="text-[10px] bg-purple-100 text-purple-900 border border-purple-300 px-2 py-0.5 rounded font-bold inline-block">
                    {mdt.reason?.toLowerCase().includes('yasin') || mdt.reason?.toLowerCase().includes('genel müdür')
                      ? 'Stratejik / Yüksek Bütçeli Onay'
                      : 'Ar-Ge Riskli Onay'}
                  </span>
                ) : mdt.hasMechanicalEffect ? (
                  <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded font-bold inline-block">
                    Mekanik + Elektrik Revizyon
                  </span>
                ) : (
                  <span className="text-[10px] bg-blue-100 text-blue-900 border border-blue-300 px-2 py-0.5 rounded font-bold inline-block">
                    Standart Revizyon (1. Seviye)
                  </span>
                )}
              </div>
            </div>

            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">
                Öncelik
              </div>
              <div className="font-bold text-slate-800 mt-0.5">
                {mdt.priority}
              </div>
            </div>

            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">
                Talebi Açan
              </div>
              <div className="font-semibold text-slate-700 mt-0.5">
                {openedByUser?.name || 'Satış Personeli'}
              </div>
            </div>

            {/* Atanan Mühendis (Editable ONLY by Mehmet Uğur - Rule 3.1) */}
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center justify-between">
                <span>Atanan Mühendis</span>
                {isMehmet && <span className="text-[9px] text-[#D32F2F] font-semibold">(Yönetici Yetkisi)</span>}
              </div>
              <div className="mt-0.5">
                {isMehmet ? (
                  <select
                    value={mdt.assignedToId || ''}
                    onChange={(e) => handleAssignEngineer(e.target.value)}
                    className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-red-500"
                  >
                    <option value="">-- Mühendis Seçiniz --</option>
                    {users
                      .filter((u) => u.role === 'electrical_design' || u.role === 'admin')
                      .map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.role === 'admin' ? 'Müh. Yöneticisi' : 'Elektrik Tasarım'})
                        </option>
                      ))}
                  </select>
                ) : (
                  <div className="font-semibold text-slate-700 py-0.5">
                    {assignedUser?.name || 'Atanmadı'}
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">
                Açılış Tarihi
              </div>
              <div className="text-slate-600 mt-0.5">
                {new Date(mdt.createdAt).toLocaleDateString('tr-TR')}
              </div>
            </div>
          </div>

          {/* Section 2: Request Detail Description */}
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Müşteri & Revizyon Talebi Detayı
              </h3>
              {isCreator && (
                <button
                  onClick={handleSaveClientRequest}
                  className="text-[10px] bg-slate-800 hover:bg-slate-900 text-white font-semibold px-2.5 py-1 rounded transition"
                >
                  Değişiklikleri Kaydet
                </button>
              )}
            </div>
            {isCreator ? (
              <textarea
                value={clientRequestText}
                onChange={(e) => setClientRequestText(e.target.value)}
                className="w-full p-3.5 bg-white border border-slate-300 rounded-lg text-slate-800 leading-relaxed font-normal whitespace-pre-wrap focus:outline-hidden focus:border-slate-500"
                rows={4}
                placeholder="Talebiniz veya müşteri detayını buraya girin..."
              />
            ) : (
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 leading-relaxed font-normal whitespace-pre-wrap">
                {mdt.clientSpecialRequest}
              </div>
            )}
            {mdt.reason && (
              <div className="text-[11px] text-slate-500 italic">
                Değişiklik Gerekçesi / Notu: {mdt.reason}
              </div>
            )}
          </div>

          {/* Section 3: Technical Document Tracking Matrix */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Teknik Doküman Takip Matrisi
              </h3>
              <button
                onClick={handleSaveTechDocs}
                className="text-[10px] bg-slate-800 hover:bg-slate-900 text-white font-semibold px-2.5 py-1 rounded transition"
              >
                Değişiklikleri Kaydet
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 border border-slate-200 rounded-xl">
              <div className="space-y-2">
                <label className="block text-[11px] font-semibold text-slate-700">
                  Sekonder Proje No
                </label>
                <input
                  type="text"
                  value={secNo}
                  onChange={(e) => setSecNo(e.target.value)}
                  placeholder="ör. 26040006-SEC-01"
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded text-xs text-slate-800"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-semibold text-slate-700">
                  Müşteri Sekonder Proje Onayı
                </label>
                {isCreator || isMehmet ? (
                  <select
                    value={secStatus}
                    onChange={(e) => setSecStatus(e.target.value as any)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded text-xs text-slate-800"
                  >
                    <option value="BEKLIYOR">Müşteri Onayı Bekliyor</option>
                    <option value="ONAYLANDI">Müşteri Tarafından Onaylandı</option>
                    <option value="REVIZYON">Müşteri Revizyon İstedi</option>
                  </select>
                ) : (
                  <div className="w-full px-3 py-1.5 bg-slate-100 border border-slate-200 rounded text-xs text-slate-600 font-semibold h-[30px] flex items-center">
                    {secStatus === 'ONAYLANDI' ? 'Müşteri Tarafından Onaylandı' : secStatus === 'REVIZYON' ? 'Müşteri Revizyon İstedi' : 'Müşteri Onayı Bekliyor'}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-semibold text-slate-700">
                  Tek Hat (SLD) & Layout Proje No
                </label>
                <input
                  type="text"
                  value={sldNo}
                  onChange={(e) => setSldNo(e.target.value)}
                  placeholder="ör. 26040006-SLD-01"
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded text-xs text-slate-800"
                />
              </div>

              <div className="space-y-1 text-[11px] text-slate-600 pt-2">
                <div>
                  <strong>Çizen:</strong> {users.find((u) => u.id === mdt.technicalDocs.drawnById)?.name || assignedUser?.name || 'Tasarımcı Bekleniyor'}
                </div>
                <div>
                  <strong>Kontrol Eden (Elektrik):</strong> {mdt.approvals.find(a => a.type === 'ELEKTRIK' && a.decision === 'ONAY')?.approverName || 'Onay Bekleniyor'}
                </div>
                <div>
                  <strong>Kontrol Eden (Mekanik):</strong> {mdt.approvals.find(a => a.type === 'MEKANIK' && a.decision === 'ONAY')?.approverName || (mdt.hasMechanicalEffect ? 'Onay Bekleniyor' : 'Gerekmiyor')}
                </div>
                {mdt.approvals.some(a => a.type === 'UST' && a.decision === 'ONAY') && (
                  <div>
                    <strong>Üst Onay:</strong> {mdt.approvals.find(a => a.type === 'UST' && a.decision === 'ONAY')?.approverName}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 4: Approval Flow Timeline */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-1 flex items-center justify-between">
              <span>Onay Geçmişi & Dijital İmza Kayıtları</span>
              <span className="text-[10px] text-slate-400 font-mono font-normal">EKOS-FORM-05-07</span>
            </h3>

            {mdt.approvals.length === 0 ? (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-slate-400 text-center italic">
                Henüz onay veya revizyon aksiyonu kaydedilmedi.
              </div>
            ) : (
              <div className="space-y-2">
                {mdt.approvals.map((app) => (
                  <div
                    key={app.id}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start space-x-3"
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-[10px] mt-0.5 ${
                        app.decision === 'ONAY'
                          ? 'bg-emerald-600'
                          : app.decision === 'RED'
                          ? 'bg-red-600'
                          : 'bg-amber-600'
                      }`}
                    >
                      {app.decision === 'ONAY' ? '✓' : app.decision === 'RED' ? '✗' : '↺'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">
                          {app.approverName} ({app.type} Onayı)
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(app.date).toLocaleString('tr-TR')}
                        </span>
                      </div>
                      <div className="text-slate-700 font-medium mt-0.5">
                        Karar: <strong className="uppercase">{app.decision}</strong> — {app.reason}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Turquality Prosedürü Bölüm 6: Doküman Saklama ve Arşivleme Mührü */}
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-[10px] text-slate-500">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-slate-400 shrink-0" />
                <span>
                  <strong>Turquality Kayıt Saklama Güvencesi:</strong> Tüm MDT verileri, dijital loglar ve onay geçmişi EKOS-FORM-05-07 Doküman Saklama Prosedürü uyarınca SQL/JSON veritabanında süresiz ve SHA-256 zinciriyle saklanmaktadır.
                </span>
              </div>
              <span className="font-mono font-bold text-slate-600 bg-slate-200 px-2 py-0.5 rounded shrink-0">
                EKOS-FORM-05-07
              </span>
            </div>
          </div>

          {/* Section 5: Comments & Discussion */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-1">
              Dahili Yorumlar & İletişim Notları
            </h3>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {mdt.comments.length === 0 ? (
                <div className="text-slate-400 text-center py-4">Henüz yorum yapılmadı.</div>
              ) : (
                mdt.comments.map((c) => (
                  <div key={c.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="flex items-center justify-between font-bold text-slate-800 mb-1">
                      <span>{c.userName}</span>
                      <span className="text-[10px] font-normal text-slate-400">
                        {new Date(c.createdAt).toLocaleString('tr-TR')}
                      </span>
                    </div>
                    <p className="text-slate-700 whitespace-pre-wrap">{c.text}</p>
                  </div>
                ))
              )}
            </div>

            {/* New Comment Input */}
            <div className="flex items-center space-x-2 pt-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                placeholder="Yorumunuzu yazın (@kullanıcı adı yazarak bahsedebilirsiniz)..."
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-800 focus:outline-hidden"
              />
              <button
                onClick={handleAddComment}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs rounded-md transition flex items-center space-x-1"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Gönder</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Bottom Action Bar (Role-Based State Machine Buttons) */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] text-slate-500">
            Aktif Rolünüz: <strong className="text-slate-800 uppercase">{currentUser.role}</strong> ({currentUser.name})
          </div>

          {/* Reason Input overlay if required */}
          {showReasonInput && (
            <div className="w-full sm:w-auto flex items-center space-x-2 animate-in fade-in">
              {showReasonInput === 'UST_ONAY' && (
                <select
                  value={selectedExecutive}
                  onChange={(e) => setSelectedExecutive(e.target.value)}
                  className="px-2 py-1 bg-white border border-slate-300 rounded text-xs font-semibold"
                >
                  <option value="u16">Tamer Özkahraman (Ar-Ge Müdürü - 2. Seviye Teknik Onay)</option>
                  <option value="u15">Yasin Çakar (Genel Müdür - Nihai Üst Yönetim Onayı)</option>
                </select>
              )}

              <input
                type="text"
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                placeholder={showReasonInput === 'TALEP_IPTAL' ? 'İptal gerekçenizi yazınız...' : 'Karar gerekçenizi yazınız...'}
                className="px-3 py-1 bg-white border border-slate-300 rounded text-xs text-slate-800 w-64"
                autoFocus
              />

              <button
                onClick={() => {
                  if (showReasonInput === 'TALEP_IPTAL') handleCancelMDT();
                  if (showReasonInput === 'MEHMET_ONAY') handleExecuteAction('MUSTERI_ONAYINDA', 'ONAY', 'Mehmet Uğur Onaylandı');
                  if (showReasonInput === 'MEHMET_REVIZION') handleExecuteAction('REVIZYON_ISTENDI', 'REVIZYON', 'Mehmet Uğur Revizyon İstedi');
                  if (showReasonInput === 'MEKANIK_ONAY') handleExecuteAction('MEHMET_ONAYINDA', 'ONAY', 'Mekanik Onaylandı');
                  if (showReasonInput === 'MEKANIK_REVIZION') handleExecuteAction('TASARIMDA', 'REVIZYON', 'Mekanik Revizyon İstedi');
                  if (showReasonInput === 'UST_ONAY') handleSendToExecutive();
                  if (showReasonInput === 'UST_EXEC_ONAY') handleExecuteAction('MEHMET_ONAYINDA', 'ONAY', 'Üst Onay Verildi');
                  if (showReasonInput === 'UST_EXEC_RED') handleExecuteAction('REDDEDILDI', 'RED', 'Üst Yönetim Reddetti');
                  if (showReasonInput === 'KAPAT') handleExecuteAction('KAPATILDI', 'ONAY', 'Talep Kapatıldı');
                }}
                className="px-3 py-1 bg-[#D32F2F] hover:bg-red-700 text-white font-bold text-xs rounded transition"
              >
                Onayla & İlerlet
              </button>

              <button
                onClick={() => setShowReasonInput(null)}
                className="px-2 py-1 bg-slate-200 text-slate-700 text-xs rounded hover:bg-slate-300 transition"
              >
                Vazgeç
              </button>
            </div>
          )}

          {/* Action Button Set */}
          {!showReasonInput && (
            <div className="flex flex-wrap items-center gap-2">
              {/* Requester Deletion Button (24-Hour & Untouched Rule - Module 2.1) */}
              {canDelete && (
                <button
                  onClick={handleDeleteMDT}
                  disabled={isDeleting}
                  className="px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white font-semibold rounded text-xs transition flex items-center space-x-1 shadow-2xs"
                  title="İlk 24 saat içinde ve işlem görmemiş olduğu için talebi tamamen siler"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Talebi Sil</span>
                </button>
              )}

              {/* Requester Cancellation Button (Module 2.2) */}
              {canCancel && (
                <button
                  onClick={() => setShowReasonInput('TALEP_IPTAL')}
                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-800 text-white font-semibold rounded text-xs transition flex items-center space-x-1"
                  title="Talebi gerekçe belirterek iptal edildi olarak kapatır"
                >
                  <Ban className="w-3.5 h-3.5" />
                  <span>Talebi İptal Et</span>
                </button>
              )}

              {/* Electrical Design Engineers Actions */}
              {(isElectricalDesign || isMehmet) && (mdt.currentStatus === 'TASARIMDA' || mdt.currentStatus === 'REVIZYON_ISTENDI') && (
                <>
                  <button
                    onClick={handleRequestMechanical}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded text-xs transition"
                  >
                    Mekanik Tasarıma Yönlendir (Erhan Gürbüz)
                  </button>
                  <button
                    onClick={handleSendToMehmet}
                    className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded text-xs transition"
                  >
                    Mehmet Uğur Onayına Gönder
                  </button>
                </>
              )}

              {/* Mechanical Approval Actions */}
              {(isMechanical || isMehmet) && mdt.currentStatus === 'MEKANIK_ONAYDA' && (
                <>
                  <button
                    onClick={() => setShowReasonInput('MEKANIK_REVIZION')}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded text-xs transition"
                  >
                    Mekanik Revizyon İstedi
                  </button>
                  <button
                    onClick={() => setShowReasonInput('MEKANIK_ONAY')}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded text-xs transition"
                  >
                    Mekanik Onay Ver
                  </button>
                </>
              )}

              {/* Mehmet Uğur (Admin / Approver) Actions */}
              {isMehmet && mdt.currentStatus === 'MEHMET_ONAYINDA' && (
                <>
                  <button
                    onClick={() => setShowReasonInput('MEHMET_REVIZION')}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded text-xs transition"
                  >
                    Tasarımcıya Revizyon Geri Gönder
                  </button>
                  <button
                    onClick={() => setShowReasonInput('UST_ONAY')}
                    className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded text-xs transition"
                  >
                    2. Seviye / Üst Onaya Gönder (Ar-Ge / Genel Müdür)
                  </button>
                  <button
                    onClick={() => setShowReasonInput('MEHMET_ONAY')}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded text-xs transition"
                  >
                    Onayla (Müşteri Onayına Sun)
                  </button>
                </>
              )}

              {/* Executive Approvers (Tamer / Yasin) Actions */}
              {(isExecutive || isMehmet) && mdt.currentStatus === 'UST_ONAYDA' && (
                <>
                  <button
                    onClick={() => setShowReasonInput('UST_EXEC_RED')}
                    className="px-3 py-1.5 bg-red-700 hover:bg-red-800 text-white font-semibold rounded text-xs transition"
                  >
                    Üst Onay Reddet
                  </button>
                  <button
                    onClick={() => setShowReasonInput('UST_EXEC_ONAY')}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded text-xs transition"
                  >
                    Üst Onay Ver
                  </button>
                </>
              )}

              {/* Project Management Actions */}
              {(isProjectManager || isMehmet) && mdt.currentStatus === 'MUSTERI_ONAYINDA' && (
                <>
                  <button
                    onClick={handleCreateNewRevision}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded text-xs transition"
                  >
                    Müşteri Revizyon İstedi (Yeni Rev. Aç)
                  </button>
                  <button
                    onClick={() => setShowReasonInput('KAPAT')}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded text-xs transition"
                  >
                    Müşteri Onayladı (Talebi Kapat)
                  </button>
                </>
              )}

              {/* Close Button for Mehmet or PM */}
              {(isMehmet || isProjectManager) && mdt.currentStatus !== 'KAPATILDI' && mdt.currentStatus !== 'IPTAL_EDILDI' && (
                <button
                  onClick={() => setShowReasonInput('KAPAT')}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded text-xs transition"
                >
                  Talebi Kapat
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
