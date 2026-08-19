import {
  User,
  Project,
  MDTRequest,
  AuditLog,
  NotificationItem,
  PermissionMatrix,
  MDTStatus
} from '../types';

const TOKEN_KEY = 'ekos_mdt_jwt_token';
const USER_KEY = 'ekos_mdt_current_user';

function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

function getHeaders(): HeadersInit {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorMsg = `Sunucu hatası (${res.status})`;
    try {
      const data = await res.json();
      if (data.error) errorMsg = data.error;
    } catch (e) {
      // ignore
    }
    throw new Error(errorMsg);
  }
  return res.json() as Promise<T>;
}

export const apiService = {
  // Auth
  async login(username: string, password: string): Promise<{ token: string; user: User }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await handleResponse<{ token: string; user: User }>(res);
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return data;
  },

  getCurrentUser(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },

  setCurrentUserLocally(user: User) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  async fetchMe(): Promise<User> {
    const res = await fetch('/api/auth/me', { headers: getHeaders() });
    const user = await handleResponse<User>(res);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
  },

  async getUsers(): Promise<User[]> {
    const res = await fetch('/api/auth/users', { headers: getHeaders() });
    return handleResponse<User[]>(res);
  },

  async saveUser(user: User): Promise<void> {
    const res = await fetch('/api/auth/users', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(user),
    });
    await handleResponse(res);
  },

  // Projects
  async getProjects(): Promise<Project[]> {
    const res = await fetch('/api/projects', { headers: getHeaders() });
    return handleResponse<Project[]>(res);
  },

  async saveProject(project: Project): Promise<Project> {
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(project),
    });
    return handleResponse<Project>(res);
  },

  // MDTs
  async getMDTs(): Promise<MDTRequest[]> {
    const res = await fetch('/api/mdt', { headers: getHeaders() });
    return handleResponse<MDTRequest[]>(res);
  },

  async createMDT(mdt: Partial<MDTRequest>): Promise<MDTRequest> {
    const res = await fetch('/api/mdt', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(mdt),
    });
    return handleResponse<MDTRequest>(res);
  },

  async updateMDT(id: string, mdt: Partial<MDTRequest> & { version?: number }): Promise<MDTRequest> {
    const res = await fetch(`/api/mdt/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(mdt),
    });
    return handleResponse<MDTRequest>(res);
  },

  async updateMDTStatus(
    id: string,
    targetStatus: MDTStatus,
    options?: { reason?: string; closureNote?: string; rejectionReason?: string; expectedVersion?: number }
  ): Promise<MDTRequest> {
    const res = await fetch(`/api/mdt/${id}/status`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ targetStatus, ...options }),
    });
    return handleResponse<MDTRequest>(res);
  },

  async addApproval(
    mdtId: string,
    type: 'ELEKTRIK' | 'MEKANIK' | 'UST',
    decision: 'ONAY' | 'RED' | 'REVIZYON',
    reason?: string
  ): Promise<MDTRequest> {
    const res = await fetch(`/api/mdt/${mdtId}/approvals`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ type, decision, reason }),
    });
    return handleResponse<MDTRequest>(res);
  },

  async addComment(mdtId: string, text: string): Promise<MDTRequest> {
    const res = await fetch(`/api/mdt/${mdtId}/comments`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ text }),
    });
    return handleResponse<MDTRequest>(res);
  },

  async deleteMDT(id: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`/api/mdt/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse<{ success: boolean; message: string }>(res);
  },

  async cancelMDT(id: string, reason: string): Promise<MDTRequest> {
    const res = await fetch(`/api/mdt/${id}/cancel`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ reason }),
    });
    return handleResponse<MDTRequest>(res);
  },

  async openProjectFolder(folderPath: string): Promise<{ success: boolean; opened: boolean; message: string }> {
    const res = await fetch('/api/projects/open-folder', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ folderPath }),
    });
    return handleResponse<{ success: boolean; opened: boolean; message: string }>(res);
  },

  // Audit Logs
  async getAuditLogs(): Promise<AuditLog[]> {
    const res = await fetch('/api/audit-logs', { headers: getHeaders() });
    return handleResponse<AuditLog[]>(res);
  },

  // Notifications
  async getNotifications(): Promise<NotificationItem[]> {
    const res = await fetch('/api/notifications', { headers: getHeaders() });
    return handleResponse<NotificationItem[]>(res);
  },

  async markNotificationRead(id: string): Promise<void> {
    const res = await fetch(`/api/notifications/read/${id}`, {
      method: 'POST',
      headers: getHeaders(),
    });
    await handleResponse(res);
  },

  async createNotification(targetUserId: string, mdtId: string, mdtNo: string, message: string): Promise<void> {
    const res = await fetch('/api/notifications', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ targetUserId, mdtId, mdtNo, message }),
    });
    await handleResponse(res);
  },

  // Permissions
  async getPermissions(): Promise<PermissionMatrix> {
    const res = await fetch('/api/permissions', { headers: getHeaders() });
    return handleResponse<PermissionMatrix>(res);
  },

  async savePermissions(matrix: PermissionMatrix): Promise<void> {
    const res = await fetch('/api/permissions', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(matrix),
    });
    await handleResponse(res);
  }
};
