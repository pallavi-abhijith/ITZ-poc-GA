# ITZ Educational Platform - Frontend

A comprehensive educational platform that provides role-based interfaces for students, teachers, and parents with complete authentication and profile management flows.

## Overview

The ITZ Educational Platform is a React-based web application that serves different user types with tailored dashboards and functionality. The platform includes a complete user onboarding flow with role-based routing and profile setup.

## Current Features

### **Homepage & Authentication**
- Clean landing page with ITZ branding and background imagery
- Role-based login system with automatic routing
- Complete signup flow with role selection (Student, Teacher, Parent)
- Email confirmation simulation for testing
- Header component with consistent navigation

### **Student Experience**
- **Multi-step Profile Setup:**
  - Basic profile form (school, grade, teacher, preferences)
  - Interactive buddy selection (Cat or Dog)
  - Calibration page for future learning assessments
- **Complete Flow:** Signup → Email Confirmation → Profile Setup → Buddy Selection → Calibration → Student Dashboard
- Student dashboard with performance tracking and interactive elements

### **Teacher Interface**
- **Teacher Profile Setup:** School details, position, subject, special education certification
- **Complete Flow:** Signup → Email Confirmation → Profile Setup → Teacher Dashboard
- Teacher dashboard with class management tools
- Student performance monitoring and reporting capabilities

### **Parent Interface**
- **Parent Profile Setup:** Student information, school details, learning preferences, IEP/504 plan upload
- **Complete Flow:** Signup → Email Confirmation → Profile Setup → Parent Dashboard  
- Parent dashboard for monitoring student progress
- Communication tools with teachers

### **Reading Session**
- Interactive reading sessions with timer functionality
- Document viewing capabilities (DOCX, PDF, images, text)
- Background music selection for focus
- Subject-based learning materials

## Technology Stack

### **Core Technologies**
- **React** 19.1.0 - Main frontend framework
- **React Router DOM** 6.26.1 - Client-side routing
- **Create React App** - Build toolchain

### **Data Visualization & UI**
- **Recharts** 3.1.0 - Charts and analytics
- **React Select** 5.10.2 - Enhanced dropdowns

### **Document Processing**
- **jsPDF** 3.0.1 - PDF generation for reports
- **mammoth** 1.9.1 - Word document viewing
- **react-pdf** 10.0.1 - PDF viewing

### **Authentication (Planned)**
- **Supabase** - User authentication and database (currently mocked)

## Project Structure

```
src/
├── pages/                          
│   ├── Homepage.js                
│   ├── Login.js                    
│   ├── SignUp.js                   
│   ├── EmailConfirmation.js        
│   ├── ProfileSetup.js             
│   ├── BuddySelection.js           
│   ├── Calibration.js              
│   ├── StudentDashboard.js         
│   ├── TeacherDashboard.js         
│   ├── ParentInterface.js          
│   └── ReadingSession.js          
├── components/
│   ├── common/                     
│   │   ├── Header.js               
│   │   └── Header.css             
│   ├── forms/                      
│   │   ├── StudentProfileForm.js   
│   │   ├── ParentProfileForm.js    
│   │   └── TeacherProfileForm.js   
│   ├── student/                    
│   │   ├── MainContent.js          
│   │   └── Sidebar.js              
│   ├── teacher/                    
│   │   ├── LeftSidebar.js          
│   │   ├── MainContent.js          
│   │   └── RightSidebar.js         
│   ├── parent/                    
│   │   ├── LeftColumn.js           
│   │   └── RightContent.js         
│   ├── reading/                   
│   │   ├── LeftSection.js          
│   │   ├── RightSection.js         
│   │   └── Clock.js                
│   └── quiz/                       
│       ├── QuizDashboard.js        
│       ├── QuizCard.js             
│       ├── QuizInterface.js        
│       ├── CountdownPage.js        
│       └── ModalPortal.js          
├── styles/                         
│   ├── Dashboard.css               
│   ├── Homepage.css                
│   ├── student/                    
│   ├── teacher/                    
│   ├── parent/                     
│   ├── reading/                    
│   └── quiz/                       
├── assets/                         
│   └── images/                     
│       ├── logos/                  
│       ├── avatars/                
│       ├── backgrounds/            
│       └── icons/                  
├── utils/                          
│   └── supabase.js                 
└── public/                         
    └── first-page.png              
```

## Current Application Flow

### **Authentication & Onboarding**
1. **Homepage** (`/`) - Landing page with Login/Signup buttons
2. **Signup** (`/signup`) - Role selection and account creation
3. **Email Confirmation** (`/email-confirmation`) - Verification simulation
4. **Profile Setup** (`/profile-setup`) - Role-based profile forms

### **Role-Based Routing**
After profile completion, users are redirected based on their role:

- **Students:** `/student` (via `/buddy-selection` → `/calibration`)
- **Teachers:** `/teacher`  
- **Parents:** `/parent`

### **Additional Routes**
- **Login:** `/login` - Authentication with role-based redirect
- **Reading Session:** `/reading-session` - Accessible from dashboards

## Testing & Mock Implementation

### **🧪 Current Testing Code (To Be Removed)**

The following mock implementations are in place for development and will be replaced with real integrations:

#### **Mock Authentication (`/src/utils/supabase.js`)**
```javascript
// Mock Supabase client for testing UI without backend
export const supabase = {
  auth: {
    signUp: async ({ email, password, options }) => {
      // Mock user creation with role assignment
      return { data: { user: { email, user_metadata: { role } } }, error: null };
    },
    signInWithPassword: async ({ email, password }) => {
      // Mock login with role-based user data
      return { data: { user: { email, user_metadata: { role } } }, error: null };
    }
    // ... other mock auth methods
  }
};
```

#### **localStorage Testing Data**
- `testRole` - For testing role switching during development
- `signupRole` - Stores selected role during signup flow
- `studentProfileData` - Stores student form data
- `selectedBuddy` - Stores buddy selection (Cat/Dog)
- `parentProfileData` - Stores parent form data

#### **Development Console Logs**
Extensive logging throughout the application for debugging:
- Signup flow tracking
- Role detection and routing
- Profile data storage
- Email simulation logs
- Navigation state tracking

#### **Simulation Features**
- **Email Verification Button** - Simulates clicking email confirmation link
- **Profile Data Storage** - Uses localStorage instead of database
- **Role-based Routing** - Works with mock authentication data

### **🔄 Production Integration Requirements**

When moving to production, the following will be implemented:

#### **Real Authentication Integration**
- Replace mock Supabase client with real Supabase project
- Set up proper user authentication tables
- Implement secure session management
- Add password reset functionality

#### **Database Schema**
- User profiles table with role-specific fields
- Student-teacher-parent relationships
- Learning progress tracking
- Quiz results and analytics

#### **Email Integration**
- Real email service (SendGrid, AWS SES, or Supabase email)
- Email templates for verification and notifications
- Role-based email content

#### **File Upload**
- Secure file storage for IEP/504 plans
- Profile image uploads
- Document sharing capabilities

#### **Real-time Features**
- Live notifications
- Real-time dashboard updates
- Teacher-parent communication

## Installation & Development

### **Prerequisites**
- Node.js (version 14 or higher)
- npm or yarn

### **Installation**
```bash
# Navigate to project directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start

# Open http://localhost:3000
```

### **Available Scripts**
- `npm start` - Development server with hot reload
- `npm build` - Production build
- `npm test` - Run test suite
- `npm eject` - Eject from Create React App

### **Development Testing**
1. **Test Complete User Flows:**
   - Signup with different roles
   - Email confirmation simulation
   - Profile setup for each role
   - Dashboard access verification

2. **Role-based Testing:**
   - Student: Full onboarding flow with buddy selection
   - Teacher: Profile setup and dashboard access
   - Parent: Profile setup with file upload simulation

3. **Navigation Testing:**
   - Header navigation consistency
   - Role-based routing verification
   - Page height and responsive design

## Code Quality & Architecture

### **Component Organization**
- **Pages** - Route-level components
- **Forms** - Reusable profile forms extracted from main components
- **Common** - Shared UI components (Header, etc.)
- **Feature-specific** - Components grouped by user role

### **Styling Approach**
- CSS modules for component-specific styles
- Shared color palette (currently duplicated, can be centralized)
- Responsive design with viewport-based layouts
- Consistent ITZ branding throughout

### **State Management**
- React built-in state management
- localStorage for development/testing data
- Prepared for backend integration with minimal changes

## Browser Compatibility

Optimized for modern browsers:
- Chrome (latest)
- Firefox (latest) 
- Safari (latest)
- Edge (latest)

## Contributing Guidelines

### **Code Standards**
1. Maintain existing design patterns and visual consistency
2. Follow established folder structure
3. Use descriptive variable and function names
4. Implement responsive design for all new components
5. Test across all user interfaces and roles

### **Before Production Deployment**
1. Remove all mock authentication code
2. Clear development console.logs
3. Replace localStorage with real database operations
4. Implement real email service
5. Set up proper error handling and loading states
6. Add comprehensive testing suite

### **File Naming Conventions**
- **Pages:** PascalCase (e.g., `StudentDashboard.js`)
- **Components:** PascalCase (e.g., `Header.js`)
- **CSS:** Match component name (e.g., `Header.css`)
- **Utilities:** camelCase (e.g., `supabase.js`)

## Deployment

### **Development Build**
```bash
npm run build
```

### **Production Checklist**
- [ ] Remove mock authentication
- [ ] Clear console.logs and debug code
- [ ] Replace localStorage with database
- [ ] Implement real email service
- [ ] Set up environment variables
- [ ] Configure production Supabase project
- [ ] Test all user flows end-to-end
- [ ] Implement proper error boundaries
- [ ] Add loading states for all async operations

The application is architected to make the transition from mock to real backend integration seamless, with clear separation between UI logic and data management.