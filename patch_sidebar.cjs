const fs = require('fs');
let code = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

const targetLogo = `<div className="bg-[#D32F2F] text-white font-bold tracking-wider text-xs px-2.5 py-1 rounded shadow-sm">
            EKOS
          </div>`;

const newLogo = `<div className="flex items-center space-x-2">
            {/* EKOS Electric Logo (SVG representation) */}
            <svg viewBox="0 0 50 50" className="w-6 h-6 text-[#D32F2F] shrink-0" fill="currentColor">
              <path d="M25,25 m-5,0 a5,5 0 1,0 10,0 a5,5 0 1,0 -10,0" />
              <path d="M12,25 a13,13 0 0,1 26,0" fill="none" stroke="currentColor" strokeWidth="4" />
              <path d="M3,25 a22,22 0 0,1 44,0" fill="none" stroke="currentColor" strokeWidth="4" />
            </svg>
            <div className="flex items-baseline font-sans">
              <span className="text-[#D32F2F] font-extrabold text-2xl tracking-tighter">EKOS</span>
              <span className="text-slate-400 font-light text-2xl tracking-tight ml-1">electric</span>
            </div>
          </div>`;

code = code.replace(targetLogo, newLogo);

// There might be another logo in Login.tsx
fs.writeFileSync('src/components/Sidebar.tsx', code);
