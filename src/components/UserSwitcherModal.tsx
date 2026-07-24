import React from 'react';
import { X, Check, Shield, Users } from 'lucide-react';
import { User } from '../types';

interface UserSwitcherModalProps {
  users: User[];
  currentUser: User;
  onSelectUser: (user: User) => void;
  onClose: () => void;
}

export const UserSwitcherModal: React.FC<UserSwitcherModalProps> = ({
  users,
  currentUser,
  onSelectUser,
  onClose,
}) => {
  const roleLabels: Record<string, string> = {
    admin: 'Mühendislik Yöneticisi / Admin (Mehmet Uğur)',
    electrical_design: 'Elektrik Tasarım Mühendisi (Halil, İlayda)',
    sales: 'Satış (Osman, Oğuz, Egemen, Ayşegül...)',
    project_management: 'Proje Yönetimi (Burak, Halime...)',
    mechanical_approval: 'Mekanik Onay Mercii (Erhan, Erol)',
    executive_approval: 'Üst Onay Mercii (Yasin, Tamer)',
    viewer: 'İzleyici (Salt-Okunur)',
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-150">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-slate-700" />
            <h2 className="text-sm font-bold text-slate-800">
              Aktif Kullanıcı & Rol Simülatörü
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-4">
          <p className="text-xs text-slate-500">
            Sistemdeki 18 tanımlı kullanıcıdan veya İzleyici rolünden birini seçerek ilgili kişinin ekran yetkilerini ve onay adımlarını anında test edebilirsiniz:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {users.map((u) => {
              const isSelected = u.id === currentUser.id;
              return (
                <button
                  key={u.id}
                  onClick={() => {
                    onSelectUser(u);
                    onClose();
                  }}
                  className={`flex items-start justify-between p-3 rounded-lg border text-left transition ${
                    isSelected
                      ? 'border-[#D32F2F] bg-red-50/50 ring-1 ring-[#D32F2F]'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {u.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                        <span>{u.name}</span>
                        {u.role === 'admin' && (
                          <span className="text-[9px] bg-red-100 text-[#D32F2F] px-1.5 py-0.2 rounded font-semibold">
                            Admin
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-600">{u.title}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{u.email}</div>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[#D32F2F] text-white flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-md transition"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
