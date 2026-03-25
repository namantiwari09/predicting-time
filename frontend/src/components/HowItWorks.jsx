import './HowItWorks.css';

const steps = [
  {
    icon: '📝',
    title: 'Enter Details',
    desc: 'Provide restaurant & delivery locations, preparation time, and current traffic level.',
  },
  {
    icon: '🗺️',
    title: 'Route Analysis',
    desc: 'Google Maps API calculates real distance and estimated travel duration between locations.',
  },
  {
    icon: '🤖',
    title: 'ML Prediction',
    desc: 'Our trained regression model processes distance, prep time, and traffic to predict delivery time.',
  },
  {
    icon: '⚡',
    title: 'Instant Result',
    desc: 'Get your accurate delivery estimate displayed beautifully in seconds.',
  },
];

export default function HowItWorks() {
  return (
    <section className="how-it-works" id="how-it-works">
      <div className="section-header">
        <div className="section-header-badge">
          ✨ Simple Process
        </div>
        <h2>
          How <span className="gradient-text-alt">It Works</span>
        </h2>
        <p>
          From input to accurate delivery prediction in four seamless steps
        </p>
      </div>
      <div className="steps-grid">
        {steps.map((step, i) => (
          <div className="step-card" key={i} style={{ '--i': i }}>
            <div className="step-number">{i + 1}</div>
            <div className="step-icon">{step.icon}</div>
            <h3 className="step-title">{step.title}</h3>
            <p className="step-desc">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
