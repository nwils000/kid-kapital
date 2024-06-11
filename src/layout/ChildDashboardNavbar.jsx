import '../styles/navbar.css';
import '../styles/child-navbar.css';
import { Link } from 'react-router-dom';

export default function ChildDashboardNavbar() {
  return (
    <>
      <div className="navbar child-navbar">
        <Link to="/">
          <span className="logo-text">Family Finance</span>
        </Link>
        <div className="nav-links-wrapper">
          <Link className="nav-link" to="/child-dashboard">
            Dashboard
          </Link>
          <Link to="/child-responsibilities" className="nav-link">
            My Responsibilities
          </Link>
        </div>
      </div>
      <div style={{ height: '6rem' }}></div>
    </>
  );
}
