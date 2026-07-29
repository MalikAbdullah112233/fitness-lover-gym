import React from 'react';
import {
  Bell,
  AlertTriangle,
  Clock,
  UserPlus,
  UserCheck,
  CalendarCheck,
  CheckCheck,
  Trash2,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function NotificationDropdownPanel({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
  onNavigate
}) {
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getIcon = (type, level) => {
    switch (type) {
      case 'fee_overdue':
        return <AlertTriangle size={16} color="#ef4444" />;
      case 'fee_upcoming':
        return <Clock size={16} color="#f59e0b" />;
      case 'member_new':
        return <UserPlus size={16} color="#d4af37" />;
      case 'online_reg':
        return <UserCheck size={16} color="#10b981" />;
      case 'attendance_summary':
        return <CalendarCheck size={16} color="#38bdf8" />;
      default:
        return <Bell size={16} color="#d4af37" />;
    }
  };

  const getIconBg = (level) => {
    switch (level) {
      case 'danger':
        return 'rgba(239, 68, 68, 0.18)';
      case 'warning':
        return 'rgba(245, 158, 11, 0.18)';
      case 'success':
        return 'rgba(16, 185, 129, 0.18)';
      case 'info':
        return 'rgba(56, 189, 248, 0.18)';
      default:
        return 'rgba(212, 175, 55, 0.18)';
    }
  };

  return (
    <>
      {/* Invisible backdrop overlay to close panel when clicking outside */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 90,
          backgroundColor: 'transparent'
        }}
        onClick={onClose}
      />

      {/* Notification Dropdown Box */}
      <div
        style={{
          position: 'absolute',
          top: '52px',
          right: '0',
          width: '380px',
          maxHeight: '520px',
          backgroundColor: '#0a0a0a',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(212, 175, 55, 0.35)',
          borderRadius: '16px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.95), 0 0 25px rgba(212, 175, 55, 0.15)',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease-out'
        }}
      >
        {/* Dropdown Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid rgba(212, 175, 55, 0.18)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#050505'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#ffffff' }}>Notifications</h3>
            {unreadCount > 0 && (
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: '800',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(212, 175, 55, 0.2)',
                  color: '#fce085',
                  border: '1px solid rgba(212, 175, 55, 0.4)'
                }}
              >
                {unreadCount} new
              </span>
            )}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#d4af37',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 6px',
                  borderRadius: '6px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                title="Mark all notifications as read"
              >
                <CheckCheck size={14} /> Read All
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={onClearAll}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#71717a',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 6px',
                  borderRadius: '6px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#71717a'; }}
                title="Clear all notifications"
              >
                <Trash2 size={13} /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Notification List Container */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '8px' }}>
          {notifications.length === 0 ? (
            <div
              style={{
                padding: '48px 24px',
                textAlign: 'center',
                color: '#a1a1aa'
              }}
            >
              <Sparkles size={36} color="#d4af37" style={{ marginBottom: '12px', opacity: 0.8 }} />
              <div style={{ fontWeight: '800', color: '#ffffff', fontSize: '15px' }}>You're all caught up</div>
              <div style={{ fontSize: '12px', color: '#71717a', marginTop: '4px' }}>
                No active notifications or alerts at this time.
              </div>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onMarkAsRead(item.id);
                  if (item.targetTab) {
                    onNavigate(item.targetTab);
                  }
                  onClose();
                }}
                style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  marginBottom: '6px',
                  backgroundColor: item.isRead ? 'rgba(255, 255, 255, 0.02)' : 'rgba(212, 175, 55, 0.08)',
                  border: item.isRead ? '1px solid rgba(255, 255, 255, 0.04)' : '1px solid rgba(212, 175, 55, 0.25)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.12)';
                  e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = item.isRead ? 'rgba(255, 255, 255, 0.02)' : 'rgba(212, 175, 55, 0.08)';
                  e.currentTarget.style.borderColor = item.isRead ? 'rgba(255, 255, 255, 0.04)' : 'rgba(212, 175, 55, 0.25)';
                }}
              >
                {/* Icon Container */}
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: getIconBg(item.level),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}
                >
                  {getIcon(item.type, item.level)}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <h4
                      style={{
                        fontSize: '13px',
                        fontWeight: item.isRead ? '600' : '800',
                        color: item.isRead ? '#e4e4e7' : '#ffffff',
                        lineHeight: 1.3
                      }}
                    >
                      {item.title}
                    </h4>
                    {!item.isRead && (
                      <span
                        style={{
                          width: '7px',
                          height: '7px',
                          borderRadius: '50%',
                          backgroundColor: '#d4af37',
                          boxShadow: '0 0 8px #d4af37',
                          flexShrink: 0
                        }}
                      />
                    )}
                  </div>

                  <p style={{ fontSize: '12px', color: '#a1a1aa', marginTop: '2px', lineHeight: 1.4 }}>
                    {item.message}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
                    <span style={{ fontSize: '11px', color: '#71717a', fontWeight: '500' }}>
                      {item.date}
                    </span>
                    <span style={{ fontSize: '11px', color: '#d4af37', display: 'flex', alignItems: 'center', gap: '2px' }}>
                      View <ChevronRight size={10} />
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
