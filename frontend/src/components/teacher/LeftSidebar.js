import React, { useState } from 'react';
import '../../styles/teacher/LeftSidebar.css';
import teacherImage from '../../assets/images/avatars/teacher-avatar.jpg'; // Updated for unified app structure

const LeftSidebar = () => {
  // Fixed randomly assigned values
  const teacherInfo = {
    school: 'Lincoln Elementary School',
    gradeLevel: 'Elementary (K-5)',
    subject: 'Mathematics'
  };

  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [messageText, setMessageText] = useState('');

  // Sample student data
  const students = [
    { id: 1, name: 'Alice Johnson', grade: 'A-', avatar: '👩‍🦰' },
    { id: 2, name: 'Bob Smith', grade: 'B+', avatar: '👨‍🦱' },
    { id: 3, name: 'Carol Davis', grade: 'A', avatar: '👩‍🦳' },
    { id: 4, name: 'David Wilson', grade: 'B', avatar: '👨‍🦲' },
    { id: 5, name: 'Emma Brown', grade: 'A+', avatar: '👩‍🦱' },
    { id: 6, name: 'Frank Miller', grade: 'C+', avatar: '👨‍🦰' }
  ];

  const handleMessageClick = () => {
    setShowMessageModal(true);
  };

  const handleSendMessage = () => {
    if (selectedStudent && messageText.trim()) {
      console.log('Sending message to:', selectedStudent, 'Message:', messageText);
      // Here you would integrate with your messaging system
      alert(`Message sent to ${selectedStudent}!`);
      setMessageText('');
      setSelectedStudent('');
      setShowMessageModal(false);
    } else {
      alert('Please select a student and enter a message.');
    }
  };

  const handleCloseModal = () => {
    setShowMessageModal(false);
    setMessageText('');
    setSelectedStudent('');
  };

  return (
    <div className="left-sidebar">
      <div className="teacher-profile">
        <div className="profile-photo">
          <img 
            src={teacherImage} 
            alt="Teacher Profile" 
            className="profile-image"
          />
        </div>
        <div className="profile-info">
          <h3 className="teacher-name">Ms. Sarah Johnson</h3>
          <p className="teacher-subject">Mathematics Teacher</p>
          <p className="teacher-status">Online</p>
        </div>
      </div>

      <div className="dropdown-section">
        <div className="dropdown-item">
          <label>School employed at</label>
          <div className="info-display">
            {teacherInfo.school}
          </div>
        </div>

        <div className="dropdown-item">
          <label>Teaching Grade Level(s)</label>
          <div className="info-display">
            {teacherInfo.gradeLevel}
          </div>
        </div>

        <div className="dropdown-item">
          <label>Teaching Subject(s)</label>
          <div className="info-display">
            {teacherInfo.subject}
          </div>
        </div>

        <button className="education-button" onClick={handleMessageClick}>
          💬 Student Chat
        </button>
      </div>

      {/* Message Modal */}
      {showMessageModal && (
        <div className="message-modal-overlay">
          <div className="message-modal">
            <div className="modal-header">
              <h3>Send Message to Student</h3>
              <button className="close-button" onClick={handleCloseModal}>×</button>
            </div>
            
            <div className="modal-content">
              <div className="form-group">
                <label>Select Student:</label>
                <select 
                  value={selectedStudent} 
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="student-select"
                >
                  <option value="">Choose a student...</option>
                  {students.map(student => (
                    <option key={student.id} value={student.name}>
                      {student.avatar} {student.name} (Grade: {student.grade})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Message:</label>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your message here..."
                  className="message-textarea"
                  rows="4"
                />
              </div>

              <div className="modal-buttons">
                <button className="cancel-button" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button className="send-button" onClick={handleSendMessage}>
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeftSidebar;