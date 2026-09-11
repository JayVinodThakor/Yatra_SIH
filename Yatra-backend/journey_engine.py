"""
YATRA Journey Engine
Core logic for journey planning, optimization, and scoring
"""

import re
from typing import List, Dict, Tuple, Optional
from datetime import datetime, timedelta
from unittest import result
from models import (
    Journey, JourneyLeg, Recommendation, TravelIntent,
    TransportMode, RecommendationType
)
from mock_data import get_route, get_city_coordinates, CITY_COORDINATES
import requests
from difflib import SequenceMatcher


class QueryParser:
    """Parse natural language queries into structured travel intent"""
    
    @staticmethod
    def parse_query(query: str) -> Dict:
        """Extract origin, destination, date, time from natural language query"""
        query_lower = query.lower()
        result = {}
        
        # Extract origin
        if "from" in query_lower:
            from_match = re.search(r'from\s+([a-zA-Z\s]+?)(?:\s+to|\s+by|\s+on|$)', query_lower)
            if from_match:
                result["origin"] = from_match.group(1).strip().title()
        
        # Extract destination
        to_matches = re.findall(r'\bto\s+([a-zA-Z]+(?:\s+[a-zA-Z]+)*?)(?=\s+(?:on|by|tomorrow|today|this|next|around|at)|[,.]|$)', query_lower)

        if to_matches:
            result["destination"] = to_matches[-1].strip().title()
        
        # Extract time preference
        if "evening" in query_lower:
            result["time_preference"] = "evening"
        elif "morning" in query_lower:
            result["time_preference"] = "morning"
        elif "night" in query_lower:
            result["time_preference"] = "night"
        elif "afternoon" in query_lower:
            result["time_preference"] = "afternoon"
        
        # Extract priority
        if "cheap" in query_lower:
            result["priority"] = "cheapest"
        elif "fast" in query_lower:
            result["priority"] = "fastest"
        elif "comfortable" in query_lower or "comfort" in query_lower:
            result["priority"] = "most_comfortable"
        else:
            result["priority"] = "balanced"
        
        # Extract date
        if "tomorrow" in query_lower:
            tomorrow = datetime.now() + timedelta(days=1)
            result["date"] = tomorrow.strftime("%Y-%m-%d")
        elif "today" in query_lower:
            result["date"] = datetime.now().strftime("%Y-%m-%d")
        elif "day after" in query_lower:
            day_after = datetime.now() + timedelta(days=2)
            result["date"] = day_after.strftime("%Y-%m-%d")
        
        # Extract max transfers
        if "no transfer" in query_lower or "direct" in query_lower:
            result["max_transfers"] = 0
        elif "one transfer" in query_lower:
            result["max_transfers"] = 1
        elif "two transfer" in query_lower:
            result["max_transfers"] = 2
        
        return result
    
    @staticmethod
    def find_closest_city(query_city: str, available_cities: List[str]) -> Optional[str]:
        """Find closest matching city name using fuzzy matching"""
        if not query_city or not available_cities:
            return None
        
        best_match = None
        best_ratio = 0.6
        
        for city in available_cities:
            ratio = SequenceMatcher(None, query_city.lower(), city.lower()).ratio()
            if ratio > best_ratio:
                best_ratio = ratio
                best_match = city
        
        return best_match


class JourneyEngine:
    """Main journey planning engine"""
    
    def __init__(self, use_mapbox: bool = False, mapbox_token: Optional[str] = None):
        self.parser = QueryParser()
        self.use_mapbox = use_mapbox
        self.mapbox_token = mapbox_token
        self.available_cities = list(CITY_COORDINATES.keys())
    
    def parse_travel_intent(self, query: Optional[str], origin: Optional[str], 
                           destination: Optional[str], preferences: Optional[Dict]) -> TravelIntent:
        """Convert input to structured TravelIntent"""
        
        parsed = {}
        if query:
            parsed = self.parser.parse_query(query)
        
        # Override with explicit parameters
        if origin:
            parsed["origin"] = origin.title()
        if destination:
            parsed["destination"] = destination.title()
        
        # Fuzzy match to available cities
        origin_city = parsed.get("origin")
        dest_city = parsed.get("destination")
        
        if origin_city:
            matched_origin = self.parser.find_closest_city(origin_city, self.available_cities)
            if matched_origin:
                parsed["origin"] = matched_origin
        
        if dest_city:
            matched_dest = self.parser.find_closest_city(dest_city, self.available_cities)
            if matched_dest:
                parsed["destination"] = matched_dest
        
        # Merge preferences
        if preferences:
            parsed.update(preferences)
        
        # Create TravelIntent
        intent = TravelIntent(
            origin=parsed.get("origin", ""),
            destination=parsed.get("destination", ""),
            date=parsed.get("date", datetime.now().strftime("%Y-%m-%d")),
            priority=parsed.get("priority", "balanced"),
            max_transfers=parsed.get("max_transfers"),
            raw_query=query,
            confidence=0.95 if query else 1.0
        )
        
        return intent
    
    def find_routes(self, origin: str, destination: str) -> Dict:
        """Fetch available routes from mock data"""
        return get_route(origin, destination)
    
    def build_journey_leg(self, transport_option: Dict, origin: str, destination: str) -> JourneyLeg:
        """Convert transport option to JourneyLeg"""
        return JourneyLeg(
            mode=transport_option["mode"],
            provider=transport_option["provider"],
            from_location=origin,
            to_location=destination,
            departure_time=transport_option["departure_time"],
            arrival_time=transport_option["arrival_time"],
            duration_minutes=transport_option["duration_minutes"],
            cost=transport_option["cost"],
            vehicle_type=transport_option.get("vehicle_type"),
            stops=transport_option.get("stops", 0)
        )
    
    def create_journey(self, legs: List[JourneyLeg]) -> Journey:
        """Combine legs into complete journey"""
        total_cost = sum(leg.cost for leg in legs)
        total_duration = sum(leg.duration_minutes for leg in legs)
        total_transfers = len(legs) - 1
        
        journey = Journey(
            legs=legs,
            total_cost=total_cost,
            total_duration_minutes=total_duration,
            total_transfers=total_transfers,
            departure_time=legs[0].departure_time,
            arrival_time=legs[-1].arrival_time,
            summary=f"{total_transfers} stops | ₹{total_cost} | {total_duration // 60}h {total_duration % 60}m"
        )
        
        return journey
    
    def score_journey(self, journey: Journey, priority: str = "balanced") -> float:
        """Score a journey 0-100 based on priority"""
        
        # Normalization parameters
        max_cost = 10000
        max_duration = 48 * 60  # 48 hours
        max_transfers = 5
        
        # Calculate individual scores (0-100)
        cost_score = max(0, 100 * (1 - journey.total_cost / max_cost))
        duration_score = max(0, 100 * (1 - journey.total_duration_minutes / max_duration))
        transfer_score = max(0, 100 * (1 - journey.total_transfers / max_transfers))
        
        # Weight based on priority
        if priority == "cheapest":
            final_score = cost_score * 0.7 + duration_score * 0.15 + transfer_score * 0.15
        elif priority == "fastest":
            final_score = duration_score * 0.7 + cost_score * 0.15 + transfer_score * 0.15
        elif priority == "most_comfortable":
            # Comfortable = fewer transfers, higher cost acceptable
            final_score = transfer_score * 0.5 + duration_score * 0.3 + cost_score * 0.2
        else:  # balanced
            final_score = cost_score * 0.33 + duration_score * 0.33 + transfer_score * 0.34
        
        return round(final_score, 1)
    
    def plan_journey(self, intent: TravelIntent) -> List[Recommendation]:
        """Main entry point: generate journey recommendations"""
        
        if not intent.origin or not intent.destination:
            return []
        
        routes = self.find_routes(intent.origin, intent.destination)
        
        if not routes:
            return []
        
        # Collect all possible journeys
        all_journeys: List[Tuple[Journey, float, str]] = []
        
        for mode, options in routes.items():
            if intent.preferred_modes and mode not in intent.preferred_modes:
                continue
            
            for option in options:
                leg = self.build_journey_leg(option, intent.origin, intent.destination)
                journey = self.create_journey([leg])
                
                # Filter by constraints
                if intent.max_transfers and journey.total_transfers > intent.max_transfers:
                    continue
                
                if intent.budget and journey.total_cost > intent.budget:
                    continue
                
                score = self.score_journey(journey, intent.priority)
                all_journeys.append((journey, score, mode))
        
        if not all_journeys:
            return []
        
        # Sort by score
        all_journeys.sort(key=lambda x: x[1], reverse=True)
        
        # Generate recommendations
        recommendations = []
        seen_types = set()
        
        # Best Overall (highest score)
        if all_journeys:
            best = all_journeys[0]
            recommendations.append(Recommendation(
                type=RecommendationType.BEST_OVERALL,
                journey=best[0],
                score=best[1],
                explanation=f"Best balance of cost, time, and convenience. ₹{best[0].total_cost} | {best[0].total_duration_minutes // 60}h {best[0].total_duration_minutes % 60}m",
                rank=1,
                is_live=False,
                data_source="demo"
            ))
            seen_types.add("best_overall")
        
        # Cheapest
        cheapest = min(all_journeys, key=lambda x: x[0].total_cost, default=None)
        if cheapest and "cheapest" not in seen_types:
            recommendations.append(Recommendation(
                type=RecommendationType.CHEAPEST,
                journey=cheapest[0],
                score=cheapest[1],
                explanation=f"Lowest cost option at ₹{cheapest[0].total_cost}. {cheapest[0].total_duration_minutes // 60}h {cheapest[0].total_duration_minutes % 60}m travel time.",
                rank=2,
                is_live=False,
                data_source="demo"
            ))
            seen_types.add("cheapest")
        
        # Fastest
        fastest = min(all_journeys, key=lambda x: x[0].total_duration_minutes, default=None)
        if fastest and "fastest" not in seen_types:
            recommendations.append(Recommendation(
                type=RecommendationType.FASTEST,
                journey=fastest[0],
                score=fastest[1],
                explanation=f"Quickest journey at {fastest[0].total_duration_minutes // 60}h {fastest[0].total_duration_minutes % 60}m. Cost: ₹{fastest[0].total_cost}",
                rank=3,
                is_live=False,
                data_source="demo"
            ))
            seen_types.add("fastest")
        
        # Most Comfortable (fewest transfers)
        most_comfortable = min(all_journeys, key=lambda x: x[0].total_transfers, default=None)
        if most_comfortable and "most_comfortable" not in seen_types:
            transfers_str = f"{most_comfortable[0].total_transfers} transfer" if most_comfortable[0].total_transfers == 1 else f"{most_comfortable[0].total_transfers} transfers"
            recommendations.append(Recommendation(
                type=RecommendationType.MOST_COMFORTABLE,
                journey=most_comfortable[0],
                score=most_comfortable[1],
                explanation=f"Most convenient with {transfers_str}. ₹{most_comfortable[0].total_cost} | {most_comfortable[0].total_duration_minutes // 60}h {most_comfortable[0].total_duration_minutes % 60}m",
                rank=4,
                is_live=False,
                data_source="demo"
            ))
            seen_types.add("most_comfortable")
        
        return recommendations[:4]  # Return top 3 recommendations
    
    def get_distance_via_mapbox(self, origin: str, destination: str) -> Optional[Dict]:
        """
        Get distance and travel time via Mapbox (free tier)
        Requires MAPBOX_ACCESS_TOKEN environment variable
        """
        if not self.mapbox_token:
            return None
        
        origin_coords = get_city_coordinates(origin)
        dest_coords = get_city_coordinates(destination)
        
        if not origin_coords or not dest_coords:
            return None
        
        try:
            url = f"https://api.mapbox.com/directions/v5/mapbox/driving/{origin_coords['lon']},{origin_coords['lat']};{dest_coords['lon']},{dest_coords['lat']}"
            params = {"access_token": self.mapbox_token}
            
            response = requests.get(url, params=params, timeout=5)
            if response.status_code == 200:
                data = response.json()
                if data.get("routes"):
                    route = data["routes"][0]
                    return {
                        "distance_km": route["distance"] / 1000,
                        "duration_minutes": route["duration"] / 60,
                        "source": "mapbox"
                    }
        except Exception as e:
            print(f"Mapbox API error: {e}")
        
        return None
    
    def get_distance_via_osm(self, origin: str, destination: str) -> Optional[Dict]:
        """
        Get distance via OpenStreetMap (free, no API key needed)
        Uses Open Route Service or similar
        """
        origin_coords = get_city_coordinates(origin)
        dest_coords = get_city_coordinates(destination)
        
        if not origin_coords or not dest_coords:
            return None
        
        try:
            # Using Open Route Service free tier (no key required for reasonable usage)
            url = "https://api.openrouteservice.org/v2/directions/driving"
            
            # Note: ORS free tier has no auth but rate-limited
            # For SIH demo, we can estimate or use cached data
            
            payload = {
                "coordinates": [
                    [origin_coords['lon'], origin_coords['lat']],
                    [dest_coords['lon'], dest_coords['lat']]
                ]
            }
            
            # This is rate-limited, so we'll add fallback
            try:
                response = requests.post(url, json=payload, timeout=5)
                if response.status_code == 200:
                    data = response.json()
                    if data.get("routes"):
                        route = data["routes"][0]
                        return {
                            "distance_km": route["summary"]["distance"] / 1000,
                            "duration_minutes": route["summary"]["duration"] / 60,
                            "source": "openrouteservice"
                        }
            except:
                pass
        except Exception as e:
            print(f"OSM API error: {e}")
        
        return None
    
    def estimate_first_last_mile(self, origin_city: str, destination_city: str) -> Dict:
        """Estimate first/last mile costs and times using simple calculation"""
        
        # Rough estimates for Indian cities
        avg_distance_km = 15  # Average distance from home to station
        avg_time_minutes = 30
        
        # Cab fare estimation (₹10-15 per km + base fare ₹50)
        base_fare = 50
        per_km_rate = 12
        estimated_fare = base_fare + (avg_distance_km * per_km_rate)
        
        return {
            "estimated_distance_km": avg_distance_km,
            "estimated_time_minutes": avg_time_minutes,
            "estimated_fare_inr": estimated_fare,
            "mode": "cab"
        }
