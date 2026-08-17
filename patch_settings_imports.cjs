const fs = require('fs');
let code = fs.readFileSync('src/components/Settings.tsx', 'utf8');

const regex = /import \{([^}]+)\} from 'lucide-react';/;
const match = code.match(regex);
if (match) {
  let imports = match[1];
  imports += ', Database, FileJson, FileSpreadsheet, UploadCloud';
  code = code.replace(regex, `import {${imports}} from 'lucide-react';`);
  fs.writeFileSync('src/components/Settings.tsx', code);
}
