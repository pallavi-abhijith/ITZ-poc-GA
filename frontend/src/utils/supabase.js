// Mock Supabase client for testing UI without backend
export const supabase = {
  auth: {
    signUp: async ({ email, password, options }) => {
      console.log('Mock signUp called with:', { email, password, options });
      return { 
        data: { user: { email, email_confirmed_at: null } }, 
        error: null 
      };
    },
    signInWithPassword: async ({ email, password }) => {
      console.log('Mock signIn called with:', { email, password });
      // For testing: return a user with role based on email domain or use testRole from localStorage
      const testRole = localStorage.getItem('testRole');
      const userRole = testRole || (email.includes('teacher') ? 'Teacher' : email.includes('parent') ? 'Parent' : 'Student');
      
      return { 
        data: { 
          user: { 
            email,
            user_metadata: {
              role: userRole
            }
          } 
        }, 
        error: null 
      };
    },
    getSession: async () => {
      console.log('Mock getSession called');
      return { 
        data: { session: null }, 
        error: null 
      };
    },
    getUser: async () => {
      console.log('Mock getUser called');
      return { 
        data: { user: null }, 
        error: null 
      };
    },
    updateUser: async (data) => {
      console.log('Mock updateUser called with:', data);
      return { error: null };
    },
    signOut: async () => {
      console.log('Mock signOut called');
      return { error: null };
    },
    onAuthStateChange: (callback) => {
      console.log('Mock onAuthStateChange called');
      return { 
        data: { 
          subscription: { 
            unsubscribe: () => console.log('Mock subscription unsubscribed') 
          } 
        } 
      };
    }
  }
};