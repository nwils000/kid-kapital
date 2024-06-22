import React, { useState } from 'react';
import '../styles/navbar.css';
import { Link } from 'react-router-dom';
import { FaHome, FaStore, FaTasks, FaBars, FaTimes } from 'react-icons/fa';
import { GiTakeMyMoney, GiPayMoney } from 'react-icons/gi';

export default function ChildNavbar() {
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
              className="nav-link"
              to="/child-dashboard"
              onClick={toggleMenu}
            >
              <div className="icon-wrapper">
                <FaHome />
                <span>Dashboard</span>
              </div>
            </Link>
            <Link className="nav-link" to="/family-store" onClick={toggleMenu}>
              <div className="icon-wrapper">
                <FaStore />
                <span>Store</span>
              </div>
            </Link>
            <Link
              className="nav-link"
              to="/child-financial-accounts"
              onClick={toggleMenu}
            >
              <div className="icon-wrapper">
                <GiPayMoney />
                <span>Finances</span>
              </div>
            </Link>
            <Link
              className="nav-link"
              to="/responsibilities"
              onClick={toggleMenu}
            >
              <div className="icon-wrapper">
                <FaTasks />
                <span>My Responsibilities</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
      <div style={{ height: '120px' }}></div>
    </div>
  );
}
