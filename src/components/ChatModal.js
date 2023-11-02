import React, { useState } from 'react';
import Modal from './Modal';


const ChatModal = ({ isOpen, onClose, messages, canSendMessage, onSendMessage, selectedTicketData, userId, isClosed }) => {
    const [message, setMessage] = useState('');

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="chat-modal-container">
                <div className="chat-modal-header">
                    <h3>Ticket Subject:</h3>
                    <p>{selectedTicketData?.subject || "no subject"}</p> 
                    <h3>Description:</h3>
                    <p>{selectedTicketData?.description || "no description"}</p>
                    <h3>Creation Date:</h3>
                    <p>{selectedTicketData?.created?.toDate().toDateString() || "no date"}</p>
                </div>

                <div className="chat-modal-messages">
                    {messages.map((msg, index) => (
                        <div className="chat-modal-message" key={index}>
                            <span className="message-sender-stamp">
                                {msg.senderId === userId ? 'User' : 'Agent'} {/* need to make a bug fix. current user logged in is called 'User", even if support agent logged in.*/}
                            </span>
                            <p>{msg.content}</p>
                        </div>
                    ))}
                </div>

                {!isClosed && canSendMessage && (
                    <div className="chat-modal-input-container">
                        <input 
                            className="chat-modal-input"
                            type="text" 
                            value={message}
                            onChange={e => setMessage(e.target.value)} 
                        />
                        <button className="chat-modal-send-button" onClick={() => {
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
