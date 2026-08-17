import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db, logAuditServer } from '../db/database';
import { authenticateToken, generateToken, AuthRequest } from '../middleware/auth';
import { User } from '../../src/types';

const router = Router();

// POST /api/auth/login
router.post('/login', (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Kullanıcı adı ve şifre zorunludur.' });
  }

  const user = db.prepare('SELECT * FROM users WHERE username = ? OR email = ?').get(username, username) as any;

  if (!user) {
    return res.status(401).json({ error: 'Hatalı kullanıcı adı veya şifre.' });
  }

  if (!user.active) {
    return res.status(403).json({ error: 'Hesabınız pasif durumdadır. Sistem yöneticinizle iletişime geçiniz.' });
  }

  const match = bcrypt.compareSync(password, user.password_hash);
  if (!match) {
    return res.status(401).json({ error: 'Hatalı kullanıcı adı veya şifre.' });
  }

  const authenticatedUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    username: user.username,
    role: user.role,
    title: user.title,
    avatar: user.avatar,
    active: Boolean(user.active)
  };

  const token = generateToken(authenticatedUser);

  logAuditServer(user.id, user.name, 'Sisteme Başarılı Giriş Yapıldı', 'KULLANICI', user.id);

  res.json({
    token,
    user: authenticatedUser
  });
});

// GET /api/auth/me
router.get('/me', authenticateToken, (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Oturum bulunamadı.' });
  }
  const user = db.prepare('SELECT id, name, email, username, title, role, avatar, active FROM users WHERE id = ?').get(req.user.id) as any;
  if (!user) {
    return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });
  }
  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    username: user.username,
    title: user.title,
    role: user.role,
    avatar: user.avatar,
    active: Boolean(user.active)
  });
});

// GET /api/users
router.get('/users', authenticateToken, (req: AuthRequest, res: Response) => {
  const users = db.prepare('SELECT id, name, email, username, title, role, avatar, active FROM users').all() as any[];
  res.json(users.map(u => ({ ...u, active: Boolean(u.active) })));
});

// POST /api/users (Create or Update user - Admin only)
router.post('/users', authenticateToken, (req: AuthRequest, res: Response) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Sadece Admin kullanıcı ekleyebilir veya düzenleyebilir.' });
  }

  const u = req.body as User;
  if (!u.name || !u.email || !u.role) {
    return res.status(400).json({ error: 'Ad, e-posta ve rol alanları zorunludur.' });
  }

  const existing = db.prepare('SELECT * FROM users WHERE id = ?').get(u.id);

  if (existing) {
    // Update user
    let updateQuery = `UPDATE users SET name = ?, email = ?, title = ?, role = ?, active = ?`;
    const params = [u.name, u.email, u.title, u.role, u.active ? 1 : 0];

    if (u.password && u.password.trim().length > 0) {
      updateQuery += `, password_hash = ?`;
      params.push(bcrypt.hashSync(u.password, 10));
    }

    updateQuery += ` WHERE id = ?`;
    params.push(u.id);

    db.prepare(updateQuery).run(...params);
    logAuditServer(req.user.id, req.user.name, `Kullanıcı Düzenlendi: ${u.name}`, 'KULLANICI', u.id);
  } else {
    // Create new user
    const username = u.username || u.email.split('@')[0];
    const passwordHash = bcrypt.hashSync(u.password || '123', 10);
    const userId = u.id || 'u-' + Date.now();

    db.prepare(`
      INSERT INTO users (id, name, email, username, password_hash, title, role, avatar, active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(userId, u.name, u.email, username, passwordHash, u.title || 'Personel', u.role, u.avatar || null, u.active ? 1 : 0);

    logAuditServer(req.user.id, req.user.name, `Yeni Kullanıcı Oluşturuldu: ${u.name}`, 'KULLANICI', userId);
  }

  res.json({ message: 'Kullanıcı kaydedildi.' });
});

export default router;
