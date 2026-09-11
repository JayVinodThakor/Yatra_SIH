"""
Mock Transport Data for YATRA
Realistic Indian transport data for demo purposes
"""

MOCK_ROUTES = {
    "Gandhinagar->Delhi": {
        "train": [
            {
                "mode": "train",
                "provider": "Indian Railways",
                "departure_time": "2026-09-11T18:30:00",
                "arrival_time": "2026-09-12T06:15:00",
                "duration_minutes": 735,
                "cost": 450,
                "vehicle_type": "12958 ADI-NDLS SF",
                "comfort_level": "AC 3-tier",
                "stops": 0
            },
            {
                "mode": "train",
                "provider": "Indian Railways",
                "departure_time": "2026-09-11T22:00:00",
                "arrival_time": "2026-09-12T09:30:00",
                "duration_minutes": 870,
                "cost": 380,
                "vehicle_type": "12916 ADI-NDLS EXPRESS",
                "comfort_level": "Sleeper",
                "stops": 0
            }
        ],
        "flight": [
            {
                "mode": "flight",
                "provider": "IndiGo",
                "departure_time": "2026-09-11T20:00:00",
                "arrival_time": "2026-09-11T22:00:00",
                "duration_minutes": 120,
                "cost": 4200,
                "vehicle_type": "A320",
                "comfort_level": "Economy",
                "stops": 0
            },
            {
                "mode": "flight",
                "provider": "Air India",
                "departure_time": "2026-09-11T18:45:00",
                "arrival_time": "2026-09-11T20:45:00",
                "duration_minutes": 120,
                "cost": 4800,
                "vehicle_type": "Boeing 777",
                "comfort_level": "Economy",
                "stops": 0
            }
        ],
        "bus": [
            {
                "mode": "bus",
                "provider": "RedBus",
                "departure_time": "2026-09-11T19:00:00",
                "arrival_time": "2026-09-12T07:00:00",
                "duration_minutes": 720,
                "cost": 1200,
                "vehicle_type": "Sleeper AC",
                "comfort_level": "AC",
                "stops": 2
            },
            {
                "mode": "bus",
                "provider": "Greyhounds",
                "departure_time": "2026-09-11T20:30:00",
                "arrival_time": "2026-09-12T08:30:00",
                "duration_minutes": 720,
                "cost": 950,
                "vehicle_type": "Semi-Sleeper",
                "comfort_level": "AC",
                "stops": 3
            }
        ]
    },
    
    "Gandhinagar->Mumbai": {
        "train": [
            {
                "mode": "train",
                "provider": "Indian Railways",
                "departure_time": "2026-09-11T06:00:00",
                "arrival_time": "2026-09-11T15:30:00",
                "duration_minutes": 570,
                "cost": 320,
                "vehicle_type": "19015 GDN-BCT LOCAL",
                "comfort_level": "General",
                "stops": 1
            },
            {
                "mode": "train",
                "provider": "Indian Railways",
                "departure_time": "2026-09-11T16:30:00",
                "arrival_time": "2026-09-12T02:00:00",
                "duration_minutes": 570,
                "cost": 480,
                "vehicle_type": "22929 PARIVAHAN EXPRESS",
                "comfort_level": "AC 2-tier",
                "stops": 0
            }
        ],
        "flight": [
            {
                "mode": "flight",
                "provider": "SpiceJet",
                "departure_time": "2026-09-11T07:00:00",
                "arrival_time": "2026-09-11T08:30:00",
                "duration_minutes": 90,
                "cost": 2500,
                "vehicle_type": "Boeing 737",
                "comfort_level": "Economy",
                "stops": 0
            }
        ],
        "bus": [
            {
                "mode": "bus",
                "provider": "Neeta Tours",
                "departure_time": "2026-09-11T22:00:00",
                "arrival_time": "2026-09-12T07:00:00",
                "duration_minutes": 540,
                "cost": 700,
                "vehicle_type": "Sleeper AC",
                "comfort_level": "AC",
                "stops": 1
            }
        ]
    },
    
    "Gandhinagar->Bangalore": {
        "train": [
            {
                "mode": "train",
                "provider": "Indian Railways",
                "departure_time": "2026-09-11T08:30:00",
                "arrival_time": "2026-09-12T06:30:00",
                "duration_minutes": 1320,
                "cost": 550,
                "vehicle_type": "16204 GDN-SBC EXPRESS",
                "comfort_level": "AC 3-tier",
                "stops": 0
            }
        ],
        "flight": [
            {
                "mode": "flight",
                "provider": "Vistara",
                "departure_time": "2026-09-11T09:00:00",
                "arrival_time": "2026-09-11T10:45:00",
                "duration_minutes": 105,
                "cost": 3500,
                "vehicle_type": "A320",
                "comfort_level": "Economy",
                "stops": 0
            }
        ],
        "bus": [
            {
                "mode": "bus",
                "provider": "SRS Travels",
                "departure_time": "2026-09-11T18:00:00",
                "arrival_time": "2026-09-12T12:00:00",
                "duration_minutes": 1080,
                "cost": 1400,
                "vehicle_type": "Sleeper AC",
                "comfort_level": "AC",
                "stops": 2
            }
        ]
    },
    
    "Mumbai->Delhi": {
        "train": [
            {
                "mode": "train",
                "provider": "Indian Railways",
                "departure_time": "2026-09-11T07:40:00",
                "arrival_time": "2026-09-12T07:50:00",
                "duration_minutes": 1450,
                "cost": 650,
                "vehicle_type": "12953 RAJDHANI EXPRESS",
                "comfort_level": "AC 1-tier",
                "stops": 0
            }
        ],
        "flight": [
            {
                "mode": "flight",
                "provider": "IndiGo",
                "departure_time": "2026-09-11T08:00:00",
                "arrival_time": "2026-09-11T10:30:00",
                "duration_minutes": 150,
                "cost": 5200,
                "vehicle_type": "A321",
                "comfort_level": "Economy",
                "stops": 0
            }
        ],
        "bus": [
            {
                "mode": "bus",
                "provider": "DRL Travels",
                "departure_time": "2026-09-11T20:00:00",
                "arrival_time": "2026-09-12T14:00:00",
                "duration_minutes": 1080,
                "cost": 1800,
                "vehicle_type": "Sleeper AC",
                "comfort_level": "AC",
                "stops": 1
            }
        ]
    },
    
    "Delhi->Bangalore": {
        "train": [
            {
                "mode": "train",
                "provider": "Indian Railways",
                "departure_time": "2026-09-11T16:40:00",
                "arrival_time": "2026-09-12T18:35:00",
                "duration_minutes": 1435,
                "cost": 800,
                "vehicle_type": "12351 RAJDHANI EXPRESS",
                "comfort_level": "AC 1-tier",
                "stops": 0
            }
        ],
        "flight": [
            {
                "mode": "flight",
                "provider": "Vistara",
                "departure_time": "2026-09-11T09:00:00",
                "arrival_time": "2026-09-11T11:40:00",
                "duration_minutes": 160,
                "cost": 4500,
                "vehicle_type": "A320",
                "comfort_level": "Economy",
                "stops": 0
            }
        ],
        "bus": [
            {
                "mode": "bus",
                "provider": "VRL Travels",
                "departure_time": "2026-09-11T22:00:00",
                "arrival_time": "2026-09-12T18:00:00",
                "duration_minutes": 1320,
                "cost": 2200,
                "vehicle_type": "Sleeper AC",
                "comfort_level": "AC",
                "stops": 1
            }
        ]
    },
    
    "Mumbai->Bangalore": {
        "train": [
            {
                "mode": "train",
                "provider": "Indian Railways",
                "departure_time": "2026-09-11T08:45:00",
                "arrival_time": "2026-09-12T02:15:00",
                "duration_minutes": 930,
                "cost": 500,
                "vehicle_type": "16589 SHATABDI EXPRESS",
                "comfort_level": "AC 2-tier",
                "stops": 0
            }
        ],
        "flight": [
            {
                "mode": "flight",
                "provider": "SpiceJet",
                "departure_time": "2026-09-11T10:00:00",
                "arrival_time": "2026-09-11T11:45:00",
                "duration_minutes": 105,
                "cost": 3200,
                "vehicle_type": "Boeing 737",
                "comfort_level": "Economy",
                "stops": 0
            }
        ],
        "bus": [
            {
                "mode": "bus",
                "provider": "Neeta Tours",
                "departure_time": "2026-09-11T18:00:00",
                "arrival_time": "2026-09-12T10:00:00",
                "duration_minutes": 960,
                "cost": 1600,
                "vehicle_type": "Sleeper AC",
                "comfort_level": "AC",
                "stops": 2
            }
        ]
    },
    
    "Bangalore->Delhi": {
        "train": [
            {
                "mode": "train",
                "provider": "Indian Railways",
                "departure_time": "2026-09-11T09:50:00",
                "arrival_time": "2026-09-12T12:25:00",
                "duration_minutes": 1495,
                "cost": 900,
                "vehicle_type": "22692 RAJDHANI EXPRESS",
                "comfort_level": "AC 1-tier",
                "stops": 0
            }
        ],
        "flight": [
            {
                "mode": "flight",
                "provider": "Air India",
                "departure_time": "2026-09-11T06:00:00",
                "arrival_time": "2026-09-11T08:45:00",
                "duration_minutes": 165,
                "cost": 4800,
                "vehicle_type": "Boeing 777",
                "comfort_level": "Economy",
                "stops": 0
            }
        ],
        "bus": [
            {
                "mode": "bus",
                "provider": "SRS Travels",
                "departure_time": "2026-09-11T20:00:00",
                "arrival_time": "2026-09-12T16:00:00",
                "duration_minutes": 1320,
                "cost": 2400,
                "vehicle_type": "Sleeper AC",
                "comfort_level": "AC",
                "stops": 1
            }
        ]
    },
    
    "Ahmedabad->Delhi": {
        "train": [
            {
                "mode": "train",
                "provider": "Indian Railways",
                "departure_time": "2026-09-11T18:30:00",
                "arrival_time": "2026-09-12T07:00:00",
                "duration_minutes": 750,
                "cost": 420,
                "vehicle_type": "12957 ADI-NDLS SUPERFAST",
                "comfort_level": "AC 3-tier",
                "stops": 0
            }
        ],
        "flight": [
            {
                "mode": "flight",
                "provider": "IndiGo",
                "departure_time": "2026-09-11T19:30:00",
                "arrival_time": "2026-09-11T21:30:00",
                "duration_minutes": 120,
                "cost": 3800,
                "vehicle_type": "A320",
                "comfort_level": "Economy",
                "stops": 0
            }
        ],
        "bus": [
            {
                "mode": "bus",
                "provider": "RedBus",
                "departure_time": "2026-09-11T19:00:00",
                "arrival_time": "2026-09-12T07:30:00",
                "duration_minutes": 780,
                "cost": 1100,
                "vehicle_type": "Sleeper AC",
                "comfort_level": "AC",
                "stops": 2
            }
        ]
    }
}

# City coordinates for Mapbox/OSM lookups
CITY_COORDINATES = {
    # Existing cities
    "Gandhinagar": {"lat": 23.2156, "lon": 72.6369},
    "Ahmedabad": {"lat": 23.0225, "lon": 72.5714},
    "Mumbai": {"lat": 19.0760, "lon": 72.8777},
    "Pune": {"lat": 18.5204, "lon": 73.8567},
    "Delhi": {"lat": 28.7041, "lon": 77.1025},
    "Jaipur": {"lat": 26.9124, "lon": 75.7873},
    "Bangalore": {"lat": 12.9716, "lon": 77.5946},
    "Hyderabad": {"lat": 17.3850, "lon": 78.4867},
    "Chennai": {"lat": 13.0827, "lon": 80.2707},
    "Kolkata": {"lat": 22.5726, "lon": 88.3639},

    # Additional demo cities
    "Surat": {"lat": 21.1702, "lon": 72.8311},
    "Vadodara": {"lat": 22.3072, "lon": 73.1812},
    "Indore": {"lat": 22.7196, "lon": 75.8577},
    "Bhopal": {"lat": 23.2599, "lon": 77.4126},
    "Nagpur": {"lat": 21.1458, "lon": 79.0882},
    "Lucknow": {"lat": 26.8467, "lon": 80.9462},
    "Varanasi": {"lat": 25.3176, "lon": 82.9739},
    "Chandigarh": {"lat": 30.7333, "lon": 76.7794},
    "Amritsar": {"lat": 31.6340, "lon": 74.8723},
    "Goa": {"lat": 15.2993, "lon": 74.1240},
    "Kochi": {"lat": 9.9312, "lon": 76.2673},
    "Coimbatore": {"lat": 11.0168, "lon": 76.9558},
    "Bhubaneswar": {"lat": 20.2961, "lon": 85.8245},
    "Patna": {"lat": 25.5941, "lon": 85.1376},
    "Ranchi": {"lat": 23.3441, "lon": 85.3096},
}

def get_route(origin: str, destination: str) -> dict:
    """Get mock route data for origin->destination"""
    key = f"{origin}->{destination}"
    return MOCK_ROUTES.get(key, {})


def get_city_coordinates(city: str) -> dict:
    """Get latitude/longitude for a city"""
    return CITY_COORDINATES.get(city, {})


def get_all_routes() -> dict:
    """Get all mock routes"""
    return MOCK_ROUTES
