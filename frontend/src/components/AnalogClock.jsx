import { useState, useEffect, useRef } from 'react';
import './AnalogClock.css';

const AnalogClock = ({ timezone }) => {
    const [time, setTime] = useState(new Date());
    const [alarmTime, setAlarmTime] = useState('');
    const [isAlarmSet, setIsAlarmSet] = useState(false);
    const [isRinging, setIsRinging] = useState(false);
    const [greeting, setGreeting] = useState('');

    const audioRef = useRef(new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3')); // Aesthetic gentle chime

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            setTime(now);

            // Alarm Check
            if (isAlarmSet && !isRinging) {
                const currentHours = now.getHours().toString().padStart(2, '0');
                const currentMinutes = now.getMinutes().toString().padStart(2, '0');
                const currentTimeStr = `${currentHours}:${currentMinutes}`;

                if (currentTimeStr === alarmTime && now.getSeconds() === 0) {
                    triggerAlarm(now.getHours());
                }
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [isAlarmSet, alarmTime, isRinging]);

    const triggerAlarm = (hour) => {
        setIsRinging(true);
        audioRef.current.loop = true;
        audioRef.current.play().catch(e => console.log("Audio play failed:", e));

        // Set Greeting
        if (hour >= 5 && hour < 12) setGreeting('Good Morning! 🌅');
        else if (hour >= 12 && hour < 17) setGreeting('Good Afternoon! ☀️');
        else if (hour >= 17 && hour < 21) setGreeting('Good Evening! 🌇');
        else setGreeting('Good Night! 🌙');
    };

    const stopAlarm = () => {
        setIsRinging(false);
        setIsAlarmSet(false);
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
    };

    // Get time components
    const getTimeInTimezone = () => {
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: false
        });

        const parts = formatter.formatToParts(time);
        const hours = parseInt(parts.find(p => p.type === 'hour')?.value || '0');
        const minutes = parseInt(parts.find(p => p.type === 'minute')?.value || '0');
        const seconds = parseInt(parts.find(p => p.type === 'second')?.value || '0');

        return { hours, minutes, seconds };
    };

    const { hours, minutes, seconds } = getTimeInTimezone();
    const hours12 = hours % 12;

    // Calculate rotation angles
    const secondAngle = (seconds * 6);
    const minuteAngle = (minutes * 6) + (seconds * 0.1);
    const hourAngle = (hours12 * 30) + (minutes * 0.5);

    // Generate particles
    const particles = Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        animationDelay: Math.random() * 5,
        animationDuration: 3 + Math.random() * 4,
        size: 2 + Math.random() * 4
    }));

    return (
        <div className="analog-clock-wrapper">
            <div className="analog-clock-container">
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

                <div className="analog-clock">
                    {/* Hour numbers */}
                    {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num, i) => (
                        <div
                            key={num}
                            className="hour-number"
                            style={{
                                '--rotation': i * 30,
                                '--index': i,
                                transform: `rotate(${i * 30}deg) translateY(-130px) rotate(-${i * 30}deg)`
                            }}
                        >
                            {num}
                        </div>
                    ))}

                    {/* Minute markers */}
                    {[...Array(60)].map((_, i) => (
                        <div
                            key={i}
                            className={`minute-marker ${i % 5 === 0 ? 'major' : ''}`}
                            style={{
                                transform: `rotate(${i * 6}deg) translateY(-145px)`
                            }}
                        />
                    ))}

                    {/* Hands */}
                    <div className="hand hour-hand" style={{ transform: `rotate(${hourAngle}deg)` }} />
                    <div className="hand minute-hand" style={{ transform: `rotate(${minuteAngle}deg)` }} />
                    <div className="hand second-hand" style={{ transform: `rotate(${secondAngle}deg)` }}>
                        <div className="second-number">{seconds}</div>
                    </div>
                    <div className="center-dot"></div>
                </div>
            </div>

            {/* Alarm Controls */}
            <div className="alarm-controls">
                <span>🔔 Alarm:</span>
                <input
                    type="time"
                    className="alarm-input"
                    value={alarmTime}
                    onChange={(e) => setAlarmTime(e.target.value)}
                />
                <button
                    className={`alarm-btn ${isAlarmSet ? 'active' : ''}`}
                    onClick={() => setIsAlarmSet(!isAlarmSet)}
                >
                    {isAlarmSet ? 'ON' : 'OFF'}
                </button>
            </div>

            {/* Greeting Overlay */}
            {isRinging && (
                <div className="greeting-overlay">
                    <h2 className="greeting-text">{greeting}</h2>
                    <div className="current-time-display">
                        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <button className="stop-alarm-btn" onClick={stopAlarm}>
                        Stop Alarm
                    </button>
                </div>
            )}
        </div>
    );
};

export default AnalogClock;
