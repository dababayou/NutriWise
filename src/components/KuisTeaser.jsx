import React from 'react';
import { ClipboardCheck, Activity, Heart, ShieldAlert, ArrowRight, Lock } from 'lucide-react';

export default function KuisTeaser({ onOpenAuth }) {
  return (
    <section id="kuis-skrining" className="container" style={{ margin: '80px auto' }}>
      <div className="quiz-card quiz-intro-card" style={{ background: '#FFFFFF', border: '1px solid rgba(47, 99, 35, 0.15)', borderRadius: '24px', padding: '40px', boxShadow: '0 12px 32px rgba(0, 0, 0, 0.05)' }}>
        <div className="quiz-intro-header" style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div className="quiz-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--color-cream)', color: 'var(--color-forest)', padding: '6px 16px', borderRadius: '50px', fontWeight: 800, fontSize: '0.85rem', border: '1px solid rgba(47, 99, 35, 0.2)', marginBottom: '16px' }}>
            <ClipboardCheck size={18} /> Skrining Mandiri PTM (SDG 3)
          </div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-dark)', marginBottom: '12px' }}>
            Kuis Skrining Risiko Kesehatan &amp; Gaya Hidup
          </h2>
          <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.6, maxWidth: '680px', margin: '0 auto' }}>
            Uji indikator gaya hidup Anda dalam 3 menit untuk mendeteksi potensi risiko awal Penyakit Tidak Menular (Diabetes Tipe 2, Hipertensi, dan Penyakit Jantung).
          </p>
        </div>

        <div className="quiz-highlights-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '36px' }}>
          <div className="quiz-highlight-item" style={{ background: '#FAF9F6', padding: '20px', borderRadius: '16px', border: '1px solid #E2E8F0', textalign: 'left' }}>
            <div className="highlight-icon-box" style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(47, 99, 35, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <Activity size={22} color="var(--color-forest)" />
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: '6px' }}>9 Pertanyaan Berbobot</h4>
            <p style={{ fontSize: '0.86rem', color: '#64748B', lineHeight: 1.5, margin: 0 }}>
              Evaluasi pola makan, hidrasi harian, durasi tidur, tingkat aktivitas fisik, dan riwayat kesehatan.
            </p>
          </div>

          <div className="quiz-highlight-item" style={{ background: '#FAF9F6', padding: '20px', borderRadius: '16px', border: '1px solid #E2E8F0', textAlign: 'left' }}>
            <div className="highlight-icon-box" style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(47, 99, 35, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <ShieldAlert size={22} color="var(--color-forest)" />
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: '6px' }}>Algoritma Skor Berbobot</h4>
            <p style={{ fontSize: '0.86rem', color: '#64748B', lineHeight: 1.5, margin: 0 }}>
              Mengkalkulasi tingkat risiko gaya hidup Anda (Rendah, Sedang, atau Tinggi) berbasis standar ilmiah SDG 3.
            </p>
          </div>

          <div className="quiz-highlight-item" style={{ background: '#FAF9F6', padding: '20px', borderRadius: '16px', border: '1px solid #E2E8F0', textAlign: 'left' }}>
            <div className="highlight-icon-box" style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(47, 99, 35, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <Heart size={22} color="var(--color-forest)" />
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: '6px' }}>Rekomendasi Personal</h4>
            <p style={{ fontSize: '0.86rem', color: '#64748B', lineHeight: 1.5, margin: 0 }}>
              Dapatkan panduan aksi konkret yang dipersonalisasi untuk memperbaiki kebiasaan harian Anda.
            </p>
          </div>
        </div>

        <div className="quiz-start-actions" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={onOpenAuth}
            className="btn-nav-combined" 
            style={{ minWidth: '240px', padding: '14px 32px', height: '48px', fontSize: '1rem' }}
          >
            <span className="btn-text-default">Mulai Kuis Skrining <ArrowRight size={18} /></span>
            <span className="btn-text-hover"><Lock size={16} /> Masuk untuk Mencoba</span>
          </button>
          <span style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
            *Gratis &amp; langsung dapatkan analisis risiko kesehatan pribadi Anda.
          </span>
        </div>
      </div>
    </section>
  );
}
