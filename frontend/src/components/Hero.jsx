import './Hero.css';

export default function Hero() {
  const scrollToPredict = () => {
    document.getElementById('prediction-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToHow = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero" id="hero-section">
      <div className="hero-badge">
        <span className="hero-badge-dot"></span>
        Powered by Machine Learning & Google Maps
      </div>

      <h1>
        <span className="line-1">Predict Your Food</span>
        <span className="gradient-text">Delivery Time</span>{' '}
        <span className="line-emoji">🚀</span>
      </h1>

      <p className="hero-description">
        Get <strong>accurate delivery estimates</strong> using real-time distance data
        from Google Maps, traffic conditions, and preparation time — all processed
        by our trained <strong>ML regression model</strong>.
      </p>

      <div className="hero-cta-row">
        <button className="hero-cta" onClick={scrollToPredict}>
          🍔 Try Prediction Now
        </button>
        <button className="hero-cta-secondary" onClick={scrollToHow}>
          Learn How It Works →
        </button>
      </div>

      <div className="hero-features">
        <div className="hero-feature">
          <span className="hero-feature-icon">🗺️</span>
          <span>Google Maps API</span>
        </div>
        <div className="hero-feature">
          <span className="hero-feature-icon">🤖</span>
          <span>ML Regression</span>
        </div>
        <div className="hero-feature">
          <span className="hero-feature-icon">⚡</span>
          <span>Instant Results</span>
        </div>
        <div className="hero-feature">
          <span className="hero-feature-icon">🚦</span>
          <span>Traffic Aware</span>
        </div>
        <div className="hero-feature">
          <span className="hero-feature-icon">📊</span>
          <span>95%+ Accuracy</span>
        </div>
      </div>
    </section>
  );
}
