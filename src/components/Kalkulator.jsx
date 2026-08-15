import React, { useState, useEffect } from 'react';
import { ClipboardCheck, ArrowRight, Activity, Flame, Droplets } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export default function Kalkulator({ currentUser, onNavigateToQuiz }) {
  // BMI State
  const [bmiWeight, setBmiWeight] = useState('');
  const [bmiHeight, setBmiHeight] = useState('');
  const [bmiResult, setBmiResult] = useState(null); // { bmi: '23,2', category: '...', points: 0 }

  // Calorie State
  const [calWeight, setCalWeight] = useState('');
  const [calHeight, setCalHeight] = useState('');
  const [calAge, setCalAge] = useState('');
  const [calGender, setCalGender] = useState('Pria');
  const [calActivity, setCalActivity] = useState('1.375');
  const [calResult, setCalResult] = useState(null); // { calories: 2222, bmr: 1616 }

  // Water State
  const [waterWeight, setWaterWeight] = useState('');
  const [waterActivity, setWaterActivity] = useState('santai');
  const [waterResult, setWaterResult] = useState(null); // { liters: '2,5', glasses: 10 }

  // Load existing calculated BMI on mount & currentUser change
  useEffect(() => {
    setBmiWeight('');
    setBmiHeight('');
    setCalWeight('');
    setCalHeight('');
    setCalAge('');
    setWaterWeight('');
    setCalResult(null);
    setWaterResult(null);

    if (!currentUser) {
      setBmiResult(null);
      return;
    }

    const meta = currentUser.user_metadata || {};
    const uid = currentUser.id;
    const bmiKey = `nutriwise_bmi_data_${uid}`;
    const savedBmi = meta.nutriwise_bmi_data || JSON.parse(localStorage.getItem(bmiKey) || 'null');
    setBmiResult(savedBmi);
  }, [currentUser]);

  // Calculate BMI
  const handleCalcBmi = async (e) => {
    e.preventDefault();
    const w = parseFloat(bmiWeight);
    const h = parseFloat(bmiHeight) / 100;

    if (w > 0 && h > 0) {
      const valNum = parseFloat((w / (h * h)).toFixed(1));
      let cat = 'Berat Badan Normal / Sehat';
      let points = 0;
      let rawCat = '18.5-24.9 (Normal)';

      if (valNum < 18.5) {
        cat = 'Kurus / Berat Kurang (Underweight)';
        points = 1;
        rawCat = '<18.5 (Underweight)';
      } else if (valNum >= 25 && valNum < 29.9) {
        cat = 'Kelebihan Berat Badan (Overweight)';
        points = 3;
        rawCat = '25-29.9 (Overweight)';
      } else if (valNum >= 30) {
        cat = 'Obesitas (Obese)';
        points = 5;
        rawCat = '≥30 (Obesitas)';
      }

      const resultObj = {
        bmi: String(valNum).replace('.', ','),
        numericVal: valNum,
        category: cat,
        rawCategory: rawCat,
        points: points,
        weight: w,
        height: parseFloat(bmiHeight),
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
      };

      setBmiResult(resultObj);
      const bmiKey = currentUser?.id ? `nutriwise_bmi_data_${currentUser.id}` : 'nutriwise_bmi_data';
      localStorage.setItem(bmiKey, JSON.stringify(resultObj));

      if (currentUser && isSupabaseConfigured && supabase) {
        try {
          await supabase.auth.updateUser({
            data: { nutriwise_bmi_data: resultObj }
          });
        } catch (err) {
          console.error('Gagal menyimpan BMI ke Supabase:', err);
        }
      }
    }
  };

  // Calculate Calories (Mifflin-St Jeor)
  const handleCalcCalories = (e) => {
    e.preventDefault();
    const w = parseFloat(calWeight);
    const h = parseFloat(calHeight);
    const a = parseFloat(calAge);
    const mult = parseFloat(calActivity);

    if (w > 0 && h > 0 && a > 0) {
      let bmr = (10 * w) + (6.25 * h) - (5 * a);
      bmr = calGender === 'Pria' ? bmr + 5 : bmr - 161;
      const tdee = Math.round(bmr * mult);

      setCalResult({
        calories: tdee,
        bmr: Math.round(bmr)
      });
    }
  };

  // Calculate Water
  const handleCalcWater = (e) => {
    e.preventDefault();
    const w = parseFloat(waterWeight);
    if (w > 0) {
      let baseMl = w * 35;
      if (waterActivity === 'sedang') baseMl += 400;
      if (waterActivity === 'berat') baseMl += 800;

      const liters = (baseMl / 1000).toFixed(1);
      const glasses = Math.round(baseMl / 250);

      setWaterResult({
        liters: liters.replace('.', ','),
        glasses: glasses
      });
    }
  };

  return (
    <section id="kalkulator" className="section container">
      <h2 className="section-title">Kalkulator Kesehatan</h2>
      <p className="section-subtitle">
        Pahami statistik tubuhmu secara personal. Gunakan kalkulator interaktif berbasis algoritma nutrisi klinis untuk memantau indeks massa tubuh, kebutuhan energi, dan hidrasi harian.
      </p>

      <div className="calc-grid">
        {/* Card 1: BMI */}
        <div className="calc-card">
          <div>
            <div className="calc-header">
              <h3 className="calc-title">Indeks Massa Tubuh (BMI)</h3>
            </div>
            <form onSubmit={handleCalcBmi}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Berat (kg)</label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    className="form-input"
                    placeholder="Contoh: 65"
                    value={bmiWeight}
                    onChange={(e) => setBmiWeight(e.target.value < 0 ? '' : e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Tinggi (cm)</label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    className="form-input"
                    placeholder="Contoh: 170"
                    value={bmiHeight}
                    onChange={(e) => setBmiHeight(e.target.value < 0 ? '' : e.target.value)}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn-calc-submit">
                Hitung BMI
              </button>
            </form>
          </div>

          <div className="calc-result-box">
            <div className="result-number">{bmiResult ? bmiResult.bmi : '-'}</div>
            <div className="result-subtitle">{bmiResult ? bmiResult.category : 'Belum dihitung'}</div>

            {/* CTA Button to Quiz after BMI is calculated */}
            {bmiResult && (
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(47, 99, 35, 0.15)' }}>
                <button
                  onClick={onNavigateToQuiz}
                  className="btn-nav-combined"
                  style={{ width: '100%', padding: '10px 16px', fontSize: '0.85rem' }}
                >
                  <span className="btn-text-default" style={{ gap: '6px' }}>
                    <ClipboardCheck size={16} /> Lanjut ke Kuis Skrining PTM
                  </span>
                  <span className="btn-text-hover" style={{ gap: '6px' }}>
                    Lanjut ke Kuis Skrining PTM <ArrowRight size={14} />
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Card 2: Kalori Harian */}
        <div className="calc-card">
          <div>
            <div className="calc-header">
              <h3 className="calc-title">Kebutuhan Kalori Harian</h3>
            </div>
            <form onSubmit={handleCalcCalories}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Berat (kg)</label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    className="form-input"
                    placeholder="Contoh: 65"
                    value={calWeight}
                    onChange={(e) => setCalWeight(e.target.value < 0 ? '' : e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Tinggi (cm)</label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    className="form-input"
                    placeholder="Contoh: 170"
                    value={calHeight}
                    onChange={(e) => setCalHeight(e.target.value < 0 ? '' : e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Usia (Tahun)</label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    className="form-input"
                    placeholder="Contoh: 22"
                    value={calAge}
                    onChange={(e) => setCalAge(e.target.value < 0 ? '' : e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Jenis Kelamin</label>
                  <select
                    className="form-select"
                    value={calGender}
                    onChange={(e) => setCalGender(e.target.value)}
                  >
                    <option value="Pria">Pria</option>
                    <option value="Wanita">Wanita</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Tingkat Aktivitas</label>
                <select
                  className="form-select"
                  value={calActivity}
                  onChange={(e) => setCalActivity(e.target.value)}
                >
                  <option value="1.2">Santai / Jarang Olahraga</option>
                  <option value="1.375">Sedang (3 - 5x/minggu)</option>
                  <option value="1.55">Aktif (6 - 7x/minggu)</option>
                  <option value="1.725">Sangat Aktif (Atlet / Pekerja Fisik)</option>
                </select>
              </div>

              <button type="submit" className="btn-calc-submit">
                Hitung Kalori
              </button>
            </form>
          </div>

          <div className="calc-result-box">
            <div className="result-number">{calResult ? `${calResult.calories} kkal` : '-'}</div>
            <div className="result-subtitle">
              {calResult ? `BMR dasar: ${calResult.bmr} kkal/hari • disesuaikan aktivitas` : 'Belum dihitung'}
            </div>
          </div>
        </div>

        {/* Card 3: Air Harian */}
        <div className="calc-card">
          <div>
            <div className="calc-header">
              <h3 className="calc-title">Kebutuhan Air Harian</h3>
            </div>
            <form onSubmit={handleCalcWater}>
              <div className="form-group">
                <label className="form-label">Berat Badan (kg)</label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  className="form-input"
                  placeholder="Contoh: 65"
                  value={waterWeight}
                  onChange={(e) => setWaterWeight(e.target.value < 0 ? '' : e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tingkat Aktivitas</label>
                <select
                  className="form-select"
                  value={waterActivity}
                  onChange={(e) => setWaterActivity(e.target.value)}
                >
                  <option value="santai">Santai / Minim Gerak</option>
                  <option value="sedang">Sedang (Olahraga Ringan)</option>
                  <option value="berat">Berat (Intens / Cuaca Panas)</option>
                </select>
              </div>

              <button type="submit" className="btn-calc-submit">
                Hitung Kebutuhan Air
              </button>
            </form>
          </div>

          <div className="calc-result-box">
            <div className="result-number">{waterResult ? `${waterResult.liters} liter` : '-'}</div>
            <div className="result-subtitle">
              {waterResult ? `= ${waterResult.glasses} gelas (250 ml) per hari` : 'Belum dihitung'}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
