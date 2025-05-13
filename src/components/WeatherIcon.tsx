import React from 'react';

interface WeatherIconProps {
  code: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const WeatherIcon: React.FC<WeatherIconProps> = ({ 
  code, 
  size = 'md',
  className = '' 
}) => {
  // Size mapping
  const sizeClass = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  }[size];

  // Get OpenWeatherMap icon URL
  const iconUrl = `https://openweathermap.org/img/wn/${code}@2x.png`;

  return (
    <div className={`${sizeClass} relative overflow-visible flex-shrink-0 ${className}`}>
      <img
        src={iconUrl}
        alt="Weather icon"
        className="w-full h-full object-contain filter drop-shadow-lg transform scale-150"
      />
    </div>
  );
};

export default WeatherIcon;