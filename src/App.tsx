import React, { useState, useEffect } from 'react';
import { 
  getCurrentWeather, 
  getCurrentWeatherByCoords,
  getForecast, 
  getForecastByCoords,
  processForecastData
} from './services/weatherService';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useGeolocation } from './hooks/useGeolocation';
import { 
  CurrentWeatherData, 
  ForecastData, 
  DailyForecast, 
  TemperatureUnit 
} from './types';
import { getWeatherColors, isDaytime } from './utils/weatherUtils';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import ForecastSection from './components/ForecastSection';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import UnitToggle from './components/UnitToggle';
import LocationButton from './components/LocationButton';
import { Cloud } from 'lucide-react';

function App() {
  // State
  const [currentWeather, setCurrentWeather] = useState<CurrentWeatherData | null>(null);
  const [forecastData, setForecastData] = useState<DailyForecast[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [bgColors, setBgColors] = useState({ primary: '#3498db', secondary: '#2980b9', text: '#fff' });

  // Local storage
  const [recentSearches, setRecentSearches] = useLocalStorage<string[]>('recent-searches', []);
  const [unit, setUnit] = useLocalStorage<TemperatureUnit>('temperature-unit', 'metric');
  const [lastCity, setLastCity] = useLocalStorage<string>('last-city', '');

  // Geolocation
  const { coordinates, loading: geoLoading, error: geoError } = useGeolocation();

  // Fetch weather for a city
  const fetchWeatherForCity = async (city: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch current weather
      const weatherData = await getCurrentWeather(city, unit);
      setCurrentWeather(weatherData);
      
      // Update recent searches
      if (!recentSearches.includes(city)) {
        setRecentSearches([city, ...recentSearches.slice(0, 4)]);
      }
      
      // Set last city searched
      setLastCity(city);
      
      // Set background colors based on weather
      const daytime = isDaytime(
        weatherData.dt,
        weatherData.sys.sunrise,
        weatherData.sys.sunset
      );
      setBgColors(getWeatherColors(weatherData.weather[0].id, daytime));
      
      // Fetch forecast
      const forecast = await getForecast(city, unit);
      setForecastData(processForecastData(forecast));
    } catch (err) {
      console.error('Error fetching weather:', err);
      setError('Could not fetch weather data for this city. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch weather using coordinates
  const fetchWeatherByCoords = async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch current weather
      const weatherData = await getCurrentWeatherByCoords(lat, lon, unit);
      setCurrentWeather(weatherData);
      
      // Add to recent searches
      if (weatherData.name && !recentSearches.includes(weatherData.name)) {
        setRecentSearches([weatherData.name, ...recentSearches.slice(0, 4)]);
      }
      
      // Set last city
      if (weatherData.name) {
        setLastCity(weatherData.name);
      }
      
      // Set background colors
      const daytime = isDaytime(
        weatherData.dt,
        weatherData.sys.sunrise,
        weatherData.sys.sunset
      );
      setBgColors(getWeatherColors(weatherData.weather[0].id, daytime));
      
      // Fetch forecast
      const forecast = await getForecastByCoords(lat, lon, unit);
      setForecastData(processForecastData(forecast));
    } catch (err) {
      console.error('Error fetching weather:', err);
      setError('Could not fetch weather data for your location. Please try searching for a city.');
    } finally {
      setLoading(false);
    }
  };

  // Handle unit toggle
  const toggleUnit = async () => {
    const newUnit = unit === 'metric' ? 'imperial' : 'metric';
    setUnit(newUnit);
    
    // Refetch weather with new unit
    if (currentWeather) {
      if (lastCity) {
        fetchWeatherForCity(lastCity);
      } else if (coordinates) {
        fetchWeatherByCoords(coordinates.lat, coordinates.lon);
      }
    }
  };

  // Use geolocation
  const useCurrentLocation = () => {
    if (coordinates) {
      fetchWeatherByCoords(coordinates.lat, coordinates.lon);
    }
  };

  // Load last searched city on initial load
  useEffect(() => {
    if (lastCity) {
      fetchWeatherForCity(lastCity);
    } else if (coordinates && !geoLoading && !geoError) {
      fetchWeatherByCoords(coordinates.lat, coordinates.lon);
    }
  }, [coordinates, geoLoading]);

  // Create a dynamic background gradient
  const backgroundStyle = {
    background: `linear-gradient(135deg, ${bgColors.primary} 0%, ${bgColors.secondary} 100%)`,
    color: bgColors.text,
    transition: 'background 1s ease-in-out',
  };

  return (
    <div className="min-h-screen w-full" style={backgroundStyle}>
      <div className="container mx-auto px-4 py-8">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-white flex items-center">
            <Cloud className="mr-2" size={28} />
            Weather App
          </h1>
          <UnitToggle unit={unit} onToggle={toggleUnit} />
        </header>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <SearchBar onSearch={fetchWeatherForCity} recentSearches={recentSearches} />
          <LocationButton onClick={useCurrentLocation} loading={geoLoading} />
        </div>

        <main>
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <ErrorMessage 
              message={error} 
              onRetry={() => lastCity ? fetchWeatherForCity(lastCity) : null} 
            />
          ) : currentWeather ? (
            <>
              <CurrentWeather data={currentWeather} unit={unit} />
              <ForecastSection forecasts={forecastData} unit={unit} />
            </>
          ) : (
            <div className="text-center text-white/80 py-20">
              <p className="text-xl">Search for a city to see the weather forecast</p>
              <p className="mt-2">or use your current location</p>
            </div>
          )}
        </main>

        <footer className="mt-12 pt-6 border-t border-white/10 text-center text-white/60 text-sm">
          <p className="mt-1">© Weather App</p>
        </footer>
      </div>
    </div>
  );
}

export default App;