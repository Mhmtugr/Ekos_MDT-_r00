const fs = require('fs');
let code = fs.readFileSync('src/data/mockData.ts', 'utf8');

const regex = /export const INITIAL_AUDIT_LOGS: AuditLog\[\] = \[\s*\{[^\}]+\}\s*\];/;

const newAuditLogs = `export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  { id: 'l1', userId: 'u11', userName: 'Halime Yılmaz', action: 'Geçmiş MDT talebi oluşturuldu: MDT-2024-001 (ASELSAN)', recordType: 'MDT', recordId: 'mdt-1', newValue: 'Yeni -> Tasarımda', timestamp: '2024-10-15T09:00:00Z' },
  { id: 'l2', userId: 'u1', userName: 'Mehmet Uğur', action: 'Tasarım Onaylandı ve Kapatıldı: MDT-2024-001', recordType: 'MDT', recordId: 'mdt-1', oldValue: 'Tasarımda', newValue: 'Kapatıldı', timestamp: '2024-11-20T14:30:00Z' },
  { id: 'l3', userId: 'u10', userName: 'Burak Gür', action: 'Geçmiş MDT talebi oluşturuldu: MDT-2024-002 (CEGELEC)', recordType: 'MDT', recordId: 'mdt-2', newValue: 'Yeni -> Tasarımda', timestamp: '2024-10-20T10:00:00Z' },
  { id: 'l4', userId: 'u1', userName: 'Mehmet Uğur', action: 'Tasarım Onaylandı ve Kapatıldı: MDT-2024-002', recordType: 'MDT', recordId: 'mdt-2', oldValue: 'Tasarımda', newValue: 'Kapatıldı', timestamp: '2024-11-28T16:00:00Z' },
  { id: 'l5', userId: 'u12', userName: 'Najlae El Amal', action: 'Geçmiş MDT talebi oluşturuldu: MDT-2025-001 (EDIEL)', recordType: 'MDT', recordId: 'mdt-3', newValue: 'Yeni -> Tasarımda', timestamp: '2025-11-05T09:00:00Z' },
  { id: 'l6', userId: 'u1', userName: 'Mehmet Uğur', action: 'Tasarım Onaylandı ve Kapatıldı: MDT-2025-001', recordType: 'MDT', recordId: 'mdt-3', oldValue: 'Tasarımda', newValue: 'Kapatıldı', timestamp: '2025-12-15T15:00:00Z' },
  { id: 'l7', userId: 'u12', userName: 'Najlae El Amal', action: 'Geçmiş MDT talebi oluşturuldu: MDT-2025-002 (JAYME DA COSTA)', recordType: 'MDT', recordId: 'mdt-4', newValue: 'Yeni -> Tasarımda', timestamp: '2025-12-10T09:00:00Z' },
  { id: 'l8', userId: 'u1', userName: 'Mehmet Uğur', action: 'Tasarım Onaylandı ve Kapatıldı: MDT-2025-002', recordType: 'MDT', recordId: 'mdt-4', oldValue: 'Tasarımda', newValue: 'Kapatıldı', timestamp: '2026-01-20T11:00:00Z' },
  { id: 'l9', userId: 'u10', userName: 'Burak Gür', action: 'Geçmiş MDT talebi oluşturuldu: MDT-2025-003 (GEAT MC PROJELERİ)', recordType: 'MDT', recordId: 'mdt-5', newValue: 'Yeni -> Tasarımda', timestamp: '2025-09-15T09:00:00Z' },
  { id: 'l10', userId: 'u1', userName: 'Mehmet Uğur', action: 'Tasarım Onaylandı ve Kapatıldı: MDT-2025-003', recordType: 'MDT', recordId: 'mdt-5', oldValue: 'Tasarımda', newValue: 'Kapatıldı', timestamp: '2025-11-10T14:00:00Z' },
  { id: 'l11', userId: 'u13', userName: 'Nurdan Doğan', action: 'Geçmiş MDT talebi oluşturuldu: MDT-2026-001 (WISE / GREENVILLE)', recordType: 'MDT', recordId: 'mdt-6', newValue: 'Yeni -> Tasarımda', timestamp: '2026-03-10T09:00:00Z' },
  { id: 'l12', userId: 'u1', userName: 'Mehmet Uğur', action: 'Tasarım Onaylandı ve Kapatıldı: MDT-2026-001', recordType: 'MDT', recordId: 'mdt-6', oldValue: 'Tasarımda', newValue: 'Kapatıldı', timestamp: '2026-05-20T16:00:00Z' }
];`;

if (code.match(regex)) {
  code = code.replace(regex, newAuditLogs);
  fs.writeFileSync('src/data/mockData.ts', code);
  console.log("Success replacing audit logs");
} else {
  console.log("Regex did not match");
}
