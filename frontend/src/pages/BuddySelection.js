import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/BuddySelection.css';

const buddyOptions = [
  { id: 'cat', label: 'Cat', emoji: '🐱' },
  { id: 'dog', label: 'Dog', emoji: '🐶' }
];

const BuddySelection = () => {
  const [selectedBuddy, setSelectedBuddy] = useState('cat');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleBuddySelect = (buddy) => {
    setSelectedBuddy(buddy);
  };

  const handleContinue = () => {
    setLoading(true);
    localStorage.setItem('selectedBuddy', selectedBuddy);
    setTimeout(() => {
      navigate('/calibration');
    }, 500);
  };

  return (
    <div className="buddy-selection-page">
      <div className="buddy-selection-header">
        Almost Done! Follow the two steps below so you can meet your <br />
        study buddy and measure your screen size using your super<br />
        eye powers—so the app works perfectly for you!
      </div>
      <div className="buddy-selection-row">
        {/* Buddy Selection Box */}
        <div className="buddy-selection-container">
          <div className="buddy-selection-title">
            1. Click on a avatar you would like<br />
            to help you study!
          </div>
          <div className="buddy-selection-options">
            {buddyOptions.map((buddy) => (
              <div
                key={buddy.id}
                className={`buddy-selection-option${selectedBuddy === buddy.id ? ' selected' : ''}`}
                onClick={() => handleBuddySelect(buddy.id)}
              >
                {buddy.emoji}
              </div>
            ))}
          </div>
        </div>
        {/* Continue Button Box */}
        <div className="buddy-selection-container">
          <div className="buddy-selection-title">
            2. Click the button, watch the short animation, and follow the friendly character with your eyes. It’s quick, safe, and we don’t save any images or recordings."
          </div>
          <button
            className="buddy-selection-continue-btn"
            onClick={handleContinue}
            disabled={loading}
          >
            {loading ? 'Continuing...' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuddySelection;