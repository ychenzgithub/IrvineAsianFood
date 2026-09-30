import React from 'react';
import { Place, FilterState } from '../types/food';
import { CATEGORY_CONFIG, STATUS_CONFIG, calculateDistanceInMiles } from '../utils/formatters';
import { 
  Search, 
  X, 
  Star, 
  MapPin, 
  Heart, 
  ArrowUpDown, 
  Navigation, 
  ExternalLink,
  ChevronRight,
  Clock,
  Sparkles
} from 'lucide-react';
import { UserLocation } from '../hooks/useGeolocation';

interface SidebarListProps {
  places: Place[];
  selectedPlaceId: string | null;
  onSelectPlace: (placeId: string) => void;
  favorites: string[];
  onToggleFavorite: (placeId: string) => void;
  filters: FilterState;
  onUpdateFilters: (updates: Partial<FilterState>) => void;
  userLocation: UserLocation | null;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export const SidebarList: React.FC<SidebarListProps> = ({
  places,
  selectedPlaceId,
  onSelectPlace,
  favorites,
  onToggleFavorite,
  filters,
  onUpdateFilters,
  userLocation,
  isOpen,
  onToggleOpen,
}) => {
  return (
    <div
      className={`absolute md:relative z-20 top-0 bottom-0 left-0 flex flex-col bg-slate-900/95 md:bg-slate-900/90 backdrop-blur-xl border-r border-slate-800 transition-all duration-300 ${
        isOpen ? 'w-full sm:w-[420px] translate-x-0' : 'w-0 -translate-x-full md:translate-x-0 md:w-0 overflow-hidden'
      }`}
      style={{ minWidth: isOpen ? undefined : 0 }}
    >
      {/* Search and Sort Header */}
      <div className="p-3.5 border-b border-slate-800 flex flex-col gap-2.5 shrink-0 bg-slate-950/40">
        {/* Search Input Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onUpdateFilters({ searchQuery: e.target.value })}
            placeholder="搜索中英文店名、菜系、招牌菜(如烤肉/拉面)..."
            className="w-full pl-9 pr-8 py-2 rounded-xl text-xs bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/50 transition-all"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onUpdateFilters({ searchQuery: '' })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Stats & Sort Selector */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <span>找到 <strong className="text-brand-400 font-bold">{places.length}</strong> 家好店</span>
            {filters.plazaId !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-brand-500/20 text-brand-300 text-[11px] border border-brand-500/30">
                商圈筛选
                <button onClick={() => onUpdateFilters({ plazaId: 'All' })}>
                  <X className="w-3 h-3 hover:text-white" />
                </button>
              </span>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filters.sortBy}
              onChange={(e) => onUpdateFilters({ sortBy: e.target.value as any })}
              className="bg-slate-800 text-slate-200 text-[11px] font-medium rounded-lg px-2 py-1 border border-slate-700 focus:outline-none focus:border-brand-500"
            >
              <option value="recommended">✨ 智能推荐</option>
              <option value="rating">⭐ 评分最高</option>
              <option value="reviews">🔥 人气评论最多</option>
              {userLocation && <option value="distance">📍 离我最近</option>}
              <option value="priceAsc">💰 价格从低到高</option>
              <option value="priceDesc">💎 价格从高到低</option>
            </select>
          </div>
        </div>
      </div>

      {/* Places Cards List */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2.5">
        {places.length === 0 ? (
          <div className="py-16 text-center text-slate-500 flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-800/80 flex items-center justify-center text-2xl text-slate-400">
              🔍
            </div>
            <p className="text-sm font-medium text-slate-400">未找到符合条件的餐厅或超市</p>
            <p className="text-xs text-slate-500 max-w-[220px]">
              尝试清除筛选条件，或使用顶栏“搜索网络更新”检索最新开店动态
            </p>
            <button
              onClick={() => onUpdateFilters({ searchQuery: '', category: 'All', city: 'All', priceLevel: 'All', tags: [] })}
              className="mt-2 px-3 py-1.5 rounded-lg bg-brand-500/20 text-brand-400 border border-brand-500/30 text-xs font-semibold hover:bg-brand-500/30 transition-all"
            >
              重置所有筛选
            </button>
          </div>
        ) : (
          places.map((place) => {
            const isSelected = selectedPlaceId === place.id;
            const isFav = favorites.includes(place.id);
            const catConfig = CATEGORY_CONFIG[place.category] || CATEGORY_CONFIG.chinese;
            const statusConfig = STATUS_CONFIG[place.status] || STATUS_CONFIG.open;
            
            const distance = userLocation 
              ? calculateDistanceInMiles(userLocation.lat, userLocation.lng, place.lat, place.lng)
              : null;

            return (
              <div
                key={place.id}
                onClick={() => onSelectPlace(place.id)}
                className={`group relative rounded-2xl border p-3 cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'bg-slate-800/90 border-brand-500 shadow-glow'
                    : 'bg-slate-800/40 hover:bg-slate-800/70 border-slate-700/60 hover:border-slate-600'
                }`}
              >
                <div className="flex gap-3">
                  {/* Photo Cover */}
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-slate-950">
                    <img
                      src={place.imageUrl}
                      alt={place.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent"></div>
                    <span className={`absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold border backdrop-blur-md ${catConfig.bgClass}`}>
                      {catConfig.icon} {catConfig.label.slice(0, 2)}
                    </span>
                  </div>

                  {/* Info Content */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      {/* Name & Fav Button */}
                      <div className="flex items-start justify-between gap-1">
                        <h2 className="font-bold text-sm text-white group-hover:text-brand-400 transition-colors truncate">
                          {place.name}
                        </h2>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(place.id);
                          }}
                          className="text-slate-400 hover:text-rose-500 p-1 -mr-1 transition-transform active:scale-125"
                          title="收藏"
                        >
                          <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                        </button>
                      </div>

                      <p className="text-[11px] text-slate-400 truncate">{place.enName}</p>

                      {/* Rating & Price & City */}
                      <div className="flex items-center gap-2 mt-1 text-xs">
                        <span className="flex items-center gap-1 font-semibold text-amber-400">
                          <Star className="w-3 h-3 fill-amber-400" />
                          {place.rating}
                        </span>
                        <span className="text-slate-500">({place.reviewCount})</span>
                        <span className="text-slate-400 font-medium">·</span>
                        <span className="text-emerald-400 font-semibold">{place.priceLevel}</span>
                        <span className="text-slate-400 font-medium">·</span>
                        <span className="text-slate-300 font-medium">{place.city}</span>
                      </div>
                    </div>

                    {/* Plaza & Status */}
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                      <span className="truncate max-w-[170px] flex items-center gap-1 text-slate-300">
                        <MapPin className="w-3 h-3 text-brand-400 shrink-0" />
                        {place.plazaName ? place.plazaName.split(' (')[0] : place.address.split(',')[0]}
                      </span>

                      {distance !== null ? (
                        <span className="text-cyan-400 font-bold text-[10px] shrink-0 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/40">
                          {distance} mi
                        </span>
                      ) : (
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold shrink-0 ${statusConfig.badgeClass}`}>
                          {statusConfig.label.slice(0, 4)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Signature Dishes Tags preview */}
                {place.dishes && place.dishes.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-slate-700/50 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                    <span className="text-[10px] font-semibold text-brand-400 shrink-0">招牌:</span>
                    {place.dishes.slice(0, 3).map((d, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-slate-900/80 text-[10px] text-slate-300 border border-slate-700/50 whitespace-nowrap"
                      >
                        {d.name.split(' (')[0]}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
