import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ParticleBackground from './ParticleBackground';
import './AuthPage.css';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        try {
            await login(formData.username, formData.password);
            setSuccessMessage('✅ Login successful! Redirecting...');
            setTimeout(() => {
                navigate('/');
            }, 1500);
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="auth-page">
            <ParticleBackground />

            <div className="auth-container-wrapper">
                <motion.div
                    className="auth-panels"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="info-panel">
                        <div className="info-content">
                            <h1>Welcome Back!</h1>
                            <p>Access your personalized clock dashboard with advanced features and customization options.</p>
                            <Link to="/register" className="switch-btn-link">
                                <button className="switch-btn" aria-label="Switch to Sign Up">
                                    Create Account
                                </button>
                            </Link>
                        </div>
                    </div>

                    <div className="form-panel">
                        <div className="form-content">
                            <h2>Login</h2>

                            {error && (
                                <motion.div
                                    className="error-banner"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    {error}
                                </motion.div>
                            )}

                            {successMessage && (
                                <motion.div
                                    className="success-banner"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    {successMessage}
                                </motion.div>
                            )}

                            {/* Forgot Password Dialog */}
                            {showForgotPassword && (
                                <motion.div
                                    className="forgot-password-dialog"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                >
                                    <button
                                        className="close-dialog-btn"
                                        onClick={() => setShowForgotPassword(false)}
                                        aria-label="Close"
                                    >
                                        ✕
                                    </button>
                                    <h3>Password Requirements</h3>
                                    <p>Your password must have:</p>
                                    <ul>
                                        <li>✓ Minimum 8 characters</li>
                                        <li>✓ At least 1 uppercase letter (A-Z)</li>
                                        <li>✓ At least 1 number (0-9)</li>
                                        <li>✓ At least 1 special character (!@#$%)</li>
                                    </ul>
                                    <p className="hint-text">💡 Try to remember the password you used during signup!</p>
                                </motion.div>
                            )}

                            <form onSubmit={handleSubmit} className="auth-form-advanced">
                                <div className="form-group-advanced">
                                    <label htmlFor="username">Username</label>
                                    <input
                                        type="text"
                                        id="username"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        required
                                        className="auth-input-advanced"
                                        autoComplete="username"
                                    />
                                </div>

                                <div className="form-group-advanced">
                                    <label htmlFor="password">Password</label>
                                    <div className="password-input-wrapper">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            required
                                            className="auth-input-advanced"
                                            autoComplete="current-password"
                                        />
                                        <button
                                            type="button"
                                            className="password-toggle-btn"
                                            onClick={() => setShowPassword(!showPassword)}
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? '👁️' : '👁️‍🗨️'}
                                        </button>
                                    </div>
                                </div>

                                <motion.button
                                    type="submit"
                                    className="submit-btn-advanced"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Login
                                </motion.button>

                                <button
                                    type="button"
                                    className="forgot-password-link"
                                    onClick={() => setShowForgotPassword(true)}
                                >
                                    Forgot Password?
                                </button>
                            </form>

                            <p className="toggle-text">
                                Don't have an account? <Link to="/register" className="toggle-link">Sign Up</Link>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
