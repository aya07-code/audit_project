import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiPost } from '../utils/api';
import '../styles/AuthNavbar.css';

const AuthNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await apiPost('/logout', {});
    } catch (e) {
      // ignore server errors during logout
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/', { replace: true });
      setTimeout(() => window.location.reload(), 100);
    }
  };

  return (
    <nav className="auth-nav">
      <div className="brand">
        <Link to="/">
          <img src="/img/logo.png" alt="Logo" className="site-logo" />
        </Link>
        <ul className="auth-nav-links">
          <li><a href="/">Home</a></li>
          <li><Link to="/client/dashboard">Dashboard</Link></li>
          <li><Link to="/notifications">Notifications</Link></li>
          <li><button onClick={handleLogout} className="btn-logout">Logout</button></li>
        </ul>
      </div>
    </nav>
  );
};

export default AuthNavbar;