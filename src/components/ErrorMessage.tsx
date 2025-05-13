import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="bg-red-900/20 backdrop-blur-md border border-red-500/50 rounded-lg p-6 max-w-md mx-auto flex flex-col items-center text-center">
      <AlertTriangle size={50} className="text-red-400 mb-4" />
      <h3 className="text-xl font-bold text-white mb-2">Error</h3>
      <p className="text-white/90 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-white/20 text-white rounded-md hover:bg-white/30 transition-colors duration-300"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;