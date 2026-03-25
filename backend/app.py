"""
Flask backend for Food Delivery Time Prediction.
Handles:
  - Google Maps Distance Matrix API calls
  - ML model inference
  - CORS for React frontend
"""

import os
import json
import requests
import joblib
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS

# ── App Setup ────────────────────────────────────────────────────────────────
app = Flask(__name__)
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
# Set your API key as an environment variable: GOOGLE_MAPS_API_KEY
GOOGLE_MAPS_API_KEY = os.environ.get('GOOGLE_MAPS_API_KEY', '')

TRAFFIC_MAP = {
    'low': 1,
    'medium': 2,
    'high': 3,
}


def get_distance_from_google_maps(origin: str, destination: str):
    """
    Call Google Maps Distance Matrix API to get distance (km) and
    estimated travel duration (minutes) between two locations.
    Returns (distance_km, duration_min, distance_text, duration_text) or raises.
    """
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
    """
    Fallback distance estimation when Google Maps API key is not set.
    Uses a simple hash-based approach for demo purposes.
    """
    combined = f"{origin.lower().strip()}{destination.lower().strip()}"
    hash_val = sum(ord(c) for c in combined)
    # Generate a pseudo-random but deterministic distance between 1-20 km
    distance_km = round(1.0 + (hash_val % 190) / 10.0, 2)
    # Estimate travel duration at ~25 km/h city speed
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
    """
    Predict delivery time.
    Expected JSON body:
    {
        "restaurant_location": "string",
        "delivery_location": "string",
        "prep_time": number (minutes),
        "traffic_level": "low" | "medium" | "high"
    }
    """
    if model is None:
        return jsonify({'error': 'ML model not loaded. Please run train_model.py first.'}), 500

    data = request.get_json(force=True, silent=True)
    if not data:
        return jsonify({'error': 'Invalid JSON body.'}), 400

    # ── Validate inputs ──────────────────────────────────────────────────
    restaurant = data.get('restaurant_location', '').strip()
    delivery = data.get('delivery_location', '').strip()
    prep_time = data.get('prep_time')
    traffic = data.get('traffic_level', '').lower().strip()

    errors = []
    if not restaurant:
        errors.append('Restaurant location is required.')
    if not delivery:
        errors.append('Delivery location is required.')
    if prep_time is None:
        errors.append('Preparation time is required.')
    else:
        try:
            prep_time = float(prep_time)
            if prep_time < 0 or prep_time > 120:
                errors.append('Preparation time must be between 0 and 120 minutes.')
        except (ValueError, TypeError):
            errors.append('Preparation time must be a valid number.')
    if traffic not in TRAFFIC_MAP:
        errors.append('Traffic level must be low, medium, or high.')

    if errors:
        return jsonify({'error': ' '.join(errors)}), 400

    # ── Get distance from Google Maps (or fallback) ──────────────────────
    try:
        if GOOGLE_MAPS_API_KEY:
            distance_km, gm_duration, dist_text, dur_text = get_distance_from_google_maps(restaurant, delivery)
            source = 'google_maps'
        else:
            distance_km, gm_duration, dist_text, dur_text = estimate_distance_fallback(restaurant, delivery)
            source = 'fallback_estimate'
    except Exception as e:
        return jsonify({'error': f'Failed to get distance: {str(e)}'}), 502

    # ── Prepare features & predict ───────────────────────────────────────
    traffic_num = TRAFFIC_MAP[traffic]
    features = np.array([[distance_km, prep_time, traffic_num]])
    predicted_time = float(model.predict(features)[0])
    predicted_time = max(round(predicted_time, 1), 5.0)  # minimum 5 minutes

    # ── Build response ───────────────────────────────────────────────────
    response = {
        'predicted_time': predicted_time,
        'distance_km': distance_km,
        'distance_text': dist_text,
        'google_maps_travel_time': gm_duration,
        'travel_time_text': dur_text,
        'prep_time': prep_time,
        'traffic_level': traffic,
        'traffic_numeric': traffic_num,
        'restaurant_location': restaurant,
        'delivery_location': delivery,
        'data_source': source,
    }

    return jsonify(response)


# ── Run ──────────────────────────────────────────────────────────────────────
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
