import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';

// Main Dashboard Component
function Dashboard() {
  const [message, setMessage] = useState('Loading...');
  const [studyTime, setStudyTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    // Get current user with retry logic
    const getUser = async () => {
      try {
        console.log('Dashboard: Checking for user...');
        const { data: { user }, error } = await supabase.auth.getUser();
        console.log('Dashboard: User check result:', user?.email || 'No user', error);
        setUser(user);
        setUserLoading(false); // Set loading to false here
      } catch (error) {
        console.error('Dashboard: Error getting user:', error);
        setUserLoading(false); // Set loading to false even on error
      }
    };

    getUser();

    // Also listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Dashboard: Auth change:', event, session?.user?.email || 'No user');
      if (session?.user) {
        setUser(session.user);
      }
      // Don't set userLoading to false here to avoid race conditions
    });

    return () => subscription.unsubscribe();
  }, []);

  // Separate effect for backend fetch that runs when user and userLoading change
  useEffect(() => {
    if (userLoading) {
      console.log('⏳ Still loading user...');
      return;
    }

    console.log('🚀 User loading complete, starting backend fetch...');
    
    // Try to fetch from backend with authentication
    const fetchBackend = async () => {
      console.log('🔄 Starting backend fetch...');
      
      try {
        // Simple fetch without timeout 
        console.log('📡 Fetching status endpoint...');
        const statusResponse = await fetch('http://localhost:5000/api/status');
        
        console.log('📡 Status response status:', statusResponse.status);
        console.log('📡 Status response ok:', statusResponse.ok);
        
        if (!statusResponse.ok) {
          setMessage(`Backend error: ${statusResponse.status}`);
          return;
        }
        
        const statusData = await statusResponse.json();
        console.log('✅ Status data received:', statusData);
        
        // If we have a user, try the protected endpoint
        if (user) {
          console.log('👤 User found, getting session...');
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session?.access_token) {
            console.log('🔐 Session found, trying protected endpoint...');
            
            try {
              const protectedResponse = await fetch('http://localhost:5000/api/hello', {
                headers: {
                  'Authorization': `Bearer ${session.access_token}`,
                }
              });
              
              console.log('🔐 Protected response status:', protectedResponse.status);
              
              if (protectedResponse.ok) {
                const protectedData = await protectedResponse.json();
                console.log('✅ Protected data received:', protectedData);
                setMessage(`Public: ${statusData.message} | Protected: ${protectedData.message}`);
              } else {
                const errorText = await protectedResponse.text();
                console.log('❌ Protected endpoint error:', errorText);
                setMessage(`Public: ${statusData.message} | Auth failed: ${protectedResponse.status}`);
              }
            } catch (protectedError) {
              console.error('❌ Protected fetch error:', protectedError);
              setMessage(`Public: ${statusData.message} | Auth error: ${protectedError.message}`);
            }
          } else {
            console.log('⚠️ No session/access token found');
            setMessage(`Public: ${statusData.message} | No session`);
          }
        } else {
          console.log('👤 No user logged in');
          setMessage(`Public: ${statusData.message} | Not logged in`);
        }
        
      } catch (error) {
        console.error('❌ Backend fetch failed:', error);
        setMessage(`Backend error: ${error.message}`);
      }
    };

    fetchBackend();
  }, [user, userLoading]); // Run when user or userLoading changes

  // Timer logic
  useEffect(() => {
    let interval;
    if (isRunning && studyTime > 0) {
      interval = setInterval(() => {
        setStudyTime(time => time - 1);
      }, 1000);
    } else if (studyTime === 0) {
      setIsRunning(false);
      alert('Study session complete!');
      setStudyTime(25 * 60);
    }
    return () => clearInterval(interval);
  }, [isRunning, studyTime]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  if (userLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading user...</p>
      </div>
    );
  }

  if (!user) {
    console.log('Dashboard: No user found, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app">
      <nav className="top-nav">
        <div className="nav-container">
          <div className="logo">
            <div className="logo-icon">Z</div>
          </div>
          <div className="auth-status">
            <span className="user-welcome">Welcome, {user.email}!</span>
            <button onClick={handleLogout} className="auth-btn btn-secondary">
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <div className="main-container">
        <div className="timer-section">
          <div className="timer-box">
            <div className="timer-display" onClick={() => setIsRunning(!isRunning)}>
              {formatTime(studyTime)}
            </div>
            <div className="timer-label">Study Timer</div>
          </div>
          
          <div className="progress-section">
            <div className="progress-label">Progress</div>
            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>
          </div>
        </div>

        <div className="content-area">
          <h1 className="content-title">U.S. History</h1>
          
          <p className="content-text">
            Middle school U.S. History covers exploration through Reconstruction, 
            focusing on significant events and turning points.
          </p>
          
          <div style={{
            marginTop: '30px', 
            padding: '20px', 
            background: '#f8fafc', 
            borderRadius: '12px', 
            border: '1px solid #e2e8f0'
          }}>
            <strong>Backend Status:</strong> {message}
          </div>
        </div>

        <div className="quiz-bot-section">
          {/* Avatar Section */}
          <div className="avatar-card">
            <h3 className="avatar-title">AI Study Assistant</h3>
            <div id="pixel-streaming-viewport">
              <iframe 
                src="http://localhost:80" 
                style={{width: '100%', height: '100%', border: 'none', borderRadius: '12px'}}
                title="AI Study Avatar"
                allow="camera; microphone; autoplay; encrypted-media; fullscreen"
              />
            </div>
          </div>

          {/* Quiz Bot Card */}
          <div className="quiz-bot-card">
            <div className="bot-avatar">
              <div style={{
                width: '100%', 
                height: '100%', 
                background: '#FF9500', 
                borderRadius: '12px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '48px',
                color: 'white'
              }}>
                🤖
              </div>
            </div>
            
            <h3 className="bot-title">Quiz Bot</h3>
            
            <div className="bot-status">
              <div className="status-dot"></div>
              Online
            </div>
            
            <div className="quiz-interface">
              Ready to quiz you on U.S. History!
              <br />
              <small>Timer is {isRunning ? 'running' : 'stopped'}</small>
              <br /><br />
              <small>User: {user.email}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export Dashboard component
export default Dashboard;