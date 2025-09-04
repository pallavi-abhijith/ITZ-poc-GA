import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import StudentProfileForm from '../components/forms/StudentProfileForm';
import ParentProfileForm from '../components/forms/ParentProfileForm';
import TeacherProfileForm from '../components/forms/TeacherProfileForm';


const ProfileSetup = () => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('=== PROFILE SETUP PAGE LOADED ===');
    
    // For testing: check localStorage for testRole
    const testRole = localStorage.getItem('testRole');
    console.log('Test role from localStorage:', testRole);
    
    // Check signup role from localStorage
    const signupRole = localStorage.getItem('signupRole');
    console.log('Signup role from localStorage:', signupRole);
    
    if (testRole) {
      console.log('Using test role:', testRole);
      setRole(testRole);
      setLoading(false);
      return;
    }
    const fetchRole = async () => {
      console.log('Fetching role from Supabase session...');
      setLoading(true);
      setError('');
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        console.log('Session data:', session);
        
        if (!session || !session.user) {
          console.log('No active session found, checking localStorage fallback...');
          // Fallback to localStorage role for testing
          const fallbackRole = signupRole || 'Student';
          console.log('Using fallback role:', fallbackRole);
          setRole(fallbackRole);
          setLoading(false);
          return;
        }
        
        const userRole = session.user.user_metadata?.role;
        console.log('Role from user metadata:', userRole);
        
        if (!userRole) {
          console.log('No role in metadata, using localStorage or default');
          const fallbackRole = signupRole || 'Student';
          console.log('Using fallback role:', fallbackRole);
          setRole(fallbackRole);
        } else {
          console.log('Using role from session:', userRole);
          setRole(userRole);
        }
      } catch (err) {
        console.error('Error fetching role:', err.message);
        console.log('Using localStorage fallback due to error');
        const fallbackRole = signupRole || 'Student';
        setRole(fallbackRole);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRole();
  }, []);

  if (loading) return <div>Loading profile setup...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  console.log('=== RENDERING PROFILE SETUP ===');
  console.log('Final role being used:', role);
  console.log('Will render form for:', role);
  console.log('=====================================');

  return (
    <div>
      {role === 'Student' && <StudentProfileForm />}
      {role === 'Parent' && <ParentProfileForm />}
      {role === 'Teacher' && <TeacherProfileForm />}
      {role !== 'Student' && role !== 'Parent' && role !== 'Teacher' && <div>Unknown role: {role}</div>}
    </div>
  );
};

export default ProfileSetup;