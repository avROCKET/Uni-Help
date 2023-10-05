import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../utils/authFunctions.js'; 

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('The provided username and password do not match');
    }
  };

  return (
    <div className="background-video-container">
        <video autoPlay loop muted playsInline className="background-video">
            <source src="/assets/video1.mp4" type="video/mp4" />
            Your browser does not support the video tag.
        </video>

        <div className="centered-content-container">
            <div>
              <div className="logo-container">
                <img src="/assets/logo.png" alt="Company Logo" className="company-logo" onClick={() => navigate('/')} />
              </div>
                {isLogin ? (
                    <>
                        <h2 className="title">Login</h2>
                        <form onSubmit={handleSubmit}>
                            {error && <p style={{ color: 'red' }}>{error}</p>}
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
                            <div className="button-row">
                                <button className="material-button" type="button" onClick={() => navigate('/forgot-password')}>Forgot Password?</button>
                                <button className="material-button" type="submit">Login</button>
                                <button className="material-button" type="button" onClick={() => setIsLogin(false)}>Sign Up</button>
                            </div>
                        </form>
                    </>
                ) : (
                    <>
                        <h2 className="title">Sign Up</h2>
                        <div className="button-row">
                        <button className="material-button" type="button" onClick={() => navigate('/signup-user')}>Sign Up as User</button>
                        <button className="material-button" type="button" onClick={() => navigate('/signup-company')}>Sign Up as Company</button>
                        <button className="material-button" type="button" onClick={() => setIsLogin(true)}>Back to Login</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    </div>
  );
}

export default LoginPage;