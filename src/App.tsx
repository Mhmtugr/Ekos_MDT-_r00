import React, { useState, useEffect } from 'react';
import {
  User,
  Project,
  MDTRequest,
  AuditLog,
  NotificationItem,
  PermissionMatrix,
} from './types';
import { apiService } from './services/apiService';

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
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [currentUser, setCurrentUserState] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [mdts, setMdts] = useState<MDTRequest[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [permissions, setPermissions] = useState<PermissionMatrix>({} as PermissionMatrix);
  const [loading, setLoading] = useState<boolean>(true);

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

  // Check login on mount and load data
  useEffect(() => {
    const init = async () => {
      try {
        const me = await apiService.fetchMe();
        if (me) {
          setCurrentUserState(me);
          setIsLoggedIn(true);
          await refreshAllData();
        }
      } catch (err) {
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const refreshAllData = async () => {
    try {
      const [uList, pList, mList, aList, nList, permList] = await Promise.all([
        apiService.getUsers().catch(() => []),
        apiService.getProjects().catch(() => []),
        apiService.getMDTs().catch(() => []),
        apiService.getAuditLogs().catch(() => []),
        apiService.getNotifications().catch(() => []),
        apiService.getPermissions().catch(() => ({} as PermissionMatrix)),
      ]);

      setUsers(uList);
      setProjects(pList);
      setMdts(mList);
      setAuditLogs(aList);
      setNotifications(nList);
      setPermissions(permList);

      // Keep selected MDT updated if open
      if (selectedMDT) {
        const updatedSelected = mList.find((m) => m.id === selectedMDT.id);
        if (updatedSelected) {
          setSelectedMDT(updatedSelected);
        }
      }
    } catch (err) {
      console.error('Data refresh error:', err);
    }
  };

  // User Switch Handler
  const handleSelectUser = async (user: User) => {
    try {
      const { user: loggedInUser } = await apiService.login(user.username || user.email, '123');
      setCurrentUserState(loggedInUser);
      await refreshAllData();
    } catch (err) {
      console.error('User switch error:', err);
    }
  };

  const handleLogin = async (user: User) => {
    setCurrentUserState(user);
    setIsLoggedIn(true);
    await refreshAllData();
  };

  const handleGuestLogin = async () => {
    try {
      const { user } = await apiService.login('misafir', 'guest');
      setCurrentUserState(user);
      setIsLoggedIn(true);
      await refreshAllData();
    } catch (err) {
      console.error('Guest login error:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('ekos_mdt_jwt_token');
    localStorage.removeItem('ekos_mdt_current_user');
    setIsLoggedIn(false);
    setCurrentUserState(null);
  };

  // Update MDT
  const handleUpdateMDT = async (updatedMDT: MDTRequest) => {
    try {
      await apiService.updateMDT(updatedMDT.id, updatedMDT);
      await refreshAllData();
    } catch (err: any) {
      alert(err.message || 'MDT güncellenemedi.');
    }
  };

  // Create New MDT
  const handleCreateMDT = async (
    newMDTData: Partial<MDTRequest>,
    newProjData?: Partial<Project>
  ) => {
    try {
      let finalProjId = newMDTData.projectId;

      if (newProjData && newProjData.caniasProjeNo) {
        const fullProj = await apiService.saveProject({
          id: 'p-' + Date.now(),
          caniasProjeNo: newProjData.caniasProjeNo,
          clientName: newProjData.clientName || 'MÜŞTERİ',
          productGroup: newProjData.productGroup || '36kV RMU',
          serverFolderPath: newProjData.serverFolderPath || '\\\\Ekosfilesrv\\ekos\\PROJELER',
          year: newProjData.year || 2026,
          createdAt: new Date().toISOString().split('T')[0],
        });
        finalProjId = fullProj.id;
      }

      await apiService.createMDT({
        ...newMDTData,
        projectId: finalProjId || projects[0]?.id || 'p1',
      });

      await refreshAllData();
    } catch (err: any) {
      alert(err.message || 'MDT oluşturulamadı.');
    }
  };

  // Save User (Admin)
  const handleSaveUser = async (user: User) => {
    try {
      await apiService.saveUser(user);
      await refreshAllData();
    } catch (err: any) {
      alert(err.message || 'Kullanıcı kaydedilemedi.');
    }
  };

  // Save Project (Admin)
  const handleSaveProject = async (project: Project) => {
    try {
      await apiService.saveProject(project);
      await refreshAllData();
    } catch (err: any) {
      alert(err.message || 'Proje kaydedilemedi.');
    }
  };

  // Save Permissions Matrix
  const handleSavePermissions = async (matrix: PermissionMatrix) => {
    try {
      await apiService.savePermissions(matrix);
      await refreshAllData();
    } catch (err: any) {
      alert(err.message || 'İzinler kaydedilemedi.');
    }
  };

  // Notification Click -> Open MDT
  const handleNotificationClick = async (notif: NotificationItem) => {
    await apiService.markNotificationRead(notif.id);
    const targetMdt = mdts.find((m) => m.id === notif.mdtId);
    if (targetMdt) {
      setSelectedMDT(targetMdt);
    }
    await refreshAllData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-sm font-bold">
        EKOS MDT Sistemi Yükleniyor...
      </div>
    );
  }

  if (!isLoggedIn || !currentUser) {
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
              onResetData={refreshAllData}
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
