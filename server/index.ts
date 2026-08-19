import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

import { initDatabase } from './db/database';
import authRoutes from './routes/authRoutes';
import mdtRoutes from './routes/mdtRoutes';
import auditRoutes from './routes/auditRoutes';
import projectRoutes from './routes/projectRoutes';
import notificationRoutes from './routes/notificationRoutes';
import permissionRoutes from './routes/permissionRoutes';

dotenv.config();

const PORT = 3000;
const HOST = process.env.HOST || '0.0.0.0';

async function main() {
  // Initialize SQLite database & seed initial records
  initDatabase();

  const app = express();
  app.use(express.json());

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/mdt', mdtRoutes);
  app.use('/api/audit-logs', auditRoutes);
  app.use('/api/projects', projectRoutes);
  app.use('/api/notifications', notificationRoutes);
  app.use('/api/permissions', permissionRoutes);

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      system: 'EKOS MDT Server',
      database: 'EKOS Native JSON Store (Zero-Dependency)',
      timestamp: new Date().toISOString()
    });
  });

  // Vite middleware or static serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(`🚀 EKOS MDT Sunucusu çalışıyor: http://${HOST}:${PORT}`);
  });
}

main().catch((err) => {
  console.error('Fatal server boot error:', err);
  process.exit(1);
});
