import React from 'react';
import Header from '../components/common/Header';
import LeftColumn from '../components/parent/LeftColumn';
import RightContent from '../components/parent/RightContent';
import '../styles/parent/RightContent.css';

const ParentInterface = () => {
  const parentButtons = [
    { id: 1, label: 'Dashboard', icon: '📊', path: '/parent' },
    { id: 2, label: 'Student Performance', icon: '👥', path: '/parent' },
    { id: 3, label: 'Settings', icon: '⚙️', path: '/parent' },
    { id: 4, label: 'Logout', icon: '🚪', path: '/' }
  ];

  return (
    <div>
      <Header buttons={parentButtons} />
      <div className="parent-main-layout">
        <LeftColumn />
        <RightContent />
      </div>
    </div>
  );
};

export default ParentInterface;