import React, { useEffect } from "react";
//import "./FlashError.css"; // We will style it separately

function FlashError({ message, type, onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className={`flash-${type}`}>
      {message}
      <button onClick={onClose}>×</button>
    </div>
  );
}

export default FlashError;
