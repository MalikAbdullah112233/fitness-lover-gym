import { dbAdapter, COLLECTIONS } from './dbAdapter';
import { settingsService } from './settingsService';

export const backupService = {
  // Export full system database to JSON file
  async exportFullDatabaseJSON() {
    const rawData = await dbAdapter.exportAllData();
    const settings = await settingsService.getSettings();

    const backupPayload = {
      app: 'Fitness Lover Gym Management System',
      version: '2.0',
      exportedAt: new Date().toISOString(),
      gymName: settings.name,
      collections: rawData
    };

    const jsonStr = JSON.stringify(backupPayload, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const dateStr = new Date().toISOString().split('T')[0];
    const link = document.createElement('a');
    link.href = url;
    link.download = `FLG_Gym_Backup_${dateStr}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return true;
  },

  // Validate and Restore Database from JSON file string
  async importFullDatabaseJSON(jsonContentStr) {
    let payload;
    try {
      payload = JSON.parse(jsonContentStr);
    } catch (err) {
      throw new Error('Invalid JSON file format. Could not parse database backup file.');
    }

    if (!payload || typeof payload !== 'object') {
      throw new Error('Corrupted backup file structure.');
    }

    if (!payload.collections || typeof payload.collections !== 'object') {
      throw new Error('Backup file missing required collections payload.');
    }

    // Verify key collections exist
    const requiredKeys = [COLLECTIONS.MEMBERS, COLLECTIONS.TRANSACTIONS];
    for (const key of requiredKeys) {
      if (!payload.collections[key] || !Array.isArray(payload.collections[key])) {
        throw new Error(`Backup file is missing valid data for collection: ${key}`);
      }
    }

    // Perform safe restore across all collections
    for (const [collKey, items] of Object.entries(payload.collections)) {
      if (Array.isArray(items)) {
        await dbAdapter.overwriteCollection(collKey, items);
      }
    }

    return {
      success: true,
      gymName: payload.gymName || 'Fitness Lover Gym',
      exportedAt: payload.exportedAt || 'Unknown'
    };
  },

  // Export Members to CSV
  exportMembersCSV(members) {
    if (!members || members.length === 0) {
      alert('No members available to export.');
      return;
    }

    const headers = ['Member ID', 'Name', 'Phone', 'Email', 'Address', 'Joining Date', 'Plan Name', 'Monthly Fee (Rs)', 'Next Due Date', 'Fee Status', 'Trainer Name'];
    const rows = members.map((m) => [
      `"${m.id}"`,
      `"${m.name}"`,
      `"${m.phone}"`,
      `"${m.email || ''}"`,
      `"${(m.address || '').replace(/"/g, '""')}"`,
      `"${m.joiningDate}"`,
      `"${m.planName}"`,
      m.monthlyFee,
      `"${m.dueDate}"`,
      `"${m.feeStatus}"`,
      `"${m.trainerName || 'Unassigned'}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    this.downloadBlob(csvContent, `FLG_Members_Directory_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
  },

  // Export Transactions to CSV
  exportTransactionsCSV(transactions) {
    if (!transactions || transactions.length === 0) {
      alert('No transaction records available to export.');
      return;
    }

    const headers = ['Receipt ID', 'Member ID', 'Member Name', 'Plan Name', 'Amount (Rs)', 'Payment Date', 'Next Due Date', 'Payment Mode', 'Transaction Ref'];
    const rows = transactions.map((tx) => [
      `"${tx.id}"`,
      `"${tx.memberId}"`,
      `"${tx.memberName}"`,
      `"${tx.planName}"`,
      tx.amount,
      `"${tx.paymentDate}"`,
      `"${tx.dueDate}"`,
      `"${tx.mode}"`,
      `"${tx.transactionRef || ''}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    this.downloadBlob(csvContent, `FLG_Fee_Receipts_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
  },

  // Utility blob downloader
  downloadBlob(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};
