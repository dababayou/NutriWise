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
            user_metadata: { full_name: fullName || email.split('@')[0] || 'Pengguna NutriWise' }
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
        setSuccessMsg('Pendaftaran berhasil! Mengalihkan ke beranda...');
        if (data.user) {
          onAuthSuccess(data.user);
          setTimeout(() => onBackHome(), 1000);
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
              <h1 className="auth-form-title">Sign in</h1>
              <p className="auth-form-subtitle">gunakan akun NutriWise Anda</p>

              {!isSupabaseConfigured && (
                <div className="auth-alert alert-demo">
                  <AlertCircle size={16} />
                  <span>Mode Demo: Masukkan email & password bebas untuk uji coba.</span>
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
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="auth-input-group">
                  <input
                    type="password"
                    className="auth-pill-input"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>

                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Silakan hubungi admin atau gunakan email pemulihan.'); }} className="auth-forgot-link">
                  Forgot your password?
                </a>

                <button type="submit" className="btn-auth-primary" disabled={loading}>
                  {loading ? 'MEMPROSES...' : 'SIGN IN'}
                </button>
              </form>
            </div>
          ) : (
            /* ================= REGISTER BANNER SIDE (LEFT) ================= */
            <div className="auth-banner-side banner-left-curve">
              <div className="banner-content">
                <h2 className="banner-title">Welcome Back!</h2>
                <p className="banner-text">
                  Enter your personal details to use all of site features
                </p>
                <button 
                  type="button"
                  onClick={() => { setIsLogin(true); setErrorMsg(''); setSuccessMsg(''); }}
                  className="btn-auth-outline"
                >
                  SIGN IN
                </button>
              </div>
            </div>
          )}

          {/* Right Panel: Banner on Login mode / Register Form on Register mode */}
          {isLogin ? (
            /* ================= LOGIN BANNER SIDE (RIGHT) ================= */
            <div className="auth-banner-side banner-right-curve">
              <div className="banner-content">
                <h2 className="banner-title">Hello, Friend!</h2>
                <p className="banner-text">
                  Register with your personal details to use all of site features
                </p>
                <button 
                  type="button"
                  onClick={() => { setIsLogin(false); setErrorMsg(''); setSuccessMsg(''); }}
                  className="btn-auth-outline"
                >
                  SIGN UP
                </button>
              </div>
            </div>
          ) : (
            /* ================= REGISTER FORM SIDE (RIGHT) ================= */
            <div className="auth-form-side">
              <h1 className="auth-form-title">Create Account</h1>
              <p className="auth-form-subtitle">use your email for registration</p>

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
                    placeholder="Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>

                <div className="auth-input-group">
                  <input
                    type="email"
                    className="auth-pill-input"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="auth-input-group">
                  <input
                    type="password"
                    className="auth-pill-input"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>

                <button type="submit" className="btn-auth-primary" disabled={loading} style={{ marginTop: '16px' }}>
                  {loading ? 'MEMPROSES...' : 'SIGN UP'}
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
