import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css'; 

function HomePage() {
    const navigate = useNavigate();

    return (
        <div className="homepage-container">
            <h1>UniHelp Homepage</h1>
            <button type="button" className="homepage-login-button" onClick={() => navigate('/login')}>Login</button>
        </div>
    );
}

export default HomePage;
