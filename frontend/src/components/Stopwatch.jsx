import { useState, useEffect } from 'react';
import './Stopwatch.css';

const Stopwatch = () => {
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [laps, setLaps] = useState([]);

    useEffect(() => {
        let interval;
        if (isRunning) {
            interval = setInterval(() => {
                setTime(prevTime => prevTime + 10);
            }, 10);
        }
        return () => clearInterval(interval);
    }, [isRunning]);

    const formatTime = (milliseconds) => {
        const mins = Math.floor(milliseconds / 60000);
        const secs = Math.floor((milliseconds % 60000) / 1000);
        const ms = Math.floor((milliseconds % 1000) / 10);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
    };

    const handleStartStop = () => {
        setIsRunning(!isRunning);
    };

    const handleReset = () => {
        setTime(0);
        setIsRunning(false);
        setLaps([]);
    };

    const handleLap = () => {
        if (isRunning) {
            const lapTime = time;
            const previousLap = laps.length > 0 ? laps[laps.length - 1].time : 0;
            const difference = lapTime - previousLap;

            setLaps([...laps, {
                number: laps.length + 1,
                time: lapTime,
                difference: difference
            }]);
        }
    };

    // Generate particles
    const particles = Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        animationDelay: Math.random() * 5,
        animationDuration: 3 + Math.random() * 4,
        size: 2 + Math.random() * 4
    }));

    return (
        <div className="stopwatch-wrapper">
            <div className="stopwatch-animation-container">
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

                {/* Stopwatch Content */}
                <div className="stopwatch-widget">
                    <h3>⏱️ Stopwatch</h3>

                    <div className="stopwatch-display">
                        {formatTime(time)}
                    </div>

                    <div className="stopwatch-controls">
                        <button
                            className={`stopwatch-btn ${isRunning ? 'stop' : 'start'}`}
                            onClick={handleStartStop}
                        >
                            {isRunning ? 'Stop' : 'Start'}
                        </button>

                        <button
                            className="stopwatch-btn lap"
                            onClick={handleLap}
                            disabled={!isRunning}
                        >
                            Lap
                        </button>

                        <button
                            className="stopwatch-btn reset"
                            onClick={handleReset}
                        >
                            Reset
                        </button>
                    </div>

                    {laps.length > 0 && (
                        <div className="laps-container">
                            <h4>Laps</h4>
                            <div className="laps-list">
                                {laps.slice().reverse().map((lap) => (
                                    <div key={lap.number} className="lap-item">
                                        <span className="lap-number">Lap {lap.number}</span>
                                        <span className="lap-time">{formatTime(lap.time)}</span>
                                        <span className="lap-diff">+{formatTime(lap.difference)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Stopwatch;
