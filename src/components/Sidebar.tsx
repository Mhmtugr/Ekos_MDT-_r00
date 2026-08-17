import React from 'react';
import {
  LayoutDashboard,
  Kanban,
  FileSpreadsheet,
  History,
  Settings,
  ShieldAlert,
  ChevronRight,
} from 'lucide-react';
import { User } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: User;
  onOpenUserSwitch: () => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenUserSwitch,
  onLogout,
}) => {
  const isMehmetOrAdmin = currentUser.role === 'admin';

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Gösterge Paneli',
      icon: LayoutDashboard,
      restricted: false,
    },
    {
      id: 'kanban',
      label: 'Kanban İş Akışı',
      icon: Kanban,
      restricted: false,
    },
    {
      id: 'mdt-list',
      label: 'Tüm MDT Talepleri',
      icon: FileSpreadsheet,
      restricted: false,
    },
    {
      id: 'audit-logs',
      label: 'Denetim Logları',
      icon: History,
      restricted: !isMehmetOrAdmin,
      adminOnlyBadge: true,
    },
    {
      id: 'settings',
      label: 'Sistem / Kullanıcı Ayarları',
      icon: Settings,
      restricted: !isMehmetOrAdmin,
      adminOnlyBadge: true,
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-200 flex flex-col h-screen shrink-0 border-r border-slate-800">
      {/* Brand Logo & Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <svg viewBox="0 0 34 40" className="h-5 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M 20 2 C 0 12 0 28 20 38 C 9 28 9 12 20 2 Z" fill="#C8102E" />
              <path d="M 27 9 C 14 15 14 25 27 31 C 20 25 20 15 27 9 Z" fill="#C8102E" />
              <path d="M 32 14 C 25 16 25 24 32 26 Z" fill="#53565A" />
            </svg>
            <div className="flex items-center font-sans tracking-tight">
              <span className="text-[#C8102E] font-black text-2xl" style={{ letterSpacing: '-0.03em' }}>EKOS</span>
              <div className="w-[1px] h-5 bg-[#C8102E] mx-1.5 opacity-80"></div>
              <span className="text-slate-400 font-light text-2xl" style={{ letterSpacing: '-0.03em' }}>electric</span>
            </div>
          </div>
          <div>
            <h1 className="font-semibold text-sm text-white tracking-wide leading-tight">
              MDT Sistemi
            </h1>
            <p className="text-[11px] text-slate-400 font-normal">
              Mühendislik & Design Portal
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 mb-2 text-[10px] uppercase font-bold tracking-wider text-slate-400">
          Ana Menü
        </div>
        {menuItems.map((item) => {
          if (item.restricted) return null;
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-md text-xs font-medium transition-all ${
                isActive
                  ? 'bg-[#D32F2F] text-white shadow-sm font-semibold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-white' : 'text-slate-400'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/80" />}
            </button>
          );
        })}
      </nav>

      {/* User Info & Logout at bottom */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-xs font-bold text-slate-200 shrink-0">
            {currentUser.name
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-medium text-slate-200 truncate">
              {currentUser.name}
            </div>
            <div className="text-[10px] text-slate-400 truncate">
              {currentUser.title}
            </div>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="px-2 py-1 bg-slate-800 hover:bg-red-950/80 text-slate-300 hover:text-red-400 rounded text-[10px] font-semibold transition border border-slate-700 hover:border-red-800 shrink-0 cursor-pointer"
          title="Oturumu Kapat"
        >
          Çıkış
        </button>
      </div>
    </aside>
  );
};
