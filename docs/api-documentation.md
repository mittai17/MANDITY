# Mandity — API Documentation

The Mandity backend is a high-performance Python FastAPI service providing market intelligence, price predictions, and voice AI processing.

**Base URL:** `http://localhost:8000` (Local) / Configured cloud deployment

---

## 1. System Health

### `GET /health`
Returns service status, version, and whether Supabase is configured.

**Response:**
```json
{
  "status": "healthy",
  "service": "mandity-backend",
  "version": "1.0.0",
  "supabase_configured": false,
  "demo_mode": true
}
```

---

## 2. Market Intelligence

### `GET /api/crops`
List all supported crops with regional language translations.

**Response:**
```json
[
  {
    "id": "tomato",
    "name": "Tomato",
    "category": "Vegetables",
    "local_names": {
      "ta": "தக்காளி",
      "hi": "टमाटर",
      "te": "టొమాటో"
    },
    "is_active": true
  }
]
```

### `GET /api/markets`
List all mandi locations and coordinates.

### `GET /api/prices`
Query historical and current mandi prices.

**Parameters:**
- `crop_id` *(optional)*: Filter by crop (e.g., `tomato`)
- `market_id` *(optional)*: Filter by mandi (e.g., `chengalpattu`)
- `days` *(default: 7)*: Number of past observation days (1–90)

**Response:**
```json
[
  {
    "id": "tomato-chengalpattu-2026-11-24",
    "crop_id": "tomato",
    "market_id": "chengalpattu",
    "observation_date": "2026-11-24",
    "min_price": 20.40,
    "max_price": 27.60,
    "modal_price": 24.00,
    "unit": "kg",
    "source": "AGMARKNET (Demo)",
    "is_demo": true
  }
]
```

---

## 3. AI Forecasting

### `GET /api/forecast`
Get statistical price prediction for the next 7 days.

**Parameters:**
- `crop_id`: `tomato`
- `market_id`: `chengalpattu`

**Response:**
```json
{
  "crop_id": "tomato",
  "market_id": "chengalpattu",
  "forecast_date": "2026-12-01",
  "predicted_price": 26.50,
  "lower_estimate": 22.00,
  "upper_estimate": 31.00,
  "trend_direction": "rising",
  "model_version": "ridge-regression-v1",
  "uncertainty_note": "This is an estimate, not a guaranteed price.",
  "is_demo": true
}
```

---

## 4. Market Comparison & Net Proceeds

### `GET /api/comparison`
Compares nearby markets taking into account transport expenses.

**Formula:**
$$\text{Net Proceeds} = (\text{Modal Price} \times \text{Quantity}) - \text{Transport Cost}$$

**Parameters:**
- `crop_id`: `tomato`
- `quantity_kg`: `500`

**Response:**
```json
[
  {
    "market_id": "chengalpattu",
    "market_name": "Chengalpattu Mandi",
    "district": "Chengalpattu",
    "modal_price": 24.0,
    "estimated_distance_km": 18.0,
    "estimated_transport_cost": 81.0,
    "estimated_net_proceeds": 11919.0,
    "is_best_value": true,
    "observation_date": "2026-11-24"
  }
]
```

---

## 5. Multilingual Voice AI Assistant

### `POST /api/voice/query`
Processes farmer voice query transcript and returns ground-truth market explanation.

**Request:**
```json
{
  "transcript": "What is the tomato price today?",
  "language": "en"
}
```

**Response:**
```json
{
  "transcript": "What is the tomato price today?",
  "language": "en",
  "intent": "price_inquiry",
  "entities": {
    "crop": "tomato"
  },
  "response_text": "Today's modal price for Tomato is ₹24/kg in Chengalpattu (Min: ₹20, Max: ₹28/kg). Prices are up 4% compared to yesterday.",
  "data_retrieved": {
    "modal_price": 24.0,
    "crop": "tomato"
  },
  "is_demo": true
}
```
