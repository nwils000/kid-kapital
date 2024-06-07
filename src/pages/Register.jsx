import '../styles/register.css';
import { Link } from 'react-router-dom';
import { FaEye } from 'react-icons/fa';
import { FaEyeSlash } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { createUser } from '../api-calls/api.js';
import LandingPageNavBar from '../layout/LandingPageNavBar.jsx';

export default function Register() {
  const [passwordHidden, setPasswordHidden] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordType, setPasswordType] = useState('password');

  useEffect(() => {
    if (passwordHidden) {
      setPasswordType('password');
    } else {
      setPasswordType('text');
    }
  }, [passwordHidden]);

  const handleSubmit = () => {
    createUser({ username, password, firstName, lastName });
  };

  return (
    <>
      <LandingPageNavBar />
      <div className="signup">
        <div></div>
        <h1>
          Create account<span>.</span>
        </h1>
        <p>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
        <div className="signup-input-wrapper">
          <div className="label-input-wrapper" style={{ position: 'relative' }}>
            <label htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              type="text"
              onChange={(e) => setFirstName(e.target.value)}
              value={firstName}
              placeholder="Reece"
            />
          </div>
          <div className="label-input-wrapper" style={{ position: 'relative' }}>
            <label htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              type="text"
              onChange={(e) => setLastName(e.target.value)}
              value={lastName}
              placeholder="Walter"
            />
          </div>
          <div className="label-input-wrapper" style={{ position: 'relative' }}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              placeholder="JDizzy-7"
            />
          </div>
          <div className="label-input-wrapper" style={{ position: 'relative' }}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type={passwordType}
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="m#P52s@ap$V"
            />
            {passwordHidden ? (
              <div className="eye" onClick={() => setPasswordHidden(false)}>
                <FaEyeSlash />
              </div>
            ) : (
              <div className="eye" onClick={() => setPasswordHidden(true)}>
                <FaEye />
              </div>
            )}
          </div>
          <Link
            to="/login"
            onClick={() => handleSubmit()}
            className="signup-button"
          >
            Create account
          </Link>
        </div>
      </div>
    </>
  );
}
