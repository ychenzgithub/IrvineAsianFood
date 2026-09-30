/**
 * Bilingual (Chinese & English) Name Resolution & Enrichment Engine
 * ----------------------------------------------------------------
 * Automatically parses, cross-references, and separates Chinese and English names
 * for any store data obtained from Google Maps API or web crawlers.
 */

// Known Asian Brand Bilingual Matrix (Orange County & SoCal)
const BRAND_BILINGUAL_MAP: Record<string, { zh: string; en: string }> = {
  // Supermarkets
  'h mart': { zh: 'H Mart 韩国生鲜超市', en: 'H Mart' },
  'hmart': { zh: 'H Mart 韩国生鲜超市', en: 'H Mart' },
  '99 ranch': { zh: '99大华超市', en: '99 Ranch Market' },
  '99 ranch market': { zh: '99大华超市', en: '99 Ranch Market' },
  'mitsuwa': { zh: '三和日本生鲜超市', en: 'Mitsuwa Marketplace' },
  'mitsuwa marketplace': { zh: '三和日本生鲜超市', en: 'Mitsuwa Marketplace' },
  'tokyo central': { zh: '东京中央日本超市', en: 'Tokyo Central' },
  'seiwa': { zh: '清水日本超市', en: 'Seiwa Market' },
  'zion market': { zh: '锡安韩国超级市场', en: 'Zion Market' },
  'zion mart': { zh: '锡安韩国超市', en: 'Zion Market' },
  'marukai': { zh: '丸海日本超市', en: 'Marukai Market' },
  'hanmi': { zh: '韩美韩国超市', en: 'Hanmi Market' },

  // Hot Pot & Chinese Dining
  'haidilao': { zh: '海底捞火锅', en: 'Haidilao Hot Pot' },
  'haidilao hot pot': { zh: '海底捞火锅', en: 'Haidilao Hot Pot' },
  'tai er': { zh: '太二酸菜鱼', en: 'Tai Er Sauerkraut Fish' },
  'tai er suancai fish': { zh: '太二酸菜鱼', en: 'Tai Er Sauerkraut Fish' },
  'sichuan impression': { zh: '锦城里川菜', en: 'Sichuan Impression' },
  'din tai fung': { zh: '鼎泰丰', en: 'Din Tai Fung' },
  'paradise dynasty': { zh: '乐天皇朝八色小笼', en: 'Paradise Dynasty' },
  'j.zhou': { zh: '周舍东方料理', en: 'J.Zhou Oriental Cuisine' },
  'j zhou': { zh: '周舍东方料理', en: 'J.Zhou Oriental Cuisine' },
  'a&j': { zh: '半亩园', en: 'A&J Restaurant' },
  'a & j': { zh: '半亩园', en: 'A&J Restaurant' },
  'a&j restaurant': { zh: '半亩园', en: 'A&J Restaurant' },
  'capital seafood': { zh: '凯悦海鲜酒家', en: 'Capital Seafood' },
  'tasty garden': { zh: '稻香茶餐厅', en: 'Tasty Garden' },
  'tasty noodle house': { zh: '美味生煎', en: 'Tasty Noodle House' },
  'meizhou dongpo': { zh: '眉州东坡', en: 'Meizhou Dongpo' },
  'tim ho wan': { zh: '添好运点心', en: 'Tim Ho Wan' },
  'bafang dumpling': { zh: '八方云集锅贴水饺', en: 'Bafang Dumpling' },
  'boiling point': { zh: '沸点臭臭锅', en: 'Boiling Point' },
  'yin tang': { zh: '隐烫麻辣烫', en: 'Yin Tang Spicy Hot Pot' },
  'chongqing lao mei zi': { zh: '重庆老妹子火锅', en: 'Chongqing Lao Mei Zi' },
  'mian': { zh: '滋味小面', en: 'Mian Noodle' },
  'beijing restaurant': { zh: '北京烤鸭馆', en: 'Beijing Restaurant' },
  'shanghai restaurant': { zh: '上海本帮小馆', en: 'Shanghai Restaurant' },
  'yue yan': { zh: '粤宴海鲜酒家', en: 'Yue Yan Cantonese Cuisine' },
  'super yummy': { zh: '远山少年中餐厅', en: 'Super Yummy' },

  // Japanese
  'anjin': { zh: '安神日式炭火烧肉', en: 'Anjin Japanese BBQ' },
  'santouka': { zh: '山头火北海道拉面', en: 'Hokkaido Ramen Santouka' },
  'hironori': { zh: '弘典手工精酿拉面', en: 'HiroNori Craft Ramen' },
  'shin-sen-gumi': { zh: '新撰组博多拉面', en: 'Shin-Sen-Gumi Hakata Ramen' },
  'shinsengumi': { zh: '新撰组博多拉面', en: 'Shin-Sen-Gumi' },
  'hannosuke': { zh: '金子半之助天妇罗', en: 'Kaneko Hannosuke' },
  'kaneko hannosuke': { zh: '金子半之助天妇罗', en: 'Kaneko Hannosuke' },
  'nana san': { zh: '七三寿司割烹', en: 'Nana San Sushi' },
  'marugame udon': { zh: '丸龟制面', en: 'Marugame Udon' },
  'kitakata': { zh: '喜多方坂内拉面', en: 'Kitakata Ramen Ban Nai' },
  'kitakata ramen ban nai': { zh: '喜多方坂内拉面', en: 'Kitakata Ramen Ban Nai' },
  'gyu-kaku': { zh: '牛角日式炭火烤肉', en: 'Gyu-Kaku Japanese BBQ' },
  'gyukaku': { zh: '牛角日式烤肉', en: 'Gyu-Kaku Japanese BBQ' },
  'nobu': { zh: 'NOBU 殿堂日料', en: 'Nobu Newport Beach' },
  'kura': { zh: '藏寿司回转寿司', en: 'Kura Revolving Sushi Bar' },
  'kura revolving sushi bar': { zh: '藏寿司回转寿司', en: 'Kura Revolving Sushi Bar' },
  'coco ichibanya': { zh: '壱番屋咖喱', en: 'Curry House CoCo Ichibanya' },
  'pepper lunch': { zh: '胡椒厨房铁板', en: 'Pepper Lunch' },
  'taiko': { zh: '太鼓日式料理', en: 'Taiko Japanese Restaurant' },
  'tsujita': { zh: '辻田沾面', en: 'Tsujita Artisan Noodle' },
  'omakase by gino': { zh: 'Gino 寿司厨师定制', en: 'Omakase by Gino' },

  // Korean
  'baekjeong': { zh: '姜虎东白丁烤肉', en: 'Baekjeong Korean BBQ' },
  'kang hodong baekjeong': { zh: '姜虎东白丁烤肉', en: 'Baekjeong Korean BBQ' },
  'kaju': { zh: '加州嫩豆腐煲', en: 'Kaju Soft Tofu' },
  'kaju soft tofu': { zh: '加州嫩豆腐煲', en: 'Kaju Soft Tofu' },
  'bb.q chicken': { zh: 'bb.q Chicken 韩式炸鸡', en: 'bb.q Chicken' },
  'tang 190': { zh: '190度韩式牛骨汤', en: 'Tang 190' },
  'song hak': { zh: '松鹤韩式烤牛肠', en: 'Song Hak Korean BBQ' },
  'bbq chicken': { zh: 'bb.q Chicken 橄榄油炸鸡', en: 'bb.q Chicken' },
  'moobongri': { zh: '武凤里韩式米肠汤', en: 'Moobongri Soondae' },
  'kyochon': { zh: '校村炸鸡', en: 'Kyochon Chicken' },

  // Southeast Asian
  'sup noodle bar': { zh: '舒普牛肋排越南粉', en: 'Sup Noodle Bar' },
  'anqi': { zh: '安南高级越法料理', en: 'AnQi Bistro' },
  'little sister': { zh: '小妹妹东南亚融合餐馆', en: 'Little Sister' },
  'pho holic': { zh: 'Pho Holic 越南牛肉粉', en: 'Pho Holic' },
  'pho 79': { zh: '79号米其林越南粉', en: 'Pho 79' },
  'pho 45': { zh: '45号正宗越南粉', en: 'Pho 45' },
  'tuk tuk': { zh: '嘟嘟泰式街头料理', en: 'Tuk Tuk Thai Street Food' },
  'hanuman thai': { zh: '哈努曼正宗泰餐', en: 'Hanuman Thai Eatery' },

  // Boba, Dessert & Bakery
  'heytea': { zh: '喜茶', en: 'HEYTEA' },
  'chagee': { zh: '霸王茶姬', en: 'CHAGEE Modern Tea Bar' },
  'orobae': { zh: '奥罗贝精品原茶', en: 'Orobae' },
  'omomo': { zh: 'OMOMO 鲜茶烤布蕾', en: 'Omomo Tea Shoppe' },
  'omomo tea shoppe': { zh: 'OMOMO 鲜茶工作室', en: 'Omomo Tea Shoppe' },
  'sunright': { zh: '日出茶研鲜果茶', en: 'Sunright Tea Studio' },
  'sunright tea studio': { zh: '日出茶研', en: 'Sunright Tea Studio' },
  'meet fresh': { zh: '鲜芋仙手作甜品', en: 'Meet Fresh' },
  'lady m': { zh: 'Lady M 法式千层蛋糕', en: 'Lady M Cake Boutique' },
  '85c': { zh: '85°C 烘焙咖啡', en: '85°C Bakery Cafe' },
  '85°c bakery cafe': { zh: '85°C 烘焙咖啡', en: '85°C Bakery Cafe' },
  'sunmerry': { zh: '圣玛莉面包烘焙', en: 'Sunmerry Bakery' },
  'uncle tetsu': { zh: '彻思叔叔轻乳酪蛋糕', en: 'Uncle Tetsu' },
  'somisomi': { zh: 'SomiSomi 鲷鱼烧冰淇淋', en: 'SomiSomi Soft Serve' },
  'mochinut': { zh: 'Mochinut 麻薯甜甜圈', en: 'Mochinut' },
  'paris baguette': { zh: '巴黎贝甜烘焙', en: 'Paris Baguette' },
  'tous les jours': { zh: '多乐之日法式烘焙', en: 'Tous Les Jours' },
  'beard papa': { zh: '贝儿多爸爸爆浆泡芙', en: "Beard Papa's" },
  'sul & beans': { zh: '韩式雪花冰甜品', en: 'Sul & Beans' },
  'half & half': { zh: '伴伴堂黑糖珍奶', en: 'Half & Half Tea House' },
};

/**
 * Checks if a string contains Chinese characters
 */
export function hasChinese(str: string): boolean {
  return /[\u4e00-\u9fa5]/.test(str);
}

/**
 * Separates mixed raw string into Chinese and English parts
 */
export function parseBilingualNames(rawName: string, fallbackEn = ''): { zhName: string; enName: string } {
  if (!rawName) {
    return { zhName: '亚洲风味名店', enName: fallbackEn || 'Asian Cuisine' };
  }

  const normalizedLower = rawName.toLowerCase().trim();

  // 1. Direct dictionary match or prefix match
  for (const [key, mapping] of Object.entries(BRAND_BILINGUAL_MAP)) {
    if (normalizedLower.includes(key)) {
      // If rawName has extra location details e.g. "Irvine"
      const suffix = rawName.includes('Irvine') ? ' (Irvine)' : rawName.includes('Tustin') ? ' (Tustin)' : '';
      return {
        zhName: mapping.zh,
        enName: mapping.en + suffix,
      };
    }
  }

  // 2. If raw name contains both Chinese and English in parentheses or separators
  // e.g. "海底捞 (Haidilao)" or "远山少年 Super Yummy" or "锦城里 - Sichuan Impression"
  const bracketMatch = rawName.match(/([\u4e00-\u9fa5\s\w\d]+)[\(（]([^\)）]+)[\)）]/);
  if (bracketMatch) {
    const part1 = bracketMatch[1].trim();
    const part2 = bracketMatch[2].trim();
    if (hasChinese(part1) && !hasChinese(part2)) {
      return { zhName: part1, enName: part2 };
    }
    if (!hasChinese(part1) && hasChinese(part2)) {
      return { zhName: part2, enName: part1 };
    }
  }

  // 3. Separation by dash or slash (e.g. "眉州东坡 / Meizhou Dongpo")
  if (rawName.includes('/') || rawName.includes('-')) {
    const parts = rawName.split(/[\/\-–]/).map((p) => p.trim());
    const zhPart = parts.find((p) => hasChinese(p));
    const enPart = parts.find((p) => !hasChinese(p) && p.length > 0);
    if (zhPart && enPart) {
      return { zhName: zhPart, enName: enPart };
    }
  }

  // 4. Mixed Chinese and English words (e.g. "Super Yummy 远山少年")
  const zhMatches = rawName.match(/[\u4e00-\u9fa5]+/g);
  const enMatches = rawName.match(/[A-Za-z0-9\s'&°\.]+/g);

  if (zhMatches && zhMatches.length > 0) {
    const zhExtracted = zhMatches.join('');
    const enExtracted = enMatches ? enMatches.join(' ').trim() : fallbackEn || rawName;
    if (enExtracted && enExtracted !== zhExtracted && enExtracted.length > 1) {
      return { zhName: zhExtracted, enName: enExtracted };
    }
    return { zhName: rawName, enName: fallbackEn || rawName };
  }

  // 5. English only name -> derive Chinese title based on keywords
  return generateChineseForEnglishName(rawName);
}

/**
 * Generates an appropriate Chinese title for English-only store names
 */
function generateChineseForEnglishName(enName: string): { zhName: string; enName: string } {
  const lower = enName.toLowerCase();

  let zhPrefix = enName;
  if (lower.includes('hot pot') || lower.includes('hotpot')) {
    zhPrefix = `${enName.replace(/hot\s*pot/i, '').trim()} 特色火锅`;
  } else if (lower.includes('bbq') || lower.includes('barbecue') || lower.includes('yakiniku')) {
    zhPrefix = `${enName.replace(/(bbq|barbecue|yakiniku)/i, '').trim()} 炭火烤肉`;
  } else if (lower.includes('ramen')) {
    zhPrefix = `${enName.replace(/ramen/i, '').trim()} 日式拉面`;
  } else if (lower.includes('sushi')) {
    zhPrefix = `${enName.replace(/sushi/i, '').trim()} 寿司割烹`;
  } else if (lower.includes('pho')) {
    zhPrefix = `${enName.trim()} 正宗越南牛肉粉`;
  } else if (lower.includes('thai')) {
    zhPrefix = `${enName.replace(/thai/i, '').trim()} 泰式风味`;
  } else if (lower.includes('tea') || lower.includes('boba')) {
    zhPrefix = `${enName.trim()} 原叶茶饮`;
  } else if (lower.includes('bakery') || lower.includes('cake')) {
    zhPrefix = `${enName.trim()} 烘焙甜品工坊`;
  } else if (lower.includes('market') || lower.includes('grocery')) {
    zhPrefix = `${enName.trim()} 亚洲生鲜超市`;
  } else if (lower.includes('noodle')) {
    zhPrefix = `${enName.trim()} 风味面馆`;
  } else if (lower.includes('dumpling')) {
    zhPrefix = `${enName.trim()} 水饺点心`;
  }

  return {
    zhName: zhPrefix.trim(),
    enName: enName.trim(),
  };
}
