import React, { useState } from 'react';
import { supabase } from '../../utils/supabase';
import Header from '../common/Header';

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

const TeacherProfileForm = () => {
  const [formData, setFormData] = useState({
    school: '',
    position: '',
    teachingSubject: '',
    spedCertified: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No active session');
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          ...session.user.user_metadata,
          profile: formData,
          profileCompleted: true
        }
      });
      if (updateError) throw updateError;
      window.location.href = '/teacher';
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      height: '100vh',
      background: 'linear-gradient(135deg, #2C5057 0%, #557257 100%)',
      fontFamily: 'Arial, sans-serif',
      color: colorPalette.textDefault,
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Header />
      {/* Main Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '40px',
        maxWidth: '1600px',
        margin: '0 auto',
        width: '100%',
        overflow: 'auto'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h1 style={{
            color: colorPalette.c7ab7d,
            fontSize: '40px',
            fontWeight: '700',
            marginBottom: '20px'
          }}>
            Welcome Teacher Nidhi!
          </h1>
          <p style={{
            color: colorPalette.c7ab7d,
            fontSize: '22px',
            lineHeight: '1.5',
            maxWidth: '900px',
            margin: '0 auto',
            fontWeight: 500
          }}>
            Thank you for trusting us to empower your student. Please introduce yourself in this profile form below.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '60px',
          alignItems: 'start',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {/* Left Column */}
          <div>
            {error && (
              <div style={{
                background: 'rgba(220, 38, 38, 0.9)',
                color: colorPalette.white,
                padding: '12px 16px',
                borderRadius: '8px',
                fontSize: '16px',
                marginBottom: '20px',
                textAlign: 'center'
              }}>{error}</div>
            )}
            <div style={{ marginBottom: '30px' }}>
              <label style={{
                display: 'block',
                color: colorPalette.c7ab7d,
                fontSize: '20px',
                fontWeight: '700',
                marginBottom: '10px'
              }}>School where you work at</label>
              <input
                type="text"
                name="school"
                value={formData.school}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  border: `2px solid ${colorPalette.borderDefault}`,
                  borderRadius: '8px',
                  fontSize: '18px',
                  background: colorPalette.f0f9d6,
                  color: colorPalette.textDefault,
                  fontWeight: 500
                }}
              />
            </div>
            <div style={{ marginBottom: '30px' }}>
              <label style={{
                display: 'block',
                color: colorPalette.c7ab7d,
                fontSize: '20px',
                fontWeight: '700',
                marginBottom: '10px'
              }}>Position</label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  border: `2px solid ${colorPalette.borderDefault}`,
                  borderRadius: '8px',
                  fontSize: '18px',
                  background: colorPalette.f0f9d6,
                  color: colorPalette.textDefault,
                  fontWeight: 500
                }}
              />
            </div>
          </div>

          {/* Right Column */}
          <div>
            <div style={{ marginBottom: '30px' }}>
              <label style={{
                display: 'block',
                color: colorPalette.c7ab7d,
                fontSize: '20px',
                fontWeight: '700',
                marginBottom: '10px'
              }}>Teaching Subject</label>
              <input
                type="text"
                name="teachingSubject"
                value={formData.teachingSubject}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  border: `2px solid ${colorPalette.borderDefault}`,
                  borderRadius: '8px',
                  fontSize: '18px',
                  background: colorPalette.f0f9d6,
                  color: colorPalette.textDefault,
                  fontWeight: 500
                }}
              />
            </div>
            <div style={{ marginBottom: '30px' }}>
              <label style={{
                display: 'block',
                color: colorPalette.c7ab7d,
                fontSize: '20px',
                fontWeight: '700',
                marginBottom: '10px'
              }}>Are you a certified Special Ed Teacher?</label>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  name="spedCertified"
                  checked={formData.spedCertified}
                  onChange={(e) => setFormData(prev => ({ ...prev, spedCertified: e.target.checked }))}
                  style={{
                    width: '20px',
                    height: '20px',
                    marginRight: '10px'
                  }}
                />
                <span style={{ color: colorPalette.c7ab7d, fontSize: '18px', fontWeight: '500' }}>
                  Certified SPED Teacher
                </span>
              </div>
            </div>
          </div>
        </form>

        <div style={{ textAlign: 'center', marginTop: 'auto', paddingTop: '30px' }}>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            style={{
              background: colorPalette.c7ab7d,
              color: colorPalette.textDefault,
              border: 'none',
              padding: '18px 48px',
              borderRadius: '10px',
              fontSize: '22px',
              fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfileForm;