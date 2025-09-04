import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Page Components
import Homepage from './pages/Homepage';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import ParentInterface from './pages/ParentInterface';
import ReadingSession from './pages/ReadingSession';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import EmailConfirmation from './pages/EmailConfirmation';
import ProfileSetup from './pages/ProfileSetup';
import BuddySelection from './pages/BuddySelection';
import Calibration from './pages/Calibration';

// Import styles
import './styles/Dashboard.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/email-confirmation" element={<EmailConfirmation />} />
        <Route path="/profile-setup" element={<ProfileSetup />} />
        <Route path="/buddy-selection" element={<BuddySelection />} />
        <Route path="/calibration" element={<Calibration />} />
        <Route path="/parent" element={<ParentInterface />} />
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/reading-session" element={<ReadingSession />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;