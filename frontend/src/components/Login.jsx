import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdEmail, MdLock } from 'react-icons/md';
import '../styles/Login.css';
import { apiPost } from '../utils/api';
import Footer1 from './Footer1';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await apiPost('/login', formData);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }
                        localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Redirect based on role
            if (data.user.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/customer/dashboard');
            }

        } catch (err) {
            setError(err.message || 'An error occurred during login');
            console.error('Login error:', err);
        }
    };
    return (
      <div>
        <div className="auth-container">
            <div className="auth-box">
                <h2>Welcome Back</h2>
                <p className="auth-subtitle">Please enter your credentials to login</p>
                
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <div className="input-icon">
                            <MdEmail className="icon" />
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-icon">
                            <MdLock className="icon" />
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>


                    <button type="submit" className="auth-button">
                        Login
                    </button>
                </form>

                <p className="auth-footer">
                    Don't have an account? <a href="/register">Sign up</a>
                </p>
            </div>
        </div>
            <Footer1 />
      </div>
    );
};

export default Login;