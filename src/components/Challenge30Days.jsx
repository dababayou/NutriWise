import React, { useState, useEffect, useRef } from 'react';
import { Check, Flame, Trophy, Calendar, Cloud, Lock, X, Plus, Settings, AlertCircle, Clock, Moon, Droplets, Footprints, Salad, Ban, Edit3, Trash2, ArrowRight } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const initialDefaultTargets = [
  { id: 'water', text: 'Minum minimal 2-3 liter air putih', type: 'quantitative', unit: 'Liter', targetVal: 2.5, minGood: 2.0, maxGood: 4.5, icon: 'Droplets', isMandatory: true, frequency: 'daily' },
  { id: 'walk', text: 'Jalan kaki atau aktif bergerak 30 menit', type: 'quantitative', unit: 'Menit', targetVal: 30, minGood: 30, maxGood: 180, icon: 'Footprints', isMandatory: true, frequency: 'daily' },
  { id: 'veggies', text: 'Konsumsi 2 porsi sayur & buah segar', type: 'quantitative', unit: 'Porsi', targetVal: 2, minGood: 2, maxGood: 8, icon: 'Salad', isMandatory: true, frequency: 'daily' },
  { id: 'sleep', text: 'Tidur berkualitas 7-8 jam per malam', type: 'quantitative', unit: 'Jam', targetVal: 7.5, minGood: 7, maxGood: 9, icon: 'Moon', isMandatory: true, frequency: 'daily' },
  { id: 'nosugar', text: 'Hindari minuman manis berlebih', type: 'boolean', targetVal: 1, icon: 'Ban', isMandatory: true, frequency: 'daily' }
];

export default function Challenge30Days({ currentUser, onOpenAuth }) {
  const [setupDone, setSetupDone] = useState(false);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [timezone, setTimezone] = useState('Asia/Jakarta (WIB)');
  const [targets, setTargets] = useState(initialDefaultTargets);
  const [initialTz, setInitialTz] = useState('Asia/Jakarta (WIB)');
  const [initialTargets, setInitialTargets] = useState(initialDefaultTargets);
  const [historyData, setHistoryData] = useState({}); // { '1': { water: 2.5, walk: 30, ... }, '2': ... }
  const [currentDayNum, setCurrentDayNum] = useState(1);
  const [startDate, setStartDate] = useState(() => new Date().toISOString());
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const syncTimeoutRef = useRef(null);

  // New Custom Target Form State
  const [newTargetText, setNewTargetText] = useState('');
  const [newTargetType, setNewTargetType] = useState('quantitative'); // 'quantitative' | 'boolean'
  const [newTargetUnit, setNewTargetUnit] = useState('Kali');
  const [newTargetVal, setNewTargetVal] = useState(1);
  const [newTargetFreq, setNewTargetFreq] = useState('daily'); // 'daily' | 'every_2_days' | 'every_3_days' | 'weekly'
  const [showAddForm, setShowAddForm] = useState(false);

  // Sync refs to avoid stale closures in debounced & unmount cloud persistence
  const historyRef = useRef(historyData);
  const targetsRef = useRef(targets);
  const setupDoneRef = useRef(setupDone);
  const timezoneRef = useRef(timezone);
  const startDateRef = useRef(startDate);

  useEffect(() => { historyRef.current = historyData; }, [historyData]);
  useEffect(() => { targetsRef.current = targets; }, [targets]);
  useEffect(() => { setupDoneRef.current = setupDone; }, [setupDone]);
  useEffect(() => { timezoneRef.current = timezone; }, [timezone]);
  useEffect(() => { startDateRef.current = startDate; }, [startDate]);

  // Load from Supabase / localStorage on mount & currentUser change
  useEffect(() => {
    if (currentUser) {
      const meta = currentUser.user_metadata || {};
      const localHistoryStr = localStorage.getItem('nutriwise_history');
      const localHistory = localHistoryStr ? JSON.parse(localHistoryStr) : null;
      
      const savedTargets = meta.nutriwise_targets || JSON.parse(localStorage.getItem('nutriwise_targets') || 'null');
      // Give priority to local history if populated to prevent stale cloud metadata overwriting unsynced typing
      const savedHistory = localHistory ?? meta.nutriwise_history ?? {};
      const savedSetupDone = meta.nutriwise_setup_done ?? JSON.parse(localStorage.getItem('nutriwise_setup_done') || 'false');
      const savedTz = meta.nutriwise_tz || localStorage.getItem('nutriwise_tz') || 'Asia/Jakarta (WIB)';
      const savedStartDate = meta.nutriwise_start_date || localStorage.getItem('nutriwise_start_date') || new Date().toISOString();

      if (savedTargets) {
        setTargets(savedTargets);
        setInitialTargets(savedTargets);
      } else {
        setInitialTargets(initialDefaultTargets);
      }
      setHistoryData(savedHistory);
      setSetupDone(savedSetupDone);
      setTimezone(savedTz);
      setInitialTz(savedTz);
      setStartDate(savedStartDate);
    } else {
      setSetupDone(false);
      setHistoryData({});
      setTargets(initialDefaultTargets);
      setInitialTargets(initialDefaultTargets);
      setInitialTz('Asia/Jakarta (WIB)');
    }
  }, [currentUser]);

  // Flush pending changes to Supabase when user navigates away or component unmounts
  useEffect(() => {
    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
      if (currentUser && isSupabaseConfigured && supabase) {
        supabase.auth.updateUser({
          data: {
            nutriwise_targets: targetsRef.current,
            nutriwise_history: historyRef.current,
            nutriwise_setup_done: setupDoneRef.current,
            nutriwise_tz: timezoneRef.current,
            nutriwise_start_date: startDateRef.current
          }
        }).catch(err => console.error('Unmount sync to Supabase failed:', err));
      }
    };
  }, [currentUser]);

  const [currentTimeStr, setCurrentTimeStr] = useState('');

  // Live Clock & Real Calendar Day Calculation in Selected Timezone
  useEffect(() => {
    const updateClockAndDay = () => {
      const ianaZone = timezone?.split(' ')[0] || 'Asia/Jakarta';
      let tzAbbr = 'WIB';
      if (ianaZone.includes('Makassar')) tzAbbr = 'WITA';
      if (ianaZone.includes('Jayapura')) tzAbbr = 'WIT';

      const now = new Date();

      // Format time HH.mm (e.g. "03.34 WIB")
      const formatter = new Intl.DateTimeFormat('id-ID', {
        timeZone: ianaZone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      const formattedTime = formatter.format(now).replace(':', '.');
      setCurrentTimeStr(`${formattedTime} ${tzAbbr}`);

      // Calculate calendar day difference relative to start date in selected timezone
      if (startDate) {
        try {
          const yearFormatter = new Intl.DateTimeFormat('en-CA', {
            timeZone: ianaZone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          });

          const startStr = yearFormatter.format(new Date(startDate));
          const nowStr = yearFormatter.format(now);

          const startDateObj = new Date(`${startStr}T00:00:00Z`);
          const nowDateObj = new Date(`${nowStr}T00:00:00Z`);

          const diffMs = nowDateObj.getTime() - startDateObj.getTime();
          const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
          setCurrentDayNum(Math.min(Math.max(diffDays, 1), 30));
        } catch (err) {
          console.error('Error calculating day num:', err);
        }
      }
    };

    updateClockAndDay();
    const timer = setInterval(updateClockAndDay, 1000);
    return () => clearInterval(timer);
  }, [startDate, timezone]);

  // Sync to Cloud / LocalStorage
  const persistState = async (newTargets, newHistory, newSetupDone, newTz, newStart) => {
    setTargets(newTargets);
    setHistoryData(newHistory);
    setSetupDone(newSetupDone);
    setTimezone(newTz);
    if (newStart) setStartDate(newStart);

    localStorage.setItem('nutriwise_targets', JSON.stringify(newTargets));
    localStorage.setItem('nutriwise_history', JSON.stringify(newHistory));
    localStorage.setItem('nutriwise_setup_done', JSON.stringify(newSetupDone));
    localStorage.setItem('nutriwise_tz', newTz);
    if (newStart) localStorage.setItem('nutriwise_start_date', newStart);

    if (currentUser && isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.updateUser({
          data: {
            nutriwise_targets: newTargets,
            nutriwise_history: newHistory,
            nutriwise_setup_done: newSetupDone,
            nutriwise_tz: newTz,
            nutriwise_start_date: newStart || startDate
          }
        });
      } catch (err) {
        console.error('Failed to sync settings to Supabase:', err);
      }
    }
  };

  // Add Custom Target (Staged in React state until Save is clicked)
  const handleAddCustomTarget = (e) => {
    e.preventDefault();
    if (!newTargetText.trim()) return;

    const newTarget = {
      id: 'custom_' + Date.now(),
      text: newTargetText.trim(),
      type: newTargetType,
      unit: newTargetType === 'quantitative' ? newTargetUnit : '',
      targetVal: Number(newTargetVal) || 1,
      minGood: Number(newTargetVal) || 1,
      maxGood: Number(newTargetVal) * 2 || 2,
      isMandatory: false,
      frequency: newTargetFreq,
      icon: 'Check'
    };

    setTargets(prev => [...prev, newTarget]);
    setNewTargetText('');
    setShowAddForm(false);
  };

  // Delete Custom Target (Staged in React state until Save is clicked)
  const handleDeleteTarget = (id) => {
    setTargets(prev => prev.filter(t => t.id !== id || t.isMandatory));
  };

  // Cancel Setup Changes (Revert back to initial saved state)
  const handleCancelSetup = () => {
    setTargets(initialTargets);
    setTimezone(initialTz);
    setShowSetupModal(false);
  };

  // Update Today's Target Entry (Debounced Cloud Sync to prevent input drops when typing fast)
  const handleUpdateTargetValue = (dayNum, targetId, val) => {
    if (!currentUser) {
      setShowAuthPrompt(true);
      return;
    }

    setHistoryData((prevHistory) => {
      const dayEntry = prevHistory[dayNum] || {};
      const updatedHistory = {
        ...prevHistory,
        [dayNum]: {
          ...dayEntry,
          [targetId]: val
        }
      };

      // 1. Write to localStorage immediately for instant UI responsiveness
      localStorage.setItem('nutriwise_history', JSON.stringify(updatedHistory));

      // 2. Debounce cloud sync to Supabase (400ms delay) so rapid typing stays smooth
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
      syncTimeoutRef.current = setTimeout(async () => {
        if (currentUser && isSupabaseConfigured && supabase) {
          try {
            await supabase.auth.updateUser({
              data: {
                nutriwise_targets: targetsRef.current,
                nutriwise_history: updatedHistory,
                nutriwise_setup_done: setupDoneRef.current,
                nutriwise_tz: timezoneRef.current,
                nutriwise_start_date: startDateRef.current
              }
            });
          } catch (err) {
            console.error('Failed to sync history to Supabase:', err);
          }
        }
      }, 400);

      return updatedHistory;
    });
  };

  // Evaluate Target Status for a Day based on Ideal Healthy Ranges
  // Returns: 'green' (Ideal/Selesai), 'yellow' (Kurang / Melebihi Batas Aman), 'red' (Belum Dikerjakan/0), 'none' (Kosong)
  const evaluateTargetStatus = (target, val) => {
    if (val === undefined || val === null || val === '') return 'none';

    if (target.type === 'boolean') {
      return val ? 'green' : 'red';
    }

    const num = Number(val);
    if (isNaN(num)) return 'none';
    if (num <= 0) return 'red';

    // Determine healthy thresholds (minGood to maxGood)
    let minG = target.minGood ?? target.targetVal;
    let maxG = target.maxGood ?? (target.targetVal * 2.5);

    // Standard medical & nutritional guidelines:
    if (target.id === 'water') {
      minG = 2.0;
      maxG = 4.5; // Overhydration warning above 4.5 L daily
    } else if (target.id === 'walk') {
      minG = 30;
      maxG = 180; // Overtraining / physical exertion warning above 180 mins daily
    } else if (target.id === 'veggies') {
      minG = 2;
      maxG = 8; // Digestive excess warning above 8 portions daily
    } else if (target.id === 'sleep') {
      minG = 7.0;
      maxG = 9.0; // Deprivation (< 7h) or hypersomnia (> 9h) warning
    }

    if (num >= minG && num <= maxG) {
      return 'green';
    } else {
      // Either under the minimum target or exceeds the safe upper limit!
      return 'yellow';
    }
  };

  // Filter Active Targets for a Specific Day based on Frequency
  const getActiveTargetsForDay = (dayNum) => {
    return targets.filter((t) => {
      if (!t.frequency || t.frequency === 'daily') return true;
      if (t.frequency === 'every_2_days') return (dayNum % 2) === 1;
      if (t.frequency === 'every_3_days') return (dayNum % 3) === 1;
      if (t.frequency === 'weekly') return (dayNum % 7) === 1;
      return true;
    });
  };

  // Calculate Overall Day Status & Completion % for Calendar Colors
  const calculateDayStatus = (dayNum) => {
    const activeForDay = getActiveTargetsForDay(dayNum);
    if (activeForDay.length === 0) return { status: 'future', percent: 0 };

    const dayEntry = historyData[dayNum] || {};
    let greenCount = 0;
    let totalAssessed = 0;

    activeForDay.forEach((t) => {
      const val = dayEntry[t.id];
      const res = evaluateTargetStatus(t, val);
      if (res === 'green') greenCount++;
      if (res !== 'none') totalAssessed++;
    });

    const percent = Math.round((greenCount / activeForDay.length) * 100);

    // If day is in the future
    if (dayNum > currentDayNum) {
      return { status: 'future', percent: 0 };
    }

    // Past or Current Day
    if (percent === 100) return { status: 'green', percent };
    if (percent >= 60) return { status: 'yellow', percent };
    if (percent >= 30) return { status: 'orange', percent };
    return { status: 'red', percent };
  };

  // Today's Progress Percentage
  const todayActiveTargets = getActiveTargetsForDay(currentDayNum);
  const todayEntry = historyData[currentDayNum] || {};
  let todayCompletedCount = 0;
  todayActiveTargets.forEach((t) => {
    if (evaluateTargetStatus(t, todayEntry[t.id]) === 'green') {
      todayCompletedCount++;
    }
  });
  const todayProgressPercent = todayActiveTargets.length > 0 
    ? Math.round((todayCompletedCount / todayActiveTargets.length) * 100)
    : 0;

  // Monthly Completed Days Count (Days with 'green' or 'yellow' >= 60%)
  let monthlyCompletedDaysCount = 0;
  for (let d = 1; d <= currentDayNum; d++) {
    const { status } = calculateDayStatus(d);
    if (status === 'green') {
      monthlyCompletedDaysCount++;
    }
  }
  const monthlyProgressPercent = Math.round((monthlyCompletedDaysCount / 30) * 100);

  const handleStartChallenge = () => {
    const newStart = setupDone ? startDate : new Date().toISOString();
    persistState(targets, historyData, true, timezone, newStart);
    setInitialTargets(targets);
    setInitialTz(timezone);
    setShowSetupModal(false);
  };

  const isSetupChanged = timezone !== initialTz || JSON.stringify(targets) !== JSON.stringify(initialTargets);

  return (
    <section id="challenge" className="section container">
      {/* ================= 1. ONBOARDING SETUP UI (if not setup yet or modal open) ================= */}
      {(!setupDone || showSetupModal) ? (
        <div className="challenge-setup-wrapper">
          <div className="setup-header">
            <div className="setup-badge"><Clock size={16} /> Hari ke-{currentDayNum} • {currentTimeStr} • Pengaturan Tantangan</div>
            <h2>Konfigurasi 30-Day Health Challenge Anda</h2>
            <p>Atur target harian, sesuaikan frekuensi, dan atur zona waktu sebelum memulai perjalanan pola hidup sehat 30 hari.</p>
          </div>

          <div className="setup-grid">
            {/* Left Card: Timezone & General Settings */}
            <div className="setup-card">
              <h3><Clock size={20} color="#2F6323" /> 1. Zona Waktu &amp; Jadwal</h3>
              <p className="setup-subtext">Penentuan pergantian hari otomatis disesuaikan dengan zona lokasi Anda.</p>
              
              <div className="form-group" style={{ marginTop: '16px' }}>
                <label className="form-label">Pilih Zona Waktu Anda:</label>
                <select 
                  className="form-input" 
                  value={timezone} 
                  onChange={(e) => setTimezone(e.target.value)}
                >
                  <option value="Asia/Jakarta (WIB)">Asia/Jakarta (WIB - UTC+7)</option>
                  <option value="Asia/Makassar (WITA)">Asia/Makassar (WITA - UTC+8)</option>
                  <option value="Asia/Jayapura (WIT)">Asia/Jayapura (WIT - UTC+9)</option>
                </select>
              </div>
            </div>

            {/* Right Card: Custom Target List Manager */}
            <div className="setup-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3><Edit3 size={20} color="#2F6323" /> 2. Target Harian &amp; Custom</h3>
                <button 
                  type="button" 
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="btn-cta-outline"
                  style={{ padding: '6px 12px', fontSize: '0.82rem' }}
                >
                  <Plus size={16} /> Tambah Target
                </button>
              </div>

              {/* Add Custom Form */}
              {showAddForm && (
                <form onSubmit={handleAddCustomTarget} className="add-target-box">
                  <h4 style={{ fontSize: '0.9rem', marginBottom: '10px' }}>Buat Target Baru</h4>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Nama target (misal: Segelas Jus Alpukat)"
                    value={newTargetText}
                    onChange={(e) => setNewTargetText(e.target.value)}
                    required
                    style={{ marginBottom: '10px' }}
                  />

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                    <div>
                      <label className="form-label">Tipe Target</label>
                      <select className="form-input" value={newTargetType} onChange={(e) => setNewTargetType(e.target.value)}>
                        <option value="quantitative">Hitung Angka</option>
                        <option value="boolean">Ya / Tidak</option>
                      </select>
                    </div>

                    {newTargetType === 'quantitative' && (
                      <div>
                        <label className="form-label">Satuan</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Liter, Menit, Porsi, dll"
                          value={newTargetUnit}
                          onChange={(e) => setNewTargetUnit(e.target.value)}
                        />
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                    <div>
                      <label className="form-label">Nilai Target</label>
                      <input
                        type="number"
                        className="form-input"
                        value={newTargetVal}
                        onChange={(e) => setNewTargetVal(e.target.value)}
                        min="1"
                      />
                    </div>

                    <div>
                      <label className="form-label">Frekuensi Tampil</label>
                      <select className="form-input" value={newTargetFreq} onChange={(e) => setNewTargetFreq(e.target.value)}>
                        <option value="daily">Setiap Hari</option>
                        <option value="every_2_days">Selang 2 Hari</option>
                        <option value="every_3_days">Selang 3 Hari</option>
                        <option value="weekly">1x Seminggu</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button type="button" onClick={() => setShowAddForm(false)} className="btn-cta-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Batal</button>
                    <button
                      type="submit"
                      className="btn-auth-primary"
                      disabled={!newTargetText.trim()}
                      style={{
                        padding: '6px 16px',
                        fontSize: '0.8rem',
                        opacity: !newTargetText.trim() ? 0.45 : 1,
                        cursor: !newTargetText.trim() ? 'not-allowed' : 'pointer',
                        pointerEvents: !newTargetText.trim() ? 'none' : 'auto'
                      }}
                    >
                      Simpan Target
                    </button>
                  </div>
                </form>
              )}

              {/* Target Items List */}
              <div className="setup-targets-list">
                {targets.map((t) => (
                  <div key={t.id} className="setup-target-item">
                    <div>
                      <div className="target-item-title">
                        {t.text} {t.isMandatory && <span className="mandatory-badge">Wajib</span>}
                      </div>
                      <div className="target-item-meta">
                        {t.type === 'quantitative' ? `Target: ${t.targetVal} ${t.unit}` : 'Target: Ya/Tidak'} • Frekuensi: {
                          t.frequency === 'every_2_days' ? '2 Hari Sekali' :
                          t.frequency === 'every_3_days' ? '3 Hari Sekali' :
                          t.frequency === 'weekly' ? 'Mingguan' : 'Harian'
                        }
                      </div>
                    </div>

                    {!t.isMandatory && (
                      <button onClick={() => handleDeleteTarget(t.id)} className="btn-delete-target" title="Hapus target">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="setup-ready-footer">
            {setupDone && (
              <button onClick={handleCancelSetup} className="btn-danger-outline">
                Batal
              </button>
            )}
            <button
              onClick={handleStartChallenge}
              className="btn-nav-combined"
              disabled={setupDone && !isSetupChanged}
              style={{
                minWidth: '200px',
                opacity: setupDone && !isSetupChanged ? 0.45 : 1,
                cursor: setupDone && !isSetupChanged ? 'not-allowed' : 'pointer',
                pointerEvents: setupDone && !isSetupChanged ? 'none' : 'auto'
              }}
            >
              <span className="btn-text-default">{setupDone ? 'Simpan Perubahan' : 'Siap, Mulai Tantangan!'}</span>
              <span className="btn-text-hover">{setupDone ? 'Simpan Perubahan' : 'Siap, Mulai Tantangan!'}</span>
            </button>
          </div>
        </div>
      ) : (
        /* ================= 2. ACTIVE CHALLENGE DASHBOARD UI (Matches cal.png layout) ================= */
        <div className="challenge-card main-challenge-card">
          {!currentUser && (
            <div className="preview-mode-banner">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Lock size={20} color="#2F6323" />
                <span>Mode Pratinjau: Masuk atau daftar akun untuk menyimpan progres Anda.</span>
              </div>
              <button onClick={() => setShowAuthPrompt(true)} className="btn-nav-combined" style={{ height: '36px', minWidth: '140px', fontSize: '0.85rem' }}>
                <span className="btn-text-default">Masuk / Daftar</span>
                <span className="btn-text-hover">Masuk / Daftar</span>
              </button>
            </div>
          )}

          {/* Section Header */}
          <div className="challenge-title-row">
            <div>
              <div className="challenge-live-clock-badge">
                <Clock size={16} /> Hari ke-{currentDayNum} • {currentTimeStr}
              </div>
              <h2 className="challenge-hero-title">Kemajuan Tantangan Sehat</h2>
              <p className="today-progress-sublabel">Progress Hari Ini ({todayProgressPercent}%)</p>
            </div>

            <button 
              onClick={() => setShowSetupModal(true)} 
              className="btn-cta-outline"
              style={{ padding: '8px 16px', fontSize: '0.85rem', gap: '6px' }}
            >
              <Settings size={16} /> Pengaturan Tantangan
            </button>
          </div>

          {/* Today's Separated Progress Bar */}
          <div className="progress-bar-bg today-progress-bar">
            <div className="progress-bar-fill" style={{ width: `${todayProgressPercent}%` }}></div>
          </div>

          {/* Subtitle: Target Hari Ini */}
          <h3 className="section-sub-title">Target Hari Ini (Hari ke-{currentDayNum} • {currentTimeStr})</h3>

          {/* Today's Target Input Grid */}
          <div className="target-input-grid">
            {todayActiveTargets.map((target) => {
              const currentVal = todayEntry[target.id] ?? '';
              const evalStatus = evaluateTargetStatus(target, currentVal);

              return (
                <div key={target.id} className={`target-input-card status-${evalStatus}`}>
                  <div className="target-card-top">
                    <span className="target-card-title">{target.text}</span>
                    <span className={`status-pill pill-${evalStatus}`}>
                      {evalStatus === 'green' && '✓ Selesai'}
                      {evalStatus === 'yellow' && '~ Warning'}
                      {evalStatus === 'red' && '✗ Belum'}
                      {evalStatus === 'none' && 'Isi Target'}
                    </span>
                  </div>

                  <div className="target-card-body">
                    {target.type === 'quantitative' ? (
                      <div className="quantitative-input-row">
                        <input
                          type="number"
                          step="0.5"
                          className="form-input quant-input"
                          placeholder={`Misal ${target.targetVal}`}
                          value={currentVal}
                          onChange={(e) => handleUpdateTargetValue(currentDayNum, target.id, e.target.value)}
                        />
                        <span className="quant-unit">{target.unit}</span>
                      </div>
                    ) : (
                      <div className="boolean-input-row">
                        <button
                          type="button"
                          onClick={() => handleUpdateTargetValue(currentDayNum, target.id, true)}
                          className={`btn-bool ${currentVal === true ? 'active-yes' : ''}`}
                        >
                          ✓ Ya (Selesai)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateTargetValue(currentDayNum, target.id, false)}
                          className={`btn-bool ${currentVal === false ? 'active-no' : ''}`}
                        >
                          ✗ Tidak
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Subtitle: Kalender 30 Hari */}
          <div style={{ marginTop: '36px', marginBottom: '16px' }}>
            <h3 className="section-sub-title">Kalender 30 hari</h3>
          </div>

          {/* Auto-Colored 30 Day Grid */}
          <div className="calendar-grid-30">
            {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
              const { status, percent } = calculateDayStatus(day);
              const isToday = day === currentDayNum;

              return (
                <div
                  key={day}
                  className={`calendar-day-box status-${status} ${isToday ? 'is-today' : ''}`}
                  title={`Hari ${day}: ${percent}% Terpenuhi`}
                >
                  <span className="day-label">H-{day}</span>
                  <div className="day-icon-wrap">
                    {status === 'green' && <Check size={18} color="#059669" />}
                    {status === 'yellow' && <span className="day-symbol yellow">~</span>}
                    {status === 'orange' && <span className="day-symbol orange">-</span>}
                    {status === 'red' && <span className="day-symbol red">✕</span>}
                    {status === 'future' && <Calendar size={16} opacity={0.35} />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Monthly Separated Progress Bar */}
          <div className="monthly-progress-section">
            <p className="monthly-progress-text">
              {monthlyCompletedDaysCount} dari 30 hari selesai ({monthlyProgressPercent}%)
            </p>
            <div className="progress-bar-bg monthly-progress-bar">
              <div className="progress-bar-fill" style={{ width: `${monthlyProgressPercent}%` }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Login Prompt Modal */}
      {showAuthPrompt && (
        <div className="modal-overlay" onClick={() => setShowAuthPrompt(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '460px', textAlign: 'center', padding: '36px 32px' }}>
            <button className="modal-close" onClick={() => setShowAuthPrompt(false)}>
              <X size={20} />
            </button>
            <div style={{ width: '64px', height: '64px', background: 'rgba(47, 99, 35, 0.12)', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Lock color="#2F6323" size={32} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '10px', color: 'var(--color-dark)' }}>
              Akses Fitur Terkunci
            </h3>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px' }}>
              Silakan <strong>Masuk</strong> atau <strong>Daftar Akun NutriWise</strong> terlebih dahulu untuk mengaktifkan pelacak harian 30-Day Health Challenge.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={() => setShowAuthPrompt(false)} className="btn-cta-outline">Nanti Saja</button>
              <button onClick={() => { setShowAuthPrompt(false); if (onOpenAuth) onOpenAuth(); }} className="btn-nav-combined">
                <span className="btn-text-default">Masuk / Daftar</span>
                <span className="btn-text-hover">Masuk / Daftar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
