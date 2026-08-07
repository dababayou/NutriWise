import React from 'react';
import { Flame, Calculator, Lightbulb, LogOut, User, Cloud, X } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, currentUser, onLogout, mobileOpen, setMobileOpen }) {
  const displayName = currentUser?.user_metadata?.full_name || currentUser?.email?.split('@')[0] || 'Pengguna NutriWise';
  const email = currentUser?.email || 'user@nutriwise.id';

  const menuItems = [
    { id: 'challenge', label: '30-Day Challenge', icon: Flame },
    { id: 'kalkulator', label: 'Kalkulator Nutrisi', icon: Calculator },
    { id: 'mitos', label: 'Mitos vs Fakta', icon: Lightbulb }
  ];

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`dashboard-sidebar ${mobileOpen ? 'mobile-active' : ''}`}>
        {/* Mobile Close Button */}
        <button className="sidebar-mobile-close" onClick={() => setMobileOpen(false)}>
          <X size={20} />
        </button>

        {/* Brand Logo Header */}
        <div className="sidebar-brand">
          <img src="/dino_logo.png" alt="NutriWise Logo" className="sidebar-logo-img" />
          <div className="sidebar-brand-text">
            <span className="sidebar-title">NutriWise</span>
            <span className="sidebar-tagline">Health Dashboard</span>
          </div>
        </div>

        {/* User Profile Card */}
        <div className="sidebar-user-card">
          <div className="sidebar-avatar">
            <User size={20} color="#2F6323" />
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{displayName}</div>
            <div className="sidebar-user-email">{email}</div>
            <div className="sidebar-user-badge">
              <Cloud size={12} /> Cloud Sync
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-menu">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileOpen(false);
                }}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={20} className="nav-item-icon" />
                <span className="nav-item-label">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer Logout Button */}
        <div className="sidebar-footer">
          <button onClick={onLogout} className="sidebar-logout-btn">
            <LogOut size={18} />
            <span>Keluar Akun</span>
          </button>
        </div>
      </aside>
    </>
  );
}
