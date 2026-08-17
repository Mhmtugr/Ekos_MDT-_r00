const fs = require('fs');
let mockData = fs.readFileSync('src/data/mockData.ts', 'utf8');

mockData = mockData.replace("timestamp: '2026-05-20T16:00:00Z' }\n\n  { id: 'l-init'", "timestamp: '2026-05-20T16:00:00Z' },\n  { id: 'l-init'");
fs.writeFileSync('src/data/mockData.ts', mockData);
