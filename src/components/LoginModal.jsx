import React, { useState } from 'react';
import { ShieldCheck, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { authService } from '../services/authService';

export default function LoginModal({ isOpen, onClose, onLoginSuccess, isFullScreen = false }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen && !isFullScreen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const userSession = await authService.login(username, password, rememberMe);
      onLoginSuccess(userSession);
      if (onClose && !isFullScreen) onClose();
    } catch (err) {
      setErrorMsg('Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  const formContent = (
    <div className="modal-content" style={{ maxWidth: '420px', width: '100%' }}>
      <div className="modal-header" style={{ background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, transparent 100%)', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            backgroundColor: 'rgba(212, 175, 55, 0.15)',
            border: '1px solid #d4af37',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ShieldCheck size={24} color="#d4af37" />
          </div>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: '800' }}>Admin Login</h3>
            <span style={{ fontSize: '12px', color: '#a1a1aa' }}>Fitness Lover Gym System</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="modal-body" style={{ padding: '24px' }}>
          {errorMsg && (
            <div style={{
              padding: '12px 14px',
              borderRadius: '8px',
              backgroundColor: 'rgba(225, 29, 72, 0.15)',
              border: '1px solid rgba(225, 29, 72, 0.4)',
              color: '#fb7185',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '20px',
              fontWeight: '600'
            }}>
              <AlertCircle size={16} flexShrink={0} />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Username or Email</label>
            <div style={{ position: 'relative' }}>
              <User size={16} color="#71717a" style={{ position: 'absolute', left: '14px', top: '13px' }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '40px' }}
                placeholder="Enter admin username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="#71717a" style={{ position: 'absolute', left: '14px', top: '13px' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                style={{ paddingLeft: '40px', paddingRight: '40px' }}
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '11px',
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

          {/* Remember Me Checkbox */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '12px',
            marginBottom: '8px'
          }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              color: '#d4d4d8',
              cursor: 'pointer',
              userSelect: 'none'
            }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{
                  width: '16px',
                  height: '16px',
                  accentColor: '#d4af37',
                  cursor: 'pointer'
                }}
              />
              <span>Remember Me</span>
            </label>
          </div>
        </div>

        <div className="modal-footer" style={{ padding: '16px 24px', backgroundColor: 'rgba(5, 5, 5, 0.6)' }}>
          {!isFullScreen && (
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: isFullScreen ? '100%' : 'auto', minHeight: '44px' }}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </div>
      </form>
    </div>
  );

  if (isFullScreen) {
    return (
      <div style={{
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: '#050505',
        backgroundImage: 'radial-gradient(circle at 50% 30%, rgba(212, 175, 55, 0.08) 0%, transparent 60%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        position: 'fixed',
        inset: 0,
        zIndex: 9999
      }}>
        {formContent}
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      {formContent}
    </div>
  );
}
