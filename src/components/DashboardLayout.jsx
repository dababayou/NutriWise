import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Kalkulator from './Kalkulator';
import Challenge30Days from './Challenge30Days';
import MitosFakta from './MitosFakta';
import { Menu, ShieldCheck } from 'lucide-react';

export default function DashboardLayout({ currentUser, onLogout, onOpenPrivacy }) {
  const [activeTab, setActiveTab] = useState('kalkulator'); // 'kalkulator' | 'challenge' | 'mitos' | 'sdg'
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onLogout={onLogout}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Viewport */}
      <div className="dashboard-content-area">
        {/* Top Header Bar for Mobile Toggle & Quick Actions */}
        <header className="dashboard-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="dashboard-menu-toggle" onClick={() => setMobileOpen(true)}>
              <Menu size={22} />
            </button>
            <h2 className="dashboard-page-title">
              {activeTab === 'kalkulator' && 'Kalkulator Nutrisi'}
              {activeTab === 'challenge' && '30-Day Health Challenge'}
              {activeTab === 'mitos' && 'Mitos vs Fakta Nutrisi'}
              {activeTab === 'sdg' && 'SDG 3 & Privasi Data'}
            </h2>
          </div>

          <button onClick={onOpenPrivacy} className="btn-cta-outline" style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
            <ShieldCheck size={16} /> Privasi Data
          </button>
        </header>

        {/* Feature Page Container (No Hero, 1 Feature per Page) */}
        <main className="dashboard-main-view">
          {activeTab === 'kalkulator' && (
            <div className="dashboard-tab-pane">
              <Kalkulator currentUser={currentUser} />
            </div>
          )}

          {activeTab === 'challenge' && (
            <div className="dashboard-tab-pane">
              <Challenge30Days currentUser={currentUser} />
            </div>
          )}

          {activeTab === 'mitos' && (
            <div className="dashboard-tab-pane">
              <MitosFakta />
            </div>
          )}

          {activeTab === 'sdg' && (
            <div className="dashboard-tab-pane">
              <section className="container" style={{ margin: '40px auto' }}>
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
                    onClick={onOpenPrivacy}
                  >
                    Lihat Standar Privasi Data
                  </button>
                </div>
              </section>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
