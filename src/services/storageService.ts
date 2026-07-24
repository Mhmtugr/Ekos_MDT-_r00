import {
  User,
  Project,
  MDTRequest,
  AuditLog,
  NotificationItem,
  PermissionMatrix,
  MDTStatus,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_PROJECTS,
  INITIAL_MDTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
  DEFAULT_PERMISSION_MATRIX,
} from '../data/mockData';

const KEYS = {
  CURRENT_USER: 'ekos_mdt_current_user',
  USERS: 'ekos_mdt_users',
  PROJECTS: 'ekos_mdt_projects',
  MDTS: 'ekos_mdt_mdts',
  AUDIT_LOGS: 'ekos_mdt_audit_logs',
  NOTIFICATIONS: 'ekos_mdt_notifications',
  PERMISSIONS: 'ekos_mdt_permissions',
};

// Initialize localStorage if empty
export function initStorage() {
  if (!localStorage.getItem(KEYS.USERS)) {
    localStorage.setItem(KEYS.USERS, JSON.stringify(INITIAL_USERS));
  }
  if (!localStorage.getItem(KEYS.PROJECTS)) {
    localStorage.setItem(KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
  }
  if (!localStorage.getItem(KEYS.MDTS)) {
    localStorage.setItem(KEYS.MDTS, JSON.stringify(INITIAL_MDTS));
  }
  if (!localStorage.getItem(KEYS.AUDIT_LOGS)) {
    localStorage.setItem(KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
  }
  if (!localStorage.getItem(KEYS.NOTIFICATIONS)) {
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
  }
  if (!localStorage.getItem(KEYS.PERMISSIONS)) {
    localStorage.setItem(KEYS.PERMISSIONS, JSON.stringify(DEFAULT_PERMISSION_MATRIX));
  }
  if (!localStorage.getItem(KEYS.CURRENT_USER)) {
    // Default logged in user is Mehmet Uğur (Admin)
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(INITIAL_USERS[0]));
  }
}

// User methods
export function getCurrentUser(): User {
  initStorage();
  const raw = localStorage.getItem(KEYS.CURRENT_USER);
  return raw ? JSON.parse(raw) : INITIAL_USERS[0];
}

export function setCurrentUser(user: User) {
  localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
}

export function getUsers(): User[] {
  initStorage();
  return JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
}

export function saveUser(user: User) {
  const users = getUsers();
  const index = users.findIndex((u) => u.id === user.id);
  if (index >= 0) {
    users[index] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
}

// Projects
export function getProjects(): Project[] {
  initStorage();
  return JSON.parse(localStorage.getItem(KEYS.PROJECTS) || '[]');
}

export function saveProject(project: Project) {
  const projects = getProjects();
  const idx = projects.findIndex((p) => p.id === project.id);
  if (idx >= 0) {
    projects[idx] = project;
  } else {
    projects.push(project);
  }
  localStorage.setItem(KEYS.PROJECTS, JSON.stringify(projects));
}

// MDTs
export function getMDTs(): MDTRequest[] {
  initStorage();
  return JSON.parse(localStorage.getItem(KEYS.MDTS) || '[]');
}

export function saveMDT(mdt: MDTRequest) {
  const mdts = getMDTs();
  const idx = mdts.findIndex((m) => m.id === mdt.id);
  if (idx >= 0) {
    mdts[idx] = mdt;
  } else {
    mdts.unshift(mdt);
  }
  localStorage.setItem(KEYS.MDTS, JSON.stringify(mdts));
}

export function generateNextMDTNo(year: number = 2026): string {
  const mdts = getMDTs();
  const yearMdts = mdts.filter((m) => m.year === year);
  let maxSeq = 0;
  yearMdts.forEach((m) => {
    const parts = m.mdtNo.split('-');
    if (parts.length === 3) {
      const seq = parseInt(parts[2], 10);
      if (!isNaN(seq) && seq > maxSeq) {
        maxSeq = seq;
      }
    }
  });
  const nextSeq = maxSeq + 1;
  const seqStr = nextSeq < 100 ? (nextSeq < 10 ? `00${nextSeq}` : `0${nextSeq}`) : `${nextSeq}`;
  return `MDT-${year}-${seqStr}`;
}

// Audit logs
export function getAuditLogs(): AuditLog[] {
  initStorage();
  return JSON.parse(localStorage.getItem(KEYS.AUDIT_LOGS) || '[]');
}

export function logAudit(
  user: User,
  action: string,
  recordType: 'MDT' | 'KULLANICI' | 'PROJE' | 'SISTEM',
  recordId: string,
  oldValue?: string,
  newValue?: string
) {
  const logs = getAuditLogs();
  const newLog: AuditLog = {
    id: 'log-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    userId: user.id,
    userName: user.name,
    action,
    recordType,
    recordId,
    oldValue,
    newValue,
    timestamp: new Date().toISOString(),
  };
  logs.unshift(newLog);
  localStorage.setItem(KEYS.AUDIT_LOGS, JSON.stringify(logs));
}

// Notifications
export function getNotifications(userId: string): NotificationItem[] {
  initStorage();
  const all: NotificationItem[] = JSON.parse(
    localStorage.getItem(KEYS.NOTIFICATIONS) || '[]'
  );
  return all.filter((n) => n.userId === userId);
}

export function markNotificationRead(id: string) {
  const all: NotificationItem[] = JSON.parse(
    localStorage.getItem(KEYS.NOTIFICATIONS) || '[]'
  );
  const idx = all.findIndex((n) => n.id === id);
  if (idx >= 0) {
    all[idx].read = true;
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(all));
  }
}

export function createNotification(
  targetUserId: string,
  mdtId: string,
  mdtNo: string,
  message: string
) {
  const all: NotificationItem[] = JSON.parse(
    localStorage.getItem(KEYS.NOTIFICATIONS) || '[]'
  );
  const newNotif: NotificationItem = {
    id: 'notif-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    userId: targetUserId,
    mdtId,
    mdtNo,
    message,
    read: false,
    createdAt: new Date().toISOString(),
  };
  all.unshift(newNotif);
  localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(all));
}

// Permissions
export function getPermissionMatrix(): PermissionMatrix {
  initStorage();
  return JSON.parse(
    localStorage.getItem(KEYS.PERMISSIONS) || JSON.stringify(DEFAULT_PERMISSION_MATRIX)
  );
}

export function savePermissionMatrix(matrix: PermissionMatrix) {
  localStorage.setItem(KEYS.PERMISSIONS, JSON.stringify(matrix));
}

export function resetAllToDefault() {
  localStorage.setItem(KEYS.USERS, JSON.stringify(INITIAL_USERS));
  localStorage.setItem(KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
  localStorage.setItem(KEYS.MDTS, JSON.stringify(INITIAL_MDTS));
  localStorage.setItem(KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
  localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
  localStorage.setItem(KEYS.PERMISSIONS, JSON.stringify(DEFAULT_PERMISSION_MATRIX));
  localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(INITIAL_USERS[0]));
}
