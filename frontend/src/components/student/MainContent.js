import React, { useState } from 'react';
import '../../styles/student/MainContent.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

const performanceData = [
  { name: 'Mon', overall: 80, today: 60 },
  { name: 'Tue', overall: 78, today: 65 },
  { name: 'Wed', overall: 82, today: 70 },
  { name: 'Thu', overall: 85, today: 50 },
  { name: 'Fri', overall: 88, today: 75 },
  { name: 'Sat', overall: 90, today: 80 },
  { name: 'Sun', overall: 92, today: 85 },
];

const subjectData = [
  { subject: 'Science', score: 59, color: '#4a148c' },
  { subject: 'History', score: 95, color: '#6a1b9a' },
  { subject: 'Math', score: 77, color: '#2e7d32' },
  { subject: 'English', score: 30, color: '#1565c0' },
  { subject: 'Art', score: 85, color: '#e65100' },
];

const emotions = [
  { label: 'Happy', emoji: '😃', color: '#ffd54f', message: "Yay! Keep spreading your happiness!" },
  { label: 'Angry', emoji: '😡', color: '#ff6b6b', message: "It's okay to feel angry. Try some deep breaths." },
  { label: 'Anxious', emoji: '😰', color: '#4fc3f7', message: "Feeling anxious? Take a moment to pause and relax." },
  { label: 'Bored', emoji: '😐', color: '#bdbdbd', message: "Boredom can be a sign to try something new!" },
  { label: 'Disgust', emoji: '🤢', color: '#81c784', message: "Disgust is a valid feeling. Take care of yourself." },
  { label: 'Fear', emoji: '😨', color: '#9575cd', message: "It's normal to feel fear. You're not alone." },
  { label: 'Neutral', emoji: '🙂', color: '#ffe082', message: "Feeling neutral is perfectly fine." },
  { label: 'Sad', emoji: '😔', color: '#90caf9', message: "It's okay to feel sad. Be kind to yourself." },
  { label: 'Surprised', emoji: '😯', color: '#ffb74d', message: "Surprises can be exciting! Embrace the moment." },
];

const funFacts = [
  {
    icon: 'https://img.icons8.com/color/96/000000/meal.png',
    alt: 'Food',
    fact: 'Did you know? The world\'s most expensive pizza costs over $12,000 and takes 72 hours to make!',
    bg: 'linear-gradient(135deg, #f9d423 0%, #ff4e50 100%)',
    tooltip: 'Click for a food fact!',
    emoji: '🍕'
  },
  {
    icon: 'https://img.icons8.com/color/96/000000/panda.png',
    alt: 'Animal',
    fact: 'Pandas spend up to 14 hours a day eating bamboo!',
    bg: 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)',
    tooltip: 'Click for an animal fact!',
    emoji: '🐼'
  },
  {
    icon: 'https://img.icons8.com/color/96/000000/sports.png',
    alt: 'Sports',
    fact: 'The Olympic Games were originally a religious festival in honor of Zeus.',
    bg: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)',
    tooltip: 'Click for a sports fact!',
    emoji: '🏅'
  }
];

const MainContent = ({ selectedNav }) => {
  const [selectedEmotion, setSelectedEmotion] = useState(0);
  const [thoughts, setThoughts] = useState("");
  const [hoveredEmotion, setHoveredEmotion] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [openFactIndex, setOpenFactIndex] = useState(null);
  const [hoveredFact, setHoveredFact] = useState(null);



  const handleSliderChange = (e) => {
    const idx = Number(e.target.value);
    setSelectedEmotion(idx);
  };

  const handleThoughtsChange = (e) => {
    setThoughts(e.target.value);
  };



  // Confetti SVGs (simple, lightweight)
  const Confetti = () => (
    <div className="confetti">
      {[...Array(18)].map((_, i) => (
        <span key={i} className={`confetti-piece confetti-piece-${i % 6}`}></span>
      ))}
    </div>
  );

  // Play sound effect (optional, requires a sound file in public/)
  const playSound = () => {
    const audio = new window.Audio('/success.mp3');
    audio.play();
  };

  // Show confetti and play sound when a fun fact is opened
  const handleOpenFact = (idx) => {
    setOpenFactIndex(idx);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 1200);
    // playSound(); // Uncomment if you add a sound file
  };

  const CustomBar = (props) => {
    const { x, y, width, height, payload } = props;
    
    // Add safety checks
    if (!payload || payload.index === undefined || !subjectData[payload.index]) {
      return null;
    }
    
    const data = subjectData[payload.index];
    return (
      <g>
        <rect
          x={x - 2}
          y={y}
          width={width + 4}
          height={height}
          fill={data.color || '#7b1fa2'}
          rx={6}
          stroke="#000000"
          strokeWidth="2"
        />
        <text
          x={x + width / 2}
          y={y - 8}
          textAnchor="middle"
          fontSize="14"
          fill="#000000"
          fontWeight="bold"
        >
          PT
        </text>
      </g>
    );
  };



  return (
    <main className="student-main-content">
      <div className="student-content-grid">
        <div className="content-box">
          <div className="emotion-checkin-container">
            <h2 className="emotion-title">HOW ARE YOU FEELING TODAY?</h2>
            <div className="emotion-subtitle">
              Feelings & Emotions come in all shapes and sizes. Slide the dot to match how you are doing now.
            </div>
            <div className="emotion-slider-row">
              {emotions.map((emotion, idx) => (
                <div
                  key={emotion.label}
                  className={`emotion-emoji-label${selectedEmotion === idx ? ' selected' : ''}`}
                  style={{
                    background: selectedEmotion === idx ? `${emotion.color}22` : '#f6e7ff',
                    boxShadow: hoveredEmotion === idx ? `0 0 0 4px ${emotion.color}55` : undefined,
                    borderRadius: 12,
                    transition: 'background 0.2s, box-shadow 0.2s',
                  }}
                  onMouseEnter={() => setHoveredEmotion(idx)}
                  onMouseLeave={() => setHoveredEmotion(null)}
                >
                  <div
                    className="emotion-emoji"
                    style={{
                      filter: hoveredEmotion === idx ? 'brightness(1.15)' : 'none',
                      transform: hoveredEmotion === idx ? 'scale(1.18)' : selectedEmotion === idx ? 'scale(1.12)' : 'scale(1)',
                      boxShadow: selectedEmotion === idx ? `0 2px 8px ${emotion.color}99` : undefined,
                      border: selectedEmotion === idx ? `2px solid ${emotion.color}` : '2px solid transparent',
                      background: selectedEmotion === idx ? '#fff' : 'inherit',
                      transition: 'all 0.2s',
                    }}
                  >
                    {emotion.emoji}
                  </div>
                  {/* Tooltip */}
                  {hoveredEmotion === idx && (
                    <div className="emotion-tooltip">{emotion.message}</div>
                  )}
                </div>
              ))}
            </div>
            <input
              type="range"
              min="0"
              max={emotions.length - 1}
              value={selectedEmotion}
              onChange={handleSliderChange}
              className="emotion-slider"
              style={{
                accentColor: emotions[selectedEmotion].color,
                background: `linear-gradient(90deg, ${emotions[selectedEmotion].color} 0%, #f7c6ff 100%)`,
                transition: 'background 0.3s',
              }}
            />
            {/* Live feedback message */}
            <div className="emotion-feedback" style={{ color: emotions[selectedEmotion].color }}>
              {emotions[selectedEmotion].message}
            </div>
            <div className="emotion-thoughts-box">
              <label htmlFor="thoughts-textarea" className="emotion-thoughts-label">
                What is on your mind today?
              </label>
              <textarea
                id="thoughts-textarea"
                className="emotion-thoughts-textarea"
                value={thoughts}
                onChange={handleThoughtsChange}
                placeholder="Type your thoughts..."
                rows={2}
              />
            </div>
          </div>
        </div>
        <div className="content-box">
          <div className="performance-metrics-container">
            <div className="performance-metrics-title">Performance Metrics</div>
            <div className="performance-metrics-chart">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData} margin={{ top: 20, right: 20, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[50, 100]} />
                  <Tooltip />
                  <Legend verticalAlign="top" height={36} />
                  <Line type="monotone" dataKey="overall" stroke="#2ecc71" strokeWidth={3} dot={{ r: 4 }} name="Overall Performance" />
                  <Line type="monotone" dataKey="today" stroke="#9b59b6" strokeWidth={3} dot={{ r: 4 }} name="Today's Session" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="content-box">
          <div className="rewards-container">
            <h3 className="rewards-title">REWARDS & FUN FACTS</h3>
            <div className="rewards-content">
              <div className="fun-facts-section">
                <h4 className="fun-facts-title">Fun Facts:</h4>
                <div className="icon-row" style={{ justifyContent: 'center', marginTop: '18px' }}>
                  {funFacts.map((fact, idx) => (
                    <div
                      className={`icon-square${hoveredFact === idx ? ' icon-hovered' : ''}`}
                      key={fact.alt}
                      style={{ cursor: 'pointer', background: fact.bg, position: 'relative' }}
                      onClick={() => handleOpenFact(idx)}
                      onMouseEnter={() => setHoveredFact(idx)}
                      onMouseLeave={() => setHoveredFact(null)}
                    >
                      <img src={fact.icon} alt={fact.alt} className="icon-img" />
                      {hoveredFact === idx && (
                        <div className="icon-tooltip">{fact.tooltip}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {openFactIndex !== null && (
              <>
                {showConfetti && (
                  <div className="confetti">
                    {[...Array(18)].map((_, i) => (
                      <span key={i} className={`confetti-piece confetti-piece-${i % 6}`}></span>
                    ))}
                  </div>
                )}
                <div className="gift-popup-overlay" onClick={() => setOpenFactIndex(null)}>
                  <div className="gift-popup" onClick={e => e.stopPropagation()}>
                    <button className="gift-popup-close" onClick={() => setOpenFactIndex(null)}>&times;</button>
                    <div className="gift-popup-content">
                      <h4 style={{ fontSize: '2rem' }}>{funFacts[openFactIndex].emoji} Fun Fact!</h4>
                      <p>{funFacts[openFactIndex].fact}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="content-box">
          <div className="subject-ranking-container">
            <h3 className="subject-ranking-title">Subject Ranking based on Quiz Scores</h3>
            
            <div style={{ width: '100%', height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectData} margin={{ top: 20, right: 10, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="subject" />
                  <YAxis domain={[0, 100]} />
                  <Bar dataKey="score" shape={<CustomBar />} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MainContent; 