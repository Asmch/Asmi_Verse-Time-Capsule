import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  show: boolean;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'success', show, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!show) return null;

  return (
    <div
      className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-4 rounded-lg shadow-lg text-white text-center transition-all duration-300
        ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}
        animate-fadeIn
      `}
      role="alert"
      aria-live="assertive"
    >
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-4 text-white/80 hover:text-white focus:outline-none"
        aria-label="Close notification"
      >
        &times;
      </button>
    </div>
  );
};

export default Toast; 