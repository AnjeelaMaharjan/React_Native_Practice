import { useLazyQuery, useQuery } from '@apollo/client/react';
import { desc } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import * as Network from 'expo-network';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDb } from '../../../db/database';
import { items } from '../../../db/schema';
import { GET_ITEMS } from '../../../graphql/queries';

interface Character {
  id: string;
  name: string;
  species: string;
  created: string;
}

interface CharactersResponse {
  characters: {
    results: Character[];
  };
}

// Minimum interval between auto-syncs (30 seconds)
const SYNC_THROTTLE_MS = 30_000;

export function useSyncItems() {
  const db = useDb();
  const [isSyncing, setIsSyncing] = useState(false);
  const [networkState, setNetworkState] = useState<Network.NetworkState | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);

  // Track previous connection state to detect offline → online transitions
  const wasConnectedRef = useRef<boolean | null>(null);
  // Prevent duplicate auto-syncs
  const lastAutoSyncRef = useRef<number>(0);

  // ─── 1. LOCAL DATA (always the source of truth for the UI) ───
  const liveQueryResult = useLiveQuery(
    db.select().from(items).orderBy(desc(items.updatedAt))
  );
  const localItems = liveQueryResult && typeof liveQueryResult === 'object' && 'data' in liveQueryResult 
    ? (liveQueryResult as any).data 
    : liveQueryResult;

  useEffect(() => {
    console.log("----------------------------------------");
    console.log("[useSyncItems] Live items in local SQLite DB:");
    console.log(JSON.stringify(localItems, null, 2));
    console.log("----------------------------------------");
  }, [localItems]);

  // ─── 2. APOLLO QUERIES (only used for fetching remote data) ───
  const { refetch } = useQuery<CharactersResponse>(GET_ITEMS, {
    variables: { page: 1 },
    skip: true, // Don't auto-fetch; we control when to sync
    fetchPolicy: 'network-only',
  });

  const [fetchMoreItems] = useLazyQuery<CharactersResponse>(GET_ITEMS, {
    fetchPolicy: 'network-only',
  });

  // ─── 3. NETWORK AWARENESS ───
  useEffect(() => {
    let isMounted = true;

    const checkNetwork = async () => {
      const state = await Network.getNetworkStateAsync();
      if (isMounted) {
        setNetworkState(state);
      }
    };

    checkNetwork();

    // Poll for network changes every 3 seconds
    const interval = setInterval(checkNetwork, 3000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // ─── 4. SYNC: Fetch from API → Save to Local DB ───
  const syncItems = useCallback(async (isLoadMore = false) => {
    const currentNetworkState = await Network.getNetworkStateAsync();

    if (!currentNetworkState.isConnected) {
      console.log('[Sync] Offline — showing cached data from local DB.');
      return;
    }

    // Prevent overlapping syncs
    if (isSyncing) return;

    setIsSyncing(true);
    setSyncError(null);

    try {
      const page = isLoadMore ? Math.floor((localItems?.length || 0) / 10) + 1 : 1;

      const { data, error } = isLoadMore
        ? await fetchMoreItems({ variables: { page } })
        : await refetch({ page });

      if (error) {
        console.error('[Sync] GraphQL Error:', error);
        setSyncError(error.message);
      } else if (data?.characters?.results) {
        const now = new Date();
        const itemsToInsert = data.characters.results.map((item: Character) => ({
          id: item.id,
          title: item.name,
          description: item.species,
          updatedAt: new Date(item.created),
          syncedAt: now,
        }));

        // Upsert data to local Drizzle SQLite DB
        for (const item of itemsToInsert) {
          await db.insert(items).values(item).onConflictDoUpdate({
            target: items.id,
            set: {
              title: item.title,
              description: item.description,
              updatedAt: item.updatedAt,
              syncedAt: item.syncedAt,
            }
          });
        }

        setLastSyncTime(now);
        console.log(`[Sync] Saved ${itemsToInsert.length} items to local DB at ${now.toLocaleTimeString()}`);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown sync error';
      console.error('[Sync] Error:', message);
      setSyncError(message);
    } finally {
      setIsSyncing(false);
    }
  }, [db, refetch, fetchMoreItems, localItems, isSyncing]);

  // ─── 5. AUTO-SYNC: Initial fetch on mount when online ───
  useEffect(() => {
    if (networkState?.isConnected && localItems !== undefined) {
      // Only auto-sync once on mount if we haven't synced yet
      if (lastAutoSyncRef.current === 0) {
        lastAutoSyncRef.current = Date.now();
        syncItems(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [networkState?.isConnected, localItems !== undefined]);

  // ─── 6. AUTO-SYNC: When connection is restored (offline → online) ───
  useEffect(() => {
    const isConnected = networkState?.isConnected ?? false;
    const wasConnected = wasConnectedRef.current;

    // Detect offline → online transition
    if (wasConnected === false && isConnected === true) {
      const now = Date.now();
      // Throttle: only auto-sync if enough time has passed
      if (now - lastAutoSyncRef.current > SYNC_THROTTLE_MS) {
        console.log('[Sync] Connection restored — auto-syncing...');
        lastAutoSyncRef.current = now;
        syncItems(false);
      }
    }

    wasConnectedRef.current = isConnected;
  }, [networkState?.isConnected, syncItems]);

  return {
    /** Items from local SQLite DB (always available, even offline) */
    localItems,
    /** Whether a sync operation is currently in progress */
    isSyncing,
    /** Manually trigger a sync (pass true for load-more / pagination) */
    syncItems,
    /** Current network connectivity status */
    isConnected: networkState?.isConnected ?? false,
    /** Timestamp of the last successful sync */
    lastSyncTime,
    /** Error message from the last failed sync, or null */
    syncError,
  };
}
