const fs = require('fs');

// Fix Settings.tsx
let settings = fs.readFileSync('src/components/Settings.tsx', 'utf8');

// 1. Remove | 'migration'
settings = settings.replace(/'users' \| 'roles' \| 'projects' \| 'system' \| 'migration'/, "'users' | 'roles' | 'projects' | 'system'");

// 2. Remove migration button
const migrationBtnRegex = /\s*<button\s+onClick=\{\(\) => setActiveSubTab\('migration'\)\}[\s\S]*?<\/button>/;
settings = settings.replace(migrationBtnRegex, '');

// 3. Remove migration tab block
const migrationTabRegex = /\s*\{\/\* SUB-TAB 5: Migration \*\/\}[\s\S]*?(?=\s*<\/div>\s*\)\s*;\s*\}\s*;\s*export default Settings;)/;
settings = settings.replace(migrationTabRegex, '');

// 4. Update system info text
const systemInfoTarget = `<div className="p-4 bg-slate-50 rounded-lg text-xs space-y-2 text-slate-700 border border-slate-200">
            <div><strong>Kurum:</strong> EKOS Elektrik Mühendislik-Tasarım Birimi</div>
            <div><strong>Modül:</strong> Mühendislik Değişiklik ve Müşteri Revizyon Takip Sistemi (MDT)</div>
            <div><strong>Versiyon:</strong> v1.0 (Prodüksiyon Sürümü)</div>
            <div><strong>Standart:</strong> ISO 9001 / Mühendislik Değişiklik Yönetimi Prosedürü</div>
          </div>`;
          
const systemInfoReplacement = `<div className="p-4 bg-slate-50 rounded-lg text-xs space-y-2 text-slate-700 border border-slate-200">
            <div><strong>Kurum:</strong> EKOS Elektrik Mühendislik-Tasarım Birimi</div>
            <div><strong>Modül:</strong> Mühendislik Değişiklik ve Müşteri Revizyon Takip Sistemi (MDT)</div>
            <div><strong>Canlıya Alınma Tarihi:</strong> 15 Ocak 2024</div>
            <div><strong>Sürüm:</strong> v1.0 (Prodüksiyon Ortamı)</div>
            <div><strong>Standart:</strong> ISO 9001 / EKOS-PR-01 Mühendislik Değişiklik Yönetimi Prosedürü</div>
          </div>`;
          
settings = settings.replace(systemInfoTarget, systemInfoReplacement);
fs.writeFileSync('src/components/Settings.tsx', settings);

// Fix mockData.ts
let mockData = fs.readFileSync('src/data/mockData.ts', 'utf8');
mockData = mockData.replace(/Geçmiş MDT talebi/g, 'Yeni MDT talebi');

// Add the Jan 15 2024 log to INITIAL_AUDIT_LOGS at the end
const logToAdd = `\n  { id: 'l-init', userId: 'u1', userName: 'Mehmet Uğur', action: 'EKOS MDT Portalı v1.0 Kurulumu Tamamlandı ve Kullanıma Açıldı.', recordType: 'SISTEM', recordId: 'SYS-INIT', timestamp: '2024-01-15T08:30:00Z' }`;
mockData = mockData.replace(/];\s*export const INITIAL_NOTIFICATIONS/, logToAdd + '\n];\n\nexport const INITIAL_NOTIFICATIONS');

fs.writeFileSync('src/data/mockData.ts', mockData);
console.log("Patches applied.");
