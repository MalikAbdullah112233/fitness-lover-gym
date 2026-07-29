import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  Search,
  CheckCircle2,
  Clock,
  UserCheck,
  LogOut,
  AlertCircle,
  QrCode,
  Sparkles
} from 'lucide-react';
import { attendanceService } from '../services/attendanceService';
import { membersService } from '../services/membersService';

export default function AttendanceView({ initialCheckInOpen = false }) {
  const [todayLogs, setTodayLogs] = useState([]);
  const [stats, setStats] = useState({ totalTodayCount: 0, checkedInCount: 0, turnoutPercentage: 0 });
  const [queryInput, setQueryInput] = useState('');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAttendance();
  }, []);

  const loadAttendance = async () => {
    setLoading(true);
    try {
      const logs = await attendanceService.getTodayAttendance();
      const st = await attendanceService.getAttendanceStats();
      setTodayLogs(logs);
      setStats(st);
    } catch (err) {
      console.error('Error fetching attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckInSubmit = async (e) => {
    e.preventDefault();
    if (!queryInput.trim()) return;

    setMessage(null);
    try {
      const result = await attendanceService.checkInMember(queryInput);
      if (result.action === 'checkin') {
        setMessage({
          type: 'success',
          text: `SUCCESS: ${result.member.name} (${result.member.id}) checked in at ${result.log.checkInTime}!`
        });
      } else {
        setMessage({
          type: 'info',
          text: `CHECK-OUT: ${result.member.name} (${result.member.id}) checked out at ${result.log.checkOutTime}.`
        });
      }
      setQueryInput('');
      loadAttendance();
    } catch (err) {
      setMessage({ type: 'danger', text: err.message });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Attendance Header & Quick Scanner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '800' }}>Attendance Tracking System</h2>
          <span style={{ fontSize: '13px', color: '#94a3b8' }}>
            Date: {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Quick Check-In / Check-Out Counter Bar */}
      <div className="glass-card" style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(17, 24, 39, 0.9) 100%)',
        borderColor: 'rgba(16, 185, 129, 0.3)'
      }}>
        <h3 style={{ fontSize: '18px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <QrCode size={20} color="#10b981" /> Express Member Check-In Portal
        </h3>

        <form onSubmit={handleCheckInSubmit} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 300px', position: 'relative' }}>
            <Search size={18} color="#64748b" style={{ position: 'absolute', left: '14px', top: '13px' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '44px', height: '46px', fontSize: '15px' }}
              placeholder="Enter Member ID (FLG-1001), Phone Number, or Name..."
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              autoFocus
            />
          </div>
          <button type="submit" className="btn btn-success" style={{ height: '46px', padding: '0 24px', fontSize: '15px' }}>
            <CheckCircle2 size={18} /> Process Check-In / Out
          </button>
        </form>

        {message && (
          <div style={{
            marginTop: '16px',
            padding: '12px 16px',
            borderRadius: '8px',
            backgroundColor: message.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : message.type === 'info' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(239, 68, 68, 0.2)',
            border: `1px solid ${message.type === 'success' ? '#10b981' : message.type === 'info' ? '#3b82f6' : '#ef4444'}`,
            color: '#ffffff',
            fontWeight: '600',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            {message.type === 'success' ? <CheckCircle2 size={18} color="#34d399" /> : <AlertCircle size={18} color="#f87171" />}
            <span>{message.text}</span>
          </div>
        )}
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="glass-card">
          <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600' }}>Today's Total Visits</span>
          <h3 style={{ fontSize: '28px', fontWeight: '900', color: '#ffffff', marginTop: '4px' }}>
            {stats.totalTodayCount}
          </h3>
        </div>
        <div className="glass-card">
          <span style={{ fontSize: '12px', color: '#34d399', fontWeight: '600' }}>Currently Inside Gym</span>
          <h3 style={{ fontSize: '28px', fontWeight: '900', color: '#34d399', marginTop: '4px' }}>
            {stats.checkedInCount}
          </h3>
        </div>
        <div className="glass-card">
          <span style={{ fontSize: '12px', color: '#93c5fd', fontWeight: '600' }}>Turnout Percentage</span>
          <h3 style={{ fontSize: '28px', fontWeight: '900', color: '#60a5fa', marginTop: '4px' }}>
            {stats.turnoutPercentage}%
          </h3>
        </div>
      </div>

      {/* Today's Roster Table */}
      <div className="glass-card">
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '18px' }}>Today's Attendance Roster</h3>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>Live log of check-in and check-out timestamps</span>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Membership Plan</th>
                <th>Check-In Time</th>
                <th>Check-Out Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {todayLogs.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>
                    No check-in logs recorded for today yet. Use the Express Scanner above to check in members.
                  </td>
                </tr>
              ) : (
                todayLogs.map((log) => (
                  <tr key={log.id}>
                    <td>
                      <strong style={{ color: '#ffffff' }}>{log.memberName}</strong>
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>ID: {log.memberId}</div>
                    </td>
                    <td>{log.planName}</td>
                    <td>
                      <span style={{ color: '#34d399', fontWeight: '700' }}>{log.checkInTime}</span>
                    </td>
                    <td>
                      <span style={{ color: '#cbd5e1' }}>{log.checkOutTime}</span>
                    </td>
                    <td>
                      <span className={`badge ${log.status === 'Checked-In' ? 'badge-active' : 'badge-info'}`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
