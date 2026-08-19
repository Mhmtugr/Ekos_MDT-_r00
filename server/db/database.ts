import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import { computeLogHash } from '../utils/hashChain';

interface StoreData {
  users: any[];
  projects: any[];
  mdt_requests: any[];
  approvals: any[];
  comments: any[];
  files: any[];
  audit_logs: any[];
  notifications: any[];
  permissions: Record<string, string>; // role -> matrix_json
}

const dataDir = process.env.DATA_DIR || path.join(process.cwd(), 'data');
const storeFilePath = path.join(dataDir, 'mdt_store.json');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let store: StoreData = {
  users: [],
  projects: [],
  mdt_requests: [],
  approvals: [],
  comments: [],
  files: [],
  audit_logs: [],
  notifications: [],
  permissions: {},
};

function saveStore() {
  try {
    const tempFile = storeFilePath + '.tmp';
    fs.writeFileSync(tempFile, JSON.stringify(store, null, 2), 'utf8');
    fs.renameSync(tempFile, storeFilePath);
  } catch (err) {
    fs.writeFileSync(storeFilePath, JSON.stringify(store, null, 2), 'utf8');
  }
}

function loadStore() {
  if (fs.existsSync(storeFilePath)) {
    try {
      const content = fs.readFileSync(storeFilePath, 'utf8');
      const parsed = JSON.parse(content);
      store = {
        users: parsed.users || [],
        projects: parsed.projects || [],
        mdt_requests: parsed.mdt_requests || [],
        approvals: parsed.approvals || [],
        comments: parsed.comments || [],
        files: parsed.files || [],
        audit_logs: parsed.audit_logs || [],
        notifications: parsed.notifications || [],
        permissions: parsed.permissions || {},
      };
    } catch (e) {
      console.error('Error loading store file, keeping in-memory state:', e);
    }
  }
}

export function initDatabase() {
  loadStore();

  let hasChanges = false;

  // 1. Ensure Root Administrator Exists (Enterprise Provisioning)
  if (!store.users || store.users.length === 0) {
    console.log('🔒 Veritabanı boş. Sistem yöneticisi (Root Admin) yapılandırılıyor...');
    
    // Güvenlik: Kimlik bilgileri ortam değişkenlerinden (ENV) alınır, yoksa standart kurumsal varsayılanlar kullanılır.
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@ekos.com';
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin.123456!';
    const passwordHash = bcrypt.hashSync(adminPassword, 10);
    
    store.users = [
      {
        id: 'sys-root-admin',
        name: 'System Administrator',
        email: adminEmail,
        username: adminUsername,
        password_hash: passwordHash,
        title: 'System Administrator',
        role: 'admin',
        avatar: null,
        active: 1,
      }
    ];
    hasChanges = true;
  }

  // Removed seed logic as it required mockData.ts
  if (hasChanges) {
    saveStore();
  }

  console.log('🚀 EKOS MDT Saf TypeScript/JSON Veri Motoru (Zero-Dependency) Hazır.');
}

export const db = {
  pragma: (_cmd: string) => {},
  exec: (_sql: string) => {},
  prepare: (sql: string) => {
    const cleanSql = sql.trim().replace(/\s+/g, ' ');

    return {
      get: (...args: any[]) => {
        loadStore();
        const params = args.length === 1 && typeof args[0] === 'object' && args[0] !== null && !Array.isArray(args[0])
          ? args[0]
          : args;

        // COUNT queries
        if (cleanSql.includes('SELECT COUNT(*) as count FROM users')) {
          return { count: store.users.length };
        }
        if (cleanSql.includes('SELECT COUNT(*) as count FROM projects')) {
          return { count: store.projects.length };
        }
        if (cleanSql.includes('SELECT COUNT(*) as count FROM mdt_requests')) {
          return { count: store.mdt_requests.length };
        }
        if (cleanSql.includes('SELECT COUNT(*) as count FROM audit_logs')) {
          return { count: store.audit_logs.length };
        }
        if (cleanSql.includes('SELECT COUNT(*) as count FROM notifications')) {
          return { count: store.notifications.length };
        }
        if (cleanSql.includes('SELECT COUNT(*) as count FROM permissions')) {
          return { count: Object.keys(store.permissions).length };
        }

        // USERS queries
        if (cleanSql.includes('FROM users WHERE username = ? OR email = ?')) {
          const username = args[0];
          const email = args[1] !== undefined ? args[1] : username;
          return store.users.find((u) => u.username === username || u.email === email);
        }
        if (cleanSql.includes('FROM users WHERE id = ?')) {
          const id = args[0];
          return store.users.find((u) => u.id === id);
        }

        // MDT_REQUESTS queries
        if (cleanSql.includes('FROM mdt_requests WHERE id = ?')) {
          const id = args[0];
          return store.mdt_requests.find((m) => m.id === id);
        }

        // AUDIT_LOGS query for last hash
        if (cleanSql.includes('SELECT hash FROM audit_logs ORDER BY rowid DESC LIMIT 1')) {
          if (store.audit_logs.length === 0) return undefined;
          return { hash: store.audit_logs[store.audit_logs.length - 1].hash };
        }

        return undefined;
      },

      all: (...args: any[]) => {
        loadStore();

        // USERS queries
        if (cleanSql.includes('FROM users')) {
          return store.users.map((u) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            username: u.username,
            title: u.title,
            role: u.role,
            avatar: u.avatar,
            active: u.active,
          }));
        }

        // PROJECTS queries
        if (cleanSql.includes('FROM projects')) {
          return [...store.projects]
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .map((p) => ({
              id: p.id,
              caniasProjeNo: p.canias_proje_no,
              clientName: p.client_name,
              productGroup: p.product_group,
              serverFolderPath: p.server_folder_path,
              year: p.year,
              createdAt: p.created_at,
            }));
        }

        // MDT_REQUESTS queries
        if (cleanSql.includes('SELECT mdt_no FROM mdt_requests WHERE year = ?')) {
          const year = args[0];
          return store.mdt_requests
            .filter((m) => m.year == year)
            .map((m) => ({ mdt_no: m.mdt_no }));
        }
        if (cleanSql.includes('FROM mdt_requests')) {
          return [...store.mdt_requests].sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        }

        // APPROVALS query
        if (cleanSql.includes('FROM approvals WHERE mdt_id = ?')) {
          const mdtId = args[0];
          return store.approvals
            .filter((a) => a.mdt_id === mdtId)
            .map((a) => ({
              id: a.id,
              type: a.type,
              requesterId: a.requester_id,
              approverId: a.approver_id,
              approverName: a.approver_name,
              decision: a.decision,
              reason: a.reason,
              date: a.date,
            }));
        }

        // COMMENTS query
        if (cleanSql.includes('FROM comments WHERE mdt_id = ?')) {
          const mdtId = args[0];
          return store.comments
            .filter((c) => c.mdt_id === mdtId)
            .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
            .map((c) => ({
              id: c.id,
              userId: c.user_id,
              userName: c.user_name,
              text: c.text,
              createdAt: c.created_at,
            }));
        }

        // FILES query
        if (cleanSql.includes('FROM files WHERE mdt_id = ?')) {
          const mdtId = args[0];
          return store.files
            .filter((f) => f.mdt_id === mdtId)
            .map((f) => ({
              id: f.id,
              name: f.name,
              size: f.size,
              uploadedById: f.uploaded_by_id,
              uploadedByName: f.uploaded_by_name,
              createdAt: f.created_at,
            }));
        }

        // NOTIFICATIONS query
        if (cleanSql.includes('FROM notifications WHERE user_id = ?')) {
          const userId = args[0];
          return store.notifications
            .filter((n) => n.user_id === userId)
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .map((n) => ({
              id: n.id,
              userId: n.user_id,
              mdtId: n.mdt_id,
              mdtNo: n.mdt_no,
              message: n.message,
              read: n.read,
              createdAt: n.created_at,
            }));
        }

        // PERMISSIONS query
        if (cleanSql.includes('FROM permissions')) {
          return Object.entries(store.permissions).map(([role, matrix_json]) => ({
            role,
            matrix_json,
          }));
        }

        // AUDIT_LOGS queries
        if (cleanSql.includes('FROM audit_logs ORDER BY rowid ASC')) {
          return [...store.audit_logs];
        }
        if (cleanSql.includes('FROM audit_logs ORDER BY rowid DESC')) {
          return [...store.audit_logs].reverse().map((l) => ({
            id: l.id,
            userId: l.user_id,
            userName: l.user_name,
            action: l.action,
            recordType: l.record_type,
            recordId: l.record_id,
            oldValue: l.old_value,
            newValue: l.new_value,
            timestamp: l.timestamp,
            prevHash: l.prev_hash,
            hash: l.hash,
          }));
        }

        return [];
      },

      run: (...args: any[]) => {
        loadStore();

        // 1. INSERT/UPDATE USERS
        if (cleanSql.includes('INSERT INTO users')) {
          const p = args.length === 1 && typeof args[0] === 'object' && args[0] !== null ? args[0] : null;
          if (p) {
            store.users.push({
              id: p.id,
              name: p.name,
              email: p.email,
              username: p.username,
              password_hash: p.password_hash,
              title: p.title,
              role: p.role,
              avatar: p.avatar,
              active: p.active,
            });
          } else {
            const [id, name, email, username, password_hash, title, role, avatar, active] = args;
            store.users.push({
              id,
              name,
              email,
              username,
              password_hash,
              title,
              role,
              avatar,
              active,
            });
          }
          saveStore();
          return { changes: 1, lastInsertRowid: Date.now() };
        }

        if (cleanSql.includes('UPDATE users SET')) {
          // Check if updating password too
          if (cleanSql.includes('password_hash = ?')) {
            const [name, email, title, role, active, password_hash, id] = args;
            const idx = store.users.findIndex((u) => u.id === id);
            if (idx !== -1) {
              store.users[idx] = {
                ...store.users[idx],
                name,
                email,
                title,
                role,
                active,
                password_hash,
              };
            }
          } else {
            const [name, email, title, role, active, id] = args;
            const idx = store.users.findIndex((u) => u.id === id);
            if (idx !== -1) {
              store.users[idx] = {
                ...store.users[idx],
                name,
                email,
                title,
                role,
                active,
              };
            }
          }
          saveStore();
          return { changes: 1, lastInsertRowid: Date.now() };
        }

        // 2. INSERT PROJECTS
        if (cleanSql.includes('INSERT INTO projects')) {
          const p = args.length === 1 && typeof args[0] === 'object' && args[0] !== null ? args[0] : null;
          if (p) {
            store.projects.push({
              id: p.id,
              canias_proje_no: p.canias_proje_no,
              client_name: p.client_name,
              product_group: p.product_group,
              server_folder_path: p.server_folder_path,
              year: p.year,
              created_at: p.created_at,
            });
          } else {
            const [id, canias_proje_no, client_name, product_group, server_folder_path, year, created_at] = args;
            store.projects.push({
              id,
              canias_proje_no,
              client_name,
              product_group,
              server_folder_path,
              year,
              created_at,
            });
          }
          saveStore();
          return { changes: 1, lastInsertRowid: Date.now() };
        }

        // 3. INSERT MDT_REQUESTS
        if (cleanSql.includes('INSERT INTO mdt_requests')) {
          const p = args.length === 1 && typeof args[0] === 'object' && args[0] !== null ? args[0] : null;
          if (p) {
            store.mdt_requests.push({ ...p });
          } else {
            const [
              id, mdt_no, revision_number, project_id, title, request_type,
              has_mechanical_effect, priority, client_special_request, reason,
              opened_by_id, assigned_to_id, current_status, created_at, target_date,
              closed_at, is_historical, year, parent_mdt_id, version, technical_docs
            ] = args;
            store.mdt_requests.push({
              id,
              mdt_no,
              revision_number,
              project_id,
              title,
              request_type,
              has_mechanical_effect,
              priority,
              client_special_request,
              reason,
              opened_by_id,
              assigned_to_id,
              current_status,
              created_at,
              target_date,
              closed_at,
              is_historical,
              year,
              parent_mdt_id,
              version,
              technical_docs,
            });
          }
          saveStore();
          return { changes: 1, lastInsertRowid: Date.now() };
        }

        // 4. UPDATE MDT_REQUESTS
        if (cleanSql.includes('UPDATE mdt_requests SET')) {
          if (cleanSql.includes('current_status = ?')) {
            // Status update
            const [current_status, reason, closed_at, version, id] = args;
            const idx = store.mdt_requests.findIndex((m) => m.id === id);
            if (idx !== -1) {
              store.mdt_requests[idx].current_status = current_status;
              store.mdt_requests[idx].reason = reason;
              store.mdt_requests[idx].closed_at = closed_at;
              store.mdt_requests[idx].version = version;
            }
          } else {
            // Full update
            const [
              title, request_type, has_mechanical_effect, priority,
              client_special_request, reason, assigned_to_id, target_date,
              technical_docs, newVersion, id
            ] = args;
            const idx = store.mdt_requests.findIndex((m) => m.id === id);
            if (idx !== -1) {
              store.mdt_requests[idx] = {
                ...store.mdt_requests[idx],
                title,
                request_type,
                has_mechanical_effect,
                priority,
                client_special_request,
                reason,
                assigned_to_id,
                target_date,
                technical_docs,
                version: newVersion,
              };
            }
          }
          saveStore();
          return { changes: 1, lastInsertRowid: Date.now() };
        }

        // 5. INSERT APPROVALS
        if (cleanSql.includes('INSERT INTO approvals')) {
          const p = args.length === 1 && typeof args[0] === 'object' && args[0] !== null ? args[0] : null;
          if (p) {
            store.approvals.push({ ...p });
          } else {
            const [id, mdt_id, type, requester_id, approver_id, approver_name, decision, reason, date] = args;
            store.approvals.push({
              id,
              mdt_id,
              type,
              requester_id,
              approver_id,
              approver_name,
              decision,
              reason,
              date,
            });
          }
          saveStore();
          return { changes: 1, lastInsertRowid: Date.now() };
        }

        // 6. INSERT COMMENTS
        if (cleanSql.includes('INSERT INTO comments')) {
          const p = args.length === 1 && typeof args[0] === 'object' && args[0] !== null ? args[0] : null;
          if (p) {
            store.comments.push({ ...p });
          } else {
            const [id, mdt_id, user_id, user_name, text, created_at] = args;
            store.comments.push({
              id,
              mdt_id,
              user_id,
              user_name,
              text,
              created_at,
            });
          }
          saveStore();
          return { changes: 1, lastInsertRowid: Date.now() };
        }

        // 7. INSERT FILES
        if (cleanSql.includes('INSERT INTO files')) {
          const p = args.length === 1 && typeof args[0] === 'object' && args[0] !== null ? args[0] : null;
          if (p) {
            store.files.push({ ...p });
          } else {
            const [id, mdt_id, name, size, uploaded_by_id, uploaded_by_name, created_at] = args;
            store.files.push({
              id,
              mdt_id,
              name,
              size,
              uploaded_by_id,
              uploaded_by_name,
              created_at,
            });
          }
          saveStore();
          return { changes: 1, lastInsertRowid: Date.now() };
        }

        // 8. INSERT AUDIT_LOGS
        if (cleanSql.includes('INSERT INTO audit_logs')) {
          const p = args.length === 1 && typeof args[0] === 'object' && args[0] !== null ? args[0] : null;
          if (p) {
            store.audit_logs.push({ ...p });
          } else {
            const [id, user_id, user_name, action, record_type, record_id, old_value, new_value, timestamp, prev_hash, hash] = args;
            store.audit_logs.push({
              id,
              user_id,
              user_name,
              action,
              record_type,
              record_id,
              old_value,
              new_value,
              timestamp,
              prev_hash,
              hash,
            });
          }
          saveStore();
          return { changes: 1, lastInsertRowid: Date.now() };
        }

        // 9. NOTIFICATIONS
        if (cleanSql.includes('UPDATE notifications SET read = 1')) {
          const [id, userId] = args;
          const notif = store.notifications.find((n) => n.id === id && n.user_id === userId);
          if (notif) {
            notif.read = 1;
            saveStore();
          }
          return { changes: 1, lastInsertRowid: Date.now() };
        }

        if (cleanSql.includes('INSERT INTO notifications')) {
          const p = args.length === 1 && typeof args[0] === 'object' && args[0] !== null ? args[0] : null;
          if (p) {
            store.notifications.push({ ...p });
          } else {
            const [id, user_id, mdt_id, mdt_no, message, read, created_at] = args;
            store.notifications.push({
              id,
              user_id,
              mdt_id,
              mdt_no,
              message,
              read,
              created_at,
            });
          }
          saveStore();
          return { changes: 1, lastInsertRowid: Date.now() };
        }

        // 10. PERMISSIONS
        if (cleanSql.includes('INSERT INTO permissions')) {
          const [role, matrix_json] = args;
          store.permissions[role] = matrix_json;
          saveStore();
          return { changes: 1, lastInsertRowid: Date.now() };
        }

        return { changes: 0, lastInsertRowid: 0 };
      },
    };
  },
};

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
  loadStore();
  const lastLog = store.audit_logs.length > 0 ? store.audit_logs[store.audit_logs.length - 1] : null;
  const prevHash = lastLog?.hash || 'GENESIS_HASH_00000000000000000000000000000000000000000000000000000000';

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

  store.audit_logs.push({
    id,
    user_id: userId,
    user_name: userName,
    action,
    record_type: recordType,
    record_id: recordId,
    old_value: oldValue || null,
    new_value: newValue || null,
    timestamp,
    prev_hash: prevHash,
    hash,
  });

  saveStore();
}
