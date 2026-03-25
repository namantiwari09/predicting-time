import './Footer.css';

const techStack = [
  { icon: '⚛️', name: 'React JS', role: 'Frontend', color: 'rgba(97,218,251,0.08)' },
  { icon: '🐍', name: 'Flask', role: 'Backend', color: 'rgba(52,211,153,0.08)' },
  { icon: '🤖', name: 'Scikit-learn', role: 'ML Model', color: 'rgba(168,85,247,0.08)' },
  { icon: '🗺️', name: 'Google Maps', role: 'Distance API', color: 'rgba(255,107,53,0.08)' },
  { icon: '📈', name: 'Regression', role: 'Algorithm', color: 'rgba(255,204,2,0.08)' },
];

export default function Footer() {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* ── Tech Stack Section ──────────────────────── */}
      <section className="tech-section" id="tech-section">
        <div className="tech-header">
          <div className="tech-header-badge">⚙️ Technologies</div>
          <h2>
            Built With <span className="gradient-text">Modern Stack</span>
          </h2>
          <p>
            A powerful combination of web development, APIs, and machine learning
          </p>
        </div>
        <div className="tech-grid">
          {techStack.map((tech, i) => (
            <div
              className="tech-card"
              key={i}
              style={{ '--i': i, '--tech-color': tech.color }}
            >
              <span className="tech-card-icon">{tech.icon}</span>
              <div className="tech-card-name">{tech.name}</div>
              <div className="tech-card-role">{tech.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────── */}
      <footer className="footer" id="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-brand-icon">🍕</div>
            <span className="footer-brand-name">FoodTime AI</span>
          </div>
          <p className="footer-desc">
            Smart food delivery time prediction powered by machine learning,
            Google Maps API, and modern web technologies.
          </p>
          <div className="footer-links">
            <button className="footer-link" onClick={() => scrollTo('hero-section')}>Home</button>
            <button className="footer-link" onClick={() => scrollTo('prediction-section')}>Predict</button>
            <button className="footer-link" onClick={() => scrollTo('how-it-works')}>How It Works</button>
            <button className="footer-link" onClick={() => scrollTo('tech-section')}>Tech Stack</button>
          </div>
          <div className="footer-divider"></div>
          <p className="footer-copy">
            © {new Date().getFullYear()} FoodTime AI — Food Delivery Time Prediction System
          </p>
        </div>
      </footer>
    </>
  );
}
