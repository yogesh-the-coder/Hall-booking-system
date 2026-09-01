import { useState } from 'react';
import { useNavigate, Link, } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import './AuthAnimation.css';
import uitLogo from "../assets/UIT.jpeg";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!password) {
      setError('Password is required');
      return;
    }

    try {
  await login(email, password);

  const session = JSON.parse(localStorage.getItem("session"));

  if (session?.role === "admin") {
      navigate("/admin", { replace: true });
} else {
  navigate('/home', { replace: true });
}

} catch (err) {
  setError(err.message);
}

};

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
            Login for better experience<br />
            Book your hall now !!!
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="auth-right">
        <form onSubmit={handleSubmit} className="auth-form">

          <h2>Welcome</h2>
          <p className="subtitle">Please login to continue</p>

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

          <button type="submit">LOGIN</button>

          <p className="switch">
            Don’t have an account? <Link to="/signup">Create account</Link>
          </p>

        </form>
      </div>

    </div>

  </div>
);
}


