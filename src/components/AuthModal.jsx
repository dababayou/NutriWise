import React, { useState } from 'react';
import { LogIn, UserPlus, X, Mail, Lock, User, ShieldCheck, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, currentUser }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (!isSupabaseConfigured) {
        // Mock fallback mode if Supabase keys are not set yet
        setTimeout(() => {
          const mockUser = {
            id: 'demo-user-123',
            email: email || 'demo@nutriwise.id',
            user_metadata: { full_name: fullName || email.split('@')[0] || 'Pengguna NutriWise' }
          };
          onAuthSuccess(mockUser);
          setLoading(false);
          onClose();
        }, 800);
        return;
      }

      if (isLogin) {
        // Supabase Login
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        setSuccessMsg('Berhasil masuk!');
        onAuthSuccess(data.user);
        setTimeout(() => onClose(), 600);
      } else {
        // Supabase Registration
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName }
          }
        });
        if (error) throw error;
        setSuccessMsg('Pendaftaran berhasil! Silakan periksa email Anda atau masuk.');
        if (data.user) {
          onAuthSuccess(data.user);
          setTimeout(() => onClose(), 1000);
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'Terjadi kesalahan saat otentikasi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ width: '56px', height: '56px', background: 'var(--color-cream)', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
            {isLogin ? <LogIn size={28} color="#2F6323" /> : <UserPlus size={28} color="#2F6323" />}
          </div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', fontWeight: 700 }}>
            {isLogin ? 'Masuk ke NutriWise' : 'Buat Akun NutriWise'}
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--color-muted)', marginTop: '4px' }}>
            {isLogin ? 'Akses laporan kesehatan & progres 30-Day Challenge Anda' : 'Mulai perjalanan gaya hidup sehat berkelanjutan'}
          </p>
        </div>

        {!isSupabaseConfigured && (
          <div style={{ background: '#FFFBEB', border: '1px solid #FCD34D', padding: '10px 14px', borderRadius: '8px', fontSize: '0.82rem', color: '#92400E', marginBottom: '16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <AlertCircle size={18} style={{ shrink: 0 }} />
            <span>Mode Demo Aktif: Masukkan email & password sembarang untuk mencoba login demo.</span>
          </div>
        )}

        {errorMsg && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px' }}>
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div style={{ background: '#ECFDF5', border: '1px solid #6EE7B7', color: '#065F46', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={18} />
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Nama Lengkap</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '42px' }}
                  placeholder="Nama Anda"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Alamat Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input
                type="email"
                className="form-input"
                style={{ paddingLeft: '42px' }}
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Kata Sandi</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input
                type="password"
                className="form-input"
                style={{ paddingLeft: '42px' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-hero-more"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', marginTop: '12px', padding: '12px' }}
          >
            {loading ? 'Memproses...' : (isLogin ? 'Masuk Akun' : 'Daftar Sekarang')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem', borderTop: '1px solid #E2E8F0', paddingTop: '16px' }}>
          {isLogin ? (
            <span>
              Belum punya akun?{' '}
              <button 
                onClick={() => { setIsLogin(false); setErrorMsg(''); }}
                style={{ background: 'none', border: 'none', color: 'var(--color-forest)', fontWeight: 700, cursor: 'pointer' }}
              >
                Daftar Gratis
              </button>
            </span>
          ) : (
            <span>
              Sudah memiliki akun?{' '}
              <button 
                onClick={() => { setIsLogin(true); setErrorMsg(''); }}
                style={{ background: 'none', border: 'none', color: 'var(--color-forest)', fontWeight: 700, cursor: 'pointer' }}
              >
                Masuk di sini
              </button>
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.78rem', color: '#94A3B8', marginTop: '16px' }}>
          <ShieldCheck size={14} color="#558949" />
          Dilindungi oleh Supabase Auth & Row Level Security (RLS)
        </div>
      </div>
    </div>
  );
}
