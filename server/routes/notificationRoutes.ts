import { Router, Response } from 'express';
import { db } from '../db/database';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { sendNotificationEmail } from '../utils/emailSender';

const router = Router();

// GET /api/notifications
router.get('/', authenticateToken, (req: AuthRequest, res: Response) => {
  const user = req.user!;
  const rows = db.prepare('SELECT id, user_id as userId, mdt_id as mdtId, mdt_no as mdtNo, message, read, created_at as createdAt FROM notifications WHERE user_id = ? ORDER BY created_at DESC').all(user.id) as any[];
  res.json(rows.map(r => ({ ...r, read: Boolean(r.read) })));
});

// POST /api/notifications/read/:id
router.post('/read/:id', authenticateToken, (req: AuthRequest, res: Response) => {
  db.prepare('UPDATE notifications SET read = 1 WHERE id = ? AND user_id = ?').run(req.params.id, req.user!.id);
  res.json({ success: true });
});

// POST /api/notifications (Create notification)
router.post('/', authenticateToken, (req: AuthRequest, res: Response) => {
  const { targetUserId, mdtId, mdtNo, message } = req.body;
  const notifId = 'notif-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
  const createdAt = new Date().toISOString();

  db.prepare(`
    INSERT INTO notifications (id, user_id, mdt_id, mdt_no, message, read, created_at)
    VALUES (?, ?, ?, ?, ?, 0, ?)
  `).run(notifId, targetUserId, mdtId, mdtNo, message, createdAt);

  // E-posta gönderim işlemi (Asenkron)
  try {
    const targetUser: any = db.prepare('SELECT email FROM users WHERE id = ?').get(targetUserId);
    if (targetUser && targetUser.email) {
      sendNotificationEmail(targetUser.email, mdtNo, message);
    }
  } catch (error) {
    console.error('E-posta adresi alınırken veya gönderilirken hata oluştu:', error);
  }

  res.status(201).json({ success: true });
});

export default router;
