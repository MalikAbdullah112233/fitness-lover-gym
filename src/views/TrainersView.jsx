import React, { useState, useEffect } from 'react';
import {
  Dumbbell,
  Plus,
  Phone,
  Mail,
  Award,
  Clock,
  Star,
  Users,
  Edit,
  Trash2
} from 'lucide-react';
import { trainersService } from '../services/trainersService';

export default function TrainersView() {
  const [trainers, setTrainers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    specialty: 'Bodybuilding & Heavy Weightlifting',
    experience: '3 Years',
    shift: 'Morning (6:00 AM - 12:00 PM)'
  });

  useEffect(() => {
    loadTrainers();
  }, []);

  const loadTrainers = async () => {
    setLoading(true);
    try {
      const data = await trainersService.getTrainers();
      setTrainers(data);
    } catch (err) {
      console.error('Error fetching trainers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingTrainer(null);
    setFormData({
      name: '',
      phone: '',
      email: '',
      specialty: 'Bodybuilding & Heavy Weightlifting',
      experience: '3 Years',
      shift: 'Morning (6:00 AM - 12:00 PM)'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t) => {
    setEditingTrainer(t);
    setFormData({
      name: t.name,
      phone: t.phone,
      email: t.email || '',
      specialty: t.specialty,
      experience: t.experience,
      shift: t.shift
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTrainer) {
        await trainersService.updateTrainer(editingTrainer.id, formData);
      } else {
        await trainersService.addTrainer(formData);
      }
      setIsModalOpen(false);
      loadTrainers();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete trainer profile for ${name}?`)) {
      await trainersService.deleteTrainer(id);
      loadTrainers();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '800' }}>Trainer & Instructor Management</h2>
          <span style={{ fontSize: '13px', color: '#94a3b8' }}>Certified personal trainers & floor instructors</span>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-primary">
          <Plus size={18} /> Register New Trainer
        </button>
      </div>

      {/* Trainers Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '20px'
      }}>
        {trainers.map((t) => (
          <div key={t.id} className="glass-card glass-card-interactive" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              
              {/* Top Avatar & Name */}
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '16px' }}>
                <img
                  src={t.avatar}
                  alt={t.name}
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '16px',
                    objectFit: 'cover',
                    border: '2px solid #f97316'
                  }}
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
                  }}
                />
                <div>
                  <h3 style={{ fontSize: '18px', color: '#ffffff' }}>{t.name}</h3>
                  <div style={{ fontSize: '12px', color: '#f97316', fontWeight: '700' }}>{t.id}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px', fontSize: '12px', color: '#fbbf24' }}>
                    <Star size={14} fill="#fbbf24" color="#fbbf24" />
                    <strong>{t.rating} / 5.0 Rating</strong>
                  </div>
                </div>
              </div>

              {/* Specialty & Shift Info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', backgroundColor: 'rgba(15, 23, 42, 0.6)', padding: '12px', borderRadius: '10px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1' }}>
                  <Award size={15} color="#f97316" />
                  <span><strong>Specialty:</strong> {t.specialty}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1' }}>
                  <Clock size={15} color="#3b82f6" />
                  <span><strong>Shift:</strong> {t.shift}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1' }}>
                  <Users size={15} color="#10b981" />
                  <span><strong>Active Trainees:</strong> {t.assignedClientsCount} Assigned</span>
                </div>
              </div>

              {/* Contact Info */}
              <div style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Phone size={13} /> {t.phone}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mail size={13} /> {t.email || 'N/A'}
                </div>
              </div>

            </div>

            {/* Actions Bar */}
            <div style={{
              display: 'flex',
              gap: '10px',
              marginTop: '20px',
              paddingTop: '12px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <button
                onClick={() => handleOpenEdit(t)}
                className="btn btn-secondary btn-sm"
                style={{ flex: 1 }}
              >
                <Edit size={14} /> Edit Profile
              </button>
              <button
                onClick={() => handleDelete(t.id, t.name)}
                className="btn btn-danger btn-sm"
                style={{ padding: '6px 10px' }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Trainer Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '18px' }}>
                {editingTrainer ? `Edit Trainer: ${editingTrainer.name}` : 'Register New Fitness Trainer'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="btn btn-secondary btn-sm">✕</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Trainer Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Vikram Sharma"
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
                    placeholder="trainer@fitnesslovergym.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Specialty / Qualification</label>
                  <select
                    className="form-select"
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  >
                    <option value="Bodybuilding & Heavy Weightlifting">Bodybuilding & Heavy Weightlifting</option>
                    <option value="Cardio, HIIT & Weight Loss Specialist">Cardio, HIIT & Weight Loss Specialist</option>
                    <option value="Certified Clinical Dietitian & Personal Trainer">Certified Clinical Dietitian & Personal Trainer</option>
                    <option value="Crossfit & Strength Conditioning">Crossfit & Strength Conditioning</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Shift Timing</label>
                  <select
                    className="form-select"
                    value={formData.shift}
                    onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                  >
                    <option value="Morning (6:00 AM - 12:00 PM)">Morning (6:00 AM - 12:00 PM)</option>
                    <option value="Evening (4:00 PM - 10:00 PM)">Evening (4:00 PM - 10:00 PM)</option>
                    <option value="Full Day (Flexi)">Full Day (Flexi)</option>
                  </select>
                </div>

              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingTrainer ? 'Save Changes' : 'Register Trainer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
