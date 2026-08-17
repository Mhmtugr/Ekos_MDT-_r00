const fs = require('fs');
let code = fs.readFileSync('src/components/Settings.tsx', 'utf8');

const roleMapStr = `
const roleMap: Record<string, string> = {
  admin: 'Sistem Yöneticisi',
  sales: 'Satış',
  electrical_design: 'Elektrik Tasarım',
  mechanical_approval: 'Mekanik Tasarım',
  executive_approval: 'Üst Yönetim',
  project_management: 'Proje Yönetimi',
  viewer: 'İzleyici'
};
`;

code = code.replace("interface SettingsProps {", roleMapStr + "\ninterface SettingsProps {");

fs.writeFileSync('src/components/Settings.tsx', code);
