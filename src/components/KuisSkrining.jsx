import React, { useState, useEffect } from 'react';
import { ClipboardCheck, CheckCircle2, AlertTriangle, ArrowRight, RotateCcw, Activity, Heart, ShieldAlert, Zap, Info } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const quizQuestions = [
  {
    id: 'bmi',
    category: 'Data Otomatis',
    categoryLabel: 'A. Indeks Massa Tubuh',
    question: '1. Apa kategori Indeks Massa Tubuh (BMI) Anda saat ini?',
    note: 'Berdasarkan tinggi & berat badan Anda. Bisa dihitung ulang di Kalkulator.',
    options: [
      { text: '< 18,5 (Berat Kurang / Underweight)', points: 1, trigger: 'Q1' },
      { text: '18,5 – 24,9 (Berat Normal / Sehat)', points: 0, trigger: null },
      { text: '25 – 29,9 (Kelebihan Berat / Overweight)', points: 3, trigger: 'Q1' },
      { text: '≥ 30 (Obesitas)', points: 5, trigger: 'Q1' }
    ]
  },
  {
    id: 'veggies',
    category: 'Pola Makan',
    categoryLabel: 'B. Pola Makan & Konsumsi Harian',
    question: '2. Seberapa sering Anda makan sayur dan buah dalam seminggu?',
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
    question: '3. Seberapa sering Anda minum minuman manis (boba, soda, kopi manis, teh kemasan)?',
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
    question: '4. Seberapa sering Anda makan gorengan atau makanan cepat saji (fast food)?',
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
    question: '5. Seberapa sering Anda menambahkan garam/kecap/penyedap ekstra ke makanan?',
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
    question: '6. Berapa hari dalam seminggu Anda beraktivitas fisik minimal 30 menit (jalan cepat, olahraga)?',
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
    question: '7. Apakah ada keluarga inti (orang tua/saudara) dengan riwayat diabetes, hipertensi, atau jantung?',
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
    question: '8. Apakah Anda merokok aktif atau sering terpapar asap rokok (perokok pasif)?',
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
    question: '9. Berapa jam rata-rata Anda tidur per malam?',
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
    question: '10. Bagaimana Anda menilai tingkat stres dalam keseharian (kerja/kuliah)?',
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

export default function KuisSkrining({ currentUser }) {
  const [currentStep, setCurrentStep] = useState(0); // 0 = Intro, 1..10 = questions, 11 = Result
  const [answers, setAnswers] = useState({});
  const [savedQuizResult, setSavedQuizResult] = useState(null);

  // Load existing quiz result from user metadata or local storage
  useEffect(() => {
    if (currentUser?.user_metadata?.nutriwise_quiz_result) {
      setSavedQuizResult(currentUser.user_metadata.nutriwise_quiz_result);
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
    let totalScore = 0;
    const triggers = [];

    // Sub-categories scores
    let metabolicPoints = 0; // Q1 + Q3 + Q6
    let cardioPoints = 0;    // Q4 + Q5 + Q8 + Q10
    let lifestylePoints = 0; // Q9 + Q7

    Object.keys(answers).forEach((idxStr) => {
      const idx = parseInt(idxStr);
      const opt = answers[idx];
      if (opt) {
        totalScore += opt.points;
        if (opt.trigger) {
          triggers.push(opt.trigger);
        }

        // Question mapping for sub-risk
        if (idx === 0 || idx === 2 || idx === 5) metabolicPoints += opt.points;
        if (idx === 3 || idx === 4 || idx === 7 || idx === 9) cardioPoints += opt.points;
        if (idx === 6 || idx === 8) lifestylePoints += opt.points;
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
      metabolicPoints,
      cardioPoints,
      lifestylePoints,
      advice: uniqueAdvice.length > 0 ? uniqueAdvice.slice(0, 3) : ['pertahankan pola makan seimbang & aktivitas fisik harian Anda!'],
      date: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
    };

    setSavedQuizResult(resultObj);
    setCurrentStep(11);
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
              Uji 10 indikator gaya hidup Anda untuk mendeteksi potensi risiko awal Penyakit Tidak Menular (Diabetes Tipe 2, Hipertensi, dan Penyakit Jantung).
            </p>
          </div>

          <div className="quiz-features-grid">
            <div className="quiz-feature-item">
              <Zap size={22} color="#2F6323" />
              <div>
                <h4>10 Pertanyaan Ringkas</h4>
                <p>Hanya membutuhkan waktu 2–3 menit untuk diselesaikan.</p>
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
              <button onClick={() => setCurrentStep(11)} className="btn-cta-outline" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
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

      {/* ================= STEPS 1..10: QUESTION CARDS ================= */}
      {currentStep >= 1 && currentStep <= 10 && (
        <div className="quiz-card">
          {/* Progress Bar Header */}
          <div className="quiz-progress-header">
            <div className="quiz-step-info">
              <span className="quiz-category-tag">{currentQ.categoryLabel}</span>
              <span className="quiz-step-counter">Pertanyaan {currentStep} dari 10</span>
            </div>
            <div className="quiz-progress-bar-bg">
              <div
                className="quiz-progress-bar-fill"
                style={{ width: `${(currentStep / 10) * 100}%` }}
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
              className="btn-cta-outline"
              style={{ opacity: currentStep === 1 ? 0.4 : 1, cursor: currentStep === 1 ? 'not-allowed' : 'pointer' }}
            >
              Kembali
            </button>

            <button
              onClick={handleNextStep}
              disabled={!answers[currentStep - 1]}
              className="btn-auth-primary"
              style={{ minWidth: '150px', padding: '12px 24px' }}
            >
              {currentStep === 10 ? 'LIHAT HASIL' : 'LANJUT'} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ================= STEP 11: RESULTS DASHBOARD ================= */}
      {currentStep === 11 && savedQuizResult && (
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
                <p>BMI, konsumsi minuman manis, &amp; aktivitas fisik.</p>
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

          {/* Action Buttons */}
          <div className="results-actions">
            <button
              onClick={() => {
                setAnswers({});
                setCurrentStep(1);
              }}
              className="btn-cta-outline"
            >
              <RotateCcw size={16} /> Ulangi Kuis Skrining
            </button>

            <button
              onClick={() => setCurrentStep(0)}
              className="btn-auth-primary"
              style={{ minWidth: '160px' }}
            >
              KEMBALI KE MENU
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
