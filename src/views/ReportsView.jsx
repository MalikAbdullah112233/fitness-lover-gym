import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  DollarSign,
  Download,
  Calendar,
  Users,
  CreditCard,
  Printer,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Wallet,
  Building2,
  Filter,
  ArrowUpRight
} from 'lucide-react';
import { feesService } from '../services/feesService';
import { membersService } from '../services/membersService';
import { backupService } from '../services/backupService';
import { MEMBERSHIP_PLANS } from '../constants/plansData';

export default function ReportsView() {
  const [transactions, setTransactions] = useState([]);
  const [members, setMembers] = useState([]);
  const [lateAlerts, setLateAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Date Filter State for Fee Reports
  const [dateFilter, setDateFilter] = useState('THIS_MONTH'); // TODAY | THIS_WEEK | THIS_MONTH | ALL | CUSTOM
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    loadReportsData();
  }, []);

  const loadReportsData = async () => {
    setLoading(true);
    try {
      const txs = await feesService.getTransactions();
      const mems = await membersService.getMembers();
      const alerts = await feesService.getLateFeeAlerts();

      setTransactions(txs);
      setMembers(mems);
      setLateAlerts(alerts);
    } catch (err) {
      console.error('Error loading reports:', err);
    } finally {
      setLoading(false);
    }
  };

  // 1. Revenue Calculations
  const todayStr = new Date().toISOString().split('T')[0];
  const currentMonthStr = todayStr.slice(0, 7); // YYYY-MM

  const totalCollectedRevenue = transactions.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  
  const thisMonthRevenue = transactions
    .filter((tx) => tx.paymentDate && tx.paymentDate.startsWith(currentMonthStr))
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);

  const todayRevenue = transactions
    .filter((tx) => tx.paymentDate === todayStr)
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);

  const pendingFeesAmount = lateAlerts.reduce(
    (acc, curr) => acc + curr.monthlyFee + (curr.estimatedLateFee || 0),
    0
  );

  const paidMembersCount = members.filter((m) => m.feeStatus === 'Paid').length;
  const unpaidMembersCount = members.filter((m) => m.feeStatus === 'Overdue' || m.feeStatus === 'Pending').length;

  // 2. Payment Method Analytics Breakdown
  const paymentMethodsBreakdown = {
    EasyPaisa: { amount: 0, count: 0 },
    JazzCash: { amount: 0, count: 0 },
    Cash: { amount: 0, count: 0 },
    'Bank Transfer': { amount: 0, count: 0 },
    Other: { amount: 0, count: 0 }
  };

  transactions.forEach((tx) => {
    const mode = tx.mode || 'Cash';
    if (paymentMethodsBreakdown[mode]) {
      paymentMethodsBreakdown[mode].amount += tx.amount || 0;
      paymentMethodsBreakdown[mode].count += 1;
    } else if (mode.includes('Cash')) {
      paymentMethodsBreakdown.Cash.amount += tx.amount || 0;
      paymentMethodsBreakdown.Cash.count += 1;
    } else {
      paymentMethodsBreakdown.Other.amount += tx.amount || 0;
      paymentMethodsBreakdown.Other.count += 1;
    }
  });

  // 3. Filtered Fee Transactions
  const filteredTransactions = transactions.filter((tx) => {
    if (!tx.paymentDate) return true;

    if (dateFilter === 'TODAY') {
      return tx.paymentDate === todayStr;
    }

    if (dateFilter === 'THIS_WEEK') {
      const now = new Date();
      const firstDayOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
      firstDayOfWeek.setHours(0, 0, 0, 0);
      const txDate = new Date(tx.paymentDate);
      return txDate >= firstDayOfWeek;
    }

    if (dateFilter === 'THIS_MONTH') {
      return tx.paymentDate.startsWith(currentMonthStr);
    }

    if (dateFilter === 'CUSTOM') {
      if (startDate && tx.paymentDate < startDate) return false;
      if (endDate && tx.paymentDate > endDate) return false;
      return true;
    }

    return true; // ALL
  });

  // 4. Member Financial History Report Aggregation
  const memberFinancialReport = members.map((m) => {
    const memberTxs = transactions.filter((tx) => tx.memberId === m.id);
    const totalPaid = memberTxs.reduce((acc, curr) => acc + (curr.amount || 0), 0);
    const lastTx = memberTxs.sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate))[0];

    return {
      id: m.id,
      name: m.name,
      phone: m.phone,
      planName: m.planName,
      monthlyFee: m.monthlyFee,
      totalPaid,
      transactionCount: memberTxs.length,
      lastPaymentDate: lastTx ? lastTx.paymentDate : m.lastPaymentDate || 'N/A',
      dueDate: m.dueDate,
      feeStatus: m.feeStatus
    };
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Top Header Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '900' }}>Revenue & Business Analytics</h2>
          <span style={{ fontSize: '13px', color: '#a1a1aa' }}>
            Monitor gym financial performance, payment gateway breakdowns, and member ledgers
          </span>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => backupService.exportTransactionsCSV(filteredTransactions)}
            className="btn btn-secondary"
          >
            <FileSpreadsheet size={16} color="#d4af37" /> Export Filtered CSV
          </button>
          <button onClick={() => window.print()} className="btn btn-primary">
            <Printer size={16} /> Print Official Report
          </button>
        </div>
      </div>

      {/* 1. Revenue Dashboard Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        
        {/* Total Revenue */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: '#a1a1aa', fontWeight: '700' }}>Total Revenue</span>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: 'rgba(212, 175, 55, 0.15)', color: '#d4af37' }}>
              <TrendingUp size={20} />
            </div>
          </div>
          <h3 style={{ fontSize: '30px', fontWeight: '900', color: '#d4af37', marginTop: '8px' }}>
            Rs {totalCollectedRevenue.toLocaleString('en-IN')}
          </h3>
          <span style={{ fontSize: '12px', color: '#71717a' }}>All-time total collected from {transactions.length} receipts</span>
        </div>

        {/* This Month's Revenue */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: '#a1a1aa', fontWeight: '700' }}>This Month's Revenue</span>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
              <DollarSign size={20} />
            </div>
          </div>
          <h3 style={{ fontSize: '30px', fontWeight: '900', color: '#34d399', marginTop: '8px' }}>
            Rs {thisMonthRevenue.toLocaleString('en-IN')}
          </h3>
          <span style={{ fontSize: '12px', color: '#34d399' }}>Current month collections</span>
        </div>

        {/* Today's Collection */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: '#a1a1aa', fontWeight: '700' }}>Today's Collection</span>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
              <Calendar size={20} />
            </div>
          </div>
          <h3 style={{ fontSize: '30px', fontWeight: '900', color: '#38bdf8', marginTop: '8px' }}>
            Rs {todayRevenue.toLocaleString('en-IN')}
          </h3>
          <span style={{ fontSize: '12px', color: '#71717a' }}>Collected today</span>
        </div>

        {/* Pending & Overdue Amount */}
        <div className="glass-card" style={{ borderColor: pendingFeesAmount > 0 ? 'rgba(225, 29, 72, 0.4)' : 'var(--glass-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: '#fb7185', fontWeight: '700' }}>Outstanding Pending Fees</span>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: 'rgba(225, 29, 72, 0.15)', color: '#e11d48' }}>
              <AlertTriangle size={20} />
            </div>
          </div>
          <h3 style={{ fontSize: '30px', fontWeight: '900', color: '#e11d48', marginTop: '8px' }}>
            Rs {pendingFeesAmount.toLocaleString('en-IN')}
          </h3>
          <span style={{ fontSize: '12px', color: '#fb7185' }}>{lateAlerts.length} overdue member accounts</span>
        </div>

        {/* Paid vs Unpaid Ratio */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: '#a1a1aa', fontWeight: '700' }}>Paid vs Unpaid Members</span>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: 'rgba(212, 175, 55, 0.15)', color: '#d4af37' }}>
              <Users size={20} />
            </div>
          </div>
          <h3 style={{ fontSize: '26px', fontWeight: '900', color: '#ffffff', marginTop: '8px' }}>
            <span style={{ color: '#34d399' }}>{paidMembersCount} Paid</span> / <span style={{ color: '#e11d48' }}>{unpaidMembersCount} Unpaid</span>
          </h3>
          <span style={{ fontSize: '12px', color: '#71717a' }}>
            {members.length > 0 ? Math.round((paidMembersCount / members.length) * 100) : 0}% paid compliance rate
          </span>
        </div>

      </div>

      {/* 2. Payment Method Analytics Breakdown */}
      <div className="glass-card">
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px' }}>Payment Method Analytics</h3>
          <span style={{ fontSize: '12px', color: '#a1a1aa' }}>Collection distribution across EasyPaisa, JazzCash, Cash & Bank Transfer</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          
          {/* EasyPaisa */}
          <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
            <div style={{ fontSize: '12px', color: '#34d399', fontWeight: '800', textTransform: 'uppercase' }}>EasyPaisa</div>
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#ffffff', marginTop: '4px' }}>
              Rs {paymentMethodsBreakdown.EasyPaisa.amount.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '12px', color: '#a1a1aa', marginTop: '2px' }}>
              {paymentMethodsBreakdown.EasyPaisa.count} transactions
            </div>
          </div>

          {/* JazzCash */}
          <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'rgba(225, 29, 72, 0.08)', border: '1px solid rgba(225, 29, 72, 0.25)' }}>
            <div style={{ fontSize: '12px', color: '#fb7185', fontWeight: '800', textTransform: 'uppercase' }}>JazzCash</div>
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#ffffff', marginTop: '4px' }}>
              Rs {paymentMethodsBreakdown.JazzCash.amount.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '12px', color: '#a1a1aa', marginTop: '2px' }}>
              {paymentMethodsBreakdown.JazzCash.count} transactions
            </div>
          </div>

          {/* Cash */}
          <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
            <div style={{ fontSize: '12px', color: '#fde047', fontWeight: '800', textTransform: 'uppercase' }}>Cash at Counter</div>
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#ffffff', marginTop: '4px' }}>
              Rs {paymentMethodsBreakdown.Cash.amount.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '12px', color: '#a1a1aa', marginTop: '2px' }}>
              {paymentMethodsBreakdown.Cash.count} transactions
            </div>
          </div>

          {/* Bank Transfer */}
          <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
            <div style={{ fontSize: '12px', color: '#38bdf8', fontWeight: '800', textTransform: 'uppercase' }}>Bank Transfer (IBFT)</div>
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#ffffff', marginTop: '4px' }}>
              Rs {paymentMethodsBreakdown['Bank Transfer'].amount.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '12px', color: '#a1a1aa', marginTop: '2px' }}>
              {paymentMethodsBreakdown['Bank Transfer'].count} transactions
            </div>
          </div>

        </div>
      </div>

      {/* 3. Fee Reports & Date Range Filter Section */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '18px' }}>Filtered Fee Collection Roster</h3>
            <span style={{ fontSize: '12px', color: '#a1a1aa' }}>Showing {filteredTransactions.length} receipts</span>
          </div>

          {/* Filter Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setDateFilter('TODAY')}
              className={`btn btn-sm ${dateFilter === 'TODAY' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Today
            </button>
            <button
              onClick={() => setDateFilter('THIS_WEEK')}
              className={`btn btn-sm ${dateFilter === 'THIS_WEEK' ? 'btn-primary' : 'btn-secondary'}`}
            >
              This Week
            </button>
            <button
              onClick={() => setDateFilter('THIS_MONTH')}
              className={`btn btn-sm ${dateFilter === 'THIS_MONTH' ? 'btn-primary' : 'btn-secondary'}`}
            >
              This Month
            </button>
            <button
              onClick={() => setDateFilter('ALL')}
              className={`btn btn-sm ${dateFilter === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
            >
              All Time
            </button>

            {/* Custom Date Pickers */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginLeft: '8px' }}>
              <input
                type="date"
                className="form-input"
                style={{ padding: '4px 8px', fontSize: '12px', width: '130px' }}
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setDateFilter('CUSTOM');
                }}
              />
              <span style={{ fontSize: '12px', color: '#71717a' }}>to</span>
              <input
                type="date"
                className="form-input"
                style={{ padding: '4px 8px', fontSize: '12px', width: '130px' }}
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setDateFilter('CUSTOM');
                }}
              />
            </div>
          </div>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Receipt ID</th>
                <th>Member Name</th>
                <th>Amount Paid</th>
                <th>Payment Method</th>
                <th>TRX / Ref ID</th>
                <th>Payment Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: '#71717a' }}>
                    No fee receipts match the selected date range filter.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id}>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontWeight: '800', color: '#d4af37' }}>{tx.id}</span>
                    </td>
                    <td>
                      <strong style={{ color: '#ffffff' }}>{tx.memberName}</strong>
                      <div style={{ fontSize: '11px', color: '#a1a1aa' }}>ID: {tx.memberId}</div>
                    </td>
                    <td>
                      <span style={{ fontWeight: '800', color: '#34d399' }}>Rs {tx.amount.toLocaleString('en-IN')}</span>
                    </td>
                    <td>
                      <span className="badge badge-info">{tx.mode}</span>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#e4e4e7' }}>
                        {tx.transactionRef || '--'}
                      </span>
                    </td>
                    <td>{tx.paymentDate}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Member Financial Ledger Report */}
      <div className="glass-card">
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px' }}>Member Financial Summary Report</h3>
          <span style={{ fontSize: '12px', color: '#a1a1aa' }}>Lifetime collection & due date ledger for all registered members</span>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Subscription Plan</th>
                <th>Total Paid (Lifetime)</th>
                <th>Receipts Issued</th>
                <th>Last Paid Date</th>
                <th>Next Due Date</th>
                <th>Fee Status</th>
              </tr>
            </thead>
            <tbody>
              {memberFinancialReport.map((m) => (
                <tr key={m.id}>
                  <td>
                    <strong style={{ color: '#ffffff' }}>{m.name}</strong>
                    <div style={{ fontSize: '11px', color: '#a1a1aa' }}>ID: {m.id} &bull; {m.phone}</div>
                  </td>
                  <td>
                    <div>{m.planName}</div>
                    <div style={{ fontSize: '11px', color: '#d4af37', fontWeight: '700' }}>Rs {m.monthlyFee}/mo</div>
                  </td>
                  <td>
                    <span style={{ fontWeight: '800', color: '#34d399' }}>Rs {m.totalPaid.toLocaleString('en-IN')}</span>
                  </td>
                  <td>
                    <span className="badge badge-info">{m.transactionCount} Paid</span>
                  </td>
                  <td>{m.lastPaymentDate}</td>
                  <td>
                    <span style={{ color: m.feeStatus === 'Overdue' ? '#fb7185' : '#34d399', fontWeight: '700' }}>
                      {m.dueDate}
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge-${m.feeStatus.toLowerCase()}`}>
                      {m.feeStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
