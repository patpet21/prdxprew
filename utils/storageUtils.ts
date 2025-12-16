
export const storageUtils = {
  /**
   * Safely saves a value to localStorage.
   * Catches errors (e.g., quota exceeded) to prevent app crashes.
   */
  save: <T>(key: string, data: T): void => {
    try {
      const serialized = JSON.stringify(data);
      localStorage.setItem(key, serialized);
    } catch (error) {
      console.warn(`[Storage] Failed to save key "${key}":`, error);
    }
  },

  /**
   * Safely loads a value from localStorage.
   * Returns the fallback value if the key doesn't exist or JSON parsing fails.
   */
  load: <T>(key: string, fallback: T): T => {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return fallback;
      return JSON.parse(item) as T;
    } catch (error) {
      console.warn(`[Storage] Failed to load key "${key}", using fallback:`, error);
      return fallback;
    }
  },

  /**
   * Removes a key from localStorage.
   */
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn(`[Storage] Failed to remove key "${key}":`, error);
    }
  }
};
