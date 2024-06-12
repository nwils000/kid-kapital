import '../styles/register.css';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { createUser } from '../api-calls/api.js';
import LandingPageNavBar from '../layout/LandingPageNavbar.jsx';

export default function Register() {
  const [passwordHidden, setPasswordHidden] = useState(true);
  const [confirmPasswordHidden, setConfirmPasswordHidden] = useState(true);
  const [passwordType, setPasswordType] = useState('password');
  const [confirmPasswordType, setConfirmPasswordType] = useState('password');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [hubInputType, setHubInputType] = useState('');
  const [newFamilyHubName, setNewFamilyHubName] = useState('');
  const [familyHubInvitationCode, setFamilyHubInvitationCode] = useState('');
  const [parent, setParent] = useState(false);

  let navigate = useNavigate();

  useEffect(() => {
    setPasswordType(passwordHidden ? 'password' : 'text');
  }, [passwordHidden]);

  useEffect(() => {
    setConfirmPasswordType(confirmPasswordHidden ? 'password' : 'text');
  }, [confirmPasswordHidden]);

  const handleSubmit = () => {
    if (hubInputType === 'join' && parent === undefined) {
      alert('Please select whether you are a parent.');
      return;
    }
    if (password != confirmPassword) {
      alert('Your passwords do not match.');
      return;
    }
    createUser({
      familyHubInvitationCode:
        familyHubInvitationCode === '' ? null : familyHubInvitationCode,
      newFamilyHubName: newFamilyHubName === '' ? null : newFamilyHubName,
      username,
      password,
      firstName,
      lastName,
      parent: familyHubInvitationCode === '' ? true : parent,
    });
    navigate('/login');
  };

  return (
    <>
      <LandingPageNavBar />
      <div className="signup">
        <h1>
          Create account<span>.</span>
        </h1>
        <p>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
        <div className="signup-input-wrapper">
          <div className="label-input-wrapper" style={{ position: 'relative' }}>
            <span>
              Create a{' '}
              <button
                onClick={() => setHubInputType('new')}
                className="new-family-hub"
              >
                new family hub
              </button>{' '}
              or{' '}
              <button
                onClick={() => setHubInputType('join')}
                className="joining-one"
              >
                join one
              </button>
            </span>
          </div>
          {hubInputType === 'new' && (
            <div
              className="label-input-wrapper"
              style={{ position: 'relative' }}
            >
              <label htmlFor="newFamilyHubName">Family Hub Name</label>
              <input
                id="newFamilyHubName"
                type="text"
                onChange={(e) => setNewFamilyHubName(e.target.value)}
                value={newFamilyHubName}
                placeholder="The Wilsons"
              />
            </div>
          )}
          {hubInputType === 'join' && (
            <>
              <div
                className="label-input-wrapper"
                style={{ position: 'relative' }}
              >
                <label htmlFor="familyHubInvitationCode">
                  Family Hub Invitation Code
                </label>
                <input
                  id="familyHubInvitationCode"
                  type="text"
                  onChange={(e) => setFamilyHubInvitationCode(e.target.value)}
                  value={familyHubInvitationCode}
                  placeholder="JOINPS22"
                />
              </div>
              <div
                className="parent-input-wrapper"
                style={{ position: 'relative' }}
              >
                <label htmlFor="parent" className="parent-label">
                  Are you a parent?
                </label>
                <input
                  id="parent"
                  className="parent-input"
                  type="checkbox"
                  onChange={(e) => setParent(e.target.checked)}
                  checked={parent === true}
                />
              </div>
            </>
          )}

          {(hubInputType === 'join' || hubInputType === 'new') && (
            <>
              <div
                className="label-input-wrapper"
                style={{ position: 'relative' }}
              >
                <label htmlFor="firstName">First Name</label>
                <input
                  id="firstName"
                  type="text"
                  onChange={(e) => setFirstName(e.target.value)}
                  value={firstName}
                  placeholder="Reece"
                />
              </div>
              <div
                className="label-input-wrapper"
                style={{ position: 'relative' }}
              >
                <label htmlFor="lastName">Last Name</label>
                <input
                  id="lastName"
                  type="text"
                  onChange={(e) => setLastName(e.target.value)}
                  value={lastName}
                  placeholder="Walter"
                />
              </div>
              <div
                className="label-input-wrapper"
                style={{ position: 'relative' }}
              >
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  type="text"
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                  placeholder="JDizzy-7"
                />
              </div>
              <div
                className="label-input-wrapper"
                style={{ position: 'relative' }}
              >
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type={passwordType}
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  placeholder="m#P52s@ap$V"
                />

                <div className="eye" onClick={() => setPasswordHidden(false)}>
                  {passwordHidden ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
              <div
                className="label-input-wrapper"
                style={{ position: 'relative' }}
              >
                <label htmlFor="password">Confirm password</label>
                <input
                  id="confirmPassword"
                  type={confirmPasswordType}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                  placeholder="m#P52s@ap$V"
                />
                <div
                  className="eye"
                  onClick={() =>
                    setConfirmPasswordHidden(!confirmPasswordHidden)
                  }
                >
                  {confirmPasswordHidden ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
              <Link onClick={handleSubmit} className="signup-button">
                Create account
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
