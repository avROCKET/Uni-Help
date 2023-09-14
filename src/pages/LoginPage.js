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
      setError('Wrong credentials');
    }
  };

  return (
    <div>
      <button type="button" onClick={() => navigate('/')}>Homepage</button>
      {isLogin ? (
        <>
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div>
              <label>
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
            </div>
            <div>
              <label>
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>
            </div>
            <div>
              <button type="button" onClick={() => navigate('/forgot-password')}>Forgot Password?</button>
            </div>
            <button type="submit">Login</button>
          </form>
          <button type="button" onClick={() => setIsLogin(false)}>Sign Up</button>
        </>
      ) : (
        <>
          <h2>Sign Up</h2>
          <button type="button" onClick={() => navigate('/signup-user')}>Sign Up as User</button>
          <button type="button" onClick={() => navigate('/signup-company')}>Sign Up as Company</button>
          <button type="button" onClick={() => setIsLogin(true)}>Back to Login</button>
        </>
      )}
    </div>
  );
}

export default LoginPage;