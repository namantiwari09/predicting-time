import { useEffect, useState } from 'react';
import './Navbar.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Navbar() {
  const [online, setOnline] = useState(false);

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch(`${API_URL}/api/health`);
        if (res.ok) setOnline(true);
        else setOnline(false);
      } catch {
        setOnline(false);
      }
    };
    check();
    const interval = setInterval(check, 15000);
    return () => clearInterval(interval);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <div className="navbar-logo">🍕</div>
        <div className="navbar-brand-text">
          <div className="navbar-title">FoodTime AI</div>
          <div className="navbar-subtitle">Smart Predictions</div>
        </div>
      </div>

      <div className="navbar-center">
        <button className="nav-link" onClick={() => scrollTo('prediction-section')}>Predict</button>
        <button className="nav-link" onClick={() => scrollTo('how-it-works')}>How It Works</button>
        <button className="nav-link" onClick={() => scrollTo('tech-section')}>Tech Stack</button>
      </div>

      <div className="navbar-status">
        <div className={`status-dot ${online ? 'online' : 'offline'}`}></div>
        <span>{online ? 'API Connected' : 'API Offline'}</span>
      </div>
    </nav>
  );
}
