"""
Flask backend for Food Delivery Time Prediction.
Handles:
  - Google Maps Distance Matrix API calls
  - ML model inference
  - CORS for React frontend
  - Serving static frontend files
"""

import os
import json
import requests
import joblib
import numpy as np
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

# ── App Setup ────────────────────────────────────────────────────────────────
# Configure Flask to serve static files from the frontend build directory
FRONTEND_DIST = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend', 'dist'))

app = Flask(__name__, static_folder=FRONTEND_DIST, static_url_path='/')
CORS(app)

# ── Load ML Model ────────────────────────────────────────────────────────────
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model', 'delivery_model.pkl')
model = None
try:
    model = joblib.load(MODEL_PATH)
    print(f"ML model loaded from {MODEL_PATH}")
except FileNotFoundError:
    print("WARNING: Model file not found. Run train_model.py first.")
except Exception as exc:
    print(f"WARNING: Failed to load model ({exc}). Run train_model.py first.")

# ── Google Maps API Key ──────────────────────────────────────────────────────
GOOGLE_MAPS_API_KEY = os.environ.get('GOOGLE_MAPS_API_KEY', '')

TRAFFIC_MAP = {
    'low': 1,
    'medium': 2,
    'high': 3,
}

def get_distance_from_google_maps(origin: str, destination: str):
    url = 'https://maps.googleapis.com/maps/api/distancematrix/json'
    params = {
        'origins': origin,
        'destinations': destination,
        'mode': 'driving',
        'key': GOOGLE_MAPS_API_KEY,
    }
    resp = requests.get(url, params=params, timeout=10)
    data = resp.json()

    if data.get('status') != 'OK':
        raise ValueError(f"Google Maps API error: {data.get('status')} — {data.get('error_message', '')}")

    element = data['rows'][0]['elements'][0]
    if element.get('status') != 'OK':
        raise ValueError(f"Route not found: {element.get('status')}")

    distance_m = element['distance']['value']        # meters
    duration_s = element['duration']['value']          # seconds
    distance_text = element['distance']['text']
    duration_text = element['duration']['text']

    distance_km = round(distance_m / 1000.0, 2)
    duration_min = round(duration_s / 60.0, 1)

    return distance_km, duration_min, distance_text, duration_text

def estimate_distance_fallback(origin: str, destination: str):
    combined = f"{origin.lower().strip()}{destination.lower().strip()}"
    hash_val = sum(ord(c) for c in combined)
    distance_km = round(1.0 + (hash_val % 190) / 10.0, 2)
    duration_min = round((distance_km / 25.0) * 60.0, 1)
    return distance_km, duration_min, f"{distance_km} km", f"{int(duration_min)} mins"

# ── Routes ───────────────────────────────────────────────────────────────────

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'ok',
        'model_loaded': model is not None,
        'google_maps_configured': bool(GOOGLE_MAPS_API_KEY),
    })

@app.route('/api/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({'error': 'ML model not loaded.'}), 500

    data = request.get_json(force=True, silent=True)
    if not data:
        return jsonify({'error': 'Invalid JSON body.'}), 400

    restaurant = data.get('restaurant_location', '').strip()
    delivery = data.get('delivery_location', '').strip()
    prep_time = data.get('prep_time')
    traffic = data.get('traffic_level', '').lower().strip()

    errors = []
    if not restaurant: errors.append('Restaurant location is required.')
    if not delivery: errors.append('Delivery location is required.')
    if prep_time is None: errors.append('Prep time is required.')
    if traffic not in TRAFFIC_MAP: errors.append('Invalid traffic level.')

    if errors:
        return jsonify({'error': ' '.join(errors)}), 400

    try:
        if GOOGLE_MAPS_API_KEY:
            distance_km, gm_duration, dist_text, dur_text = get_distance_from_google_maps(restaurant, delivery)
            source = 'google_maps'
        else:
            distance_km, gm_duration, dist_text, dur_text = estimate_distance_fallback(restaurant, delivery)
            source = 'fallback_estimate'
    except Exception as e:
        return jsonify({'error': f'Failed to get distance: {str(e)}'}), 502

    traffic_num = TRAFFIC_MAP[traffic]
    features = np.array([[distance_km, float(prep_time), traffic_num]])
    predicted_time = float(model.predict(features)[0])
    predicted_time = max(round(predicted_time, 1), 5.0)

    return jsonify({
        'predicted_time': predicted_time,
        'distance_km': distance_km,
        'distance_text': dist_text,
        'google_maps_travel_time': gm_duration,
        'travel_time_text': dur_text,
        'prep_time': prep_time,
        'traffic_level': traffic,
        'restaurant_location': restaurant,
        'delivery_location': delivery,
        'data_source': source,
    })

# ── Frontend Routes ──────────────────────────────────────────────────────────
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_frontend(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
