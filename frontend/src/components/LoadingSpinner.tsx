import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center h-full w-full p-8" data-testid="loading-spinner">
    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
  </div>
);
