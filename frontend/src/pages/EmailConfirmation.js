import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import Header from '../components/common/Header';

export default function EmailConfirmation() {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    console.log('=== EMAIL CONFIRMATION PAGE LOADED ===');
    
    // Check for role in localStorage (from signup)
    const signupRole = localStorage.getItem('signupRole');
    console.log('Role from signup localStorage:', signupRole);
    
    // Also check testRole for testing
    const testRole = localStorage.getItem('testRole');
    console.log('Test role from localStorage:', testRole);
    
    const role = signupRole || testRole;
    setUserRole(role);
    console.log('Final role determined:', role);
    
    // Log what would happen on email confirmation click
    console.log('When user clicks email confirmation, they should go to:');
    if (role) {
      switch (role.toLowerCase()) {
        case 'student':
          console.log('→ /profile-setup (will show StudentProfileForm)');
          break;
        case 'teacher':
          console.log('→ /profile-setup (will show TeacherProfileForm)');
          break;
        case 'parent':
          console.log('→ /profile-setup (will show ParentProfileForm)');
          break;
        default:
          console.log('→ /profile-setup (unknown role)');
          break;
      }
    } else {
      console.log('→ /profile-setup (no role found)');
    }
    
    console.log('==========================================');
  }, []);

  const handleEmailVerification = () => {
    console.log('=== EMAIL VERIFICATION CLICKED ===');
    console.log('User role:', userRole);
    console.log('Redirecting to profile setup for role:', userRole);
    
    // In a real app, you'd verify the email token first
    // For now, redirect to profile setup which will show the correct form based on role
    window.location.href = '/profile-setup';
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #283D40 5%, #44746D 97%)',
      fontFamily: 'Arial, sans-serif'
    }}>
      <Header />
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh'
      }}>
        <div style={{
          color: '#C7AB7D',
          fontSize: '20px',
          fontWeight: '500',
          textAlign: 'center',
          maxWidth: '700px'
        }}>
          A confirmation email has been sent to your email address.<br /><br />
                   
          <div style={{ marginBottom: '30px' }}>
            Click <b>'Verify your email'</b> and you will be brought to the <b>IN THE ZONE (ITZ)</b> profile setup for {userRole ? userRole.toLowerCase() + 's' : 'your role'}.
          </div>
          
          {/* Test button to simulate email verification */}
          <button
            onClick={handleEmailVerification}
            style={{
              background: '#C7AB7D',
              color: '#283D40',
              border: 'none',
              padding: '15px 30px',
              borderRadius: '8px',
              fontSize: '20px',
              fontWeight: '700',
              cursor: 'pointer',
              marginTop: '20px'
            }}
          >
            🔗 Simulate Email Verification Click
          </button>
          
          <div style={{ 
            fontSize: '16px', 
            marginTop: '20px', 
            color: '#A0A0A0',
            fontStyle: 'italic' 
          }}>
            (This button simulates clicking the verification link in the email)
          </div>
        </div>
      </div>
    </div>
  );
}