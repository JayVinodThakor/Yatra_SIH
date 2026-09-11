"""
YATRA Backend - Intelligent Journey Planning System
FastAPI application with all endpoints
"""

import os
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from httpx import request
from route_service import get_coordinates_from_place, get_route_geometry
import uvicorn

from models import (
    JourneyPlanRequest, JourneyPlanResponse, ErrorResponse,
    TravelIntent, Location
)
from journey_engine import JourneyEngine
from mock_data import CITY_COORDINATES, get_route
from nlp_parser import parse_journey_query
from yatra_data import get_journey  # 👉 YAHAN NAYA DATASET IMPORT KIYA HAI

# Initialize FastAPI
app = FastAPI(
    title="YATRA - Intelligent Journey Planner",
    description="AI-powered multi-modal journey planning system for India",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize journey engine (Mapbox removed, set to False)
engine = JourneyEngine(use_mapbox=False)
ORS_TOKEN = os.getenv("ORS_API_KEY", None)

# ============================================================================
# HEALTH & INFO ENDPOINTS
# ============================================================================

@app.get("/")
async def root():
    """API root endpoint"""
    return {
        "name": "YATRA",
        "version": "1.0.0",
        "description": "Intelligent Journey Planning System",
        "docs": "/docs",
        "status": "operational"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "YATRA Backend",
        "timestamp": str(__import__('datetime').datetime.now().isoformat())
    }

@app.get("/api/info")
async def api_info():
    """API information and capabilities"""
    return {
        "name": "YATRA Journey Planner",
        "version": "1.0.0",
        "capabilities": {
            "natural_language_queries": "Parse natural language travel intent",
            "multimodal_planning": "Train, Flight, Bus, Cab support",
            "cost_optimization": "Find cheapest, fastest, best-balanced routes",
            "demo_data": "Using realistic mock Indian transport data",
            "api_support": "OpenRouteService (ORS)"
        },
        "supported_cities": list(CITY_COORDINATES.keys()),
        "data_source": "demo",
        "is_live": False
    }

# ============================================================================
# CITIES & ROUTES ENDPOINTS
# ============================================================================

@app.get("/api/cities")
async def get_cities():
    """Get all supported cities"""
    cities = list(CITY_COORDINATES.keys())
    return {
        "cities": cities,
        "count": len(cities),
        "status": "operational"
    }

@app.get("/api/city/{city_name}")
async def get_city_info(city_name: str):
    """Get information about a specific city"""
    city_coords = CITY_COORDINATES.get(city_name)
    if not city_coords:
        raise HTTPException(
            status_code=404,
            detail=f"City '{city_name}' not found"
        )
    
    return {
        "city": city_name,
        "latitude": city_coords["lat"],
        "longitude": city_coords["lon"],
        "coordinates": city_coords
    }

@app.get("/api/routes/{origin}/{destination}")
async def get_available_routes(origin: str, destination: str):
    """Get available transport routes between two cities"""
    routes = get_route(origin, destination)
    
    if not routes:
        raise HTTPException(
            status_code=404,
            detail=f"No routes found from {origin} to {destination}"
        )
    
    # Format response
    formatted_routes = {}
    for mode, options in routes.items():
        formatted_routes[mode] = {
            "count": len(options),
            "options": options
        }
    
    return {
        "origin": origin,
        "destination": destination,
        "routes": formatted_routes,
        "total_options": sum(r["count"] for r in formatted_routes.values()),
        "data_source": "demo"
    }

# ============================================================================
# MAIN JOURNEY PLANNING ENDPOINT
# ============================================================================

@app.post("/api/journey/plan", response_model=JourneyPlanResponse)
async def plan_journey(request: JourneyPlanRequest):
    """
    Main endpoint: Plan a journey from origin to destination
    """
    try:
        travel_intent = engine.parse_travel_intent(
            query=request.query,
            origin=request.origin,
            destination=request.destination,
            preferences=request.preferences
        )
        
        if not travel_intent.origin or not travel_intent.destination:
            raise HTTPException(
                status_code=400,
                detail="Origin and destination are required"
            )
        
        recommendations = engine.plan_journey(travel_intent)
        
        if not recommendations:
            raise HTTPException(
                status_code=404,
                detail=f"No routes found from {travel_intent.origin} to {travel_intent.destination}"
            )
        
        response = JourneyPlanResponse(
            request=travel_intent,
            recommendations=recommendations,
            is_live=False,
            data_source="demo",
            message=f"Found {len(recommendations)} journey options"
        )
        
        return response
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Journey planning error: {str(e)}"
        )

# ============================================================================
# DETAILED JOURNEY ENDPOINTS
# ============================================================================

# 👉 NAYA MASTER ENDPOINT YAHAN HAI (NLP + Mock Data + ORS) 👈
@app.post("/api/journey/complete-plan")
async def complete_journey_plan(request: JourneyPlanRequest):
    """
    Master Endpoint: Combines Gemini NLP, yatra_data (fares/timings), 
    and OpenRouteService (live coordinates/mapping).
    """
    try:
        if not request.query:
            return {"success": False, "error": "Please provide a search query."}
        parsed_intent = parse_journey_query(request.query)

        origin = request.origin or parsed_intent.get("origin")
        destination = request.destination or parsed_intent.get("destination")
        
        if not origin or not destination:
            return {"success": False, "error": "Could not understand origin or destination from query."}
            
        # Step B: yatra_data.py se fares aur schedule nikalna
        # Safely read the preferences sent by the frontend.
        preferences = request.preferences or {}

        preference = preferences.get("preference", "Balanced")
        transport = preferences.get("transport", "Any mode")
        trip_type = preferences.get("tripType", "One way")

        # Frontend sends values such as "2 Passengers".
        # Convert that safely into an integer for yatra_data.py.
        raw_passengers = preferences.get("passengers", 1)

        try:
            if isinstance(raw_passengers, str):
                passengers = int(raw_passengers.strip().split()[0])
            else:
                passengers = int(raw_passengers)
        except (ValueError, TypeError):
            passengers = 1

        passengers = max(1, passengers)

        journey_data = get_journey(
            origin=origin,
            destination=destination,
            preference=preference,
            transport=transport,
            passengers=passengers,
            trip_type=trip_type
        )
        
        # Step C: OpenRouteService se live map route nikalna
        origin_coords = get_coordinates_from_place(origin)
        dest_coords = get_coordinates_from_place(destination)
        
        route_geometry = None
        if origin_coords and dest_coords:
            route_geometry = get_route_geometry(origin_coords, dest_coords)
            
        # Step D: Sabko combine karke return karna
        return {
            "success": True,
            "original_query": request.query,
            "parsed_route": {
                "origin": origin,
                "destination": destination
            },
            "journey_details": journey_data,
            "map_details": {
                "origin_coords": origin_coords,
                "destination_coords": dest_coords,
                "route_geometry": route_geometry
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unified planning error: {str(e)}")

@app.post("/api/journey/gemini-nlp")
async def run_gemini_nlp(request: JourneyPlanRequest):
    """
    Test endpoint for our new Bulletproof Gemini NLP Parser
    """
    try:
        if not request.query:
            raise HTTPException(status_code=400, detail="Query string is required")
        
        parsed_data = parse_journey_query(request.query)
        
        return {
            "success": True,
            "source": "gemini_nlp_parser",
            "parsed_intent": parsed_data
        }
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"NLP parsing failed: {str(e)}"
        )

@app.post("/api/journey/parse-intent")
async def parse_intent(request: JourneyPlanRequest):
    """
    Parse a natural language query into structured travel intent
    """
    try:
        intent = engine.parse_travel_intent(
            query=request.query,
            origin=request.origin,
            destination=request.destination,
            preferences=request.preferences
        )
        
        return {
            "intent": intent,
            "confidence": intent.confidence,
            "parsed_successfully": bool(intent.origin and intent.destination)
        }
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Intent parsing error: {str(e)}"
        )

@app.get("/api/journey/route-map")
async def get_journey_route(origin: str, destination: str):
    # 1. Coordinates nikalo
    origin_coords = get_coordinates_from_place(origin)
    dest_coords = get_coordinates_from_place(destination)
    
    if not origin_coords or not dest_coords:
        return {"success": False, "error": "Location samajh nahi aayi, please sahi naam daalein."}
        
    # 2. Rasta fetch karo
    route_data = get_route_geometry(origin_coords, dest_coords)
    
    if not route_data:
        return {"success": False, "error": "Route nahi mil paya."}
    
    return {
        "success": True,
        "origin": origin,
        "destination": destination,
        "origin_coords": origin_coords,
        "destination_coords": dest_coords,
        "route_details": route_data
    }

@app.get("/api/journey/first-mile-estimate")
async def first_mile_estimate(
    origin_city: str = Query(..., description="Origin city"),
    destination_city: str = Query(..., description="Destination city")
):
    """Estimate first-mile (home to station) costs and time"""
    estimate = engine.estimate_first_last_mile(origin_city, destination_city)
    return {
        "origin_city": origin_city,
        "destination_city": destination_city,
        "first_mile": estimate,
        "method": "estimation",
        "currency": "INR"
    }

@app.get("/api/journey/distance")
async def get_distance(
    origin: str = Query(..., description="Origin city"),
    destination: str = Query(..., description="Destination city"),
    method: str = Query("estimate", description="osm, or estimate")
):
    """
    Get distance between two cities (Mapbox removed, using estimate/osm)
    """
    if method == "osm":
        result = engine.get_distance_via_osm(origin, destination)
    else:
        # Fallback to coordinate distance
        origin_coords = CITY_COORDINATES.get(origin)
        dest_coords = CITY_COORDINATES.get(destination)
        
        if not origin_coords or not dest_coords:
            raise HTTPException(status_code=404, detail="City not found")
        
        # Simple Haversine distance (rough estimate)
        import math
        lat1, lon1 = origin_coords["lat"], origin_coords["lon"]
        lat2, lon2 = dest_coords["lat"], dest_coords["lon"]
        
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2)**2
        c = 2 * math.asin(math.sqrt(a))
        km = 6371 * c
        
        result = {
            "distance_km": round(km, 2),
            "duration_minutes": round(km / 60 * 60),  # Rough estimate
            "source": "coordinate_estimate"
        }
    
    if not result:
        raise HTTPException(
            status_code=500,
            detail=f"Distance calculation failed using {method}"
        )
    
    return {
        "origin": origin,
        "destination": destination,
        "distance": result,
        "method": method
    }

# ============================================================================
# ERROR HANDLING
# ============================================================================

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Custom HTTP exception handler"""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.detail,
            "status_code": exc.status_code,
            "type": "http_exception"
        },
    )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """Handle unexpected exceptions"""
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "details": str(exc),
            "status_code": 500,
            "type": "internal_error"
        },
    )

# ============================================================================
# STARTUP & SHUTDOWN
# ============================================================================

@app.on_event("startup")
async def startup_event():
    """Initialize on startup"""
    print("🚀 YATRA Backend Starting...")
    print(f"📍 Supported cities: {len(CITY_COORDINATES)}")
    print("✅ Journey engine ready")
    if ORS_TOKEN:
        print("🗺️  OpenRouteService (ORS) integration enabled")
    else:
        print("ℹ️  ORS not configured (set ORS_API_KEY env var)")

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    print("🛑 YATRA Backend Shutting Down...")

# ============================================================================
# MAIN
# ============================================================================

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    
    print(f"Starting YATRA Backend on port {port}...")
    print(f"📚 Swagger UI: http://localhost:{port}/docs")
    print(f"📖 ReDoc: http://localhost:{port}/redoc")
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True,
        log_level="info"
    )