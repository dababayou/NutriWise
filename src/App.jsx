import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Kalkulator from './components/Kalkulator';
import MitosFakta from './components/MitosFakta';
import Challenge30Days from './components/Challenge30Days';
import PrivacyModal from './components/PrivacyModal';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';
import { supabase, isSupabaseConfigured } from './lib/supabase';

export default function App() {
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

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

  const handleLogout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setCurrentUser(null);
  };

  return (
    <div className="app">
      <Navbar 
        onOpenPrivacy={() => setPrivacyOpen(true)}
        onOpenAuth={() => setAuthOpen(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
      />
      
      <main>
        <Hero />
        <Kalkulator currentUser={currentUser} />
        <MitosFakta />
        <Challenge30Days currentUser={currentUser} onOpenAuth={() => setAuthOpen(true)} />
        
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
      
      <PrivacyModal 
        isOpen={privacyOpen} 
        onClose={() => setPrivacyOpen(false)} 
      />

      <AuthModal 
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onAuthSuccess={(user) => setCurrentUser(user)}
        currentUser={currentUser}
      />
    </div>
  );
}
