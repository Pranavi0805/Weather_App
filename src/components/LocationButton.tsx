import React from 'react';
import { MapPin } from 'lucide-react';

interface LocationButtonProps {
  onClick: () => void;
  loading: boolean;
}

const LocationButton: React.FC<LocationButtonProps> = ({ onClick, loading }) => {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="flex items-center justify-center px-3 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/30 hover:bg-white/20 transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <MapPin size={18} className="text-white mr-2" />
      <span className="text-white text-sm">
        {loading ? 'Locating...' : 'Use My Location'}
      </span>
    </button>
  );
};

export default LocationButton;