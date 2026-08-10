import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';

export default function Footer({ onOpenPrivacy }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px' }}>
          <div>
            <h3 className="footer-brand">NutriWise</h3>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'rgba(255, 255, 255, 0.7)', maxWidth: '480px' }}>
              Inovasi Web Kesehatan &amp; Nutrisi Berbasis Sains untuk mendukung kebiasaan hidup sehat, pencegahan risiko kesehatan, dan edukasi nutrisi terukur.
            </p>
          </div>

          <div>
            <h4 style={{ color: '#FFFFFF', marginBottom: '16px', fontSize: '1.05rem' }}>Fitur Utama</h4>
            <ul style={{ 
              listStyle: 'none', 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '12px 28px', 
              fontSize: '0.9rem', 
              padding: 0,
              margin: 0
            }}>
              <li><a href="#kalkulator" style={{ color: 'inherit', textDecoration: 'none' }}>Kalkulator BMI &amp; Kalori</a></li>
              <li><a href="#kalkulator" style={{ color: 'inherit', textDecoration: 'none' }}>Kebutuhan Air Harian</a></li>
              <li><a href="#mitos-fakta" style={{ color: 'inherit', textDecoration: 'none' }}>Mitos vs Fakta Nutrisi</a></li>
              <li><a href="#kuis-skrining" style={{ color: 'inherit', textDecoration: 'none' }}>Kuis Skrining Mandiri PTM</a></li>
              <li><a href="#challenge" style={{ color: 'inherit', textDecoration: 'none' }}>30-Day Challenge Tracker</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', paddingTop: '24px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap', fontSize: '0.9rem' }}>
            <span>&copy; {new Date().getFullYear()} NutriWise. Dibuat dengan</span>
            <Heart size={15} color="#FF6B6B" fill="#FF6B6B" style={{ display: 'inline-block', verticalAlign: 'middle', margin: '0 2px' }} />
            <span>untuk gaya hidup sehat Indonesia.</span>
          </div>
          <div>
            <button 
              onClick={onOpenPrivacy} 
              style={{ background: 'none', border: 'none', color: '#C7DC5B', cursor: 'pointer', fontSize: '0.88rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <ShieldCheck size={16} /> Kebijakan Privasi &amp; Keamanan Data
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
