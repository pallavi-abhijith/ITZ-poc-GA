import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import ITZLogo from '../../assets/images/logos/ITZ.png';

const Header = ({ buttons = [], onNavClick, activeButton: initialActiveButton = 1 }) => {
  const [currentActiveButton, setCurrentActiveButton] = useState(initialActiveButton);
  const navigate = useNavigate();
  
  const navButtons = buttons;

  const handleNavClick = (button) => {
    setCurrentActiveButton(button.id);
    
    // Handle navigation if path is provided
    if (button.path) {
      navigate(button.path);
    }
    
    // Pass click to parent component for custom handling
    if (onNavClick) onNavClick(button);
    
    console.log(`Clicked: ${button.label}`);
  };

  return (
    <nav className="navigation-bar">
      <div className="nav-logo">
        <img src={ITZLogo} alt="ITZ Logo" className="logo-image" />
        <div className="logo-content">
        </div>
      </div>
      
      <div className="nav-buttons">
        {navButtons.map(button => (
          <button
            key={button.id}
            className={`nav-button ${currentActiveButton === button.id ? 'active' : ''} ${button.label === 'Dashboard' || button.label === 'Start Learning' || button.label === 'Student Performance' ? 'long-text' : ''}`}
            onClick={() => handleNavClick(button)}
          >
            <span className="button-label">{button.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Header;