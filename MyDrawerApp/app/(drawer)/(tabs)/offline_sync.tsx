import { useSyncItems } from '@/features/offline-example/hooks/useSyncItems';
import React, { useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function GraphQLExample1() {
  const { localItems, isSyncing, syncItems, isConnected, lastSyncTime, syncError } = useSyncItems();
  const [loadingMore, setLoadingMore] = useState(false);

  const handleRefresh = async () => {
    await syncItems(false);
  };

  const handleLoadMore = async () => {
    if (!isConnected || isSyncing || loadingMore) return;
    setLoadingMore(true);
    await syncItems(true);
    setLoadingMore(false);
  };

  const renderItem = ({ item }: { item: any }) => {
    // Determine if data is fresh based on syncedAt (within the last 5 minutes)
    const isFresh = item.syncedAt && (new Date().getTime() - new Date(item.syncedAt).getTime() < 1000 * 60 * 5);

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.title}>{item.title}</Text>
          <View style={[styles.badge, { backgroundColor: isFresh ? '#4CAF50' : '#FFC107' }]}>
            <Text style={styles.badgeText}>{isFresh ? 'Fresh' : 'Cached'}</Text>
          </View>
        </View>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.date}>Updated: {new Date(item.updatedAt).toLocaleString()}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Offline-First Items</Text>
        <View style={[styles.networkStatus, { backgroundColor: isConnected ? '#4CAF50' : '#F44336' }]}>
          <Text style={styles.networkText}>{isConnected ? '● Online' : '● Offline'}</Text>
        </View>
      </View>

      {/* Sync Status Bar */}
      {lastSyncTime && (
        <View style={styles.syncInfo}>
          <Text style={styles.syncInfoText}>
            Last synced: {lastSyncTime.toLocaleTimeString()}
          </Text>
          <Text style={styles.syncInfoCount}>
            {localItems?.length ?? 0} items cached
          </Text>
        </View>
      )}

      {/* Sync Error Banner */}
      {syncError && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>Sync failed: {syncError}</Text>
        </View>
      )}

      {/* Offline Banner */}
      {!isConnected && (
        <View style={styles.warningBanner}>
          <Text style={styles.warningText}> You are offline - showing cached data. Will auto-sync when back online.
          </Text>
        </View>
      )}

      {/* Auto-sync indicator */}
      {isSyncing && !loadingMore && (
        <View style={styles.syncingBanner}>
          <ActivityIndicator size="small" color="#fff" />
          <Text style={styles.syncingText}>  Syncing from server...</Text>
        </View>
      )}

      {/* Item List — always reads from local DB */}
      <FlatList
        data={localItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={isSyncing && !loadingMore} onRefresh={handleRefresh} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => loadingMore
          ? <ActivityIndicator size="small" color="#2196F3" style={{ margin: 16 }} />
          : null
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>
              Empty
            </Text>
            <Text style={styles.emptyText}>
              {isConnected ? 'No items yet. Pull down to sync!' : 'No cached items. Connect to sync.'}
            </Text>
          </View>
        )}
      />

      {/* Manual Sync Button */}
      <TouchableOpacity
        style={[styles.syncButton, (!isConnected || isSyncing) && styles.syncButtonDisabled]}
        onPress={() => syncItems(false)}
        disabled={!isConnected || isSyncing}
      >
        <Text style={styles.syncButtonText}>
          {isSyncing ? 'Syncing...' : isConnected ? '⟳ Force Sync' : 'Offline'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingTop: 48,
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  networkStatus: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  networkText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  syncInfo: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  syncInfoText: { color: '#1565C0', fontSize: 12 },
  syncInfoCount: { color: '#1565C0', fontSize: 12, fontWeight: '600' },
  errorBanner: { backgroundColor: '#FFEBEE', padding: 10, alignItems: 'center' },
  errorText: { color: '#C62828', fontSize: 13, fontWeight: '500' },
  warningBanner: { backgroundColor: '#FFF9C4', padding: 10, alignItems: 'center' },
  warningText: { color: '#F57F17', fontSize: 13, fontWeight: '500' },
  syncingBanner: {
    backgroundColor: '#2196F3',
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  syncingText: { color: '#fff', fontSize: 13, fontWeight: '500' },
  listContainer: { padding: 16, paddingBottom: 100 },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  title: { fontSize: 18, fontWeight: 'bold', flex: 1 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginLeft: 8 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  description: { fontSize: 14, color: '#666', marginBottom: 8 },
  date: { fontSize: 12, color: '#999' },
  emptyContainer: { padding: 48, alignItems: 'center' },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyText: { color: '#666', fontSize: 16, textAlign: 'center' },
  syncButton: {
    backgroundColor: '#2196F3',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
  },
  syncButtonDisabled: { backgroundColor: '#BDBDBD' },
  syncButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
