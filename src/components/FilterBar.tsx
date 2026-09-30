import React from 'react';
import { MainCategory, PriceLevel, FilterState, BusinessStatus } from '../types/food';
import { CATEGORY_CONFIG } from '../utils/formatters';
import { Sparkles, UtensilsCrossed, Tag, DollarSign, Filter, X } from 'lucide-react';

interface FilterBarProps {
  filters: FilterState;
  onUpdateFilters: (updates: Partial<FilterState>) => void;
  onResetFilters: () => void;
}

const CATEGORIES: { key: 'All' | MainCategory; label: string; icon: string }[] = [
  { key: 'All', label: '全部美食', icon: '✨' },
  { key: 'chinese', label: '中式料理', icon: '🥢' },
  { key: 'japanese', label: '东瀛日料', icon: '🍱' },
  { key: 'korean', label: '正宗韩餐', icon: '🥘' },
  { key: 'southeast', label: '东南亚风味', icon: '🍲' },
  { key: 'market', label: '亚洲生鲜超市', icon: '🛒' },
  { key: 'dessert_tea', label: '奶茶甜品烘焙', icon: '🧋' },
  { key: 'coming_soon', label: '新店速递 / Coming Soon', icon: '🔥' },
];

const POPULAR_TAGS = [
  '夜宵推荐',
  '米其林推荐',
  '米其林必比登推荐',
  '排队王',
  '适合聚餐',
  '服务天花板',
  '宠物友好',
  '手打乌冬',
  '纯素拉面极佳',
];

const PRICES: ('All' | PriceLevel)[] = ['All', '$', '$$', '$$$', '$$$$'];

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onUpdateFilters,
  onResetFilters,
}) => {
  const hasActiveFilters =
    filters.category !== 'All' ||
    filters.priceLevel !== 'All' ||
    filters.tags.length > 0 ||
    filters.status !== 'All' ||
    filters.subcategory !== 'All' ||
    filters.plazaId !== 'All' ||
    filters.searchQuery !== '';

  const toggleTag = (tag: string) => {
    if (filters.tags.includes(tag)) {
      onUpdateFilters({ tags: filters.tags.filter((t) => t !== tag) });
    } else {
      onUpdateFilters({ tags: [...filters.tags, tag] });
    }
  };

  return (
    <div className="bg-slate-900/95 border-b border-slate-800/80 px-4 py-2.5 flex flex-col gap-2 shrink-0 z-20">
      {/* Category Pills Slider */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {CATEGORIES.map((cat) => {
          const isActive = filters.category === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => onUpdateFilters({ category: cat.key, subcategory: 'All' })}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 shrink-0 ${
                isActive
                  ? 'bg-brand-500 text-white shadow-glow scale-[1.02]'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 hover:text-white border border-slate-700/50'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sub Filters Row: Price, Popular Tags, Clear Filters */}
      <div className="flex items-center justify-between gap-3 text-xs overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 shrink-0">
          {/* Price Selector */}
          <div className="flex items-center bg-slate-950/80 rounded-lg p-0.5 border border-slate-800">
            {PRICES.map((p) => {
              const isActive = filters.priceLevel === p;
              return (
                <button
                  key={p}
                  onClick={() => onUpdateFilters({ priceLevel: p })}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                    isActive
                      ? 'bg-slate-800 text-brand-400 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {p === 'All' ? '全部价位' : p}
                </button>
              );
            })}
          </div>

          {/* Quick Filter Tags */}
          <div className="flex items-center gap-1.5">
            {POPULAR_TAGS.slice(0, 5).map((tag) => {
              const isSelected = filters.tags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-all ${
                    isSelected
                      ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40'
                      : 'bg-slate-800/60 text-slate-400 border border-slate-700/40 hover:text-slate-200 hover:bg-slate-700'
                  }`}
                >
                  #{tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Clear Filters button */}
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1 text-[11px] text-brand-400 hover:text-brand-300 font-medium px-2 py-0.5 rounded bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/20 shrink-0"
          >
            <X className="w-3 h-3" />
            <span>重置筛选</span>
          </button>
        )}
      </div>
    </div>
  );
};
