import { useEffect, useRef } from 'react';
import { useNetworkStatus } from './useNetworkStatus';
import { useDb } from '../db/database';
import { posts, syncQueue } from '../db/schema';
import { useAppStore } from '../store/appStore';
import { eq, asc } from 'drizzle-orm';
import { gqlClient } from '../graphql/requestClient';
import { CREATE_POST, UPDATE_POST, DELETE_POST } from '../graphql/queries';
import { CreatePostResponse, UpdatePostResponse, DeletePostResponse } from '../graphql/types';

/**
 * useSync
 * 
 * The queue-drain algorithm step by step:
 * 1. Listen for network changes. When isOnline flips from false to true.
 * 2. Set isSyncing to true in global store.
 * 3. Query all rows from sync_queue ordered by createdAt ASC (oldest first).
 * 4. For each row:
 *    a. Parse the JSON payload.
 *    b. Determine operation ('CREATE', 'UPDATE', 'DELETE') and execute corresponding GraphQL mutation.
 *    c. If successful:
 *       - Delete the row from sync_queue.
 *       - Update the local `posts` table (set synced = 1, or remove if deleted).
 *    d. If failure (network error, etc.): Stop processing queue and leave remaining for next reconnect.
 * 5. After processing queue, optionally trigger a fresh fetch (reconciliation) in usePosts.
 * 6. Set isSyncing to false.
 */
export function useSync() {
  const { isOnline } = useNetworkStatus();
  const db = useDb();
  const { setSyncing, setError, setLastSynced, isSyncing } = useAppStore();
  const wasOnlineRef = useRef(isOnline);

  useEffect(() => {
    const drainQueue = async () => {
      // Get all pending syncs, oldest first
      const pendingSyncs = await db.select().from(syncQueue).orderBy(asc(syncQueue.createdAt));
      
      if (pendingSyncs.length === 0) return;

      setSyncing(true);
      setError(null);

      try {
        for (const record of pendingSyncs) {
          const payload = JSON.parse(record.payload);

          if (record.operation === 'CREATE') {
            const { userId, ...graphqlPayload } = payload;
            const data = await gqlClient.request<CreatePostResponse>(CREATE_POST, { input: graphqlPayload });
            
            // Delete queue record and update local post to synced = 1
            await db.delete(syncQueue).where(eq(syncQueue.id, record.id));
            if (record.postId) {
              await db.update(posts)
                .set({ synced: 1, id: Number(data.createPost.id), updatedAt: new Date() })
                .where(eq(posts.id, record.postId));
            }
          } 
          else if (record.operation === 'UPDATE') {
            const { userId, ...graphqlPayload } = payload;
            await gqlClient.request<UpdatePostResponse>(UPDATE_POST, { 
              id: record.postId?.toString(), 
              input: graphqlPayload 
            });
            
            await db.delete(syncQueue).where(eq(syncQueue.id, record.id));
            if (record.postId) {
              await db.update(posts).set({ synced: 1, updatedAt: new Date() }).where(eq(posts.id, record.postId));
            }
          }
          else if (record.operation === 'DELETE') {
            await gqlClient.request<DeletePostResponse>(DELETE_POST, { id: record.postId?.toString() });
            
            await db.delete(syncQueue).where(eq(syncQueue.id, record.id));
            if (record.postId) {
              await db.delete(posts).where(eq(posts.id, record.postId)); // Hard delete now that server confirmed
            }
          }
        }
        setLastSynced(Date.now());
      } catch (err: any) {
        console.error('Sync drain error:', err);
        setError(err.message || 'Failed to drain sync queue');
        // We break and leave the remaining items in the queue for the next retry
      } finally {
        setSyncing(false);
      }
    };

    // Trigger when we come back online
    if (isOnline && !wasOnlineRef.current && !isSyncing) {
      drainQueue();
    }

    wasOnlineRef.current = isOnline;
  }, [isOnline, db, setSyncing, setError, setLastSynced, isSyncing]);
}
