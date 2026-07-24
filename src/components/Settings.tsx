import React, { useState } from 'react';
import {
  Users,
  Shield,
  FolderPlus,
  Sliders,
  Plus,
  Check,
  X,
  RotateCcw,
  Info,
} from 'lucide-react';
import { User, Project, PermissionMatrix, RoleGroup } from '../types';

interface SettingsProps {
  users: User[];
  projects: Project[];
  permissions: PermissionMatrix;
  onSaveUser: (user: User) => void;
  onSaveProject: (project: Project) => void;
  onSavePermissions: (permissions: PermissionMatrix) => void;
  onResetData: () => void;
}

export const Settings: React.FC<SettingsProps> = ({
  users,
  projects,
  permissions,
  onSaveUser,
  onSaveProject,
  onSavePermissions,
  onResetData,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    'users' | 'roles' | 'projects' | 'system'
  >('users');

  // New user state
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserUsername, setNewUserUsername] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserTitle, setNewUserTitle] = useState('');
  const [newUserRole, setNewUserRole] = useState<RoleGroup>('electrical_design');

  // New project state
  const [showAddProjModal, setShowAddProjModal] = useState(false);
  const [projCaniasNo, setProjCaniasNo] = useState('');
  const [projClientName, setProjClientName] = useState('');
  const [projProductGroup, setProjProductGroup] = useState('36kV RMU & Hücre');

  // Permission Matrix edit local state
  const [matrixState, setMatrixState] = useState<PermissionMatrix>(permissions);

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    const generatedUsername = newUserUsername.trim() || newUserEmail.split('@')[0];
    const generatedPassword = newUserPassword.trim() || '123';

    const newUser: User = {
      id: 'u-' + Date.now(),
      name: newUserName,
      email: newUserEmail,
      username: generatedUsername,
      password: generatedPassword,
      title: newUserTitle || 'Mühendis',
      role: newUserRole,
      active: true,
    };
    onSaveUser(newUser);
    setShowAddUserModal(false);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserUsername('');
    setNewUserPassword('');
    setNewUserTitle('');
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projCaniasNo.trim() || !projClientName.trim()) return;

    const newProj: Project = {
      id: 'p-' + Date.now(),
      caniasProjeNo: projCaniasNo,
      clientName: projClientName,
      productGroup: projProductGroup,
      serverFolderPath: `\\\\Ekosfilesrv\\ekos\\PROJELER\\2026\\${projClientName.toUpperCase()}\\${projCaniasNo}`,
      year: 2026,
      createdAt: new Date().toISOString().split('T')[0],
    };
    onSaveProject(newProj);
    setShowAddProjModal(false);
    setProjCaniasNo('');
    setProjClientName('');
  };

  const togglePermission = (roleKey: string, permKey: string) => {
    const updated = { ...matrixState };
    if (updated[roleKey]) {
      (updated[roleKey] as any)[permKey] = !(updated[roleKey] as any)[permKey];
    }
    setMatrixState(updated);
  };

  const handleSavePermissionChanges = () => {
    onSavePermissions(matrixState);
  };

  const permissionLabels: Record<string, string> = {
    createMDT: 'Yeni Talep Açma',
    viewAll: 'Tüm Talepleri Görüntüleme',
    processAssigned: 'Atanan Talebi İşleme',
    approveElectrical: 'Elektrik Onayı Verme',
    requestMechanical: 'Mekanik Onay İsteği Açma',
    approveMechanical: 'Mekanik Onay Verme',
    requestExecutive: 'Üst Onay İsteği Açma',
    approveExecutive: 'Üst Onay Verme',
    closeMDT: 'Talebi Kapatma',
    manageUsers: 'Kullanıcı / Rol Yönetimi',
    viewAuditLogs: 'Denetim Loglarını İzleme',
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-base font-bold text-slate-800">Sistem / Kullanıcı Ayarları</h1>
        <p className="text-xs text-slate-500">
          Mehmet Uğur (Sistem Yöneticisi) — EKOS MDT Kullanıcı, Rol Matrisi ve Proje Yönetimi
        </p>
      </div>

      {/* Sub Tabs */}
      <div className="flex border-b border-slate-200 text-xs font-semibold space-x-6">
        <button
          onClick={() => setActiveSubTab('users')}
          className={`pb-2.5 flex items-center space-x-2 border-b-2 transition ${
            activeSubTab === 'users'
              ? 'border-[#D32F2F] text-[#D32F2F] font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Kullanıcı Yönetimi ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('roles')}
          className={`pb-2.5 flex items-center space-x-2 border-b-2 transition ${
            activeSubTab === 'roles'
              ? 'border-[#D32F2F] text-[#D32F2F] font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Rol Bazlı Yetki Matrisi</span>
        </button>

        <button
          onClick={() => setActiveSubTab('projects')}
          className={`pb-2.5 flex items-center space-x-2 border-b-2 transition ${
            activeSubTab === 'projects'
              ? 'border-[#D32F2F] text-[#D32F2F] font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FolderPlus className="w-4 h-4" />
          <span>Proje & Müşteri Tanımları ({projects.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('system')}
          className={`pb-2.5 flex items-center space-x-2 border-b-2 transition ${
            activeSubTab === 'system'
              ? 'border-[#D32F2F] text-[#D32F2F] font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Sistem Bilgisi & Sıfırlama</span>
        </button>
      </div>

      {/* SUB-TAB 1: Users */}
      {activeSubTab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">
              Sistemdeki aktif kurumsal personel hesapları
            </span>
            <button
              onClick={() => setShowAddUserModal(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#D32F2F] hover:bg-red-700 text-white rounded-md text-xs font-semibold transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Yeni Kullanıcı Ekle</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <table className="w-full text-left text-xs text-slate-700 border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3">Ad Soyad</th>
                  <th className="px-4 py-3">E-posta</th>
                  <th className="px-4 py-3">Ünvan / Görev</th>
                  <th className="px-4 py-3">Rol Grubu</th>
                  <th className="px-4 py-3">Durum</th>
                  <th className="px-4 py-3 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3 font-bold text-slate-800 flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-full bg-slate-800 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                        {u.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>
                      <span>{u.name}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{u.email}</td>
                    <td className="px-4 py-3 text-slate-700 font-medium">{u.title}</td>
                    <td className="px-4 py-3">
                      <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {u.active ? (
                        <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold">
                          Aktif
                        </span>
                      ) : (
                        <span className="bg-slate-100 text-slate-400 px-2 py-0.5 rounded text-[10px]">
                          Pasif
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => {
                          const updated = { ...u, active: !u.active };
                          onSaveUser(updated);
                        }}
                        className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 underline"
                      >
                        {u.active ? 'Pasifleştir' : 'Aktifleştir'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: Permission Matrix */}
      {activeSubTab === 'roles' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">
              Doküman Bölüm 3.2 Rol Bazlı Yetki Matrisi Düzenleyici
            </span>
            <button
              onClick={handleSavePermissionChanges}
              className="px-4 py-1.5 bg-[#D32F2F] hover:bg-red-700 text-white font-bold rounded-md text-xs transition"
            >
              Matris Değişikliklerini Kaydet
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3">Sistem Yetkisi / Eylem</th>
                  <th className="px-3 py-3 text-center">Satış</th>
                  <th className="px-3 py-3 text-center">Elektrik Tasarım</th>
                  <th className="px-3 py-3 text-center bg-red-50 text-[#D32F2F]">Mehmet Uğur</th>
                  <th className="px-3 py-3 text-center">Proje Yönetimi</th>
                  <th className="px-3 py-3 text-center">Mekanik Onay</th>
                  <th className="px-3 py-3 text-center">Üst Onay</th>
                  <th className="px-3 py-3 text-center">İzleyici</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {Object.keys(permissionLabels).map((permKey) => (
                  <tr key={permKey} className="hover:bg-slate-50">
                    <td className="px-4 py-2.5 font-bold text-slate-800">
                      {permissionLabels[permKey]}
                    </td>
                    {[
                      'sales',
                      'electrical_design',
                      'admin',
                      'project_management',
                      'mechanical_approval',
                      'executive_approval',
                      'viewer',
                    ].map((roleKey) => {
                      const isAllowed = matrixState[roleKey]?.[permKey as keyof typeof matrixState['admin']];
                      return (
                        <td key={roleKey} className="px-3 py-2.5 text-center">
                          <input
                            type="checkbox"
                            checked={!!isAllowed}
                            onChange={() => togglePermission(roleKey, permKey)}
                            className="w-4 h-4 rounded text-[#D32F2F] focus:ring-[#D32F2F]"
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: Projects */}
      {activeSubTab === 'projects' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">
              EKOS CANIAS ERP Referanslı Proje ve Sunucu Klasör Yolları
            </span>
            <button
              onClick={() => setShowAddProjModal(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#D32F2F] hover:bg-red-700 text-white rounded-md text-xs font-semibold transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Yeni Proje Tanımla</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <table className="w-full text-left text-xs text-slate-700 border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3">Canias / Proje Referans No</th>
                  <th className="px-4 py-3">Müşteri Ünvanı</th>
                  <th className="px-4 py-3">Ürün Grubu</th>
                  <th className="px-4 py-3">Sunucu Klasör Yolu (UNC Path)</th>
                  <th className="px-4 py-3">Yıl</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {projects.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-bold text-slate-900">{p.caniasProjeNo}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800">{p.clientName}</td>
                    <td className="px-4 py-3 text-slate-600">{p.productGroup}</td>
                    <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">
                      {p.serverFolderPath}
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-700">{p.year}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: System Info */}
      {activeSubTab === 'system' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-6">
          <div className="flex items-center space-x-3">
            <Info className="w-5 h-5 text-slate-700" />
            <div>
              <h2 className="text-sm font-bold text-slate-800">Sistem Sürümü & Altyapı Bilgisi</h2>
              <p className="text-xs text-slate-500">EKOS Mühendislik Portal v1.0</p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg text-xs space-y-2 text-slate-700 border border-slate-200">
            <div><strong>Kurum:</strong> EKOS Elektrik Mühendislik-Tasarım Birimi</div>
            <div><strong>Modül:</strong> Mühendislik Değişiklik ve Müşteri Revizyon Takip Sistemi (MDT)</div>
            <div><strong>Versiyon:</strong> v1.0 (Prodüksiyon Sürümü)</div>
            <div><strong>Standart:</strong> ISO 9001 / Mühendislik Değişiklik Yönetimi Prosedürü</div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
            <div>
              <div className="text-xs font-bold text-slate-800">Sistem Verilerini Fabrika Ayarlarına Döndür</div>
              <div className="text-[11px] text-slate-500">
                Test amaçlı yapılan tüm MDT değişikliklerini sıfırlar ve ilk başlangıç verilerini yükler.
              </div>
            </div>
            <button
              onClick={() => {
                if (window.confirm('Tüm verileri varsayılana sıfırlamak istediğinize emin misiniz?')) {
                  onResetData();
                }
              }}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-md text-xs font-semibold transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Sistemi Sıfırla</span>
            </button>
          </div>
        </div>
      )}

      {/* Modal Add User */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
              <h3 className="text-xs font-bold text-slate-800">Yeni Kullanıcı Hesabı Ekle</h3>
              <button onClick={() => setShowAddUserModal(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Ad Soyad *</label>
                <input
                  type="text"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="ör. Caner Kılıç"
                  className="w-full px-3 py-1.5 border border-slate-200 rounded text-xs"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">E-posta *</label>
                <input
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="caner.kilic@ekoselectric.com"
                  className="w-full px-3 py-1.5 border border-slate-200 rounded text-xs"
                  required
                />
              </div>

              {/* Username & Password Inputs */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Kullanıcı Adı *</label>
                  <input
                    type="text"
                    value={newUserUsername}
                    onChange={(e) => setNewUserUsername(e.target.value)}
                    placeholder="ör. caner.kilic"
                    className="w-full px-3 py-1.5 border border-slate-200 rounded text-xs font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Şifre *</label>
                  <input
                    type="password"
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-1.5 border border-slate-200 rounded text-xs"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Ünvan</label>
                <input
                  type="text"
                  value={newUserTitle}
                  onChange={(e) => setNewUserTitle(e.target.value)}
                  placeholder="ör. Elektrik Tasarım Mühendisi"
                  className="w-full px-3 py-1.5 border border-slate-200 rounded text-xs"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Rol Grubu</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as any)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded text-xs font-semibold"
                >
                  <option value="electrical_design">Elektrik Tasarım</option>
                  <option value="sales">Satış</option>
                  <option value="project_management">Proje Yönetimi</option>
                  <option value="mechanical_approval">Mekanik Onay</option>
                  <option value="executive_approval">Üst Onay</option>
                  <option value="admin">Sistem Yöneticisi / Admin</option>
                </select>
              </div>
              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#D32F2F] text-white font-bold rounded"
                >
                  Ekle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Add Project */}
      {showAddProjModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
              <h3 className="text-xs font-bold text-slate-800">Yeni Proje Referansı Tanımla</h3>
              <button onClick={() => setShowAddProjModal(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleCreateProject} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Canias / Proje No *
                </label>
                <input
                  type="text"
                  value={projCaniasNo}
                  onChange={(e) => setProjCaniasNo(e.target.value)}
                  placeholder="ör. 26040015 OEDAŞ"
                  className="w-full px-3 py-1.5 border border-slate-200 rounded text-xs"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Müşteri Ünvanı *
                </label>
                <input
                  type="text"
                  value={projClientName}
                  onChange={(e) => setProjClientName(e.target.value)}
                  placeholder="ör. OEDAŞ ELEKTRİK A.Ş."
                  className="w-full px-3 py-1.5 border border-slate-200 rounded text-xs"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Ürün Grubu
                </label>
                <input
                  type="text"
                  value={projProductGroup}
                  onChange={(e) => setProjProductGroup(e.target.value)}
                  placeholder="ör. 36kV Metal Clad"
                  className="w-full px-3 py-1.5 border border-slate-200 rounded text-xs"
                />
              </div>
              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddProjModal(false)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#D32F2F] text-white font-bold rounded"
                >
                  Proje Oluştur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
