import React from 'react';
import Header from '../components/common/Header';
import '../styles/Homepage.css';

function Homepage() {
  const headerButtons = [
    { id: 1, label: 'Login', path: '/login' },
    { id: 2, label: 'Sign Up', path: '/signup' }
  ];

  return (
    <div className="homepage">
      <Header buttons={headerButtons} activeButton={null} />
      <div className="homepage-content">
        <img src={require('../styles/first-page.png')} alt="First Page" className="students-highlight-image" />
        <div className='homepage-bridge'> <p>Bridging the Gaps</p> </div>
        <div className="homepage-text">
          <img src={require('../assets/images/logos/ITZ.png')} alt="ITZ Logo" className="ITZ-highlight-image" />
          <p>Our mission is to empower students with learning differences by creating an AI adaptive, EdTech platform called ‘In The Zone’. </p>
          <br />
          <p>Using AI-driven conversational tools, computer vision, and advanced algorithms,  we aim to help students focus, strengthen working memory, and be emotionally supported.</p>
        </div>
      </div>
    </div>
  );
}

export default Homepage;