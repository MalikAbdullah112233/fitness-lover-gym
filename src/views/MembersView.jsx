import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Phone,
  Calendar,
  CreditCard,
  Edit,
  Trash2,
  Eye,
  ShieldAlert,
  Dumbbell,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Clock,
  Receipt,
  AlertTriangle,
  MessageSquareShare
} from 'lucide-react';
import { membersService } from '../services/membersService';
import { trainersService } from '../services/trainersService';
import { feesService } from '../services/feesService';
import { attendanceService } from '../services/attendanceService';
import { backupService } from '../services/backupService';
import { whatsappService } from '../services/whatsappService';
import { settingsService } from '../services/settingsService';
import { MEMBERSHIP_PLANS } from '../constants/plansData';

export default function MembersView({ onRecordPayment, initialAddOpen = false }) {
  const [members, setMembers] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [gymBranding, setGymBranding] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [feeStatusFilter, setFeeStatusFilter] = useState('ALL');
  const [planFilter, setPlanFilter] = useState('ALL');

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(initialAddOpen);
  const [editingMember, setEditingMember] = useState(null);
  const [viewingMember, setViewingMember] = useState(null);

  // Manual Due Date Change Modal State
  const [dueDateModalMember, setDueDateModalMember] = useState(null);
  const [customDueDate, setCustomDueDate] = useState('');
  const [customFeeStatus, setCustomFeeStatus] = useState('Overdue');

  // Member History Details
  const [memberReceipts, setMemberReceipts] = useState([]);
  const [memberAttendance, setMemberAttendance] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    joiningDate: new Date().toISOString().split('T')[0],
    dueDate: new Date().toISOString().split('T')[0],
    feeStatus: 'Paid',
    planId: MEMBERSHIP_PLANS[0].id,
    trainerId: '',
    gender: 'Male',
    age: '25',
    bloodGroup: 'O+',
    emergencyContact: ''
  });

  useEffect(() => {
    loadMembersData();
  }, []);

  useEffect(() => {
    if (initialAddOpen) setIsFormOpen(true);
  }, [initialAddOpen]);

  const loadMembersData = async () => {
    setLoading(true);
    try {
      const data = await membersService.getMembers();
      const trData = await trainersService.getTrainers();
      const settings = await settingsService.getSettings();
      setMembers(data);
      setTrainers(trData);
      setGymBranding(settings);
    } catch (err) {
      console.error('Error fetching members:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    const today = new Date().toISOString().split('T')[0];
    const nextDue = new Date();
    nextDue.setDate(nextDue.getDate() + 30);
    const dueStr = nextDue.toISOString().split('T')[0];

    setEditingMember(null);
    setFormData({
      name: '',
      phone: '',
      email: '',
      address: '',
      joiningDate: today,
      dueDate: dueStr,
      feeStatus: 'Paid',
      planId: MEMBERSHIP_PLANS[0].id,
      trainerId: trainers[0]?.id || '',
      gender: 'Male',
      age: '25',
      bloodGroup: 'O+',
      emergencyContact: ''
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      phone: member.phone,
      email: member.email || '',
      address: member.address || '',
      joiningDate: member.joiningDate,
      dueDate: member.dueDate || new Date().toISOString().split('T')[0],
      feeStatus: member.feeStatus || 'Paid',
      planId: member.planId,
      trainerId: member.trainerId || '',
      gender: member.gender || 'Male',
      age: member.age || 25,
      bloodGroup: member.bloodGroup || 'A+',
      emergencyContact: member.emergencyContact || ''
    });
    setIsFormOpen(true);
  };

  const handleOpenViewProfile = async (member) => {
    setViewingMember(member);
    const allTxs = await feesService.getTransactions();
    const allAtt = await attendanceService.getAttendanceLogs();

    setMemberReceipts(allTxs.filter((t) => t.memberId === member.id));
    setMemberAttendance(allAtt.filter((a) => a.memberId === member.id));
  };

  const handleOpenSetDueDateModal = (member) => {
    setDueDateModalMember(member);
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 5);
    setCustomDueDate(pastDate.toISOString().split('T')[0]);
    setCustomFeeStatus('Overdue');
  };

  const handleSaveDueDateAndStatus = async (e) => {
    e.preventDefault();
    if (!dueDateModalMember) return;

    try {
      await membersService.setMemberDueDateAndStatus(
        dueDateModalMember.id,
        customDueDate,
        customFeeStatus
      );
      setDueDateModalMember(null);
      loadMembersData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSendWhatsApp = (member) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(member.dueDate);
    due.setHours(0, 0, 0, 0);
    const diffTime = Math.abs(today - due);
    const daysOverdue = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const alertObj = {
      memberId: member.id,
      memberName: member.name,
      phone: member.phone,
      monthlyFee: member.monthlyFee,
      planName: member.planName,
      dueDate: member.dueDate,
      daysOverdue: member.feeStatus === 'Overdue' ? daysOverdue : 0
    };

    const msg = whatsappService.generateReminderMessage(member, alertObj, gymBranding);
    whatsappService.sendReminder(member.phone, msg);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const selectedTrainer = trainers.find(t => t.id === formData.trainerId);
      const trainerName = selectedTrainer ? selectedTrainer.name : 'Unassigned';

      if (editingMember) {
        await membersService.updateMember(editingMember.id, {
          ...formData,
          trainerName
        });
      } else {
        await membersService.addMember({
          ...formData,
          trainerName
        });
      }
      setIsFormOpen(false);
      loadMembersData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteMember = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete member ${name}? This action cannot be undone.`)) {
      await membersService.deleteMember(id);
      loadMembersData();
    }
  };

  // Filtered members list
  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.phone.includes(search) ||
      m.id.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || m.status === statusFilter;
    const matchesFee = feeStatusFilter === 'ALL' || m.feeStatus === feeStatusFilter;
    const matchesPlan = planFilter === 'ALL' || m.planId === planFilter;

    return matchesSearch && matchesStatus && matchesFee && matchesPlan;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Header Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '800' }}>Gym Member Directory</h2>
          <span style={{ fontSize: '13px', color: '#94a3b8' }}>Total {members.length} registered fitness members</span>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => backupService.exportMembersCSV(members)} className="btn btn-secondary">
            <FileSpreadsheet size={16} color="#10b981" /> Export CSV
          </button>
          <button onClick={handleOpenAdd} className="btn btn-primary">
            <UserPlus size={18} /> Register New Member
          </button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="glass-card" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
          
          {/* Search Box */}
          <div style={{ flex: '1 1 240px', position: 'relative' }}>
            <Search size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '12px' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '38px' }}
              placeholder="Search by member name, phone, or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Fee Status Filter */}
          <div style={{ width: '160px' }}>
            <select
              className="form-select"
              value={feeStatusFilter}
              onChange={(e) => setFeeStatusFilter(e.target.value)}
            >
              <option value="ALL">All Fee Status</option>
              <option value="Paid">Paid</option>
              <option value="Overdue">Overdue</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          {/* Membership Plan Filter */}
          <div style={{ width: '220px' }}>
            <select
              className="form-select"
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
            >
              <option value="ALL">All Membership Plans</option>
              {MEMBERSHIP_PLANS.map((p) => (
                <option key={p.id} value={p.id}>{p.name} (Rs {p.price})</option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Members Directory Table */}
      <div className="glass-card" style={{ padding: '0' }}>
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Member Details</th>
                <th>Membership Plan</th>
                <th>Joining Date</th>
                <th>Next Due Date</th>
                <th>Fee Status</th>
                <th>Assigned Trainer</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>
                    No members found matching the search/filter criteria.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr key={member.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(249, 115, 22, 0.15)',
                          border: '1px solid #f97316',
                          color: '#f97316',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: '800',
                          fontSize: '14px'
                        }}>
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: '700', color: '#ffffff' }}>{member.name}</div>
                          <div style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>{member.id}</span> &bull; <Phone size={11} /> {member.phone}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div style={{ fontWeight: '600', color: '#ffffff', fontSize: '13px' }}>{member.planName}</div>
                      <div style={{ fontSize: '11px', color: '#f97316' }}>Rs {member.monthlyFee} / month</div>
                    </td>

                    <td>
                      <span style={{ fontSize: '13px', color: '#cbd5e1' }}>{member.joiningDate}</span>
                    </td>

                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{
                          fontSize: '13px',
                          fontWeight: '700',
                          color: member.feeStatus === 'Overdue' ? '#ef4444' : '#34d399'
                        }}>
                          {member.dueDate}
                        </span>
                        <button
                          onClick={() => handleOpenSetDueDateModal(member)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#64748b',
                            cursor: 'pointer',
                            padding: '2px 4px'
                          }}
                          title="Change Due Date / Mark Overdue"
                        >
                          <Edit size={12} />
                        </button>
                      </div>
                    </td>

                    <td>
                      <span className={`badge badge-${member.feeStatus.toLowerCase()}`}>
                        {member.feeStatus}
                      </span>
                    </td>

                    <td>
                      <span style={{ fontSize: '13px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Dumbbell size={13} color="#f97316" /> {member.trainerName}
                      </span>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          onClick={() => handleSendWhatsApp(member)}
                          className="btn btn-secondary btn-sm"
                          style={{ borderColor: '#22c55e', color: '#4ade80' }}
                          title="Send WhatsApp Message"
                        >
                          <MessageSquareShare size={14} color="#22c55e" />
                        </button>
                        <button
                          onClick={() => onRecordPayment(member.id)}
                          className="btn btn-success btn-sm"
                          title="Record Payment"
                        >
                          <CreditCard size={14} /> Pay
                        </button>
                        <button
                          onClick={() => handleOpenViewProfile(member)}
                          className="btn btn-secondary btn-sm"
                          title="View Profile & History"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(member)}
                          className="btn btn-secondary btn-sm"
                          title="Edit Member"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteMember(member.id, member.name)}
                          className="btn btn-danger btn-sm"
                          title="Delete Member"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Set Due Date / Mark Overdue Modal */}
      {dueDateModalMember && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '440px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Clock size={20} color="#f97316" />
                <h3 style={{ fontSize: '18px' }}>Set Fee Due Date & Status</h3>
              </div>
              <button onClick={() => setDueDateModalMember(null)} className="btn btn-secondary btn-sm">✕</button>
            </div>

            <form onSubmit={handleSaveDueDateAndStatus}>
              <div className="modal-body">
                <div style={{ marginBottom: '16px', padding: '12px', borderRadius: '8px', backgroundColor: 'rgba(15, 23, 42, 0.6)' }}>
                  <strong style={{ color: '#ffffff' }}>{dueDateModalMember.name}</strong> ({dueDateModalMember.id})<br />
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>Current Fee Status: {dueDateModalMember.feeStatus} | Due: {dueDateModalMember.dueDate}</span>
                </div>

                <div className="form-group">
                  <label className="form-label">Set Custom Due Date *</label>
                  <input
                    type="date"
                    className="form-input"
                    value={customDueDate}
                    onChange={(e) => setCustomDueDate(e.target.value)}
                    required
                  />
                  <span style={{ fontSize: '11px', color: '#f97316', marginTop: '2px' }}>
                    Tip: Set to a past date (e.g. yesterday) to immediately trigger Late Fee & WhatsApp Alerts!
                  </span>
                </div>

                <div className="form-group">
                  <label className="form-label">Fee Status Override *</label>
                  <select
                    className="form-select"
                    value={customFeeStatus}
                    onChange={(e) => setCustomFeeStatus(e.target.value)}
                  >
                    <option value="Overdue">Overdue (Triggers Late Fee Alert)</option>
                    <option value="Pending">Pending Renewal</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setDueDateModalMember(null)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Update Fee Status & Due Date
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Member Modal */}
      {isFormOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '18px' }}>
                {editingMember ? `Edit Member: ${editingMember.name}` : 'Register New Gym Member'}
              </h3>
              <button onClick={() => setIsFormOpen(false)} className="btn btn-secondary btn-sm">✕</button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="modal-body modal-body-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="name@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Residential Address</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Street, City, Sector"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Membership Plan *</label>
                  <select
                    className="form-select"
                    value={formData.planId}
                    onChange={(e) => setFormData({ ...formData, planId: e.target.value })}
                  >
                    {MEMBERSHIP_PLANS.map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {plan.name} — Rs {plan.price}/mo
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Assign Personal Trainer</label>
                  <select
                    className="form-select"
                    value={formData.trainerId}
                    onChange={(e) => setFormData({ ...formData, trainerId: e.target.value })}
                  >
                    <option value="">Unassigned (General Gym Floor)</option>
                    {trainers.map((t) => (
                      <option key={t.id} value={t.id}>{t.name} ({t.specialty})</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Joining Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.joiningDate}
                    onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Next Fee Due Date *</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Fee Status</label>
                  <select
                    className="form-select"
                    value={formData.feeStatus}
                    onChange={(e) => setFormData({ ...formData, feeStatus: e.target.value })}
                  >
                    <option value="Paid">Paid</option>
                    <option value="Overdue">Overdue (Late Alert)</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Emergency Contact Phone</label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="+91 Emergency Phone"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  />
                </div>

              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setIsFormOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingMember ? 'Save Member Changes' : 'Register Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Expanded Member Details Drawer Modal */}
      {viewingMember && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(249, 115, 22, 0.2)',
                  border: '2px solid #f97316',
                  color: '#f97316',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '800',
                  fontSize: '18px'
                }}>
                  {viewingMember.name.charAt(0)}
                </div>
                <div>
                  <h3 style={{ fontSize: '18px' }}>{viewingMember.name}</h3>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>Member ID: {viewingMember.id} &bull; Joined: {viewingMember.joiningDate}</span>
                </div>
              </div>
              <button onClick={() => setViewingMember(null)} className="btn btn-secondary btn-sm">✕</button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              
              {/* Member Attributes Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', backgroundColor: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: '10px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>Phone</div>
                  <div style={{ fontSize: '13px', fontWeight: '700' }}>{viewingMember.phone}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>Emergency Contact</div>
                  <div style={{ fontSize: '13px', fontWeight: '700' }}>{viewingMember.emergencyContact || 'N/A'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>Assigned Trainer</div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#f97316' }}>{viewingMember.trainerName}</div>
                </div>
              </div>

              {/* Plan Card */}
              <div style={{ padding: '14px', borderRadius: '10px', backgroundColor: 'rgba(249, 115, 22, 0.08)', border: '1px solid rgba(249, 115, 22, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#f97316', fontWeight: '700', textTransform: 'uppercase' }}>Active Subscription</div>
                  <div style={{ fontSize: '16px', fontWeight: '800', color: '#ffffff' }}>{viewingMember.planName}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '18px', fontWeight: '900', color: '#34d399' }}>Rs {viewingMember.monthlyFee}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Due: {viewingMember.dueDate}</div>
                </div>
              </div>

              {/* Payment History Log */}
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#ffffff', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Receipt size={16} color="#34d399" /> Payment History ({memberReceipts.length})
                </h4>
                {memberReceipts.length === 0 ? (
                  <div style={{ fontSize: '12px', color: '#64748b' }}>No receipt records found for this member.</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '120px', overflowY: 'auto' }}>
                    {memberReceipts.map((tx) => (
                      <div key={tx.id} style={{ padding: '8px 12px', borderRadius: '6px', backgroundColor: 'rgba(255, 255, 255, 0.03)', fontSize: '12px', display: 'flex', justifyContent: 'space-between' }}>
                        <div><strong>{tx.id}</strong> &bull; {tx.mode}</div>
                        <div style={{ color: '#34d399', fontWeight: '700' }}>+ Rs {tx.amount} ({tx.paymentDate})</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Attendance Log Timeline */}
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#ffffff', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={16} color="#3b82f6" /> Attendance History ({memberAttendance.length} Check-ins)
                </h4>
                {memberAttendance.length === 0 ? (
                  <div style={{ fontSize: '12px', color: '#64748b' }}>No attendance check-ins logged yet.</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '120px', overflowY: 'auto' }}>
                    {memberAttendance.map((att) => (
                      <div key={att.id} style={{ padding: '8px 12px', borderRadius: '6px', backgroundColor: 'rgba(255, 255, 255, 0.03)', fontSize: '12px', display: 'flex', justifyContent: 'space-between' }}>
                        <div>Check-in: {att.date} at {att.checkInTime}</div>
                        <div style={{ color: '#60a5fa' }}>Out: {att.checkOutTime}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            <div className="modal-footer">
              <button
                onClick={() => handleSendWhatsApp(viewingMember)}
                className="btn btn-secondary"
                style={{ borderColor: '#22c55e', color: '#4ade80' }}
              >
                <MessageSquareShare size={16} color="#22c55e" /> Send WhatsApp
              </button>
              <button
                onClick={() => {
                  const mId = viewingMember.id;
                  setViewingMember(null);
                  onRecordPayment(mId);
                }}
                className="btn btn-success"
              >
                <CreditCard size={16} /> Collect Monthly Fee
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
