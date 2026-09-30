import React from 'react';
import { 
  Compass, 
  RefreshCw, 
  Dices, 
  Building2, 
  PlusCircle, 
  MapPin, 
  Heart,
  Globe,
  Sparkles
} from 'lucide-react';
import { City } from '../types/food';

interface NavbarProps {
  currentCity: 'All' | City;
  onSelectCity: (city: 'All' | City) => void;
  onOpenWebSync: () => void;
  onOpenRandomWheel: () => void;
  onOpenPlazaGuide: () => void;
  onOpenAddPlace: () => void;
  favoritesCount: number;
  onlyFavorites: boolean;
  onToggleFavoritesOnly: () => void;
  totalPlacesCount: number;
  mapStyle: 'dark' | 'light' | 'voyager';
  onChangeMapStyle: (style: 'dark' | 'light' | 'voyager') => void;
}

const CITIES: ('All' | City)[] = [
  'All',
  'Irvine',
  'Tustin',
  'Costa Mesa',
  'Newport Beach',
  'Santa Ana',
  'Lake Forest'
];

const CITY_LABELS: Record<string, string> = {
  All: '全部城市',
  Irvine: '尔湾 (Irvine)',
  Tustin: '塔斯廷 (Tustin)',
  'Costa Mesa': '科斯塔梅萨 (Costa Mesa)',
  'Newport Beach': '新港滩 (Newport Beach)',
  'Santa Ana': '圣安娜 (Santa Ana)',
  'Lake Forest': '森林湖 (Lake Forest)'
};

export const Navbar: React.FC<NavbarProps> = ({
  currentCity,
  onSelectCity,
  onOpenWebSync,
  onOpenRandomWheel,
  onOpenPlazaGuide,
  onOpenAddPlace,
  favoritesCount,
  onlyFavorites,
  onToggleFavoritesOnly,
  totalPlacesCount,
  mapStyle,
  onChangeMapStyle
}) => {
  return (
    <header className="h-16 px-4 md:px-6 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 flex items-center justify-between z-30 shrink-0 select-none">
      {/* Brand & Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-amber-400 flex items-center justify-center shadow-glow text-xl">
          🍜
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-extrabold text-base md:text-lg tracking-tight text-white flex items-center gap-1.5">
              <span>尔湾亚洲美食地图</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-400 border border-brand-500/30 hidden sm:inline-flex">
                OC Foodie Map
              </span>
            </h1>
          </div>
          <p className="text-[11px] text-slate-400 hidden sm:block">
            收录尔湾及邻近城市精选餐厅与超市 · 共 <span className="text-brand-400 font-semibold">{totalPlacesCount}</span> 家精选好店
          </p>
        </div>
      </div>

      {/* City Switcher Pill Tabs (Hidden on small mobile) */}
      <div className="hidden lg:flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
        {CITIES.map((city) => {
          const isActive = currentCity === city;
          return (
            <button
              key={city}
              onClick={() => onSelectCity(city)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {CITY_LABELS[city]}
            </button>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        {/* Network Sync Button */}
        <button
          onClick={onOpenWebSync}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600/20 to-blue-600/20 hover:from-cyan-600/30 hover:to-blue-600/30 border border-cyan-500/30 text-cyan-300 text-xs font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-95"
          title="搜索网络更新商家数据"
        >
          <Globe className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="hidden md:inline">搜索网络更新</span>
        </button>

        {/* Random Wheel "今天吃什么" */}
        <button
          onClick={onOpenRandomWheel}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/30 text-amber-300 text-xs font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-95"
          title="随机挑选吃什么"
        >
          <Dices className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">今天吃什么</span>
        </button>

        {/* Plaza Guide */}
        <button
          onClick={onOpenPlazaGuide}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs font-medium transition-all active:scale-95"
          title="查看尔湾热门商圈与停车指南"
        >
          <Building2 className="w-4 h-4 text-brand-400" />
          <span className="hidden md:inline">商圈导览</span>
        </button>

        {/* Favorites Filter */}
        <button
          onClick={onToggleFavoritesOnly}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-all ${
            onlyFavorites
              ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
              : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
          }`}
          title="查看我的收藏"
        >
          <Heart className={`w-4 h-4 ${onlyFavorites ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
          <span className="hidden sm:inline">收藏</span>
          {favoritesCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-[10px] text-white font-bold">
              {favoritesCount}
            </span>
          )}
        </button>

        {/* Map Style Toggle */}
        <div className="hidden sm:flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => onChangeMapStyle('dark')}
            className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-all ${
              mapStyle === 'dark' ? 'bg-slate-800 text-brand-400' : 'text-slate-400 hover:text-white'
            }`}
            title="深色夜间地图"
          >
            深色
          </button>
          <button
            onClick={() => onChangeMapStyle('voyager')}
            className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-all ${
              mapStyle === 'voyager' ? 'bg-slate-800 text-brand-400' : 'text-slate-400 hover:text-white'
            }`}
            title="明亮彩色地图"
          >
            彩色
          </button>
        </div>

        {/* Add Place */}
        <button
          onClick={onOpenAddPlace}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-glow transition-all active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span className="hidden sm:inline">添加好店</span>
        </button>
      </div>
    </header>
  );
};
