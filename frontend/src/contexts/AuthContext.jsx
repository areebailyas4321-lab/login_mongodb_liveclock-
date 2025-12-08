import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initial check for token
    useEffect(() => {
        const checkLoggedIn = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const config = {
                        headers: { Authorization: `Bearer ${token}` }
                    };
                    const response = await axios.get('http://localhost:8000/auth/me', config);
                    setUser(response.data);
                } catch (error) {
                    console.error("Token verification failed", error);
                    localStorage.removeItem('token');
                    setUser(null);
                }
            }
            setLoading(false);
        };

        checkLoggedIn();
    }, []);

    const login = async (username, password) => {
        const params = new URLSearchParams();
        params.append('username', username);
        params.append('password', password); // Login usually expects form data for OAuth2 password flow, but my backend schema uses JSON body?
        // Wait, my backend auth.py uses database query.
        // routers/auth.py handles 'UserLogin' pydantic model which expects JSON body.
        // So I should send JSON.

        try {
            const response = await axios.post('http://localhost:8000/auth/login', { username, password });
            // But wait, the previous code for Token (OAuth2PasswordBearer) often expects form-data.
            // My backend router currently is:
            // @router.post("/login", response_model=Token)
            // async def login(user: UserLogin): ...
            // This expects JSON body.
            // However, OAuth2PasswordBearer in auth.py `tokenUrl="auth/login"` suggests it *might* want form data if using Swagger UI, but for my custom frontend JSON is fine as long as I send JSON.
            // The router explicitly asks for `UserLogin` model which is JSON compatible. All good.

            const { access_token } = response.data;
            localStorage.setItem('token', access_token);

            // Get user details
            const config = {
                headers: { Authorization: `Bearer ${access_token}` }
            };
            const userResponse = await axios.get('http://localhost:8000/auth/me', config);
            setUser(userResponse.data);
            return true;
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        }
    };

    const register = async (username, password) => {
        try {
            await axios.post('http://localhost:8000/auth/register', { username, password });
            return true;
        } catch (error) {
            console.error("Registration failed", error);
            throw error;
        }
    };

    const resetPassword = async (username, password) => {
        try {
            await axios.post('http://localhost:8000/auth/reset-password', { username, password });
            return true;
        } catch (error) {
            console.error("Password reset failed", error);
            throw error;
        }
    };

    const googleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:8000/auth/google-demo');
            const { access_token } = response.data;
            localStorage.setItem('token', access_token);

            const config = {
                headers: { Authorization: `Bearer ${access_token}` }
            };
            const userResponse = await axios.get('http://localhost:8000/auth/me', config);
            setUser(userResponse.data);
            return true;
        } catch (error) {
            console.error("Google login failed", error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, resetPassword, googleLogin, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
