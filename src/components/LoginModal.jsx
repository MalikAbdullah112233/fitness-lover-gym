import React, { useState } from 'react';
import { ShieldCheck, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle2, KeyRound } from 'lucide-react';
import { authService } from '../services/authService';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('malik1122');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const userSession = await authService.login(username, password);
      onLoginSuccess(userSession);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoFill = () => {
    setUsername('admin');
    setPassword('malik1122');
    setErrorMsg('');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '440px' }}>
        <div className="modal-header" style={{ background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, transparent 100%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              padding: '8px',
              borderRadius: '10px',
              backgroundColor: 'rgba(212, 175, 55, 0.15)',
              border: '1px solid #d4af37'
            }}>
              <ShieldCheck size={22} color="#d4af37" />
            </div>
            <div>
              <h3 style={{ fontSize: '18px' }}>Admin Authentication</h3>
              <span style={{ fontSize: '12px', color: '#a1a1aa' }}>Fitness Lover Gym Portal</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {errorMsg && (
              <div style={{
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#fb7185',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px'
              }}>
                <AlertCircle size={16} flexShrink={0} />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Username or Email</label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="#71717a" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                  placeholder="e.g. admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#71717a" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  style={{ paddingLeft: '38px', paddingRight: '38px' }}
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '10px',
                    background: 'none',
                    border: 'none',
                    color: '#71717a',
                    cursor: 'pointer'
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Default Credentials Demo Helper */}
            <div style={{
              marginTop: '16px',
              padding: '12px',
              borderRadius: '8px',
              backgroundColor: 'rgba(212, 175, 55, 0.08)',
              border: '1px dashed rgba(212, 175, 55, 0.3)',
              fontSize: '12px',
              color: '#fce085',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <strong>Default Credentials:</strong><br />
                User: <code>admin</code> | Pass: <code>malik1122</code>
              </div>
              <button
                type="button"
                onClick={handleQuickDemoFill}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '11px' }}
              >
                Auto Fill
              </button>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Authenticating...' : 'Sign In as Admin'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
