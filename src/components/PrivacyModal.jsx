import React from 'react';
import { ShieldCheck, Lock, HardDrive, EyeOff, X, UserCheck, Trash2 } from 'lucide-react';

export default function PrivacyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px', padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '88vh' }}>
        {/* Header */}
        <div style={{ padding: '24px 32px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', background: '#FFFFFF' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ShieldCheck size={32} color="#2F6323" />
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', fontWeight: 800, margin: 0, color: 'var(--color-dark)' }}>
              Kebijakan Privasi &amp; Keamanan Data
            </h2>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title="Tutup"
          >
            <X size={22} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="modal-card-body" style={{ padding: '24px 32px', overflowY: 'auto', flex: 1 }}>
          <p style={{ color: '#4A5568', marginBottom: '24px', fontSize: '0.94rem', lineHeight: 1.6 }}>
            NutriWise berkomitmen tinggi untuk melindungi privasi pengguna sesuai standar keamanan data digital nasional dan internasional. Kami memprioritaskan transparansi total atas data kesehatan Anda.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '16px', background: 'var(--color-cream)', padding: '18px', borderRadius: '16px', border: '1px solid rgba(47, 99, 35, 0.12)' }}>
              <HardDrive size={26} color="#558949" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h4 style={{ fontWeight: 700, marginBottom: '4px', color: 'var(--color-dark)', fontSize: '0.98rem' }}>
                  1. Pemrosesan Lokal (Local-First Data Storage)
                </h4>
                <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.55, margin: 0 }}>
                  Seluruh kalkulasi kustom (BMI, kalori, dan kebutuhan air) serta log harian 30-Day Challenge diproses dan disimpan secara langsung di peramban (browser) pengguna tanpa dikirimkan ke pihak ketiga yang tidak dikenal.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', background: 'var(--color-cream)', padding: '18px', borderRadius: '16px', border: '1px solid rgba(47, 99, 35, 0.12)' }}>
              <Lock size={26} color="#558949" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h4 style={{ fontWeight: 700, marginBottom: '4px', color: 'var(--color-dark)', fontSize: '0.98rem' }}>
                  2. Enkripsi Sinkronisasi Cloud (Supabase)
                </h4>
                <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.55, margin: 0 }}>
                  Untuk pengguna terautentikasi, progres 30-Day Challenge dan hasil kuis skrining tersimpan dengan enkripsi di basis data cloud Supabase yang dilindungi oleh Row Level Security (RLS) berbasis ID unik akun.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', background: 'var(--color-cream)', padding: '18px', borderRadius: '16px', border: '1px solid rgba(47, 99, 35, 0.12)' }}>
              <EyeOff size={26} color="#558949" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h4 style={{ fontWeight: 700, marginBottom: '4px', color: 'var(--color-dark)', fontSize: '0.98rem' }}>
                  3. Nir-Pelacakan &amp; Tanpa Iklan
                </h4>
                <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.55, margin: 0 }}>
                  NutriWise tidak menggunakan tracker komersial, kuki pelacak pihak ketiga, atau menjual data profil kesehatan pribadi Anda kepada pengiklan mana pun.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', background: 'var(--color-cream)', padding: '18px', borderRadius: '16px', border: '1px solid rgba(47, 99, 35, 0.12)' }}>
              <UserCheck size={26} color="#558949" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h4 style={{ fontWeight: 700, marginBottom: '4px', color: 'var(--color-dark)', fontSize: '0.98rem' }}>
                  4. Kepatuhan Hukum (UU PDP No. 27/2022)
                </h4>
                <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.55, margin: 0 }}>
                  Sistem NutriWise dirancang mengacu pada prinsip Perlindungan Data Pribadi Indonesia untuk menjamin hak kerahasiaan, integritas, dan ketersediaan data pengguna.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', background: '#FEF2F2', padding: '18px', borderRadius: '16px', border: '1px solid #FCA5A5' }}>
              <Trash2 size={26} color="#DC2626" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h4 style={{ fontWeight: 700, marginBottom: '4px', color: '#991B1B', fontSize: '0.98rem' }}>
                  5. Hak Kendali &amp; Penghapusan Permanen Akun
                </h4>
                <p style={{ fontSize: '0.88rem', color: '#7F1D1D', lineHeight: 1.55, margin: 0 }}>
                  Anda memiliki kendali penuh atas akun. Pengguna dapat memperbarui data profil atau menghapus seluruh riwayat dan akun secara permanen melalui menu Profil.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 32px 20px', borderTop: '1px solid #F1F5F9', background: '#FAF9F6', textAlign: 'right' }}>
          <button 
            onClick={onClose} 
            className="btn-auth-primary"
            style={{ padding: '8px 24px', fontSize: '0.9rem', cursor: 'pointer', height: '40px' }}
          >
            Saya Mengerti
          </button>
        </div>
      </div>
    </div>
  );
}
