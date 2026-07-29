import { getItem, setItem, STORAGE_KEYS } from './storageProvider';

/**
 * Phase 2 Stable Database Adapter (dbAdapter.js)
 * 
 * Provides an abstract storage layer over storageProvider (localStorage).
 * Backend-ready interface for local client execution.
 */

export const COLLECTIONS = {
  MEMBERS: STORAGE_KEYS.MEMBERS,
  TRAINERS: STORAGE_KEYS.TRAINERS,
  TRANSACTIONS: STORAGE_KEYS.TRANSACTIONS,
  ATTENDANCE: STORAGE_KEYS.ATTENDANCE,
  REGISTRATIONS: STORAGE_KEYS.REGISTRATIONS
};

class DBAdapter {
  async query(collectionName, filterFn = null) {
    const items = await getItem(collectionName);
    return filterFn ? items.filter(filterFn) : items;
  }

  async getById(collectionName, id) {
    const items = await this.query(collectionName);
    return items.find((item) => item.id === id) || null;
  }

  async insert(collectionName, newItem) {
    const items = await this.query(collectionName);
    const updated = [newItem, ...items];
    await setItem(collectionName, updated);
    return newItem;
  }

  async update(collectionName, id, updates) {
    const items = await this.query(collectionName);
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) throw new Error(`Item ${id} not found`);

    items[index] = { ...items[index], ...updates };
    await setItem(collectionName, items);
    return items[index];
  }

  async delete(collectionName, id) {
    const items = await this.query(collectionName);
    const filtered = items.filter((item) => item.id !== id);
    await setItem(collectionName, filtered);
    return true;
  }

  async overwriteCollection(collectionName, items) {
    await setItem(collectionName, items);
    return true;
  }

  async exportAllData() {
    const data = {};
    for (const key of Object.values(COLLECTIONS)) {
      data[key] = await this.query(key);
    }
    return data;
  }
}

export const dbAdapter = new DBAdapter();
