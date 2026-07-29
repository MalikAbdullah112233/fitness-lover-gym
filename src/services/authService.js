import { STORAGE_KEYS } from './storageProvider';

const DEFAULT_ADMIN = {
  username: 'admin',
  password: 'malik1122',
  name: 'Gym Administrator',
  role: 'Admin',
  email: 'admin@fitnesslovergym.com'
};

export const authService = {
  // Get stored admin credentials or initialize default admin
  getAdminCredentials() {
    try {
      const storedAdminStr = localStorage.getItem('flg_admin_creds');
      if (storedAdminStr) {
        return JSON.parse(storedAdminStr);
      } else {
        localStorage.setItem('flg_admin_creds', JSON.stringify(DEFAULT_ADMIN));
        return DEFAULT_ADMIN;
      }
    } catch (e) {
      return DEFAULT_ADMIN;
    }
  },

  // Save admin credentials permanently to localStorage
  saveAdminCredentials(creds) {
    try {
      localStorage.setItem('flg_admin_creds', JSON.stringify(creds));
    } catch (e) {}
  },

  // Login method returns User object or throws error
  async login(username, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Strictly evaluate only against stored credentials from flg_admin_creds
        const adminCreds = this.getAdminCredentials();

        const inputUser = username.trim().toLowerCase();
        const validUser = adminCreds.username.toLowerCase();
        const validEmail = adminCreds.email.toLowerCase();

        const isMatch = (inputUser === validUser || inputUser === validEmail) && 
                        (password === adminCreds.password);

        if (isMatch) {
          const userSession = {
            id: 'ADM-001',
            username: adminCreds.username,
            name: adminCreds.name,
            role: 'Admin',
            email: adminCreds.email,
            loginTime: new Date().toISOString()
          };
          localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(userSession));
          resolve(userSession);
        } else {
          reject(new Error('Invalid username or password.'));
        }
      }, 300);
    });
  },

  // Get active admin session
  async getCurrentUser() {
    return new Promise((resolve) => {
      const sessionStr = localStorage.getItem(STORAGE_KEYS.AUTH);
      resolve(sessionStr ? JSON.parse(sessionStr) : null);
    });
  },

  // Logout method
  async logout() {
    return new Promise((resolve) => {
      localStorage.removeItem(STORAGE_KEYS.AUTH);
      resolve(true);
    });
  },

  // Update admin credentials permanently
  async updateAdminPassword(currentPassword, newPassword) {
    return new Promise((resolve, reject) => {
      const adminCreds = this.getAdminCredentials();

      if (currentPassword !== adminCreds.password) {
        reject(new Error('Current password is incorrect.'));
        return;
      }

      const updatedCreds = {
        ...adminCreds,
        password: newPassword
      };

      this.saveAdminCredentials(updatedCreds);
      resolve(true);
    });
  }
};
