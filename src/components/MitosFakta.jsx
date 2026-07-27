import React, { useState } from 'react';
import { RotateCw } from 'lucide-react';

const mythData = [
  {
    id: 1,
    question: "Minum air es bisa membuat badan cepat gemuk?",
    type: "MITOS",
    explanation: "Air putih mengandung 0 kalori. Suhu air tidak memicu penumpukan lemak dalam tubuh. Kalori dingin dari air es justru dibakar oleh tubuh untuk menyamakan suhu tubuh dasar."
  },
  {
    id: 2,
    question: "Melewatkan sarapan adalah cara efektif untuk diet cepat?",
    type: "MITOS",
    explanation: "Melewatkan sarapan sering kali memicu rasa lapar berlebih di siang hari, sehingga cenderung mengonsumsi makanan tinggi gula & lemak secara berlebihan."
  },
  {
    id: 3,
    question: "Buah-buahan aman dikonsumsi tanpa batas saat diet?",
    type: "MITOS",
    explanation: "Meskipun sehat dan kaya serat, buah mengandung fruktosa (gula alami). Konsumsi buah berlebihan tetap menyumbang kalori yang dapat menambah berat badan."
  },
  {
    id: 4,
    question: "Makan malam di atas jam 7 malam otomatis bikin gemuk?",
    type: "MITOS",
    explanation: "Peningkatan berat badan ditentukan oleh total kalori harian, bukan jam makan. Namun, makan dekat waktu tidur dapat mengganggu kualitas pencernaan dan tidur."
  },
  {
    id: 5,
    question: "Detox jus buah/sayur efektif membersihkan racun dalam tubuh?",
    type: "MITOS",
    explanation: "Tubuh manusia sudah memiliki organ ginjal dan hati yang bekerja 24 jam untuk mendetoksifikasi racun secara alami tanpa membutuhkan diet jus ekstrem."
  },
  {
    id: 6,
    question: "Minum air putih minimal 2 liter sehari mendukung metabolisme?",
    type: "FAKTA",
    explanation: "Hidrasi yang cukup menjaga fungsi ginjal, membantu transportasi nutrisi, menjaga elastisitas kulit, serta meningkatkan efisiensi metabolisme energi tubuh."
  }
];

export default function MitosFakta() {
  const [flippedCards, setFlippedCards] = useState({});

  const toggleFlip = (id) => {
    setFlippedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <section id="mitos-fakta" className="section container">
      <h2 className="section-title">Mitos vs Fakta</h2>
      <p className="section-subtitle">
        Pelajari kebenaran di balik berbagai anggapan nutrisi populer. Klik pada kartu untuk membuka fakta medis dan bukti ilmiah yang valid.
      </p>

      <div className="myth-grid">
        {mythData.map((item) => {
          const isFlipped = !!flippedCards[item.id];
          return (
            <div 
              key={item.id} 
              className={`flip-card-container ${isFlipped ? 'flipped' : ''}`}
              onClick={() => toggleFlip(item.id)}
            >
              <div className="flip-card-inner">
                {/* Front Card */}
                <div className="flip-card-front">
                  <div className="flip-card-icon">
                    <RotateCw className="spin-svg" size={28} />
                  </div>
                  
                  <h3 className="flip-card-question">
                    {item.question}
                  </h3>

                  <div className="flip-card-hover-hint">
                    klik untuk lihat jawaban
                  </div>
                </div>

                {/* Back Card */}
                <div className="flip-card-back">
                  <div className="flip-card-icon" style={{ cursor: 'pointer' }}>
                    <RotateCw color="#FFFFFF" size={28} />
                  </div>

                  <div>
                    <span className={`badge-tag ${item.type.toLowerCase()}`}>
                      {item.type}
                    </span>
                    <h4 className="back-heading">Penjelasan:</h4>
                    <p className="back-explanation">
                      {item.explanation}
                    </p>
                  </div>

                  <div style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.5)', marginTop: '20px' }}>
                    Klik kartu untuk membalik kembali
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
