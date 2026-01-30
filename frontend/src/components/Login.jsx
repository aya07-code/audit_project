import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import Sidebar from "./Sidebar";
import '../styles/Login.css';
import { apiPost } from '../utils/api';
import Footer1 from './Footer1';
import Swal from 'sweetalert2';
import withReactContent from "sweetalert2-react-content";
import { useSearchParams } from "react-router-dom";

const Login = () => {
    const [searchParams] = useSearchParams();
    const redirect = searchParams.get("redirect");
    const MySwal = withReactContent(Swal);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
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
            localStorage.setItem('role', data.user.role); 

            // 1) redirect to specific audit if needed
            if (redirect && redirect.startsWith("audit-") && data.user.role === "customer") {
                const auditId = redirect.split("-")[1];
                navigate(`/customer/audits?audit=${auditId}`);
                return; 
            }

            // 2) redirect based on role
            if (data.user.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/customer/dashboard');
            }

        } catch (err) {
            console.error('Login error:', err);
            // Message returned from backend
            const errorMessage = err.message || 'An error occurred during login';
            if (errorMessage.includes('not yet approved')) {
                MySwal.fire({
                    icon: 'warning',
                    title: 'Account Pending',
                    text: 'Your account is not yet approved by the admin. Please wait.',
                    confirmButtonColor: '#1E3A8A'
                });
            } 
            else {
                MySwal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: errorMessage,
                    confirmButtonColor: '#1E3A8A'
                });
            }
        }
    };
    
    return (
      <div>
        <Sidebar />
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
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            {showPassword ? (
                                <MdVisibilityOff
                                    className="eye-icon"
                                    onClick={() => setShowPassword(false)}
                                />
                            ) : (
                                <MdVisibility
                                    className="eye-icon"
                                    onClick={() => setShowPassword(true)}
                                />
                            )}
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