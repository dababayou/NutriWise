import React, { useState, useEffect } from 'react';
import { ClipboardCheck, CheckCircle2, AlertTriangle, ArrowRight, ArrowLeft, RotateCcw, Activity, Heart, ShieldAlert, Zap, Info, Lock, Calculator, Home } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

// 9 Questions (Q2 through Q10 from document; Q1 BMI is auto-pulled from Kalkulator)
const quizQuestions = [
  {
    id: 'veggies',
    category: 'Pola Makan',
    categoryLabel: 'B. Pola Makan & Konsumsi Harian',
    question: '1. Seberapa sering Anda makan sayur dan buah dalam seminggu?',
    options: [
      { text: 'Setiap hari (≥5 porsi / hari)', points: 0, trigger: null },
      { text: '3–6 hari seminggu', points: 1, trigger: null },
      { text: '1–2 hari seminggu', points: 2, trigger: 'Q2' },
      { text: 'Hampir tidak pernah', points: 3, trigger: 'Q2' }
    ]
  },
  {
    id: 'sweet_drinks',
    category: 'Pola Makan',
    categoryLabel: 'B. Pola Makan & Konsumsi Harian',
    question: '2. Seberapa sering Anda minum minuman manis (boba, soda, kopi manis, teh kemasan)?',
    options: [
      { text: 'Jarang / tidak pernah', points: 0, trigger: null },
      { text: '1–2x seminggu', points: 1, trigger: null },
      { text: '3–5x seminggu', points: 2, trigger: 'Q3' },
      { text: 'Hampir tiap hari', points: 4, trigger: 'Q3' }
    ]
  },
  {
    id: 'fast_food',
    category: 'Pola Makan',
    categoryLabel: 'B. Pola Makan & Konsumsi Harian',
    question: '3. Seberapa sering Anda makan gorengan atau makanan cepat saji (fast food)?',
    options: [
      { text: 'Jarang / tidak pernah', points: 0, trigger: null },
      { text: '1–2x seminggu', points: 1, trigger: null },
      { text: '3–5x seminggu', points: 2, trigger: 'Q4' },
      { text: 'Hampir tiap hari', points: 4, trigger: 'Q4' }
    ]
  },
  {
    id: 'salty_food',
    category: 'Pola Makan',
    categoryLabel: 'B. Pola Makan & Konsumsi Harian',
    question: '4. Seberapa sering Anda menambahkan garam/kecap/penyedap ekstra ke makanan?',
    options: [
      { text: 'Jarang / tidak pernah', points: 0, trigger: null },
      { text: 'Kadang-kadang', points: 1, trigger: null },
      { text: 'Hampir selalu', points: 2, trigger: 'Q5' }
    ]
  },
  {
    id: 'activity',
    category: 'Aktivitas Fisik',
    categoryLabel: 'C. Aktivitas Fisik',
    question: '5. Berapa hari dalam seminggu Anda beraktivitas fisik minimal 30 menit (jalan cepat, olahraga)?',
    options: [
      { text: '5 hari atau lebih (Memenuhi standar WHO 150 mnt/minggu)', points: 0, trigger: null },
      { text: '3–4 hari', points: 1, trigger: null },
      { text: '1–2 hari', points: 2, trigger: 'Q6' },
      { text: 'Hampir tidak pernah', points: 4, trigger: 'Q6' }
    ]
  },
  {
    id: 'family_history',
    category: 'Riwayat Risiko',
    categoryLabel: 'D. Riwayat & Faktor Risiko Tambahan',
    question: '6. Apakah ada keluarga inti (orang tua/saudara) dengan riwayat diabetes, hipertensi, atau jantung?',
    options: [
      { text: 'Tidak ada', points: 0, trigger: null },
      { text: 'Ada 1 jenis penyakit', points: 2, trigger: 'Q7' },
      { text: 'Ada lebih dari 1 jenis penyakit', points: 4, trigger: 'Q7' }
    ]
  },
  {
    id: 'smoking',
    category: 'Riwayat Risiko',
    categoryLabel: 'D. Riwayat & Faktor Risiko Tambahan',
    question: '7. Apakah Anda merokok aktif atau sering terpapar asap rokok (perokok pasif)?',
    options: [
      { text: 'Tidak keduanya', points: 0, trigger: null },
      { text: 'Perokok pasif saja', points: 2, trigger: 'Q8' },
      { text: 'Perokok aktif', points: 4, trigger: 'Q8' }
    ]
  },
  {
    id: 'sleep',
    category: 'Riwayat Risiko',
    categoryLabel: 'D. Riwayat & Faktor Risiko Tambahan',
    question: '8. Berapa jam rata-rata Anda tidur per malam?',
    options: [
      { text: '7–8 jam (Durasi optimal)', points: 0, trigger: null },
      { text: '6 jam atau ≥9 jam', points: 1, trigger: null },
      { text: '< 6 jam', points: 2, trigger: 'Q9' }
    ]
  },
  {
    id: 'stress',
    category: 'Riwayat Risiko',
    categoryLabel: 'D. Riwayat & Faktor Risiko Tambahan',
    question: '9. Bagaimana Anda menilai tingkat stres dalam keseharian (kerja/kuliah)?',
    options: [
      { text: 'Rendah (jarang merasa tertekan)', points: 0, trigger: null },
      { text: 'Sedang (kadang tertekan)', points: 1, trigger: null },
      { text: 'Tinggi (sering merasa tertekan)', points: 3, trigger: 'Q10' }
    ]
  }
];

const focusAdviceBank = {
  Q1: 'turunkan berat badan bertahap 0,5–1 kg/minggu lewat kombinasi pola makan gizi seimbang dan olahraga teratur',
  Q2: 'tambah porsi sayur dan buah minimal 3–5 porsi/hari untuk mencukupi serat & antioksidan',
  Q3: 'kurangi minuman manis (boba, soda, kopi kekinian) menjadi maksimal 1–2x/minggu',
  Q4: 'batasi makanan gorengan dan cepat saji, ganti dengan pilihan yang dikukus, direbus, atau dipanggang',
  Q5: 'kurangi tambahan garam/kecap/penyedap masakan untuk mengontrol tekanan darah & natrium',
  Q6: 'tingkatkan aktivitas fisik minimal 30 menit ke 5 hari/minggu, dimulai dari jalan cepat rutin',
  Q7: 'karena ada riwayat keluarga, lakukan skrining kesehatan rutin (gula darah, tekanan darah) secara berkala',
  Q8: 'pertimbangkan berhenti merokok dan batasi paparan lingkungan asap rokok pasif',
  Q9: 'perbaiki durasi tidur ke 7–8 jam/malam dengan jadwal waktu tidur yang teratur',
  Q10: 'kelola tingkat stres dengan teknik relaksasi, olahraga ringan, atau istirahat cukup'
};

export default function KuisSkrining({ currentUser, onNavigateToCalc }) {
  const [currentStep, setCurrentStep] = useState(0); // 0 = Intro, 1..9 = questions, 10 = Result
  const [answers, setAnswers] = useState({});
  const [savedQuizResult, setSavedQuizResult] = useState(null);
  const [userBmiData, setUserBmiData] = useState(null);

  // Load existing BMI and quiz result from user metadata or local storage
  useEffect(() => {
    const meta = currentUser?.user_metadata || {};
    
    // Load BMI Data
    const bmiData = meta.nutriwise_bmi_data || JSON.parse(localStorage.getItem('nutriwise_bmi_data') || 'null');
    setUserBmiData(bmiData);

    // Load Quiz Result
    if (meta.nutriwise_quiz_result) {
      setSavedQuizResult(meta.nutriwise_quiz_result);
    } else {
      const local = localStorage.getItem('nutriwise_quiz_result');
      if (local) {
        setSavedQuizResult(JSON.parse(local));
      }
    }
  }, [currentUser]);

  const handleSelectOption = (questionIndex, option) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: option
    }));
  };

  const handleNextStep = () => {
    if (currentStep < quizQuestions.length) {
      setCurrentStep((prev) => prev + 1);
    } else {
      calculateAndShowResult();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const calculateAndShowResult = async () => {
    // Start with auto-pulled BMI points
    const bmiPoints = userBmiData?.points || 0;
    let totalScore = bmiPoints;
    const triggers = [];

    if (bmiPoints > 0) {
      triggers.push('Q1');
    }

    // Sub-categories scores
    let metabolicPoints = bmiPoints; // Auto Q1 + Q2 (sweets) + Q5 (activity)
    let cardioPoints = 0;           // Q3 (fast food) + Q4 (salt) + Q7 (smoking) + Q9 (stress)
    let lifestylePoints = 0;        // Q6 (family) + Q8 (sleep)

    Object.keys(answers).forEach((idxStr) => {
      const idx = parseInt(idxStr);
      const opt = answers[idx];
      if (opt) {
        totalScore += opt.points;
        if (opt.trigger) {
          triggers.push(opt.trigger);
        }

        // Mapping 9 questions (0-indexed):
        // 0: veggies (Q2) -> metabolic
        // 1: sweets (Q3) -> metabolic
        // 2: fast food (Q4) -> cardio
        // 3: salt (Q5) -> cardio
        // 4: activity (Q6) -> metabolic
        // 5: family (Q7) -> lifestyle
        // 6: smoking (Q8) -> cardio
        // 7: sleep (Q9) -> lifestyle
        // 8: stress (Q10) -> cardio
        if (idx === 0 || idx === 1 || idx === 4) metabolicPoints += opt.points;
        if (idx === 2 || idx === 3 || idx === 6 || idx === 8) cardioPoints += opt.points;
        if (idx === 5 || idx === 7) lifestylePoints += opt.points;
      }
    });

    let category = 'Risiko Rendah';
    let colorClass = 'green';
    let badgeColor = '#10B981';
    let summaryText = 'Gaya hidup Anda secara umum sudah sangat baik dalam mendukung kesehatan metabolik.';

    if (totalScore >= 30) {
      category = 'Risiko Sangat Tinggi';
      colorClass = 'red';
      badgeColor = '#EF4444';
      summaryText = 'Faktor risiko multipel & kuat terdeteksi. Disarankan melakukan pemeriksaan lanjutan ke dokter/tenaga kesehatan.';
    } else if (totalScore >= 20) {
      category = 'Risiko Tinggi';
      colorClass = 'orange';
      badgeColor = '#F97316';
      summaryText = 'Kombinasi beberapa faktor risiko signifikan terdeteksi. Diperlukan perubahan gaya hidup aktif secara bertahap.';
    } else if (totalScore >= 10) {
      category = 'Risiko Sedang';
      colorClass = 'yellow';
      badgeColor = '#F59E0B';
      summaryText = 'Ada beberapa kebiasaan yang bila dibiarkan bisa meningkatkan risiko Penyakit Tidak Menular (PTM).';
    }

    // Advice triggers
    const adviceList = triggers.map((t) => focusAdviceBank[t]).filter(Boolean);
    const uniqueAdvice = [...new Set(adviceList)];

    const resultObj = {
      score: totalScore,
      category,
      colorClass,
      badgeColor,
      summaryText,
      bmiInfo: userBmiData ? `${userBmiData.bmi} (${userBmiData.rawCategory})` : 'Tidk ada',
      metabolicPoints,
      cardioPoints,
      lifestylePoints,
      advice: uniqueAdvice.length > 0 ? uniqueAdvice.slice(0, 3) : ['pertahankan pola makan seimbang & aktivitas fisik harian Anda!'],
      date: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
    };

    setSavedQuizResult(resultObj);
    setCurrentStep(10);
    localStorage.setItem('nutriwise_quiz_result', JSON.stringify(resultObj));

    // Save to Supabase user_metadata if configured
    if (currentUser && isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.updateUser({
          data: { nutriwise_quiz_result: resultObj }
        });
      } catch (err) {
        console.error('Gagal menyinkronkan hasil kuis ke Supabase:', err);
      }
    }
  };

  // ================= LOCKED STATE: IF BMI HAS NOT BEEN CALCULATED YET =================
  if (!userBmiData) {
    return (
      <div className="quiz-container">
        <div className="quiz-card" style={{ textAlign: 'center', padding: '48px 32px' }}>
          <div style={{ width: '72px', height: '72px', background: 'rgba(239, 68, 68, 0.12)', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
            <Lock size={36} color="#DC2626" />
          </div>

          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-dark)', marginBottom: '10px' }}>
            Kuis Skrining PTM Terkunci
          </h2>

          <p style={{ color: '#64748B', fontSize: '1rem', lineHeight: 1.6, maxWidth: '560px', margin: '0 auto 28px' }}>
            Anda belum menghitung Indeks Massa Tubuh (BMI) di <strong>Kalkulator Nutrisi</strong>. Kuis skrining kesehatan membutuhkan data BMI awal Anda untuk menganalisis risiko Penyakit Tidak Menular secara akurat.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              onClick={onNavigateToCalc}
              className="btn-nav-combined"
              style={{ minWidth: '240px', padding: '14px 28px' }}
            >
              <span className="btn-text-default" style={{ gap: '8px' }}>
                <Calculator size={18} /> HITUNG BMI SEKARANG
              </span>
              <span className="btn-text-hover" style={{ gap: '8px' }}>
                 HITUNG BMI SEKARANG <ArrowRight size={16} />
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = quizQuestions[currentStep - 1];

  return (
    <div className="quiz-container">
      {/* ================= STEP 0: INTRO SCREEN ================= */}
      {currentStep === 0 && (
        <div className="quiz-card quiz-intro-card">
          <div className="quiz-intro-header">
            <div className="quiz-badge">
              <ClipboardCheck size={18} /> Skrining Mandiri PTM (SDG 3)
            </div>
            <h2>Kuis Skrining Risiko Kesehatan &amp; Gaya Hidup</h2>
            <p>
              Uji indikator gaya hidup Anda untuk mendeteksi potensi risiko awal Penyakit Tidak Menular (Diabetes Tipe 2, Hipertensi, dan Penyakit Jantung).
            </p>
          </div>

          {/* Auto-Pulled BMI Info Banner */}
          <div style={{ background: '#F0FDF4', border: '1px solid #A7F3D0', borderRadius: '16px', padding: '14px 18px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Activity size={20} color="#059669" />
              <div>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#065F46' }}>Data BMI Terhubung dari Kalkulator:</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-dark)' }}>
                  BMI {userBmiData.bmi} kg/m² • {userBmiData.category} ({userBmiData.points} Poin Risiko)
                </div>
              </div>
            </div>

            <button onClick={onNavigateToCalc} className="btn-cta-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
              Hitung Ulang BMI
            </button>
          </div>

          <div className="quiz-features-grid">
            <div className="quiz-feature-item">
              <Zap size={22} color="#2F6323" />
              <div>
                <h4>9 Pertanyaan Singkat</h4>
                <p>Hanya membutuhkan waktu 1–2 menit untuk diselesaikan.</p>
              </div>
            </div>

            <div className="quiz-feature-item">
              <Activity size={22} color="#2F6323" />
              <div>
                <h4>Algoritma Skor Berbobot</h4>
                <p>Analisis 3 faktor risiko: Metabolik, Kardiovaskular, dan Genetik.</p>
              </div>
            </div>

            <div className="quiz-feature-item">
              <Heart size={22} color="#2F6323" />
              <div>
                <h4>Rekomendasi Personal</h4>
                <p>Mendapatkan fokus perbaikan spesifik berbasis hasil jawaban Anda.</p>
              </div>
            </div>
          </div>

          {savedQuizResult && (
            <div className="quiz-last-result-banner">
              <div>
                <span className="last-result-title">Hasil Kuis Terakhir ({savedQuizResult.date}):</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                  <span className="badge-risk" style={{ background: savedQuizResult.badgeColor }}>
                    Skor {savedQuizResult.score} • {savedQuizResult.category}
                  </span>
                </div>
              </div>
              <button onClick={() => setCurrentStep(10)} className="btn-cta-outline" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                Lihat Laporan Detail
              </button>
            </div>
          )}

          <div className="quiz-start-actions">
            <button onClick={() => setCurrentStep(1)} className="btn-nav-combined" style={{ minWidth: '220px', padding: '14px 28px' }}>
              <span className="btn-text-default">Mulai Kuis Skrining</span>
              <span className="btn-text-hover">Mulai Kuis Skrining</span>
            </button>
          </div>
        </div>
      )}

      {/* ================= STEPS 1..9: QUESTION CARDS ================= */}
      {currentStep >= 1 && currentStep <= 9 && (
        <div className="quiz-card">
          {/* Progress Bar Header */}
          <div className="quiz-progress-header">
            <div className="quiz-step-info">
              <span className="quiz-category-tag">{currentQ.categoryLabel}</span>
              <span className="quiz-step-counter">Pertanyaan {currentStep} dari 9</span>
            </div>
            <div className="quiz-progress-bar-bg">
              <div
                className="quiz-progress-bar-fill"
                style={{ width: `${(currentStep / 9) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question Text */}
          <div className="quiz-question-box">
            <h3 className="quiz-question-text">{currentQ.question}</h3>
            {currentQ.note && <p className="quiz-question-note"><Info size={14} /> {currentQ.note}</p>}
          </div>

          {/* Options Grid */}
          <div className="quiz-options-list">
            {currentQ.options.map((opt, idx) => {
              const isSelected = answers[currentStep - 1]?.text === opt.text;
              return (
                <div
                  key={idx}
                  onClick={() => handleSelectOption(currentStep - 1, opt)}
                  className={`quiz-option-card ${isSelected ? 'selected' : ''}`}
                >
                  <div className="quiz-radio-indicator">
                    {isSelected && <CheckCircle2 size={18} color="#2F6323" />}
                  </div>
                  <span className="quiz-option-text">{opt.text}</span>
                </div>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="quiz-nav-footer">
            <button
              onClick={handlePrevStep}
              disabled={currentStep === 1}
              className="btn-warning-outline"
              style={{
                opacity: currentStep === 1 ? 0.4 : 1,
                cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
                minWidth: '130px'
              }}
            >
              <ArrowLeft size={16} /> Kembali
            </button>

            <button
              onClick={handleNextStep}
              disabled={!answers[currentStep - 1]}
              className="btn-auth-primary"
              style={{ minWidth: '150px' }}
            >
              {currentStep === 9 ? 'Lihat Hasil' : 'Lanjut'} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ================= STEP 10: RESULTS DASHBOARD ================= */}
      {currentStep === 10 && savedQuizResult && (
        <div className="quiz-card quiz-results-card">
          <div className="results-header">
            <div className="badge-risk-hero" style={{ backgroundColor: savedQuizResult.badgeColor }}>
              {savedQuizResult.category}
            </div>
            <h2>Laporan Skrining Risiko Kesehatan</h2>
            <p className="results-date">Diselesaikan pada {savedQuizResult.date}</p>
          </div>

          {/* Score Overview Row */}
          <div className="results-score-banner">
            <div className="score-big-circle" style={{ borderColor: savedQuizResult.badgeColor }}>
              <span className="score-num">{savedQuizResult.score}</span>
              <span className="score-max">/ 37 Poin</span>
            </div>
            <div className="score-summary-text">
              <h3>Status Indikator Kesehatan</h3>
              <p>{savedQuizResult.summaryText}</p>
              {userBmiData && (
                <div style={{ marginTop: '8px', fontSize: '0.85rem', color: '#059669', fontWeight: 700 }}>
                  ✓ Termasuk Skor BMI: {userBmiData.bmi} ({userBmiData.rawCategory} • {userBmiData.points} Poin)
                </div>
              )}
            </div>
          </div>

          {/* Sub-Risk Breakdown */}
          <h4 className="section-subheading">Analisis Faktor Risiko Per Sub-Kategori</h4>
          <div className="subrisk-grid">
            <div className="subrisk-item">
              <div className="subrisk-icon-box">
                <Activity size={20} color="#059669" />
              </div>
              <div className="subrisk-info">
                <h5>Risiko Metabolik &amp; Diabetes</h5>
                <p>BMI ({userBmiData?.bmi}), minuman manis, &amp; aktivitas fisik.</p>
                <span className="subrisk-score">Skor Sub: {savedQuizResult.metabolicPoints} Poin</span>
              </div>
            </div>

            <div className="subrisk-item">
              <div className="subrisk-icon-box">
                <Heart size={20} color="#DC2626" />
              </div>
              <div className="subrisk-info">
                <h5>Risiko Kardiovaskular</h5>
                <p>Gorengan, konsumsi garam, rokok, &amp; stres.</p>
                <span className="subrisk-score">Skor Sub: {savedQuizResult.cardioPoints} Poin</span>
              </div>
            </div>

            <div className="subrisk-item">
              <div className="subrisk-icon-box">
                <ShieldAlert size={20} color="#D97706" />
              </div>
              <div className="subrisk-info">
                <h5>Gaya Hidup &amp; Genetik</h5>
                <p>Durasi tidur &amp; riwayat penyakit keluarga.</p>
                <span className="subrisk-score">Skor Sub: {savedQuizResult.lifestylePoints} Poin</span>
              </div>
            </div>
          </div>

          {/* Targeted Action Advice */}
          <div className="advice-box">
            <h4>🎯 Fokus Perbaikan Utama Untuk Anda:</h4>
            <ul>
              {savedQuizResult.advice.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Medical Disclaimer */}
          <div className="quiz-disclaimer">
            <AlertTriangle size={18} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
            <p>
              <strong>Disclaimer Medis:</strong> Hasil skrining ini adalah estimasi berbasis gaya hidup untuk tujuan edukasi, bukan diagnosis medis resmi. Untuk kepastian kondisi kesehatan, konsultasikan dengan dokter atau tenaga kesehatan profesional.
            </p>
          </div>

          {/* Action Buttons (Swapped: Kembali ke Menu on Left in Red, Ulangi on Right in Green Outline) */}
          <div className="results-actions">
            <button
              onClick={() => setCurrentStep(0)}
              className="btn-danger-outline"
              style={{ minWidth: '180px' }}
            >
              <Home size={16} /> Kembali ke Menu
            </button>

            <button
              onClick={() => {
                setAnswers({});
                setCurrentStep(1);
              }}
              className="btn-cta-outline"
              style={{ minWidth: '180px' }}
            >
              <RotateCcw size={16} /> Ulangi Kuis Skrining
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
