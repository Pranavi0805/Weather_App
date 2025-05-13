import React from 'react';
import { CurrentWeatherData, TemperatureUnit } from '../types';
import { 
  formatTemperature, 
  formatDateTime, 
  getWindDescription, 
  getWindDirection 
} from '../utils/weatherUtils';
import WeatherIcon from './WeatherIcon';
import { Droplets, Wind, Compass } from 'lucide-react';

interface CurrentWeatherProps {
  data: CurrentWeatherData;
  unit: TemperatureUnit;
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ data, unit }) => {
  if (!data) return null;

  const { name, main, weather, wind, dt, sys } = data;
  const weatherCondition = weather[0];

  return (
    <div className="w-full max-w-2xl mx-auto backdrop-blur-lg bg-white/10 rounded-xl shadow-lg overflow-hidden border border-white/20 transition-all duration-500">
      <div className="p-5 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white mb-1 flex items-center">
              {name}
              <span className="ml-2 text-lg font-normal bg-white/20 px-2 py-0.5 rounded">
                {sys.country}
              </span>
            </h2>
            <p className="text-white/80 text-sm">
              {formatDateTime(dt)}
            </p>
          </div>
          
          <div className="flex items-center">
            <WeatherIcon code={weatherCondition.icon} size="lg" />
            <div className="ml-2 sm:ml-4">
              <div className="text-4xl sm:text-5xl font-bold text-white">
                {formatTemperature(main.temp, unit)}
              </div>
              <div className="text-white/80 capitalize">
                {weatherCondition.description}
              </div>
            </div>
          </div>
        </div>
        
        {/* Additional weather info */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-white bg-black/20 rounded-lg p-4">
          <div className="flex items-center justify-center sm:justify-start p-2">
            <Droplets className="w-6 h-6 mr-2 text-blue-300" />
            <div>
              <div className="text-sm text-white/70">Humidity</div>
              <div className="font-semibold">{main.humidity}%</div>
            </div>
          </div>
          
          <div className="flex items-center justify-center sm:justify-start p-2">
            <Wind className="w-6 h-6 mr-2 text-blue-300" />
            <div>
              <div className="text-sm text-white/70">Wind Speed</div>
              <div className="font-semibold">{getWindDescription(wind.speed, unit)}</div>
            </div>
          </div>
          
          <div className="flex items-center justify-center sm:justify-start p-2">
            <Compass className="w-6 h-6 mr-2 text-blue-300" />
            <div>
              <div className="text-sm text-white/70">Wind Direction</div>
              <div className="font-semibold">{getWindDirection(wind.deg)}</div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex justify-between text-white/80 text-sm">
          <div>
            Feels like: <span className="font-semibold">{formatTemperature(main.feels_like, unit)}</span>
          </div>
          <div>
            Min: <span className="font-semibold">{formatTemperature(main.temp_min, unit)}</span> | 
            Max: <span className="font-semibold">{formatTemperature(main.temp_max, unit)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
