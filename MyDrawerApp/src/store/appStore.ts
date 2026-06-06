import { create } from 'zustand';

interface AppState {
  isSyncing: boolean;
  lastSyncedAt: number | null;
  error: string | null;
  setSyncing: (val: boolean) => void;
  setLastSynced: (ts: number) => void;
  setError: (msg: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isSyncing: false,
  lastSyncedAt: null,
  error: null,
  setSyncing: (val) => set({ isSyncing: val }),
  setLastSynced: (ts) => set({ lastSyncedAt: ts }),
  setError: (msg) => set({ error: msg }),
}));
