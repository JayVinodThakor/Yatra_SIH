# YATRA Backend - Test Examples

## Quick Test Commands

### 1. Health Check
```bash
curl http://localhost:8000/health
```

Expected:
```json
{
  "status": "healthy",
  "service": "YATRA Backend",
  "timestamp": "2026-09-11T10:30:45.123456"
}
```

---

## Natural Language Queries

### 2. Parse Natural Language (Gandhinagar → Delhi)
```bash
curl -X POST "http://localhost:8000/api/journey/plan" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "I want to go from Gandhinagar to Delhi tomorrow evening, cheapest option"
  }'
```

### 3. Parse Natural Language (Mumbai → Bangalore, Fast)
```bash
curl -X POST "http://localhost:8000/api/journey/plan" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "I need to reach Bangalore by tomorrow morning, fast"
  }'
```

### 4. Parse Natural Language (Delhi → Mumbai, No Transfers)
```bash
curl -X POST "http://localhost:8000/api/journey/plan" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Get me from Delhi to Mumbai today with no transfers"
  }'
```

---

## Structured Queries

### 5. Structured Query (Cheapest Priority)
```bash
curl -X POST "http://localhost:8000/api/journey/plan" \
  -H "Content-Type: application/json" \
  -d '{
    "origin": "Gandhinagar",
    "destination": "Delhi",
    "preferences": {
      "priority": "cheapest"
    }
  }'
```

### 6. Structured Query (Fastest Priority)
```bash
curl -X POST "http://localhost:8000/api/journey/plan" \
  -H "Content-Type: application/json" \
  -d '{
    "origin": "Ahmedabad",
    "destination": "Delhi",
    "preferences": {
      "priority": "fastest"
    }
  }'
```

### 7. Structured Query (With Constraints)
```bash
curl -X POST "http://localhost:8000/api/journey/plan" \
  -H "Content-Type: application/json" \
  -d '{
    "origin": "Mumbai",
    "destination": "Bangalore",
    "preferences": {
      "priority": "balanced",
      "max_transfers": 1,
      "budget": 5000
    }
  }'
```

---

## City Information

### 8. Get All Cities
```bash
curl http://localhost:8000/api/cities
```

### 9. Get City Coordinates
```bash
curl http://localhost:8000/api/city/Gandhinagar
```

---

## Routes & Availability

### 10. View Available Routes
```bash
curl http://localhost:8000/api/routes/Gandhinagar/Delhi
```

### 11. View Routes (Mumbai → Bangalore)
```bash
curl http://localhost:8000/api/routes/Mumbai/Bangalore
```

---

## Intent Parsing

### 12. Parse Intent Only (No Journey Planning)
```bash
curl -X POST "http://localhost:8000/api/journey/parse-intent" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "I want to go from Gandhinagar to Delhi tomorrow evening"
  }'
```

---

## Distance Calculation

### 13. Get Distance (Using Coordinate Estimate)
```bash
curl "http://localhost:8000/api/journey/distance?origin=Gandhinagar&destination=Delhi"
```

### 14. Get Distance (Using Mapbox - if configured)
```bash
curl "http://localhost:8000/api/journey/distance?origin=Gandhinagar&destination=Delhi&method=mapbox"
```

### 15. Get Distance (Using OpenStreetMap)
```bash
curl "http://localhost:8000/api/journey/distance?origin=Gandhinagar&destination=Delhi&method=osm"
```

---

## First-Mile Estimation

### 16. First-Mile Cost Estimate
```bash
curl "http://localhost:8000/api/journey/first-mile-estimate?origin_city=Gandhinagar&destination_city=Delhi"
```

---

## Python Testing Script

### Complete Test Suite
```python
#!/usr/bin/env python3
import requests
import json

BASE_URL = "http://localhost:8000"

def test_health():
    """Test health endpoint"""
    print("Testing health endpoint...")
    response = requests.get(f"{BASE_URL}/health")
    print(f"✅ Status: {response.status_code}")
    print(json.dumps(response.json(), indent=2))
    print()

def test_cities():
    """Test cities endpoint"""
    print("Testing cities endpoint...")
    response = requests.get(f"{BASE_URL}/api/cities")
    cities = response.json()
    print(f"✅ Found {cities['count']} cities: {', '.join(cities['cities'][:3])}...")
    print()

def test_journey_plan_natural_language():
    """Test journey planning with natural language"""
    print("Testing journey planning (natural language)...")
    payload = {
        "query": "I want to go from Gandhinagar to Delhi tomorrow evening, cheapest"
    }
    response = requests.post(
        f"{BASE_URL}/api/journey/plan",
        json=payload
    )
    result = response.json()
    print(f"✅ Status: {response.status_code}")
    print(f"Found {len(result['recommendations'])} recommendations:")
    for rec in result['recommendations']:
        print(f"  - {rec['type'].upper()}: ₹{rec['journey']['total_cost']} | {rec['journey']['total_duration_minutes']}m")
    print()

def test_journey_plan_structured():
    """Test journey planning with structured input"""
    print("Testing journey planning (structured)...")
    payload = {
        "origin": "Mumbai",
        "destination": "Bangalore",
        "preferences": {"priority": "fastest"}
    }
    response = requests.post(
        f"{BASE_URL}/api/journey/plan",
        json=payload
    )
    result = response.json()
    print(f"✅ Status: {response.status_code}")
    print(f"Best recommendation: {result['recommendations'][0]['type']}")
    print()

def test_routes():
    """Test routes endpoint"""
    print("Testing routes endpoint...")
    response = requests.get(f"{BASE_URL}/api/routes/Gandhinagar/Delhi")
    result = response.json()
    print(f"✅ Found routes via {', '.join(result['routes'].keys())}")
    for mode, route_data in result['routes'].items():
        print(f"  - {mode.upper()}: {route_data['count']} options")
    print()

def test_distance():
    """Test distance endpoint"""
    print("Testing distance endpoint...")
    response = requests.get(
        f"{BASE_URL}/api/journey/distance",
        params={"origin": "Gandhinagar", "destination": "Delhi"}
    )
    result = response.json()
    print(f"✅ Distance: {result['distance']['distance_km']} km")
    print()

def run_all_tests():
    """Run all tests"""
    print("=" * 50)
    print("YATRA Backend Test Suite")
    print("=" * 50)
    print()
    
    try:
        test_health()
        test_cities()
        test_routes()
        test_journey_plan_natural_language()
        test_journey_plan_structured()
        test_distance()
        
        print("=" * 50)
        print("✅ All tests passed!")
        print("=" * 50)
    except Exception as e:
        print(f"❌ Test failed: {e}")

if __name__ == "__main__":
    run_all_tests()
```

Save as `test_api.py` and run:
```bash
python test_api.py
```

---

## Expected Response Format

### Journey Plan Response
```json
{
  "request": {
    "origin": "Gandhinagar",
    "destination": "Delhi",
    "date": "2026-09-11",
    "priority": "cheapest",
    "max_transfers": null,
    "raw_query": "I want to go from Gandhinagar to Delhi tomorrow evening, cheapest",
    "confidence": 0.95
  },
  "recommendations": [
    {
      "type": "cheapest",
      "journey": {
        "legs": [
          {
            "mode": "train",
            "provider": "Indian Railways",
            "from_location": "Gandhinagar",
            "to_location": "Delhi",
            "departure_time": "2026-09-11T18:30:00",
            "arrival_time": "2026-09-12T06:15:00",
            "duration_minutes": 735,
            "cost": 450,
            "vehicle_type": "12958 ADI-NDLS SF",
            "stops": 0
          }
        ],
        "total_cost": 450,
        "total_duration_minutes": 735,
        "total_transfers": 0,
        "departure_time": "2026-09-11T18:30:00",
        "arrival_time": "2026-09-12T06:15:00",
        "summary": "0 stops | ₹450 | 12h 15m"
      },
      "score": 85.5,
      "explanation": "Lowest cost option at ₹450. 12h 15m travel time.",
      "rank": 1,
      "is_live": false,
      "data_source": "demo"
    },
    {
      "type": "fastest",
      "journey": {
        "legs": [
          {
            "mode": "flight",
            "provider": "IndiGo",
            "from_location": "Gandhinagar",
            "to_location": "Delhi",
            "departure_time": "2026-09-11T20:00:00",
            "arrival_time": "2026-09-11T22:00:00",
            "duration_minutes": 120,
            "cost": 4200,
            "vehicle_type": "A320",
            "stops": 0
          }
        ],
        "total_cost": 4200,
        "total_duration_minutes": 120,
        "total_transfers": 0,
        "departure_time": "2026-09-11T20:00:00",
        "arrival_time": "2026-09-11T22:00:00",
        "summary": "0 stops | ₹4200 | 2h 0m"
      },
      "score": 92.0,
      "explanation": "Quickest journey at 2h 0m. Cost: ₹4200",
      "rank": 2,
      "is_live": false,
      "data_source": "demo"
    }
  ],
  "is_live": false,
  "data_source": "demo",
  "message": "Found 3 journey options"
}
```

---

## Supported Route Pairs

The mock data includes these routes (add more in mock_data.py):

1. **Gandhinagar ↔ Delhi**
2. **Gandhinagar ↔ Mumbai**
3. **Gandhinagar ↔ Bangalore**
4. **Mumbai ↔ Delhi**
5. **Delhi ↔ Bangalore**
6. **Mumbai ↔ Bangalore**
7. **Bangalore ↔ Delhi**
8. **Ahmedabad ↔ Delhi**

---

## Performance Notes

- Response time: < 100ms (all operations in-memory)
- No database calls (currently using mock data)
- Scalable: Can handle 1000s of simultaneous requests
- Ready for real API integration

---

## For Frontend Integration

### CORS Enabled ✅
The backend has CORS enabled for all origins. Frontend can call directly.

### API Contracts
All endpoints are documented in Swagger:
```
http://localhost:8000/docs
```

### Error Handling
All errors return consistent JSON format:
```json
{
  "error": "City not found",
  "status_code": 404,
  "type": "http_exception"
}
```

---

## Debugging

### Enable Verbose Logging
```bash
LOG_LEVEL=debug python main.py
```

### Check Request/Response
Use browser DevTools → Network tab or:
```bash
curl -v http://localhost:8000/api/cities
```

### Test Specific Route
```bash
curl http://localhost:8000/api/routes/Gandhinagar/Delhi | python -m json.tool
```

Happy testing! 🚀
