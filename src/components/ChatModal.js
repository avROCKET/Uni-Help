import React, { useState } from 'react';
import Modal from './Modal';

const ChatModal = ({ isOpen, onClose, messages, canSendMessage, onSendMessage, tickets }) => {
    const [message, setMessage] = useState('');

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>{msg.content}</div>
                ))}

                {canSendMessage && (
                    <div>
                        <h1>Messages</h1>
                        <input 
                            type="text" 
                            value={message}
                            onChange={e => setMessage(e.target.value)} 
                        />
                        <button onClick={() => {
                            onSendMessage(message);
                            setMessage('');
                        }}>
                            Send
                        </button>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default ChatModal;
