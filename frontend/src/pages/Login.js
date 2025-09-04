import React, { useState } from 'react';
import { supabase } from '../utils/supabase';
import Header from '../components/common/Header';
import '../styles/Login.css';

const Login = () => {
  const [username, setUsername] = useState(''); // Added username state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loginButtons = [
    { id: 1, label: 'Sign Up', path: '/signup' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      /*const { data, error } = await supabase.auth.signInWithPassword({ email, password });*/
      const { data, error } = await supabase.auth.signInWithPassword({ username, password });
      if (error) throw error;
      
      // Get user role and redirect accordingly
      const userRole = data?.user?.user_metadata?.role || localStorage.getItem('testRole');
      
      if (userRole) {
        switch (userRole.toLowerCase()) {
          case 'student':
            window.location.href = '/student';
            break;
          case 'teacher':
            window.location.href = '/teacher';
            break;
          case 'parent':
            window.location.href = '/parent';
            break;
          default:
            window.location.href = '/';
            break;
        }
      } 
    } catch (err) {
      if (
        err.message &&
        (err.message.toLowerCase().includes('incorrect username or password') ||
          err.message.toLowerCase().includes('invalid login credentials'))
      ) {
        setError('Incorrect username or password');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Header buttons={loginButtons} className="login-header" />
      <div className='login-main'>
        <img
          src={process.env.PUBLIC_URL + '/ITZ.Logo.Band.Tag.Shadow.png'}
          alt="ITZ Main Logo"
          className="login-logo"
      />

      <div className='login-form-container'>
          <form onSubmit={handleSubmit}  className="login-form">
            {error && (
              <div className="login-error">
                {error}
              </div>
            )}
            <div className="login-form-group">
              <label className="login-label">Username:</label>
              <input
                /*type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}*/
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="login-input"
              />
            </div>
            <div className="login-form-group">
              <label className="login-label">Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="login-input"
              />
            </div>
            <div className="login-submit-row">
            <button type="submit" disabled={loading} className="login-submit">
              {loading ? 'Loading...' : 'Submit'}
            </button>
            <div className="login-forgot-block">
              <div className="login-forgot-label">Forgot:</div>
              <div className="login-forgot-inline">
                <a href="/forgot-username" className="login-forgot-link">Username</a>
                <span className="login-forgot-or">or</span>
                <a href="/forgot-password" className="login-forgot-link">Password</a>
              </div>
            </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;