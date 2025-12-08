import { useState, useEffect } from 'react';
import './ThemeSelector.css';

const ThemeSelector = ({
    mode,
    setMode,
    manualTheme,
    setManualTheme,
    accentColor,
    setAccentColor
}) => {
    const [isOpen, setIsOpen] = useState(false);

    // Aesthetic Pastel Colors for Light Mode
    const lightColors = [
        '#FFB7B2', // Soft Red/Pink
        '#A0E7E5', // Mint/Teal
        '#B4F8C8', // Mint Green
        '#FBE7C6', // Soft Yellow/Peach
        '#E6E6FA'  // Lavender
    ];

    // Aesthetic Neon/Vibrant Colors for Dark Mode
    const darkColors = [
        '#FF00FF', // Neon Magenta
        '#00FFFF', // Cyan
        '#7FFF00', // Chartreuse
        '#FFD700', // Gold
        '#FF4500'  // Orange Red
    ];

    return (
        <div className={`theme-selector-container ${isOpen ? 'open' : ''}`}>
            <button className="theme-toggle-btn" onClick={() => setIsOpen(!isOpen)}>
                🎨 Theme
            </button>

            {isOpen && (
                <div className="theme-panel">
                    <div className="theme-mode-switch">
                        <button
                            className={`mode-switch-btn ${mode === 'live' ? 'active' : ''}`}
                            onClick={() => setMode('live')}
                        >
                            Live
                        </button>
                        <button
                            className={`mode-switch-btn ${mode === 'manual' ? 'active' : ''}`}
                            onClick={() => setMode('manual')}
                        >
                            Manual
                        </button>
                    </div>

                    {mode === 'manual' && (
                        <div className="manual-controls">
                            <div className="theme-type-toggle">
                                <button
                                    className={`type-btn ${manualTheme === 'light' ? 'active' : ''}`}
                                    onClick={() => setManualTheme('light')}
                                >
                                    ☀️ Light
                                </button>
                                <button
                                    className={`type-btn ${manualTheme === 'dark' ? 'active' : ''}`}
                                    onClick={() => setManualTheme('dark')}
                                >
                                    🌙 Dark
                                </button>
                            </div>

                            <div className="color-palette">
                                <p>Accent Color:</p>
                                <div className="colors-grid">
                                    {(manualTheme === 'light' ? lightColors : darkColors).map((color) => (
                                        <button
                                            key={color}
                                            className={`color-swatch ${accentColor === color ? 'active' : ''}`}
                                            style={{ backgroundColor: color }}
                                            onClick={() => setAccentColor(color)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {mode === 'live' && (
                        <div className="live-info">
                            <p>Theme changes automatically based on time of day.</p>
                            <small>Morning • Afternoon • Evening • Night</small>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ThemeSelector;
