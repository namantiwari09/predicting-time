"""
Train a Linear Regression model for food delivery time prediction.
Features: distance_km, prep_time_min, traffic_level (1=Low, 2=Medium, 3=High)
Target: delivery_time_min
"""

import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
import joblib
import os

np.random.seed(42)

# ── Generate realistic synthetic training data ──────────────────────────────
n_samples = 2000

distance_km = np.round(np.random.uniform(0.5, 25.0, n_samples), 2)
prep_time_min = np.random.randint(5, 45, n_samples).astype(float)
traffic_level = np.random.choice([1, 2, 3], n_samples)  # 1=Low, 2=Medium, 3=High

# Realistic delivery time formula with some noise
# Base driving speed ~30 km/h in city → distance/30*60 = 2*distance minutes
# Traffic multiplier: Low=1.0, Medium=1.4, High=2.0
traffic_multiplier = np.where(traffic_level == 1, 1.0, np.where(traffic_level == 2, 1.4, 2.0))

# Travel time = (distance / avg_speed) * 60 * traffic_multiplier
travel_time = (distance_km / 30.0) * 60.0 * traffic_multiplier

# Total delivery time = prep_time + travel_time + random_buffer (pickup, parking, etc.)
random_buffer = np.random.normal(5, 3, n_samples).clip(0, 15)
delivery_time_min = np.round(prep_time_min + travel_time + random_buffer, 1)

# Ensure minimum delivery time
delivery_time_min = np.maximum(delivery_time_min, 8.0)

# Create DataFrame
df = pd.DataFrame({
    'distance_km': distance_km,
    'prep_time_min': prep_time_min,
    'traffic_level': traffic_level,
    'delivery_time_min': delivery_time_min
})

print("=" * 60, flush=True)
print("FOOD DELIVERY TIME PREDICTION — MODEL TRAINING")
print("=" * 60)
print(f"\nDataset shape: {df.shape}")
print(f"\nFeature statistics:\n{df.describe().round(2)}")
print(f"\nTraffic level distribution:\n{df['traffic_level'].value_counts().sort_index()}")

# ── Train / Test Split ──────────────────────────────────────────────────────
X = df[['distance_km', 'prep_time_min', 'traffic_level']]
y = df['delivery_time_min']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print(f"\nTraining samples: {len(X_train)}")
print(f"Testing samples:  {len(X_test)}")

# ── Train Model ─────────────────────────────────────────────────────────────
model = LinearRegression()
model.fit(X_train, y_train)

# ── Evaluate ─────────────────────────────────────────────────────────────────
y_pred = model.predict(X_test)
mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f"\n{'─' * 40}")
print(f"Model Performance:")
print(f"  Mean Absolute Error : {mae:.2f} minutes")
print(f"  R² Score            : {r2:.4f}")
print(f"{'─' * 40}")

print(f"\nModel coefficients:")
for feat, coef in zip(X.columns, model.coef_):
    print(f"  {feat:20s} : {coef:+.4f}")
print(f"  {'intercept':20s} : {model.intercept_:+.4f}")

# ── Save Model ───────────────────────────────────────────────────────────────
model_dir = os.path.join(os.path.dirname(__file__), 'model')
os.makedirs(model_dir, exist_ok=True)
model_path = os.path.join(model_dir, 'delivery_model.pkl')
joblib.dump(model, model_path)
print(f"\n[OK] Model saved to {model_path}")

# ── Quick sanity check ──────────────────────────────────────────────────────
print("\n── Sample Predictions ──")
test_cases = [
    [3.0, 15.0, 3],   # 3 km, 15 min prep, High traffic
    [5.0, 10.0, 1],   # 5 km, 10 min prep, Low traffic
    [10.0, 20.0, 2],  # 10 km, 20 min prep, Medium traffic
    [1.0, 5.0, 1],    # 1 km, 5 min prep, Low traffic
]
for tc in test_cases:
    pred = model.predict([tc])[0]
    traffic_label = {1: 'Low', 2: 'Medium', 3: 'High'}[tc[2]]
    print(f"  Dist={tc[0]:5.1f}km  Prep={tc[1]:4.0f}min  Traffic={traffic_label:6s}  → {pred:.1f} min")

print("\n[OK] Training complete!")
