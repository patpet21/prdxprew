
import { storageUtils } from '../utils/storageUtils';

// Type definitions for testing environment
declare var describe: (name: string, callback: () => void) => void;
declare var it: (name: string, callback: () => void) => void;
declare var expect: (value: any) => any;
declare var beforeEach: (callback: () => void) => void;

// Mock localStorage for the test environment
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

describe('Data Persistence (storageUtils)', () => {
  
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('should successfully save data to localStorage', () => {
    const key = 'test_save_key';
    const data = { id: 1, name: 'Test Project', active: true };
    
    storageUtils.save(key, data);
    
    const storedItem = window.localStorage.getItem(key);
    expect(storedItem).toBe(JSON.stringify(data));
  });

  it('should successfully load data from localStorage', () => {
    const key = 'test_load_key';
    const data = { id: 2, name: 'Loaded Project' };
    window.localStorage.setItem(key, JSON.stringify(data));

    const loadedData = storageUtils.load(key, {});
    expect(loadedData).toEqual(data);
  });

  it('should return default fallback value if key does not exist', () => {
    const key = 'non_existent_key';
    const fallback = { status: 'default' };
    
    const loadedData = storageUtils.load(key, fallback);
    expect(loadedData).toEqual(fallback);
  });

  it('should return fallback value if JSON parsing fails', () => {
    const key = 'broken_json_key';
    window.localStorage.setItem(key, '{ "broken": "json"'); // Missing closing brace

    const fallback = { recovered: true };
    const loadedData = storageUtils.load(key, fallback);
    
    expect(loadedData).toEqual(fallback);
  });

  it('should successfully remove data from localStorage', () => {
    const key = 'remove_me';
    window.localStorage.setItem(key, 'data');
    
    storageUtils.remove(key);
    
    const storedItem = window.localStorage.getItem(key);
    expect(storedItem).toBe(null);
  });

  it('should handle saving complex nested objects', () => {
    const key = 'complex_obj';
    const data = {
      user: {
        profile: { name: 'Alice', age: 30 },
        settings: { theme: 'dark', notifications: true }
      },
      history: [1, 2, 3]
    };

    storageUtils.save(key, data);
    const loadedData = storageUtils.load(key, {});
    expect(loadedData).toEqual(data);
  });
});
