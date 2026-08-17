import { Router, Response } from 'express';
import { db } from '../db/database';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { verifyAuditLogChain } from '../utils/hashChain';

const router = Router();

// GET /api/audit-logs/verify
router.get('/verify', authenticateToken, (req: AuthRequest, res: Response) => {
  const rows = db.prepare('SELECT id, user_id, user_name, action, record_type, record_id, old_value, new_value, timestamp, prev_hash, hash FROM audit_logs ORDER BY rowid ASC').all();
  const result = verifyAuditLogChain(rows);
  if (!result.valid) {
    return res.status(400).json({ success: false, ...result });
  }
  res.json({ success: true, message: 'Cryptographic Hash-Chain Bütünlüğü Doğrulandı (Tüm Kayıtlar Orijinal ve Değiştirilmemiş).', logCount: rows.length });
});

// GET /api/audit-logs
// Note: NO UPDATE, NO DELETE endpoints exist! Immutability is strictly enforced at application and API level.
router.get('/', authenticateToken, (req: AuthRequest, res: Response) => {
  const rows = db.prepare('SELECT id, user_id as userId, user_name as userName, action, record_type as recordType, record_id as recordId, old_value as oldValue, new_value as newValue, timestamp, prev_hash as prevHash, hash FROM audit_logs ORDER BY rowid DESC').all();
  res.json(rows);
});

export default router;
