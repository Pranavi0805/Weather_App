import React from 'react';
import { DailyForecast, TemperatureUnit } from '../types';
import { formatTemperature } from '../utils/weatherUtils';
import WeatherIcon from './WeatherIcon';

interface ForecastCardProps {
  forecast: DailyForecast;
  unit: TemperatureUnit;
}

const ForecastCard: React.FC<ForecastCardProps> = ({ forecast, unit }) => {
  const { day, temp_max, temp_min, description, icon } = forecast;

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 flex flex-col items-center transform hover:scale-105 transition-all duration-300 border border-white/20">
      <div className="font-bold text-lg text-white mb-2">{day}</div>
      
      <WeatherIcon code={icon} size="md" />
      
      <div className="mt-2 text-white/90 text-sm capitalize">{description}</div>
      
      <div className="mt-auto pt-3 flex justify-between w-full">
        <div className="text-red-300 font-semibold">
          {formatTemperature(temp_max, unit)}
        </div>
        <div className="text-blue-300 font-semibold">
          {formatTemperature(temp_min, unit)}
        </div>
      </div>
    </div>
  );
};

export default ForecastCard;