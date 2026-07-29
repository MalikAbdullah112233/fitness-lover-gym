import { getItem, setItem } from './storageProvider';
import { GYM_INFO } from '../constants/plansData';

const SETTINGS_KEY = 'flg_gym_settings_v1';

export const settingsService = {
  // Get gym owner profile & branding settings
  async getSettings() {
    const data = await getItem(SETTINGS_KEY);
    if (!data || Object.keys(data).length === 0) {
      const defaultSettings = {
        name: GYM_INFO.name,
        tagline: GYM_INFO.tagline,
        address: GYM_INFO.address,
        phone: GYM_INFO.phone,
        email: GYM_INFO.email,
        gstin: GYM_INFO.gstin,
        currencySymbol: 'Rs',
        receiptTerms: 'Fees once paid are non-refundable and non-transferable. Please present this receipt for any queries.',
        logoEmoji: '🏋️‍♂️',
        themeAccent: '#f97316'
      };
      await setItem(SETTINGS_KEY, defaultSettings);
      return defaultSettings;
    }
    return data;
  },

  // Save gym branding settings
  async updateSettings(newSettings) {
    const current = await this.getSettings();
    const updated = { ...current, ...newSettings };
    await setItem(SETTINGS_KEY, updated);
    return updated;
  }
};
