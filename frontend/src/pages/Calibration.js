import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Calibration.css';

function Calibration() {
  const [spritePosition, setSpritePosition] = useState('center');
  const [done, setDone] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [startCountdown, setStartCountdown] = useState(5);
  const [calibrationStarted, setCalibrationStarted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Show starting countdown when sprite is in center and calibration hasn't started
    if (spritePosition === 'center' && !calibrationStarted) {
      setStartCountdown(5);
      const interval = setInterval(() => {
        setStartCountdown(prev => {
          if (prev === 1) {
            clearInterval(interval);
            setCalibrationStarted(true);
            setSpritePosition('right'); // Move to right immediately after countdown
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [spritePosition, calibrationStarted]);

  useEffect(() => {
    if (!calibrationStarted) return;

    // Choreographed movement (24s timeline)
    const positions = ['right', 'left', 'top', 'bottom'];
    const durations = [5000, 5000, 5000, 5000];
    let totalTime = 0;
    const timeouts = positions.map((pos, index) => {
      const timeout = setTimeout(() => {
        setSpritePosition(pos);
        if (index === positions.length - 1) {
          setTimeout(() => setDone(true), durations[index]);
        }
      }, totalTime);
      totalTime += durations[index];
      return timeout;
    });

    // WebSocket connection
    const socket = new WebSocket('ws://localhost:8000');

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.position && ['center', ...positions].includes(data.position)) {
        setSpritePosition(data.position);
      }
    };

    socket.onerror = (err) => {
      console.error('WebSocket error:', err);
    };

    return () => {
      timeouts.forEach(clearTimeout);
      socket.close();
    };
  }, [calibrationStarted]);

  // Countdown and redirect when done
  useEffect(() => {
    let countdownInterval;
    if (done) {
      setCountdown(5);
      countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev === 1) {
            clearInterval(countdownInterval);
            navigate('/student');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(countdownInterval);
  }, [done, navigate]);

  return (
    <div className="video-container">
      {/* Message above image */}
      {!calibrationStarted && spritePosition === 'center' && (
        <div className="calibration-complete" style={{ top: '20%', left: '50%', transform: 'translate(-50%, 0)', position: 'absolute', textAlign: 'center', zIndex: 10 }}>
          Calibration starting, follow the cat!
        </div>
      )}
      {done && (
        <div className="calibration-complete" style={{ top: '20%', left: '50%', transform: 'translate(-50%, 0)', position: 'absolute', textAlign: 'center', zIndex: 10 }}>
          Completed calibration! <br />
          redirecting to dashboard ...
        </div>
      )}

      {/* Image */}
      <img
        src={require('../assets/images/cat-persona.png')}
        alt=""
        className={`sprite ${spritePosition}`}
      />

      {/* Number below image, exactly 0.5cm below */}
      {!calibrationStarted && spritePosition === 'center' && (
        <div
          className="calibration-countdown"
        >
          {startCountdown}
        </div>
      )}
      {done && (
        <div
          className="calibration-countdown"
        >
          {countdown}
        </div>
      )}
    </div>
  );
}

export default Calibration;