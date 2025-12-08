import { useState, useEffect } from 'react';
import './Timer.css';

const Timer = () => {
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [countdownStyle, setCountdownStyle] = useState('modern'); // 'modern' or 'vintage'

    useEffect(() => {
        let interval;
        if (isRunning) {
            interval = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 0) {
                        setIsRunning(false);
                        return 0;
                    }
                    return prev - 1000;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning]);

    const formatTime = (milliseconds) => {
        const h = Math.floor(milliseconds / 3600000);
        const m = Math.floor((milliseconds % 3600000) / 60000);
        const s = Math.floor((milliseconds % 60000) / 1000);
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleStart = () => {
        const totalMs = (hours * 3600000) + (minutes * 60000) + (seconds * 1000);
        if (totalMs > 0) {
            setTimeLeft(totalMs);
            setIsRunning(true);
        }
    };

    const handleStop = () => {
        setIsRunning(false);
    };

    const handleReset = () => {
        setIsRunning(false);
        setTimeLeft(0);
        setHours(0);
        setMinutes(0);
        setSeconds(0);
    };

    // Generate particles
    const particles = Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        animationDelay: Math.random() * 5,
        animationDuration: 3 + Math.random() * 4,
        size: 2 + Math.random() * 4
    }));

    // Get countdown number for vintage display
    const getCountdownNumber = () => {
        return Math.ceil(timeLeft / 1000);
    };

    return (
        <div className="timer-wrapper">
            <div className="timer-animation-container">
                {/* Revolving Ball Animation */}
                {[...Array(6)].map((_, i) => (
                    <div key={`ring-${i}`} className={`revolving-ball-container ring-${i + 1}`}>
                        <div className="revolving-ball"></div>
                    </div>
                ))}

                {/* Particle effects */}
                <div className="particles">
                    {particles.map(particle => (
                        <div
                            key={particle.id}
                            className="particle"
                            style={{
                                left: `${particle.left}%`,
                                animationDelay: `${particle.animationDelay}s`,
                                animationDuration: `${particle.animationDuration}s`,
                                width: `${particle.size}px`,
                                height: `${particle.size}px`
                            }}
                        />
                    ))}
                </div>

                {/* Timer Content */}
                <div className="timer-container">
                    <h3>⏳ Countdown Timer</h3>

                    {/* Style Toggle */}
                    <div className="countdown-style-toggle">
                        <button
                            className={`style-btn ${countdownStyle === 'modern' ? 'active' : ''}`}
                            onClick={() => setCountdownStyle('modern')}
                        >
                            Modern
                        </button>
                        <button
                            className={`style-btn ${countdownStyle === 'vintage' ? 'active' : ''}`}
                            onClick={() => setCountdownStyle('vintage')}
                        >
                            🎬 Vintage Film
                        </button>
                    </div>

                    {/* Countdown Display */}
                    {countdownStyle === 'vintage' && isRunning ? (
                        <div className="vintage-film-countdown">
                            {/* Film Leader Crosshairs */}
                            <div className="film-crosshair vertical"></div>
                            <div className="film-crosshair horizontal"></div>

                            {/* Concentric Circles */}
                            <div className="film-circle-outer"></div>
                            <div className="film-circle-middle"></div>
                            <div className="film-circle-inner"></div>

                            {/* Rotating Sweep Line */}
                            <div className="film-sweep-line"></div>

                            {/* Corner Markers */}
                            <div className="film-corner top-left"></div>
                            <div className="film-corner top-right"></div>
                            <div className="film-corner bottom-left"></div>
                            <div className="film-corner bottom-right"></div>

                            {/* Countdown Number */}
                            <div className="film-number-display">
                                {getCountdownNumber()}
                            </div>

                            {/* Film Grain & Scratches Overlay */}
                            <div className="film-grain-overlay"></div>
                            <div className="film-scratches"></div>

                            {/* Vignette Effect */}
                            <div className="film-vignette"></div>
                        </div>
                    ) : (
                        <div className="timer-display">
                            {isRunning ? formatTime(timeLeft) : '00:00:00'}
                        </div>
                    )}

                    {!isRunning && timeLeft === 0 && (
                        <div className="timer-inputs">
                            <input
                                type="number"
                                min="0"
                                max="23"
                                value={hours}
                                onChange={(e) => setHours(parseInt(e.target.value) || 0)}
                                placeholder="HH"
                            />
                            <span>:</span>
                            <input
                                type="number"
                                min="0"
                                max="59"
                                value={minutes}
                                onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
                                placeholder="MM"
                            />
                            <span>:</span>
                            <input
                                type="number"
                                min="0"
                                max="59"
                                value={seconds}
                                onChange={(e) => setSeconds(parseInt(e.target.value) || 0)}
                                placeholder="SS"
                            />
                        </div>
                    )}

                    <div className="timer-controls">
                        {!isRunning ? (
                            <button className="control-btn start" onClick={handleStart}>Start</button>
                        ) : (
                            <button className="control-btn stop" onClick={handleStop}>Stop</button>
                        )}
                        <button className="control-btn reset" onClick={handleReset}>Reset</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Timer;
