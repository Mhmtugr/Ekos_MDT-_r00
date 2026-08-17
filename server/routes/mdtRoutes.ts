import { Router, Response } from 'express';
import { db, logAuditServer } from '../db/database';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { validateStateTransition } from '../utils/stateMachine';
import { MDTRequest, MDTStatus } from '../../src/types';

const router = Router();

// Helper to format MDT from SQLite row
function formatMdtRow(row: any) {
  const approvals = db.prepare('SELECT id, type, requester_id as requesterId, approver_id as approverId, approver_name as approverName, decision, reason, date FROM approvals WHERE mdt_id = ?').all(row.id);
  const comments = db.prepare('SELECT id, user_id as userId, user_name as userName, text, created_at as createdAt FROM comments WHERE mdt_id = ? ORDER BY created_at ASC').all(row.id);
  const files = db.prepare('SELECT id, name, size, uploaded_by_id as uploadedById, uploaded_by_name as uploadedByName, created_at as createdAt FROM files WHERE mdt_id = ?').all(row.id);

  let technicalDocs = {};
  if (row.technical_docs) {
    try {
      technicalDocs = JSON.parse(row.technical_docs);
    } catch (e) {
      technicalDocs = {};
    }
  }

  return {
    id: row.id,
    mdtNo: row.mdt_no,
    revisionNumber: row.revision_number,
    projectId: row.project_id,
    title: row.title,
    requestType: row.request_type,
    hasMechanicalEffect: Boolean(row.has_mechanical_effect),
    priority: row.priority,
    clientSpecialRequest: row.client_special_request,
    reason: row.reason,
    openedById: row.opened_by_id,
    assignedToId: row.assigned_to_id,
    currentStatus: row.current_status,
    createdAt: row.created_at,
    targetDate: row.target_date,
    closedAt: row.closed_at,
    isHistorical: Boolean(row.is_historical),
    year: row.year,
    parentMdtId: row.parent_mdt_id,
    version: row.version || 1,
    technicalDocs,
    approvals,
    comments,
    files
  } as MDTRequest & { version: number };
}

// GET /api/mdt
router.get('/', authenticateToken, (req: AuthRequest, res: Response) => {
  const rows = db.prepare('SELECT * FROM mdt_requests ORDER BY created_at DESC').all();
  const mdts = rows.map(formatMdtRow);
  res.json(mdts);
});

// GET /api/mdt/:id
router.get('/:id', authenticateToken, (req: AuthRequest, res: Response) => {
  const row = db.prepare('SELECT * FROM mdt_requests WHERE id = ?').get(req.params.id);
  if (!row) {
    return res.status(404).json({ error: 'MDT bulunamadı.' });
  }
  res.json(formatMdtRow(row));
});

// POST /api/mdt (Create new MDT)
router.post('/', authenticateToken, (req: AuthRequest, res: Response) => {
  const user = req.user!;
  const body = req.body as Partial<MDTRequest>;

  if (!body.projectId || !body.title || !body.requestType) {
    return res.status(400).json({ error: 'Proje, başlık ve talep tipi zorunludur.' });
  }

  const mdtId = body.id || 'mdt-' + Date.now();
  const year = body.year || new Date().getFullYear();

  // Generate MDT No if not provided
  let mdtNo = body.mdtNo;
  if (!mdtNo) {
    const yearMdts = db.prepare('SELECT mdt_no FROM mdt_requests WHERE year = ?').all(year) as { mdt_no: string }[];
    let maxSeq = 0;
    yearMdts.forEach((m) => {
      const parts = m.mdt_no.split('-');
      if (parts.length === 3) {
        const seq = parseInt(parts[2], 10);
        if (!isNaN(seq) && seq > maxSeq) {
          maxSeq = seq;
        }
      }
    });
    const nextSeq = maxSeq + 1;
    const seqStr = nextSeq < 100 ? (nextSeq < 10 ? `00${nextSeq}` : `0${nextSeq}`) : `${nextSeq}`;
    mdtNo = `MDT-${year}-${seqStr}`;
  }

  const revisionNumber = body.revisionNumber || 'Rev.00';
  const currentStatus: MDTStatus = body.currentStatus || 'TASARIMDA';
  const createdAt = body.createdAt || new Date().toISOString();
  const targetDate = body.targetDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  db.prepare(`
    INSERT INTO mdt_requests (
      id, mdt_no, revision_number, project_id, title, request_type,
      has_mechanical_effect, priority, client_special_request, reason,
      opened_by_id, assigned_to_id, current_status, created_at, target_date,
      closed_at, is_historical, year, parent_mdt_id, version, technical_docs
    ) VALUES (
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?
    )
  `).run(
    mdtId,
    mdtNo,
    revisionNumber,
    body.projectId,
    body.title,
    body.requestType,
    body.hasMechanicalEffect ? 1 : 0,
    body.priority || 'ORTA',
    body.clientSpecialRequest || '',
    body.reason || null,
    user.id,
    body.assignedToId || null,
    currentStatus,
    createdAt,
    targetDate,
    body.closedAt || null,
    body.isHistorical ? 1 : 0,
    year,
    body.parentMdtId || null,
    1,
    JSON.stringify(body.technicalDocs || {})
  );

  logAuditServer(
    user.id,
    user.name,
    `Yeni MDT Talebi Oluşturuldu: ${mdtNo}`,
    'MDT',
    mdtId,
    undefined,
    `Status: ${currentStatus}`
  );

  const created = db.prepare('SELECT * FROM mdt_requests WHERE id = ?').get(mdtId);
  res.status(201).json(formatMdtRow(created));
});

// PUT /api/mdt/:id (Update MDT with Optimistic Locking)
router.put('/:id', authenticateToken, (req: AuthRequest, res: Response) => {
  const user = req.user!;
  const mdtId = req.params.id;
  const body = req.body;

  const existing = db.prepare('SELECT * FROM mdt_requests WHERE id = ?').get(mdtId) as any;
  if (!existing) {
    return res.status(404).json({ error: 'MDT bulunamadı.' });
  }

  // Optimistic locking check
  const incomingVersion = body.version;
  if (incomingVersion !== undefined && incomingVersion !== existing.version) {
    return res.status(409).json({
      error: `Çakışma Hatası (Optimistic Locking): MDT başka bir kullanıcı tarafından güncellenmiştir (Sunucu Versiyonu: ${existing.version}, Sizin Versiyonunuz: ${incomingVersion}). Lütfen sayfayı yenileyiniz.`
    });
  }

  const newVersion = existing.version + 1;

  db.prepare(`
    UPDATE mdt_requests SET
      title = ?,
      request_type = ?,
      has_mechanical_effect = ?,
      priority = ?,
      client_special_request = ?,
      reason = ?,
      assigned_to_id = ?,
      target_date = ?,
      technical_docs = ?,
      version = ?
    WHERE id = ? AND version = ?
  `).run(
    body.title || existing.title,
    body.requestType || existing.request_type,
    body.hasMechanicalEffect !== undefined ? (body.hasMechanicalEffect ? 1 : 0) : existing.has_mechanical_effect,
    body.priority || existing.priority,
    body.clientSpecialRequest !== undefined ? body.clientSpecialRequest : existing.client_special_request,
    body.reason !== undefined ? body.reason : existing.reason,
    body.assignedToId !== undefined ? body.assignedToId : existing.assigned_to_id,
    body.targetDate || existing.target_date,
    body.technicalDocs ? JSON.stringify(body.technicalDocs) : existing.technical_docs,
    newVersion,
    mdtId,
    existing.version
  );

  logAuditServer(
    user.id,
    user.name,
    `MDT Talebi Güncellendi: ${existing.mdt_no}`,
    'MDT',
    mdtId,
    `v${existing.version}`,
    `v${newVersion}`
  );

  const updated = db.prepare('SELECT * FROM mdt_requests WHERE id = ?').get(mdtId);
  res.json(formatMdtRow(updated));
});

// POST /api/mdt/:id/status (Server-side State Machine & Transition Validation)
router.post('/:id/status', authenticateToken, (req: AuthRequest, res: Response) => {
  const user = req.user!;
  const mdtId = req.params.id;
  const { targetStatus, reason, closureNote, rejectionReason, expectedVersion } = req.body;

  if (!targetStatus) {
    return res.status(400).json({ error: 'Hedef statü (targetStatus) belirtilmelidir.' });
  }

  const existing = db.prepare('SELECT * FROM mdt_requests WHERE id = ?').get(mdtId) as any;
  if (!existing) {
    return res.status(404).json({ error: 'MDT bulunamadı.' });
  }

  // Optimistic locking
  if (expectedVersion !== undefined && expectedVersion !== existing.version) {
    return res.status(409).json({
      error: `Çakışma Hatası (Optimistic Locking): Versiyon uyuşmazlığı. (Beklenen: ${expectedVersion}, Veritabanı: ${existing.version})`
    });
  }

  // Validate state machine transition & strict DB constraints
  const check = validateStateTransition(existing.current_status, targetStatus, {
    closureNote,
    rejectionReason,
    reason
  });

  if (!check.valid) {
    return res.status(400).json({ error: check.error });
  }

  // Role-based permission checks for specific status transitions
  if (targetStatus === 'MEKANIK_ONAYDA' && !['admin', 'electrical_design', 'project_management'].includes(user.role)) {
    return res.status(403).json({ error: 'Mekanik onay sürecini başlatma yetkiniz yoktur.' });
  }

  if (targetStatus === 'MEHMET_ONAYINDA' && !['admin', 'electrical_design', 'mechanical_approval', 'project_management'].includes(user.role)) {
    return res.status(403).json({ error: 'Mühendislik yönetici onayına sevk etme yetkiniz yoktur.' });
  }

  if (targetStatus === 'UST_ONAYDA' && !['admin', 'electrical_design', 'project_management'].includes(user.role)) {
    return res.status(403).json({ error: 'Üst yönetici onayına sevk etme yetkiniz yoktur.' });
  }

  const newVersion = existing.version + 1;
  const closedAt = (targetStatus === 'KAPATILDI' || targetStatus === 'REDDEDILDI') ? new Date().toISOString() : existing.closed_at;
  const updatedReason = reason || closureNote || rejectionReason || existing.reason;

  db.prepare(`
    UPDATE mdt_requests SET
      current_status = ?,
      reason = ?,
      closed_at = ?,
      version = ?
    WHERE id = ?
  `).run(targetStatus, updatedReason, closedAt, newVersion, mdtId);

  logAuditServer(
    user.id,
    user.name,
    `MDT Statüsü Değiştirildi: ${existing.mdt_no}`,
    'MDT',
    mdtId,
    existing.current_status,
    targetStatus
  );

  const updated = db.prepare('SELECT * FROM mdt_requests WHERE id = ?').get(mdtId);
  res.json(formatMdtRow(updated));
});

// POST /api/mdt/:id/approvals (Add Approval Record)
router.post('/:id/approvals', authenticateToken, (req: AuthRequest, res: Response) => {
  const user = req.user!;
  const mdtId = req.params.id;
  const { type, decision, reason } = req.body;

  if (!type || !decision) {
    return res.status(400).json({ error: 'Onay tipi (type) ve kararı (decision) zorunludur.' });
  }

  // Role verification for approval types
  if (type === 'MEKANIK' && !['admin', 'mechanical_approval'].includes(user.role)) {
    return res.status(403).json({ error: 'Mekanik onay kararı verme yetkiniz yoktur.' });
  }

  if (type === 'UST' && !['admin', 'executive_approval'].includes(user.role)) {
    return res.status(403).json({ error: 'Üst yönetim onay kararı verme yetkiniz yoktur.' });
  }

  const approvalId = 'a-' + Date.now();
  const date = new Date().toISOString();

  db.prepare(`
    INSERT INTO approvals (id, mdt_id, type, requester_id, approver_id, approver_name, decision, reason, date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(approvalId, mdtId, type, user.id, user.id, user.name, decision, reason || null, date);

  logAuditServer(
    user.id,
    user.name,
    `Onay Kaydı Eklendi (${type}): ${decision}`,
    'MDT',
    mdtId,
    undefined,
    `Karar: ${decision}`
  );

  const updated = db.prepare('SELECT * FROM mdt_requests WHERE id = ?').get(mdtId);
  res.json(formatMdtRow(updated));
});

// POST /api/mdt/:id/comments (Add Comment)
router.post('/:id/comments', authenticateToken, (req: AuthRequest, res: Response) => {
  const user = req.user!;
  const mdtId = req.params.id;
  const { text } = req.body;

  if (!text || text.trim().length === 0) {
    return res.status(400).json({ error: 'Yorum metni boş olamaz.' });
  }

  const commentId = 'c-' + Date.now();
  const createdAt = new Date().toISOString();

  db.prepare(`
    INSERT INTO comments (id, mdt_id, user_id, user_name, text, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(commentId, mdtId, user.id, user.name, text, createdAt);

  const updated = db.prepare('SELECT * FROM mdt_requests WHERE id = ?').get(mdtId);
  res.json(formatMdtRow(updated));
});

export default router;
