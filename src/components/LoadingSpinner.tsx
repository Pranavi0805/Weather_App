import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Loading weather data...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-6">
      <div className="relative w-20 h-20">
        {/* Animated spinner */}
        <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full animate-ping opacity-75"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      </div>
      <p className="mt-4 text-white/90 text-lg">{message}</p>
    </div>
  );
};

export default LoadingSpinner;