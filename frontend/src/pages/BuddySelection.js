import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const colorPalette = {
  textDefault: '#000000',
  borderDefault: '#D9D9D9',
  borderBrand: '#000000',
  c7ab7d: '#C7AB7D',
  f0f9d6: '#F0F9D6',
  black: '#000000',
  greenDark: '#2C5057',
  greenMid: '#557257',
  white: '#FFFFFF',
};

const BuddySelection = () => {
  const [selectedBuddy, setSelectedBuddy] = useState('cat');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleBuddySelect = (buddy) => {
    setSelectedBuddy(buddy);
    console.log('Buddy selected:', buddy);
  };

  const handleContinue = () => {
    setLoading(true);
    console.log('Saving buddy selection:', selectedBuddy);
    
    // Save buddy selection to localStorage for now
    localStorage.setItem('selectedBuddy', selectedBuddy);
    
    console.log('Navigating to calibration page...');
    setTimeout(() => {
      navigate('/calibration');
    }, 500);
  };

  const buddyOptions = [
    { id: 'cat', label: 'Cat', emoji: '🐱' },
    { id: 'dog', label: 'Dog', emoji: '🐶' }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #2C5057 0%, #557257 100%)',
      fontFamily: 'Arial, sans-serif',
      color: colorPalette.textDefault,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px'
    }}>
      <div style={{
        background: colorPalette.greenDark,
        borderRadius: '20px',
        padding: '50px',
        maxWidth: '600px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
      }}>
        {/* Header */}
        <div style={{
          background: colorPalette.f0f9d6,
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '40px',
          fontSize: '24px',
          color: colorPalette.textDefault,
          textAlign: 'center',
          fontWeight: 600,
          width: '100%'
        }}>
          Hello,<br />What would you like me to call you?
        </div>

        {/* Title */}
        <div style={{ 
          color: colorPalette.c7ab7d, 
          fontSize: '32px', 
          fontWeight: 700, 
          marginBottom: '40px',
          textAlign: 'center'
        }}>
          Select your buddy
        </div>

        {/* Buddy Options */}
        <div style={{ 
          display: 'flex', 
          gap: '30px', 
          marginBottom: '40px',
          justifyContent: 'center'
        }}>
          {buddyOptions.map((buddy) => (
            <div
              key={buddy.id}
              onClick={() => handleBuddySelect(buddy.id)}
              style={{
                width: '150px',
                height: '150px',
                borderRadius: '20px',
                overflow: 'hidden',
                cursor: 'pointer',
                border: selectedBuddy === buddy.id 
                  ? `6px solid ${colorPalette.c7ab7d}` 
                  : `3px solid ${colorPalette.borderDefault}`,
                background: colorPalette.c7ab7d,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '80px',
                transition: 'all 0.3s ease',
                transform: selectedBuddy === buddy.id ? 'scale(1.05)' : 'scale(1)'
              }}
              title={buddy.label}
            >
              {buddy.emoji}
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div style={{
          background: colorPalette.c7ab7d,
          borderRadius: '12px',
          padding: '24px',
          color: colorPalette.textDefault,
          fontSize: '18px',
          lineHeight: '1.6',
          fontWeight: 500,
          marginBottom: '40px',
          textAlign: 'center',
          width: '100%'
        }}>
          TEST: Tell your buddy if you want to be called by your username or by your first name by saying, 
          "My name is Racoon" or "My name is Raquel"
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={loading}
          style={{
            background: colorPalette.c7ab7d,
            color: colorPalette.textDefault,
            border: 'none',
            padding: '20px 60px',
            borderRadius: '12px',
            fontSize: '24px',
            fontWeight: '700',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            if (!loading) {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
            }
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)';
          }}
        >
          {loading ? 'Continuing...' : 'Continue'}
        </button>
      </div>
    </div>
  );
};

export default BuddySelection;