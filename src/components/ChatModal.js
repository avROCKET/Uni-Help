import React, { useState } from 'react';
import Modal from './Modal';

const ChatModal = ({ isOpen, onClose, messages, canSendMessage, onSendMessage }) => {
    const [message, setMessage] = useState('');

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div>
                <div style={{display:'flex', flexDirection:'row', allignItems:'center', justifyContent:'center'}}>
                    <h3 style={{paddingRight:5}}>Ticket Subject:</h3> 
                    <h3>Subject Name Here</h3>
                </div>
                <div style={{display:'flex', flexDirection:'row', allignItems:'center', justifyContent:'center'}}>
                    <h3 style={{paddingRight:5}}>Creation Date:</h3> 
                    <h3>Date Here</h3>
                </div>
                <h1 style={{display:'flex', flexDirection:'row', allignItems:'center', justifyContent:'center'}}>Messages</h1>

                {canSendMessage && (
                    <div style={{display:'flex', flexDirection:'row', allignItems:'center', justifyContent:'center'}}>
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

                <div style={{display:'flex', flexDirection:'column-reverse', allignItems:'center', justifyContent:'center'}}>
                {messages.map((msg, index) => (
                    <div style={{display:'flex', allignItems:'center', justifyContent:'center'}} key={index}>{msg.content}</div>
                ))}
                </div>
            </div>
        </Modal>
    );
};

export default ChatModal;
