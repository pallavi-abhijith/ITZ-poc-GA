import React, { useState, useEffect } from 'react';
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

const Calibration = () => {
  const [loading, setLoading] = useState(false);
  const [selectedBuddy, setSelectedBuddy] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('=== CALIBRATION PAGE LOADED ===');
    
    // Get selected buddy from localStorage
    const buddy = localStorage.getItem('selectedBuddy');
    console.log('Selected buddy from previous page:', buddy);
    setSelectedBuddy(buddy);
    
    // Get profile data that might be stored
    const profileData = localStorage.getItem('studentProfileData');
    console.log('Student profile data:', profileData ? JSON.parse(profileData) : 'None');
    
    console.log('=====================================');
  }, []);

  const handleSubmit = () => {
    setLoading(true);
    console.log('=== CALIBRATION SUBMITTED ===');
    console.log('Selected buddy:', selectedBuddy);
    console.log('Finalizing student setup...');
    console.log('Redirecting to /student dashboard...');
    
    // Simulate some processing time
    setTimeout(() => {
      navigate('/student');
    }, 1000);
  };

  const getBuddyEmoji = (buddy) => {
    const buddyMap = {
      'cat': '🐱',
      'dog': '🐶'
    };
    return buddyMap[buddy] || '🐱';
  };

  return (
    <div style={{
      height: '100vh',
      background: 'linear-gradient(135deg, #2C5057 0%, #557257 100%)',
      fontFamily: 'Arial, sans-serif',
      color: colorPalette.textDefault,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px'
    }}>
      <div style={{
        background: colorPalette.white,
        borderRadius: '20px',
        padding: '60px',
        maxWidth: '800px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        textAlign: 'center'
      }}>
        {/* Header */}
        <div style={{
          color: colorPalette.greenDark,
          fontSize: '42px',
          fontWeight: '700',
          marginBottom: '20px'
        }}>
          Calibration
        </div>

        {/* Buddy Display */}
        {selectedBuddy && (
          <div style={{
            fontSize: '80px',
            marginBottom: '30px',
            background: colorPalette.f0f9d6,
            borderRadius: '50%',
            width: '150px',
            height: '150px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `4px solid ${colorPalette.c7ab7d}`
          }}>
            {getBuddyEmoji(selectedBuddy)}
          </div>
        )}

        {/* Description */}
        <div style={{
          color: colorPalette.greenDark,
          fontSize: '24px',
          lineHeight: '1.6',
          marginBottom: '40px',
          maxWidth: '600px'
        }}>
          Great! You've completed your profile setup and selected your learning buddy.
          <br /><br />
          This is where we would normally run calibration tests to understand your learning preferences, 
          but for now we'll take you directly to your student dashboard.
        </div>

        {/* Placeholder Content */}
        <div style={{
          background: colorPalette.f0f9d6,
          borderRadius: '12px',
          padding: '30px',
          marginBottom: '40px',
          width: '100%',
          border: `2px dashed ${colorPalette.c7ab7d}`
        }}>
          <div style={{
            color: colorPalette.greenDark,
            fontSize: '20px',
            fontWeight: '600',
            marginBottom: '15px'
          }}>
            🔧 Calibration Content Placeholder
          </div>
          <div style={{
            color: colorPalette.greenDark,
            fontSize: '16px',
            fontStyle: 'italic'
          }}>
            This is where calibration activities, assessments, or setup wizards would appear.
            For now, this page serves as a transition step in the student onboarding flow.
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            background: colorPalette.greenDark,
            color: colorPalette.white,
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
          {loading ? 'Completing Setup...' : 'Complete Setup & Go to Dashboard'}
        </button>

        {/* Status Text */}
        {loading && (
          <div style={{
            color: colorPalette.c7ab7d,
            fontSize: '16px',
            marginTop: '20px',
            fontStyle: 'italic'
          }}>
            Taking you to your student dashboard...
          </div>
        )}
      </div>
    </div>
  );
};

export default Calibration;