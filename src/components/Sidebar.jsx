import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  CalendarCheck,
  Dumbbell,
  UserPlus,
  BarChart3,
  LogOut,
  Sparkles,
  ShieldCheck,
  Globe,
  Settings,
  Database
} from 'lucide-react';
import { settingsService } from '../services/settingsService';

export default function Sidebar({ activeTab, setActiveTab, user, onLogout, onOpenLogin, onOpenBackup }) {
  const [branding, setBranding] = useState({ name: 'FITNESS LOVER', tagline: 'GYM SOFTWARE' });

  useEffect(() => {
    settingsService.getSettings().then((s) => {
      if (s && s.name) setBranding(s);
    });
  }, [activeTab]);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'members', label: 'Members Directory', icon: Users, badge: null },
    { id: 'fees', label: 'Fee Management', icon: CreditCard, badge: 'Alerts' },
    { id: 'attendance', label: 'Attendance Tracking', icon: CalendarCheck, badge: null },
    { id: 'trainers', label: 'Trainer Management', icon: Dumbbell, badge: null },
    { id: 'registrations', label: 'Online Applicants', icon: UserPlus, badge: 'New' },
    { id: 'reports', label: 'Reports & Revenue', icon: BarChart3, badge: null },
    { id: 'settings', label: 'Gym Settings', icon: Settings, badge: null }
  ];

  return (
    <aside style={{
      width: '260px',
      backgroundColor: '#060606',
      borderRight: '1px solid rgba(212, 175, 55, 0.18)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      flexShrink: 0
    }}>
      {/* Brand Header */}
      <div style={{
        padding: '24px 20px',
        borderBottom: '1px solid rgba(212, 175, 55, 0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #fce085 0%, #d4af37 50%, #996515 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 20px rgba(212, 175, 55, 0.4)'
        }}>
          <Dumbbell size={24} color="#050505" />
        </div>
        <div>
          <h1 style={{
            fontSize: '17px',
            fontWeight: '900',
            lineHeight: 1.2,
            background: 'linear-gradient(135deg, #ffffff 0%, #d4af37 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textTransform: 'uppercase'
          }}>
            {branding.name}
          </h1>
          <span style={{
            fontSize: '11px',
            color: '#d4af37',
            fontWeight: '800',
            letterSpacing: '0.18em',
            textTransform: 'uppercase'
          }}>
            LUXURY CLUB
          </span>
        </div>
      </div>

      {/* Main Navigation */}
      <div style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
        <div style={{
          fontSize: '11px',
          fontWeight: '800',
          color: '#d4af37',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          padding: '8px 12px',
          marginBottom: '4px'
        }}>
          Admin Suite
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '11px 14px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: isActive ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
                borderLeft: isActive ? '3px solid #d4af37' : '3px solid transparent',
                color: isActive ? '#fce085' : '#a1a1aa',
                fontWeight: isActive ? '800' : '500',
                fontSize: '14px',
                cursor: 'pointer',
                marginBottom: '4px',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                outline: 'none'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.06)';
                  e.currentTarget.style.color = '#ffffff';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#a1a1aa';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Icon size={18} color={isActive ? '#d4af37' : '#71717a'} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span style={{
                  fontSize: '10px',
                  fontWeight: '800',
                  padding: '2px 6px',
                  borderRadius: '6px',
                  backgroundColor: item.badge === 'New' ? '#10b981' : '#e11d48',
                  color: '#ffffff'
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Database Backup Trigger */}
        <button
          onClick={onOpenBackup}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '11px 14px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: 'transparent',
            color: '#a1a1aa',
            fontWeight: '500',
            fontSize: '14px',
            cursor: 'pointer',
            marginTop: '4px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.08)';
            e.currentTarget.style.color = '#d4af37';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#a1a1aa';
          }}
        >
          <Database size={18} color="#d4af37" />
          <span>Backup & Export</span>
        </button>

        {/* Public Registration Link */}
        <div style={{
          marginTop: '16px',
          paddingTop: '12px',
          borderTop: '1px solid rgba(212, 175, 55, 0.12)'
        }}>
          <button
            onClick={() => setActiveTab('public_register')}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '11px 14px',
              borderRadius: '10px',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              backgroundColor: activeTab === 'public_register' ? 'rgba(212, 175, 55, 0.18)' : 'rgba(212, 175, 55, 0.06)',
              color: activeTab === 'public_register' ? '#fce085' : '#d4af37',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            <Globe size={18} color="#d4af37" />
            <span>Online Registration Form</span>
          </button>
        </div>
      </div>

      {/* Admin User Footer / Authentication */}
      <div style={{
        padding: '16px',
        borderTop: '1px solid rgba(212, 175, 55, 0.15)',
        backgroundColor: '#040404'
      }}>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'rgba(212, 175, 55, 0.15)',
                border: '1px solid #d4af37',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#d4af37',
                fontWeight: '800',
                fontSize: '14px'
              }}>
                A
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#ffffff' }}>
                  {user.name}
                </div>
                <div style={{ fontSize: '11px', color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldCheck size={12} /> Logged In
                </div>
              </div>
            </div>
            <button
              onClick={onLogout}
              title="Logout Admin"
              style={{
                background: 'none',
                border: 'none',
                color: '#71717a',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '6px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#e11d48'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#71717a'; }}
            >
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <div>
            <button
              onClick={onOpenLogin}
              className="btn btn-primary"
              style={{ width: '100%', fontSize: '13px', padding: '8px' }}
            >
              <ShieldCheck size={16} /> Admin Login
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
