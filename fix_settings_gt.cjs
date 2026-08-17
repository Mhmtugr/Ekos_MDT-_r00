const fs = require('fs');
let code = fs.readFileSync('src/components/Settings.tsx', 'utf8');

code = code.replace(/<p>> /g, '<p>&gt; ');
code = code.replace(/> Status:/g, '&gt; Status:');

fs.writeFileSync('src/components/Settings.tsx', code);
