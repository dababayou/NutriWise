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

          <div className="hero-stepped-card">
            <h1 className="hero-headline">
              <span className="hero-text-line">Masa depan sehat &amp;</span>
              <span className="hero-text-line">sejahtera dimulai dari</span>
              <span className="hero-text-line"><span className="italic-green">langkah kecil</span> hari ini.</span>
            </h1>
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
