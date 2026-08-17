const fs = require('fs');
let code = fs.readFileSync('src/components/Settings.tsx', 'utf8');

code = code.replace(/,\s*, Database, FileJson, FileSpreadsheet, UploadCloud/, ', Database, FileJson, FileSpreadsheet, UploadCloud');

fs.writeFileSync('src/components/Settings.tsx', code);
