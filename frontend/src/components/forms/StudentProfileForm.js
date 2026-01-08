import React, { useState } from 'react';
import Header from '../common/Header';
import './StudentProfileForm.css';

const StudentProfileForm = () => {
  const [formData, setFormData] = useState({
    schoolName: '',
    currentGrade: '',
    teacherName: '',
    favoriteAnimal: '',
    favoriteRelax: '',
    favoriteSnack: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContinue = () => {
    setLoading(true);
    // Simple validation
    if (
      !formData.schoolName ||
      !formData.currentGrade ||
      !formData.teacherName ||
      !formData.favoriteAnimal ||
      !formData.favoriteRelax ||
      !formData.favoriteSnack
    ) {
      setError('Please fill out all fields.');
      setLoading(false);
      return;
    }
    // Submit logic here (e.g., API call)
    setError('');
    setLoading(false);
    alert('Profile submitted!');
  };

  return (
    <div className="student-profile-page">
      <Header />
      <div className="student-profile-main">
        <div className="student-profile-header">
          <p className="student-profile-title">
            Welcome <strong>Raquel aka Racoon!</strong> <br />
            Please introduce yourself in this profile form below.
          </p>
        </div>

        <form className="student-profile-form" onSubmit={e => e.preventDefault()}>
          {/* Left Column */}
          <div>
            {error && (
              <div className="student-profile-error">{error}</div>
            )}
            <div className="student-profile-form-group">
              <label className="student-profile-label">School Name</label>
              <input
                type="text"
                name="schoolName"
                value={formData.schoolName}
                onChange={handleInputChange}
                required
                className="student-profile-input"
              />
            </div>
            <div className="student-profile-form-group">
              <label className="student-profile-label">Current Grade</label>
              <input
                type="text"
                name="currentGrade"
                value={formData.currentGrade}
                onChange={handleInputChange}
                required
                className="student-profile-input"
              />
            </div>
            <div className="student-profile-form-group">
              <label className="student-profile-label">Homeroom Teacher or Counselor</label>
              <input
                type="text"
                name="teacherName"
                value={formData.teacherName}
                onChange={handleInputChange}
                required
                className="student-profile-input"
              />
            </div>
          </div>

          {/* Right Column */}
          <div>
            <div className="student-profile-form-group">
              <label className="student-profile-label">What is your favorite animal?</label>
              <input
                type="text"
                name="favoriteAnimal"
                value={formData.favoriteAnimal}
                onChange={handleInputChange}
                required
                className="student-profile-input"
              />
            </div>
            <div className="student-profile-form-group">
              <label className="student-profile-label">What is your favorite thing to do to relax?</label>
              <input
                type="text"
                name="favoriteRelax"
                value={formData.favoriteRelax}
                onChange={handleInputChange}
                required
                className="student-profile-input"
              />
            </div>
            <div className="student-profile-form-group">
              <label className="student-profile-label">What is your favorite snack?</label>
              <input
                type="text"
                name="favoriteSnack"
                value={formData.favoriteSnack}
                onChange={handleInputChange}
                required
                className="student-profile-input"
              />
            </div>
          </div>
        </form>

        <div className="student-profile-footer">
          <button
            type="button"
            onClick={handleContinue}
            disabled={loading}
            className="student-profile-continue-btn"
          >
            {loading ? 'Continuing...' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentProfileForm;