import './ResultCard.css';

export default function ResultCard({ data }) {
  const trafficEmoji = { low: '🟢', medium: '🟡', high: '🔴' };

  return (
    <div className="result-card" id="result-card">
      {/* ── Header ─────────────────────────────────── */}
      <div className="result-header">
        <div className="result-success-icon">✅</div>
        <h3>Estimated Delivery Time</h3>
        <div className="result-time-wrapper">
          <div className="result-time">
            {Math.round(data.predicted_time)}
            <span className="result-time-unit">min</span>
          </div>
        </div>
        <span className="result-time-label">
          Predicted by ML Model
        </span>
      </div>

      {/* ── Route ──────────────────────────────────── */}
      <div className="result-route">
        <div className="result-route-header">📍 Delivery Route</div>
        <div className="result-route-locations">
          <span className="route-location">{data.restaurant_location}</span>
          <span className="route-arrow">→</span>
          <span className="route-location">{data.delivery_location}</span>
        </div>
      </div>

      {/* ── Detail Grid ────────────────────────────── */}
      <div className="result-details">
        <div className="result-detail" style={{ '--i': 0 }}>
          <span className="result-detail-icon">🗺️</span>
          <div className="result-detail-label">Distance</div>
          <div className="result-detail-value">{data.distance_text}</div>
        </div>

        <div className="result-detail" style={{ '--i': 1 }}>
          <span className="result-detail-icon">🚗</span>
          <div className="result-detail-label">Travel Time</div>
          <div className="result-detail-value">{data.travel_time_text}</div>
        </div>

        <div className="result-detail" style={{ '--i': 2 }}>
          <span className="result-detail-icon">⏱️</span>
          <div className="result-detail-label">Prep Time</div>
          <div className="result-detail-value">{data.prep_time} min</div>
        </div>

        <div className="result-detail" style={{ '--i': 3 }}>
          <span className="result-detail-icon">🚦</span>
          <div className="result-detail-label">Traffic</div>
          <div className="result-detail-value">
            <span className={`traffic-badge ${data.traffic_level}`}>
              {trafficEmoji[data.traffic_level]}{' '}
              {data.traffic_level.charAt(0).toUpperCase() + data.traffic_level.slice(1)}
            </span>
          </div>
        </div>
      </div>

      {/* ── Source ─────────────────────────────────── */}
      <div className="result-source">
        <span className="result-source-badge">
          {data.data_source === 'google_maps' ? '🌐 Google Maps API' : '📊 Estimated Distance'}
        </span>
      </div>
    </div>
  );
}
