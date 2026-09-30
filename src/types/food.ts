export type City = 
  | 'Irvine' 
  | 'Tustin' 
  | 'Costa Mesa' 
  | 'Newport Beach' 
  | 'Santa Ana' 
  | 'Lake Forest';

export type MainCategory = 
  | 'chinese'      // 中餐 (Sichuan, Cantonese, Hotpot, Jiangnan, Taiwanese, BBQ...)
  | 'japanese'     // 日料 (Sushi, Ramen, Yakiniku, Izakaya...)
  | 'korean'       // 韩餐 (K-BBQ, Tofu Soup, Fried Chicken, Street Food...)
  | 'southeast'    // 东南亚 (Vietnamese Pho, Thai, Singaporean/Malaysian...)
  | 'market'       // 亚洲超市 & 生鲜 (99 Ranch, Mitsuwa, H Mart, Zion...)
  | 'dessert_tea'  // 奶茶 & 甜品 & 烘焙 (Heytea, CHAGEE, Omomo, Meet Fresh, Bakeries...)
  | 'coming_soon'; // 即将开业 / 新店速递

export type PriceLevel = '$' | '$$' | '$$$' | '$$$$';

export type BusinessStatus = 'open' | 'grand_opening' | 'coming_soon' | 'temporarily_closed';

export interface SignatureDish {
  name: string;
  enName?: string;
  tag?: string; // e.g. "必点爆款", "招牌", "微辣"
  price?: string;
  photoUrl?: string;
}

export interface Place {
  id: string;
  name: string;          // 中文店名
  enName: string;        // 英文店名
  category: MainCategory;
  subcategory: string;   // e.g. "川湘风味", "火锅烤串", "正宗拉面", "韩式烤肉", "大型生鲜超市"
  city: City;
  plazaId?: string;      // 关联的 Plaza ID
  plazaName?: string;    // e.g. "Diamond Jamboree", "Culver Plaza"
  address: string;
  lat: number;
  lng: number;
  phone?: string;
  website?: string;
  yelpUrl?: string;
  googleMapsUrl?: string;
  status: BusinessStatus;
  openingDate?: string;  // e.g. "2024年秋季开业" or "2026年开业" or "预计2026 Q4"
  hoursText: string;     // e.g. "11:00 AM - 10:00 PM"
  openHour?: number;     // 24-hr format (e.g. 11)
  closeHour?: number;    // 24-hr format (e.g. 22 or 24 for midnight)
  priceLevel: PriceLevel;
  rating: number;        // e.g. 4.7
  reviewCount: number;   // e.g. 1280
  parkingInfo: string;   // e.g. "商圈自带大型免费停车场，但周末饭点较紧张"
  parkingScore?: number; // 1-5
  dishes: SignatureDish[];
  tags: string[];        // e.g. ["夜宵推荐", "米其林推荐", "排队王", "宠物友好", "适合聚餐"]
  description: string;   // 简要介绍 & 推荐理由
  imageUrl: string;      // 封面大图
  logoUrl?: string;      // 店铺 Logo
  isFavorite?: boolean;
  addedAt?: string;      // timestamp for newly synced places
  isCustomAdded?: boolean; // user or web-scraped
}

export interface Plaza {
  id: string;
  name: string;
  enName: string;
  city: City;
  address: string;
  lat: number;
  lng: number;
  description: string;
  parkingGuide: string;
  featuredStores: string[];
  imageUrl: string;
  totalAsianPlaces?: number;
}

export interface FilterState {
  searchQuery: string;
  city: 'All' | City;
  category: 'All' | MainCategory;
  subcategory: string;
  plazaId: string;
  priceLevel: 'All' | PriceLevel;
  tags: string[];
  status: 'All' | BusinessStatus;
  onlyFavorites: boolean;
  sortBy: 'recommended' | 'rating' | 'distance' | 'reviews' | 'priceAsc' | 'priceDesc';
}
