import React from 'react';

const ErrorMessage = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="alert alert-danger d-flex justify-content-between align-items-center" role="alert">
      <div>
        <i className="fas fa-exclamation-circle me-2"></i>
        {message}
      </div>
      {onClose && (
        <button 
          type="button" 
          className="btn-close" 
          onClick={onClose}
          aria-label="Close"
        ></button>
      )}
    </div>
  );
};

export default ErrorMessage;