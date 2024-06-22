import React, { useState } from 'react';
import '../styles/navbar.css';
import { Link } from 'react-router-dom';
import { GiTakeMyMoney } from 'react-icons/gi';
import { FaBars, FaTimes } from 'react-icons/fa';

export default function LandingNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <div className="navbar-wrapper">
        <div className="navbar">
          <Link to="/" className="nav-item">
            <div className="logo-wrapper">
              <GiTakeMyMoney className="logo-icon" />
              <span className="logo-text">Kid Kapital</span>
            </div>
          </Link>
          <div className="hamburger-menu" onClick={toggleMenu}>
            {isOpen ? <FaTimes /> : <FaBars />}
          </div>
          <div className={`nav-links-wrapper ${isOpen ? 'show-menu' : ''}`}>
            <Link
              className="nav-link landing-page-link"
              to="/register"
              onClick={toggleMenu}
            >
              Register
            </Link>
            <Link
              className="nav-link landing-page-link"
              to="/login"
              onClick={toggleMenu}
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
      <div style={{ height: '120px' }}></div>
    </div>
  );
}
