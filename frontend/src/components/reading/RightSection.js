import React, { useEffect, useState } from 'react';
import mammoth from 'mammoth';
import '../../styles/reading/RightSection.css';

const RightSection = ({ content, file, topicUrl, startTimer }) => {
  const isEmpty = (!content || content.trim() === '') && !file && !topicUrl;
  const [filePreview, setFilePreview] = useState(null);
  const [fileText, setFileText] = useState('');
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [showQuizPopup, setShowQuizPopup] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [showMusicPopup, setShowMusicPopup] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const backgroundMusic = [
    { 
      id: 1, 
      name: 'Sound of Rain', 
      icon: '🌧️', 
      description: 'Gentle rainfall sounds',
      url: 'https://www.soundjay.com/misc/sounds/rain-01.wav' // Using a sample URL
    },
    { 
      id: 2, 
      name: 'Sound of River', 
      icon: '🏞️', 
      description: 'Peaceful flowing water',
      url: 'https://www.soundjay.com/misc/sounds/water-01.wav'
    },
    { 
      id: 3, 
      name: 'Forest Sounds', 
      icon: '🌲', 
      description: 'Birds chirping and rustling leaves',
      url: 'https://www.soundjay.com/misc/sounds/forest-01.wav'
    },
    { 
      id: 4, 
      name: 'Ocean Waves', 
      icon: '🌊', 
      description: 'Calming wave sounds',
      url: 'https://www.soundjay.com/misc/sounds/waves-01.wav'
    },
    { 
      id: 5, 
      name: 'White Noise', 
      icon: '⚪', 
      description: 'Steady background noise',
      url: 'https://www.soundjay.com/misc/sounds/whitenoise-01.wav'
    },
    { 
      id: 6, 
      name: 'Cafe Ambience', 
      icon: '☕', 
      description: 'Coffee shop atmosphere',
      url: 'https://www.soundjay.com/misc/sounds/cafe-01.wav'
    },
    { 
      id: 7, 
      name: 'Thunderstorm', 
      icon: '⛈️', 
      description: 'Distant thunder and rain',
      url: 'https://www.soundjay.com/misc/sounds/thunder-01.wav'
    },
    { 
      id: 8, 
      name: 'Wind in Trees', 
      icon: '🍃', 
      description: 'Gentle breeze through leaves',
      url: 'https://www.soundjay.com/misc/sounds/wind-01.wav'
    }
  ];

  useEffect(() => {
    if (!file) {
      setFilePreview(null);
      setFileText('');
      return;
    }
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setFilePreview(url);
      setFileText('');
      return () => URL.revokeObjectURL(url);
    } else if (
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.name.endsWith('.docx')
    ) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const arrayBuffer = e.target.result;
        const result = await mammoth.convertToHtml({ arrayBuffer });
        setFileText(result.value);
      };
      reader.readAsArrayBuffer(file);
      setFilePreview(null);
    } else if (file.type.startsWith('text/')) {
      const reader = new FileReader();
      reader.onload = (e) => setFileText(e.target.result);
      reader.readAsText(file);
      setFilePreview(null);
    } else {
      setFilePreview(null);
      setFileText('');
    }
  }, [file]);

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => {
          const newTime = timeLeft - 1;
          
          // Show popup every 10 minutes (600 seconds)
          const totalElapsed = (30 * 60) - newTime;
          if (totalElapsed > 0 && totalElapsed % 600 === 0) {
            setShowQuizPopup(true);
          }
          
          return newTime;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft]);

  // Effect to handle automatic timer start from START button
  useEffect(() => {
    if (startTimer) {
      setShowTimer(true);
      setIsTimerActive(true);
      if (timeLeft === 0) {
        setTimeLeft(30 * 60); // Reset to 30 minutes
      }
    }
  }, [startTimer, timeLeft]);

  const handleClockClick = () => {
    if (showTimer) {
      // If timer is visible, hide it but keep it running
      setShowTimer(false);
    } else {
      // If timer is not visible, show it and start if not already running
      setShowTimer(true);
      if (!isTimerActive) {
        setIsTimerActive(true);
        if (timeLeft === 0) {
          setTimeLeft(30 * 60); // Reset to 30 minutes
        }
      }
    }
  };

  const handleVibesClick = () => {
    setShowMusicPopup(true);
  };

  const selectMusic = (music) => {
    // Stop current audio if playing
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    // Create new audio instance
    const audio = new Audio(music.url);
    audio.loop = true; // Loop the background music
    audio.volume = 0.3; // Set moderate volume
    
    // Set up audio event listeners
    audio.addEventListener('loadstart', () => {
      console.log('Loading audio...');
    });
    
    audio.addEventListener('canplay', () => {
      console.log('Audio ready to play');
    });
    
    audio.addEventListener('error', (e) => {
      console.error('Audio error:', e);
      alert('Sorry, this audio track could not be loaded. Please try another option.');
    });

    // Start playing
    audio.play().then(() => {
      setCurrentAudio(audio);
      setSelectedMusic(music);
      setIsPlaying(true);
      setShowMusicPopup(false);
    }).catch(error => {
      console.error('Error playing audio:', error);
      // Fallback: simulate audio for demo purposes
      setSelectedMusic(music);
      setIsPlaying(true);
      setShowMusicPopup(false);
      alert(`Now playing: ${music.name} (Demo mode - actual audio may not be available)`);
    });
  };

  const toggleAudio = () => {
    if (currentAudio) {
      if (isPlaying) {
        currentAudio.pause();
        setIsPlaying(false);
      } else {
        currentAudio.play().then(() => {
          setIsPlaying(true);
        }).catch(error => {
          console.error('Error resuming audio:', error);
        });
      }
    }
  };

  const stopAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
      setSelectedMusic(null);
      setIsPlaying(false);
    }
  };

  // Cleanup audio on component unmount
  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.src = '';
      }
    };
  }, [currentAudio]);

  const closeMusicPopup = () => {
    setShowMusicPopup(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const closeQuizPopup = () => {
    setShowQuizPopup(false);
  };

  return (
    <div className="reading-right-section">
      <div className="content-layout">
        <div className="content-display large">
          {topicUrl ? (
            <iframe
              src={topicUrl}
              title="Topic Content"
              style={{ width: '100%', height: '100%', border: 'none', borderRadius: '16px' }}
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            />
          ) : isEmpty ? (
            <div className="empty-state">
              <div className="empty-icon">📄</div>
              <h3>Content to Display</h3>
            </div>
          ) : file ? (
            <div className="content-container file-preview-container">
              <div className="content-header">
                <h3>Uploaded File</h3>
                <span className="content-type">{file.type || 'Unknown Type'}</span>
              </div>
              {/* Image Preview */}
              {file.type.startsWith('image/') && filePreview && (
                <img src={filePreview} alt={file.name} className="file-image-preview fit-preview" />
              )}
              {/* DOCX Preview */}
              {(file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name.endsWith('.docx')) && fileText && (
                <div className="docx-preview fit-preview" dangerouslySetInnerHTML={{ __html: fileText }} />
              )}
              {/* Text Preview */}
              {file.type.startsWith('text/') && fileText && (
                <pre className="content-text file-text-preview fit-preview">{fileText}</pre>
              )}
              {/* Fallback */}
              {!filePreview && !fileText && (
                <div className="file-info">
                  <span role="img" aria-label="file">📄</span> {file.name}
                </div>
              )}
            </div>
          ) : (
            <div className="content-container">
              <div className="content-header">
                <h3>Generated Content</h3>
                <span className="content-type">JSON Format</span>
              </div>
              <pre className="content-text">{content}</pre>
            </div>
          )}
        </div>
        <div className="content-buttons">
          <button className="content-button clock-button" onClick={handleClockClick}>
            <span className="button-icon">⏱️</span>
            <div className="clock-content">
              <span className="button-label">Timer</span>
              {showTimer && (
                <>
                  <span className="timer-display">{formatTime(timeLeft)}</span>
                  <span className="timer-status">{isTimerActive ? 'Running' : 'Paused'}</span>
                </>
              )}
            </div>
          </button>
          <button className="content-button relax-button" title="Select a background music you want to play" onClick={handleVibesClick}>
            <span className="button-icon">🎵</span>
            <div className="vibes-content">
              <span className="button-label">Vibes</span>
              {selectedMusic && (
                <span className="current-music">{selectedMusic.name}</span>
              )}
            </div>
          </button>
        </div>
      </div>
      
      {/* Quiz Popup */}
      {showQuizPopup && (
        <div className="quiz-popup-overlay">
          <div className="quiz-popup">
            <h3>Quiz Reminder</h3>
            <p>You have a quiz to attend</p>
            <button className="quiz-popup-close" onClick={closeQuizPopup}>
              OK
            </button>
          </div>
        </div>
      )}
      
      {/* Music Selection Popup */}
      {showMusicPopup && (
        <div className="music-selection-overlay">
          <div className="music-selection-popup">
            <h3>Select Background Music</h3>
            
            {/* Currently Playing Section */}
            {selectedMusic && (
              <div className="currently-playing">
                <h4>Currently Playing</h4>
                <div className="current-track">
                  <span className="current-track-icon">{selectedMusic.icon}</span>
                  <div className="current-track-info">
                    <span className="current-track-name">{selectedMusic.name}</span>
                    <span className="current-track-status">{isPlaying ? 'Playing' : 'Paused'}</span>
                  </div>
                  <div className="current-track-controls">
                    <button className="track-control-btn" onClick={toggleAudio}>
                      {isPlaying ? '⏸️' : '▶️'}
                    </button>
                    <button className="track-control-btn" onClick={stopAudio}>
                      ⏹️
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            <div className="music-options">
              {backgroundMusic.map(music => (
                <div 
                  key={music.id} 
                  className={`music-option ${selectedMusic?.id === music.id ? 'active' : ''}`}
                  onClick={() => selectMusic(music)}
                >
                  <span className="music-icon">{music.icon}</span>
                  <span className="music-name">{music.name}</span>
                  <span className="music-description">{music.description}</span>
                  {selectedMusic?.id === music.id && (
                    <span className="playing-indicator">♪</span>
                  )}
                </div>
              ))}
            </div>
            <button className="music-selection-close" onClick={closeMusicPopup}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="progress-bar-container">
        <div className="progress-bar-markers">
          <div className="progress-marker"><span>Start</span></div>
          <div className="progress-marker"><span>Quiz 1</span></div>
          <div className="progress-marker"><span>Quiz 2</span></div>
          <div className="progress-marker"><span>Quiz 3</span></div>
          <div className="progress-marker"><span>End</span></div>
        </div>
        <div className="progress-bar" style={{ width: '100%' }} />
      </div>
    </div>
  );
};

export default RightSection;