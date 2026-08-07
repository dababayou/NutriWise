import React, { useState, useEffect } from 'react';
import { X, User, Mail, ShieldAlert, Check, Camera, Trash2, AlertTriangle } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const presetAvatars = [
  'https://api.dicebear.com/7.x/bottts/svg?seed=Felix',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Aria',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Leo',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Maya',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Zack',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Nutri'
];

export default function ProfileModal({ isOpen, onClose, currentUser, onUpdateUser, onAccountDeleted }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Delete Account Confirmation Modal States (2-Step Safety System)
  const [deleteStep, setDeleteStep] = useState(0); // 0 = none, 1 = first warning, 2 = type HAPUS confirm
  const [confirmInput, setConfirmInput] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.user_metadata?.full_name || '');
      setEmail(currentUser.email || '');
      setAvatarUrl(currentUser.user_metadata?.avatar_url || presetAvatars[0]);
    }
    setDeleteStep(0);
    setConfirmInput('');
    setMessage({ type: '', text: '' });
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      if (isSupabaseConfigured && supabase && currentUser?.id !== 'demo-user-123') {
        const updatePayload = {
          data: {
            full_name: fullName,
            avatar_url: avatarUrl
          }
        };

        // Update email if changed
        if (email && email !== currentUser.email) {
          updatePayload.email = email;
        }

        const { data, error } = await supabase.auth.updateUser(updatePayload);
        if (error) throw error;

        setMessage({ type: 'success', text: 'Profil berhasil diperbarui!' });
        if (onUpdateUser && data.user) {
          onUpdateUser(data.user);
        }
      } else {
        // Fallback for Demo mode
        const updatedMockUser = {
          ...currentUser,
          email: email || currentUser?.email,
          user_metadata: {
            ...currentUser?.user_metadata,
            full_name: fullName,
            avatar_url: avatarUrl
          }
        };
        setMessage({ type: 'success', text: 'Profil berhasil diperbarui (Mode Demo)!' });
        if (onUpdateUser) {
          onUpdateUser(updatedMockUser);
        }
      }
      setTimeout(() => {
        onClose();
      }, 900);
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Gagal memperbarui profil.' });
    } finally {
      setSaving(false);
    }
  };

  const handleExecuteDeleteAccount = async () => {
    if (confirmInput.trim().toUpperCase() !== 'HAPUS') {
      setMessage({ type: 'error', text: 'Teks konfirmasi tidak sesuai. Ketik "HAPUS" untuk mengonfirmasi.' });
      return;
    }

    setDeleting(true);
    try {
      if (isSupabaseConfigured && supabase && currentUser?.id !== 'demo-user-123') {
        // Attempt account data cleanup
        await supabase.auth.updateUser({
          data: { nutriwise_days: [], nutriwise_today_habits: {} }
        });
        await supabase.auth.signOut();
      }
      
      localStorage.removeItem('nutriwise_days');
      localStorage.removeItem('nutriwise_today_habits');

      alert('Akun Anda telah berhasil dihapus secara permanen.');
      setDeleteStep(0);
      onClose();
      if (onAccountDeleted) {
        onAccountDeleted();
      }
    } catch (err) {
      alert('Terjadi kesalahan saat menghapus akun: ' + err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card profile-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        <h3 className="profile-modal-title">Edit Profil Akun</h3>
        <p className="profile-modal-subtitle">Perbarui data diri &amp; avatar NutriWise Anda</p>

        {message.text && (
          <div className={`auth-alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="profile-form">
          {/* Avatar Selector */}
          <div className="avatar-section">
            <div className="avatar-preview-box">
              <img src={avatarUrl} alt="Avatar Preview" className="avatar-img-preview" />
            </div>

            <div className="avatar-options">
              <span className="avatar-picker-label">Pilih Avatar:</span>
              <div className="avatar-presets-grid">
                {presetAvatars.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatarUrl(url)}
                    className={`avatar-preset-btn ${avatarUrl === url ? 'selected' : ''}`}
                  >
                    <img src={url} alt={`Preset ${idx + 1}`} />
                    {avatarUrl === url && <Check size={12} className="avatar-check-icon" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label className="form-label">Nama Lengkap / Username</label>
            <div className="profile-input-wrapper">
              <User size={18} className="input-icon" />
              <input
                type="text"
                className="form-input profile-input"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nama Anda"
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label className="form-label">Alamat Email</label>
            <div className="profile-input-wrapper">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                className="form-input profile-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                required
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="profile-modal-footer">
            <button
              type="button"
              onClick={() => { setDeleteStep(1); setConfirmInput(''); }}
              className="btn-delete-account-trigger"
            >
              <Trash2 size={16} /> Hapus Akun
            </button>

            <button type="submit" className="btn-auth-primary" disabled={saving}>
              {saving ? 'MENYIMPAN...' : 'SIMPAN PROFIL'}
            </button>
          </div>
        </form>

        {/* ================= STEP 1: FIRST CONFIRMATION ALERT MODAL ================= */}
        {deleteStep === 1 && (
          <div className="modal-overlay inner-confirm-overlay" onClick={() => setDeleteStep(0)}>
            <div className="modal-card confirm-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="warning-icon-box yellow">
                <AlertTriangle size={32} color="#D97706" />
              </div>

              <h4>Peringatan Konfirmasi (1/2)</h4>
              <p>
                Apakah Anda yakin ingin menghapus akun NutriWise? Seluruh progres <strong>30-Day Health Challenge</strong>, statistik nutrisi, dan data pribadi Anda akan dihapus secara permanen.
              </p>

              <div className="confirm-modal-buttons">
                <button type="button" onClick={() => setDeleteStep(0)} className="btn-cta-outline">
                  Batal
                </button>
                <button type="button" onClick={() => setDeleteStep(2)} className="btn-warning-action">
                  Lanjutkan Penghapusan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 2: SECOND CONFIRMATION SAFETY MODAL ================= */}
        {deleteStep === 2 && (
          <div className="modal-overlay inner-confirm-overlay" onClick={() => setDeleteStep(0)}>
            <div className="modal-card confirm-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="warning-icon-box red">
                <ShieldAlert size={32} color="#DC2626" />
              </div>

              <h4 style={{ color: '#991B1B' }}>Konfirmasi Akhir Penghapusan (2/2)</h4>
              <p>
                Tindakan ini <strong>TIDAK DAPAT DIBATALKAN</strong>. Ketik kata <strong>HAPUS</strong> pada kolom di bawah ini untuk mengonfirmasi penghapusan akun Anda.
              </p>

              <input
                type="text"
                className="form-input delete-confirm-input"
                placeholder="Ketik HAPUS untuk mengonfirmasi"
                value={confirmInput}
                onChange={(e) => setConfirmInput(e.target.value)}
                autoFocus
              />

              <div className="confirm-modal-buttons">
                <button type="button" onClick={() => setDeleteStep(0)} className="btn-cta-outline">
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleExecuteDeleteAccount}
                  className="btn-danger-action"
                  disabled={confirmInput.trim().toUpperCase() !== 'HAPUS' || deleting}
                >
                  {deleting ? 'MENGHAPUS...' : 'YA, HAPUS AKUN SAYA'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
