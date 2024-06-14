import '../styles/navbar.css';
import { Link } from 'react-router-dom';

function LandingPageNavbar() {
  return (
    <>
      <div className="navbar">
        <Link to="/">
          <span className="logo-text">Kid Kapital</span>
        </Link>
        <div className="nav-links-wrapper">
          <Link className="nav-link" to="/register">
            Register
          </Link>
          <Link to="/login" className="nav-link">
            Sign in
          </Link>
        </div>
      </div>
      <div style={{ height: '6rem' }}></div>
    </>
  );
}

export default LandingPageNavbar;
