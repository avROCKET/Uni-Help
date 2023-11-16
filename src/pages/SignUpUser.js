import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../utils/authFunctions.js'; 

function SignUpUser() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
  
    try {
      await register(email, password, name);
      navigate('/dashboard');
    } catch (err) {
      setError('Error: An account created with this email already exists.');
    }
  };
  return (
    <div className="background-video-container">
        <video autoPlay loop muted playsInline className="background-video">
            <source src="/assets/video1.mp4" type="video/mp4" />
        </video>

        <div className="centered-content-container">
            <div className="logo-container">
                <img src="/assets/logo.png" alt="Company Logo" className="company-logo" onClick={() => navigate('/')} />
            </div>
            
            <h2 className="title">Sign Up as User</h2>
            <form onSubmit={handleSubmit}>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <div className="input-container">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder=" "
                    />
                    <label>Name</label>
                </div>
                <div className="input-container">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder=" "
                    />
                    <label>Email</label>
                </div>
                <div className="input-container">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder=" "
                    />
                    <label>Password</label>
                </div>
                <div className="input-container">
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        placeholder=" "
                    />
                    <label>Confirm Password</label>
                </div>
                <div className="button-row">
                    <button className="material-button" type="submit">Sign Up</button>
                    <button className="material-button" type="button" onClick={() => navigate('/login')}>Back to Login</button>
                </div>
            </form>
        </div>
    </div>
  );
}

export default SignUpUser;