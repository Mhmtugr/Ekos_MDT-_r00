import { Router, Response } from 'express';
import { db, logAuditServer } from '../db/database';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/permissions
router.get('/', authenticateToken, (req: AuthRequest, res: Response) => {
  const rows = db.prepare('SELECT role, matrix_json FROM permissions').all() as { role: string; matrix_json: string }[];
  const result: Record<string, any> = {};
  for (const r of rows) {
    try {
      result[r.role] = JSON.parse(r.matrix_json);
    } catch (e) {
      // fallback
    }
  }
  res.json(result);
});

// POST /api/permissions
router.post('/', authenticateToken, (req: AuthRequest, res: Response) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Sadece Admin kullanıcı izin matrisini değiştirebilir.' });
  }

  const matrix = req.body;
  const insertOrUpdate = db.prepare(`
    INSERT INTO permissions (role, matrix_json) VALUES (?, ?)
    ON CONFLICT(role) DO UPDATE SET matrix_json = excluded.matrix_json
  `);

  for (const [role, perms] of Object.entries(matrix)) {
    insertOrUpdate.run(role, JSON.stringify(perms));
  }

  logAuditServer(req.user.id, req.user.name, 'Sistem İzin Matrisi Güncellendi', 'SISTEM', 'SYS-PERM');

  res.json({ message: 'İzin matrisi güncellendi.' });
});

export default router;
