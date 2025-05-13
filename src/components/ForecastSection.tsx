import React from 'react';
import { DailyForecast, TemperatureUnit } from '../types';
import ForecastCard from './ForecastCard';

interface ForecastSectionProps {
  forecasts: DailyForecast[];
  unit: TemperatureUnit;
}

const ForecastSection: React.FC<ForecastSectionProps> = ({ forecasts, unit }) => {
  if (!forecasts || forecasts.length === 0) return null;

  return (
    <div className="w-full max-w-4xl mx-auto mt-6">
      <h2 className="text-2xl font-bold text-white mb-4">5-Day Forecast</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
        {forecasts.map((forecast, index) => (
          <ForecastCard key={index} forecast={forecast} unit={unit} />
        ))}
      </div>
    </div>
  );
};

export default ForecastSection;