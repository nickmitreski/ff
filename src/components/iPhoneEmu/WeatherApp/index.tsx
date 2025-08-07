import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchWeatherApi } from 'openmeteo';
import WeatherHeader from './WeatherHeader';
import './WeatherApp.css';

interface WeatherAppProps {
  onClose: () => void;
}

interface WeatherData {
  current: {
    time: Date;
    temperature2m: number;
    relativeHumidity2m: number;
    rain: number;
  };
  daily: {
    time: Date[];
    weatherCode: number[];
    temperature2mMax: number[];
    temperature2mMin: number[];
    sunrise: Date[];
    sunset: Date[];
  };
}

const WeatherApp: React.FC<WeatherAppProps> = ({ onClose }) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = {
          "latitude": -37.8136, // Melbourne, Australia
          "longitude": 144.9631,
          "daily": ["weather_code", "temperature_2m_max", "temperature_2m_min", "sunrise", "sunset"],
          "hourly": ["temperature_2m", "rain", "relative_humidity_2m"],
          "current": ["temperature_2m", "relative_humidity_2m", "rain"]
        };
        
        const url = "https://api.open-meteo.com/v1/forecast";
        const responses = await fetchWeatherApi(url, params);
        const response = responses[0];

        const utcOffsetSeconds = response.utcOffsetSeconds();
        const current = response.current()!;
        const daily = response.daily()!;
        const sunrise = daily.variables(3)!;
        const sunset = daily.variables(4)!;

        const data: WeatherData = {
          current: {
            time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
            temperature2m: current.variables(0)!.value(),
            relativeHumidity2m: current.variables(1)!.value(),
            rain: current.variables(2)!.value(),
          },
          daily: {
            time: [...Array((Number(daily.timeEnd()) - Number(daily.time())) / daily.interval())].map(
              (_, i) => new Date((Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) * 1000)
            ),
            weatherCode: Array.from(daily.variables(0)!.valuesArray()!),
            temperature2mMax: Array.from(daily.variables(1)!.valuesArray()!),
            temperature2mMin: Array.from(daily.variables(2)!.valuesArray()!),
            sunrise: [...Array(sunrise.valuesInt64Length())].map(
              (_, i) => new Date((Number(sunrise.valuesInt64(i)) + utcOffsetSeconds) * 1000)
            ),
            sunset: [...Array(sunset.valuesInt64Length())].map(
              (_, i) => new Date((Number(sunset.valuesInt64(i)) + utcOffsetSeconds) * 1000)
            ),
          },
        };

        setWeatherData(data);
      } catch (err) {
        setError('Failed to fetch weather data');
        console.error('Weather API error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  const getWeatherIcon = (code: number) => {
    // WMO Weather interpretation codes
    if (code === 0) return '☀️'; // Clear sky
    if (code >= 1 && code <= 3) return '🌤️'; // Partly cloudy
    if (code >= 45 && code <= 48) return '🌫️'; // Foggy
    if (code >= 51 && code <= 55) return '🌧️'; // Drizzle
    if (code >= 56 && code <= 57) return '🌨️'; // Freezing drizzle
    if (code >= 61 && code <= 65) return '🌧️'; // Rain
    if (code >= 66 && code <= 67) return '🌨️'; // Freezing rain
    if (code >= 71 && code <= 75) return '🌨️'; // Snow
    if (code >= 77 && code <= 77) return '🌨️'; // Snow grains
    if (code >= 80 && code <= 82) return '🌧️'; // Rain showers
    if (code >= 85 && code <= 86) return '🌨️'; // Snow showers
    if (code >= 95 && code <= 95) return '⛈️'; // Thunderstorm
    if (code >= 96 && code <= 99) return '⛈️'; // Thunderstorm with hail
    return '🌤️'; // Default
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <motion.div
        className="weather-app"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
      >
        <WeatherHeader onClose={onClose} />
        <div className="weather-content">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading weather data...</p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (error || !weatherData) {
    return (
      <motion.div
        className="weather-app"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
      >
        <WeatherHeader onClose={onClose} />
        <div className="weather-content">
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <p>{error || 'Unable to load weather data'}</p>
            <button className="retry-button" onClick={() => window.location.reload()}>
              Retry
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="weather-app"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
    >
      <WeatherHeader onClose={onClose} />
      
      <div className="weather-content">
        {/* Current Weather */}
        <div className="current-weather">
          <div className="location">
            <h2>Melbourne</h2>
            <p>Victoria, Australia</p>
          </div>
          
          <div className="current-temp">
            <span className="temp-value">{Math.round(weatherData.current.temperature2m)}°</span>
            <span className="temp-unit">C</span>
          </div>
          
          <div className="current-details">
            <div className="weather-icon">
              {getWeatherIcon(weatherData.daily.weatherCode[0])}
            </div>
            <div className="weather-info">
              <p className="humidity">Humidity: {Math.round(weatherData.current.relativeHumidity2m)}%</p>
              <p className="rain">Rain: {weatherData.current.rain}mm</p>
            </div>
          </div>
        </div>

        {/* Daily Forecast */}
        <div className="daily-forecast">
          <h3>7-Day Forecast</h3>
          <div className="forecast-list">
            {weatherData.daily.time.slice(0, 7).map((date, index) => (
              <div key={index} className="forecast-item">
                <div className="forecast-day">{formatDate(date)}</div>
                <div className="forecast-icon">
                  {getWeatherIcon(weatherData.daily.weatherCode[index])}
                </div>
                <div className="forecast-temps">
                  <span className="temp-high">{Math.round(weatherData.daily.temperature2mMax[index])}°</span>
                  <span className="temp-low">{Math.round(weatherData.daily.temperature2mMin[index])}°</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sunrise/Sunset */}
        <div className="sun-info">
          <div className="sun-item">
            <span className="sun-icon">🌅</span>
            <span className="sun-time">{formatTime(weatherData.daily.sunrise[0])}</span>
            <span className="sun-label">Sunrise</span>
          </div>
          <div className="sun-item">
            <span className="sun-icon">🌇</span>
            <span className="sun-time">{formatTime(weatherData.daily.sunset[0])}</span>
            <span className="sun-label">Sunset</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WeatherApp; 