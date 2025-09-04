import React, { useState } from 'react';
import '../../styles/student/Sidebar.css';
import pandaImage from '../../assets/images/avatars/panda.jpg'; // Import the panda image

const Sidebar = () => {
  const [showMessagePopup, setShowMessagePopup] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [messageText, setMessageText] = useState('');

  const handleMessageClick = () => {
    setShowMessagePopup(true);
  };

  const handleProfileClick = () => {
    console.log('Profile clicked!');
    // Add your portfolio functionality here
  };

  const handleSubmitMessage = () => {
    console.log('Message submitted:', { option: selectedOption, text: messageText });
    // Add your message submission logic here
    setShowMessagePopup(false);
    setSelectedOption('');
    setMessageText('');
  };

  const handleClosePopup = () => {
    setShowMessagePopup(false);
    setSelectedOption('');
    setMessageText('');
  };

  // Panda SVG component
  const PandaImage = () => (
    <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Panda body - larger to fill the circle */}
      <circle cx="100" cy="100" r="85" fill="white" stroke="black" strokeWidth="3"/>
      
      {/* Panda ears - larger and positioned better */}
      <circle cx="65" cy="55" r="20" fill="black"/>
      <circle cx="135" cy="55" r="20" fill="black"/>
      
      {/* Panda eye patches - larger and more prominent */}
      <ellipse cx="75" cy="90" rx="15" ry="18" fill="black"/>
      <ellipse cx="125" cy="90" rx="15" ry="18" fill="black"/>
      
      {/* Panda eyes - larger with better positioning */}
      <circle cx="72" cy="85" r="5" fill="white"/>
      <circle cx="128" cy="85" r="5" fill="white"/>
      <circle cx="70" cy="83" r="2.5" fill="black"/>
      <circle cx="126" cy="83" r="2.5" fill="black"/>
      <circle cx="69" cy="82" r="1" fill="white"/>
      <circle cx="125" cy="82" r="1" fill="white"/>
      
      {/* Panda nose - larger */}
      <ellipse cx="100" cy="110" rx="3" ry="2.5" fill="black"/>
      
      {/* Panda mouth - larger and more prominent */}
      <path d="M 90 120 Q 100 130 110 120" stroke="black" strokeWidth="2.5" fill="none"/>
      
      {/* Panda cheeks - larger and more visible */}
      <circle cx="55" cy="115" r="10" fill="#FFB6C1" opacity="0.7"/>
      <circle cx="145" cy="115" r="10" fill="#FFB6C1" opacity="0.7"/>
      
      {/* Additional cute details - inner ear highlights */}
      <circle cx="68" cy="58" r="6" fill="white" opacity="0.3"/>
      <circle cx="132" cy="58" r="6" fill="white" opacity="0.3"/>
      
      {/* Sparkles - larger and more prominent */}
      <g fill="black">
        <path d="M 40 40 L 45 40 L 42.5 35 L 40 40 Z"/>
        <path d="M 160 40 L 165 40 L 162.5 35 L 160 40 Z"/>
        <path d="M 40 160 L 45 160 L 42.5 165 L 40 160 Z"/>
        <path d="M 160 160 L 165 160 L 162.5 165 L 160 160 Z"/>
        <path d="M 30 100 L 35 100 L 32.5 95 L 30 100 Z"/>
        <path d="M 170 100 L 175 100 L 172.5 95 L 170 100 Z"/>
      </g>
    </svg>
  );

  return (
    <div className="sidebar-container">
      <div className="profile-section">
        <div className="student-name">Varun Rao</div>
        <div className="profile-window" onClick={handleProfileClick}>
          <div className="panda-container">
            <img src={pandaImage} alt="Panda Profile" className="panda-image" />
          </div>
        </div>
        <div className="student-details">
          <div className="student-grade">9th Grader</div>
          <div className="student-school">Redwood High School</div>
        </div>
      </div>
      <div className="message-label">Need help or want to chat?</div>
      <button className="message-button" onClick={handleMessageClick}>
        MESSAGE HUB
      </button>
      <div className="teacher-hub">Message your teacher or Avatar for help!!</div>

      {/* Message Popup */}
      {showMessagePopup && (
        <div className="message-popup-overlay" onClick={handleClosePopup}>
          <div className="message-popup" onClick={e => e.stopPropagation()}>
            <button className="message-popup-close" onClick={handleClosePopup}>&times;</button>
            <div className="message-popup-content">
              <h3 className="message-popup-title">📊 Message Hub</h3>
              <p className="message-popup-subtitle">How can we help you today?</p>
              
              <div className="message-options">
                <label className="message-option">
                  <input
                    type="radio"
                    name="messageType"
                    value="help"
                    checked={selectedOption === 'help'}
                    onChange={(e) => setSelectedOption(e.target.value)}
                  />
                  <span className="option-text">I need help with my studies</span>
                </label>
                
                <label className="message-option">
                  <input
                    type="radio"
                    name="messageType"
                    value="question"
                    checked={selectedOption === 'question'}
                    onChange={(e) => setSelectedOption(e.target.value)}
                  />
                  <span className="option-text">I have a question</span>
                </label>
                
                <label className="message-option">
                  <input
                    type="radio"
                    name="messageType"
                    value="feedback"
                    checked={selectedOption === 'feedback'}
                    onChange={(e) => setSelectedOption(e.target.value)}
                  />
                  <span className="option-text">I want to give feedback</span>
                </label>
                
                <label className="message-option">
                  <input
                    type="radio"
                    name="messageType"
                    value="other"
                    checked={selectedOption === 'other'}
                    onChange={(e) => setSelectedOption(e.target.value)}
                  />
                  <span className="option-text">Something else</span>
                </label>
              </div>
              
              <div className="message-textarea-container">
                <label htmlFor="message-textarea" className="message-textarea-label">
                  Your Message:
                </label>
                <textarea
                  id="message-textarea"
                  className="message-textarea"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your message here..."
                  rows={4}
                />
              </div>
              
              <div className="message-popup-buttons">
                <button 
                  className="message-popup-cancel" 
                  onClick={handleClosePopup}
                >
                  Cancel
                </button>
                <button 
                  className="message-popup-send" 
                  onClick={handleSubmitMessage}
                  disabled={!selectedOption || !messageText.trim()}
                >
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

export default Sidebar; 