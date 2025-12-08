import { useState, useEffect } from 'react';

const Clock = ({ timezone }) => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Format time for the selected timezone
    const formattedTime = time.toLocaleTimeString('en-US', {
        timeZone: timezone,
        hour12: true
    });

    // Generate particles
    const particles = Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        animationDelay: Math.random() * 5,
        animationDuration: 3 + Math.random() * 4,
        size: 2 + Math.random() * 4
    }));

    return (
        <div className="digital-clock-wrapper">
            <div className="digital-clock-container">
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

                {/* Digital Clock Display */}
                <div className="clock-container">
                    <h1 className="clock-time">
                        {formattedTime}
                    </h1>
                </div>
            </div>
        </div>
    );
};

export default Clock;
