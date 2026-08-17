import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { RoleGroup } from '../../src/types';

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  username: string;
  role: RoleGroup;
  title: string;
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

const JWT_SECRET = process.env.JWT_SECRET || 'ekos_mdt_jwt_secret_key_2026_turquality';

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Yetkilendirme başarısız: Yetki tokenı (Bearer JWT) sunulmadı.' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Geçersiz veya süresi dolmuş JWT token.' });
    }
    req.user = decoded as AuthenticatedUser;
    next();
  });
}

export function generateToken(user: AuthenticatedUser): string {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role,
      title: user.title
    },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
}
