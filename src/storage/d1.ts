import type {
  DBChat,
  DBCreateChat,
  DBCreateMessage,
  DBCreateUser,
  DBMessage,
  DBUser,
} from "../models/db";
import type { IDatabaseResource } from "./types";
import { randomUUID } from "node:crypto";

type D1Database = any;

export class UserD1Resource implements IDatabaseResource<DBUser, DBCreateUser> {
  db: D1Database;

  constructor(db: D1Database) {
    this.db = db;
  }

  async create(data: DBCreateUser): Promise<DBUser> {
    const id = randomUUID();
    const now = new Date().toISOString();

    await this.db
      .prepare(
        "INSERT INTO users (id, name, email, password, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
      )
      .bind(id, data.name, data.email, data.password, now, now)
      .run();

    return {
      id,
      name: data.name,
      email: data.email,
      password: data.password,
      createdAt: new Date(now),
      updatedAt: new Date(now),
    };
  }

  async delete(id: string): Promise<DBUser | null> {
    const user = await this.get(id);
    if (!user) return null;

    await this.db.prepare("DELETE FROM users WHERE id = ?").bind(id).run();
    return user;
  }

  async get(id: string): Promise<DBUser | null> {
    const result = await this.db
      .prepare("SELECT * FROM users WHERE id = ?")
      .bind(id)
      .first();

    if (!result) return null;
    return this.mapToDBUser(result);
  }

  async find(data: Partial<DBUser>): Promise<DBUser | null> {
    const conditions: string[] = [];
    const values: any[] = [];

    if (data.id) {
      conditions.push("id = ?");
      values.push(data.id);
    }
    if (data.email) {
      conditions.push("email = ?");
      values.push(data.email);
    }

    if (conditions.length === 0) return null;

    const query = `SELECT * FROM users WHERE ${conditions.join(" AND ")} LIMIT 1`;
    const result = await this.db
      .prepare(query)
      .bind(...values)
      .first();

    if (!result) return null;
    return this.mapToDBUser(result);
  }

  async findAll(data: Partial<DBUser>): Promise<DBUser[]> {
    const conditions: string[] = [];
    const values: any[] = [];

    if (data.id) {
      conditions.push("id = ?");
      values.push(data.id);
    }
    if (data.email) {
      conditions.push("email = ?");
      values.push(data.email);
    }

    const query =
      conditions.length > 0
        ? `SELECT * FROM users WHERE ${conditions.join(" AND ")}`
        : "SELECT * FROM users";

    const result = await this.db
      .prepare(query)
      .bind(...values)
      .all();
    return result.results.map((r: any) => this.mapToDBUser(r));
  }

  async update(id: string, data: Partial<DBUser>): Promise<DBUser | null> {
    const updates: string[] = [];
    const values: any[] = [];

    if (data.name !== undefined) {
      updates.push("name = ?");
      values.push(data.name);
    }
    if (data.email !== undefined) {
      updates.push("email = ?");
      values.push(data.email);
    }
    if (data.password !== undefined) {
      updates.push("password = ?");
      values.push(data.password);
    }

    if (updates.length === 0) return this.get(id);

    updates.push("updated_at = ?");
    values.push(new Date().toISOString());
    values.push(id);

    await this.db
      .prepare(`UPDATE users SET ${updates.join(", ")} WHERE id = ?`)
      .bind(...values)
      .run();

    return this.get(id);
  }

  private mapToDBUser(row: any): DBUser {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      password: row.password,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }
}

export class ChatD1Resource implements IDatabaseResource<DBChat, DBCreateChat> {
  db: D1Database;

  constructor(db: D1Database) {
    this.db = db;
  }

  async create(data: DBCreateChat): Promise<DBChat> {
    const id = randomUUID();
    const now = new Date().toISOString();

    await this.db
      .prepare(
        "INSERT INTO chats (id, name, owner_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
      )
      .bind(id, data.name, data.ownerId, now, now)
      .run();

    return {
      id,
      name: data.name,
      ownerId: data.ownerId,
      createdAt: new Date(now),
      updatedAt: new Date(now),
    };
  }

  async delete(id: string): Promise<DBChat | null> {
    const chat = await this.get(id);
    if (!chat) return null;

    await this.db.prepare("DELETE FROM chats WHERE id = ?").bind(id).run();
    return chat;
  }

  async get(id: string): Promise<DBChat | null> {
    const result = await this.db
      .prepare("SELECT * FROM chats WHERE id = ?")
      .bind(id)
      .first();

    if (!result) return null;
    return this.mapToDBChat(result);
  }

  async find(data: Partial<DBChat>): Promise<DBChat | null> {
    const conditions: string[] = [];
    const values: any[] = [];

    if (data.id) {
      conditions.push("id = ?");
      values.push(data.id);
    }
    if (data.ownerId) {
      conditions.push("owner_id = ?");
      values.push(data.ownerId);
    }

    if (conditions.length === 0) return null;

    const query = `SELECT * FROM chats WHERE ${conditions.join(" AND ")} LIMIT 1`;
    const result = await this.db
      .prepare(query)
      .bind(...values)
      .first();

    if (!result) return null;
    return this.mapToDBChat(result);
  }

  async findAll(data: Partial<DBChat>): Promise<DBChat[]> {
    const conditions: string[] = [];
    const values: any[] = [];

    if (data.id) {
      conditions.push("id = ?");
      values.push(data.id);
    }
    if (data.ownerId) {
      conditions.push("owner_id = ?");
      values.push(data.ownerId);
    }

    const query =
      conditions.length > 0
        ? `SELECT * FROM chats WHERE ${conditions.join(" AND ")}`
        : "SELECT * FROM chats";

    const result = await this.db
      .prepare(query)
      .bind(...values)
      .all();
    return result.results.map((r: any) => this.mapToDBChat(r));
  }

  async update(id: string, data: Partial<DBChat>): Promise<DBChat | null> {
    const updates: string[] = [];
    const values: any[] = [];

    if (data.name !== undefined) {
      updates.push("name = ?");
      values.push(data.name);
    }

    if (updates.length === 0) return this.get(id);

    updates.push("updated_at = ?");
    values.push(new Date().toISOString());
    values.push(id);

    await this.db
      .prepare(`UPDATE chats SET ${updates.join(", ")} WHERE id = ?`)
      .bind(...values)
      .run();

    return this.get(id);
  }

  private mapToDBChat(row: any): DBChat {
    return {
      id: row.id,
      name: row.name,
      ownerId: row.owner_id,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }
}

export class MessageD1Resource implements IDatabaseResource<
  DBMessage,
  DBCreateMessage
> {
  db: D1Database;

  constructor(db: D1Database) {
    this.db = db;
  }

  async create(data: DBCreateMessage): Promise<DBMessage> {
    const id = randomUUID();
    const now = new Date().toISOString();

    await this.db
      .prepare(
        "INSERT INTO messages (id, chat_id, type, message, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
      )
      .bind(id, data.chatId, data.type, data.message, now, now)
      .run();

    return {
      id,
      chatId: data.chatId,
      type: data.type,
      message: data.message,
      createdAt: new Date(now),
      updatedAt: new Date(now),
    };
  }

  async delete(id: string): Promise<DBMessage | null> {
    const message = await this.get(id);
    if (!message) return null;

    await this.db.prepare("DELETE FROM messages WHERE id = ?").bind(id).run();
    return message;
  }

  async get(id: string): Promise<DBMessage | null> {
    const result = await this.db
      .prepare("SELECT * FROM messages WHERE id = ?")
      .bind(id)
      .first();

    if (!result) return null;
    return this.mapToDBMessage(result);
  }

  async find(data: Partial<DBMessage>): Promise<DBMessage | null> {
    const conditions: string[] = [];
    const values: any[] = [];

    if (data.id) {
      conditions.push("id = ?");
      values.push(data.id);
    }
    if (data.chatId) {
      conditions.push("chat_id = ?");
      values.push(data.chatId);
    }

    if (conditions.length === 0) return null;

    const query = `SELECT * FROM messages WHERE ${conditions.join(" AND ")} LIMIT 1`;
    const result = await this.db
      .prepare(query)
      .bind(...values)
      .first();

    if (!result) return null;
    return this.mapToDBMessage(result);
  }

  async findAll(data: Partial<DBMessage>): Promise<DBMessage[]> {
    const conditions: string[] = [];
    const values: any[] = [];

    if (data.id) {
      conditions.push("id = ?");
      values.push(data.id);
    }
    if (data.chatId) {
      conditions.push("chat_id = ?");
      values.push(data.chatId);
    }

    const query =
      conditions.length > 0
        ? `SELECT * FROM messages WHERE ${conditions.join(" AND ")} ORDER BY created_at ASC`
        : "SELECT * FROM messages ORDER BY created_at ASC";

    const result = await this.db
      .prepare(query)
      .bind(...values)
      .all();
    return result.results.map((r: any) => this.mapToDBMessage(r));
  }

  async update(
    id: string,
    data: Partial<DBMessage>,
  ): Promise<DBMessage | null> {
    const updates: string[] = [];
    const values: any[] = [];

    if (data.message !== undefined) {
      updates.push("message = ?");
      values.push(data.message);
    }
    if (data.type !== undefined) {
      updates.push("type = ?");
      values.push(data.type);
    }

    if (updates.length === 0) return this.get(id);

    updates.push("updated_at = ?");
    values.push(new Date().toISOString());
    values.push(id);

    await this.db
      .prepare(`UPDATE messages SET ${updates.join(", ")} WHERE id = ?`)
      .bind(...values)
      .run();

    return this.get(id);
  }

  private mapToDBMessage(row: any): DBMessage {
    return {
      id: row.id,
      chatId: row.chat_id,
      type: row.type,
      message: row.message,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }
}
