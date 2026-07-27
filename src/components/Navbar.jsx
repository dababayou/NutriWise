import React, { useState, useEffect } from 'react';
import { Menu, X, ShieldCheck } from 'lucide-react';

export default function Navbar({ onOpenPrivacy }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

        <a href="#challenge" className="btn-cta-outline">
          Mulai Challenge
        </a>

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
