import '../styles/login.css';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useState, useEffect, useContext } from 'react';
import { getToken, fetchUser } from '../api-calls/api.js';
import { MainContext } from '../context/context.js';
import LandingPageNavBar from '../layout/LandingPageNavBar.jsx';

export default function Login() {
  const { main } = useContext(MainContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordHidden, setPasswordHidden] = useState(true);
  const [passwordType, setPasswordType] = useState('password');
  const navigate = useNavigate();

  useEffect(() => {
    if (passwordHidden) {
      setPasswordType('password');
    } else {
      setPasswordType('text');
    }
  }, [passwordHidden]);

  useEffect(() => {
    console.log('THE TOKEN', main.state.accessToken);
  }, [main.state.accessToken]);

  const submit = async () => {
    try {
      const accessToken = await getToken({ main, username, password });
      await fetchUser({ accessToken, main });
      navigate('/dashboard');
    } catch (error) {
      console.log('Error:', error);
      navigate('/');
    }
  };

  return (
    <>
      <LandingPageNavBar />
      <div className="login">
        <div></div>
        <h1>
          Login<span>.</span>
        </h1>
        <p>
          Dont have an account? <Link to="/register">Sign up</Link>
        </p>
        <div className="login-input-wrapper">
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
          <span onClick={() => submit()} className="login-button">
            Login
          </span>
        </div>
      </div>
    </>
  );
}
