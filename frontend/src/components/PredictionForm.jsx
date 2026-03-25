import { useState } from 'react';
import ResultCard from './ResultCard';
import './PredictionForm.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function PredictionForm() {
  const [formData, setFormData] = useState({
    restaurant_location: '',
    delivery_location: '',
    prep_time: '',
    traffic_level: 'medium',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const setTraffic = (level) => {
    setFormData({ ...formData, traffic_level: level });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    if (!formData.restaurant_location.trim()) {
      setError('Please enter the restaurant location.');
      return;
    }
    if (!formData.delivery_location.trim()) {
      setError('Please enter the delivery location.');
      return;
    }
    const prepVal = parseFloat(formData.prep_time);
    if (!formData.prep_time || isNaN(prepVal) || prepVal < 0 || prepVal > 120) {
      setError('Preparation time must be between 0 and 120 minutes.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, prep_time: prepVal }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }

      setResult(data);
    } catch {
      setError('Cannot connect to the server. Make sure the Flask backend is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="prediction-section" id="prediction-section">
      {/* ── Section Header ──────────────────────────── */}
      <div className="prediction-section-header">
        <h2>
          Make a <span className="gradient-text">Prediction</span>
        </h2>
        <p>Enter your delivery details and get an instant ML-powered estimate</p>
      </div>

      {/* ── Left: Input Form ───────────────────────── */}
      <div className="form-card" id="prediction-form-card">
        <div className="form-card-header">
          <h2 className="form-card-title">
            <span className="form-card-title-icon">📍</span>
            Delivery Details
          </h2>
          <p className="form-card-subtitle">
            Fill in the details below and our ML model will predict
            the estimated delivery time based on real conditions.
          </p>
        </div>

        <form onSubmit={handleSubmit} id="prediction-form">
          {/* Restaurant Location */}
          <div className="form-group">
            <label className="form-label" htmlFor="restaurant_location">
              <span className="form-label-icon">🏪</span>
              Restaurant Location
            </label>
            <input
              type="text"
              id="restaurant_location"
              name="restaurant_location"
              className="form-input"
              placeholder="e.g., Bhopal MP Nagar"
              value={formData.restaurant_location}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>

          {/* Delivery Location */}
          <div className="form-group">
            <label className="form-label" htmlFor="delivery_location">
              <span className="form-label-icon">🏠</span>
              Delivery Location
            </label>
            <input
              type="text"
              id="delivery_location"
              name="delivery_location"
              className="form-input"
              placeholder="e.g., Bhopal Arera Colony"
              value={formData.delivery_location}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>

          {/* Preparation Time */}
          <div className="form-group">
            <label className="form-label" htmlFor="prep_time">
              <span className="form-label-icon">⏱️</span>
              Preparation Time
            </label>
            <input
              type="number"
              id="prep_time"
              name="prep_time"
              className="form-input"
              placeholder="e.g., 15"
              min="0"
              max="120"
              value={formData.prep_time}
              onChange={handleChange}
            />
            <p className="form-hint">⏳ Time in minutes (0–120)</p>
          </div>

          {/* Traffic Level */}
          <div className="form-group">
            <label className="form-label">
              <span className="form-label-icon">🚦</span>
              Traffic Level
            </label>
            <div className="traffic-pills" id="traffic-selector">
              {[
                { key: 'low', emoji: '🟢', label: 'Low' },
                { key: 'medium', emoji: '🟡', label: 'Medium' },
                { key: 'high', emoji: '🔴', label: 'High' },
              ].map(({ key, emoji, label }) => (
                <button
                  key={key}
                  type="button"
                  className={`traffic-pill ${key} ${formData.traffic_level === key ? 'active' : ''}`}
                  onClick={() => setTraffic(key)}
                >
                  <span className="traffic-pill-emoji">{emoji}</span>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
            id="predict-button"
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                Analyzing Route...
              </>
            ) : (
              <>🚀 Predict Delivery Time</>
            )}
          </button>

          {/* Error */}
          {error && (
            <div className="form-error" id="form-error">
              <span className="form-error-icon">!</span>
              <span>{error}</span>
            </div>
          )}
        </form>
      </div>

      {/* ── Right: Result Panel ────────────────────── */}
      <div className="result-panel" id="result-panel">
        {result ? (
          <ResultCard data={result} />
        ) : (
          <div className="result-placeholder">
            <div className="result-placeholder-icon">🍔</div>
            <p className="result-placeholder-text">
              Your predicted delivery time will appear here after you submit the form.
            </p>
            <div className="result-placeholder-hint">
              Try: MP Nagar → Arera Colony, 15 min prep, High traffic
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
