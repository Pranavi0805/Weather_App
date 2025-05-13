import React from 'react';
import { TemperatureUnit } from '../types';

interface UnitToggleProps {
  unit: TemperatureUnit;
  onToggle: () => void;
}

const UnitToggle: React.FC<UnitToggleProps> = ({ unit, onToggle }) => {
  return (
    <div className="flex items-center justify-center">
      <button
        onClick={onToggle}
        className="flex items-center justify-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full shadow-md border border-white/30 hover:bg-white/20 transition-all duration-300 focus:outline-none"
      >
        <span className={`text-sm font-medium px-2 py-1 rounded-full transition-all duration-300 ${unit === 'metric' ? 'bg-white/30 text-white' : 'text-white/70'}`}>
          °C
        </span>
        <span className="mx-1 text-white">|</span>
        <span className={`text-sm font-medium px-2 py-1 rounded-full transition-all duration-300 ${unit === 'imperial' ? 'bg-white/30 text-white' : 'text-white/70'}`}>
          °F
        </span>
      </button>
    </div>
  );
};

export default UnitToggle;