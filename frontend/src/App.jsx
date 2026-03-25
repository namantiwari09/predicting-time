import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PredictionForm from './components/PredictionForm';
import HowItWorks from './components/HowItWorks';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <div className="app">
      {/* Floating background orbs */}
      <div className="floating-orbs" aria-hidden="true">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      <Navbar />
      <main className="app-main">
        <Hero />

        {/* Stats Bar */}
        <div className="stats-bar" id="stats-bar">
          <div className="stat-item">
            <span className="stat-icon">🎯</span>
            <div className="stat-value">95%+</div>
            <div className="stat-label">Accuracy</div>
          </div>
          <div className="stat-item">
            <span className="stat-icon">⚡</span>
            <div className="stat-value">&lt;1s</div>
            <div className="stat-label">Prediction</div>
          </div>
          <div className="stat-item">
            <span className="stat-icon">🗺️</span>
            <div className="stat-value">Real</div>
            <div className="stat-label">Distance Data</div>
          </div>
          <div className="stat-item">
            <span className="stat-icon">🤖</span>
            <div className="stat-value">ML</div>
            <div className="stat-label">Powered</div>
          </div>
        </div>

        <PredictionForm />
        <div className="section-divider"><hr /></div>
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
}

export default App;
