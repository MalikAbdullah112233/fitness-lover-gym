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
  Database
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
  onNavigate
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
      case 'fees': return 'Fee & Subscription Management';
      case 'attendance': return 'Daily Attendance & Check-In Portal';
      case 'trainers': return 'Fitness Trainers & Instructors';
      case 'registrations': return 'Online Prospect Applications';
      case 'reports': return 'Financial & Membership Analytics';
      case 'settings': return 'Gym Owner Settings & Branding';
      case 'public_register': return 'Online Member Registration Portal';
      default: return 'Gym Management System';
    }
  };

  return (
    <header style={{
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
      {/* Title & Section */}
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
          {getTitle()}
        </h2>
        <span style={{ fontSize: '12px', color: '#a1a1aa' }}>
          {gymBranding.name} &bull; {gymBranding.address}
        </span>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>

        {/* Real-time Clock Badge */}
        <div style={{
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
            style={{ fontSize: '13px', padding: '8px 12px' }}
            title="Database Backup & Restore"
          >
            <Database size={15} color="#d4af37" />
            <span>Backup</span>
          </button>
        )}

        {/* Interactive Notification Bell with Dropdown */}
        {activeTab !== 'public_register' && (
          <div style={{ position: 'relative' }}>
            <button
              onClick={handleToggleNotifications}
              title={unreadCount > 0 ? `${unreadCount} unread notifications` : 'Gym Notifications'}
              style={{
                width: '38px',
                height: '38px',
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
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
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
            style={{ fontSize: '13px', padding: '8px 14px' }}
          >
            <QrCode size={16} color="#d4af37" />
            <span>Check-In</span>
          </button>
        )}

        {/* Add Member Quick Action */}
        {activeTab !== 'public_register' && (
          <button
            onClick={onOpenAddMember}
            className="btn btn-primary"
            style={{ fontSize: '13px', padding: '8px 16px' }}
          >
            <UserPlus size={16} />
            <span>New Member</span>
          </button>
        )}
      </div>
    </header>
  );
}
