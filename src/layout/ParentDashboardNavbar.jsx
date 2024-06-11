import '../styles/navbar.css';
import '../styles/parent-navbar.css';
import { Link } from 'react-router-dom';

export default function ParentDashboardNavbar() {
  return (
    <>
      <div className="navbar parent-navbar">
        <Link to="/">
          <span className="logo-text">Family Finance</span>
        </Link>
        <div className="nav-links-wrapper">
          <Link className="nav-link" to="/parent-dashboard">
            Dashboard
          </Link>
          <Link to="/family" className="nav-link">
            Family Manager
          </Link>
          <Link to="/family-store" className="nav-link">
            Family Store
          </Link>
          <Link to="/parent-responsibilities" className="nav-link">
            My Responsibilities
          </Link>
        </div>
      </div>
      <div style={{ height: '6rem' }}></div>
    </>
  );
}
