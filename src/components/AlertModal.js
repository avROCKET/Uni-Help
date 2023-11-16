import React from 'react';

const AlertModal = ({ isOpen, onClose, onConfirm, message }) => {
    if (!isOpen) return null;
  
    return (
      <div className="alert-backdrop">
        <div className="alert">
          <p>{message}</p>
          <button className="ticket-button" onClick={onConfirm}>Yes</button>
          <button className="ticket-button" onClick={onClose}>No</button>
        </div>
      </div>
    );
  };

  export default AlertModal;
  