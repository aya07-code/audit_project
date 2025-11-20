import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdPerson, MdEmail, MdLock, MdPhone, MdLocationCity, MdHome } from 'react-icons/md';
import '../styles/Register.css';
import Sidebar from "./Sidebar";
import axios from 'axios';
import Footer1 from './Footer1';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        phone: '',
        adress: '',
        ville: '',
    });
    const [successMessage, setSuccessMessage] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
                const payload  = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                password_confirmation: formData.password_confirmation,
                phone: formData.phone,
                adress: formData.adress,
                ville: formData.ville,
                role: 'customer',
                is_active: true
            };
            const responses = await axios.post("http://127.0.0.1:8000/api/register", payload );
            console.log('User registered:',responses.data); 

      setSuccessMessage("Registration successful! Welcome to IA Morocco.");
      setError(null);
      setFormData({ name: "", email: "", password: "", password_confirmation: "", phone: "", adress:"", ville:"" });
      setLoading(false);
      const userRole = responses.data.user.role;
      if (userRole === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/customer/dashboard');
      }

    } catch (err) {
      setError(
        err.response?.data?.message || 
        Object.values(err.response?.data?.errors || {})[0]?.[0] ||
        "An error occurred"
     );
      setSuccessMessage(null);
      setLoading(false);
    }
  };


    return (
      <div>
        <Sidebar />
        <div className="auth-container1">
            <div className="auth-box1">
                <h2>Create Account</h2>
                <p className="auth-subtitle1">Please fill in the form to register</p>
                {error && <div style={{background:'#fee2e2',color:'#dc2626',padding:'0.75rem',borderRadius:6,marginBottom:12}}>{typeof error === 'object' ? error.message : error}</div>}
                {successMessage && <div style={{background:'#d1fae5',color:'#065f46',padding:'0.75rem',borderRadius:6,marginBottom:12}}>{successMessage}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group1">
                        <label htmlFor="name">Full Name</label>
                        <div className="input-icon">
                            <MdPerson className="icon" />
                            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-group1">
                        <label htmlFor="email">Email</label>
                        <div className="input-icon">
                            <MdEmail className="icon" />
                            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-row1">
                        <div className="form-group1">
                            <label htmlFor="password">Password</label>
                            <div className="input-icon">
                                <MdLock className="icon" />
                                <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="form-group1">
                            <label htmlFor="password_confirmation">Confirm Password</label>
                            <div className="input-icon">
                                <MdLock className="icon" />
                                <input type="password" id="password_confirmation" name="password_confirmation" value={formData.password_confirmation} onChange={handleChange} required />
                            </div>
                        </div>
                    </div>

                    <div className="form-row1">
                        <div className="form-group1">
                            <label htmlFor="phone">Phone</label>
                            <div className="input-icon">
                                <MdPhone className="icon" />
                                <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="form-group1">
                            <label htmlFor="ville">City</label>
                            <div className="input-icon">
                                <MdLocationCity className="icon" />
                                <input type="text" id="ville" name="ville" value={formData.ville} onChange={handleChange} required />
                            </div>
                        </div>
                    </div>

                    <div className="form-group1">
                        <label htmlFor="adress">Address</label>
                        <div className="input-icon">
                            <MdHome className="icon" />
                            <input type="text" id="adress" name="adress" value={formData.adress} onChange={handleChange} required />
                        </div>
                    </div>

                    <button type="submit" className="auth-button1" disabled={loading}>
                        {loading ? 'Please wait...' : 'Register'}
                    </button>
                </form>

                <p className="auth-footer1">
                    Already have an account? <a href="/login">Login</a>
                </p>
            </div>
        </div>
         <Footer1 />
      </div>
    );
};

export default Register;
