import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const items = sqliteTable('items', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  syncedAt: integer('synced_at', { mode: 'timestamp' }),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
});

// --- POSTS (Offline-First Feature) ---
export const posts = sqliteTable('posts', {
  id: integer('id').primaryKey(),
  title: text('title').notNull(),
  body: text('body').notNull(),
  userId: integer('user_id').notNull(),
  // 1 = synced with server, 0 = pending local change
  synced: integer('synced').default(1).notNull(),
  // Soft delete for offline delete queue (if not null, it's marked for deletion)
  deletedAt: integer('deleted_at', { mode: 'timestamp' }),
  // Used for conflict resolution (last-write-wins)
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

// --- SYNC QUEUE ---
export const syncQueue = sqliteTable('sync_queue', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  // 'CREATE' | 'UPDATE' | 'DELETE'
  operation: text('operation').notNull(),
  // Reference to the post ID (for updates/deletes)
  postId: integer('post_id'),
  // JSON stringified PostInput payload
  payload: text('payload').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});
