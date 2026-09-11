import os
import requests
from dotenv import load_dotenv

load_dotenv()
ORS_TOKEN = os.getenv("ORS_API_KEY")

def get_coordinates_from_place(place_name: str):
    """ORS API se city ke naam ko longitude aur latitude me badalta hai"""
    url = "https://api.openrouteservice.org/geocode/search"
    params = {
        "api_key": ORS_TOKEN,
        "text": place_name,
        "size": 1
    }
    
    response = requests.get(url, params=params)
    if response.status_code == 200:
        data = response.json()
        if data.get("features"):
            return data["features"][0]["geometry"]["coordinates"]
    return None

def get_route_geometry(origin_coords: list, dest_coords: list):
    """ORS API se rasta, distance aur time nikalta hai"""
    start_str = f"{origin_coords[0]},{origin_coords[1]}"
    end_str = f"{dest_coords[0]},{dest_coords[1]}"
    
    url = "https://api.openrouteservice.org/v2/directions/driving-car"
    params = {
        "api_key": ORS_TOKEN,
        "start": start_str,
        "end": end_str
    }
    
    response = requests.get(url, params=params)
    if response.status_code == 200:
        return response.json()
    return None