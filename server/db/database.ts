import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import {
  INITIAL_USERS,
  INITIAL_PROJECTS,
  INITIAL_MDTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
  DEFAULT_PERMISSION_MATRIX,
} from '../../src/data/mockData';
import { computeLogHash } from '../utils/hashChain';

const dbPath = process.env.DB_PATH || path.join(process.cwd(), 'data', 'mdt.db');
const dataDir = path.dirname(dbPath);

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

export function initDatabase() {
  const schemaPath = path.join(process.cwd(), 'server', 'db', 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');
  db.exec(schema);

  // Seed Users if empty
  const userCount = (db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number }).count;
  if (userCount === 0) {
    console.log('🌱 Seeding initial users into SQLite...');
    const insertUser = db.prepare(`
      INSERT INTO users (id, name, email, username, password_hash, title, role, avatar, active)
      VALUES (@id, @name, @email, @username, @password_hash, @title, @role, @avatar, @active)
    `);

    for (const u of INITIAL_USERS) {
      const rawPassword = u.password || '123';
      const passwordHash = bcrypt.hashSync(rawPassword, 10);
      insertUser.run({
        id: u.id,
        name: u.name,
        email: u.email,
        username: u.username || u.email.split('@')[0],
        password_hash: passwordHash,
        title: u.title,
        role: u.role,
        avatar: u.avatar || null,
        active: u.active ? 1 : 0,
      });
    }
  }

  // Seed Projects if empty
  const projectCount = (db.prepare('SELECT COUNT(*) as count FROM projects').get() as { count: number }).count;
  if (projectCount === 0) {
    console.log('🌱 Seeding initial projects into SQLite...');
    const insertProject = db.prepare(`
      INSERT INTO projects (id, canias_proje_no, client_name, product_group, server_folder_path, year, created_at)
      VALUES (@id, @canias_proje_no, @client_name, @product_group, @server_folder_path, @year, @created_at)
    `);

    for (const p of INITIAL_PROJECTS) {
      insertProject.run({
        id: p.id,
        canias_proje_no: p.caniasProjeNo,
        client_name: p.clientName,
        product_group: p.productGroup,
        server_folder_path: p.serverFolderPath,
        year: p.year,
        created_at: p.createdAt,
      });
    }
  }

  // Seed MDTs if empty
  const mdtCount = (db.prepare('SELECT COUNT(*) as count FROM mdt_requests').get() as { count: number }).count;
  if (mdtCount === 0) {
    console.log('🌱 Seeding initial MDTs into SQLite...');
    const insertMdt = db.prepare(`
      INSERT INTO mdt_requests (
        id, mdt_no, revision_number, project_id, title, request_type,
        has_mechanical_effect, priority, client_special_request, reason,
        opened_by_id, assigned_to_id, current_status, created_at, target_date,
        closed_at, is_historical, year, parent_mdt_id, version, technical_docs
      ) VALUES (
        @id, @mdt_no, @revision_number, @project_id, @title, @request_type,
        @has_mechanical_effect, @priority, @client_special_request, @reason,
        @opened_by_id, @assigned_to_id, @current_status, @created_at, @target_date,
        @closed_at, @is_historical, @year, @parent_mdt_id, @version, @technical_docs
      )
    `);

    const insertApproval = db.prepare(`
      INSERT INTO approvals (id, mdt_id, type, requester_id, approver_id, approver_name, decision, reason, date)
      VALUES (@id, @mdt_id, @type, @requester_id, @approver_id, @approver_name, @decision, @reason, @date)
    `);

    const insertComment = db.prepare(`
      INSERT INTO comments (id, mdt_id, user_id, user_name, text, created_at)
      VALUES (@id, @mdt_id, @user_id, @user_name, @text, @created_at)
    `);

    const insertFile = db.prepare(`
      INSERT INTO files (id, mdt_id, name, size, uploaded_by_id, uploaded_by_name, created_at)
      VALUES (@id, @mdt_id, @name, @size, @uploaded_by_id, @uploaded_by_name, @created_at)
    `);

    for (const m of INITIAL_MDTS) {
      insertMdt.run({
        id: m.id,
        mdt_no: m.mdtNo,
        revision_number: m.revisionNumber,
        project_id: m.projectId,
        title: m.title,
        request_type: m.requestType,
        has_mechanical_effect: m.hasMechanicalEffect ? 1 : 0,
        priority: m.priority,
        client_special_request: m.clientSpecialRequest,
        reason: m.reason || null,
        opened_by_id: m.openedById,
        assigned_to_id: m.assignedToId || null,
        current_status: m.currentStatus,
        created_at: m.createdAt,
        target_date: m.targetDate,
        closed_at: m.closedAt || null,
        is_historical: m.isHistorical ? 1 : 0,
        year: m.year,
        parent_mdt_id: m.parentMdtId || null,
        version: 1,
        technical_docs: JSON.stringify(m.technicalDocs || {}),
      });

      for (const a of m.approvals || []) {
        insertApproval.run({
          id: a.id,
          mdt_id: m.id,
          type: a.type,
          requester_id: a.requesterId,
          approver_id: a.approverId,
          approver_name: a.approverName,
          decision: a.decision,
          reason: a.reason || null,
          date: a.date,
        });
      }

      for (const c of m.comments || []) {
        insertComment.run({
          id: c.id,
          mdt_id: m.id,
          user_id: c.userId,
          user_name: c.userName,
          text: c.text,
          created_at: c.createdAt,
        });
      }

      for (const f of m.files || []) {
        insertFile.run({
          id: f.id,
          mdt_id: m.id,
          name: f.name,
          size: f.size,
          uploaded_by_id: f.uploadedById,
          uploaded_by_name: f.uploadedByName,
          created_at: f.createdAt,
        });
      }
    }
  }

  // Seed Audit Logs if empty with hash-chaining
  const logCount = (db.prepare('SELECT COUNT(*) as count FROM audit_logs').get() as { count: number }).count;
  if (logCount === 0) {
    console.log('🌱 Seeding initial audit logs into SQLite with cryptographic hash-chaining...');
    let lastHash = 'GENESIS_HASH_00000000000000000000000000000000000000000000000000000000';

    const insertLog = db.prepare(`
      INSERT INTO audit_logs (id, user_id, user_name, action, record_type, record_id, old_value, new_value, timestamp, prev_hash, hash)
      VALUES (@id, @user_id, @user_name, @action, @record_type, @record_id, @old_value, @new_value, @timestamp, @prev_hash, @hash)
    `);

    for (const l of INITIAL_AUDIT_LOGS) {
      const { prevHash, hash } = computeLogHash(
        {
          id: l.id,
          userId: l.userId,
          userName: l.userName,
          action: l.action,
          recordType: l.recordType,
          recordId: l.recordId,
          oldValue: l.oldValue,
          newValue: l.newValue,
          timestamp: l.timestamp,
        },
        lastHash
      );

      insertLog.run({
        id: l.id,
        user_id: l.userId,
        user_name: l.userName,
        action: l.action,
        record_type: l.recordType,
        record_id: l.recordId,
        old_value: l.oldValue || null,
        new_value: l.newValue || null,
        timestamp: l.timestamp,
        prev_hash: prevHash,
        hash: hash,
      });

      lastHash = hash;
    }
  }

  // Seed Notifications if empty
  const notifCount = (db.prepare('SELECT COUNT(*) as count FROM notifications').get() as { count: number }).count;
  if (notifCount === 0) {
    console.log('🌱 Seeding initial notifications into SQLite...');
    const insertNotif = db.prepare(`
      INSERT INTO notifications (id, user_id, mdt_id, mdt_no, message, read, created_at)
      VALUES (@id, @user_id, @mdt_id, @mdt_no, @message, @read, @created_at)
    `);

    for (const n of INITIAL_NOTIFICATIONS) {
      insertNotif.run({
        id: n.id,
        user_id: n.userId,
        mdt_id: n.mdtId,
        mdt_no: n.mdtNo,
        message: n.message,
        read: n.read ? 1 : 0,
        created_at: n.createdAt,
      });
    }
  }

  // Seed Permissions if empty
  const permCount = (db.prepare('SELECT COUNT(*) as count FROM permissions').get() as { count: number }).count;
  if (permCount === 0) {
    console.log('🌱 Seeding initial permissions into SQLite...');
    const insertPerm = db.prepare(`
      INSERT INTO permissions (role, matrix_json) VALUES (?, ?)
    `);

    for (const [role, perms] of Object.entries(DEFAULT_PERMISSION_MATRIX)) {
      insertPerm.run(role, JSON.stringify(perms));
    }
  }
}

// Helper to write audit log securely (INSERT ONLY, tamper-evident)
export function logAuditServer(
  userId: string,
  userName: string,
  action: string,
  recordType: 'MDT' | 'KULLANICI' | 'PROJE' | 'SISTEM',
  recordId: string,
  oldValue?: string,
  newValue?: string
) {
  const lastRow = db.prepare('SELECT hash FROM audit_logs ORDER BY rowid DESC LIMIT 1').get() as { hash: string } | undefined;
  const prevHash = lastRow?.hash || 'GENESIS_HASH_00000000000000000000000000000000000000000000000000000000';

  const id = 'log-' + Date.now() + '-' + Math.floor(Math.random() * 10000);
  const timestamp = new Date().toISOString();

  const { hash } = computeLogHash(
    {
      id,
      userId,
      userName,
      action,
      recordType,
      recordId,
      oldValue,
      newValue,
      timestamp,
    },
    prevHash
  );

  db.prepare(`
    INSERT INTO audit_logs (id, user_id, user_name, action, record_type, record_id, old_value, new_value, timestamp, prev_hash, hash)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, userId, userName, action, recordType, recordId, oldValue || null, newValue || null, timestamp, prevHash, hash);
}
