import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Kalkulator from './components/Kalkulator';
import MitosFakta from './components/MitosFakta';
import Challenge30Days from './components/Challenge30Days';
import PrivacyModal from './components/PrivacyModal';
import AuthPage from './components/AuthPage';
import DashboardLayout from './components/DashboardLayout';
import Footer from './components/Footer';
import { supabase, isSupabaseConfigured } from './lib/supabase';

export default function App() {
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'auth'
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [currentUser, setCurrentUser] = useState(null);

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
    // Sync Supabase Auth Session on mount
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setCurrentUser(session.user);
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setCurrentUser(session?.user ?? null);
      });

      return () => subscription.unsubscribe();
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
    setCurrentUser(null);
  };

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
    </div>
  );
}
