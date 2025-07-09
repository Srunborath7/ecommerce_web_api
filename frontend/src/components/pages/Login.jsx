import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import '../../style/Form.css'; 
import logo from '../../assets/logo.png';
import { useNavigate } from 'react-router-dom';
function Login() {
  useEffect(() => {
    document.title = 'Login | eCommerce';
  }, []);

  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage(''); // clear old message

    try {
      const res = await fetch(`http://localhost:5000/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // if your backend uses session cookies
        body: JSON.stringify({ emailOrUsername, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        console.log('Login success user:', data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/dashboard');
      } else {
        setMessage(data.message || 'Login failed');
      }
    } catch (error) {
      setMessage('Network error');
      console.error(error);
    }
  };

  return (
    <div className="login-bg-cartoon d-flex align-items-center justify-content-center">
      <div className="login-card-cartoon animate-pop-in">
        <div className="text-center mb-4">
          <img src={logo} alt="Logo" className="logo-cartoon" />
          <h2 className="login-title-cartoon">🎉 Let's Sign In!</h2>
          <p className="login-subtitle-cartoon">Fun begins with your ticket 🎫</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Username or Email</label>
            <input 
              type="text" 
              className="form-control rounded-pill cartoon-input" 
              id="email" 
              name="emailOrUsername" 
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              required 
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="form-label">Password</label>
            <input 
              type="password" 
              className="form-control rounded-pill cartoon-input" 
              id="password" 
              name="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-cartoon">🚀 Login</button>
          </div>
        </form>
        {message && (
          <div className="text-center mt-3" style={{ color: message.includes('success') ? 'green' : 'red' }}>
            {message}
          </div>
        )}
        <div className="text-center mt-3">
          <small>
            Don't have an account? <a href="/register">Create one 📝</a>
          </small>
        </div>
      </div>
    </div>
  );
}

export default Login;
