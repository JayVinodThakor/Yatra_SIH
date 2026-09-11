"""
YATRA Data Models - Pydantic schemas for type safety
"""
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum


class TransportMode(str, Enum):
    """Supported transport modes"""
    TRAIN = "train"
    FLIGHT = "flight"
    BUS = "bus"
    CAB = "cab"
    AUTO = "auto"
    WALK = "walk"


class RecommendationType(str, Enum):
    """Types of journey recommendations"""
    CHEAPEST = "cheapest"
    FASTEST = "fastest"
    BEST_OVERALL = "best_overall"
    MOST_COMFORTABLE = "most_comfortable"


class Location(BaseModel):
    """Represents a geographic location"""
    name: str = Field(..., description="City or place name")
    latitude: Optional[float] = Field(None, description="Latitude coordinate")
    longitude: Optional[float] = Field(None, description="Longitude coordinate")
    
    class Config:
        schema_extra = {
            "example": {
                "name": "Gandhinagar",
                "latitude": 23.2156,
                "longitude": 72.6369
            }
        }


class TransportOption(BaseModel):
    """Single transport option (e.g., one train service)"""
    mode: TransportMode
    provider: str = Field(..., description="Company name (e.g., 'Indian Railways')")
    provider_id: Optional[str] = Field(None, description="Unique ID from provider API")
    
    # Journey details
    departure_time: str = Field(..., description="ISO 8601 format")
    arrival_time: str = Field(..., description="ISO 8601 format")
    duration_minutes: int
    
    # Cost & availability
    cost: int = Field(..., description="Cost in INR")
    currency: str = "INR"
    seats_available: Optional[int] = None
    
    # Classification
    comfort_level: Optional[str] = None  # economy, standard, premium, etc.
    vehicle_type: Optional[str] = None  # train name, flight model, bus type
    
    # Stops
    stops: Optional[int] = None  # number of stops/changes
    
    class Config:
        schema_extra = {
            "example": {
                "mode": "train",
                "provider": "Indian Railways",
                "departure_time": "2026-09-11T18:30:00",
                "arrival_time": "2026-09-12T06:15:00",
                "duration_minutes": 735,
                "cost": 450,
                "vehicle_type": "12958 ADI-NDLS SF",
                "stops": 0
            }
        }


class JourneyLeg(BaseModel):
    """Single leg of a journey (e.g., train from A to B)"""
    mode: TransportMode
    provider: str
    
    from_location: str
    to_location: str
    
    departure_time: str
    arrival_time: str
    duration_minutes: int
    
    cost: int
    currency: str = "INR"
    
    vehicle_type: Optional[str] = None
    stops: Optional[int] = 0
    
    class Config:
        schema_extra = {
            "example": {
                "mode": "train",
                "provider": "Indian Railways",
                "from_location": "Gandhinagar",
                "to_location": "Delhi",
                "departure_time": "2026-09-11T18:30:00",
                "arrival_time": "2026-09-12T06:15:00",
                "duration_minutes": 735,
                "cost": 450
            }
        }


class Journey(BaseModel):
    """Complete journey from origin to destination"""
    legs: List[JourneyLeg]
    
    total_cost: int
    total_duration_minutes: int
    total_transfers: int
    
    departure_time: str  # First leg departure
    arrival_time: str    # Last leg arrival
    
    summary: Optional[str] = None
    
    class Config:
        schema_extra = {
            "example": {
                "legs": [],
                "total_cost": 450,
                "total_duration_minutes": 735,
                "total_transfers": 0,
                "departure_time": "2026-09-11T18:30:00",
                "arrival_time": "2026-09-12T06:15:00",
                "summary": "Direct train journey"
            }
        }


class Recommendation(BaseModel):
    """Journey recommendation with reasoning"""
    type: RecommendationType
    journey: Journey
    score: float = Field(..., ge=0, le=100, description="Score 0-100")
    explanation: str = Field(..., description="Why this route was recommended")
    
    # Metadata
    rank: Optional[int] = None
    is_live: bool = False  # True if using real API data
    data_source: str = "demo"
    
    class Config:
        schema_extra = {
            "example": {
                "type": "cheapest",
                "journey": {},
                "score": 85.5,
                "explanation": "Lowest cost option at ₹450 with good timing",
                "is_live": False,
                "data_source": "demo"
            }
        }


class TravelIntent(BaseModel):
    """Extracted travel intent from natural language"""
    origin: str
    destination: str
    date: Optional[str] = None
    departure_time: Optional[str] = None
    arrival_time: Optional[str] = None
    
    # Preferences
    priority: str = "balanced"  # cheapest, fastest, balanced, comfortable
    max_transfers: Optional[int] = None
    preferred_modes: Optional[List[TransportMode]] = None
    budget: Optional[int] = None
    
    # Extracted from query
    raw_query: Optional[str] = None
    confidence: float = Field(default=1.0, ge=0, le=1)
    
    class Config:
        schema_extra = {
            "example": {
                "origin": "Gandhinagar",
                "destination": "Delhi",
                "date": "2026-09-11",
                "priority": "cheapest",
                "max_transfers": 2,
                "raw_query": "I want to go from Gandhinagar to Delhi tomorrow evening, cheapest option",
                "confidence": 0.95
            }
        }


class JourneyPlanRequest(BaseModel):
    """Request to plan a journey"""
    query: Optional[str] = Field(None, description="Natural language query")
    
    # Or structured input
    origin: Optional[str] = None
    destination: Optional[str] = None
    date: Optional[str] = None
    
    # Preferences
    preferences: Optional[Dict[str, Any]] = Field(
        default_factory=dict,
        description="priority, max_transfers, budget, etc."
    )
    
    class Config:
        schema_extra = {
            "example": {
                "query": "I want to go from Gandhinagar to Delhi tomorrow evening, cheapest option",
                "preferences": {
                    "priority": "cheapest",
                    "max_transfers": 2
                }
            }
        }


class JourneyPlanResponse(BaseModel):
    """Response with journey recommendations"""
    request: TravelIntent
    recommendations: List[Recommendation] = Field(
        ..., 
        description="Sorted by relevance to user preference"
    )
    
    # Data quality
    is_live: bool = False
    data_source: str = "demo"
    message: Optional[str] = None
    
    class Config:
        schema_extra = {
            "example": {
                "request": {},
                "recommendations": [],
                "is_live": False,
                "data_source": "demo"
            }
        }


class ErrorResponse(BaseModel):
    """Standard error response"""
    error: str
    details: Optional[str] = None
    status_code: int
