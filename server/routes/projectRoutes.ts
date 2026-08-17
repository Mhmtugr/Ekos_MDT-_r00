import { Router, Response } from 'express';
import { db, logAuditServer } from '../db/database';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { Project } from '../../src/types';

const router = Router();

// GET /api/projects
router.get('/', authenticateToken, (req: AuthRequest, res: Response) => {
  const rows = db.prepare('SELECT id, canias_proje_no as caniasProjeNo, client_name as clientName, product_group as productGroup, server_folder_path as serverFolderPath, year, created_at as createdAt FROM projects ORDER BY created_at DESC').all();
  res.json(rows);
});

// POST /api/projects
router.post('/', authenticateToken, (req: AuthRequest, res: Response) => {
  const user = req.user!;
  const p = req.body as Project;

  if (!p.caniasProjeNo || !p.clientName) {
    return res.status(400).json({ error: 'CANIAS Proje No ve Müşteri Adı zorunludur.' });
  }

  const id = p.id || 'p-' + Date.now();
  const createdAt = p.createdAt || new Date().toISOString();
  const year = p.year || new Date().getFullYear();

  db.prepare(`
    INSERT INTO projects (id, canias_proje_no, client_name, product_group, server_folder_path, year, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(id, p.caniasProjeNo, p.clientName, p.productGroup || '', p.serverFolderPath || '', year, createdAt);

  logAuditServer(user.id, user.name, `Yeni Proje Kaydedildi: ${p.caniasProjeNo}`, 'PROJE', id);

  res.status(201).json({ id, caniasProjeNo: p.caniasProjeNo, clientName: p.clientName, productGroup: p.productGroup, serverFolderPath: p.serverFolderPath, year, createdAt });
});

export default router;
