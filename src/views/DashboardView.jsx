import React, { useState, useEffect } from 'react';
import {
  Users,
  UserCheck,
  AlertTriangle,
  CreditCard,
  TrendingUp,
  Dumbbell,
  Clock,
  Plus,
  CheckCircle2,
  Phone,
  Sparkles,
  Zap,
  MessageSquareShare,
  BarChart3,
  Receipt,
  ArrowUpRight
} from 'lucide-react';
import { membersService } from '../services/membersService';
import { feesService } from '../services/feesService';
import { attendanceService } from '../services/attendanceService';
import { trainersService } from '../services/trainersService';
import { whatsappService } from '../services/whatsappService';
import { settingsService } from '../services/settingsService';
import { MEMBERSHIP_PLANS } from '../constants/plansData';

export default function DashboardView({ onNavigate, onRecordPaymentForMember, onOpenAddMember }) {
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    pendingFeeCount: 0,
    pendingFeeAmount: 0,
    thisMonthRevenue: 0,
    totalTrainers: 0,
    todayAttendance: 0,
    turnoutPercent: 0
  });

  const [lateFeeAlerts, setLateFeeAlerts] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [todayLogs, setTodayLogs] = useState([]);
  const [gymBranding, setGymBranding] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const members = await membersService.getMembers();
      const trainers = await trainersService.getTrainers();
      const alerts = await feesService.getLateFeeAlerts();
      const transactions = await feesService.getTransactions();
      const todayAtt = await attendanceService.getTodayAttendance();
      const attStats = await attendanceService.getAttendanceStats();
      const settings = await settingsService.getSettings();

      const activeCount = members.filter((m) => m.status === 'Active').length;
      const pendingSum = alerts.reduce((acc, curr) => acc + curr.monthlyFee + curr.estimatedLateFee, 0);

      const currentMonthStr = new Date().toISOString().slice(0, 7);
      const monthRev = transactions
        .filter((tx) => tx.paymentDate && tx.paymentDate.startsWith(currentMonthStr))
        .reduce((acc, curr) => acc + (curr.amount || 0), 0);

      setStats({
        totalMembers: members.length,
        activeMembers: activeCount,
        pendingFeeCount: alerts.length,
        pendingFeeAmount: pendingSum,
        thisMonthRevenue: monthRev,
        totalTrainers: trainers.length,
        todayAttendance: attStats.totalTodayCount,
        turnoutPercent: attStats.turnoutPercentage
      });

      setLateFeeAlerts(alerts);
      setRecentTransactions(transactions.slice(0, 5));
      setTodayLogs(todayAtt.slice(0, 5));
      setGymBranding(settings);
    } catch (err) {
      console.error('Error loading dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendWhatsAppReminder = async (alertItem) => {
    const member = await membersService.getMemberById(alertItem.memberId);
    if (member) {
      const msg = whatsappService.generateReminderMessage(member, alertItem, gymBranding);
      whatsappService.sendReminder(member.phone, msg);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Top Banner / Welcome */}
      <div className="glass-card" style={{
        background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(10, 10, 10, 0.95) 70%)',
        border: '1px solid rgba(212, 175, 55, 0.35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
        padding: '28px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-info" style={{ backgroundColor: 'rgba(212, 175, 55, 0.18)', color: '#fce085', borderColor: '#d4af37' }}>
              <Zap size={13} /> Live System Status
            </span>
            <span style={{ fontSize: '13px', color: '#a1a1aa' }}>{gymBranding ? gymBranding.name : 'Fitness Lover Gym'}</span>
          </div>
          <h2 style={{ fontSize: '26px', fontWeight: '900', color: '#ffffff' }}>
            Welcome to <span style={{ background: 'linear-gradient(135deg, #ffffff 0%, #d4af37 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{gymBranding ? gymBranding.name : 'Fitness Lover Gym'}</span> Portal
          </h2>
          <p style={{ color: '#a1a1aa', fontSize: '14px', marginTop: '4px', maxWidth: '650px' }}>
            Manage member registrations, monthly fees, 1-click WhatsApp reminders, daily attendance logs, and personal trainers seamlessly.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={onOpenAddMember} className="btn btn-primary">
            <Plus size={16} /> Register New Member
          </button>
          <button onClick={() => onNavigate('reports')} className="btn btn-secondary">
            <BarChart3 size={16} color="#d4af37" /> Revenue Analytics
          </button>
        </div>
      </div>

      {/* Primary Key Performance Metrics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px'
      }}>

        {/* Total Members Stat Card */}
        <div className="glass-card glass-card-interactive" style={{ cursor: 'pointer' }} onClick={() => onNavigate('members')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '13px', color: '#a1a1aa', fontWeight: '600' }}>Total Members</span>
              <h3 style={{ fontSize: '32px', fontWeight: '800', marginTop: '4px', color: '#ffffff' }}>
                {stats.totalMembers}
              </h3>
            </div>
            <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: 'rgba(212, 175, 55, 0.15)', color: '#d4af37' }}>
              <Users size={24} />
            </div>
          </div>
          <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#34d399' }}>
            <TrendingUp size={14} />
            <span><strong>{stats.activeMembers} Active</strong> memberships</span>
          </div>
        </div>

        {/* This Month's Income Revenue Widget */}
        <div className="glass-card glass-card-interactive" style={{ cursor: 'pointer' }} onClick={() => onNavigate('reports')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '13px', color: '#34d399', fontWeight: '600' }}>This Month's Revenue</span>
              <h3 style={{ fontSize: '32px', fontWeight: '800', marginTop: '4px', color: '#34d399' }}>
                Rs {stats.thisMonthRevenue.toLocaleString('en-IN')}
              </h3>
            </div>
            <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
              <BarChart3 size={24} />
            </div>
          </div>
          <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#d4af37' }}>
            <ArrowUpRight size={14} />
            <span>View Full Financial Analytics &rarr;</span>
          </div>
        </div>

        {/* Pending Dues Stat Card */}
        <div className="glass-card glass-card-interactive" style={{
          cursor: 'pointer',
          borderColor: stats.pendingFeeCount > 0 ? 'rgba(225, 29, 72, 0.45)' : 'var(--glass-border)'
        }} onClick={() => onNavigate('fees')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '13px', color: '#fb7185', fontWeight: '600' }}>Pending Fees & Overdue</span>
              <h3 style={{ fontSize: '32px', fontWeight: '800', marginTop: '4px', color: '#e11d48' }}>
                Rs {stats.pendingFeeAmount.toLocaleString('en-IN')}
              </h3>
            </div>
            <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: 'rgba(225, 29, 72, 0.15)', color: '#e11d48' }}>
              <AlertTriangle size={24} />
            </div>
          </div>
          <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#fb7185' }}>
            <Clock size={14} />
            <span><strong>{stats.pendingFeeCount} members</strong> past due date</span>
          </div>
        </div>

        {/* Today's Attendance Stat Card */}
        <div className="glass-card glass-card-interactive" style={{ cursor: 'pointer' }} onClick={() => onNavigate('attendance')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '13px', color: '#a1a1aa', fontWeight: '600' }}>Today's Attendance</span>
              <h3 style={{ fontSize: '32px', fontWeight: '800', marginTop: '4px', color: '#ffffff' }}>
                {stats.todayAttendance} <span style={{ fontSize: '16px', color: '#71717a' }}>/ {stats.totalMembers}</span>
              </h3>
            </div>
            <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
              <UserCheck size={24} />
            </div>
          </div>
          <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#34d399' }}>
            <Sparkles size={14} />
            <span><strong>{stats.turnoutPercent}%</strong> member turnout today</span>
          </div>
        </div>

      </div>

      {/* Main Grid: Late Fee Alerts Panel & Pricing Plans */}
      <div className="grid-mobile-stack" style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.6fr) minmax(0, 1fr)',
        gap: '24px'
      }}>

        {/* Late Fee Alerts Section with WhatsApp Trigger */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '18px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: 'rgba(225, 29, 72, 0.2)' }}>
                <AlertTriangle size={20} color="#e11d48" />
              </div>
              <div>
                <h3 style={{ fontSize: '18px' }}>Late Fee Alerts</h3>
                <span style={{ fontSize: '12px', color: '#a1a1aa' }}>Members requiring fee renewal</span>
              </div>
            </div>
            <button onClick={() => onNavigate('fees')} className="btn btn-secondary btn-sm">
              View All Dues
            </button>
          </div>

          {lateFeeAlerts.length === 0 ? (
            <div style={{
              padding: '40px 20px',
              textAlign: 'center',
              color: '#34d399',
              backgroundColor: 'rgba(16, 185, 129, 0.05)',
              borderRadius: '12px',
              border: '1px dashed rgba(16, 185, 129, 0.2)'
            }}>
              <CheckCircle2 size={36} style={{ marginBottom: '8px' }} />
              <div style={{ fontWeight: '700' }}>No Late Fee Overdues!</div>
              <div style={{ fontSize: '13px', color: '#a1a1aa', marginTop: '4px' }}>All active members are up to date on monthly payments.</div>
            </div>
          ) : (
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Plan</th>
                    <th>Due Date</th>
                    <th>Overdue</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {lateFeeAlerts.map((alert) => (
                    <tr key={alert.memberId}>
                      <td>
                        <div style={{ fontWeight: '700', color: '#ffffff' }}>{alert.memberName}</div>
                        <div style={{ fontSize: '12px', color: '#a1a1aa', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Phone size={11} /> {alert.phone}
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: '12px', color: '#e4e4e7' }}>{alert.planName}</span>
                        <div style={{ fontSize: '11px', color: '#d4af37', fontWeight: '700' }}>Rs {alert.monthlyFee}</div>
                      </td>
                      <td>
                        <span style={{ fontSize: '13px', color: '#fb7185', fontWeight: '600' }}>{alert.dueDate}</span>
                      </td>
                      <td>
                        <span className="badge badge-overdue">
                          {alert.daysOverdue} Days Late
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            onClick={() => handleSendWhatsAppReminder(alert)}
                            className="btn btn-secondary btn-sm"
                            title="Send WhatsApp Fee Reminder"
                            style={{ borderColor: '#22c55e', color: '#4ade80' }}
                          >
                            <MessageSquareShare size={14} color="#22c55e" /> WhatsApp
                          </button>
                          <button
                            onClick={() => onRecordPaymentForMember(alert.memberId)}
                            className="btn btn-success btn-sm"
                          >
                            Collect Rs {alert.monthlyFee}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Payments Feed Widget */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '18px' }}>Recent Collections Feed</h3>
              <span style={{ fontSize: '12px', color: '#a1a1aa' }}>Latest processed receipts</span>
            </div>
            <button onClick={() => onNavigate('fees')} className="btn btn-secondary btn-sm">
              View All
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {recentTransactions.length === 0 ? (
              <div style={{ fontSize: '12px', color: '#71717a' }}>No receipts issued yet.</div>
            ) : (
              recentTransactions.map((tx) => (
                <div key={tx.id} style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(10, 10, 10, 0.8)',
                  border: '1px solid rgba(212, 175, 55, 0.18)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
                      <Receipt size={16} />
                    </div>
                    <div>
                      <div style={{ fontWeight: '700', color: '#ffffff', fontSize: '13px' }}>{tx.memberName}</div>
                      <div style={{ fontSize: '11px', color: '#a1a1aa' }}>{tx.mode} &bull; {tx.paymentDate}</div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '800', color: '#34d399', fontSize: '14px' }}>+ Rs {tx.amount}</div>
                    <div style={{ fontSize: '10px', color: '#d4af37', fontFamily: 'monospace' }}>{tx.id}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
