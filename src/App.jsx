import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Kalkulator from './components/Kalkulator';
import MitosFakta from './components/MitosFakta';
import Challenge30Days from './components/Challenge30Days';
import KuisTeaser from './components/KuisTeaser';
import PrivacyModal from './components/PrivacyModal';
import ProfileModal from './components/ProfileModal';
import AuthPage from './components/AuthPage';
import DashboardLayout from './components/DashboardLayout';
import Footer from './components/Footer';
import { LogOut, X } from 'lucide-react';
import { supabase, isSupabaseConfigured } from './lib/supabase';

export default function App() {
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showLogoutConfirmModal, setShowLogoutConfirmModal] = useState(false);
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'auth'
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    // Sync URL hash for page navigation (#auth, #login, #register)
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === '#auth' || hash === '#login') {
        setCurrentView('auth');
        setAuthMode('login');
      } else if (hash === '#register') {
        setCurrentView('auth');
        setAuthMode('register');
      } else {
        setCurrentView('home');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  useEffect(() => {
    // Sync Supabase Auth Session on mount without split-second landing page flash
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setCurrentUser(session.user);
        }
        setAuthLoading(false);
      }).catch(() => {
        setAuthLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setCurrentUser(session?.user ?? null);
        setAuthLoading(false);
      });

      return () => subscription.unsubscribe();
    } else {
      setAuthLoading(false);
    }
  }, []);

  const handleOpenAuth = (mode = 'login') => {
    setAuthMode(mode);
    setCurrentView('auth');
    window.location.hash = `#${mode}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackHome = () => {
    setCurrentView('home');
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const triggerLogoutConfirm = () => {
    setShowLogoutConfirmModal(true);
  };

  const handleConfirmLogout = async () => {
    setShowLogoutConfirmModal(false);
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('nutriwise_days');
    localStorage.removeItem('nutriwise_today_habits');
    localStorage.removeItem('nutriwise_active_tab');
    setCurrentUser(null);
  };

  if (authLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FAF9F6',
        color: '#2F6323'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <img src="/logo.png" alt="NutriWise" style={{ width: '56px', height: '56px' }} />
          <span style={{ fontWeight: 700, fontSize: '1rem', color: '#2F6323', fontFamily: 'var(--font-serif)' }}>Memuat NutriWise...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {/* 1. Auth Page View (Dedicated Full Window) */}
      {currentView === 'auth' ? (
        <AuthPage 
          initialMode={authMode}
          onBackHome={handleBackHome}
          onAuthSuccess={(user) => {
            setCurrentUser(user);
            handleBackHome();
          }}
        />
      ) : currentUser ? (
        /* 2. Logged-In User View (Sidebar Dashboard - 1 Feature Per Page, No Hero) */
        <DashboardLayout 
          currentUser={currentUser}
          onLogout={triggerLogoutConfirm}
          onOpenPrivacy={() => setPrivacyOpen(true)}
          onOpenProfile={() => setProfileOpen(true)}
        />
      ) : (
        /* 3. Public Guest View (Landing Page with Hero & Single Page Scrolling) */
        <>
          <Navbar 
            onOpenPrivacy={() => setPrivacyOpen(true)}
            onOpenAuth={() => handleOpenAuth('login')}
            currentUser={currentUser}
            onLogout={triggerLogoutConfirm}
            onNavigateHome={handleBackHome}
          />

          <main>
            <Hero />
            <Kalkulator currentUser={currentUser} />
            <MitosFakta />
            <KuisTeaser onOpenAuth={() => handleOpenAuth('login')} />
            <Challenge30Days currentUser={currentUser} onOpenAuth={() => handleOpenAuth('login')} />
          </main>

          <Footer onOpenPrivacy={() => setPrivacyOpen(true)} />
        </>
      )}

      {/* Privacy Policy Modal */}
      <PrivacyModal 
        isOpen={privacyOpen} 
        onClose={() => setPrivacyOpen(false)} 
      />

      {/* User Profile Modal */}
      <ProfileModal
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        currentUser={currentUser}
        onUpdateUser={(updatedUser) => setCurrentUser(updatedUser)}
        onAccountDeleted={handleConfirmLogout}
      />

      {/* Account Logout Reconfirmation Modal */}
      {showLogoutConfirmModal && (
        <div className="modal-overlay" onClick={() => setShowLogoutConfirmModal(false)}>
          <div className="modal-card" style={{ maxWidth: '440px', padding: '28px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <LogOut size={20} color="#DC2626" />
                </div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-dark)', fontFamily: 'var(--font-serif)' }}>
                  Keluar dari Akun NutriWise?
                </h3>
              </div>
              <button
                onClick={() => setShowLogoutConfirmModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.5, marginBottom: '24px', textAlign: 'left' }}>
              Apakah Anda yakin ingin keluar dari akun? Anda perlu masuk kembali untuk mengakses sinkronisasi progres 30-Day Challenge dan profil kesehatan Anda.
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowLogoutConfirmModal(false)}
                className="btn-cta-outline"
                style={{ padding: '8px 18px', fontSize: '0.88rem', height: '40px' }}
              >
                Batal
              </button>
              <button
                onClick={handleConfirmLogout}
                className="btn-danger-outline"
                style={{ padding: '8px 18px', fontSize: '0.88rem', height: '40px' }}
              >
                <LogOut size={16} style={{ marginRight: '6px', flexShrink: 0 }} /> Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
