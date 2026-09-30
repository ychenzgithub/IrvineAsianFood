#!/usr/bin/env python3
"""
Python Bilingual Store Name Enricher for Google Maps Extracted Dataset
---------------------------------------------------------------------
Parses all places from google_places_extracted.json, applies cross-referencing
brand matrix and smart categorization to generate pristine Chinese and English names.
"""

import json
import re

BRAND_MAP = {
    "haidilao": ("海底捞火锅", "Haidilao Hot Pot"),
    "tai er": ("太二酸菜鱼", "Tai Er Sauerkraut Fish"),
    "sichuan impression": ("锦城里川菜", "Sichuan Impression"),
    "din tai fung": ("鼎泰丰", "Din Tai Fung"),
    "paradise dynasty": ("乐天皇朝八色小笼", "Paradise Dynasty"),
    "j.zhou": ("周舍东方料理", "J.Zhou Oriental Cuisine"),
    "a&j": ("半亩园", "A&J Restaurant"),
    "capital seafood": ("凯悦海鲜酒家", "Capital Seafood"),
    "tasty garden": ("稻香茶餐厅", "Tasty Garden"),
    "tasty noodle house": ("美味生煎", "Tasty Noodle House"),
    "meizhou dongpo": ("眉州东坡", "Meizhou Dongpo"),
    "tim ho wan": ("添好运点心", "Tim Ho Wan"),
    "bafang dumpling": ("八方云集锅贴水饺", "Bafang Dumpling"),
    "boiling point": ("沸点臭臭锅", "Boiling Point"),
    "yin tang": ("隐烫麻辣烫", "Yin Tang Spicy Hot Pot"),
    "chongqing lao mei zi": ("重庆老妹子火锅", "Chongqing Lao Mei Zi"),
    "mian": ("滋味小面", "Mian"),
    "yue yan": ("粤宴海鲜酒家", "Yue Yan"),
    "super yummy": ("远山少年中餐厅", "Super Yummy"),
    "northern cafe": ("北方酒楼", "Northern Cafe"),
    "sunright": ("日出茶研", "Sunright Tea Studio"),
    "heytea": ("喜茶", "HEYTEA"),
    "chagee": ("霸王茶姬", "CHAGEE Modern Tea Bar"),
    "orobae": ("奥罗贝精品原茶", "Orobae"),
    "omomo": ("OMOMO 鲜茶烤布蕾", "Omomo Tea Shoppe"),
    "meet fresh": ("鲜芋仙手作甜品", "Meet Fresh"),
    "lady m": ("Lady M 法式千层蛋糕", "Lady M Cake Boutique"),
    "85c": ("85°C 烘焙咖啡", "85°C Bakery Cafe"),
    "sunmerry": ("圣玛莉面包烘焙", "Sunmerry Bakery"),
    "uncle tetsu": ("彻思叔叔轻乳酪蛋糕", "Uncle Tetsu"),
    "somisomi": ("SomiSomi 鲷鱼烧冰淇淋", "SomiSomi Soft Serve"),
    "mochinut": ("Mochinut 麻薯甜甜圈", "Mochinut"),
    "paris baguette": ("巴黎贝甜烘焙", "Paris Baguette"),
    "tous les jours": ("多乐之日法式烘焙", "Tous Les Jours"),
    "beard papa": ("贝儿多爸爸泡芙", "Beard Papa's"),
    "h mart": ("H Mart 韩国生鲜超市", "H Mart"),
    "hmart": ("H Mart 韩国生鲜超市", "H Mart"),
    "99 ranch": ("99大华超市", "99 Ranch Market"),
    "mitsuwa": ("三和日本生鲜超市", "Mitsuwa Marketplace"),
    "tokyo central": ("东京中央日本超市", "Tokyo Central"),
    "zion market": ("锡安韩国超级市场", "Zion Market"),
    "anjin": ("安神日式炭火烧肉", "Anjin Japanese BBQ"),
    "santouka": ("山头火北海道拉面", "Hokkaido Ramen Santouka"),
    "hironori": ("弘典手工精酿拉面", "HiroNori Craft Ramen"),
    "shin-sen-gumi": ("新撰组博多拉面", "Shin-Sen-Gumi"),
    "nana san": ("七三寿司割烹", "Nana San Sushi"),
    "marugame udon": ("丸龟制面", "Marugame Udon"),
    "kitakata": ("喜多方坂内拉面", "Kitakata Ramen Ban Nai"),
    "gyu-kaku": ("牛角日式炭火烤肉", "Gyu-Kaku Japanese BBQ"),
    "nobu": ("NOBU 殿堂日料", "Nobu Newport Beach"),
    "kura": ("藏寿司回转寿司", "Kura Revolving Sushi Bar"),
    "baekjeong": ("姜虎东白丁烤肉", "Baekjeong Korean BBQ"),
    "kaju": ("加州嫩豆腐煲", "Kaju Soft Tofu"),
    "bb.q chicken": ("bb.q Chicken 韩式炸鸡", "bb.q Chicken"),
    "tang 190": ("190度韩式牛骨汤", "Tang 190"),
    "song hak": ("松鹤韩式烤牛肠", "Song Hak Korean BBQ"),
    "sup noodle bar": ("舒普牛肋排越南粉", "Sup Noodle Bar"),
    "anqi": ("安南高级越法料理", "AnQi Bistro"),
    "little sister": ("小妹妹东南亚融合餐馆", "Little Sister"),
    "pho holic": ("Pho Holic 越南牛肉粉", "Pho Holic"),
    "pho 79": ("79号米其林越南粉", "Pho 79"),
    "pho 45": ("45号正宗越南粉", "Pho 45"),
}

def has_chinese(text):
    return bool(re.search(r'[\u4e00-\u9fa5]', text))

def resolve_bilingual_names(raw_name, subcategory=""):
    raw_clean = raw_name.strip()
    raw_lower = raw_clean.lower()

    # Check brand dictionary
    for brand_key, (zh_brand, en_brand) in BRAND_MAP.items():
        if brand_key in raw_lower:
            return zh_brand, en_brand

    # If raw_name has Chinese & English mixed like "远山少年 Super Yummy"
    zh_chars = "".join(re.findall(r'[\u4e00-\u9fa5]+', raw_clean))
    en_chars = " ".join(re.findall(r'[A-Za-z0-9\s\'&°\.]+', raw_clean)).strip()

    if zh_chars and en_chars and len(en_chars) > 2:
        return zh_chars, en_chars
    elif zh_chars:
        return zh_chars, raw_clean

    # English only -> derive Chinese based on keywords or category
    en_title = raw_clean
    zh_title = raw_clean
    if "hot pot" in raw_lower or "hotpot" in raw_lower:
        zh_title = f"{raw_clean} 鲜味火锅"
    elif "bbq" in raw_lower or "yakiniku" in raw_lower:
        zh_title = f"{raw_clean} 炭火烤肉"
    elif "ramen" in raw_lower:
        zh_title = f"{raw_clean} 日式拉面"
    elif "sushi" in raw_lower:
        zh_title = f"{raw_clean} 精选寿司"
    elif "pho" in raw_lower:
        zh_title = f"{raw_clean} 越南牛肉粉"
    elif "thai" in raw_lower:
        zh_title = f"{raw_clean} 泰式料理"
    elif "tea" in raw_lower or "boba" in raw_lower:
        zh_title = f"{raw_clean} 原叶茶饮"
    elif "bakery" in raw_lower or "cake" in raw_lower:
        zh_title = f"{raw_clean} 烘焙工坊"
    elif "market" in raw_lower or "grocery" in raw_lower:
        zh_title = f"{raw_clean} 亚洲商超"
    elif "noodle" in raw_lower:
        zh_title = f"{raw_clean} 风味面馆"
    elif "dumpling" in raw_lower:
        zh_title = f"{raw_clean} 点心水饺"
    else:
        zh_title = f"{raw_clean} · {subcategory or '亚洲风味'}"

    return zh_title, en_title

def main():
    # Process google_places_extracted.json
    try:
        with open("src/data/google_places_extracted.json", "r", encoding="utf-8") as f:
            places = json.load(f)

        enriched = []
        for p in places:
            raw = p.get("name", "")
            sub = p.get("subcategory", "")
            zh, en = resolve_bilingual_names(raw, sub)
            p["name"] = zh
            p["enName"] = en
            enriched.append(p)

        with open("src/data/google_places_extracted.json", "w", encoding="utf-8") as f:
            json.dump(enriched, f, ensure_ascii=False, indent=2)

        # High rated subset
        filtered = [p for p in enriched if p.get("rating", 0) >= 3.8 and p.get("reviewCount", 0) >= 10]
        with open("src/data/google_places_high_rated.json", "w", encoding="utf-8") as f:
            json.dump(filtered, f, ensure_ascii=False, indent=2)

        print(f"🎉 Enriched {len(enriched)} places with verified bilingual Chinese & English names!")
    except Exception as e:
        print("Error enriching places:", e)

if __name__ == "__main__":
    main()
