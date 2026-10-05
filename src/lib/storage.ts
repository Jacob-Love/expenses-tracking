// localStorage that never throws (private mode, blocked storage, quota).

export const store = {
  get(key: string): string | null {
    try { return localStorage.getItem(key); } catch { return null; }
  },
  set(key: string, value: string) {
    try { localStorage.setItem(key, value); } catch { /* not persisted */ }
  },
  remove(key: string) {
    try { localStorage.removeItem(key); } catch { /* ignore */ }
  },
  json<T>(key: string): T | null {
    const raw = this.get(key);
    if (!raw) return null;
    try { return JSON.parse(raw) as T; } catch { return null; }
  },
};

export const KEYS = { entries: 'ledger-entries-v1', cats: 'ledger-cats-v1', sidebar: 'ledger-sidebar', sampleCleared: 'ledger-sample-cleared', period: 'ledger-period', periodCustom: 'ledger-period-custom' };
