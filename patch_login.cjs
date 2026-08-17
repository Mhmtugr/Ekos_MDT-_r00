const fs = require('fs');
let code = fs.readFileSync('src/components/Login.tsx', 'utf8');

const targetLogo = `<div className="flex items-center space-x-2.5 mb-2">
              <div className="bg-[#D32F2F] text-white px-2.5 py-1 rounded font-black text-sm tracking-wider uppercase shadow-md">
                EKOS
              </div>
              <div className="text-left">
                <div className="text-sm font-bold tracking-tight text-white leading-tight">
                  MDT Sistemi
                </div>
                <div className="text-[10px] text-slate-300 font-medium tracking-wide">
                  Mühendislik Değişiklik Talepleri
                </div>
              </div>
            </div>`;

const newLogo = `<div className="flex flex-col items-center justify-center mb-4">
              <div className="flex items-center space-x-2">
                <svg viewBox="0 0 50 50" className="w-8 h-8 text-[#D32F2F]" fill="currentColor">
                  <path d="M25,25 m-5,0 a5,5 0 1,0 10,0 a5,5 0 1,0 -10,0" />
                  <path d="M12,25 a13,13 0 0,1 26,0" fill="none" stroke="currentColor" strokeWidth="4" />
                  <path d="M3,25 a22,22 0 0,1 44,0" fill="none" stroke="currentColor" strokeWidth="4" />
                </svg>
                <div className="flex items-baseline font-sans">
                  <span className="text-[#D32F2F] font-extrabold text-3xl tracking-tighter drop-shadow-md">EKOS</span>
                  <span className="text-slate-100 font-light text-3xl tracking-tight ml-1 drop-shadow-md">electric</span>
                </div>
              </div>
              <div className="mt-2 text-[11px] font-semibold text-slate-200 tracking-[0.2em] uppercase">
                Mühendislik Değişiklik Yönetimi
              </div>
            </div>`;

code = code.replace(targetLogo, newLogo);

fs.writeFileSync('src/components/Login.tsx', code);
