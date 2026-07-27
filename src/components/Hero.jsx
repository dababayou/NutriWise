import React from 'react';
import { ChevronDown } from 'lucide-react';

export default function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-bg-overlay"></div>
      
      <div className="hero-content-top">
        <p className="hero-top-text">
          Platform interaktif inovasi kesehatan digital untuk mengedukasi nutrisi seimbang, menghitung kebutuhan harian secara akurat, dan meluruskan mitos seputar gaya hidup sehat sesuai standar SDG 3.
        </p>
      </div>

      <div className="hero-content-bottom">
        <div className="hero-badge-card">
          <h1 className="hero-headline">
            Masa depan sehat &<br />
            sejahtera dimulai dari<br />
            <span className="italic-green">langkah kecil</span> hari ini.
          </h1>
        </div>

        <a href="#kalkulator" className="btn-hero-more">
          Pelajari Lebih Lanjut <ChevronDown size={18} />
        </a>
      </div>
    </section>
  );
}
