-- Schema for Cloudflare D1 (SQLite)

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);

-- Chats table
CREATE TABLE IF NOT EXISTS chats (
  id TEXT PRIMARY KEY,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  owner_id TEXT NOT NULL,
  name TEXT NOT NULL,
  FOREIGN KEY (owner_id) REFERENCES users(id)
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  chat_id TEXT NOT NULL,
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  FOREIGN KEY (chat_id) REFERENCES chats(id)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_chats_owner_id ON chats(owner_id);
CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON messages(chat_id);
