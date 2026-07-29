import {
  initialMembers,
  initialTrainers,
  initialFeeTransactions,
  initialAttendanceLogs,
  initialOnlineRegistrations
} from './initialData';

const STORAGE_KEYS = {
  MEMBERS: 'flg_members_v1',
  TRAINERS: 'flg_trainers_v1',
  TRANSACTIONS: 'flg_transactions_v1',
  ATTENDANCE: 'flg_attendance_v1',
  REGISTRATIONS: 'flg_registrations_v1',
  AUTH: 'flg_auth_session_v1'
};

// Initialize localStorage with seed data if empty
export const initializeData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.MEMBERS)) {
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(initialMembers));
  }
  if (!localStorage.getItem(STORAGE_KEYS.TRAINERS)) {
    localStorage.setItem(STORAGE_KEYS.TRAINERS, JSON.stringify(initialTrainers));
  }
  if (!localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(initialFeeTransactions));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ATTENDANCE)) {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(initialAttendanceLogs));
  }
  if (!localStorage.getItem(STORAGE_KEYS.REGISTRATIONS)) {
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(initialOnlineRegistrations));
  }
};

// Generic storage getter with Promise wrapper (Backend API ready)
export const getItem = async (key) => {
  return new Promise((resolve) => {
    initializeData();
    const data = localStorage.getItem(key);
    resolve(data ? JSON.parse(data) : []);
  });
};

// Generic storage setter with Promise wrapper (Backend API ready)
export const setItem = async (key, value) => {
  return new Promise((resolve) => {
    localStorage.setItem(key, JSON.stringify(value));
    resolve(true);
  });
};

export { STORAGE_KEYS };
