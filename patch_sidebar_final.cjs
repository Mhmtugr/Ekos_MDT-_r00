const fs = require('fs');
let sidebar = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

const oldLogo = `<svg viewBox="0 0 34 40" className="h-5 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M 20 2 C 0 12 0 28 20 38 C 9 28 9 12 20 2 Z" fill="#D32F2F" />
              <path d="M 27 9 C 14 15 14 25 27 31 C 20 25 20 15 27 9 Z" fill="#D32F2F" />
              <path d="M 32 14 C 25 16 25 24 32 26 Z" fill="#54585A" />
            </svg>
            <div className="flex items-center font-sans tracking-tight">
              <span className="text-[#D32F2F] font-black text-2xl" style={{ letterSpacing: '-0.02em' }}>EKOS</span>
              <div className="w-[1.5px] h-5 bg-[#D32F2F] mx-1.5 opacity-80"></div>
              <span className="text-slate-400 font-light text-2xl" style={{ letterSpacing: '-0.02em' }}>electric</span>
            </div>`;

const newLogo = `<svg viewBox="0 0 34 40" className="h-5 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M 20 2 C 0 12 0 28 20 38 C 9 28 9 12 20 2 Z" fill="#C8102E" />
              <path d="M 27 9 C 14 15 14 25 27 31 C 20 25 20 15 27 9 Z" fill="#C8102E" />
              <path d="M 32 14 C 25 16 25 24 32 26 Z" fill="#53565A" />
            </svg>
            <div className="flex items-center font-sans tracking-tight">
              <span className="text-[#C8102E] font-black text-2xl" style={{ letterSpacing: '-0.03em' }}>EKOS</span>
              <div className="w-[1px] h-5 bg-[#C8102E] mx-1.5 opacity-80"></div>
              <span className="text-slate-400 font-light text-2xl" style={{ letterSpacing: '-0.03em' }}>electric</span>
            </div>`;

sidebar = sidebar.replace(oldLogo, newLogo);
fs.writeFileSync('src/components/Sidebar.tsx', sidebar);
