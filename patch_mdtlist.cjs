const fs = require('fs');
let code = fs.readFileSync('src/components/MDTList.tsx', 'utf8');

const targetStr = `<button
              onClick={() => onOpenNewMDT(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-md text-xs font-semibold transition"
              title="Geçmiş 2024-2025 projesini doğrudan kapalı kaydet"
            >
              <History className="w-3.5 h-3.5" />
              <span>Geçmişe Dönük Kayıt Ekle</span>
            </button>`;

code = code.replace(targetStr, '');

fs.writeFileSync('src/components/MDTList.tsx', code);
