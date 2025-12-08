import './AnimatedBackground.css';

const AnimatedBackground = ({ theme, weatherCondition = 'Clear', timeOfDay }) => {
    const isNight = theme === 'dark';

    // Live Mode Background Styles
    const getLiveBackground = () => {
        // Fallback for manual mode if timeOfDay isn't passed, though App.jsx should handle it
        if (!timeOfDay) {
            return isNight
                ? { background: 'linear-gradient(to bottom, #0f2027, #203a43, #2c5364)' }
                : { background: 'linear-gradient(to bottom, #FF9A9E, #FECFEF)' };
        }

        switch (timeOfDay) {
            case 'morning':
                return { background: 'linear-gradient(to bottom, #FF9A9E, #FECFEF)' };
            case 'afternoon':
                return { background: 'linear-gradient(to bottom, #2980B9, #6DD5FA, #FFFFFF)' };
            case 'evening':
                return { background: 'linear-gradient(to bottom, #4568DC, #B06AB3)' };
            case 'night':
                return { background: 'linear-gradient(to bottom, #0f2027, #203a43, #2c5364)' };
            default:
                return {};
        }
    };

    // Weather overlay elements
    const renderWeatherEffects = () => {
        switch (weatherCondition) {
            case 'Rain':
                return (
                    <div className="rain-container">
                        {[...Array(100)].map((_, i) => (
                            <div key={`rain-${i}`} className="rain-drop"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    animationDuration: `${0.5 + Math.random() * 0.5}s`,
                                    animationDelay: `${Math.random() * 2}s`
                                }}
                            />
                        ))}
                    </div>
                );
            case 'Thunderstorm':
                return (
                    <div className="thunderstorm-container">
                        {/* Rain Layer */}
                        <div className="rain-container">
                            {[...Array(100)].map((_, i) => (
                                <div key={`rain-${i}`} className="rain-drop"
                                    style={{
                                        left: `${Math.random() * 100}%`,
                                        animationDuration: `${0.4 + Math.random() * 0.4}s`, // Faster rain
                                        animationDelay: `${Math.random() * 2}s`
                                    }}
                                />
                            ))}
                        </div>
                        {/* Lightning Layer */}
                        <div className="lightning-flash"></div>
                    </div>
                );
            case 'Clouds':
                return (
                    <div className="clouds-container">
                        {[...Array(8)].map((_, i) => (
                            <div key={`cloud-${i}`} className="cloud"
                                style={{
                                    top: `${5 + Math.random() * 40}%`,
                                    left: `${-20 + Math.random() * 10}%`,
                                    animationDuration: `${30 + Math.random() * 20}s`, // Slower movement
                                    animationDelay: `${i * 5}s`,
                                    opacity: isNight ? 0.3 : 0.8
                                }}
                            />
                        ))}
                    </div>
                );
            case 'Snow':
                return (
                    <div className="snow-container">
                        {[...Array(50)].map((_, i) => (
                            <div key={`snow-${i}`} className="snowflake"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    animationDuration: `${3 + Math.random() * 5}s`,
                                    animationDelay: `${Math.random() * 5}s`,
                                    opacity: 0.8
                                }}
                            >❄</div>
                        ))}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div
            className={`animated-background ${weatherCondition.toLowerCase()}`}
            style={getLiveBackground()}
        >
            {isNight ? (
                <>
                    {/* Particles Animation for Dark Mode */}
                    <div className="particles-container">
                        {[...Array(30)].map((_, i) => (
                            <div
                                key={`particle-${i}`}
                                className="particle-dot"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    width: `${2 + Math.random() * 4}px`,
                                    height: `${2 + Math.random() * 4}px`,
                                    animationDuration: `${10 + Math.random() * 20}s`,
                                    animationDelay: `${Math.random() * 10}s`
                                }}
                            />
                        ))}
                    </div>

                    {/* Stars - Always visible at night */}
                    {[...Array(50)].map((_, i) => (
                        <div
                            key={`star-${i}`}
                            className="star"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 3}s`,
                                animationDuration: `${2 + Math.random() * 2}s`
                            }}
                        />
                    ))}
                    {/* Moon */}
                    <div className="moon"></div>
                </>
            ) : (
                <>
                    {/* Light Rays (God Rays) for Light Mode */}
                    <div className="light-rays-container">
                        {[...Array(12)].map((_, i) => (
                            <div
                                key={`ray-${i}`}
                                className="ray"
                                style={{
                                    transform: `rotate(${i * 30}deg) translateY(-50%)`,
                                }}
                            />
                        ))}
                    </div>

                    {/* Sun */}
                    <div className="sun"></div>
                </>
            )}

            {/* Weather Overlays */}
            {renderWeatherEffects()}
        </div>
    );
};

export default AnimatedBackground;
