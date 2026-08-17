const fs = require('fs');
let code = fs.readFileSync('src/components/Settings.tsx', 'utf8');

code = code.replace(/<\/button>\\n\s*<button/g, '</button>\n        <button');

fs.writeFileSync('src/components/Settings.tsx', code);
