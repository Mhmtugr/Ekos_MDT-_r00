import React, { useState } from 'react';
import { Eye, EyeOff, Lock, User as UserIcon, ArrowRight, AlertCircle } from 'lucide-react';
import { User } from '../types';
import { apiService } from '../services/apiService';

interface LoginProps {
  users: User[];
  onLogin: (user: User) => void;
  onGuestLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ users, onLogin, onGuestLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { user } = await apiService.login(username.trim(), password.trim());
      onLogin(user);
    } catch (err: any) {
      setError(err.message || 'Giriş yapılamadı.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSelect = async (u: User) => {
    const un = u.username || u.email;
    const pw = u.password || '123';
    setUsername(un);
    setPassword(pw);
    setError(null);
    setLoading(true);

    try {
      const { user } = await apiService.login(un, pw);
      onLogin(user);
    } catch (err: any) {
      setError(err.message || 'Giriş yapılamadı.');
    } finally {
      setLoading(false);
    }
  };

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
            <div className="flex flex-col items-center justify-center mb-4">
              <div className="flex items-center space-x-3">
                <svg viewBox="0 0 34 40" className="h-9 shrink-0 drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 20 2 C 0 12 0 28 20 38 C 9 28 9 12 20 2 Z" fill="#D32F2F" />
                  <path d="M 27 9 C 14 15 14 25 27 31 C 20 25 20 15 27 9 Z" fill="#D32F2F" />
                  <path d="M 32 14 C 25 16 25 24 32 26 Z" fill="#54585A" />
                </svg>
                <div className="flex items-center font-sans tracking-tight">
                  <span className="text-[#D32F2F] font-black text-4xl drop-shadow-sm" style={{ letterSpacing: '-0.03em' }}>EKOS</span>
                  <div className="w-[1.5px] h-7 bg-[#D32F2F] mx-2 opacity-90 drop-shadow-sm"></div>
                  <span className="text-slate-300 font-light text-4xl drop-shadow-sm" style={{ letterSpacing: '-0.03em' }}>electric</span>
                </div>
              </div>
              <div className="mt-4 text-xs font-bold text-slate-300 tracking-[0.2em] uppercase drop-shadow-md">
                Mühendislik & Design Portal
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
                <span className="text-[10px] text-slate-400 font-normal">ör. mehmet.ugur</span>
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="ör. mehmet.ugur veya e-posta"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-hidden focus:border-[#D32F2F] focus:bg-white transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>Şifre</span>
                <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  Varsayılan: 123
                </span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:border-[#D32F2F] focus:bg-white transition font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                  title={showPassword ? 'Şifreyi Gizle' : 'Şifreyi Göster'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#D32F2F] hover:bg-red-700 text-white font-bold rounded-lg text-xs transition shadow-md flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'Giriş Yapılıyor...' : 'Sisteme Giriş Yap'}</span>
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
                    <div className="text-[9px] text-slate-500 truncate">
                      {u.username || u.email.split('@')[0]}
                    </div>
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
