import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ParticleBackground from './ParticleBackground';
import ValidationMessage from './ValidationMessage';
import { validateEmail, validatePassword } from '../utils/validationUtils';
import './AuthPage.css';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [validation, setValidation] = useState({
        username: { isValid: false, message: '', show: false },
        password: { isValid: false, message: '', show: false }
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Real-time validation
        if (name === 'username') {
            const result = validateEmail(value);
            setValidation(prev => ({
                ...prev,
                username: { ...result, show: value.length > 0 }
            }));
        } else if (name === 'password') {
            const result = validatePassword(value);
            setValidation(prev => ({
                ...prev,
                password: { ...result, show: value.length > 0 }
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        // Validate before submitting
        const emailValidation = validateEmail(formData.username);
        const passwordValidation = validatePassword(formData.password);

        if (!emailValidation.isValid || !passwordValidation.isValid) {
            setError('Please fix validation errors before submitting');
            return;
        }

        try {
            await register(formData.username, formData.password);
            setSuccessMessage('✅ Registration successful! Please login now.');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError('Registration failed. Username might be taken.');
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
                    {/* Info Panel - Left */}
                    <div className="info-panel" style={{ order: 1 }}>
                        <div className="info-content">
                            <h1>Join Us Today!</h1>
                            <p>Create an account to unlock premium clock features, themes, and personalized time management tools.</p>
                            <Link to="/login" className="switch-btn-link">
                                <button className="switch-btn" aria-label="Switch to Login">
                                    Already have an account?
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* Form Panel - Right */}
                    <div className="form-panel" style={{ order: 2 }}>
                        <div className="form-content">
                            <h2>Sign Up</h2>

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

                            <form onSubmit={handleSubmit} className="auth-form-advanced">
                                <div className="form-group-advanced">
                                    <label htmlFor="username">Email</label>
                                    <input
                                        type="text"
                                        id="username"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        required
                                        className="auth-input-advanced"
                                        aria-describedby="username-validation"
                                        autoComplete="email"
                                    />
                                    <div id="username-validation" aria-live="polite">
                                        <ValidationMessage
                                            message={validation.username.message}
                                            isValid={validation.username.isValid}
                                            show={validation.username.show}
                                        />
                                    </div>
                                </div>

                                <div className="form-group-advanced">
                                    <label htmlFor="password">Password</label>
                                    {formData.password.length > 0 && (
                                        <div className="password-hint">
                                            💡 Password must have: 8+ chars, A-Z, 0-9, and !@#$%
                                        </div>
                                    )}
                                    <div className="password-input-wrapper">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            required
                                            className="auth-input-advanced"
                                            aria-describedby="password-validation"
                                            autoComplete="new-password"
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
                                    <div id="password-validation" aria-live="polite">
                                        <ValidationMessage
                                            message={validation.password.message}
                                            isValid={validation.password.isValid}
                                            show={validation.password.show}
                                        />
                                    </div>
                                </div>

                                <motion.button
                                    type="submit"
                                    className="submit-btn-advanced"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Sign Up
                                </motion.button>
                            </form>

                            <p className="toggle-text">
                                Already have an account? <Link to="/login" className="toggle-link">Login</Link>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;
