import React, { useEffect } from 'react';

const Notification = ({ message, type = 'success', duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const colors = {
    success: 'var(--success-green)',
    error: 'var(--danger-red)',
    warning: 'var(--warning-yellow)',
    info: 'var(--info-blue)'
  };

  const icons = {
    success: 'fa-check-circle',
    error: 'fa-times-circle',
    warning: 'fa-exclamation-triangle',
    info: 'fa-info-circle'
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '100px',
        right: '2rem',
        padding: '1rem 1.5rem',
        background: 'rgba(10, 14, 39, 0.95)',
        backdropFilter: 'blur(20px)',
        border: `2px solid ${colors[type]}`,
        borderRadius: '12px',
        color: 'white',
        fontWeight: '600',
        zIndex: '10000',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
        animation: 'slideInRight 0.3s ease-out'
      }}
    >
      <i 
        className={`fas ${icons[type]}`} 
        style={{ 
          color: colors[type], 
          marginRight: '0.5rem' 
        }}
      ></i>
      {message}
    </div>
  );
};

export default Notification;