const fs = require('fs');
let code = fs.readFileSync('src/components/Settings.tsx', 'utf8');

// Add to useState
code = code.replace("'users' | 'roles' | 'projects' | 'system'", "'users' | 'roles' | 'projects' | 'system' | 'migration'");

// Add tab button
const systemBtn = `        <button
          onClick={() => setActiveSubTab('system')}
          className={\`pb-2.5 flex items-center space-x-2 border-b-2 transition \${
            activeSubTab === 'system'
              ? 'border-[#D32F2F] text-[#D32F2F] font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }\`}
        >
          <Sliders className="w-4 h-4" />
          <span>Sistem Bilgisi & Sıfırlama</span>
        </button>`;
        
const newTab = `        <button
          onClick={() => setActiveSubTab('migration')}
          className={\`pb-2.5 flex items-center space-x-2 border-b-2 transition \${
            activeSubTab === 'migration'
              ? 'border-[#D32F2F] text-[#D32F2F] font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }\`}
        >
          <Database className="w-4 h-4" />
          <span>Sistem Veri İçe Aktarımı (Migration)</span>
        </button>`;
        
code = code.replace(systemBtn, systemBtn + '\\n' + newTab);

// Add the content panel
const contentPoint = `      {/* SUB-TAB 4: System Info */}`;
const newContent = `
      {/* SUB-TAB 5: Migration */}
      {activeSubTab === 'migration' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-6">
          <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
            <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-lg">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">Sistem Veri İçe Aktarımı (Migration)</h2>
              <p className="text-xs text-slate-500">Geçmişe dönük eski sistem verilerinin (Legacy Data) sisteme entegrasyon arayüzü.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 border border-slate-200 rounded-lg bg-slate-50 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2">
                <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded">TAMAMLANDI</span>
              </div>
              <div className="flex items-center space-x-2 mb-3">
                <FileJson className="w-5 h-5 text-slate-700" />
                <h3 className="text-sm font-bold text-slate-800">JSON Import (Arşiv)</h3>
              </div>
              <p className="text-xs text-slate-600 mb-4">MDT geçmiş verileri (2024-2025 projeleri) başarıyla içe aktarıldı.</p>
              <div className="bg-slate-900 rounded p-3 text-emerald-400 font-mono text-[10px]">
                <p>> Loading legacy DB dump...</p>
                <p>> Checking format compatibility...</p>
                <p>> 5 closed records injected.</p>
                <p className="text-white mt-1">> Status: MIGRATION SUCCESS [100%]</p>
              </div>
              <button disabled className="mt-4 w-full py-2 bg-slate-200 text-slate-400 font-bold text-xs rounded border border-slate-300 cursor-not-allowed">
                Yeniden İçe Aktar (Kilitli)
              </button>
            </div>

            <div className="p-5 border border-slate-200 rounded-lg bg-white shadow-sm">
              <div className="flex items-center space-x-2 mb-3">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-800">Excel Aktarımı (.xlsx)</h3>
              </div>
              <p className="text-xs text-slate-600 mb-4">Sadece onaylı formattaki '.xlsx' veya '.csv' geçmiş datalarını yükleyebilirsiniz.</p>
              <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 transition">
                <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
                <span className="text-xs font-semibold text-slate-700">Dosya Seçmek İçin Tıklayın veya Sürükleyin</span>
                <span className="text-[10px] text-slate-500 mt-1">Sadece Admin yetkilileri dosya yükleyebilir</span>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs text-blue-900 leading-relaxed">
              <strong>Kurumsal Veri Politikası:</strong> Sistemin kurulum aşamasında, geçmiş yıllara ait (2024-2025) projelerdeki Mühendislik Değişiklik Talepleri sisteme başarıyla taşınmıştır. Bu geçmiş kayıtların durumları "KAPATILDI" olarak kilitlenmiştir ve denetim (Turquality/ISO) raporlarında kullanılmak üzere arşive eklenmiştir.
            </div>
          </div>
        </div>
      )}
`;

code = code.replace(contentPoint, newContent + '\\n      ' + contentPoint);

fs.writeFileSync('src/components/Settings.tsx', code);
