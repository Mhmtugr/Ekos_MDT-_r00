const fs = require('fs');

const sidebarLogoTarget = `<div className="flex items-center space-x-0.5">
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

const sidebarLogoNew = `<div className="flex items-center space-x-2">
            <svg viewBox="0 0 34 40" className="h-5 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M 20 2 C 0 12 0 28 20 38 C 9 28 9 12 20 2 Z" fill="#D32F2F" />
              <path d="M 27 9 C 14 15 14 25 27 31 C 20 25 20 15 27 9 Z" fill="#D32F2F" />
              <path d="M 32 14 C 25 16 25 24 32 26 Z" fill="#54585A" />
            </svg>
            <div className="flex items-center font-sans tracking-tight">
              <span className="text-[#D32F2F] font-black text-2xl" style={{ letterSpacing: '-0.02em' }}>EKOS</span>
              <div className="w-[1.5px] h-5 bg-[#D32F2F] mx-1.5 opacity-80"></div>
              <span className="text-slate-400 font-light text-2xl" style={{ letterSpacing: '-0.02em' }}>electric</span>
            </div>
          </div>`;


const loginLogoTarget = `<div className="flex flex-col items-center justify-center mb-6">
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

const loginLogoNew = `<div className="flex flex-col items-center justify-center mb-8">
              <div className="flex items-center space-x-3">
                <svg viewBox="0 0 34 40" className="h-9 shrink-0 drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 20 2 C 0 12 0 28 20 38 C 9 28 9 12 20 2 Z" fill="#D32F2F" />
                  <path d="M 27 9 C 14 15 14 25 27 31 C 20 25 20 15 27 9 Z" fill="#D32F2F" />
                  <path d="M 32 14 C 25 16 25 24 32 26 Z" fill="#54585A" />
                </svg>
                <div className="flex items-center font-sans">
                  <span className="text-[#D32F2F] font-black text-[40px] leading-none drop-shadow-sm" style={{ letterSpacing: '-0.03em' }}>EKOS</span>
                  <div className="w-[2px] h-8 bg-[#D32F2F] mx-2.5 opacity-90 drop-shadow-sm"></div>
                  <span className="text-slate-200 font-light text-[40px] leading-none drop-shadow-sm" style={{ letterSpacing: '-0.03em' }}>electric</span>
                </div>
              </div>
              <div className="mt-4 text-xs font-bold text-slate-200 tracking-[0.25em] uppercase drop-shadow-md">
                Mühendislik Değişiklik Yönetimi
              </div>
            </div>`;

let sidebar = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');
if (sidebar.includes(sidebarLogoTarget)) {
  sidebar = sidebar.replace(sidebarLogoTarget, sidebarLogoNew);
  fs.writeFileSync('src/components/Sidebar.tsx', sidebar);
  console.log("Sidebar logo replaced.");
} else {
  console.log("Sidebar logo NOT found.");
}

let login = fs.readFileSync('src/components/Login.tsx', 'utf8');
if (login.includes(loginLogoTarget)) {
  login = login.replace(loginLogoTarget, loginLogoNew);
  fs.writeFileSync('src/components/Login.tsx', login);
  console.log("Login logo replaced.");
} else {
  console.log("Login logo NOT found.");
}
