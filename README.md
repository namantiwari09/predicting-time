# 🍕 FoodTime AI — Food Delivery Time Prediction

A full-stack web application that predicts food delivery time using **Machine Learning**, **Google Maps API**, **React JS**, and **Flask Python**.

## 🎯 What It Does

Users enter restaurant location, delivery location, preparation time, and traffic level. The system:
1. Fetches real distance data via **Google Maps Distance Matrix API**
2. Processes features (distance, prep time, traffic level)
3. Feeds them into a trained **Linear Regression** model
4. Returns an accurate delivery time estimate in minutes

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React JS (Vite) |
| Backend | Flask (Python) |
| ML Model | Scikit-learn (Linear Regression) |
| Maps API | Google Maps Distance Matrix API |
| Styling | Vanilla CSS (Dark theme, Glassmorphism) |

## 📁 Project Structure

```
food/
├── backend/
│   ├── app.py              # Flask API server
│   ├── train_model.py      # ML model training script
│   ├── requirements.txt    # Python dependencies
│   └── model/
│       └── delivery_model.pkl  # Trained ML model
├── frontend/
│   ├── src/
│   │   ├── App.jsx         # Main app component
│   │   ├── App.css
│   │   ├── index.css       # Design system (CSS variables)
│   │   ├── main.jsx
│   │   └── components/
│   │       ├── Navbar.jsx/css
│   │       ├── Hero.jsx/css
│   │       ├── PredictionForm.jsx/css
│   │       ├── ResultCard.jsx/css
│   │       ├── HowItWorks.jsx/css
│   │       └── Footer.jsx/css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🚀 How to Run

### 1. Backend (Flask)

```bash
cd backend
pip install -r requirements.txt
python train_model.py      # Train the ML model (one-time)
python app.py              # Start Flask server on port 5000
```

### 2. Frontend (React)

```bash
cd frontend
npm install
npm run dev                # Start Vite dev server on port 5173
```

### 3. Open in browser

Visit **http://localhost:5173**

## 🗺️ Google Maps API Setup (Optional)

To use real Google Maps distance data instead of the fallback estimator:

1. Get a Google Maps API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the **Distance Matrix API**
3. Set the environment variable before running the backend:

```bash
# Windows
set GOOGLE_MAPS_API_KEY=your_api_key_here

# Linux / Mac
export GOOGLE_MAPS_API_KEY=your_api_key_here
```

> **Note:** The app works without a Google Maps API key using a deterministic fallback distance estimator. Setting up the API key gives you real-world distances.

## 🤖 ML Model Details

- **Algorithm:** Linear Regression (Scikit-learn)
- **Features:** distance_km, prep_time_min, traffic_level (1=Low, 2=Medium, 3=High)
- **Target:** delivery_time_min
- **Training data:** 2000 synthetic samples with realistic delivery patterns
- **Performance:** ~3-5 min MAE, R² ≈ 0.95+

## 📸 Example Prediction

| Input | Value |
|-------|-------|
| Restaurant | Bhopal MP Nagar |
| Delivery Location | Bhopal Arera Colony |
| Prep Time | 15 minutes |
| Traffic | High |
| **Predicted Time** | **~60 minutes** |

## 🏗️ Architecture

```
User Browser → React Frontend → Flask Backend → Google Maps API
                                             → ML Model
                                             → Predicted Time
                                             → Response → React UI
```
