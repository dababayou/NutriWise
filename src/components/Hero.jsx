import React from 'react';
import { ChevronDown } from 'lucide-react';

export default function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-bg-overlay"></div>
      
      <div className="hero-main-container">
        <div className="hero-left-column">
          <p className="hero-top-text">
            Platform interaktif inovasi kesehatan digital untuk mengedukasi nutrisi seimbang, menghitung kebutuhan harian secara akurat, dan meluruskan mitos seputar gaya hidup sehat sesuai standar kesehatan &amp; nutrisi medis.
          </p>

          <div className="hero-title-box">
            <h1 className="hero-headline">
              Masa depan sehat &amp; sejahtera dimulai dari <span className="italic-green">langkah kecil</span> hari ini.
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
