import React from 'react';
import { ShieldCheck, Heart, Award } from 'lucide-react';

export default function Footer({ onOpenPrivacy }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <h3 className="footer-brand">NutriWise</h3>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'rgba(255, 255, 255, 0.7)' }}>
              Inovasi Web Kesehatan & Nutrisi Berbasis Sains untuk mendukung Sustainable Development Goals (SDG 3: Kehidupan Sehat dan Sejahtera).
            </p>
          </div>

          <div>
            <h4 style={{ color: '#FFFFFF', marginBottom: '16px', fontSize: '1.05rem' }}>Fitur Utama</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
              <li><a href="#kalkulator" style={{ color: 'inherit', textDecoration: 'none' }}>Kalkulator BMI & Kalori</a></li>
              <li><a href="#kalkulator" style={{ color: 'inherit', textDecoration: 'none' }}>Kebutuhan Air Harian</a></li>
              <li><a href="#mitos-fakta" style={{ color: 'inherit', textDecoration: 'none' }}>Mitos vs Fakta Nutrisi</a></li>
              <li><a href="#challenge" style={{ color: 'inherit', textDecoration: 'none' }}>30-Day Challenge Tracker</a></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#FFFFFF', marginBottom: '16px', fontSize: '1.05rem' }}>Kompetisi TIC 9.0</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', marginBottom: '8px' }}>
              <Award color="#C7DC5B" size={18} />
              <span>Technology Innovative Challenge 9.0</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.6)' }}>
              Diselenggarakan oleh Himpunan Mahasiswa Teknologi Informasi (HIMATIF) Universitas Jember.
            </p>
          </div>
        </div>

        <div className="footer-bottom" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            &copy; {new Date().getFullYear()} NutriWise. Dibuat dengan <Heart size={14} color="#FF6B6B" inline="true" /> untuk gaya hidup sehat Indonesia.
          </div>
          <div>
            <button 
              onClick={onOpenPrivacy} 
              style={{ background: 'none', border: 'none', color: '#C7DC5B', cursor: 'pointer', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <ShieldCheck size={16} /> Kebijakan Privasi & Keamanan Data
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
