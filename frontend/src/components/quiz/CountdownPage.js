import React, { useState, useEffect } from 'react';

export default function CountdownPage({ onComplete }) {
  const [countdown, setCountdown] = useState(5);
  const [showGo, setShowGo] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setShowGo(true);
          clearInterval(timer);
          // Wait 1 second showing "Go!" then complete
          setTimeout(() => {
            onComplete();
          }, 1000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="countdown-container">
      {/* Background content (faint text) */}
      <div className="countdown-background">
        <div className="countdown-background-content">
          <h1>U.S. History</h1>
          <p>Middle school U.S. History</p>
          <p>Early America • exploration • American Revol</p>
          <p>The Founding and Early</p>
          <p>thirteen colonies</p>
          <p>end of Reconstruction</p>
          <p>Civil Rights Moven</p>
          <p>colonization</p>
        </div>
      </div>

      {/* Central overlay with cat and countdown */}
      <div className="countdown-overlay">
        {/* Cat Avatar */}
        <div className="countdown-cat">
          <img
            src="/cat-persona.png"
            alt="Quiz Cat"
            className="countdown-cat-image"
          />
        </div>

        {/* "FINAL QUIZ!" Sign */}
        <div className="countdown-sign">
          <h2>FINAL QUIZ!</h2>
        </div>

        {/* Countdown Bar */}
        <div className="countdown-display">
          <div className="countdown-text">
            {showGo ? (
              <span className="countdown-go">Go!</span>
            ) : (
              <span>{countdown}......</span>
            )}
          </div>
        </div>

        {/* Bottom text */}
        <div className="countdown-message">
          <p>Let's check what you know!</p>
        </div>
      </div>
    </div>
  );
}