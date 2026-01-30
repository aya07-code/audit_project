import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdPerson, MdEmail, MdLock, MdPhone, MdLocationCity, MdHome, MdBusiness ,MdVisibility, MdVisibilityOff} from 'react-icons/md';
import '../styles/Register.css';
import Sidebar from "./Sidebar";
import Footer1 from './Footer1';
import axios from 'axios';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const Register = () => {
    const MySwal = withReactContent(Swal);
    const navigate = useNavigate();
    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState({
        // 🔹 Customer info
        name: '', email: '', password: '', password_confirmation: '', phone: '', adress: '', ville: '',
        // 🔹 Company info
        company_name: '', ICE: '', RC: '', company_address: '', activity_id: '',productType: ''
    });

    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        axios.get('https://alloaudit.com/api/activities')
            .then(res => setActivities(res.data))
            .catch(err => console.log(err));
    }, []);

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleNext = () => setStep(prev => prev + 1);
    const handlePrev = () => setStep(prev => prev - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const payload = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                password_confirmation: formData.password_confirmation,
                phone: formData.phone,
                adress: formData.adress,
                ville: formData.ville,
                company_name: formData.company_name,
                ICE: formData.ICE,
                RC: formData.RC,
                company_address: formData.company_address,
                productType: formData.productType,
                activity_id: formData.activity_id,
                role: 'customer',
                is_active: false
            };

            await axios.post("https://alloaudit.com/api/register", payload);

            MySwal.fire({
                icon: "success",
                title: "Account Created!",
                text: "Wait for admin approval. Your account and company are pending.",
                confirmButtonColor: "#1E3A8A"
            });

            setFormData({
                name:'', email:'', password:'', password_confirmation:'', phone:'', adress:'', ville:'',
                company_name:'', ICE:'', RC:'', company_address:'', activity_id:'' ,productType:''
            });
            setStep(1);
            navigate('/login');

            } catch (err) {
                if (err.response?.data?.errors) {
                    // جمع جميع رسائل الأخطاء فواحد السترانغ
                    const allErrors = Object.values(err.response.data.errors)
                        .flat()
                        .join("\n");

                    setError(allErrors);
                } else {
                    setError(err.response?.data?.message || "An error occurred");
                }

                setLoading(false);
            }
    };

    return (
        <div>
            <Sidebar />
            <div className="auth-container1">
                <div className="auth-box1">
                    <h2>Create Account</h2>
                    {error && <div className="error-msg">{error}</div>}

                    <form className="auth-form1" onSubmit={handleSubmit}>
                        {/* === Step 1: Customer Info === */}
                        {step === 1 && (
                            <>
                                <div className="form-group1">
                                    <label>Full Name</label>
                                    <div className="input-icon">
                                        <MdPerson className="icon"/>
                                        <input name="name" value={formData.name} onChange={handleChange} required/>
                                    </div>
                                </div>

                                <div className="form-group1">
                                    <label>Email</label>
                                    <div className="input-icon">
                                        <MdEmail className="icon"/>
                                        <input name="email" type="email" value={formData.email} onChange={handleChange} required/>
                                    </div>
                                </div>

                                <div className="form-row1">
                                    <div className="form-group1">
                                        <label>Password</label>
                                        <div className="input-icon">
                                            <MdLock className="icon" />
                                            <input
                                                name="password"
                                                type={showPassword ? "text" : "password"}
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
                                    <div className="form-group1">
                                        <label>Confirm Password</label>
                                        <div className="input-icon">
                                            <MdLock className="icon" />
                                            <input
                                                name="password_confirmation"
                                                type={showConfirmPassword ? "text" : "password"}
                                                value={formData.password_confirmation}
                                                onChange={handleChange}
                                                required
                                            />
                                            {showConfirmPassword ? (
                                                <MdVisibilityOff
                                                    className="eye-icon"
                                                    onClick={() => setShowConfirmPassword(false)}
                                                />
                                            ) : (
                                                <MdVisibility
                                                    className="eye-icon"
                                                    onClick={() => setShowConfirmPassword(true)}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="form-row1">
                                    <div className="form-group1">
                                        <label>Phone</label>
                                        <div className="input-icon">
                                            <MdPhone className="icon"/>
                                            <input name="phone" value={formData.phone} onChange={handleChange} required/>
                                        </div>
                                    </div>

                                    <div className="form-group1">
                                        <label>City</label>
                                        <div className="input-icon">
                                            <MdLocationCity className="icon"/>
                                            <input name="ville" value={formData.ville} onChange={handleChange} required/>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group1">
                                    <label>Address</label>
                                    <div className="input-icon">
                                        <MdHome className="icon"/>
                                        <input name="adress" value={formData.adress} onChange={handleChange} required/>
                                    </div>
                                </div>

                                <button type="button" onClick={handleNext} className="auth-button1">Next</button>
                            </>
                        )}

                        {/* === Step 2: Company Info === */}
                        {step === 2 && (
                            <>
                                <div className="form-group1">
                                    <label>Company Name</label>
                                    <div className="input-icon">
                                        <MdBusiness className="icon"/>
                                        <input name="company_name" value={formData.company_name} onChange={handleChange} required/>
                                    </div>
                                </div>

                                <div className="form-row1">
                                    <div className="form-group1">
                                        <label>ICE</label>
                                        <input name="ICE" value={formData.ICE} onChange={handleChange}/>
                                    </div>

                                    <div className="form-group1">
                                        <label>RC</label>
                                        <input name="RC" value={formData.RC} onChange={handleChange}/>
                                    </div>
                                </div>

                                <div className="form-group1">
                                    <label>Company Address</label>
                                    <input name="company_address" value={formData.company_address} onChange={handleChange}/>
                                </div>
                                <div className="form-group1">
                                    <label>product Type</label>
                                    <input name="productType" value={formData.productType} onChange={handleChange}/>
                                </div>

                                <div className="form-group1">
                                    <label>Activity</label>
                                    <select   className="select"  name="activity_id" value={formData.activity_id} onChange={handleChange} required>
                                        <option value="">Select Activity</option>
                                        {activities.map(act => <option key={act.id} value={act.id}>{act.name}</option>)}
                                    </select>
                                </div>

                                <div className="flex gap-2 mt-4">
                                    <button type="button" onClick={handlePrev} className="auth-button1 bg-gray-500">Previous</button>
                                    <button type="submit" disabled={loading} className="auth-button1">{loading ? 'Please wait...' : 'Register'}</button>
                                </div>
                            </>
                        )}
                    </form>
                </div>
            </div>
            <Footer1 />
        </div>
    );
};

export default Register;
