# YATRA Backend - Setup & Run Guide

## Quick Start (5 minutes)

### 1. **Install Dependencies**
```bash
pip install -r requirements.txt
```

### 2. **Run the Backend**
```bash
python main.py
```

You should see:
```
🚀 YATRA Backend Starting...
📍 Supported cities: 10
✅ Journey engine ready
ℹ️  Mapbox not configured (set MAPBOX_ACCESS_TOKEN env var)

INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

### 3. **Test the API**

Open browser to: **http://localhost:8000/docs**

You'll see the interactive Swagger UI with all endpoints.

---

## File Structure

```
yatra-backend/
├── main.py                 # FastAPI application & all endpoints
├── models.py              # Pydantic data models
├── journey_engine.py      # Core journey planning logic
├── mock_data.py           # Mock transport data (20+ routes)
├── requirements.txt       # Python dependencies
├── SETUP.md              # This file
└── .env                  # (optional) Environment variables
```

---

## API Endpoints

### Health & Info
- `GET /` - API root
- `GET /health` - Health check
- `GET /api/info` - API capabilities

### Cities & Routes
- `GET /api/cities` - List all supported cities
- `GET /api/city/{city_name}` - Get city coordinates
- `GET /api/routes/{origin}/{destination}` - View available routes

### Journey Planning (Main)
- `POST /api/journey/plan` - **Main endpoint** - Plan a journey

### Utilities
- `POST /api/journey/parse-intent` - Parse natural language query
- `GET /api/journey/distance` - Get distance between cities
- `GET /api/journey/first-mile-estimate` - First-mile cost estimates

---

## Example Requests

### 1. Plan Journey (Natural Language)
```bash
curl -X POST "http://localhost:8000/api/journey/plan" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "I want to go from Gandhinagar to Delhi tomorrow evening, cheapest option"
  }'
```

### 2. Plan Journey (Structured)
```bash
curl -X POST "http://localhost:8000/api/journey/plan" \
  -H "Content-Type: application/json" \
  -d '{
    "origin": "Gandhinagar",
    "destination": "Delhi",
    "preferences": {
      "priority": "cheapest",
      "max_transfers": 2
    }
  }'
```

### 3. Get Available Routes
```bash
curl "http://localhost:8000/api/routes/Gandhinagar/Delhi"
```

### 4. Parse Intent
```bash
curl -X POST "http://localhost:8000/api/journey/parse-intent" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "I need to reach Mumbai by tomorrow morning, fast"
  }'
```

---

## Optional: Enable Mapbox Integration

### 1. **Get a Free Mapbox Token**
- Sign up at https://mapbox.com (free tier: 50k requests/month)
- Copy your access token

### 2. **Set Environment Variable**
```bash
export MAPBOX_ACCESS_TOKEN="your_token_here"
```

Or add to `.env` file:
```
MAPBOX_ACCESS_TOKEN=your_token_here
```

### 3. **Verify Integration**
Call the distance endpoint with `method=mapbox`:
```bash
curl "http://localhost:8000/api/journey/distance?origin=Gandhinagar&destination=Delhi&method=mapbox"
```

---

## Configuration

### Environment Variables
Create a `.env` file:
```
PORT=8000
MAPBOX_ACCESS_TOKEN=your_token_here
ENVIRONMENT=development
```

### Supported Cities (Default Mock Data)
- Gandhinagar
- Delhi
- Mumbai
- Bangalore
- Ahmedabad
- Chennai
- Kolkata
- Hyderabad
- Pune
- Jaipur

### Adding More Routes
Edit `mock_data.py` and add entries to `MOCK_ROUTES`:
```python
"YourCity->DestinationCity": {
    "train": [...],
    "flight": [...],
    "bus": [...]
}
```

---

## Testing

### Using Python Requests
```python
import requests

url = "http://localhost:8000/api/journey/plan"
payload = {
    "query": "I want to go from Gandhinagar to Delhi tomorrow evening, cheapest"
}
response = requests.post(url, json=payload)
print(response.json())
```

### Using Thunder Client / Postman
1. Import this collection:
   - Set URL: `http://localhost:8000/docs`
   - Browse to Swagger UI for interactive testing

---

## Response Format

Successful journey plan response:
```json
{
  "request": {
    "origin": "Gandhinagar",
    "destination": "Delhi",
    "date": "2026-09-11",
    "priority": "cheapest",
    "max_transfers": null,
    "raw_query": "...",
    "confidence": 0.95
  },
  "recommendations": [
    {
      "type": "cheapest",
      "journey": {
        "legs": [...],
        "total_cost": 450,
        "total_duration_minutes": 735,
        "total_transfers": 0,
        "departure_time": "2026-09-11T18:30:00",
        "arrival_time": "2026-09-12T06:15:00"
      },
      "score": 85.5,
      "explanation": "Lowest cost option at ₹450...",
      "rank": 1,
      "is_live": false,
      "data_source": "demo"
    },
    {
      "type": "fastest",
      "journey": {...},
      "score": 92.0,
      "explanation": "Quickest journey at 2h...",
      "rank": 2,
      "is_live": false,
      "data_source": "demo"
    },
    {
      "type": "best_overall",
      "journey": {...},
      "score": 88.0,
      "explanation": "Best balance of cost, time, and convenience...",
      "rank": 3,
      "is_live": false,
      "data_source": "demo"
    }
  ],
  "is_live": false,
  "data_source": "demo"
}
```

---

## Troubleshooting

### Port Already in Use
```bash
# Use different port
PORT=8001 python main.py
```

### Import Errors
```bash
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

### No Routes Found
- Check city names match exactly (case-sensitive in mock data)
- Add more routes to `mock_data.py`
- Verify cities are in `CITY_COORDINATES`

### Mapbox Returns Error
- Check token is valid
- Verify cities have lat/lon in `CITY_COORDINATES`
- Check rate limits (free tier: 50k/month)

---

## Next Steps (After SIH)

1. **Add Real Transport APIs**
   - IRCTC for trains
   - Skyscanner/Amadeus for flights
   - RedBus API for buses

2. **Add MongoDB**
   - Store user preferences
   - Save journey history
   - Implement user accounts

3. **Add Advanced Features**
   - Real-time vehicle tracking
   - Multi-stop journeys
   - CO2 emissions calculation
   - Weather-aware routing

4. **Production Deployment**
   - Railway.app / Render
   - AWS EC2 / ECS
   - Docker containerization

---

## Support

For issues or questions:
- Check Swagger docs: http://localhost:8000/docs
- Review mock_data.py for available routes
- Check console logs for errors

🚀 Happy journey planning!
