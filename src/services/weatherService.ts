import { CurrentWeatherData, ForecastData, DailyForecast, AutocompleteResult, TemperatureUnit } from '../types';

const API_KEY = 'f00c38e0279b7bc85480c3fe775d518c';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

// Cache for API responses
const cache: Record<string, { data: any; timestamp: number }> = {};
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

const isExpired = (timestamp: number): boolean => {
  return Date.now() - timestamp > CACHE_DURATION;
};

// Helper to fetch data with caching
async function fetchWithCache<T>(url: string, cacheKey: string): Promise<T> {
  // Check if data is in cache and not expired
  if (cache[cacheKey] && !isExpired(cache[cacheKey].timestamp)) {
    return cache[cacheKey].data as T;
  }

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Store in cache
    cache[cacheKey] = {
      data,
      timestamp: Date.now()
    };
    
    return data as T;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}

// Get current weather for a city
export async function getCurrentWeather(
  city: string,
  unit: TemperatureUnit = 'metric'
): Promise<CurrentWeatherData> {
  const url = `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${unit}`;
  const cacheKey = `current_${city}_${unit}`;
  return fetchWithCache<CurrentWeatherData>(url, cacheKey);
}

// Get current weather by coordinates
export async function getCurrentWeatherByCoords(
  lat: number,
  lon: number,
  unit: TemperatureUnit = 'metric'
): Promise<CurrentWeatherData> {
  const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unit}`;
  const cacheKey = `current_${lat}_${lon}_${unit}`;
  return fetchWithCache<CurrentWeatherData>(url, cacheKey);
}

// Get 5-day forecast
export async function getForecast(
  city: string,
  unit: TemperatureUnit = 'metric'
): Promise<ForecastData> {
  const url = `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${unit}`;
  const cacheKey = `forecast_${city}_${unit}`;
  return fetchWithCache<ForecastData>(url, cacheKey);
}

// Get 5-day forecast by coordinates
export async function getForecastByCoords(
  lat: number,
  lon: number,
  unit: TemperatureUnit = 'metric'
): Promise<ForecastData> {
  const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unit}`;
  const cacheKey = `forecast_${lat}_${lon}_${unit}`;
  return fetchWithCache<ForecastData>(url, cacheKey);
}

// Process forecast data to get daily forecasts
export function processForecastData(forecast: ForecastData): DailyForecast[] {
  const dailyData: Record<string, DailyForecast> = {};
  
  forecast.list.forEach(item => {
    const date = new Date(item.dt * 1000);
    const dateKey = date.toISOString().split('T')[0];
    
    if (!dailyData[dateKey]) {
      dailyData[dateKey] = {
        date: dateKey,
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        temp_max: item.main.temp_max,
        temp_min: item.main.temp_min,
        description: item.weather[0].description,
        icon: item.weather[0].icon
      };
    } else {
      // Update min/max if needed
      if (item.main.temp_max > dailyData[dateKey].temp_max) {
        dailyData[dateKey].temp_max = item.main.temp_max;
      }
      if (item.main.temp_min < dailyData[dateKey].temp_min) {
        dailyData[dateKey].temp_min = item.main.temp_min;
      }
    }
  });
  
  // Convert to array and limit to 5 days
  return Object.values(dailyData).slice(0, 5);
}

// Get city suggestions for autocomplete
export async function getCitySuggestions(query: string): Promise<AutocompleteResult[]> {
  if (!query || query.length < 3) return [];
  
  const url = `${GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`;
  const cacheKey = `suggestions_${query}`;
  
  try {
    const results = await fetchWithCache<any[]>(url, cacheKey);
    return results.map(item => ({
      name: item.name,
      country: item.country,
      state: item.state
    }));
  } catch (error) {
    console.error('Error fetching city suggestions:', error);
    return [];
  }
}