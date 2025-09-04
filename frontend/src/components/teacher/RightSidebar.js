import React from 'react';
import '../../styles/teacher/RightSidebar.css';

const RightSidebar = ({ onStudentClick }) => {
  const notifications = [
    { id: 1, type: 'assignment', message: 'Carol has a doubt in History - History of US', time: '2 min ago' },
    { id: 2, type: 'message', message: 'Parent meeting request from Bob\'s mom', time: '15 min ago' }
  ];

  const students = [
    { 
      id: 1, 
      name: 'Alice Johnson', 
      avatar: '👩‍🦰',
      present: true,
      grade: 'A-'
    },
    { 
      id: 2, 
      name: 'Bob Smith', 
      avatar: '👨‍🦱',
      present: false,
      grade: 'B+'
    },
    { 
      id: 3, 
      name: 'Carol Davis', 
      avatar: '👩‍🦳',
      present: true,
      grade: 'A'
    },
    { 
      id: 4, 
      name: 'David Wilson', 
      avatar: '👨‍🦲',
      present: true,
      grade: 'B'
    },
    { 
      id: 5, 
      name: 'Emma Brown', 
      avatar: '👩‍🦱',
      present: true,
      grade: 'A+'
    },
    { 
      id: 6, 
      name: 'Frank Miller', 
      avatar: '👨‍🦰',
      present: false,
      grade: 'C+'
    },
    { 
      id: 7, 
      name: 'Grace Lee', 
      avatar: '👩‍🦲',
      present: true,
      grade: 'B+'
    },
    { 
      id: 8, 
      name: 'Henry Taylor', 
      avatar: '👨‍🦳',
      present: true,
      grade: 'A-'
    },
    { 
      id: 9, 
      name: 'Ivy Chen', 
      avatar: '👩‍🦰',
      present: false,
      grade: 'B'
    }
  ];

  return (
    <div className="right-sidebar-teacher">
      <div className="sidebar-section">
        <h3>Notifications</h3>
        <div className="notifications">
          {notifications.map((notification) => (
            <div key={notification.id} className={`notification-item ${notification.type}`}>
              <div className="notification-content">
                <span className="notification-message">{notification.message}</span>
                <span className="notification-time">{notification.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="sidebar-section">
        <h3>Student Tableau</h3>
        <div className="student-tiles-grid">
          {students.map((student) => (
            <div 
              key={student.id} 
              className={`student-tile ${student.present ? 'present' : 'absent'}`}
              onClick={() => onStudentClick(student)}
            >
              <div className="student-avatar">
                <span className="avatar-emoji">{student.avatar}</span>
                <div className={`attendance-indicator ${student.present ? 'present' : 'absent'}`}>
                  {student.present ? '✓' : '✗'}
                </div>
              </div>
              <div className="student-tile-info">
                <span className="student-tile-name">{student.name}</span>
                <span className="student-tile-grade">{student.grade}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;