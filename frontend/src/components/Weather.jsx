import { useState, useEffect } from 'react';
import './Weather.css';

const Weather = ({ onConditionChange }) => {
    const [weather, setWeather] = useState({
        temp: '--',
        condition: 'Clear',
        location: 'Wahcantt'
    });

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                // Wah Cantt Coordinates: 33.7715° N, 72.7511° E
                const response = await fetch(
                    'https://api.open-meteo.com/v1/forecast?latitude=33.7715&longitude=72.7511&current_weather=true'
                );
                const data = await response.json();
                const { temperature, weathercode } = data.current_weather;

                // Map WMO Weather Codes to our conditions
                let condition = 'Clear';
                if (weathercode >= 1 && weathercode <= 3) condition = 'Clouds';
                else if (weathercode >= 51 && weathercode <= 67) condition = 'Rain';
                else if (weathercode >= 71 && weathercode <= 77) condition = 'Snow';
                else if (weathercode >= 80 && weathercode <= 82) condition = 'Rain';
                else if (weathercode >= 95) condition = 'Thunderstorm'; // Thunderstorm

                setWeather({
                    temp: Math.round(temperature),
                    condition: condition,
                    location: 'Wahcantt'
                });

                if (onConditionChange) onConditionChange(condition);

            } catch (error) {
                console.error('Error fetching weather:', error);
            }
        };

        fetchWeather();
        const interval = setInterval(fetchWeather, 600000); // Update every 10 minutes

        return () => clearInterval(interval);
    }, [onConditionChange]);

    const getIcon = (condition) => {
        switch (condition) {
            case 'Clear': return '☀️';
            case 'Clouds': return '☁️';
            case 'Rain': return '🌧️';
            case 'Thunderstorm': return '⛈️';
            case 'Snow': return '❄️';
            default: return '🌤️';
        }
    };

    return (
        <div className="weather-widget">
            <div className="weather-icon">{getIcon(weather.condition)}</div>
            <div className="weather-info">
                <span className="weather-temp">{weather.temp}°C</span>
                <span className="weather-desc">{weather.condition}</span>
                <span className="weather-location">{weather.location}</span>
            </div>
        </div>
    );
};

export default Weather;
