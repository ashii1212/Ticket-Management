import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message = 'An error occurred', onRetry }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center bg-red-50 rounded-lg">
    <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
    <h3 className="text-lg font-semibold text-red-800 mb-2">Something went wrong</h3>
    <p className="text-red-600 mb-4">{message}</p>
    {onRetry && (
      <button 
        onClick={onRetry}
        className="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-md font-medium transition-colors"
      >
        Try Again
      </button>
    )}
  </div>
);
