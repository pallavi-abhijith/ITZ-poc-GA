import React, { useState } from 'react';

export default function QuizDashboard({ onStartNewQuiz }) {
  const [selectedEmoji, setSelectedEmoji] = useState(2); // Third emoji (slightly sad)
  const [thoughts, setThoughts] = useState('');

  const emojis = ['😊', '😌', '😔', '😐', '😕', '😟', '😣', '😖', '😫', '😭'];

  return (
    <div className="quiz-dashboard">
      {/* Top Header Bar */}
      <div className="quiz-dashboard-header">
        <div className="quiz-dashboard-header-content">
          <div className="quiz-dashboard-title">
            <div className="quiz-dashboard-brand">In The Zone</div>
            <div className="quiz-dashboard-tagline">Empowering ADHD students through AI powered personalized support.</div>
          </div>
          <div className="quiz-dashboard-nav">
            <div className="quiz-dashboard-nav-item active">
              <span>📊</span>
              <span>Dashboard</span>
            </div>
            <div className="quiz-dashboard-nav-item">
              <span>🎓</span>
              <span>Start Learning</span>
            </div>
            <div className="quiz-dashboard-nav-item">
              <span>⚙️</span>
              <span>Settings</span>
            </div>
            <div className="quiz-dashboard-nav-item">
              <span>🚪</span>
              <span>Logout</span>
            </div>
          </div>
        </div>
      </div>

      <div className="quiz-dashboard-content">
        {/* Left Panel - User Profile */}
        <div className="quiz-dashboard-sidebar">
          <div className="quiz-dashboard-profile">
            <h1 className="quiz-dashboard-username">Varun Rao</h1>
            
            {/* Panda Avatar */}
            <div className="quiz-dashboard-avatar">
              <div className="quiz-dashboard-avatar-container">
                🐼
                <div className="quiz-dashboard-avatar-border"></div>
              </div>
            </div>
            
            <div className="quiz-dashboard-user-info">
              <div className="quiz-dashboard-grade">9th Grader</div>
              <div className="quiz-dashboard-school">Redwood High School</div>
            </div>
            
            {/* Message Hub Button */}
            <div className="quiz-dashboard-message-hub">
              <p>Need help or want to chat?</p>
              <button className="quiz-dashboard-message-button">
                MESSAGE HUB
              </button>
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="quiz-dashboard-main">
          <div className="quiz-dashboard-grid">
            {/* Top Left - How Are You Feeling Today */}
            <div className="quiz-dashboard-card feelings">
              <h2>HOW ARE YOU FEELING TODAY?</h2>
              <p>
                Feelings & Emotions come in all shapes and sizes. Slide the dot to match how you are doing now.
              </p>
              
              {/* Emoji Row */}
              <div className="quiz-dashboard-emoji-row">
                {emojis.map((emoji, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedEmoji(index)}
                    className={`quiz-dashboard-emoji ${selectedEmoji === index ? 'selected' : ''}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              
              {selectedEmoji === 2 && (
                <p className="quiz-dashboard-advice">Feeling anxious? Take a moment to pause and relax.</p>
              )}
              
              <textarea
                placeholder="What is on your mind today? Type your thoughts..."
                value={thoughts}
                onChange={(e) => setThoughts(e.target.value)}
                className="quiz-dashboard-thoughts"
              />
            </div>

            {/* Top Right - Performance Metrics */}
            <div className="quiz-dashboard-card performance">
              <h2>Performance Metrics</h2>
              
              {/* Legend */}
              <div className="quiz-dashboard-legend">
                <div className="quiz-dashboard-legend-item">
                  <div className="quiz-dashboard-legend-color overall"></div>
                  <span>→ Overall Performance</span>
                </div>
                <div className="quiz-dashboard-legend-item">
                  <div className="quiz-dashboard-legend-color today"></div>
                  <span>→ Today's Session</span>
                </div>
              </div>
              
              {/* Mock Chart */}
              <div className="quiz-dashboard-chart">
                <div className="quiz-dashboard-bars">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                    <div key={day} className="quiz-dashboard-bar-group">
                      <div className="quiz-dashboard-day">{day}</div>
                      <div className="quiz-dashboard-bar overall" style={{ height: `${60 + index * 5}%` }}></div>
                      <div className="quiz-dashboard-bar today" style={{ height: `${50 + Math.random() * 40}%` }}></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Left - Rewards & Fun Facts */}
            <div className="quiz-dashboard-card rewards">
              <h2>REWARDS & FUN FACTS</h2>
              <div className="quiz-dashboard-fun-facts-title">Fun Facts:</div>
              
              <div className="quiz-dashboard-fun-facts">
                <div className="quiz-dashboard-fun-fact food">
                  <div className="quiz-dashboard-fun-fact-icon">🍽️</div>
                  <div className="quiz-dashboard-fun-fact-label">Food & Dining</div>
                </div>
                <div className="quiz-dashboard-fun-fact panda">
                  <div className="quiz-dashboard-fun-fact-icon">🐼</div>
                  <div className="quiz-dashboard-fun-fact-label">Panda Facts</div>
                </div>
                <div className="quiz-dashboard-fun-fact sports">
                  <div className="quiz-dashboard-fun-fact-icon">🎾⚽</div>
                  <div className="quiz-dashboard-fun-fact-label">Sports & Activities</div>
                </div>
              </div>
            </div>

            {/* Bottom Right - Subject Ranking */}
            <div className="quiz-dashboard-card subjects">
              <h2>Subject Ranking based on Quiz Scores</h2>
              <p>Click PT for potential tips!</p>
              
              {/* Mock Chart */}
              <div className="quiz-dashboard-subject-chart">
                <div className="quiz-dashboard-subject-bars">
                  {['Science', 'History', 'Math', 'English', 'Art'].map((subject, index) => (
                    <div key={subject} className="quiz-dashboard-subject-bar">
                      <div className="quiz-dashboard-subject-name">{subject}</div>
                      <div className="quiz-dashboard-subject-value" style={{ height: `${20 + Math.random() * 60}%` }}></div>
                    </div>
                  ))}
                </div>
                <div className="quiz-dashboard-subject-range">
                  Score Range: 0-100
                </div>
              </div>
            </div>
          </div>

          {/* Start Learning Button */}
          <div className="quiz-dashboard-start-button-container">
            <button
              onClick={onStartNewQuiz}
              className="quiz-dashboard-start-button"
            >
              Start Learning
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}