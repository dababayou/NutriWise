import React, { useState, useEffect } from 'react';
import { Menu, X, ShieldCheck, User, LogOut } from 'lucide-react';

export default function Navbar({ onOpenPrivacy, onOpenAuth, currentUser, onLogout }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const displayName = currentUser?.user_metadata?.full_name || currentUser?.email?.split('@')[0] || 'Pengguna';

  return (
    <header className={`navbar-wrapper ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-inner">
        <a href="#" className="navbar-logo">
          <img src="/dino_logo.png" alt="NutriWise Logo" />
          <span>NutriWise</span>
        </a>

        <ul className={`navbar-menu ${mobileMenuOpen ? 'active' : ''}`}>
          <li>
            <a href="#kalkulator" onClick={() => setMobileMenuOpen(false)}>Kalkulator</a>
          </li>
          <li>
            <a href="#mitos-fakta" onClick={() => setMobileMenuOpen(false)}>Mitos vs Fakta</a>
          </li>
          <li>
            <a href="#challenge" onClick={() => setMobileMenuOpen(false)}>30-Day Challenge</a>
          </li>
          <li>
            <button 
              onClick={() => { setMobileMenuOpen(false); onOpenPrivacy(); }} 
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '1rem', fontWeight: 600, color: 'inherit', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <ShieldCheck size={18} color="#2F6323" /> Privasi & Data
            </button>
          </li>
        </ul>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <a href="#challenge" className="btn-cta-outline" style={{ padding: '8px 18px', fontSize: '0.88rem' }}>
                30-Day Challenge
              </a>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--color-cream)', padding: '6px 14px', borderRadius: '30px', fontSize: '0.9rem', fontWeight: 700, border: '1px solid rgba(47, 99, 35, 0.2)' }}>
                <User size={16} color="#2F6323" />
                <span>{displayName}</span>
              </div>
              <button 
                onClick={onLogout}
                title="Keluar"
                style={{ background: 'none', border: '1px solid #E2E8F0', padding: '8px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <LogOut size={16} color="#94A3B8" />
              </button>
            </div>
          ) : (
            <button 
              onClick={onOpenAuth} 
              className="btn-nav-combined"
              aria-label="Mulai Challenge / Masuk Daftar"
            >
              <span className="btn-text-default">Mulai Challenge</span>
              <span className="btn-text-hover">Masuk / Daftar</span>
            </button>
          )}
        </div>

        <button 
          className="mobile-toggle" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  );
}
