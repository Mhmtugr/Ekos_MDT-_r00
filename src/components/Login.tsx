import React, { useState } from 'react';
import { Shield, Eye, Lock, User as UserIcon, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { User } from '../types';

interface LoginProps {
  users: User[];
  onLogin: (user: User) => void;
  onGuestLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ users, onLogin, onGuestLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanUser = username.trim().toLowerCase();
    const foundUser = users.find(
      (u) =>
        (u.username && u.username.toLowerCase() === cleanUser) ||
        u.email.toLowerCase() === cleanUser ||
        u.name.toLowerCase() === cleanUser
    );

    if (!foundUser) {
      setError('Girdiğiniz kullanıcı adı veya e-posta adresi sistemde bulunamadı.');
      return;
    }

    if (!foundUser.active) {
      setError('Bu kullanıcı hesabı pasife alınmıştır. Yönetici ile iletişime geçiniz.');
      return;
    }

    // Check password if set, default accepts '123'
    if (foundUser.password && foundUser.password !== password.trim()) {
      setError('Girdiğiniz şifre hatalı! (Varsayılan şifre: 123)');
      return;
    }

    onLogin(foundUser);
  };

  const handleQuickSelect = (user: User) => {
    setUsername(user.username || user.email);
    setPassword(user.password || '123');
    setError(null);
    onLogin(user);
  };

  // Featured sample users for quick demo selection
  const quickUsers = [
    users.find((u) => u.id === 'u1'), // Mehmet Uğur (Admin)
    users.find((u) => u.id === 'u2'), // Halil Kerçin (Elektrik)
    users.find((u) => u.id === 'u17'), // Erhan Gürbüz (Mekanik)
    users.find((u) => u.id === 'u4'), // Osman Çelen (Satış)
  ].filter(Boolean) as User[];

  return (
    <div className="min-h-screen bg-slate-900 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(211,47,47,0.15),rgba(255,255,255,0))] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header Branding Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-8 text-white relative overflow-hidden text-center border-b border-slate-800">
          <div className="absolute inset-0 bg-[#D32F2F]/10 backdrop-blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center">
            {/* EKOS Brand Logo */}
            <div className="flex items-center space-x-2.5 mb-2">
              <div className="bg-[#D32F2F] text-white px-2.5 py-1 rounded font-black text-sm tracking-wider uppercase shadow-md">
                EKOS
              </div>
              <div className="text-left">
                <div className="text-sm font-bold tracking-tight text-white leading-tight">
                  MDT Sistemi
                </div>
                <div className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
                  Mühendislik & Design Portal
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-300 max-w-xs mt-1">
              Kurumsal Mühendislik Değişiklik ve Müşteri Revizyon Takip Portalı
            </p>
          </div>
        </div>

        {/* Login Form Body */}
        <div className="p-7 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-start space-x-2 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 text-[#D32F2F] shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>Kullanıcı Adı veya E-posta</span>
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="ör. mehmet.ugur"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-hidden focus:border-[#D32F2F] focus:bg-white transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>Şifre</span>
                <span className="text-[10px] text-slate-400 font-normal">Varsayılan: 123</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:border-[#D32F2F] focus:bg-white transition"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#D32F2F] hover:bg-red-700 text-white font-bold rounded-lg text-xs transition shadow-md flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Sisteme Giriş Yap</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0">
              VEYA
            </span>
          </div>

          {/* GUEST / OBSERVER MODE BUTTON */}
          <button
            type="button"
            onClick={onGuestLogin}
            className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer shadow-2xs group"
          >
            <Eye className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
            <span>Misafir Modu İle Giriş Yap (Sadece Gözlem)</span>
          </button>

          <p className="text-[10px] text-slate-500 text-center leading-relaxed">
            * Misafir modu ile giriş yaptığınızda sistemdeki tüm projeleri ve MDT durumlarını izleyebilirsiniz. Değişiklik yapmak yetki gerektirir.
          </p>

          {/* Quick Demo Switcher Pills */}
          <div className="pt-3 border-t border-slate-100">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">
              Hızlı Rol Girişi (Test İçin Tıklayın)
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {quickUsers.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleQuickSelect(u)}
                  className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-left transition flex items-center space-x-2 cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-slate-800 text-white font-bold text-[9px] flex items-center justify-center shrink-0">
                    {u.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div className="truncate">
                    <div className="text-[11px] font-bold text-slate-800 truncate">{u.name}</div>
                    <div className="text-[9px] text-slate-500 truncate">{u.title}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 text-center text-[10px] text-slate-400">
          EKOS Elektrik A.Ş. • ISO 9001 Mühendislik Portal Standardı
        </div>
      </div>
    </div>
  );
};
