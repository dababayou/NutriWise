import React, { useState, useEffect } from 'react';
import { Check, Flame, Trophy, Calendar } from 'lucide-react';

const defaultHabits = [
  { id: 'water', text: 'Minum minimal 2-3 liter air putih' },
  { id: 'walk', text: 'Jalan kaki atau aktif bergerak 30 menit' },
  { id: 'veggies', text: 'Konsumsi 2 porsi sayur & buah segar' },
  { id: 'sleep', text: 'Tidur berkualitas 7-8 jam per malam' },
  { id: 'nosugar', text: 'Hindari minuman manis berlebih' }
];

export default function Challenge30Days() {
  const [completedDays, setCompletedDays] = useState(() => {
    const saved = localStorage.getItem('nutriwise_days');
    return saved ? JSON.parse(saved) : [1, 2, 3];
  });

  const [todayHabits, setTodayHabits] = useState(() => {
    const saved = localStorage.getItem('nutriwise_today_habits');
    return saved ? JSON.parse(saved) : { water: true, walk: true };
  });

  useEffect(() => {
    localStorage.setItem('nutriwise_days', JSON.stringify(completedDays));
  }, [completedDays]);

  useEffect(() => {
    localStorage.setItem('nutriwise_today_habits', JSON.stringify(todayHabits));
  }, [todayHabits]);

  const toggleHabit = (id) => {
    setTodayHabits(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const progressPercent = Math.round((completedDays.length / 30) * 100);

  const toggleDayComplete = (dayNum) => {
    setCompletedDays(prev => {
      if (prev.includes(dayNum)) {
        return prev.filter(d => d !== dayNum);
      } else {
        return [...prev, dayNum];
      }
    });
  };

  return (
    <section id="challenge" className="section container">
      <h2 className="section-title">30-Day Health Challenge</h2>
      <p className="section-subtitle">
        Bangun kebiasaan sehat berkelanjutan secara bertahap. Lacak kemajuan harianmu selama 30 hari untuk mencapai tubuh yang lebih fit, segar, dan berenergi.
      </p>

      <div className="challenge-card">
        <div className="progress-header">
          <div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 700 }}>
              Kemajuan Tantangan Sehat
            </h3>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>
              {completedDays.length} dari 30 Hari Selesai ({progressPercent}%)
            </p>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--color-cream)', padding: '8px 16px', borderRadius: '30px', fontWeight: 700, color: 'var(--color-forest)' }}>
              <Flame color="#FF6B6B" size={20} />
              Streak: {completedDays.length} Hari
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--color-cream)', padding: '8px 16px', borderRadius: '30px', fontWeight: 700, color: 'var(--color-forest)' }}>
              <Trophy color="#FFB800" size={20} />
              Level: Pejuang Sehat
            </div>
          </div>
        </div>

        <div className="progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
        </div>

        <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', marginBottom: '16px', marginTop: '32px' }}>
          Target Harian Hari Ini
        </h4>

        <div className="task-grid">
          {defaultHabits.map((habit) => {
            const isChecked = !!todayHabits[habit.id];
            return (
              <div 
                key={habit.id} 
                className={`task-item ${isChecked ? 'completed' : ''}`}
                onClick={() => toggleHabit(habit.id)}
              >
                <div className="task-checkbox">
                  {isChecked && <Check size={16} />}
                </div>
                <span className="task-text">{habit.text}</span>
              </div>
            );
          })}
        </div>

        <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', marginBottom: '16px', marginTop: '40px' }}>
          Kalender 30 Hari
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))', gap: '10px' }}>
          {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
            const isDone = completedDays.includes(day);
            return (
              <button
                key={day}
                onClick={() => toggleDayComplete(day)}
                style={{
                  padding: '12px 6px',
                  borderRadius: '12px',
                  border: isDone ? 'none' : '1px solid #E2E8F0',
                  backgroundColor: isDone ? 'var(--color-forest)' : '#FAF9F6',
                  color: isDone ? '#FFFFFF' : 'var(--color-dark)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span>H-{day}</span>
                {isDone ? <Check size={14} /> : <Calendar size={14} opacity={0.4} />}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
