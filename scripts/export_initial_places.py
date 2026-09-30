#!/usr/bin/env python3
"""
Convert recalibrated_curated_places.json into src/data/initialPlaces.ts
"""

import json

with open("src/data/recalibrated_curated_places.json", "r", encoding="utf-8") as f:
    places = json.load(f)

ts_content = "import { Place } from '../types/food';\n\n"
ts_content += "export const INITIAL_PLACES: Place[] = "
ts_content += json.dumps(places, ensure_ascii=False, indent=2)
ts_content += ";\n"

with open("src/data/initialPlaces.ts", "w", encoding="utf-8") as f:
    f.write(ts_content)

print("Updated src/data/initialPlaces.ts successfully!")
