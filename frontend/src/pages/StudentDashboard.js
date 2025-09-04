import '../styles/student/App.css';
import '../styles/quiz/Quiz.css';
import { useState } from 'react';
import Header from '../components/common/Header';
import Sidebar from '../components/student/Sidebar';
import MainContent from '../components/student/MainContent';
import ModalPortal from '../components/quiz/ModalPortal';
import QuizInterface from '../components/quiz/QuizInterface';
import QuizDashboard from '../components/quiz/QuizDashboard';

function StudentDashboard() {
  const [selectedNav, setSelectedNav] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [showQuizDashboard, setShowQuizDashboard] = useState(false);

  const studentButtons = [
    { id: 1, label: 'Dashboard', icon: '📊' },
    { id: 2, label: 'Start Learning', icon: '🎓', path: '/reading-session' },
    { id: 3, label: 'Logout', icon: '🚪' }
  ];

  const handleNavClick = (button) => {
    setSelectedNav(button);
  };

  const handleFinalQuizComplete = () => {
    setShowQuiz(false);
    setShowQuizDashboard(true);
  };

  const handleQuizDashboardComplete = () => {
    setShowQuizDashboard(false);
    setCurrentQuizIndex(0);
  };

  // Show Quiz Dashboard
  if (showQuizDashboard) {
    return (
      <div className="App app-bg">
        <QuizDashboard onStartNewQuiz={handleQuizDashboardComplete} />
      </div>
    );
  }

  return (
    <div className="student-app student-app-bg">
      <Header buttons={studentButtons} onNavClick={handleNavClick} />
      <div className="student-app-body">
        <div className="student-left-section">
          <Sidebar />
        </div>
        <div className="student-right-section">
          <MainContent selectedNav={selectedNav} />
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
