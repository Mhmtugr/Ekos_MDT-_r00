import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import { RoleGroup } from '../../src/types';

export function requireRoles(...allowedRoles: RoleGroup[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Kullanıcı kimliği doğrulanmadı.' });
    }

    // Admin role always bypasses individual role limits if permitted
    if (req.user.role === 'admin') {
      return next();
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Erişim Engellendi: '${req.user.role}' rolünün bu işlemi gerçekleştirmek için yetkisi yok. Gereken roller: [${allowedRoles.join(', ')}]`
      });
    }

    next();
  };
}
