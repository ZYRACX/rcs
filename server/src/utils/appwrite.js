import crypto from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY } = process.env;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("SUPABASE_URL and SUPABASE_ANON_KEY are required");
}

export const ID = { unique: () => crypto.randomUUID() };

export const Query = {
  equal: (field, value) => ({ type: "eq", field, value }),
  contains: (field, value) => ({ type: "contains", field, value }),
  limit: (value) => ({ type: "limit", value }),
};

function normalizeRow(row) {
  if (!row) return row;
  return { ...row, $id: row.id ?? row.$id };
}

function applyQueries(query, queries = []) {
  for (const q of queries) {
    if (!q) continue;
    if (q.type === "eq") query = query.eq(q.field, q.value);
    if (q.type === "contains") query = query.contains(q.field, [q.value]);
    if (q.type === "limit") query = query.limit(q.value);
  }
  return query;
}

class TablesDB {
  constructor(client) { this.client = client; }

  async listRows({ tableId, queries = [] }) {
    let query = this.client.from(tableId).select("*");
    query = applyQueries(query, queries);
    const { data, error } = await query;
    if (error) throw error;
    return { rows: (data || []).map(normalizeRow) };
  }

  async getRow({ tableId, rowId }) {
    const { data, error } = await this.client.from(tableId).select("*").eq("id", rowId).single();
    if (error) throw error;
    return normalizeRow(data);
  }

  async createRow({ tableId, rowId, data }) {
    const payload = { ...data, id: rowId ?? data?.id ?? ID.unique() };
    const { data: created, error } = await this.client.from(tableId).insert(payload).select().single();
    if (error) throw error;
    return normalizeRow(created);
  }

  async updateRow({ tableId, rowId, data }) {
    const { data: updated, error } = await this.client.from(tableId).update(data).eq("id", rowId).select().single();
    if (error) throw error;
    return normalizeRow(updated);
  }

  async deleteRow({ tableId, rowId }) {
    const { error } = await this.client.from(tableId).delete().eq("id", rowId);
    if (error) throw error;
    return { $id: rowId };
  }
}

class Storage {
  constructor(client) { this.client = client; }
  fromBucket(bucketId) { return this.client.storage.from(bucketId); }
  async createFile({ bucketId, fileId, file }) {
    const { error } = await this.fromBucket(bucketId).upload(fileId, file, { upsert: true });
    if (error) throw error;
    return { $id: fileId };
  }
  async getFile({ bucketId, fileId }) {
    const { data, error } = await this.fromBucket(bucketId).list("", { search: fileId });
    if (error) throw error;
    const found = (data || []).find((f) => f.name === fileId);
    if (!found) throw new Error("File not found");
    return found;
  }
  async deleteFile({ bucketId, fileId }) {
    const { error } = await this.fromBucket(bucketId).remove([fileId]);
    if (error) throw error;
  }
}

class Account {
  constructor(client, accessToken) { this.client = client; this.accessToken = accessToken; }

  async create({ email, password, name }) {
    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data, error } = await admin.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: { name } });
    if (error) throw error;
    return { $id: data.user.id, name: data.user.user_metadata?.name || name };
  }

  async createEmailPasswordSession({ email, password }) {
    const { data, error } = await this.client.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return { $id: data.session?.access_token, secret: data.session?.access_token };
  }

  async get() {
    const { data, error } = await this.client.auth.getUser(this.accessToken);
    if (error) throw error;
    return { $id: data.user.id, name: data.user.user_metadata?.name || data.user.email };
  }

  async deleteSession() {
    await this.client.auth.signOut();
  }
}

export function createAppwriteClient(type, session) {
  const key = type === "admin" ? (SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY) : SUPABASE_ANON_KEY;
  const client = createClient(SUPABASE_URL, key, { auth: { persistSession: false, autoRefreshToken: false } });
  return {
    get account() { return new Account(client, session); },
    get tablesDB() { return new TablesDB(client); },
    get storage() { return new Storage(client); },
  };
}
