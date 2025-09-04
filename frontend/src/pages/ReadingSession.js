import React, { useState } from 'react';
import '../styles/reading/ReadingSession.css';
import '../styles/quiz/Quiz.css';
import Header from '../components/common/Header';
import LeftSection from '../components/reading/LeftSection';
import RightSection from '../components/reading/RightSection';
import Clock from '../components/reading/Clock';
import ModalPortal from '../components/quiz/ModalPortal';
import QuizInterface from '../components/quiz/QuizInterface';
import QuizDashboard from '../components/quiz/QuizDashboard';

function ReadingSession() {
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [showLeft, setShowLeft] = useState(true);
  const [topicUrl, setTopicUrl] = useState(null);
  const [startTimer, setStartTimer] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [showDashboard, setShowDashboard] = useState(false);

  const readingButtons = [
    { id: 1, label: 'Dashboard', icon: '📊', path: '/' },
    { id: 2, label: 'Study', icon: '📚' },
    { id: 3, label: 'Settings', icon: '⚙️' }
  ];

  const handleNavClick = (button) => {
    if (button.label === 'Study') {
      setShowLeft((prev) => !prev);
      // Reset timers if needed
    } else {
      setShowLeft(true);
    }
  };

  const handleTopicSelect = (url) => {
    setTopicUrl(url);
  };

  const handleStart = () => {
    setShowLeft(false);
    setStartTimer(true); // Trigger timer start
    // Reset the trigger after a brief moment
    setTimeout(() => setStartTimer(false), 100);
    // Reset quiz index when starting a new reading session
    setCurrentQuizIndex(0);
  };

  const handleFinalQuizComplete = () => {
    setShowQuiz(false);
    setShowDashboard(true);
  };

  const handleDashboardComplete = () => {
    setShowDashboard(false);
    setCurrentQuizIndex(0);
  };

  // Show Dashboard
  if (showDashboard) {
    return (
      <div className="reading-session">
        <QuizDashboard onStartNewQuiz={handleDashboardComplete} />
      </div>
    );
  }

  return (
    <div className="reading-session">
      <Header buttons={readingButtons} onNavClick={handleNavClick} />
      <div className="reading-main-content">
        {showLeft && <LeftSection onTopicSelect={handleTopicSelect} onStart={handleStart} />}
        <RightSection
          content={content}
          file={file}
          topicUrl={topicUrl}
          startTimer={startTimer}
        />
      </div>
      
      {/* Quiz Buttons */}
      <div className="quiz-buttons-container">
        <button
          className="quiz-button"
          onClick={() => {
            setCurrentQuizIndex(0);
            setShowQuiz(true);
          }}
        >
          Quiz 1
        </button>
        <button
          className="quiz-button"
          onClick={() => {
            setCurrentQuizIndex(1);
            setShowQuiz(true);
          }}
        >
          Quiz 2
        </button>
        <button
          className="quiz-button"
          onClick={() => {
            setCurrentQuizIndex(2);
            setShowQuiz(true);
          }}
        >
          Quiz 3
        </button>
        <button
          className="quiz-button"
          onClick={() => {
            setCurrentQuizIndex(3);
            setShowQuiz(true);
          }}
        >
          Final Quiz
        </button>
      </div>
      
      {/* Quiz Overlay */}
      <ModalPortal isOpen={showQuiz} onClose={() => setShowQuiz(false)}>
        <div className="quiz-overlay-container">
          <QuizInterface 
            onClose={() => setShowQuiz(false)}
            currentQuizIndex={currentQuizIndex}
            onFinalQuizComplete={handleFinalQuizComplete}
          />
        </div>
      </ModalPortal>
    </div>
  );
}

export default ReadingSession;