import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  AlertTriangle,
  Receipt,
  Printer,
  CheckCircle2,
  Calendar,
  DollarSign,
  Search,
  Plus,
  ArrowRight,
  MessageSquareShare,
  FileSpreadsheet,
  QrCode,
  Building2,
  Wallet
} from 'lucide-react';
import { feesService } from '../services/feesService';
import { membersService } from '../services/membersService';
import { whatsappService } from '../services/whatsappService';
import { settingsService } from '../services/settingsService';
import { backupService } from '../services/backupService';

export default function FeeManagementView({ onSelectPrintReceipt, preSelectedMemberId = null }) {
  const [transactions, setTransactions] = useState([]);
  const [lateAlerts, setLateAlerts] = useState([]);
  const [members, setMembers] = useState([]);
  const [gymBranding, setGymBranding] = useState(null);
  const [loading, setLoading] = useState(true);

  // Pay Fee Modal
  const [isPayModalOpen, setIsPayModalOpen] = useState(Boolean(preSelectedMemberId));
  const [selectedMemberId, setSelectedMemberId] = useState(preSelectedMemberId || '');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('EasyPaisa');
  const [transactionRef, setTransactionRef] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadFeeData();
  }, []);

  useEffect(() => {
    if (preSelectedMemberId) {
      setSelectedMemberId(preSelectedMemberId);
      setIsPayModalOpen(true);
    }
  }, [preSelectedMemberId]);

  const loadFeeData = async () => {
    setLoading(true);
    try {
      const txs = await feesService.getTransactions();
      const alerts = await feesService.getLateFeeAlerts();
      const mems = await membersService.getMembers();
      const settings = await settingsService.getSettings();

      setTransactions(txs);
      setLateAlerts(alerts);
      setMembers(mems);
      setGymBranding(settings);

      if (preSelectedMemberId && !paymentAmount) {
        const target = mems.find(m => m.id === preSelectedMemberId);
        if (target) setPaymentAmount(target.monthlyFee.toString());
      }
    } catch (err) {
      console.error('Error loading fees data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMemberSelect = (e) => {
    const id = e.target.value;
    setSelectedMemberId(id);
    const m = members.find((mem) => mem.id === id);
    if (m) {
      setPaymentAmount(m.monthlyFee.toString());
    }
  };

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    if (!selectedMemberId) {
      alert('Please select a member to collect fee.');
      return;
    }

    try {
      const finalRef = transactionRef.trim() || `${paymentMode}-${Math.floor(10000000 + Math.random() * 90000000)}`;

      const newTx = await feesService.recordPayment({
        memberId: selectedMemberId,
        amount: paymentAmount,
        mode: paymentMode,
        transactionRef: finalRef,
        notes
      });

      const member = await membersService.getMemberById(selectedMemberId);
      const receiptObj = feesService.getReceiptObject(newTx, member);

      setIsPayModalOpen(false);
      setTransactionRef('');
      setNotes('');
      loadFeeData();

      // Open printable receipt automatically
      onSelectPrintReceipt(receiptObj);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSendWhatsAppReminder = async (alertItem) => {
    const member = await membersService.getMemberById(alertItem.memberId);
    if (member) {
      const msg = whatsappService.generateReminderMessage(member, alertItem, gymBranding);
      whatsappService.sendReminder(member.phone, msg);
    }
  };

  const getModeBadge = (mode) => {
    switch (mode) {
      case 'EasyPaisa':
        return (
          <span className="badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.18)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.35)' }}>
            EasyPaisa
          </span>
        );
      case 'JazzCash':
        return (
          <span className="badge" style={{ backgroundColor: 'rgba(225, 29, 72, 0.18)', color: '#fb7185', border: '1px solid rgba(225, 29, 72, 0.35)' }}>
            JazzCash
          </span>
        );
      case 'Bank Transfer':
        return (
          <span className="badge" style={{ backgroundColor: 'rgba(56, 189, 248, 0.18)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.35)' }}>
            Bank Transfer
          </span>
        );
      case 'Cash':
        return (
          <span className="badge" style={{ backgroundColor: 'rgba(245, 158, 11, 0.18)', color: '#fde047', border: '1px solid rgba(245, 158, 11, 0.35)' }}>
            Cash Counter
          </span>
        );
      default:
        return (
          <span className="badge badge-info">
            {mode}
          </span>
        );
    }
  };

  const getRefPlaceholder = () => {
    switch (paymentMode) {
      case 'EasyPaisa':
        return 'e.g. 98765432101 (EasyPaisa TRX ID)';
      case 'JazzCash':
        return 'e.g. 01928374652 (JazzCash TRX ID)';
      case 'Bank Transfer':
        return 'e.g. PK00BANK123456789 (IBFT Ref ID)';
      case 'Cash':
        return 'e.g. Counter Receipt # or Cash (Optional)';
      default:
        return 'e.g. Transaction ID / Reference Number';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Header & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '800' }}>Fee & Subscription Management</h2>
          <span style={{ fontSize: '13px', color: '#a1a1aa' }}>Record fee payments via EasyPaisa, JazzCash, Cash, or Bank Transfer & generate receipts</span>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => backupService.exportTransactionsCSV(transactions)} className="btn btn-secondary">
            <FileSpreadsheet size={16} color="#d4af37" /> Export Receipts CSV
          </button>
          <button
            onClick={() => {
              setSelectedMemberId(members[0]?.id || '');
              setPaymentAmount(members[0]?.monthlyFee.toString() || '1500');
              setIsPayModalOpen(true);
            }}
            className="btn btn-primary"
          >
            <Plus size={18} /> Record Fee Payment
          </button>
        </div>
      </div>

      {/* Late Fee Alert Callout Section with 1-Click WhatsApp Messenger */}
      {lateAlerts.length > 0 && (
        <div className="glass-card" style={{
          borderColor: 'rgba(225, 29, 72, 0.45)',
          background: 'linear-gradient(135deg, rgba(225, 29, 72, 0.12) 0%, rgba(10, 10, 10, 0.95) 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ padding: '10px', borderRadius: '10px', backgroundColor: 'rgba(225, 29, 72, 0.2)' }}>
              <AlertTriangle size={24} color="#e11d48" />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', color: '#fb7185' }}>
                Late Fee Action Required ({lateAlerts.length} Overdue Members)
              </h3>
              <span style={{ fontSize: '12px', color: '#a1a1aa' }}>
                Send instant WhatsApp fee reminders or collect monthly fees to renew member access.
              </span>
            </div>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Plan Rate</th>
                  <th>Original Due Date</th>
                  <th>Overdue Duration</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {lateAlerts.map((alert) => (
                  <tr key={alert.memberId}>
                    <td>
                      <strong style={{ color: '#ffffff' }}>{alert.memberName}</strong>
                      <div style={{ fontSize: '12px', color: '#a1a1aa' }}>{alert.memberId} &bull; {alert.phone}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: '800', color: '#d4af37' }}>Rs {alert.monthlyFee}</div>
                      <div style={{ fontSize: '11px', color: '#a1a1aa' }}>{alert.planName}</div>
                    </td>
                    <td>
                      <span style={{ color: '#fb7185', fontWeight: '700' }}>{alert.dueDate}</span>
                    </td>
                    <td>
                      <span className="badge badge-overdue">
                        {alert.daysOverdue} Days Overdue
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button
                          onClick={() => handleSendWhatsAppReminder(alert)}
                          className="btn btn-secondary btn-sm"
                          style={{ borderColor: '#22c55e', color: '#4ade80' }}
                          title="Send WhatsApp Fee Reminder"
                        >
                          <MessageSquareShare size={14} color="#22c55e" /> WhatsApp
                        </button>
                        <button
                          onClick={() => {
                            setSelectedMemberId(alert.memberId);
                            setPaymentAmount(alert.monthlyFee.toString());
                            setIsPayModalOpen(true);
                          }}
                          className="btn btn-success btn-sm"
                        >
                          <CreditCard size={14} /> Pay Rs {alert.monthlyFee}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payment Receipts History Table */}
      <div className="glass-card">
        <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '18px' }}>Payment Transaction Records</h3>
            <span style={{ fontSize: '12px', color: '#a1a1aa' }}>Complete audit trail of issued receipts and transaction IDs</span>
          </div>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Receipt ID</th>
                <th>Member Name</th>
                <th>Plan Name</th>
                <th>Amount Paid</th>
                <th>Payment Mode</th>
                <th>TRX / Ref ID</th>
                <th>Date Paid</th>
                <th>Next Due Date</th>
                <th>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id}>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontWeight: '800', color: '#d4af37' }}>{tx.id}</span>
                  </td>
                  <td>
                    <strong style={{ color: '#ffffff' }}>{tx.memberName}</strong>
                    <div style={{ fontSize: '11px', color: '#a1a1aa' }}>ID: {tx.memberId}</div>
                  </td>
                  <td>{tx.planName}</td>
                  <td>
                    <span style={{ fontWeight: '800', color: '#34d399' }}>Rs {tx.amount.toLocaleString('en-IN')}</span>
                  </td>
                  <td>
                    {getModeBadge(tx.mode)}
                  </td>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#e4e4e7', fontWeight: '600' }}>
                      {tx.transactionRef || '--'}
                    </span>
                  </td>
                  <td>{tx.paymentDate}</td>
                  <td>
                    <span style={{ color: '#34d399', fontWeight: '600' }}>{tx.dueDate}</span>
                  </td>
                  <td>
                    <button
                      onClick={async () => {
                        const m = await membersService.getMemberById(tx.memberId);
                        const receiptObj = feesService.getReceiptObject(tx, m);
                        onSelectPrintReceipt(receiptObj);
                      }}
                      className="btn btn-secondary btn-sm"
                      title="Print Official Receipt"
                    >
                      <Printer size={14} /> Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Fee Payment Modal */}
      {isPayModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CreditCard size={22} color="#d4af37" />
                <h3 style={{ fontSize: '18px' }}>Record Monthly Fee Payment</h3>
              </div>
              <button onClick={() => setIsPayModalOpen(false)} className="btn btn-secondary btn-sm">✕</button>
            </div>

            <form onSubmit={handleRecordPayment}>
              <div className="modal-body">
                
                <div className="form-group">
                  <label className="form-label">Select Gym Member *</label>
                  <select
                    className="form-select"
                    value={selectedMemberId}
                    onChange={handleMemberSelect}
                    required
                  >
                    <option value="">-- Choose Member --</option>
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.id}) - {m.planName} (Rs {m.monthlyFee})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Amount Collected (Rs) *</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="Amount in Rs"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Payment Channel / Method *</label>
                  <select
                    className="form-select"
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value)}
                    required
                  >
                    <option value="EasyPaisa">EasyPaisa</option>
                    <option value="JazzCash">JazzCash</option>
                    <option value="Cash">Cash at Counter</option>
                    <option value="Bank Transfer">Bank Transfer (IBFT)</option>
                    <option value="UPI (GPay/PhonePe)">UPI (GPay / PhonePe / Paytm)</option>
                    <option value="Credit / Debit Card">Credit / Debit Card</option>
                  </select>
                </div>

                {/* Transaction ID / Reference Number Field */}
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Transaction ID / Reference Number {paymentMode !== 'Cash' && '*'}</span>
                    <span style={{ fontSize: '11px', color: '#d4af37', fontWeight: '700' }}>
                      {paymentMode} TRX
                    </span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder={getRefPlaceholder()}
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    required={paymentMode === 'EasyPaisa' || paymentMode === 'JazzCash'}
                  />
                  <span style={{ fontSize: '11px', color: '#a1a1aa', marginTop: '2px' }}>
                    {paymentMode === 'EasyPaisa' || paymentMode === 'JazzCash'
                      ? `Enter the ${paymentMode} confirmation TRX ID for audit logs`
                      : 'Recorded on member receipt for verification'}
                  </span>
                </div>

                <div className="form-group">
                  <label className="form-label">Notes / Remarks</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Optional remarks e.g. Monthly fee payment"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setIsPayModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-success">
                  <CheckCircle2 size={16} /> Collect Fee & Issue Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
