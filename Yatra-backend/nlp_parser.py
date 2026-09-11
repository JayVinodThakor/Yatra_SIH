import os
import json
import re
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
print(f"🗝️ API KEY CHECK: {'Configured' if api_key else 'None'}")

if api_key:
    genai.configure(api_key=api_key)

    try:
        model = genai.GenerativeModel("gemini-2.0-flash")
    except Exception:
        model = None
else:
    model = None


# All cities currently supported by YATRA
KNOWN_CITIES = [
    "Gandhinagar",
    "Ahmedabad",
    "Mumbai",
    "Pune",
    "Delhi",
    "Jaipur",
    "Bangalore",
    "Hyderabad",
    "Chennai",
    "Kolkata",
    "Surat",
    "Vadodara",
    "Indore",
    "Bhopal",
    "Nagpur",
    "Lucknow",
    "Varanasi",
    "Chandigarh",
    "Amritsar",
    "Goa",
    "Kochi",
    "Coimbatore",
    "Bhubaneswar",
    "Patna",
    "Ranchi",
]


def find_city(text: str) -> str | None:
    """Find a known YATRA city inside a user query."""

    text_lower = text.lower()

    # Longest names first prevents partial matches.
    for city in sorted(KNOWN_CITIES, key=len, reverse=True):
        if city.lower() in text_lower:
            return city

    return None


def offline_parse(user_input: str) -> dict:
    """
    Offline fallback parser.

    This is used when Gemini is unavailable.
    It supports common queries such as:

    "Go to Mumbai from Ahmedabad"
    "Ahmedabad to Mumbai"
    "Fastest route from Pune to Delhi"
    "Cheapest way to Goa"
    """

    text = user_input.strip()
    lower_text = text.lower()

    origin = None
    destination = None

    # ---------------------------------------------------------
    # Pattern: "from Ahmedabad to Mumbai"
    # ---------------------------------------------------------
    match = re.search(
        r"\bfrom\s+(.+?)\s+\bto\s+(.+?)(?:\s+(?:tomorrow|today|next|around|at)\b|$)",
        text,
        re.IGNORECASE,
    )

    if match:
        possible_origin = find_city(match.group(1))
        possible_destination = find_city(match.group(2))

        if possible_origin:
            origin = possible_origin

        if possible_destination:
            destination = possible_destination

    # ---------------------------------------------------------
    # Pattern: "to Mumbai from Ahmedabad"
    # ---------------------------------------------------------
    if not origin or not destination:
        match = re.search(
            r"\bto\s+(.+?)\s+\bfrom\s+(.+?)(?:\s+(?:tomorrow|today|next|around|at)\b|$)",
            text,
            re.IGNORECASE,
        )

        if match:
            possible_destination = find_city(match.group(1))
            possible_origin = find_city(match.group(2))

            if possible_destination:
                destination = possible_destination

            if possible_origin:
                origin = possible_origin

    # ---------------------------------------------------------
    # Pattern: "Ahmedabad to Mumbai"
    # ---------------------------------------------------------
    if not origin or not destination:
        match = re.search(
            r"\b([A-Za-z][A-Za-z\s]+?)\s+\bto\b\s+([A-Za-z][A-Za-z\s]+?)(?:\s+(?:tomorrow|today|next|around|at)\b|$)",
            text,
            re.IGNORECASE,
        )

        if match:
            possible_origin = find_city(match.group(1))
            possible_destination = find_city(match.group(2))

            if possible_origin:
                origin = possible_origin

            if possible_destination:
                destination = possible_destination

    # ---------------------------------------------------------
    # If destination is still missing, look for any known city.
    # ---------------------------------------------------------
    if not destination:
        destination = find_city(text)

    # If query says "from X", use that as origin.
    if not origin:
        match = re.search(
            r"\bfrom\s+(.+?)(?:\s+(?:to|tomorrow|today|next|around|at)\b|$)",
            text,
            re.IGNORECASE,
        )

        if match:
            origin = find_city(match.group(1))

    # ---------------------------------------------------------
    # Default origin
    # ---------------------------------------------------------
    if not origin:
        origin = "Home"

    # ---------------------------------------------------------
    # Default destination
    # ---------------------------------------------------------
    if not destination:
        destination = "Delhi"

    # ---------------------------------------------------------
    # Preference
    # ---------------------------------------------------------
    if "cheapest" in lower_text:
        preference = "Cheapest"
    elif "fastest" in lower_text or "quickest" in lower_text:
        preference = "Fastest"
    elif "convenient" in lower_text:
        preference = "Convenient"
    else:
        preference = "Best Overall"

    # ---------------------------------------------------------
    # Date
    # ---------------------------------------------------------
    if "today" in lower_text:
        date = "today"
    elif "next friday" in lower_text:
        date = "next Friday"
    elif "next saturday" in lower_text:
        date = "next Saturday"
    elif "next sunday" in lower_text:
        date = "next Sunday"
    else:
        date = "tomorrow"

    # ---------------------------------------------------------
    # Time
    # ---------------------------------------------------------
    time = None

    time_match = re.search(
        r"\b(\d{1,2})(?::(\d{2}))?\s*(AM|PM)\b",
        text,
        re.IGNORECASE,
    )

    if time_match:
        hour = int(time_match.group(1))
        minute = int(time_match.group(2) or 0)

        am_pm = time_match.group(3).upper()

        if am_pm == "PM" and hour != 12:
            hour += 12
        elif am_pm == "AM" and hour == 12:
            hour = 0

        time = f"{hour:02d}:{minute:02d}"

    return {
        "origin": origin,
        "destination": destination,
        "date": date,
        "time": time,
        "preference": preference,
        "fallback_used": True,
    }


def parse_journey_query(user_input: str) -> dict:

    system_prompt = f"""
    You are an intelligent travel data extractor for YATRA.

    Output strictly valid JSON.
    Do not use markdown.

    Required keys:
    - "origin": Starting city/location.
    - "destination": Target city/location.
    - "date": Day of travel.
    - "time": Time of travel or null.
    - "preference": "Cheapest", "Fastest", "Convenient", or "Best Overall".

    User Query:
    "{user_input}"
    """

    # ---------------------------------------------------------
    # Try Gemini first if available
    # ---------------------------------------------------------
    if model is not None:

        try:
            response = model.generate_content(system_prompt)

            response_text = response.text.strip()

            if response_text.startswith("```json"):
                response_text = response_text[7:-3].strip()

            elif response_text.startswith("```"):
                response_text = response_text[3:-3].strip()

            result = json.loads(response_text)

            return result

        except Exception as e:
            print(f"\n⚠️ Gemini failed: {e}")
            print("↪️ Using offline YATRA parser...")

    # ---------------------------------------------------------
    # Offline fallback
    # ---------------------------------------------------------
    result = offline_parse(user_input)

    print(f"🧠 Offline parser result: {result}")

    return result


if __name__ == "__main__":

    queries = [
        "I need to reach Delhi tomorrow around 6 PM",
        "Cheapest way to Goa next Friday",
        "Fastest route to Bangalore airport from my Home",
        "Get me to Mumbai",
        "Go to Mumbai from Ahmedabad",
        "Ahmedabad to Pune",
        "Fastest route from Surat to Delhi",
        "Cheapest way from Jaipur to Goa",
    ]

    for q in queries:
        print(f"\nUser: {q}")

        result = parse_journey_query(q)

        print(
            f"YATRA JSON: "
            f"{json.dumps(result, indent=2)}"
        )