import React, { useState } from 'react';
import { Database, Download, Upload, FileSpreadsheet, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';
import { backupService } from '../services/backupService';
import { membersService } from '../services/membersService';
import { feesService } from '../services/feesService';

export default function BackupRestoreModal({ isOpen, onClose, onDataRestored }) {
  const [importing, setImporting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleExportJSON = async () => {
    try {
      await backupService.exportFullDatabaseJSON();
    } catch (err) {
      setErrorMsg('Failed to export backup file: ' + err.message);
    }
  };

  const handleExportMembersCSV = async () => {
    const mems = await membersService.getMembers();
    backupService.exportMembersCSV(mems);
  };

  const handleExportReceiptsCSV = async () => {
    const txs = await feesService.getTransactions();
    backupService.exportTransactionsCSV(txs);
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setErrorMsg('');
    setSuccessMsg('');
    setImporting(true);

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const content = evt.target.result;
        const result = await backupService.importFullDatabaseJSON(content);
        setSuccessMsg(`Database successfully restored from backup file! (Gym: ${result.gymName})`);
        if (onDataRestored) onDataRestored();
      } catch (err) {
        setErrorMsg(err.message);
      } finally {
        setImporting(false);
      }
    };

    reader.onerror = () => {
      setErrorMsg('Error reading file.');
      setImporting(false);
    };

    reader.readAsText(file);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '540px' }}>
        
        {/* Header */}
        <div className="modal-header" style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, transparent 100%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              padding: '8px',
              borderRadius: '10px',
              backgroundColor: 'rgba(59, 130, 246, 0.2)',
              border: '1px solid #3b82f6'
            }}>
              <Database size={22} color="#3b82f6" />
            </div>
            <div>
              <h3 style={{ fontSize: '18px' }}>Database Backup & Export Center</h3>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>Secure data backups, CSV exports & system restore</span>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-secondary btn-sm">✕</button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {errorMsg && (
            <div style={{
              padding: '12px',
              borderRadius: '8px',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertTriangle size={18} flexShrink={0} />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div style={{
              padding: '12px',
              borderRadius: '8px',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#34d399',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <CheckCircle2 size={18} flexShrink={0} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Section 1: Full JSON Backup & Restore */}
          <div style={{
            padding: '16px',
            borderRadius: '12px',
            backgroundColor: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <h4 style={{ fontSize: '15px', color: '#ffffff', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Download size={16} color="#3b82f6" /> Complete System Database Backup (.json)
            </h4>
            <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '14px' }}>
              Download a complete JSON snapshot of all members, fee receipts, attendance logs, and settings.
            </p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button onClick={handleExportJSON} className="btn btn-primary" style={{ flex: 1 }}>
                <Download size={16} /> Download Backup (.json)
              </button>

              <label className="btn btn-secondary" style={{ flex: 1, cursor: 'pointer', textAlign: 'center' }}>
                <Upload size={16} /> Restore Database (.json)
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </div>

          {/* Section 2: CSV Data Export */}
          <div style={{
            padding: '16px',
            borderRadius: '12px',
            backgroundColor: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <h4 style={{ fontSize: '15px', color: '#ffffff', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileSpreadsheet size={16} color="#10b981" /> Export Data to Excel / CSV
            </h4>
            <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '14px' }}>
              Export spreadsheets formatted for Excel, Google Sheets, or accounting software.
            </p>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={handleExportMembersCSV} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                <FileSpreadsheet size={14} color="#10b981" /> Export Members CSV
              </button>
              <button onClick={handleExportReceiptsCSV} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                <FileSpreadsheet size={14} color="#f97316" /> Export Receipts CSV
              </button>
            </div>
          </div>

        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-secondary">
            Close Backup Manager
          </button>
        </div>
      </div>
    </div>
  );
}
