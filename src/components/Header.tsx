import React, { useState } from 'react';
import {
  Bell,
  Plus,
  Search,
  UserCheck,
  Shield,
  ExternalLink,
  ChevronDown,
  LogOut,
} from 'lucide-react';
import { User, NotificationItem } from '../types';

interface HeaderProps {
  currentUser: User;
  onOpenNewMDT: () => void;
  onLogout: () => void;
  notifications: NotificationItem[];
  onNotificationClick: (notif: NotificationItem) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onOpenNewMDT,
  onLogout,
  notifications,
  onNotificationClick,
  searchQuery,
  setSearchQuery,
}) => {
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Sadece Satış ve Proje Yönetimi personeli talep açabilir (Mühendisler ve yöneticiler açamaz)
  const canCreate =
    currentUser.role === 'sales' ||
    currentUser.role === 'project_management';

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 z-10 shadow-xs">
      {/* Search Input */}
      <div className="flex items-center space-x-3 w-80">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="MDT No, Müşteri veya Canias Proje No ara..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-slate-400 focus:border-slate-400 transition"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3">
        {/* User Info Badge */}
        <div className="flex items-center space-x-2 px-3 py-1.5 bg-slate-50 text-slate-700 rounded-md text-xs font-medium border border-slate-200">
          <UserCheck className="w-3.5 h-3.5 text-slate-500" />
          <span className="font-bold text-slate-800">{currentUser.name}</span>
          <span className="text-[10px] text-slate-600 bg-slate-200 px-1.5 py-0.5 rounded border border-slate-300 font-semibold uppercase">
            {currentUser.role === 'admin' ? 'ADMIN' : currentUser.role}
          </span>
        </div>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="flex items-center space-x-1 px-2.5 py-1.5 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-[#D32F2F] rounded-md text-xs font-semibold border border-slate-200 hover:border-red-200 transition cursor-pointer"
          title="Çıkış Yap"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Çıkış Yap</span>
        </button>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md relative transition"
            title="Bildirimler"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#D32F2F] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Drawer */}
          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-50 text-slate-800">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Bildirimler</span>
                <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                  {unreadCount} Okunmamış
                </span>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="px-4 py-6 text-center text-xs text-slate-400">
                    Bildiriminiz bulunmuyor
                  </div>
                ) : (
                  notifications.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => {
                        onNotificationClick(n);
                        setShowNotifMenu(false);
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-slate-50 transition flex items-start space-x-2.5 ${
                        !n.read ? 'bg-amber-50/50' : ''
                      }`}
                    >
                      <div className="w-2 h-2 rounded-full bg-[#D32F2F] mt-1.5 shrink-0" />
                      <div>
                        <div className="text-xs font-semibold text-slate-800">
                          {n.mdtNo}
                        </div>
                        <div className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                          {n.message}
                        </div>
                        <div className="text-[9px] text-slate-400 mt-1">
                          {new Date(n.createdAt).toLocaleDateString('tr-TR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Primary Action Button */}
        {canCreate && (
          <button
            onClick={onOpenNewMDT}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#D32F2F] hover:bg-red-700 text-white font-medium text-xs rounded-md shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni MDT Talebi</span>
          </button>
        )}
      </div>
    </header>
  );
};
