import { useState, useEffect } from 'react';

export const useTheme = () => {
    const [theme, setTheme] = useState('light');

    // Sync theme to body class
    useEffect(() => {
        document.body.className = theme;
    }, [theme]);

    // Initial time-based theme (optional, can be overridden by App)
    useEffect(() => {
        const getInitialTheme = () => {
            const now = new Date();
            const hours = now.getHours();
            const isDayTime = hours >= 6 && hours < 18;
            return isDayTime ? 'light' : 'dark';
        };
        setTheme(getInitialTheme());
    }, []);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    return { theme, setTheme, toggleTheme };
};
