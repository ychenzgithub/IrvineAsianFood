import { MainCategory, BusinessStatus } from '../types/food';

export const CATEGORY_CONFIG: Record<
  MainCategory,
  { label: string; enLabel: string; color: string; bgClass: string; textClass: string; icon: string }
> = {
  chinese: {
    label: '中式珍馐',
    enLabel: 'Chinese',
    color: '#EF4444',
    bgClass: 'bg-red-500/10 border-red-500/30 text-red-400',
    textClass: 'text-red-400',
    icon: '🥢',
  },
  japanese: {
    label: '东瀛日料',
    enLabel: 'Japanese',
    color: '#EC4899',
    bgClass: 'bg-pink-500/10 border-pink-500/30 text-pink-400',
    textClass: 'text-pink-400',
    icon: '🍱',
  },
  korean: {
    label: '韩式风味',
    enLabel: 'Korean',
    color: '#3B82F6',
    bgClass: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
    textClass: 'text-blue-400',
    icon: '🥘',
  },
  southeast: {
    label: '东南亚料理',
    enLabel: 'SE Asian',
    color: '#10B981',
    bgClass: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    textClass: 'text-emerald-400',
    icon: '🍲',
  },
  market: {
    label: '亚洲生鲜超市',
    enLabel: 'Asian Markets',
    color: '#14B8A6',
    bgClass: 'bg-teal-500/10 border-teal-500/30 text-teal-400',
    textClass: 'text-teal-400',
    icon: '🛒',
  },
  dessert_tea: {
    label: '奶茶甜品烘焙',
    enLabel: 'Boba & Sweets',
    color: '#F59E0B',
    bgClass: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    textClass: 'text-amber-400',
    icon: '🧋',
  },
  coming_soon: {
    label: '新店速递 / 筹备中',
    enLabel: 'Coming Soon',
    color: '#A855F7',
    bgClass: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
    textClass: 'text-purple-400',
    icon: '✨',
  },
};

export const STATUS_CONFIG: Record<
  BusinessStatus,
  { label: string; color: string; badgeClass: string }
> = {
  open: {
    label: '营业中',
    color: '#10B981',
    badgeClass: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
  },
  grand_opening: {
    label: '新开业 (New)',
    color: '#F59E0B',
    badgeClass: 'bg-amber-500/15 text-amber-400 border border-amber-500/30 animate-pulse-subtle',
  },
  coming_soon: {
    label: '即将开业 (Coming Soon)',
    color: '#A855F7',
    badgeClass: 'bg-purple-500/15 text-purple-300 border border-purple-500/30',
  },
  temporarily_closed: {
    label: '暂停营业',
    color: '#64748B',
    badgeClass: 'bg-slate-500/15 text-slate-400 border border-slate-500/30',
  },
};

/**
 * Calculate distance between two coordinates in miles using Haversine formula
 */
export function calculateDistanceInMiles(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3958.8; // Earth's radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
}

/**
 * Format price level to display
 */
export function formatPriceLevel(price: string): string {
  switch (price) {
    case '$':
      return '$ (人均 $15以下)';
    case '$$':
      return '$$ (人均 $15-$35)';
    case '$$$':
      return '$$$ (人均 $35-$70)';
    case '$$$$':
      return '$$$$ (人均 $70以上)';
    default:
      return price;
  }
}
