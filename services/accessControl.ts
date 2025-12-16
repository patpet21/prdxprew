
export type AccessTier = 'FREE' | 'PRO' | 'ENTERPRISE';

const STORAGE_KEY = 'pdx_access_tier';

export const AccessControl = {
  getTier: (): AccessTier => {
    return (localStorage.getItem(STORAGE_KEY) as AccessTier) || 'FREE';
  },

  isUnlocked: (): boolean => {
    const tier = localStorage.getItem(STORAGE_KEY);
    return tier === 'PRO' || tier === 'ENTERPRISE';
  },

  unlock: (tier: AccessTier) => {
    localStorage.setItem(STORAGE_KEY, tier);
  },

  lock: () => {
    localStorage.removeItem(STORAGE_KEY);
  },

  // Mock validation logic
  validateCode: (email: string, code: string): boolean => {
    return email.toLowerCase() === 'test@gmail.com' && code === 'PRDX26';
  }
};
