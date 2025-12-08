import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useTheme } from './hooks/useTheme';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Clock from './components/Clock';
import AnalogClock from './components/AnalogClock';
import Stopwatch from './components/Stopwatch';
import Timer from './components/Timer';
import Alarm from './components/Alarm';
import WorldClock from './components/WorldClock';
import Calendar from './components/Calendar';
import AnimatedBackground from './components/AnimatedBackground';
import Weather from './components/Weather';
import ThemeSelector from './components/ThemeSelector';
import AuthPage from './components/AuthPage';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function MainApp() {
  const { theme, setTheme } = useTheme();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [activeWidget, setActiveWidget] = useState('digital-clock');
  const [clockMode, setClockMode] = useState('digital');
  const [weatherCondition, setWeatherCondition] = useState('Clear');

  // Advanced Theme State
  const [themeMode, setThemeMode] = useState('live'); // 'live' or 'manual'
  const [manualTheme, setManualTheme] = useState('dark');
  const [accentColor, setAccentColor] = useState('#00FFFF');
  const [timeOfDay, setTimeOfDay] = useState('day'); // 'morning', 'afternoon', 'evening', 'night'
  const [showClockOptions, setShowClockOptions] = useState(false);

  // Live Theme Logic
  useEffect(() => {
    if (themeMode === 'live') {
      const updateLiveTheme = () => {
        const hour = new Date().getHours();
        let newTimeOfDay = 'night';
        let newTheme = 'dark';

        if (hour >= 5 && hour < 12) {
          newTimeOfDay = 'morning';
          newTheme = 'light';
        } else if (hour >= 12 && hour < 17) {
          newTimeOfDay = 'afternoon';
          newTheme = 'light';
        } else if (hour >= 17 && hour < 20) {
          newTimeOfDay = 'evening';
          newTheme = 'dark';
        }

        setTimeOfDay(newTimeOfDay);
        setTheme(newTheme);
      };

      updateLiveTheme();
      const interval = setInterval(updateLiveTheme, 60000);
      return () => clearInterval(interval);
    } else {
      // Manual Mode
      setTheme(manualTheme);
      // Set a default timeOfDay for manual mode to ensure background gradients work
      setTimeOfDay(manualTheme === 'light' ? 'morning' : 'night');
    }
  }, [themeMode, manualTheme, setTheme]);

  // Apply Accent Color
  useEffect(() => {
    document.documentElement.style.setProperty('--accent-color', accentColor);
  }, [accentColor]);

  return (
    <div className={`app-container ${weatherCondition.toLowerCase()}-weather`}>
      {/* Background */}
      <AnimatedBackground
        theme={theme}
        weatherCondition={weatherCondition}
        timeOfDay={themeMode === 'live' ? timeOfDay : null}
      />

      {/* Navigation Bar */}
      <nav className="main-nav">
        <button
          className={`nav-btn ${activeWidget === 'digital-clock' ? 'active' : ''}`}
          onClick={() => {
            setActiveWidget('digital-clock');
            setClockMode('digital');
          }}
        >
          🕐 Digital Clock
        </button>
        <button
          className={`nav-btn ${activeWidget === 'analog-clock' ? 'active' : ''}`}
          onClick={() => {
            setActiveWidget('analog-clock');
            setClockMode('analog');
          }}
        >
          ⏰ Analog Clock
        </button>
        <button
          className={`nav-btn ${activeWidget === 'calendar' ? 'active' : ''}`}
          onClick={() => setActiveWidget('calendar')}
        >
          📅 Calendar
        </button>
        <button
          className={`nav-btn ${activeWidget === 'stopwatch' ? 'active' : ''}`}
          onClick={() => setActiveWidget('stopwatch')}
        >
          ⏱️ Stopwatch
        </button>
        <button
          className={`nav-btn ${activeWidget === 'timer' ? 'active' : ''}`}
          onClick={() => setActiveWidget('timer')}
        >
          ⏳ Countdown
        </button>
        <button
          className={`nav-btn ${activeWidget === 'alarm' ? 'active' : ''}`}
          onClick={() => setActiveWidget('alarm')}
        >
          ⏰ Alarm
        </button>
        <button
          className={`nav-btn ${activeWidget === 'worldClock' ? 'active' : ''}`}
          onClick={() => setActiveWidget('worldClock')}
        >
          🌍 World Clock
        </button>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {(activeWidget === 'digital-clock' || activeWidget === 'analog-clock') && (
          <div className="clock-section">
            <div className="clock-display-area">
              <div className="glass-panel clock-wrapper">
                {activeWidget === 'digital-clock' ? <Clock /> : <AnalogClock />}
              </div>
            </div>

            <div className="date-display">
              {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>

            {/* Weather Widget moved below clock */}
            <Weather onConditionChange={setWeatherCondition} />
          </div>
        )}

        {activeWidget === 'calendar' && <Calendar />}
        {activeWidget === 'stopwatch' && <Stopwatch />}
        {activeWidget === 'timer' && <Timer />}
        {activeWidget === 'alarm' && <Alarm />}
        {activeWidget === 'worldClock' && <WorldClock />}
      </main>

      {/* Logout Button */}
      <button
        className="logout-btn"
        onClick={() => {
          logout();
          navigate('/login');
        }}
        aria-label="Logout"
      >
        <span className="logout-icon">🚪</span>
        <span className="logout-text">Logout</span>
      </button>

      {/* Theme Selector */}
      <ThemeSelector
        mode={themeMode}
        setMode={setThemeMode}
        manualTheme={manualTheme}
        setManualTheme={setManualTheme}
        accentColor={accentColor}
        setAccentColor={setAccentColor}
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />
          <Route path="/auth" element={<Navigate to="/login" replace />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainApp />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
