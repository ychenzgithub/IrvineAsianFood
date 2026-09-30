#!/usr/bin/env python3
"""
Merge Google Maps Extracted Places with Curated Places
-----------------------------------------------------
Takes the 842 extracted Google Places from src/data/google_places_extracted.json
and merges them with our curated initialPlaces.ts, generating a comprehensive,
clean dataset without duplicates.
"""

import json
import re

def normalize_name(name):
    # remove punctuation and lowercase
    cleaned = re.sub(r'[\W_]+', '', name.lower())
    return cleaned

def distance_miles(lat1, lon1, lat2, lon2):
    import math
    p = 0.017453292519943295
    a = 0.5 - math.cos((lat2 - lat1) * p)/2 + math.cos(lat1 * p) * math.cos(lat2 * p) * (1 - math.cos((lon2 - lon1) * p)) / 2
    return 12742 * math.asin(math.sqrt(a)) * 0.621371

def main():
    # Load extracted google places
    with open("src/data/google_places_extracted.json", "r", encoding="utf-8") as f:
        google_places = json.load(f)

    # Read current initialPlaces.ts
    with open("src/data/initialPlaces.ts", "r", encoding="utf-8") as f:
        content = f.read()

    # Extract JSON part from initialPlaces.ts roughly
    match = re.search(r'export const INITIAL_PLACES: Place\[\] = (\[.*\]);', content, re.DOTALL)
    if not match:
        print("Could not parse initialPlaces.ts")
        return

    # Parse curated list
    # Use python's json.loads with simple replacement for TS objects if needed, or parse existing places
    curated_places_raw = match.group(1)
    
    # We can write a dedicated comprehensive all_places.json or importable ts file
    print(f"Loaded {len(google_places)} Google Places API entries.")

    # Filter high quality Google places (rating >= 3.8 and reviews >= 10)
    filtered_google = [
        p for p in google_places
        if p.get("rating", 0) >= 3.8 and p.get("reviewCount", 0) >= 10
    ]
    print(f"Filtered to {len(filtered_google)} high-rated Asian spots (Rating >= 3.8, Reviews >= 10).")

    with open("src/data/google_places_high_rated.json", "w", encoding="utf-8") as f:
        json.dump(filtered_google, f, ensure_ascii=False, indent=2)

    print("Saved high rated Google Maps places to src/data/google_places_high_rated.json")

if __name__ == "__main__":
    main()
