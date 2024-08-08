import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import '../styles/LoginPage.css';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/toastify-custom.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/loginMe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        Cookies.set('token', data.token, { expires: 0.5 });
        setIsToastVisible(true) ;
        toast.success('Login successful!', {
          className: 'custom-toast',
          autoClose: 2000, // Faster toast duration
          onClose: () =>  navigate(`/dashboard/${username}`),// Set state when toast is visible
        });
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (isToastVisible) {
        navigate(`/dashboard/${username}`);
      } else {
        // Handle form submission if the toast is not visible
        handleSubmit(e);
      }
    }
  };

  return (
    <div className="wrapper">
      <ToastContainer />
      <div className="container">
        <h2>Login to Project Tracker</h2>
        <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" style={{ marginLeft: '0px' }}>Login</button>
        </form>
        <Link to="/forgot-password" className="forgot-password-link">
          Forgot Password?
        </Link>
        <Link to="/register" className="register-link">
          Don't have an account? Register here
        </Link>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default LoginPage;
