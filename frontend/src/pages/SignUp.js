import React, { useState } from 'react';
import { supabase } from '../utils/supabase';
import Header from '../components/common/Header';
import '../styles/SignUp.css';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    retypePassword: '',
    role: '',
    termsAccepted: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showTerms, setShowTerms] = useState(false);

  const signupButtons = [
    { id: 1, label: 'Login', path: '/login' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRoleChange = (role) => {
    setFormData(prev => ({ ...prev, role }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.retypePassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!formData.role) {
      setError('Please select your role');
      setLoading(false);
      return;
    }

    if (!formData.termsAccepted) {
      setError('Please accept the Terms & Conditions');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            username: formData.username,
            role: formData.role
          }
        }
      });

      if (error) throw error;

      localStorage.setItem('signupRole', formData.role);

      if (data.user && !data.user.email_confirmed_at) {
        window.location.href = '/email-confirmation';
      } else {
        window.location.href = '/profile-setup';
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const TermsModal = () => (
    <div className="signup-terms-modal-bg">
      <div className="signup-terms-modal">
        <h2 className="signup-terms-title">Terms & Conditions:</h2>
        <ul className="signup-terms-list">
          <li><strong>Age & Consent:</strong> A person over 10 years of age may sign up on the ITZ platform for the purpose of usability testing that has been approved by Guardian Airwaves LLC to be a end user tester.</li>
          <li>For users ages 10 and above, require explicit Parental or guardian consent before and data is collected or processed.</li>
          <li><strong>Acceptance of Terms:</strong> States that by creating an account or using the website, users agree to be bound by the Terms & Conditions listed below.</li>
          <li><strong>Account Security:</strong> The test user is responsible for inputting their own name, username, password, and email verification. None of identifiable information will be exposed beyond this testing session.</li>
          <li><strong>Data Collection and Use:</strong> Data collected will be name, age, and facial expressions, body behaviors, and interaction with ITZ UI. This will be used only for real-time analysis and will not be shared outside of the testing lab. Only baseline behaviors will be shared along with the platforms effected behaviors by the ITZ platform. State that no personal information will be knowingly collected from children.</li>
          <li><strong>Parental Rights and Controls:</strong></li>
          <li>Outline how parents or guardians can review, delete, or control their child's data and how they can revoke consent.</li>
          <li><strong>Permitted and Prohibited Uses:</strong> The user will perform to the best, honest capability of themselves to the betterment of the In The Zone learning platform.</li>
          <li><strong>Intellectual Property:</strong> Guardian Airwaves LLC has the exclusive ownership of AI ITZ website interactions, content, trademarks, and copyrights, and prohibits unauthorized use of sharing their interactions with the ITZ platform.</li>
          <li><strong>Transparent User Communication:</strong> The ITZ platform will be collecting images, voice of the user for analysis and live interaction with the platform.</li>
          <li><strong>Limitation of Liability:</strong> Limits the website's liability for damages arising from use of the site or its services.</li>
          <li><strong>Privacy Statement:</strong> Refers to how user data is collected, stored, and used, often linking to a separate privacy policy.</li>
          <li><strong>Governing Law and Dispute Resolution:</strong> Specifies COPPA, GDPR, California rules jurisdiction and procedures for resolving legal disputes.</li>
          <li><strong>Changes to Terms:</strong> Guardian Airwaves LLC reserves the right to update the T&C and outlines how users will be notified of changes.</li>
        </ul>
        <div className="signup-terms-ack">
          <h3 className="signup-terms-ack-title">Acknowledgement:</h3>
          <p>By Checking this box confirms that users have read and agreed to the T&C as part of the account creation process.</p>
        </div>
        <button
          onClick={() => setShowTerms(false)}
          className="signup-terms-close"
        >
          Close
        </button>
      </div>
    </div>
  );

  return (
    <div className="signup-page">
      <Header buttons={signupButtons} />

      <div className="signup-main">
        <div className="signup-header">
          <p className="signup-title">
            Welcome to the journey!
          </p>
          <p className="signup-desc">
            As an ITZ member, you’ll join our special beta community - ITZ BETAs. 
            You’ll get early access to exciting new tools we’re creating and a chance to share your thoughts directly with us. 
            We’re here to listen and support your every step of the way, helping you stay focused, build confidence, and reach your academic goals—today and beyond.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          {/* Left Column */}
          <div>
            {error && error !== 'Passwords do not match' && error !== 'Please select your role' && error !== 'Please accept the Terms & Conditions' && (
              <div className="signup-error">
              {error}
              </div>
            )}

            <div className="signup-form-group">
              <label className="signup-label">
                Name (first & last):
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="signup-input"
              />
            </div>

            <div className="signup-form-group">
              <label className="signup-label">
                Username:
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                className="signup-input"
              />
            </div>

            <div className="signup-form-group">
              <label className="signup-label">
                Email Address:
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="signup-input"
              />
            </div>

            <div className="signup-form-group">
              <label className="signup-label">
                Are you a...
              </label>
              <div style={{ display: 'flex', gap: '30px' }}>
                {['Student', 'Parent', 'Teacher'].map((role) => (
                  <label key={role} className="signup-role-label">
                    <input
                      type="radio"
                      name="role"
                      value={role}
                      checked={formData.role === role}
                      onChange={() => handleRoleChange(role)}
                      className="signup-radio"
                    />
                    {role}
                  </label>
                ))}
              </div>
              {error === 'Please select your role' && (
                <div className="signup-error">
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div>
            <div className="signup-form-group">
              <label className="signup-label">
                New Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="signup-input"
              />
            </div>

            <div className="signup-form-group">
              <label className="signup-label">
                Retype New Password
              </label>
              <input
                type="password"
                name="retypePassword"
                value={formData.retypePassword}
                onChange={handleInputChange}
                required
                className={`signup-input${formData.retypePassword && formData.retypePassword !== formData.password ? ' error' : ''}`}
              />
              {formData.retypePassword && formData.retypePassword !== formData.password && (
                <p className="signup-error">Passwords do not match - try again.</p>
              )}
            </div>

            <div className="signup-terms-group">
              <label className="signup-terms-label">
                <input
                  type="checkbox"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleInputChange}
                  className="signup-checkbox"
                />
                Terms & Condition - 
                <button
                  type="button"
                  onClick={() => setShowTerms(true)}
                  className="signup-terms-read"
                >
                  Read
                </button>
              </label>
              {error === 'Please accept the Terms & Conditions' && (
                <div className="signup-error">
                  {error}
                </div>
              )}
            </div>

            <div className="signup-submit-row">
              <button 
                type="submit" 
                disabled={loading}
                className="signup-submit"
              >
                {loading ? 'Loading...' : 'Submit'}
              </button>
              <div className="signup-email-verification">
                <span className="email-verification-italic">Email Verification</span><br />
                <span>Required</span>
              </div>
            </div>
          </div>
        </form>
      </div>

      {showTerms && <TermsModal />}
    </div>
  );
};

export default SignUp;