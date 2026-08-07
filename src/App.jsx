import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Kalkulator from './components/Kalkulator';
import MitosFakta from './components/MitosFakta';
import Challenge30Days from './components/Challenge30Days';
import PrivacyModal from './components/PrivacyModal';
import ProfileModal from './components/ProfileModal';
import AuthPage from './components/AuthPage';
import DashboardLayout from './components/DashboardLayout';
import Footer from './components/Footer';
import { supabase, isSupabaseConfigured } from './lib/supabase';

export default function App() {
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
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

  const handleLogout = async () => {
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
          <img src="/dino_logo.png" alt="NutriWise" style={{ width: '56px', height: '56px' }} />
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
          onLogout={handleLogout}
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
            onLogout={handleLogout}
            onNavigateHome={handleBackHome}
          />

          <main>
            <Hero />
            <Kalkulator currentUser={currentUser} />
            <MitosFakta />
            <Challenge30Days currentUser={currentUser} onOpenAuth={() => handleOpenAuth('login')} />
            
            {/* SDG 3 Impact Highlight Card */}
            <section className="container" style={{ margin: '60px auto' }}>
              <div className="privacy-banner">
                <div className="privacy-info">
                  <h3>SDG Subtema 2: Kehidupan Sehat dan Sejahtera</h3>
                  <p>
                    NutriWise menghadirkan solusi teknologi digital yang terukur untuk pencegahan masalah nutrisi, obesitas, dan krisis dehidrasi. Kami memberdayakan masyarakat dengan pengetahuan yang valid dan pelacakan kebiasaan sehat berbasis data.
                  </p>
                </div>
                <button 
                  className="btn-cta-outline" 
                  style={{ borderColor: '#C7DC5B', color: '#C7DC5B' }}
                  onClick={() => setPrivacyOpen(true)}
                >
                  Lihat Standar Privasi Data
                </button>
              </div>
            </section>
          </main>

          <Footer onOpenPrivacy={() => setPrivacyOpen(true)} />
        </>
      )}

      <PrivacyModal 
        isOpen={privacyOpen} 
        onClose={() => setPrivacyOpen(false)} 
      />

      <ProfileModal
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        currentUser={currentUser}
        onUpdateUser={(updatedUser) => setCurrentUser(updatedUser)}
        onAccountDeleted={handleLogout}
      />
    </div>
  );
}
