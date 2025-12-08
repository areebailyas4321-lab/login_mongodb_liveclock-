import { useState, useEffect, useRef } from 'react';
import './Alarm.css';

const Alarm = () => {
    const [alarms, setAlarms] = useState([]);
    const [newAlarmTime, setNewAlarmTime] = useState('');
    const [newAlarmLabel, setNewAlarmLabel] = useState('');
    const [ringingAlarm, setRingingAlarm] = useState(null);
    const audioRef = useRef(null);
    const isRingingRef = useRef(false); // Ref to track ringing state synchronously

    useEffect(() => {
        // Load alarms from localStorage
        const savedAlarms = localStorage.getItem('alarms');
        if (savedAlarms) {
            setAlarms(JSON.parse(savedAlarms));
        }
    }, []);

    useEffect(() => {
        // Save alarms to localStorage
        localStorage.setItem('alarms', JSON.stringify(alarms));

        // Check alarms every second
        const interval = setInterval(() => {
            const now = new Date();
            const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

            let alarmToTrigger = null;
            let shouldUpdateState = false;

            const updatedAlarms = alarms.map(alarm => {
                // Trigger alarm if time matches and not yet triggered
                // Added check: !isRingingRef.current to prevent multiple triggers
                // Added check: alarm.createdAt < Date.now() - 5000 to prevent immediate ring on creation if time matches
                if (alarm.enabled &&
                    alarm.time === currentTime &&
                    !alarm.triggered &&
                    !isRingingRef.current &&
                    (!alarm.createdAt || alarm.createdAt < Date.now() - 5000)) { // 5 second buffer

                    alarmToTrigger = alarm;
                    shouldUpdateState = true;
                    return { ...alarm, triggered: true };
                }

                // Reset triggered status if time has passed (so it can ring again tomorrow)
                if (alarm.triggered && alarm.time !== currentTime) {
                    shouldUpdateState = true;
                    return { ...alarm, triggered: false };
                }

                return alarm;
            });

            if (shouldUpdateState) {
                setAlarms(updatedAlarms);
            }

            if (alarmToTrigger) {
                triggerAlarm(alarmToTrigger);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [alarms]); // Removed ringingAlarm dependency to avoid re-renders affecting the loop

    // Cleanup audio on unmount
    useEffect(() => {
        return () => {
            stopAudio();
        };
    }, []);

    const stopAudio = () => {
        if (window.currentAlarmAudio) {
            window.currentAlarmAudio.pause();
            window.currentAlarmAudio.currentTime = 0;
            window.currentAlarmAudio = null;
        }
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current = null;
        }
        isRingingRef.current = false;
    };

    const triggerAlarm = (alarm) => {
        if (isRingingRef.current) return; // Prevent double triggering
        isRingingRef.current = true;

        // Show notification
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('⏰ Alarm!', {
                body: alarm.label || `Alarm at ${alarm.time}`,
                icon: '⏰'
            });
        }

        // Set ringing alarm state
        setRingingAlarm(alarm);

        // Stop any existing audio first
        stopAudio();
        isRingingRef.current = true; // Re-set true after stopAudio cleared it

        // Create and play aesthetic alarm sound - Pleasant morning chime
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/1003/1003-preview.mp3'); // Soft notification
        audio.loop = true;
        audio.volume = 0.6;

        // Store in BOTH ref and global window object
        audioRef.current = audio;
        window.currentAlarmAudio = audio;

        audio.play().catch(e => {
            console.log('Audio play failed:', e);
            // Try alternative sound if first one fails
            const altAudio = new Audio('https://freesound.org/data/previews/316/316847_4939433-lq.mp3');
            altAudio.loop = true;
            altAudio.volume = 0.6;

            audioRef.current = altAudio;
            window.currentAlarmAudio = altAudio;

            altAudio.play().catch(err => console.log('Alternative audio also failed:', err));
        });
    };

    const stopAlarm = () => {
        console.log('Stop alarm called'); // Debug log
        stopAudio();
        setRingingAlarm(null);
    };

    const addAlarm = () => {
        if (!newAlarmTime) return;

        const newAlarm = {
            id: Date.now(),
            time: newAlarmTime,
            label: newAlarmLabel || 'Alarm',
            enabled: true,
            triggered: false,
            createdAt: Date.now() // Add creation timestamp
        };

        setAlarms([...alarms, newAlarm]);
        setNewAlarmTime('');
        setNewAlarmLabel('');

        // Request notification permission
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    };

    const toggleAlarm = (id) => {
        setAlarms(prev => prev.map(alarm =>
            alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm
        ));
    };

    const deleteAlarm = (id) => {
        setAlarms(prev => prev.filter(alarm => alarm.id !== id));
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) return 'Good Morning! 🌅';
        if (hour >= 12 && hour < 17) return 'Good Afternoon! ☀️';
        if (hour >= 17 && hour < 21) return 'Good Evening! 🌇';
        return 'Good Night! 🌙';
    };

    return (
        <>
            <div className="alarm-widget">
                <h3>⏰ Alarms</h3>

                <div className="alarm-input-group">
                    <input
                        type="time"
                        value={newAlarmTime}
                        onChange={(e) => setNewAlarmTime(e.target.value)}
                        className="alarm-time-input"
                    />
                    <input
                        type="text"
                        value={newAlarmLabel}
                        onChange={(e) => setNewAlarmLabel(e.target.value)}
                        placeholder="Label (optional)"
                        className="alarm-label-input"
                    />
                    <button onClick={addAlarm} className="alarm-add-btn">
                        Add
                    </button>
                </div>

                <div className="alarms-list">
                    {alarms.length === 0 ? (
                        <p className="no-alarms">No alarms set</p>
                    ) : (
                        alarms.map(alarm => (
                            <div key={alarm.id} className={`alarm-item ${!alarm.enabled ? 'disabled' : ''}`}>
                                <div className="alarm-info">
                                    <span className="alarm-time">{alarm.time}</span>
                                    <span className="alarm-label">{alarm.label}</span>
                                </div>
                                <div className="alarm-controls">
                                    <button
                                        onClick={() => toggleAlarm(alarm.id)}
                                        className={`alarm-toggle ${alarm.enabled ? 'on' : 'off'}`}
                                    >
                                        {alarm.enabled ? 'ON' : 'OFF'}
                                    </button>
                                    <button
                                        onClick={() => deleteAlarm(alarm.id)}
                                        className="alarm-delete"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Alarm Ringing Modal */}
            {ringingAlarm && (
                <div className="alarm-modal-overlay">
                    <div className="alarm-modal">
                        <div className="alarm-modal-icon">⏰</div>
                        <h2 className="alarm-modal-greeting">{getGreeting()}</h2>
                        <div className="alarm-modal-time">
                            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="alarm-modal-label">{ringingAlarm.label}</div>
                        <button className="alarm-stop-btn" onClick={stopAlarm}>
                            Stop Alarm
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Alarm;
