import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import './AuthAnimation.css';
import uitLogo from "../assets/UIT.jpeg";

export default function Signup() {
  const { signup, user } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  /* ---------- VALIDATION ---------- */

  const validateEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const validatePassword = (value) => {
    return value.length >= 8;
  };

  /* ---------- SUBMIT ---------- */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters');
      return;
    }

    try {
      await signup(email, password);
      navigate('/home');
    } catch (err) {
      setError(err.message);
    }
  };

  /* ---------- UI ---------- */

  return (
  <div className="auth-page">

    <div className="auth-container">

      {/* LEFT */}
      <div className="auth-left">
        <div className="brand">
          <img src={uitLogo} alt="UIT Logo" className="uit-logo" />
          <p>Learn Research<br />Innovate</p>
          <h3>United Institute of Technology</h3>
          <span>HALL BOOKING</span>
          <p className="sub">
            Create your account for hall booking
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="auth-right">
        <form onSubmit={handleSubmit} className="auth-form">

          <h2>Create Account</h2>
          <p className="subtitle">Register to continue</p>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="password-box">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span onClick={() => setShowPassword(!showPassword)}>
              👁
            </span>
          </div>

          {error && <p className="error">{error}</p>}

          <button type="submit">SIGN UP</button>

          <p className="switch">
            Already have an account? <Link to="/login">Login</Link>
          </p>

        </form>
      </div>

    </div>

  </div>
);
}