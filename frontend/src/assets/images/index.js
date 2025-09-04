// Asset imports for the unified app
// This file makes it easier to import assets from components

// Logos
import itzLogo from './logos/itz-logo.png';
import reactLogo192 from './logos/react-logo-192.png';
import reactLogo512 from './logos/react-logo-512.png';

// Avatars
import studentPanda from './avatars/student-panda.jpg';
import teacherAvatar from './avatars/teacher-avatar.jpg';
import teacherMamaPanda from './avatars/teacher-mama-panda.jpeg';

// Backgrounds
import readingSessionImage from './backgrounds/reading-session-image.png';

// Icons
import favicon from './icons/favicon.ico';

export {
  // Logos
  itzLogo,
  reactLogo192,
  reactLogo512,
  
  // Avatars
  studentPanda,
  teacherAvatar,
  teacherMamaPanda,
  
  // Backgrounds
  readingSessionImage,
  
  // Icons
  favicon
};

// Default export with organized structure
export default {
  logos: {
    itz: itzLogo,
    react192: reactLogo192,
    react512: reactLogo512
  },
  avatars: {
    studentPanda,
    teacherAvatar,
    teacherMamaPanda
  },
  backgrounds: {
    readingSession: readingSessionImage
  },
  icons: {
    favicon
  }
};