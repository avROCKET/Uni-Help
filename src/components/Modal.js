import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ width: '80%', backgroundColor: 'white', padding: 20, borderRadius: '10px' }}>
                <button onClick={onClose} style={{ float: 'right' }}>Close</button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
