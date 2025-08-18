/**
 * Lightweight subscriptions store for demo + migration-friendly API.
 * - If process.env.USE_DATABASE is true and a `db` export exists, functions will try to use the DB.
 * - Otherwise uses a JSON file at server/data/subscriptions.json as a simple local store (safe for demo).
 *
 * NOTE:
 * - This module is intentionally small and defensive so it can be used in the current repo without
 *   assuming a specific DB client. For production, replace with your real DB client (knex/prisma/pg).
 */

import fs from 'fs/promises';
import path from 'path';

const JSON_DB_PATH = path.join(__dirname, '..', 'data', 'subscriptions.json');

type SubscriptionRecord = {
  id: number;
  userId: string | number;
  modelId: number;
  price?: number | null;
  currency?: string | null;
  status: 'pending' | 'active' | 'cancelled' | 'past_due' | 'trialing';
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
};

async function ensureJsonStore() {
  try {
    await fs.access(JSON_DB_PATH);
  } catch (e) {
    await fs.writeFile(JSON_DB_PATH, JSON.stringify({ lastId: 0, items: [] }, null, 2), 'utf8');
  }
}

async function readJsonStore(): Promise<{ lastId: number; items: SubscriptionRecord[] }> {
  await ensureJsonStore();
  const raw = await fs.readFile(JSON_DB_PATH, 'utf8');
  return JSON.parse(raw);
}

async function writeJsonStore(store: { lastId: number; items: SubscriptionRecord[] }) {
  await fs.writeFile(JSON_DB_PATH, JSON.stringify(store, null, 2), 'utf8');
}

export async function createSubscriptionLocal(payload: {
  userId: string | number;
  modelId: number;
  price?: number | null;
  currency?: string | null;
  status?: 'pending' | 'active' | 'cancelled' | 'past_due' | 'trialing';
  metadata?: Record<string, any>;
}): Promise<SubscriptionRecord> {
  const store = await readJsonStore();
  const now = new Date().toISOString();
  const newRecord: SubscriptionRecord = {
    id: ++store.lastId,
    userId: payload.userId,
    modelId: payload.modelId,
    price: payload.price || null,
    currency: payload.currency || 'USD',
    status: payload.status || 'active',
    createdAt: now,
    updatedAt: now,
    metadata: payload.metadata || {},
  };
  store.items.push(newRecord);
  await writeJsonStore(store);
  return newRecord;
}

export async function findSubscriptionLocalByUserAndModel(userId: string | number, modelId: number): Promise<SubscriptionRecord | null> {
  const store = await readJsonStore();
  const found = store.items.find(item => 
    String(item.userId) === String(userId) && item.modelId === modelId
  );
  return found || null;
}

export async function listSubscriptionsLocalByUser(userId: string | number): Promise<SubscriptionRecord[]> {
  const store = await readJsonStore();
  return store.items.filter(item => String(item.userId) === String(userId));
}

export async function updateSubscriptionLocal(id: number, updates: Partial<SubscriptionRecord>): Promise<SubscriptionRecord | null> {
  const store = await readJsonStore();
  const index = store.items.findIndex(item => item.id === id);
  if (index === -1) return null;
  
  store.items[index] = {
    ...store.items[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  await writeJsonStore(store);
  return store.items[index];
}

// Main API functions that try DB first, then fall back to local JSON store

export async function createSubscription(payload: {
  userId: string | number;
  modelId: number;
  price?: number | null;
  currency?: string | null;
  status?: 'pending' | 'active' | 'cancelled' | 'past_due' | 'trialing';
  metadata?: Record<string, any>;
}): Promise<SubscriptionRecord> {
  if (process.env.USE_DATABASE === 'true') {
    try {
      const { db } = require('../db');
      const now = new Date().toISOString();
      const record = {
        user_id: String(payload.userId),
        model_id: payload.modelId,
        price: payload.price || null,
        currency: payload.currency || 'USD',
        status: payload.status || 'active',
        created_at: now,
        updated_at: now,
        metadata: JSON.stringify(payload.metadata || {}),
      };
      const [inserted] = await db.insert('subscriptions').values(record).returning('*');
      return {
        id: inserted.id,
        userId: inserted.user_id,
        modelId: inserted.model_id,
        price: inserted.price,
        currency: inserted.currency,
        status: inserted.status,
        createdAt: inserted.created_at,
        updatedAt: inserted.updated_at,
        metadata: JSON.parse(inserted.metadata || '{}'),
      };
    } catch (e) {
      console.warn('DB insert failed, falling back to local store');
      return createSubscriptionLocal(payload);
    }
  } else {
    return createSubscriptionLocal(payload);
  }
}

export async function findSubscriptionByUserAndModel(userId: string | number, modelId: number): Promise<SubscriptionRecord | null> {
  if (process.env.USE_DATABASE === 'true') {
    try {
      const { db } = require('../db');
      const rows = await db.select().from('subscriptions').where({ user_id: String(userId), model_id: modelId }).limit(1);
      const row = rows[0];
      if (!row) return null;
      return {
        id: row.id,
        userId: row.user_id,
        modelId: row.model_id,
        price: row.price,
        currency: row.currency,
        status: row.status,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        metadata: JSON.parse(row.metadata || '{}'),
      };
    } catch (e) {
      console.warn('DB lookup failed, falling back to local store');
      return findSubscriptionLocalByUserAndModel(userId, modelId);
    }
  } else {
    return findSubscriptionLocalByUserAndModel(userId, modelId);
  }
}

export async function listSubscriptionsByUser(userId: string | number): Promise<SubscriptionRecord[]> {
  if (process.env.USE_DATABASE === 'true') {
    try {
      const { db } = require('../db');
      const rows = await db.select().from('subscriptions').where({ user_id: String(userId) });
      return rows.map((row: any) => ({
        id: row.id,
        userId: row.user_id,
        modelId: row.model_id,
        price: row.price,
        currency: row.currency,
        status: row.status,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        metadata: JSON.parse(row.metadata || '{}'),
      }));
    } catch (e) {
      console.warn('DB list failed, falling back to local store');
      return listSubscriptionsLocalByUser(userId);
    }
  } else {
    return listSubscriptionsLocalByUser(userId);
  }
}

export async function updateSubscription(id: number, updates: Partial<SubscriptionRecord>): Promise<SubscriptionRecord | null> {
  if (process.env.USE_DATABASE === 'true') {
    try {
      const { db } = require('../db');
      const now = new Date().toISOString();
      const updateData = {
        ...updates,
        updated_at: now,
        metadata: updates.metadata ? JSON.stringify(updates.metadata) : undefined,
      };
      const [updated] = await db.update('subscriptions').set(updateData).where({ id }).returning('*');
      if (!updated) return null;
      return {
        id: updated.id,
        userId: updated.user_id,
        modelId: updated.model_id,
        price: updated.price,
        currency: updated.currency,
        status: updated.status,
        createdAt: updated.created_at,
        updatedAt: updated.updated_at,
        metadata: JSON.parse(updated.metadata || '{}'),
      };
    } catch (e) {
      console.warn('DB update failed, falling back to local store');
      return updateSubscriptionLocal(id, updates);
    }
  } else {
    return updateSubscriptionLocal(id, updates);
  }
}