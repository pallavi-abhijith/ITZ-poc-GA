import React, { useState, useRef } from 'react';

const formatTime = (seconds) => {
  const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
};

const Clock = ({ onClose }) => {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  const start = () => {
    if (!running) {
      setRunning(true);
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
  };

  const stop = () => {
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const reset = () => {
    setSeconds(0);
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  React.useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div style={{
      position: 'fixed',
      bottom: '2rem',
      right: '2rem',
      background: '#fff',
      border: '2px solid #d6c6a1',
      borderRadius: '16px',
      boxShadow: '0 4px 24px rgba(46,65,66,0.13)',
      padding: '1.5rem 2rem 1.5rem 2rem',
      zIndex: 1000,
      minWidth: '260px',
      minHeight: '160px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '10px',
          right: '14px',
          background: 'none',
          border: 'none',
          fontSize: '1.2rem',
          cursor: 'pointer',
          color: '#a86e4a',
        }}
        aria-label="Close Timer"
      >
        ×
      </button>
      <h2 style={{ margin: '0 0 1rem 0' }}>⏱️ Timer</h2>
      <div style={{ fontSize: '2rem', margin: '0.5rem 0 1.2rem 0', fontWeight: 600 }}>{formatTime(seconds)}</div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.7rem' }}>
        <button onClick={start} disabled={running} style={{ padding: '0.4rem 1.1rem', borderRadius: '6px', border: '1px solid #a86e4a', background: running ? '#eee' : '#f5d7b7', color: '#2e4142', fontWeight: 600 }}>Start</button>
        <button onClick={stop} disabled={!running} style={{ padding: '0.4rem 1.1rem', borderRadius: '6px', border: '1px solid #a86e4a', background: !running ? '#eee' : '#f5d7b7', color: '#2e4142', fontWeight: 600 }}>Stop</button>
        <button onClick={reset} style={{ padding: '0.4rem 1.1rem', borderRadius: '6px', border: '1px solid #a86e4a', background: '#f5d7b7', color: '#2e4142', fontWeight: 600 }}>Reset</button>
      </div>
    </div>
  );
};

export default Clock;