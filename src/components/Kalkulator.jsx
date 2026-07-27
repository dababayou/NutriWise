import React, { useState } from 'react';

export default function Kalkulator() {
  // BMI State
  const [bmiWeight, setBmiWeight] = useState(67);
  const [bmiHeight, setBmiHeight] = useState(170);
  const [bmiResult, setBmiResult] = useState({ bmi: '23,2', category: 'Berat Badan Normal / Sehat' });

  // Calorie State
  const [calWeight, setCalWeight] = useState(67);
  const [calHeight, setCalHeight] = useState(170);
  const [calAge, setCalAge] = useState(22);
  const [calGender, setCalGender] = useState('Pria');
  const [calActivity, setCalActivity] = useState('1.375'); // Ringan-Sedang
  const [calResult, setCalResult] = useState({ calories: 2222, bmr: 1616 });

  // Water State
  const [waterWeight, setWaterWeight] = useState(67);
  const [waterActivity, setWaterActivity] = useState('santai');
  const [waterResult, setWaterResult] = useState({ liters: '2,5', glasses: 10 });

  // Calculate BMI
  const handleCalcBmi = (e) => {
    e.preventDefault();
    const w = parseFloat(bmiWeight);
    const h = parseFloat(bmiHeight) / 100;
    if (w > 0 && h > 0) {
      const val = (w / (h * h)).toFixed(1);
      let cat = 'Normal / Sehat';
      if (val < 18.5) cat = 'Kurus / Berat Kurang';
      else if (val >= 25 && val < 29.9) cat = 'Kelebihan Berat Badan';
      else if (val >= 30) cat = 'Obesitas';

      setBmiResult({
        bmi: val.replace('.', ','),
        category: cat
      });
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
      // Base: 35ml per kg
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
              <h3 className="calc-title">Indeks Massa Tubuh</h3>
            </div>
            <form onSubmit={handleCalcBmi}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Berat (kg)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={bmiWeight}
                    onChange={(e) => setBmiWeight(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Tinggi (cm)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={bmiHeight}
                    onChange={(e) => setBmiHeight(e.target.value)}
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
            <div className="result-number">{bmiResult.bmi}</div>
            <div className="result-subtitle">{bmiResult.category}</div>
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
                    className="form-input"
                    value={calWeight}
                    onChange={(e) => setCalWeight(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Tinggi (cm)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={calHeight}
                    onChange={(e) => setCalHeight(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Usia (Tahun)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={calAge}
                    onChange={(e) => setCalAge(e.target.value)}
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
            <div className="result-number">{calResult.calories} kkal</div>
            <div className="result-subtitle">
              BMR dasar: {calResult.bmr} kkal/hari • disesuaikan aktivitas
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
                  className="form-input"
                  value={waterWeight}
                  onChange={(e) => setWaterWeight(e.target.value)}
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
            <div className="result-number">{waterResult.liters} liter</div>
            <div className="result-subtitle">
              = {waterResult.glasses} gelas (250 ml) per hari
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
