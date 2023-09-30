import React, { useState } from 'react';
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from '../firebase.js'; 
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset has been email sent. Please check your email for a reset link.');
    } catch (error) {
      setError('Error.');
      console.error('Error:', error);
    }
  };

  return (
    <div className="background-video-container">
      <video autoPlay loop muted playsInline className="background-video">
        <source src="/assets/video1.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
  
      <div className="centered-content-container">
        <div className="logo-container">
          <img src="/assets/logo.png" alt="Company Logo" className="company-logo" onClick={() => navigate('/')} />
        </div>
  
        <div>
          <h2 className="title">Forgot Password</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-container">
              <input 
                type="email" 
                placeholder=" "
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
              <label>Email</label>
            </div>
            <div className="button-row">
              <button className="material-button" type="submit">Send Email</button>
              <button className="material-button" type="button" onClick={() => navigate('/login')}>Back to Login</button>
            </div>
          </form>
          {message && <p className="message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
    </div>
  );
}  

export default ForgotPassword;
