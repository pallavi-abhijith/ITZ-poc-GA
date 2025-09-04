import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/teacher/App.css';
import Header from '../components/common/Header';
import LeftSidebar from '../components/teacher/LeftSidebar';
import RightSidebar from '../components/teacher/RightSidebar';
import MainContent from '../components/teacher/MainContent';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState('home');
  const [selectedStudent, setSelectedStudent] = useState(null);

  const teacherButtons = [
    { id: 1, label: 'Home', icon: '🏠', page: 'home' },
    { id: 2, label: 'Dashboard', icon: '📊', page: 'dashboard' },
    { id: 3, label: 'Settings', icon: '⚙️', page: 'settings' },
    { id: 4, label: 'Logout', icon: '🚪', page: 'logout', path: '/' }
  ];

  const handleNavigation = (button) => {
    // Map the new navigation button labels to our existing page system
    switch (button.label) {
      case 'Home':
        setActivePage('home');
        setSelectedStudent(null);
        break;
      case 'Dashboard':
        setActivePage('dashboard');
        setSelectedStudent(null);
        break;
      case 'Settings':
        setActivePage('settings');
        setSelectedStudent(null);
        break;
      case 'Logout':
        // Handle logout functionality - navigate back to role selection
        console.log('Logout clicked');
        navigate('/');
        break;
      default:
        setActivePage('home');
        setSelectedStudent(null);
    }
  };

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
    setActivePage('student-dashboard');
  };

  return (
    <div className="teacher-dashboard-app">
      <Header buttons={teacherButtons} onNavClick={handleNavigation} activeButton={teacherButtons.find(btn => btn.page === activePage)?.id || 1} />
      <div className="teacher-dashboard-main-container">
        <LeftSidebar />
        <MainContent 
          activePage={activePage} 
          selectedStudent={selectedStudent}
        />
        <RightSidebar onStudentClick={handleStudentClick} />
      </div>
    </div>
  );
};

export default TeacherDashboard;