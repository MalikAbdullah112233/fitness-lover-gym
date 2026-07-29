import React, { useState, useEffect } from 'react';
import {
  Building,
  Save,
  ShieldCheck,
  Palette,
  FileText,
  Phone,
  Mail,
  Receipt,
  CheckCircle2,
  Lock,
  KeyRound,
  Sparkles
} from 'lucide-react';
import { settingsService } from '../services/settingsService';
import { authService } from '../services/authService';

export default function SettingsView({ onSettingsSaved }) {
  const [branding, setBranding] = useState({
    name: 'Fitness Lover Gym',
    tagline: 'Transform Your Body, Elevate Your Soul',
    address: 'Plot 45, Fitness Boulevard, MG Road Sector 14',
    phone: '+91 98765 43210',
    email: 'contact@fitnesslovergym.com',
    gstin: '07AAACF1234H1Z5',
    currencySymbol: 'Rs',
    receiptTerms: 'Fees once paid are non-refundable and non-transferable.',
    logoEmoji: '🏋️‍♂️'
  });

  // Password Change State
  const [currPassword, setCurrPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passMessage, setPassMessage] = useState(null);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await settingsService.getSettings();
      setBranding(data);
    } catch (err) {
      console.error('Error loading settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBranding = async (e) => {
    e.preventDefault();
    try {
      const updated = await settingsService.updateSettings(branding);
      setSavedSuccess(true);
      if (onSettingsSaved) onSettingsSaved(updated);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPassMessage(null);
    try {
      await authService.updateAdminPassword(currPassword, newPassword);
      setPassMessage({ type: 'success', text: 'Admin password updated successfully!' });
      setCurrPassword('');
      setNewPassword('');
    } catch (err) {
      setPassMessage({ type: 'danger', text: err.message });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '800' }}>Gym Owner Settings & Branding</h2>
          <span style={{ fontSize: '13px', color: '#94a3b8' }}>Customize gym details, receipt templates, and security settings</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', gap: '24px' }}>
        
        {/* Branding & Info Customizer */}
        <div className="glass-card">
          <h3 style={{ fontSize: '18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building size={20} color="#f97316" /> Gym Business & Receipt Branding
          </h3>

          {savedSuccess && (
            <div style={{
              padding: '12px',
              borderRadius: '8px',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid #10b981',
              color: '#34d399',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px'
            }}>
              <CheckCircle2 size={16} /> Gym profile & branding settings saved!
            </div>
          )}

          <form onSubmit={handleSaveBranding}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Gym Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={branding.name}
                  onChange={(e) => setBranding({ ...branding, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Gym Tagline</label>
                <input
                  type="text"
                  className="form-input"
                  value={branding.tagline}
                  onChange={(e) => setBranding({ ...branding, tagline: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Gym Address</label>
                <input
                  type="text"
                  className="form-input"
                  value={branding.address}
                  onChange={(e) => setBranding({ ...branding, address: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Official Phone / WhatsApp</label>
                <input
                  type="tel"
                  className="form-input"
                  value={branding.phone}
                  onChange={(e) => setBranding({ ...branding, phone: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Official Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={branding.email}
                  onChange={(e) => setBranding({ ...branding, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">GSTIN / Tax Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={branding.gstin}
                  onChange={(e) => setBranding({ ...branding, gstin: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Currency Symbol</label>
                <input
                  type="text"
                  className="form-input"
                  value={branding.currencySymbol}
                  onChange={(e) => setBranding({ ...branding, currencySymbol: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Fee Receipt Terms & Policy</label>
                <textarea
                  rows="3"
                  className="form-textarea"
                  value={branding.receiptTerms}
                  onChange={(e) => setBranding({ ...branding, receiptTerms: e.target.value })}
                ></textarea>
              </div>

            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '16px', width: '100%' }}>
              <Save size={18} /> Save Gym Branding Settings
            </button>
          </form>
        </div>

        {/* Security & Password Manager */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="glass-card">
            <h3 style={{ fontSize: '18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock size={20} color="#3b82f6" /> Change Admin Credentials
            </h3>

            {passMessage && (
              <div style={{
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: passMessage.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                border: `1px solid ${passMessage.type === 'success' ? '#10b981' : '#ef4444'}`,
                color: passMessage.type === 'success' ? '#34d399' : '#f87171',
                fontSize: '13px',
                marginBottom: '16px'
              }}>
                {passMessage.text}
              </div>
            )}

            <form onSubmit={handleChangePassword}>
              <div className="form-group">
                <label className="form-label">Current Password *</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Enter current password"
                  value={currPassword}
                  onChange={(e) => setCurrPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">New Password *</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Enter new strong password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-secondary" style={{ width: '100%', marginTop: '8px' }}>
                <KeyRound size={16} /> Update Password
              </button>
            </form>
          </div>

          {/* Quick Branding Preview */}
          <div className="glass-card" style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)' }}>
            <div style={{ fontSize: '12px', color: '#f97316', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px' }}>
              Receipt Header Preview
            </div>
            <div style={{ fontSize: '18px', fontWeight: '900', color: '#ffffff' }}>{branding.name}</div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>{branding.tagline}</div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px' }}>{branding.address} | Phone: {branding.phone}</div>
          </div>

        </div>

      </div>

    </div>
  );
}
