import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Kalkulator from './components/Kalkulator';
import MitosFakta from './components/MitosFakta';
import Challenge30Days from './components/Challenge30Days';
import PrivacyModal from './components/PrivacyModal';
import Footer from './components/Footer';

export default function App() {
  const [privacyOpen, setPrivacyOpen] = useState(false);

  return (
    <div className="app">
      <Navbar onOpenPrivacy={() => setPrivacyOpen(true)} />
      
      <main>
        <Hero />
        <Kalkulator />
        <MitosFakta />
        <Challenge30Days />
        
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
    </div>
  );
}
