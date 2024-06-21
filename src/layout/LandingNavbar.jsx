import '../styles/navbar.css';
import { Link } from 'react-router-dom';
import { GiTakeMyMoney } from 'react-icons/gi';

export default function LandingNavbar() {
  return (
    <div>
      <div className="navbar-wrapper">
        <div className="navbar ">
          <Link to="/" className="nav-item">
            <div className="logo-wrapper">
              <GiTakeMyMoney className="logo-icon" />
              <span className="logo-text">Kid Kapital</span>
            </div>
          </Link>

          <div className="nav-links-wrapper">
            <Link className="nav-link landing-page-link" to="/register">
              Register
            </Link>
            <Link to="/login" className="nav-link landing-page-link">
              Sign in
            </Link>
          </div>
        </div>
      </div>
      <div style={{ height: '107px' }}></div>
    </div>
  );
}
