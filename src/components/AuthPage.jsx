import React, { useState } from 'react';
import { ArrowLeft, Mail, Lock, User, ShieldCheck, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export default function AuthPage({ initialMode = 'login', onBackHome, onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (!isSupabaseConfigured) {
        // Mock fallback mode if Supabase keys are not set
        setTimeout(() => {
          const mockUser = {
            id: 'demo-user-123',
            email: email || 'demo@nutriwise.id',
            user_metadata: { 
              full_name: fullName || email.split('@')[0] || 'Pengguna NutriWise',
              nutriwise_days: [],
              nutriwise_today_habits: {}
            }
          };
          setSuccessMsg('Berhasil masuk mode demo!');
          onAuthSuccess(mockUser);
          setLoading(false);
          setTimeout(() => onBackHome(), 700);
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
        setSuccessMsg('Berhasil masuk! Mengalihkan ke beranda...');
        onAuthSuccess(data.user);
        setTimeout(() => onBackHome(), 800);
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

        // Auto-login user immediately without requiring email verification
        let userToAuth = data.user;
        if (!data.session) {
          const { data: signInData } = await supabase.auth.signInWithPassword({
            email,
            password
          });
          if (signInData?.user) {
            userToAuth = signInData.user;
          }
        }

        setSuccessMsg('Pendaftaran berhasil! Mengalihkan...');
        if (userToAuth) {
          onAuthSuccess(userToAuth);
          setTimeout(() => onBackHome(), 800);
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'Terjadi kesalahan saat otentikasi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-page-container">
        {/* Top Header Navigation */}
        <div className="auth-header-bar">
          <button onClick={onBackHome} className="btn-back-home">
            <ArrowLeft size={18} /> Kembali ke Beranda
          </button>
        </div>

        {/* Main Split Card matching login.jpeg / reg.jpeg design */}
        <div className={`auth-split-card ${isLogin ? 'mode-login' : 'mode-register'}`}>
          {/* Sign In Form (Left on Login mode) / Sign Up Form (Right on Register mode) */}
          {isLogin ? (
            /* ================= LOGIN FORM SIDE (LEFT) ================= */
            <div className="auth-form-side">
              <h1 className="auth-form-title">Masuk</h1>
              <p className="auth-form-subtitle">Gunakan akun NutriWise Anda</p>

              {!isSupabaseConfigured && (
                <div className="auth-alert alert-demo">
                  <AlertCircle size={16} />
                  <span>Mode Demo: Masukkan email &amp; kata sandi bebas untuk uji coba.</span>
                </div>
              )}

              {errorMsg && (
                <div className="auth-alert alert-error">
                  <AlertCircle size={16} />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="auth-alert alert-success">
                  <CheckCircle size={16} />
                  <span>{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="auth-form-element">
                <div className="auth-input-group">
                  <input
                    type="email"
                    className="auth-pill-input"
                    placeholder="Alamat Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="auth-input-group">
                  <input
                    type="password"
                    className="auth-pill-input"
                    placeholder="Kata Sandi"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>

                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Silakan hubungi admin atau gunakan email pemulihan.'); }} className="auth-forgot-link">
                  Lupa kata sandi Anda?
                </a>

                <button type="submit" className="btn-auth-primary" disabled={loading}>
                  {loading ? 'MEMPROSES...' : 'MASUK'}
                </button>
              </form>
            </div>
          ) : (
            /* ================= REGISTER BANNER SIDE (LEFT) ================= */
            <div className="auth-banner-side banner-left-curve">
              <div className="banner-content">
                <h2 className="banner-title">Selamat Datang Kembali!</h2>
                <p className="banner-text">
                  Masukkan data akun Anda untuk kembali mengakses fitur &amp; 30-Day Challenge
                </p>
                <button 
                  type="button"
                  onClick={() => { setIsLogin(true); setErrorMsg(''); setSuccessMsg(''); }}
                  className="btn-auth-outline"
                >
                  MASUK
                </button>
              </div>
            </div>
          )}

          {/* Right Panel: Banner on Login mode / Register Form on Register mode */}
          {isLogin ? (
            /* ================= LOGIN BANNER SIDE (RIGHT) ================= */
            <div className="auth-banner-side banner-right-curve">
              <div className="banner-content">
                <h2 className="banner-title">Halo, Sahabat NutriWise!</h2>
                <p className="banner-text">
                  Daftar dengan data diri Anda untuk menggunakan seluruh fitur pelacak nutrisi &amp; kesehatan
                </p>
                <button 
                  type="button"
                  onClick={() => { setIsLogin(false); setErrorMsg(''); setSuccessMsg(''); }}
                  className="btn-auth-outline"
                >
                  DAFTAR
                </button>
              </div>
            </div>
          ) : (
            /* ================= REGISTER FORM SIDE (RIGHT) ================= */
            <div className="auth-form-side">
              <h1 className="auth-form-title">Buat Akun</h1>
              <p className="auth-form-subtitle">Gunakan email Anda untuk pendaftaran</p>

              {!isSupabaseConfigured && (
                <div className="auth-alert alert-demo">
                  <AlertCircle size={16} />
                  <span>Mode Demo: Masukkan data diri bebas untuk uji coba pendaftaran.</span>
                </div>
              )}

              {errorMsg && (
                <div className="auth-alert alert-error">
                  <AlertCircle size={16} />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="auth-alert alert-success">
                  <CheckCircle size={16} />
                  <span>{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="auth-form-element">
                <div className="auth-input-group">
                  <input
                    type="text"
                    className="auth-pill-input"
                    placeholder="Nama Lengkap"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>

                <div className="auth-input-group">
                  <input
                    type="email"
                    className="auth-pill-input"
                    placeholder="Alamat Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="auth-input-group">
                  <input
                    type="password"
                    className="auth-pill-input"
                    placeholder="Kata Sandi"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>

                <button type="submit" className="btn-auth-primary" disabled={loading} style={{ marginTop: '16px' }}>
                  {loading ? 'MEMPROSES...' : 'DAFTAR'}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Security Footer Note */}
        <div className="auth-footer-security">
          <ShieldCheck size={16} color="#2F6323" />
          <span>Keamanan Data Terjamin dengan Supabase Auth &amp; Encryption Standard (SDG 3 Data Privacy)</span>
        </div>
      </div>
    </div>
  );
}
