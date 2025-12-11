import React from 'react';

const LoadingSpinner = ({ size = 'md', message = '' }) => {
  const sizeClasses = {
    sm: 'spinner-border-sm',
    md: '',
    lg: 'spinner-border-lg'
  };

  return (
    <div className="text-center py-4">
      <div className={`spinner-border ${sizeClasses[size]} text-primary`} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      {message && <p className="mt-2">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;