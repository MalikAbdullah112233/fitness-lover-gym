import React, { useState, useEffect } from 'react';
import {
  Search,
  Bell,
  UserPlus,
  QrCode,
  Calendar,
  ShieldCheck,
  PhoneCall,
  Clock,
  Database,
  Menu
} from 'lucide-react';
import { settingsService } from '../services/settingsService';
import { notificationService } from '../services/notificationService';
import NotificationDropdownPanel from './NotificationDropdownPanel';

export default function Navbar({
  activeTab,
  onOpenAddMember,
  onOpenCheckIn,
  onOpenBackupModal,
  user,
  lateFeeAlertCount,
  onNavigate,
  onToggleMobileMenu
}) {
  const [gymBranding, setGymBranding] = useState({ name: 'Fitness Lover Gym', address: 'MG Road' });
  const [timeStr, setTimeStr] = useState('');
  
  // Notification system states
  const [notifications, setNotifications] = useState([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  useEffect(() => {
    settingsService.getSettings().then((s) => {
      if (s && s.name) setGymBranding(s);
    });
    loadNotifications();
  }, [activeTab]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    const notifs = await notificationService.getNotifications();
    setNotifications(notifs);
  };

  const handleToggleNotifications = () => {
    setIsNotificationOpen(!isNotificationOpen);
    if (!isNotificationOpen) {
      loadNotifications();
    }
  };

  const handleMarkAsRead = async (id) => {
    await notificationService.markAsRead(id);
    loadNotifications();
  };

  const handleMarkAllAsRead = async () => {
    await notificationService.markAllAsRead(notifications);
    loadNotifications();
  };

  const handleClearAll = async () => {
    await notificationService.clearAll(notifications);
    setNotifications([]);
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Admin Overview Dashboard';
      case 'members': return 'Gym Members Directory';
      case 'fees': return 'Fee Management';
      case 'attendance': return 'Attendance & Check-In';
      case 'trainers': return 'Fitness Trainers';
      case 'registrations': return 'Online Prospect Applications';
      case 'reports': return 'Revenue & Reports Analytics';
      case 'settings': return 'Gym Owner Settings';
      case 'public_register': return 'Online Member Registration';
      default: return 'Gym Management System';
    }
  };

  return (
    <header className="header-navbar" style={{
      height: '72px',
      backgroundColor: 'rgba(8, 8, 8, 0.88)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(212, 175, 55, 0.18)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      position: 'sticky',
      top: 0,
      zIndex: 40
    }}>
      {/* Title & Section with Mobile Hamburger Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Mobile Hamburger Button */}
        <button
          onClick={onToggleMobileMenu}
          className="mobile-menu-toggle"
          title="Toggle Navigation Menu"
        >
          <Menu size={20} />
        </button>

        <div>
          <h2 className="header-title-text" style={{ fontSize: '18px', fontWeight: '800', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {getTitle()}
          </h2>
          <span className="header-subtitle-text" style={{ fontSize: '12px', color: '#a1a1aa' }}>
            {gymBranding.name} &bull; {gymBranding.address}
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>

        {/* Real-time Clock Badge (hidden on narrow mobile screens) */}
        <div className="hide-on-mobile" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          borderRadius: '8px',
          backgroundColor: 'rgba(212, 175, 55, 0.08)',
          border: '1px solid rgba(212, 175, 55, 0.2)',
          fontSize: '13px',
          color: '#fce085'
        }}>
          <Clock size={15} color="#d4af37" />
          <span style={{ fontWeight: '700' }}>{timeStr}</span>
        </div>

        {/* Database Backup Trigger */}
        {activeTab !== 'public_register' && (
          <button
            onClick={onOpenBackupModal}
            className="btn btn-secondary"
            style={{ fontSize: '13px', padding: '6px 10px', minHeight: '36px' }}
            title="Database Backup & Restore"
          >
            <Database size={15} color="#d4af37" />
            <span className="btn-text-mobile">Backup</span>
          </button>
        )}

        {/* Interactive Notification Bell with Dropdown */}
        {activeTab !== 'public_register' && (
          <div style={{ position: 'relative' }}>
            <button
              onClick={handleToggleNotifications}
              title={unreadCount > 0 ? `${unreadCount} unread notifications` : 'Gym Notifications'}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: unreadCount > 0 ? 'rgba(225, 29, 72, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                border: unreadCount > 0 ? '1px solid rgba(225, 29, 72, 0.5)' : '1px solid rgba(212, 175, 55, 0.18)',
                color: unreadCount > 0 ? '#fb7185' : '#d4af37',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                outline: 'none'
              }}
            >
              <Bell size={18} />
            </button>

            {/* Unread Count Badge */}
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: '#e11d48',
                color: '#ffffff',
                fontSize: '10px',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 10px rgba(225, 29, 72, 0.7)',
                pointerEvents: 'none'
              }}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}

            {/* Notification Dropdown Panel */}
            <NotificationDropdownPanel
              isOpen={isNotificationOpen}
              onClose={() => setIsNotificationOpen(false)}
              notifications={notifications}
              onMarkAsRead={handleMarkAsRead}
              onMarkAllAsRead={handleMarkAllAsRead}
              onClearAll={handleClearAll}
              onNavigate={(tab) => {
                if (onNavigate) onNavigate(tab);
                setIsNotificationOpen(false);
              }}
            />
          </div>
        )}

        {/* Quick Check-in Button */}
        {activeTab !== 'public_register' && (
          <button
            onClick={onOpenCheckIn}
            className="btn btn-secondary"
            style={{ fontSize: '13px', padding: '6px 10px', minHeight: '36px' }}
            title="Quick Member Check-In"
          >
            <QrCode size={16} color="#d4af37" />
            <span className="btn-text-mobile">Check-In</span>
          </button>
        )}

        {/* Add Member Quick Action */}
        {activeTab !== 'public_register' && (
          <button
            onClick={onOpenAddMember}
            className="btn btn-primary"
            style={{ fontSize: '13px', padding: '6px 12px', minHeight: '36px' }}
            title="Register New Gym Member"
          >
            <UserPlus size={16} />
            <span className="btn-text-mobile">New Member</span>
          </button>
        )}
      </div>
    </header>
  );
}
