import React, { useState } from 'react';
import '../../styles/parent/LeftColumn.css';
import mamaPanda from '../../assets/images/avatars/teacher-mama-panda.jpeg';

const LeftColumn = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [parentName, setParentName] = useState('NAME OF MOTHER');
  const [studentName, setStudentName] = useState('Varun Rao');
  const [grade, setGrade] = useState('9th Grader');
  const [school, setSchool] = useState('Redwood High School');

  const handleProfileClick = () => {
    setIsEditing(!isEditing);
  };


  return (
    <div className="parent-left-column">
      <div className="profile-card" onClick={handleProfileClick}>
        <div className="profile-header">
          <h1 className="parent-name" 
              contentEditable={isEditing}
              suppressContentEditableWarning={true}
              onBlur={(e) => setParentName(e.target.textContent)}
              style={{ cursor: isEditing ? 'text' : 'pointer', marginBottom: '0.2rem' }}>
            {parentName}
          </h1>
          <h1 className="parent-name" style={{ marginTop: '0' }}>PARENT</h1>
        </div>
        
        <img src={mamaPanda} alt="Panda" className="profile-image" />
        
        <h2 className="profile-name" 
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
            onBlur={(e) => setStudentName(e.target.textContent)}
            style={{ cursor: isEditing ? 'text' : 'pointer' }}>
          Mother of {studentName}
        </h2>
        
        <div className="profile-details">
          <div className="editable-detail"
               contentEditable={isEditing}
               suppressContentEditableWarning={true}
               onBlur={(e) => setGrade(e.target.textContent)}
               style={{ cursor: isEditing ? 'text' : 'pointer' }}>
            {grade}
          </div>
          <div className="editable-detail"
               contentEditable={isEditing}
               suppressContentEditableWarning={true}
               onBlur={(e) => setSchool(e.target.textContent)}
               style={{ cursor: isEditing ? 'text' : 'pointer' }}>
            {school}
          </div>
        </div>

        {/* Divider Line */}
        <div className="profile-divider"></div>

        {/* Teacher Details Section */}
        <div className="teacher-details-section">
          <h3 className="teacher-section-title">Teacher Information</h3>
          
          <div className="teacher-detail-item">
            <h4 className="detail-label">Name of the Teacher:</h4>
            <p className="detail-value">Ms. Sarah Johnson</p>
          </div>
          
          <div className="teacher-detail-item">
            <h4 className="detail-label">Subject Taught</h4>
            <p className="detail-value">Mathematics</p>
          </div>
          
          <div style={{ marginTop: '2.5rem' }}>
            <button className="simple-message-btn" onClick={() => console.log('Opening message interface...')}>
              <span className="message-icon">💬</span>
              Message Teacher
            </button>
          </div>
        </div>

      </div>
      {/* Placeholder content below profile card */}
    </div>
  );
};

export default LeftColumn;