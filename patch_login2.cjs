const fs = require('fs');

const loginLogoTarget = `<div className="flex items-center space-x-2.5 mb-2">
              <div className="bg-[#D32F2F] text-white px-2.5 py-1 rounded font-black text-sm tracking-wider uppercase shadow-md">
                EKOS
              </div>
              <div className="text-left">
                <div className="text-sm font-bold tracking-tight text-white leading-tight">
                  MDT Sistemi
                </div>
                <div className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
                  Mühendislik & Design Portal
                </div>
              </div>
            </div>`;

const loginLogoNew = `<div className="flex flex-col items-center justify-center mb-4">
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
            </div>`;

let login = fs.readFileSync('src/components/Login.tsx', 'utf8');
if (login.includes(loginLogoTarget)) {
  login = login.replace(loginLogoTarget, loginLogoNew);
  fs.writeFileSync('src/components/Login.tsx', login);
  console.log("Login logo replaced.");
} else {
  console.log("Login logo NOT found.");
}
