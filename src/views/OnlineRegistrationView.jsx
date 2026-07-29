import React, { useState, useEffect } from 'react';
import {
  Globe,
  UserPlus,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Phone,
  Mail,
  Dumbbell,
  Check,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { registrationService } from '../services/registrationService';
import { MEMBERSHIP_PLANS, GYM_INFO } from '../constants/plansData';

export default function OnlineRegistrationView({ isAdminView = false, onApproveSuccess }) {
  const [registrations, setRegistrations] = useState([]);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    applicantName: '',
    phone: '',
    email: '',
    address: '',
    preferredPlanId: MEMBERSHIP_PLANS[0].id,
    requestedStartDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    if (isAdminView) {
      loadRegistrations();
    }
  }, [isAdminView]);

  const loadRegistrations = async () => {
    try {
      const data = await registrationService.getRegistrations();
      setRegistrations(data);
    } catch (err) {
      console.error('Error loading registrations:', err);
    }
  };

  const handlePublicSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registrationService.submitRegistration(formData);
      setSubmittedSuccess(true);
      setFormData({
        applicantName: '',
        phone: '',
        email: '',
        address: '',
        preferredPlanId: MEMBERSHIP_PLANS[0].id,
        requestedStartDate: new Date().toISOString().split('T')[0],
        notes: ''
      });
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const result = await registrationService.approveRegistration(id);
      alert(`APPROVED! ${result.member.name} has been onboarded into Fitness Lover Gym with ID: ${result.member.id}.`);
      loadRegistrations();
      if (onApproveSuccess) onApproveSuccess();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleReject = async (id) => {
    if (window.confirm('Reject this registration application?')) {
      await registrationService.rejectRegistration(id);
      loadRegistrations();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

      {/* Admin Mode Header / View Toggle */}
      {isAdminView ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '800' }}>Online Applicant Applications</h2>
            <span style={{ fontSize: '13px', color: '#94a3b8' }}>Review & approve new prospect registrations from the website portal</span>
          </div>
          <span className="badge badge-info" style={{ fontSize: '13px', padding: '6px 12px' }}>
            <Zap size={14} /> Admin Approval Workflow
          </span>
        </div>
      ) : (
        /* Public Hero Header */
        <div className="glass-card" style={{
          background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.2) 0%, rgba(17, 24, 39, 0.95) 70%)',
          border: '1px solid rgba(249, 115, 22, 0.4)',
          textAlign: 'center',
          padding: '40px 24px'
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
            boxShadow: '0 0 25px rgba(249, 115, 22, 0.5)'
          }}>
            <Dumbbell size={32} color="#ffffff" />
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#ffffff' }}>
            Join {GYM_INFO.name} Today!
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '16px', marginTop: '8px', maxWidth: '600px', margin: '8px auto 0 auto' }}>
            Fill out your membership details online and get instant access to premier weight training, cardio zone, and personal training.
          </p>
        </div>
      )}

      {/* Admin Applications Roster */}
      {isAdminView && (
        <div className="glass-card">
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Applicant Details</th>
                  <th>Chosen Plan</th>
                  <th>Requested Start</th>
                  <th>Submission Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Admin Action</th>
                </tr>
              </thead>
              <tbody>
                {registrations.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>
                      No online applicant registrations found.
                    </td>
                  </tr>
                ) : (
                  registrations.map((reg) => (
                    <tr key={reg.id}>
                      <td>
                        <strong style={{ color: '#ffffff', fontSize: '15px' }}>{reg.applicantName}</strong>
                        <div style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Phone size={11} /> {reg.phone} {reg.email && `| ${reg.email}`}
                        </div>
                        {reg.address && <div style={{ fontSize: '11px', color: '#64748b' }}>{reg.address}</div>}
                      </td>

                      <td>
                        <div style={{ fontWeight: '700', color: '#f97316' }}>{reg.preferredPlanName}</div>
                        <div style={{ fontSize: '12px', color: '#34d399' }}>Rs {reg.monthlyFee} / month</div>
                      </td>

                      <td>
                        <span style={{ fontSize: '13px', color: '#cbd5e1' }}>{reg.requestedStartDate}</span>
                      </td>

                      <td>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>{reg.submittedAt}</span>
                      </td>

                      <td>
                        <span className={`badge badge-${reg.status.toLowerCase()}`}>
                          {reg.status}
                        </span>
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        {reg.status === 'Pending' ? (
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <button
                              onClick={() => handleApprove(reg.id)}
                              className="btn btn-success btn-sm"
                            >
                              <CheckCircle2 size={14} /> Approve & Onboard
                            </button>
                            <button
                              onClick={() => handleReject(reg.id)}
                              className="btn btn-danger btn-sm"
                            >
                              <XCircle size={14} />
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '12px', color: '#64748b' }}>Processed</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Online Member Registration Form (Public View or Test Mode) */}
      {(!isAdminView || registrations.length === 0) && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: '24px' }}>
          
          {/* Registration Form */}
          <div className="glass-card">
            <h3 style={{ fontSize: '20px', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserPlus size={20} color="#f97316" /> Online Registration Application
            </h3>
            <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '20px' }}>
              Fill in your details below to register your membership at Fitness Lover Gym.
            </p>

            {submittedSuccess ? (
              <div style={{
                padding: '32px 24px',
                textAlign: 'center',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid #10b981',
                borderRadius: '12px',
                color: '#ffffff'
              }}>
                <CheckCircle2 size={48} color="#34d399" style={{ marginBottom: '12px' }} />
                <h4 style={{ fontSize: '20px', fontWeight: '800', color: '#34d399' }}>Registration Submitted Successfully!</h4>
                <p style={{ fontSize: '14px', color: '#cbd5e1', marginTop: '8px' }}>
                  Thank you! Your application has been received. Our gym admin will review your profile and activate your membership shortly.
                </p>
                <button
                  onClick={() => setSubmittedSuccess(false)}
                  className="btn btn-primary"
                  style={{ marginTop: '20px' }}
                >
                  Submit Another Application
                </button>
              </div>
            ) : (
              <form onSubmit={handlePublicSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Siddharth Rao"
                      value={formData.applicantName}
                      onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
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
                      placeholder="siddharth@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label className="form-label">Residential Address</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="House No, Sector / Colony, City"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>

                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label className="form-label">Choose Membership Plan *</label>
                    <select
                      className="form-select"
                      value={formData.preferredPlanId}
                      onChange={(e) => setFormData({ ...formData, preferredPlanId: e.target.value })}
                    >
                      {MEMBERSHIP_PLANS.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} — Rs {p.price} / month ({p.billingCycle})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Requested Start Date</label>
                    <input
                      type="date"
                      className="form-input"
                      value={formData.requestedStartDate}
                      onChange={(e) => setFormData({ ...formData, requestedStartDate: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Special Notes / Slot Preference</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Morning 7am-8am slot preferred"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />
                  </div>

                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: '16px', height: '44px', fontSize: '15px' }}
                >
                  {loading ? 'Submitting Application...' : 'Submit Online Registration'}
                </button>
              </form>
            )}
          </div>

          {/* Pricing Plans Summary Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {MEMBERSHIP_PLANS.map((plan) => (
              <div key={plan.id} className="glass-card" style={{ borderLeft: `4px solid ${plan.accentColor}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '800' }}>{plan.name}</h4>
                  <span style={{ fontSize: '18px', fontWeight: '900', color: plan.accentColor }}>
                    Rs {plan.price}
                  </span>
                </div>
                <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {plan.features.map((feat, idx) => (
                    <div key={idx} style={{ fontSize: '12px', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Check size={13} color={plan.accentColor} /> {feat}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}
