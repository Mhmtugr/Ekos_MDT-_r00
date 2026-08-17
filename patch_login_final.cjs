const fs = require('fs');
let login = fs.readFileSync('src/components/Login.tsx', 'utf8');

const oldLogo = `<svg viewBox="0 0 34 40" className="h-9 shrink-0 drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 20 2 C 0 12 0 28 20 38 C 9 28 9 12 20 2 Z" fill="#D32F2F" />
                  <path d="M 27 9 C 14 15 14 25 27 31 C 20 25 20 15 27 9 Z" fill="#D32F2F" />
                  <path d="M 32 14 C 25 16 25 24 32 26 Z" fill="#54585A" />
                </svg>
                <div className="flex items-center font-sans">
                  <span className="text-[#D32F2F] font-black text-[40px] leading-none drop-shadow-sm" style={{ letterSpacing: '-0.03em' }}>EKOS</span>
                  <div className="w-[2px] h-8 bg-[#D32F2F] mx-2.5 opacity-90 drop-shadow-sm"></div>
                  <span className="text-slate-200 font-light text-[40px] leading-none drop-shadow-sm" style={{ letterSpacing: '-0.03em' }}>electric</span>
                </div>`;

const newLogo = `<svg viewBox="0 0 34 40" className="h-9 shrink-0 drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 20 2 C 0 12 0 28 20 38 C 9 28 9 12 20 2 Z" fill="#C8102E" />
                  <path d="M 27 9 C 14 15 14 25 27 31 C 20 25 20 15 27 9 Z" fill="#C8102E" />
                  <path d="M 32 14 C 25 16 25 24 32 26 Z" fill="#53565A" />
                </svg>
                <div className="flex items-center font-sans">
                  <span className="text-[#C8102E] font-black text-[40px] leading-none drop-shadow-sm" style={{ letterSpacing: '-0.03em' }}>EKOS</span>
                  <div className="w-[2px] h-8 bg-[#C8102E] mx-2.5 opacity-90 drop-shadow-sm"></div>
                  <span className="text-slate-200 font-light text-[40px] leading-none drop-shadow-sm" style={{ letterSpacing: '-0.03em' }}>electric</span>
                </div>`;

login = login.replace(oldLogo, newLogo);
fs.writeFileSync('src/components/Login.tsx', login);
