# yatra_data.py
# Version: Final - Preference Aware, Time Aware, Home Interceptor, Expanded Network


# ============================================================
# 1. THE GOLDEN DATASET
# ============================================================

MOCK_JOURNEYS = {

    # --------------------------------------------------------
    # GANDHINAGAR → DELHI
    # --------------------------------------------------------

    "gandhinagar_delhi": {
        "search_query": "Gandhinagar to Delhi",

        "options": {

            "best_overall": {
                "cost": 1250,
                "duration": "14h 30m",
                "transfers": 1,
                "legs": [
                    {
                        "mode": "Cab",
                        "from": "Gandhinagar",
                        "to": "Ahmedabad Station",
                        "duration": "45m",
                        "departure": "17:00",
                        "arrival": "17:45"
                    },
                    {
                        "mode": "Train",
                        "from": "Ahmedabad Station",
                        "to": "New Delhi",
                        "duration": "13h 45m",
                        "departure": "18:15",
                        "arrival": "08:00"
                    }
                ]
            },

            "cheapest": {
                "cost": 550,
                "duration": "18h 15m",
                "transfers": 2,
                "legs": [
                    {
                        "mode": "Bus",
                        "from": "Gandhinagar",
                        "to": "Ahmedabad",
                        "duration": "1h 15m",
                        "departure": "10:00",
                        "arrival": "11:15"
                    },
                    {
                        "mode": "Sleeper Bus",
                        "from": "Ahmedabad",
                        "to": "Jaipur",
                        "duration": "10h",
                        "departure": "12:00",
                        "arrival": "22:00"
                    },
                    {
                        "mode": "Bus",
                        "from": "Jaipur",
                        "to": "Delhi",
                        "duration": "7h",
                        "departure": "22:30",
                        "arrival": "05:30"
                    }
                ]
            },

            "fastest": {
                "cost": 4800,
                "duration": "3h 45m",
                "transfers": 1,
                "legs": [
                    {
                        "mode": "Cab",
                        "from": "Gandhinagar",
                        "to": "Ahmedabad Airport",
                        "duration": "30m",
                        "departure": "07:00",
                        "arrival": "07:30"
                    },
                    {
                        "mode": "Flight",
                        "from": "Ahmedabad Airport",
                        "to": "Delhi Airport",
                        "duration": "1h 45m",
                        "departure": "09:00",
                        "arrival": "10:45"
                    },
                    {
                        "mode": "Metro",
                        "from": "Delhi Airport",
                        "to": "New Delhi",
                        "duration": "1h 30m",
                        "departure": "11:00",
                        "arrival": "12:30"
                    }
                ]
            },

            "convenient": {
                "cost": 4100,
                "duration": "13h 00m",
                "transfers": 0,
                "legs": [
                    {
                        "mode": "Premium AC Bus",
                        "from": "Gandhinagar",
                        "to": "Delhi",
                        "duration": "13h",
                        "departure": "19:00",
                        "arrival": "08:00"
                    }
                ]
            }
        }
    },


    # --------------------------------------------------------
    # GANDHINAGAR → MUMBAI
    # --------------------------------------------------------

    "gandhinagar_mumbai": {
        "search_query": "Gandhinagar to Mumbai",

        "options": {

            "best_overall": {
                "cost": 1400,
                "duration": "6h 30m",
                "transfers": 1,
                "legs": [
                    {
                        "mode": "Cab",
                        "from": "Gandhinagar",
                        "to": "Ahmedabad Station",
                        "duration": "45m",
                        "departure": "06:00",
                        "arrival": "06:45"
                    },
                    {
                        "mode": "Vande Bharat Train",
                        "from": "Ahmedabad Station",
                        "to": "Mumbai Central",
                        "duration": "5h 45m",
                        "departure": "07:15",
                        "arrival": "13:00"
                    }
                ]
            },

            "cheapest": {
                "cost": 600,
                "duration": "11h 00m",
                "transfers": 0,
                "legs": [
                    {
                        "mode": "Sleeper Bus",
                        "from": "Gandhinagar",
                        "to": "Mumbai Borivali",
                        "duration": "11h",
                        "departure": "20:00",
                        "arrival": "07:00"
                    }
                ]
            },

            "fastest": {
                "cost": 4500,
                "duration": "3h 15m",
                "transfers": 1,
                "legs": [
                    {
                        "mode": "Cab",
                        "from": "Gandhinagar",
                        "to": "Ahmedabad Airport",
                        "duration": "30m",
                        "departure": "15:00",
                        "arrival": "15:30"
                    },
                    {
                        "mode": "Flight",
                        "from": "Ahmedabad Airport",
                        "to": "Mumbai Airport",
                        "duration": "1h 15m",
                        "departure": "17:00",
                        "arrival": "18:15"
                    },
                    {
                        "mode": "Metro",
                        "from": "Mumbai Airport",
                        "to": "Andheri",
                        "duration": "1h 30m",
                        "departure": "18:45",
                        "arrival": "20:15"
                    }
                ]
            },

            "convenient": {
                "cost": 1800,
                "duration": "8h 30m",
                "transfers": 0,
                "legs": [
                    {
                        "mode": "Direct Train",
                        "from": "Gandhinagar Capital",
                        "to": "Mumbai Central",
                        "duration": "8h 30m",
                        "departure": "22:00",
                        "arrival": "06:30"
                    }
                ]
            }
        }
    },


    # --------------------------------------------------------
    # DELHI → MUMBAI
    # --------------------------------------------------------

    "delhi_mumbai": {
        "search_query": "Delhi to Mumbai",

        "options": {

            "best_overall": {
                "cost": 2800,
                "duration": "15h 40m",
                "transfers": 0,
                "legs": [
                    {
                        "mode": "Rajdhani Train",
                        "from": "New Delhi",
                        "to": "Mumbai Central",
                        "duration": "15h 40m",
                        "departure": "16:55",
                        "arrival": "08:35"
                    }
                ]
            },

            "cheapest": {
                "cost": 850,
                "duration": "24h 00m",
                "transfers": 1,
                "legs": [
                    {
                        "mode": "Passenger Train",
                        "from": "New Delhi",
                        "to": "Surat",
                        "duration": "16h",
                        "departure": "05:00",
                        "arrival": "21:00"
                    },
                    {
                        "mode": "Local Train",
                        "from": "Surat",
                        "to": "Mumbai",
                        "duration": "8h",
                        "departure": "22:00",
                        "arrival": "06:00"
                    }
                ]
            },

            "fastest": {
                "cost": 5500,
                "duration": "4h 00m",
                "transfers": 1,
                "legs": [
                    {
                        "mode": "Flight",
                        "from": "Delhi Airport",
                        "to": "Mumbai Airport",
                        "duration": "2h 15m",
                        "departure": "08:00",
                        "arrival": "10:15"
                    },
                    {
                        "mode": "Cab",
                        "from": "Mumbai Airport",
                        "to": "City Center",
                        "duration": "1h 45m",
                        "departure": "10:45",
                        "arrival": "12:30"
                    }
                ]
            },

            "convenient": {
                "cost": 6200,
                "duration": "2h 15m",
                "transfers": 0,
                "legs": [
                    {
                        "mode": "Direct Flight",
                        "from": "Delhi Airport",
                        "to": "Mumbai Airport",
                        "duration": "2h 15m",
                        "departure": "14:00",
                        "arrival": "16:15"
                    }
                ]
            }
        }
    },


    # --------------------------------------------------------
    # DELHI → BANGALORE
    # --------------------------------------------------------

    "delhi_bangalore": {
        "search_query": "Delhi to Bangalore",

        "options": {

            "best_overall": {
                "cost": 5800,
                "duration": "6h 15m",
                "transfers": 1,
                "legs": [
                    {
                        "mode": "Cab",
                        "from": "New Delhi",
                        "to": "Delhi Airport",
                        "duration": "1h",
                        "departure": "09:00",
                        "arrival": "10:00"
                    },
                    {
                        "mode": "Flight",
                        "from": "Delhi Airport",
                        "to": "Bangalore Airport",
                        "duration": "2h 45m",
                        "departure": "11:30",
                        "arrival": "14:15"
                    },
                    {
                        "mode": "Airport Bus",
                        "from": "Bangalore Airport",
                        "to": "Majestic Station",
                        "duration": "1h 30m",
                        "departure": "14:45",
                        "arrival": "16:15"
                    }
                ]
            },

            "cheapest": {
                "cost": 1200,
                "duration": "38h 30m",
                "transfers": 0,
                "legs": [
                    {
                        "mode": "Express Train",
                        "from": "Hazrat Nizamuddin",
                        "to": "KSR Bengaluru",
                        "duration": "38h 30m",
                        "departure": "20:45",
                        "arrival": "11:15"
                    }
                ]
            },

            "fastest": {
                "cost": 8500,
                "duration": "4h 30m",
                "transfers": 1,
                "legs": [
                    {
                        "mode": "Cab",
                        "from": "New Delhi",
                        "to": "Delhi Airport",
                        "duration": "45m",
                        "departure": "06:00",
                        "arrival": "06:45"
                    },
                    {
                        "mode": "Direct Flight",
                        "from": "Delhi Airport",
                        "to": "Bangalore Airport",
                        "duration": "2h 45m",
                        "departure": "08:00",
                        "arrival": "10:45"
                    },
                    {
                        "mode": "Cab",
                        "from": "Bangalore Airport",
                        "to": "City Center",
                        "duration": "1h",
                        "departure": "11:00",
                        "arrival": "12:00"
                    }
                ]
            },

            "convenient": {
                "cost": 7200,
                "duration": "5h 45m",
                "transfers": 1,
                "legs": [
                    {
                        "mode": "Premium Flight",
                        "from": "Delhi Airport",
                        "to": "Bangalore Airport",
                        "duration": "2h 45m",
                        "departure": "14:00",
                        "arrival": "16:45"
                    },
                    {
                        "mode": "Premium Cab",
                        "from": "Bangalore Airport",
                        "to": "City Center",
                        "duration": "1h 15m",
                        "departure": "17:15",
                        "arrival": "18:30"
                    }
                ]
            }
        }
    }
}


# ============================================================
# 2. APPLY USER PREFERENCES
# ============================================================

def apply_preferences(
    route_data,
    preference="Balanced",
    transport="Any mode",
    passengers=1,
    trip_type="One way"
):
    """
    Apply the selections made by the user on the frontend.
    """

    options = route_data.get("options", {})

    # --------------------------------------------------------
    # NORMALIZE VALUES
    # --------------------------------------------------------

    preference = str(preference or "Balanced").strip().lower()
    transport = str(transport or "Any mode").strip().lower()
    trip_type = str(trip_type or "One way").strip().lower()

    try:
        passengers = int(passengers)
    except (ValueError, TypeError):
        passengers = 1

    passengers = max(1, passengers)

    # --------------------------------------------------------
    # PASSENGER PRICE
    # --------------------------------------------------------

    for option in options.values():
        base_cost = option.get("cost", 0)

        option["base_cost"] = base_cost
        option["cost"] = base_cost * passengers

    # --------------------------------------------------------
    # ROUND TRIP
    # --------------------------------------------------------

    if trip_type in ("round trip", "roundtrip"):

        for option in options.values():
            option["cost"] *= 2

    # --------------------------------------------------------
    # TRANSPORT MATCHING
    # --------------------------------------------------------

    transport_keywords = {
        "train": [
            "train",
            "vande bharat",
            "rajdhani",
            "express"
        ],

        "bus": [
            "bus"
        ],

        "flight": [
            "flight"
        ],

        "cab": [
            "cab",
            "car"
        ]
    }

    keywords = transport_keywords.get(transport, [])

    matching_options = []
    other_options = []

    if keywords:

        for key, option in options.items():

            modes = " ".join(
                str(leg.get("mode", "")).lower()
                for leg in option.get("legs", [])
            )

            if any(
                keyword in modes
                for keyword in keywords
            ):
                matching_options.append(
                    (key, option)
                )
            else:
                other_options.append(
                    (key, option)
                )

        # Put matching routes first.
        options.clear()
        options.update(
            dict(matching_options + other_options)
        )

    # --------------------------------------------------------
    # MAIN USER PREFERENCE
    # --------------------------------------------------------

    if preference in (
        "cheapest",
        "lowest cost",
        "low cost"
    ):
        recommended = "cheapest"

    elif preference in (
        "fastest",
        "quickest"
    ):
        recommended = "fastest"

    elif preference in (
        "convenient",
        "most convenient"
    ):
        recommended = "convenient"

    else:
        recommended = "best_overall"

    # --------------------------------------------------------
    # TRANSPORT + PREFERENCE
    # --------------------------------------------------------

    if keywords:

        transport_matches = []

        for key, option in options.items():

            modes = " ".join(
                str(leg.get("mode", "")).lower()
                for leg in option.get("legs", [])
            )

            if any(
                keyword in modes
                for keyword in keywords
            ):
                transport_matches.append(key)

        # If the preferred route doesn't support the
        # selected transport, choose the first matching route.
        if (
            recommended not in transport_matches
            and transport_matches
        ):
            recommended = transport_matches[0]

    # --------------------------------------------------------
    # SAVE RECOMMENDATION
    # --------------------------------------------------------

    route_data["recommended_option"] = recommended

    # Store what the user actually selected.
    route_data["preferences_applied"] = {
        "preference": preference,
        "transport": transport,
        "passengers": passengers,
        "trip_type": trip_type
    }

    return route_data


# ============================================================
# 3. FALLBACK ROUTE GENERATOR
# ============================================================

def create_fallback_route(
    display_origin: str,
    destination: str
):
    """
    Create a simulated journey when the requested city pair
    isn't present in the Golden Dataset.
    """

    destination_display = destination.title()

    return {
        "search_query": (
            f"{display_origin} to {destination_display}"
        ),

        "warning": (
            "Simulated fallback route for unmapped cities."
        ),

        "options": {

            "best_overall": {
                "cost": 2500,
                "duration": "18h 30m",
                "transfers": 1,

                "legs": [
                    {
                        "mode": "Transport",
                        "from": display_origin,
                        "to": "Transit Hub",
                        "duration": "4h",
                        "departure": "08:00",
                        "arrival": "12:00"
                    },
                    {
                        "mode": "Express",
                        "from": "Transit Hub",
                        "to": destination_display,
                        "duration": "14h 30m",
                        "departure": "13:00",
                        "arrival": "03:30"
                    }
                ]
            },

            "cheapest": {
                "cost": 850,
                "duration": "28h 00m",
                "transfers": 2,

                "legs": [
                    {
                        "mode": "Local Bus",
                        "from": display_origin,
                        "to": "Highway Point",
                        "duration": "2h",
                        "departure": "06:00",
                        "arrival": "08:00"
                    },
                    {
                        "mode": "Sleeper Bus",
                        "from": "Highway Point",
                        "to": "Regional Hub",
                        "duration": "16h",
                        "departure": "09:00",
                        "arrival": "01:00"
                    },
                    {
                        "mode": "Connecting Bus",
                        "from": "Regional Hub",
                        "to": destination_display,
                        "duration": "10h",
                        "departure": "02:00",
                        "arrival": "12:00"
                    }
                ]
            },

            "fastest": {
                "cost": 8500,
                "duration": "5h 15m",
                "transfers": 1,

                "legs": [
                    {
                        "mode": "Cab",
                        "from": display_origin,
                        "to": "Nearest Airport",
                        "duration": "2h",
                        "departure": "10:00",
                        "arrival": "12:00"
                    },
                    {
                        "mode": "Flight",
                        "from": "Nearest Airport",
                        "to": destination_display,
                        "duration": "3h 15m",
                        "departure": "14:00",
                        "arrival": "17:15"
                    }
                ]
            },

            "convenient": {
                "cost": 6500,
                "duration": "16h 00m",
                "transfers": 0,

                "legs": [
                    {
                        "mode": "Direct Premium AC Bus",
                        "from": display_origin,
                        "to": destination_display,
                        "duration": "16h",
                        "departure": "18:00",
                        "arrival": "10:00"
                    }
                ]
            }
        }
    }


# ============================================================
# 4. MAIN JOURNEY FUNCTION
# ============================================================

def get_journey(
    origin: str,
    destination: str,
    preference: str = "Balanced",
    transport: str = "Any mode",
    passengers: int = 1,
    trip_type: str = "One way"
):
    """
    Main journey lookup function.

    1. Checks the Golden Dataset.
    2. Uses fallback data for unknown city pairs.
    3. Applies passenger count.
    4. Applies one-way / round-trip pricing.
    5. Applies transport preference.
    6. Determines the recommended option.
    """

    clean_origin = origin.strip().lower()
    clean_dest = destination.strip().lower()

    # --------------------------------------------------------
    # HOME INTERCEPTOR
    # --------------------------------------------------------

    display_origin = origin

    if clean_origin == "home":
        clean_origin = "gandhinagar"
        display_origin = "Karnavati University"

    # --------------------------------------------------------
    # SEARCH KEY
    # --------------------------------------------------------

    search_key = f"{clean_origin}_{clean_dest}"

    # --------------------------------------------------------
    # GOLDEN DATASET
    # --------------------------------------------------------

    if search_key in MOCK_JOURNEYS:

        # IMPORTANT:
        # Deep-copy the route so passenger pricing and
        # preferences never permanently modify the dataset.

        import copy

        route_data = copy.deepcopy(
            MOCK_JOURNEYS[search_key]
        )

        route_data["search_query"] = (
            f"{display_origin} to {destination.title()}"
        )

        return apply_preferences(
            route_data,
            preference=preference,
            transport=transport,
            passengers=passengers,
            trip_type=trip_type
        )

    # --------------------------------------------------------
    # FALLBACK
    # --------------------------------------------------------

    route_data = create_fallback_route(
        display_origin,
        destination
    )

    return apply_preferences(
        route_data,
        preference=preference,
        transport=transport,
        passengers=passengers,
        trip_type=trip_type
    )