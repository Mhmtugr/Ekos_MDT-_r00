const fs = require('fs');
let code = fs.readFileSync('src/components/Settings.tsx', 'utf8');

// 1. In handleStartEditUser, don't set the old password
code = code.replace("setEditUserPassword(user.password || '123');", "setEditUserPassword('');");

// 2. In handleSaveEditUser, use the old password if the input is empty
code = code.replace("password: editUserPassword.trim() || '123',", "password: editUserPassword.trim() ? editUserPassword : editingUser.password,");

// 3. Remove "Şifre" from the <th>
code = code.replace('<th className="px-4 py-3">Şifre</th>', '');

// 4. Remove the <td> for Şifre
code = code.replace(/<td className="px-4 py-3">\s*<div className="flex items-center space-x-1\.5">\s*<span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0\.5 rounded border border-emerald-200">\s*\{isPassVisible \? userPass : '••••••••'\}\s*<\/span>\s*<button\s*onClick=\{[^}]+\}\s*className="text-slate-400 hover:text-slate-600 p-1 transition"\s*title=\{[^}]+\}\s*>\s*\{isPassVisible \? <EyeOff className="w-3\.5 h-3\.5" \/> : <Eye className="w-3\.5 h-3\.5" \/>\}\s*<\/button>\s*<\/div>\s*<\/td>/g, '');

// 5. Replace "Düzenle / Şifre" with "Düzenle / Şifre Sıfırla"
code = code.replace("<span>Düzenle / Şifre</span>", "<span>Düzenle / Şifre Sıfırla</span>");

// 6. Fix "Rol Grubu" names
const roleMapStr = `
const roleMap: Record<string, string> = {
  admin: 'Sistem Yöneticisi',
  sales: 'Satış',
  electrical_design: 'Elektrik Tasarım',
  mechanical_approval: 'Mekanik Tasarım',
  executive_approval: 'Üst Yönetim',
  project_management: 'Proje Yönetimi',
  viewer: 'İzleyici'
};
`;
// add roleMap after imports
code = code.replace("import { User, Project } from '../types';", "import { User, Project } from '../types';\n" + roleMapStr);

// replace {u.role} in table with {roleMap[u.role] || u.role}
code = code.replace(/<span className="bg-slate-100 text-slate-800 px-2 py-0\.5 rounded text-\[10px\] font-bold uppercase">\s*\{u\.role\}\s*<\/span>/g, '<span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[10px] font-bold uppercase">{roleMap[u.role] || u.role}</span>');

// Change password input label
code = code.replace('<label className="block text-slate-700 font-bold mb-1">Şifre *</label>', '<label className="block text-slate-700 font-bold mb-1">Yeni Şifre (Değiştirmek İçin)</label>');
// Remove required from password input in edit modal
code = code.replace(/<input\s*type="text"\s*value=\{editUserPassword\}\s*onChange=\{\(e\) => setEditUserPassword\(e\.target\.value\)\}\s*placeholder="Şifre belirleyin"\s*className="w-full px-2\.5 py-1\.5 bg-white border border-slate-200 rounded text-xs font-mono font-bold text-emerald-800"\s*required\s*\/>/g, '<input type="text" value={editUserPassword} onChange={(e) => setEditUserPassword(e.target.value)} placeholder="Yeni şifre belirleyin (Boşsa değişmez)" className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs font-mono font-bold text-emerald-800" />');

// also clean up any `isPassVisible` and `userPass` declarations in the map function just in case
code = code.replace(/const isPassVisible = !!visiblePasswords\[u\.id\];/g, '');
code = code.replace(/const userPass = u\.password \|\| '123';/g, '');


fs.writeFileSync('src/components/Settings.tsx', code);
