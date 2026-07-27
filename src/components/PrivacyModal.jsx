import React from 'react';
import { ShieldCheck, Lock, HardDrive, EyeOff, X } from 'lucide-react';

export default function PrivacyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <ShieldCheck size={36} color="#2F6323" />
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', fontWeight: 700 }}>
            Kebijakan Privasi & Keamanan Data
          </h2>
        </div>

        <p style={{ color: 'var(--color-muted)', marginBottom: '24px', fontSize: '0.95rem' }}>
          NutriWise berkomitmen tinggi untuk melindungi privasi pengguna sesuai standar keamanan data digital dan kriteria penilaian TIC 9.0 (Indikator 3: Kebijakan Privasi & Keamanan Data).
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', gap: '16px', background: 'var(--color-cream)', padding: '16px', borderRadius: '12px' }}>
            <HardDrive size={28} color="#558949" style={{ shrink: 0 }} />
            <div>
              <h4 style={{ fontWeight: 700, marginBottom: '4px' }}>Pemrosesan Lokal (Local-First Data Storage)</h4>
              <p style={{ fontSize: '0.88rem', color: '#4A5568' }}>
                Seluruh data perhitungan kalkulator (BMI, kalori, air) dan progres 30-Day Challenge diproses secara instan di peramban (browser) milik pengguna tanpa pernah dikirimkan ke server eksternal.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', background: 'var(--color-cream)', padding: '16px', borderRadius: '12px' }}>
            <EyeOff size={28} color="#558949" style={{ shrink: 0 }} />
            <div>
              <h4 style={{ fontWeight: 700, marginBottom: '4px' }}>Nir-Pelacakan & Tanpa Kuki Pihak Ketiga</h4>
              <p style={{ fontSize: '0.88rem', color: '#4A5568' }}>
                NutriWise tidak memasang tracker pelacak pihak ketiga, iklan berbayar, atau menjual data kesehatan pribadi pengguna kepada pihak ketiga mana pun.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', background: 'var(--color-cream)', padding: '16px', borderRadius: '12px' }}>
            <Lock size={28} color="#558949" style={{ shrink: 0 }} />
            <div>
              <h4 style={{ fontWeight: 700, marginBottom: '4px' }}>Kepatuhan Hukum Privasi</h4>
              <p style={{ fontSize: '0.88rem', color: '#4A5568' }}>
                Sistem dirancang mengacu pada prinsip Perlindungan Data Pribadi (UU PDP No. 27 Tahun 2022) untuk memastikan pengguna memiliki kendali penuh atas data mereka.
              </p>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '32px', textAlign: 'right' }}>
          <button 
            onClick={onClose} 
            className="btn-hero-more"
            style={{ padding: '10px 24px', cursor: 'pointer' }}
          >
            Saya Mengerti
          </button>
        </div>
      </div>
    </div>
  );
}
