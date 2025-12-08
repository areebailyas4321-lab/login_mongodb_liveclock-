import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ParticleBackground from './ParticleBackground';
import ValidationMessage from './ValidationMessage';
import { validateEmail, validatePassword } from '../utils/validationUtils';
import './AuthPage.css';

const AuthPage = () => {
    const location = useLocation();
    const [isLogin, setIsLogin] = useState(location.pathname === '/login' || location.pathname === '/auth');
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [validation, setValidation] = useState({
        username: { isValid: false, message: '', show: false },
        password: { isValid: false, message: '', show: false }
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetFormData, setResetFormData] = useState({ username: '', newPassword: '' });
    const { login, register, resetPassword, googleLogin } = useAuth();
    const navigate = useNavigate();

    // Update state when URL changes (e.g. back button)
    React.useEffect(() => {
        setIsLogin(location.pathname === '/login' || location.pathname === '/auth');
    }, [location.pathname]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Real-time validation
        if (name === 'username') {
            const result = isLogin ? { isValid: true, message: '' } : validateEmail(value);
            setValidation(prev => ({
                ...prev,
                username: { ...result, show: value.length > 0 }
            }));
        } else if (name === 'password') {
            const result = isLogin ? { isValid: true, message: '' } : validatePassword(value);
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

        try {
            if (isLogin) {
                await login(formData.username, formData.password);
                setSuccessMessage('✅ Login successful! Redirecting...');
                setTimeout(() => {
                    navigate('/');
                }, 1500);
            } else {
                // Validate before submitting
                const emailValidation = validateEmail(formData.username);
                const passwordValidation = validatePassword(formData.password);

                if (!emailValidation.isValid || !passwordValidation.isValid) {
                    setError('Please fix validation errors before submitting');
                    return;
                }

                await register(formData.username, formData.password);
                setSuccessMessage('✅ Registration successful! Please login now.');
                setTimeout(() => {
                    setIsLogin(true);
                    setFormData({ username: '', password: '' });
                    setValidation({
                        username: { isValid: false, message: '', show: false },
                        password: { isValid: false, message: '', show: false }
                    });
                    setSuccessMessage('');
                }, 2000);
            }
        } catch (err) {
            setError(isLogin ? 'Invalid credentials' : 'Registration failed. Username might be taken.');
        }
    };

    const handleResetChange = (e) => {
        setResetFormData({ ...resetFormData, [e.target.name]: e.target.value });
    };

    const handleResetSubmit = async (e) => {
        e.preventDefault();
        try {
            await resetPassword(resetFormData.username, resetFormData.newPassword);
            setSuccessMessage('✅ Password updated! Please login with new password.');
            setShowForgotPassword(false);
            setResetFormData({ username: '', newPassword: '' });
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            alert('Failed to reset password. User might not exist.');
        }
    };



    const handleGoogleLogin = async () => {
        // Offer choice between Demo Login and Info Alert
        if (window.confirm("Simulate Google Login? (Demo Mode)\n\nClick OK to Login as Demo User.\nClick Cancel to see API Requirement details.")) {
            try {
                await googleLogin();
                setSuccessMessage('✅ Google Login Successful! (Demo Mode)');
                setTimeout(() => {
                    navigate('/');
                }, 1500);
            } catch (err) {
                setError('Google Login Failed. Backend might be down.');
            }
        } else {
            alert("To enable Real Google Login:\n\n1. Create a Project in Google Cloud Console.\n2. Enable OAuth 2.0 API.\n3. Get Client ID & Client Secret.\n4. Configure Backend with these credentials.");
        }
    };

    const toggleMode = () => {
        const newMode = !isLogin;
        navigate(newMode ? '/login' : '/register');
        setFormData({ username: '', password: '' });
        setValidation({
            username: { isValid: false, message: '', show: false },
            password: { isValid: false, message: '', show: false }
        });
        setError('');
        setSuccessMessage('');
    };

    return (
        <div className="auth-page">
            <ParticleBackground />

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
                    <h3>Reset Password</h3>
                    <p>Enter your username and new password to reset.</p>

                    <form onSubmit={handleResetSubmit} className="reset-form">
                        <div className="form-group-advanced" style={{ marginBottom: '1rem' }}>
                            <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={resetFormData.username}
                                onChange={handleResetChange}
                                className="auth-input-advanced"
                                required
                            />
                        </div>
                        <div className="form-group-advanced" style={{ marginBottom: '1rem' }}>
                            <input
                                type="password"
                                name="newPassword"
                                placeholder="New Password"
                                value={resetFormData.newPassword}
                                onChange={handleResetChange}
                                className="auth-input-advanced"
                                required
                                minLength={6}
                            />
                        </div>
                        <button type="submit" className="submit-btn-advanced" style={{ width: '100%' }}>
                            Update Password
                        </button>
                    </form>
                </motion.div>
            )}

            <div className="auth-container-wrapper">
                <motion.div
                    className="auth-panels"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Info Panel - Left */}
                    <motion.div
                        className="info-panel"
                        style={{ order: 1 }}
                    >
                        <div className="info-content">
                            <h1>{isLogin ? 'Welcome Back!' : 'Join Us Today!'}</h1>
                            <p>
                                {isLogin
                                    ? 'Access your personalized clock dashboard with advanced features and customization options.'
                                    : 'Create an account to unlock premium clock features, themes, and personalized time management tools.'
                                }
                            </p>
                            <button
                                className="switch-btn"
                                onClick={toggleMode}
                                aria-label={isLogin ? 'Switch to Sign Up' : 'Switch to Login'}
                            >
                                {isLogin ? 'Create Account' : 'Already have an account?'}
                            </button>
                        </div>
                    </motion.div>

                    {/* Form Panel - Right */}
                    <motion.div
                        className="form-panel"
                        style={{ order: 2 }}
                    >
                        <div className="form-content">
                            <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>

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


                            <form onSubmit={handleSubmit} className="auth-form-advanced">
                                <div className="form-group-advanced">
                                    <label htmlFor="username">
                                        {isLogin ? 'Username' : 'Email'}
                                    </label>
                                    <input
                                        type="text"
                                        id="username"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        required
                                        className="auth-input-advanced"
                                        aria-describedby="username-validation"
                                        autoComplete={isLogin ? 'username' : 'email'}
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
                                    {!isLogin && formData.password.length > 0 && (
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
                                            autoComplete={isLogin ? 'current-password' : 'new-password'}
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
                                    {isLogin ? 'Login' : 'Sign Up'}
                                </motion.button>

                                <div className="auth-divider">
                                    <span>OR</span>
                                </div>

                                <button
                                    type="button"
                                    className="google-btn"
                                    onClick={handleGoogleLogin}
                                >
                                    <svg className="google-icon" viewBox="0 0 48 48" width="24px" height="24px">
                                        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                                        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                                        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                                        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                                    </svg>
                                    Continue with Google
                                </button>

                                {isLogin && (
                                    <button
                                        type="button"
                                        className="forgot-password-link"
                                        onClick={() => setShowForgotPassword(true)}
                                    >
                                        Forgot Password?
                                    </button>
                                )}
                            </form>

                            <p className="toggle-text">
                                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                                <button
                                    onClick={toggleMode}
                                    className="toggle-link"
                                    type="button"
                                >
                                    {isLogin ? 'Sign Up' : 'Login'}
                                </button>
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default AuthPage;
