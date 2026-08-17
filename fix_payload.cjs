const fs = require('fs');
let code = fs.readFileSync('src/components/NewMDTModal.tsx', 'utf8');

// The payload generation is inside handleSubmit
// let's replace `assignedToId` with `currentUser.role === 'admin' ? assignedToId : ''`
// and similarly for mechanical

code = code.replace(
  /assignedToId,/g, 
  "assignedToId: currentUser.role === 'admin' ? assignedToId : undefined,"
);

// wait, the line 118 has `drawnById: assignedToId,`
code = code.replace(
  /drawnById: assignedToId,/g,
  "drawnById: currentUser.role === 'admin' ? assignedToId : undefined,"
);

code = code.replace(
  /checkedMechanicalById: hasMechanicalEffect \? assignedMechanicalId : undefined,/g,
  "checkedMechanicalById: (currentUser.role === 'admin' && hasMechanicalEffect) ? assignedMechanicalId : undefined,"
);

fs.writeFileSync('src/components/NewMDTModal.tsx', code);
