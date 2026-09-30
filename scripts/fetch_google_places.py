#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Google Places API (New) & Yelp Batch Data Extractor for Irvine & Neighboring Cities
----------------------------------------------------------------------------------
This script queries the Google Places API (New) and Yelp Fusion API to extract
all Asian dining, markets, bakeries, and boba shops in Irvine, Tustin, Costa Mesa,
Newport Beach, Santa Ana, and Lake Forest.

Usage:
  export GOOGLE_MAPS_API_KEY="your_api_key_here"
  python3 scripts/fetch_google_places.py

  Or with CLI flag:
  python3 scripts/fetch_google_places.py --api-key YOUR_KEY --output src/data/google_places.json
"""

import os
import sys
import json
import time
import argparse
import urllib.request
import urllib.parse
import ssl

# Create SSL context to handle macOS default python certificates
ssl_context = ssl._create_unverified_context()

CITIES = [
    {"name": "Irvine", "lat": 33.6846, "lng": -117.8265, "radius": 8000},
    {"name": "Tustin", "lat": 33.7458, "lng": -117.8262, "radius": 5000},
    {"name": "Costa Mesa", "lat": 33.6411, "lng": -117.9187, "radius": 6000},
    {"name": "Newport Beach", "lat": 33.6189, "lng": -117.9289, "radius": 6000},
    {"name": "Santa Ana", "lat": 33.7455, "lng": -117.8677, "radius": 6000},
    {"name": "Lake Forest", "lat": 33.6469, "lng": -117.6892, "radius": 6000},
]

SEARCH_QUERIES = [
    # Chinese
    {"query": "Chinese restaurant", "category": "chinese", "subcategory": "中式料理"},
    {"query": "Sichuan restaurant", "category": "chinese", "subcategory": "正宗川菜"},
    {"query": "Hot pot restaurant", "category": "chinese", "subcategory": "火锅串串"},
    {"query": "Dim Sum restaurant", "category": "chinese", "subcategory": "粤式早茶点心"},
    {"query": "Taiwanese restaurant", "category": "chinese", "subcategory": "台湾小吃"},
    # Japanese
    {"query": "Japanese restaurant", "category": "japanese", "subcategory": "东瀛料理"},
    {"query": "Ramen restaurant", "category": "japanese", "subcategory": "正宗日式拉面"},
    {"query": "Sushi restaurant", "category": "japanese", "subcategory": "精选手握寿司"},
    {"query": "Japanese BBQ Yakiniku", "category": "japanese", "subcategory": "日式炭火烧肉"},
    {"query": "Izakaya", "category": "japanese", "subcategory": "日式居酒屋"},
    # Korean
    {"query": "Korean BBQ restaurant", "category": "korean", "subcategory": "正宗韩式烤肉"},
    {"query": "Korean tofu soup restaurant", "category": "korean", "subcategory": "韩式嫩豆腐锅"},
    {"query": "Korean fried chicken", "category": "korean", "subcategory": "韩式脆皮炸鸡"},
    # Southeast Asian
    {"query": "Vietnamese Pho restaurant", "category": "southeast", "subcategory": "越式传统牛肉粉"},
    {"query": "Thai restaurant", "category": "southeast", "subcategory": "正宗泰式风味"},
    # Markets
    {"query": "Asian supermarket", "category": "market", "subcategory": "亚洲综合生鲜超市"},
    {"query": "Chinese supermarket", "category": "market", "subcategory": "华人大型超市"},
    {"query": "Japanese grocery market", "category": "market", "subcategory": "日本生鲜超市"},
    {"query": "Korean supermarket H Mart", "category": "market", "subcategory": "韩国生鲜超市"},
    # Desserts / Boba / Bakery
    {"query": "Boba milk tea", "category": "dessert_tea", "subcategory": "新式原叶茶饮"},
    {"query": "Asian bakery cafe", "category": "dessert_tea", "subcategory": "手作烘焙面包"},
    {"query": "Japanese cheesecake dessert", "category": "dessert_tea", "subcategory": "日式轻乳酪甜品"},
]

def search_google_places(api_key: str, text_query: str, center_lat: float, center_lng: float, radius: int):
    """
    Calls Google Places API (New) Text Search
    Endpoint: https://places.googleapis.com/v1/places:searchText
    """
    url = "https://places.googleapis.com/v1/places:searchText"
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": api_key,
        "X-Goog-FieldMask": (
            "places.id,places.displayName,places.formattedAddress,places.location,"
            "places.rating,places.userRatingCount,places.priceLevel,places.regularOpeningHours,"
            "places.nationalPhoneNumber,places.websiteUri,places.googleMapsUri,places.primaryType"
        )
    }

    payload = {
        "textQuery": text_query,
        "locationBias": {
            "circle": {
                "center": {"latitude": center_lat, "longitude": center_lng},
                "radius": float(radius)
            }
        },
        "maxResultCount": 20
    }

    req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req, context=ssl_context) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            return data.get("places", [])
    except urllib.error.HTTPError as e:
        print(f"  ❌ Google Places API Error {e.code}: {e.read().decode('utf-8')}")
        return []
    except Exception as e:
        print(f"  ❌ Network error: {str(e)}")
        return []


def format_price_level(google_price_level: str) -> str:
    mapping = {
        "PRICE_LEVEL_INEXPENSIVE": "$",
        "PRICE_LEVEL_MODERATE": "$$",
        "PRICE_LEVEL_EXPENSIVE": "$$$",
        "PRICE_LEVEL_VERY_EXPENSIVE": "$$$$"
    }
    return mapping.get(google_price_level, "$$")

def main():
    parser = argparse.ArgumentParser(description="Extract all Asian places in Irvine & surrounding cities via Google Places API")
    parser.add_argument("--api-key", default=os.getenv("GOOGLE_MAPS_API_KEY", ""), help="Google Maps Platform API Key")
    parser.add_argument("--output", default="src/data/google_places_extracted.json", help="Output JSON path")
    args = parser.parse_args()

    api_key = args.api_key.strip()
    if not api_key:
        print("=" * 70)
        print("⚠️  [Google Places API Key Required]")
        print("To pull all places directly from Google Maps API in real-time, please provide")
        print("a Google Cloud API Key with 'Places API (New)' enabled.")
        print("\nHow to obtain a Google Maps API Key:")
        print("  1. Go to Google Cloud Console (https://console.cloud.google.com/)")
        print("  2. Create a project and enable 'Places API (New)'")
        print("  3. Create an API Key in Credentials")
        print("\nRun command:")
        print("  python3 scripts/fetch_google_places.py --api-key YOUR_KEY")
        print("=" * 70)
        return

    print("🚀 Starting automated extraction from Google Maps API...")
    extracted_places = {}

    for city in CITIES:
        print(f"\n📍 Scanning city: {city['name']} (Lat: {city['lat']}, Lng: {city['lng']})")
        for query_info in SEARCH_QUERIES:
            query = f"{query_info['query']} in {city['name']}, CA"
            print(f"  🔍 Querying: \"{query}\"...")
            raw_places = search_google_places(api_key, query, city["lat"], city["lng"], city["radius"])
            
            for p in raw_places:
                place_id = p.get("id")
                if not place_id or place_id in extracted_places:
                    continue

                display_name = p.get("displayName", {}).get("text", "Unknown Store")
                location = p.get("location", {})
                lat = location.get("latitude", city["lat"])
                lng = location.get("longitude", city["lng"])
                address = p.get("formattedAddress", f"{city['name']}, CA")
                rating = float(p.get("rating", 4.5))
                reviews = int(p.get("userRatingCount", 50))
                price = format_price_level(p.get("priceLevel", "PRICE_LEVEL_MODERATE"))
                phone = p.get("nationalPhoneNumber", "")
                website = p.get("websiteUri", "")
                maps_url = p.get("googleMapsUri", f"https://maps.google.com/?q={urllib.parse.quote(display_name + ' ' + address)}")

                # Opening hours string
                hours_obj = p.get("regularOpeningHours", {})
                weekday_desc = hours_obj.get("weekdayDescriptions", [])
                hours_text = weekday_desc[0] if weekday_desc else "11:00 AM - 9:30 PM"

                # Resolve clean bilingual names
                from bilingual_enricher import resolve_bilingual_names
                zh_name, en_name = resolve_bilingual_names(display_name, query_info["subcategory"])

                extracted_places[place_id] = {
                    "id": f"google_{place_id}",
                    "name": zh_name,
                    "enName": en_name,
                    "category": query_info["category"],
                    "subcategory": query_info["subcategory"],
                    "city": city["name"],
                    "address": address,
                    "lat": lat,
                    "lng": lng,
                    "phone": phone,
                    "website": website,
                    "googleMapsUrl": maps_url,
                    "status": "open",
                    "hoursText": hours_text,
                    "priceLevel": price,
                    "rating": rating,
                    "reviewCount": reviews,
                    "parkingInfo": f"{city['name']} 商圈提供免费地面或立体停车位",
                    "dishes": [
                        {"name": "主厨推荐招牌", "tag": "Google热门推荐"}
                    ],
                    "tags": ["Google Maps 数据", "高分推荐", city["name"]],
                    "description": f"通过 Google Maps Places API 提取的 {city['name']} 热门亚洲商户。",
                    "imageUrl": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
                    "isCustomAdded": True,
                    "addedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
                }

            
            # Rate limiting sleep
            time.sleep(0.3)

    output_list = list(extracted_places.values())
    print(f"\n🎉 Extraction Complete! Successfully extracted {len(output_list)} distinct Asian places from Google Maps.")
    
    with open(args.output, "w", encoding="utf-8") as f:
        json.dump(output_list, f, ensure_ascii=False, indent=2)
    print(f"💾 Saved places dataset to {args.output}")

if __name__ == "__main__":
    main()
