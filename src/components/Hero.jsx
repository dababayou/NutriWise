import React from 'react';
import { ChevronDown } from 'lucide-react';

export default function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-bg-overlay"></div>
      
      <div className="hero-main-container">
        <div className="hero-left-column">
          <p className="hero-top-text">
            Platform interaktif inovasi kesehatan digital untuk mengedukasi nutrisi seimbang, menghitung kebutuhan harian secara akurat, dan meluruskan mitos seputar gaya hidup sehat sesuai standar SDG 3.
          </p>

          <div className="hero-wavy-card">
            {/* Organic Wave Transition into Nude Background */}
            <svg className="hero-wave-top" viewBox="0 0 600 48" preserveAspectRatio="none">
              <path d="M0,48 C180,5 380,42 600,12 L600,48 L0,48 Z" fill="#FFFCF4" />
            </svg>
            <div className="hero-wavy-content">
              <h1 className="hero-headline">
                Masa depan sehat &amp; sejahtera dimulai dari <span className="italic-green">langkah kecil</span> hari ini.
              </h1>
            </div>
          </div>
        </div>

        <div className="hero-right-column">
          <a href="#kalkulator" className="btn-hero-more">
            Pelajari Lebih Lanjut <ChevronDown size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}
