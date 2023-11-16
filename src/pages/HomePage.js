import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css'; 

function HomePage() {
    const navigate = useNavigate();

    return (
    <div className="background-video-container">
        <video autoPlay loop muted playsInline className="background-video">
            <source src="/assets/video5.mp4" type="video/mp4" />
        </video>    
            <div className="homepage-container">
                <h1>UniHelp Homepage</h1>
                <button type="button" className="homepage-login-button" onClick={() => navigate('/login')}>Login</button>
            </div>
        </div>
    );  
}

export default HomePage;
