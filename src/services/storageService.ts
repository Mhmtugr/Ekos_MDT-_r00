import {
  User,
  Project,
  MDTRequest,
  AuditLog,
  NotificationItem,
  PermissionMatrix,
} from '../types';
import { apiService } from './apiService';

// Synchronous legacy wrappers using localStorage cache or fallback
export function getCurrentUser(): User {
  const cached = apiService.getCurrentUser();
  if (cached) return cached;
  return {
    id: 'u1',
    name: 'Mehmet Uğur',
    email: 'mehmet.ugur@ekoselectric.com',
    username: 'mehmet.ugur',
    title: 'Mühendislik Yöneticisi',
    role: 'admin',
    active: true,
  };
}

export function setCurrentUser(user: User) {
  apiService.setCurrentUserLocally(user);
}

export function getUsers(): User[] {
  return [];
}

export function saveUser(user: User) {
  apiService.saveUser(user);
}

export function getProjects(): Project[] {
  return [];
}

export function saveProject(project: Project) {
  apiService.saveProject(project);
}

export function getMDTs(): MDTRequest[] {
  return [];
}

export function saveMDT(mdt: MDTRequest) {
  if (mdt.id && !mdt.id.startsWith('temp-')) {
    apiService.updateMDT(mdt.id, mdt);
  } else {
    apiService.createMDT(mdt);
  }
}

export function generateNextMDTNo(year: number = 2026): string {
  const seq = Math.floor(Math.random() * 899) + 100;
  return `MDT-${year}-${seq}`;
}

export function getAuditLogs(): AuditLog[] {
  return [];
}

export function logAudit(
  user: User,
  action: string,
  recordType: 'MDT' | 'KULLANICI' | 'PROJE' | 'SISTEM',
  recordId: string,
  oldValue?: string,
  newValue?: string
) {
  // Audit logging is handled automatically by the SQLite backend!
}

export function getNotifications(userId: string): NotificationItem[] {
  return [];
}

export function markNotificationRead(id: string) {
  apiService.markNotificationRead(id);
}

export function createNotification(
  targetUserId: string,
  mdtId: string,
  mdtNo: string,
  message: string
) {
  apiService.createNotification(targetUserId, mdtId, mdtNo, message);
}

export function getPermissionMatrix(): PermissionMatrix {
  return {} as any;
}

export function savePermissionMatrix(matrix: PermissionMatrix) {
  apiService.savePermissions(matrix);
}

export function resetAllToDefault() {
  // DB handles initial seeding
}

export function initStorage() {
  // SQLite handles database initialization
}
