-- SQLite Database Schema for EKOS MDT System

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  title TEXT NOT NULL,
  role TEXT NOT NULL,
  avatar TEXT,
  active INTEGER NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  canias_proje_no TEXT NOT NULL,
  client_name TEXT NOT NULL,
  product_group TEXT NOT NULL,
  server_folder_path TEXT NOT NULL,
  year INTEGER NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS mdt_requests (
  id TEXT PRIMARY KEY,
  mdt_no TEXT UNIQUE NOT NULL,
  revision_number TEXT NOT NULL,
  project_id TEXT NOT NULL,
  title TEXT NOT NULL,
  request_type TEXT NOT NULL,
  has_mechanical_effect INTEGER NOT NULL,
  priority TEXT NOT NULL,
  client_special_request TEXT NOT NULL,
  reason TEXT,
  opened_by_id TEXT NOT NULL,
  assigned_to_id TEXT,
  current_status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  target_date TEXT NOT NULL,
  closed_at TEXT,
  is_historical INTEGER DEFAULT 0,
  year INTEGER NOT NULL,
  parent_mdt_id TEXT,
  version INTEGER NOT NULL DEFAULT 1,
  technical_docs TEXT, -- JSON string
  FOREIGN KEY (project_id) REFERENCES projects(id),
  FOREIGN KEY (opened_by_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS approvals (
  id TEXT PRIMARY KEY,
  mdt_id TEXT NOT NULL,
  type TEXT NOT NULL,
  requester_id TEXT NOT NULL,
  approver_id TEXT NOT NULL,
  approver_name TEXT NOT NULL,
  decision TEXT NOT NULL,
  reason TEXT,
  date TEXT NOT NULL,
  FOREIGN KEY (mdt_id) REFERENCES mdt_requests(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  mdt_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  text TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (mdt_id) REFERENCES mdt_requests(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS files (
  id TEXT PRIMARY KEY,
  mdt_id TEXT NOT NULL,
  name TEXT NOT NULL,
  size TEXT NOT NULL,
  uploaded_by_id TEXT NOT NULL,
  uploaded_by_name TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (mdt_id) REFERENCES mdt_requests(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  action TEXT NOT NULL,
  record_type TEXT NOT NULL,
  record_id TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  timestamp TEXT NOT NULL,
  prev_hash TEXT NOT NULL,
  hash TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  mdt_id TEXT NOT NULL,
  mdt_no TEXT NOT NULL,
  message TEXT NOT NULL,
  read INTEGER DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS permissions (
  role TEXT PRIMARY KEY,
  matrix_json TEXT NOT NULL
);
