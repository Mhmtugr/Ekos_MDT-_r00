const fs = require('fs');

const svgCode = `<svg viewBox="0 0 120 40" className="h-6" fill="currentColor">
              {/* The 3 arcs on the left */}
              <path d="M 18,5 A 15,15 0 0,0 18,35" fill="none" stroke="#D32F2F" strokeWidth="3" strokeLinecap="round" />
              <path d="M 12,10 A 10,10 0 0,0 12,30" fill="none" stroke="#D32F2F" strokeWidth="3" strokeLinecap="round" />
              <path d="M 6,15 A 5,5 0 0,0 6,25" fill="none" stroke="#D32F2F" strokeWidth="3" strokeLinecap="round" />
            </svg>`;

// We will use standard text for EKOS and electric since they are clean typography.
// Let's modify Sidebar.tsx

let sidebar = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

const targetSidebarLogo = `<div className="flex items-center space-x-2">
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

const betterSidebarLogo = `<div className="flex items-center space-x-0.5">
            <svg viewBox="0 0 30 40" className="h-5 shrink-0" fill="currentColor">
              <path d="M 22,8 C 15,8 10,14 10,20 C 10,26 15,32 22,32" fill="none" stroke="#D32F2F" strokeWidth="2.5" />
              <path d="M 16,13 C 11,13 8,16 8,20 C 8,24 11,27 16,27" fill="none" stroke="#D32F2F" strokeWidth="2.5" />
              <polygon points="5,20 10,17 10,23" fill="#D32F2F" />
            </svg>
            <div className="flex items-baseline font-sans" style={{ letterSpacing: '-0.02em' }}>
              <span className="text-[#D32F2F] font-black text-[22px] font-sans">EKOS</span>
              <span className="text-slate-400 font-light text-[22px] font-sans">electric</span>
            </div>
          </div>`;

sidebar = sidebar.replace(targetSidebarLogo, betterSidebarLogo);
fs.writeFileSync('src/components/Sidebar.tsx', sidebar);

// Modify Login.tsx

let login = fs.readFileSync('src/components/Login.tsx', 'utf8');

const targetLoginLogo = `<div className="flex flex-col items-center justify-center mb-4">
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

const betterLoginLogo = `<div className="flex flex-col items-center justify-center mb-6">
              <div className="flex items-center space-x-1">
                <svg viewBox="0 0 30 40" className="h-7 shrink-0 drop-shadow-md" fill="currentColor">
                  <path d="M 22,8 C 15,8 10,14 10,20 C 10,26 15,32 22,32" fill="none" stroke="#D32F2F" strokeWidth="3" />
                  <path d="M 16,13 C 11,13 8,16 8,20 C 8,24 11,27 16,27" fill="none" stroke="#D32F2F" strokeWidth="3" />
                  <polygon points="5,20 10,16 10,24" fill="#D32F2F" />
                </svg>
                <div className="flex items-baseline font-sans" style={{ letterSpacing: '-0.02em' }}>
                  <span className="text-[#D32F2F] font-black text-3xl drop-shadow-md font-sans">EKOS</span>
                  <span className="text-slate-100 font-light text-3xl drop-shadow-md font-sans">electric</span>
                </div>
              </div>
              <div className="mt-2 text-[11px] font-semibold text-slate-200 tracking-[0.2em] uppercase">
                Mühendislik Değişiklik Yönetimi
              </div>
            </div>`;

login = login.replace(targetLoginLogo, betterLoginLogo);
fs.writeFileSync('src/components/Login.tsx', login);

