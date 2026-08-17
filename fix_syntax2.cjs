const fs = require('fs');
let code = fs.readFileSync('src/components/NewMDTModal.tsx', 'utf8');

code = code.replace(
  "drawnById: assignedToId: currentUser.role === 'admin' ? assignedToId : undefined,",
  "drawnById: currentUser.role === 'admin' ? assignedToId : undefined,"
);

code = code.replace(
  "assignedToId, // revert it first globally", // in case it messed up the payload `assignedToId,`
  "assignedToId,"
);

// We need to fix the actual payload object to do what we wanted.
// The payload has a property `assignedToId` which is just `assignedToId,`
code = code.replace(
  "      assignedToId,\n      currentStatus",
  "      assignedToId: currentUser.role === 'admin' ? assignedToId : undefined,\n      currentStatus"
);

fs.writeFileSync('src/components/NewMDTModal.tsx', code);
