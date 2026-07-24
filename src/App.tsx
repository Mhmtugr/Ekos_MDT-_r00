import React, { useState, useEffect } from 'react';
import {
  initStorage,
  getCurrentUser,
  setCurrentUser,
  getUsers,
  saveUser,
  getProjects,
  saveProject,
  getMDTs,
  saveMDT,
  generateNextMDTNo,
  getAuditLogs,
  logAudit,
  getNotifications,
  markNotificationRead,
  createNotification,
  getPermissionMatrix,
  savePermissionMatrix,
  resetAllToDefault,
} from './services/storageService';
import {
  User,
  Project,
  MDTRequest,
  AuditLog,
  NotificationItem,
  PermissionMatrix,
} from './types';

import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { KanbanBoard } from './components/KanbanBoard';
import { MDTList } from './components/MDTList';
import { AuditLogs } from './components/AuditLogs';
import { Settings } from './components/Settings';
import { MDTDetailModal } from './components/MDTDetailModal';
import { NewMDTModal } from './components/NewMDTModal';
import { UserSwitcherModal } from './components/UserSwitcherModal';
import { Login } from './components/Login';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [currentUser, setCurrentUserState] = useState<User>(getCurrentUser());
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [mdts, setMdts] = useState<MDTRequest[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [permissions, setPermissions] = useState<PermissionMatrix>(
    getPermissionMatrix()
  );

  // Search query in header
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');

  // Modals & Navigation state
  const [listFilter, setListFilter] = useState<string>('ALL');
  const [selectedMDT, setSelectedMDT] = useState<MDTRequest | null>(null);
  const [showNewMDTModal, setShowNewMDTModal] = useState<boolean>(false);
  const [isRetroactiveNewMDT, setIsRetroactiveNewMDT] = useState<boolean>(false);
  const [showUserSwitcher, setShowUserSwitcher] = useState<boolean>(false);

  const handleNavigateTab = (tab: string, filter?: string) => {
    if (filter) {
      setListFilter(filter);
    } else {
      setListFilter('ALL');
    }
    setActiveTab(tab);
  };

  // Load state on mount
  useEffect(() => {
    initStorage();
    refreshAllData();
  }, []);

  const refreshAllData = () => {
    const cur = getCurrentUser();
    setCurrentUserState(cur);
    setUsers(getUsers());
    setProjects(getProjects());
    setMdts(getMDTs());
    setAuditLogs(getAuditLogs());
    setNotifications(getNotifications(cur.id));
    setPermissions(getPermissionMatrix());
  };

  // User Switch Handler
  const handleSelectUser = (user: User) => {
    setCurrentUser(user);
    setCurrentUserState(user);
    setNotifications(getNotifications(user.id));
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentUserState(user);
    setNotifications(getNotifications(user.id));
    setIsLoggedIn(true);
  };

  const handleGuestLogin = () => {
    let guestUser = users.find((u) => u.role === 'viewer' || u.id === 'u-guest');
    if (!guestUser) {
      guestUser = {
        id: 'u-guest',
        name: 'Misafir İzleyici',
        email: 'misafir@ekoselectric.com',
        username: 'misafir',
        password: 'guest',
        title: 'Gözlemci / İzleyici Modu',
        role: 'viewer',
        active: true,
      };
    }
    setCurrentUser(guestUser);
    setCurrentUserState(guestUser);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // Update MDT & Log Audit
  const handleUpdateMDT = (updatedMDT: MDTRequest, auditActionMsg: string) => {
    saveMDT(updatedMDT);
    logAudit(
      currentUser,
      auditActionMsg,
      'MDT',
      updatedMDT.mdtNo,
      mdts.find((m) => m.id === updatedMDT.id)?.currentStatus,
      updatedMDT.currentStatus
    );

    // Notify assignee if changed or status updated
    if (updatedMDT.assignedToId && updatedMDT.assignedToId !== currentUser.id) {
      createNotification(
        updatedMDT.assignedToId,
        updatedMDT.id,
        updatedMDT.mdtNo,
        `MDT durum güncellemesi: ${auditActionMsg}`
      );
    }

    refreshAllData();
    // Keep detail modal updated if open
    setSelectedMDT(updatedMDT);
  };

  // Create New MDT
  const handleCreateMDT = (
    newMDTData: Partial<MDTRequest>,
    newProjData?: Partial<Project>
  ) => {
    let finalProjId = newMDTData.projectId;

    if (newProjData && newProjData.id) {
      const fullProj: Project = {
        id: newProjData.id,
        caniasProjeNo: newProjData.caniasProjeNo || '26040099',
        clientName: newProjData.clientName || 'MÜŞTERİ',
        productGroup: newProjData.productGroup || '36kV RMU',
        serverFolderPath: newProjData.serverFolderPath || '\\\\Ekosfilesrv\\ekos\\PROJELER',
        year: newProjData.year || 2026,
        createdAt: new Date().toISOString().split('T')[0],
      };
      saveProject(fullProj);
      finalProjId = fullProj.id;
    }

    const year = newMDTData.year || 2026;
    const nextMdtNo = generateNextMDTNo(year);

    const fullMDT: MDTRequest = {
      id: 'mdt-' + Date.now(),
      mdtNo: nextMdtNo,
      revisionNumber: newMDTData.revisionNumber || 'Rev.00',
      projectId: finalProjId || projects[0]?.id || 'p1',
      title: newMDTData.title || 'Yeni MDT Talebi',
      requestType: newMDTData.requestType || 'ELEKTRIK_MEKANIK',
      hasMechanicalEffect: newMDTData.hasMechanicalEffect ?? true,
      priority: newMDTData.priority || 'ORTA',
      clientSpecialRequest: newMDTData.clientSpecialRequest || '',
      reason: newMDTData.reason,
      openedById: currentUser.id,
      assignedToId: newMDTData.assignedToId || 'u2',
      currentStatus: newMDTData.currentStatus || 'TASARIMDA',
      createdAt: newMDTData.createdAt || new Date().toISOString(),
      targetDate: newMDTData.targetDate || new Date(Date.now() + 7 * 86400000).toISOString(),
      closedAt: newMDTData.closedAt,
      isHistorical: newMDTData.isHistorical || false,
      year: year,
      technicalDocs: newMDTData.technicalDocs || { drawnById: newMDTData.assignedToId },
      approvals: [],
      comments: [],
      files: [],
    };

    saveMDT(fullMDT);
    logAudit(
      currentUser,
      `Yeni MDT Talebi oluşturuldu (${nextMdtNo})`,
      'MDT',
      nextMdtNo,
      undefined,
      fullMDT.currentStatus
    );

    if (fullMDT.assignedToId && fullMDT.assignedToId !== currentUser.id) {
      createNotification(
        fullMDT.assignedToId,
        fullMDT.id,
        fullMDT.mdtNo,
        `Tarafınıza yeni bir MDT talebi atandı: ${fullMDT.title}`
      );
    }

    refreshAllData();
  };

  // Save User (Admin)
  const handleSaveUser = (user: User) => {
    saveUser(user);
    logAudit(currentUser, `Kullanıcı hesabı güncellendi/eklendi: ${user.name}`, 'KULLANICI', user.id);
    refreshAllData();
  };

  // Save Project (Admin)
  const handleSaveProject = (project: Project) => {
    saveProject(project);
    logAudit(currentUser, `Proje tanımı güncellendi/eklendi: ${project.caniasProjeNo}`, 'PROJE', project.id);
    refreshAllData();
  };

  // Save Permissions Matrix
  const handleSavePermissions = (matrix: PermissionMatrix) => {
    savePermissionMatrix(matrix);
    logAudit(currentUser, 'Rol Bazlı Yetki Matrisi güncellendi', 'SISTEM', 'PERM-01');
    refreshAllData();
  };

  // Reset Data
  const handleResetData = () => {
    resetAllToDefault();
    refreshAllData();
  };

  // Notification Click -> Open MDT
  const handleNotificationClick = (notif: NotificationItem) => {
    markNotificationRead(notif.id);
    const targetMdt = mdts.find((m) => m.id === notif.mdtId);
    if (targetMdt) {
      setSelectedMDT(targetMdt);
    }
    refreshAllData();
  };

  if (!isLoggedIn) {
    return (
      <Login
        users={users}
        onLogin={handleLogin}
        onGuestLogin={handleGuestLogin}
      />
    );
  }

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-800 antialiased overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenUserSwitch={() => setShowUserSwitcher(true)}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header Bar */}
        <Header
          currentUser={currentUser}
          onOpenNewMDT={() => {
            setIsRetroactiveNewMDT(false);
            setShowNewMDTModal(true);
          }}
          onOpenUserSwitch={() => setShowUserSwitcher(true)}
          onLogout={handleLogout}
          notifications={notifications}
          onNotificationClick={handleNotificationClick}
          searchQuery={globalSearchQuery}
          setSearchQuery={setGlobalSearchQuery}
        />

        {/* Tab View Body */}
        <main className="flex-1 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <Dashboard
              mdts={mdts}
              projects={projects}
              users={users}
              currentUser={currentUser}
              onSelectMDT={(m) => setSelectedMDT(m)}
              onNavigateTab={handleNavigateTab}
            />
          )}

          {activeTab === 'kanban' && (
            <KanbanBoard
              mdts={mdts}
              projects={projects}
              users={users}
              onSelectMDT={(m) => setSelectedMDT(m)}
            />
          )}

          {activeTab === 'mdt-list' && (
            <MDTList
              mdts={mdts}
              projects={projects}
              users={users}
              currentUser={currentUser}
              initialFilter={listFilter}
              onSelectMDT={(m) => setSelectedMDT(m)}
              onOpenNewMDT={(isRetro) => {
                setIsRetroactiveNewMDT(!!isRetro);
                setShowNewMDTModal(true);
              }}
            />
          )}

          {activeTab === 'audit-logs' && <AuditLogs logs={auditLogs} />}

          {activeTab === 'settings' && (
            <Settings
              users={users}
              projects={projects}
              permissions={permissions}
              onSaveUser={handleSaveUser}
              onSaveProject={handleSaveProject}
              onSavePermissions={handleSavePermissions}
              onResetData={handleResetData}
            />
          )}
        </main>
      </div>

      {/* Detail Modal */}
      {selectedMDT && (
        <MDTDetailModal
          mdt={selectedMDT}
          projects={projects}
          users={users}
          currentUser={currentUser}
          onClose={() => setSelectedMDT(null)}
          onUpdateMDT={handleUpdateMDT}
        />
      )}

      {/* New MDT Modal */}
      {showNewMDTModal && (
        <NewMDTModal
          projects={projects}
          users={users}
          currentUser={currentUser}
          isRetroactive={isRetroactiveNewMDT}
          onClose={() => setShowNewMDTModal(false)}
          onCreateMDT={handleCreateMDT}
        />
      )}

      {/* User / Role Switcher Modal */}
      {showUserSwitcher && (
        <UserSwitcherModal
          users={users}
          currentUser={currentUser}
          onSelectUser={handleSelectUser}
          onClose={() => setShowUserSwitcher(false)}
        />
      )}
    </div>
  );
}
