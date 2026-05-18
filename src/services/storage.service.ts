export const StorageService = {
  get: <T>(key: string, defaultValue: T): T => {
    const saved = localStorage.getItem(key);
    if (!saved) return defaultValue;
    try {
      return JSON.parse(saved);
    } catch {
      return defaultValue;
    }
  },
  set: (key: string, value: any): void => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  remove: (key: string): void => {
    localStorage.removeItem(key);
  },
  clear: (): void => {
    localStorage.clear();
  }
};

export const STORAGE_KEYS = {
  API_CONFIG: 'hanvina_api_config',
  VOCAB_DB: 'hanvina_vocab_db',
  WEAK_WORDS: 'hanvina_weak_words',
  HISTORY: 'hanvina_history'
};
