import React, { useState } from 'react';
import QuizCard from './QuizCard';
import CountdownPage from './CountdownPage';
import QuizDashboard from './QuizDashboard';

const QuizInterface = ({ onClose, currentQuizIndex, onFinalQuizComplete }) => {
  const [showCountdown, setShowCountdown] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [quizSessions, setQuizSessions] = useState([
    { id: 1, name: 'Quiz #1', questions: 1, timeLimit: 180, completed: false },
    { id: 2, name: 'Quiz #2', questions: 1, timeLimit: 180, completed: false },
    { id: 3, name: 'Quiz #3', questions: 1, timeLimit: 180, completed: false },
    { id: 4, name: 'Final Quiz', questions: 3, timeLimit: 300, completed: false }
  ]);

  const handleStartNewQuiz = () => {
    setShowDashboard(false);
    setShowCountdown(false);
    setQuizSessions(prev => 
      prev.map(quiz => ({ ...quiz, completed: false }))
    );
  };

  const handleQuizComplete = async (quizId) => {
    try {
      setQuizSessions(prev => 
        prev.map(quiz => 
          quiz.id === quizId 
            ? { ...quiz, completed: true }
            : quiz
        )
      );
      
      // Close overlay and return to reading
      onClose();
    } catch (err) {
      console.error('Error completing quiz:', err);
    }
  };

  const handleCountdownComplete = () => {
    setShowCountdown(false);
  };

  const handleStudySessionComplete = async () => {
    try {
      // Reset everything and close overlay
      setShowDashboard(false);
      setShowCountdown(false);
      setQuizSessions(prev => 
        prev.map(quiz => ({ ...quiz, completed: false }))
      );
      onClose(); // Close overlay and return to reading
    } catch (err) {
      console.error('Error starting new study session:', err);
    }
  };

  const handleClose = () => {
    onClose();
  };

  // Show dashboard
  if (showDashboard) {
    return (
      <div className="quiz-interface-container">
        <button className="quiz-close-button" onClick={handleClose}>×</button>
        <QuizDashboard onStartNewQuiz={handleStartNewQuiz} />
      </div>
    );
  }

  // Show countdown
  if (showCountdown) {
    return (
      <div className="quiz-interface-container">
        <button className="quiz-close-button" onClick={handleClose}>×</button>
        <CountdownPage onComplete={handleCountdownComplete} />
      </div>
    );
  }

  // Show current quiz based on currentQuizIndex
  const currentQuizSession = quizSessions[currentQuizIndex];
  const isLastQuiz = currentQuizIndex === quizSessions.length - 1;
  
  return (
    <div className="quiz-interface-container">
      <button className="quiz-close-button" onClick={handleClose}>×</button>
             <QuizCard
        quizSession={currentQuizSession}
        onComplete={() => handleQuizComplete(currentQuizSession.id)}
        onStudySessionComplete={handleStudySessionComplete}
        onClose={handleClose}
        isLastQuiz={false}
        onFinalQuizComplete={onFinalQuizComplete}
      />
    </div>
  );
};

export default QuizInterface;