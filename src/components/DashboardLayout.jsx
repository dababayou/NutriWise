import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Kalkulator from './Kalkulator';
import Challenge30Days from './Challenge30Days';
import MitosFakta from './MitosFakta';
import { Menu, ShieldCheck } from 'lucide-react';

export default function DashboardLayout({ currentUser, onLogout, onOpenPrivacy, onOpenProfile }) {
  const [activeTab, setActiveTab] = useState('challenge'); // 'challenge' | 'kalkulator' | 'mitos'
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
        onOpenProfile={onOpenProfile}
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
              {activeTab === 'challenge' && '30-Day Health Challenge'}
              {activeTab === 'kalkulator' && 'Kalkulator Nutrisi'}
              {activeTab === 'mitos' && 'Mitos vs Fakta Nutrisi'}
            </h2>
          </div>

          <button onClick={onOpenPrivacy} className="btn-cta-outline" style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
            <ShieldCheck size={16} /> Privasi Data
          </button>
        </header>

        {/* Feature Page Container (No Hero, 1 Feature per Page) */}
        <main className="dashboard-main-view">
          {activeTab === 'challenge' && (
            <div className="dashboard-tab-pane">
              <Challenge30Days currentUser={currentUser} />
            </div>
          )}

          {activeTab === 'kalkulator' && (
            <div className="dashboard-tab-pane">
              <Kalkulator currentUser={currentUser} />
            </div>
          )}

          {activeTab === 'mitos' && (
            <div className="dashboard-tab-pane">
              <MitosFakta />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
