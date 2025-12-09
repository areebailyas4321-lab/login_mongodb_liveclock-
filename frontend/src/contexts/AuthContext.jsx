import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

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
                    const response = await axios.get(`${API_URL}/auth/me`, config);
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
        try {
            const response = await axios.post(`${API_URL}/auth/login`, { username, password });
            const { access_token } = response.data;
            localStorage.setItem('token', access_token);

            // Get user details
            const config = {
                headers: { Authorization: `Bearer ${access_token}` }
            };
            const userResponse = await axios.get(`${API_URL}/auth/me`, config);
            setUser(userResponse.data);
            return true;
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        }
    };

    const register = async (username, password) => {
        try {
            await axios.post(`${API_URL}/auth/register`, { username, password });
            return true;
        } catch (error) {
            console.error("Registration failed", error);
            throw error;
        }
    };

    const resetPassword = async (username, password) => {
        try {
            await axios.post(`${API_URL}/auth/reset-password`, { username, password });
            return true;
        } catch (error) {
            console.error("Password reset failed", error);
            throw error;
        }
    };

    const googleLogin = async () => {
        try {
            const response = await axios.post(`${API_URL}/auth/google-demo`);
            const { access_token } = response.data;
            localStorage.setItem('token', access_token);

            const config = {
                headers: { Authorization: `Bearer ${access_token}` }
            };
            const userResponse = await axios.get(`${API_URL}/auth/me`, config);
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
