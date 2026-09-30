import React, { useState } from 'react';
import { Place } from '../types/food';
import { CATEGORY_CONFIG, STATUS_CONFIG, formatPriceLevel } from '../utils/formatters';
import { 
  X, 
  MapPin, 
  Phone, 
  Globe, 
  ExternalLink, 
  Star, 
  Heart, 
  Car, 
  Clock, 
  Utensils, 
  Tag, 
  Check, 
  Copy,
  Navigation,
  Sparkles,
  Info
} from 'lucide-react';

interface PlaceDetailModalProps {
  place: Place | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (placeId: string) => void;
  onSelectPlaza?: (plazaId: string) => void;
}

export const PlaceDetailModal: React.FC<PlaceDetailModalProps> = ({
  place,
  onClose,
  isFavorite,
  onToggleFavorite,
  onSelectPlaza,
}) => {
  const [copied, setCopied] = useState(false);

  // Close modal on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!place) return null;

  const catConfig = CATEGORY_CONFIG[place.category] || CATEGORY_CONFIG.chinese;
  const statusConfig = STATUS_CONFIG[place.status] || STATUS_CONFIG.open;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(place.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const googleMapsUrl =
    place.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ' ' + place.address)}`;
  const yelpUrl =
    place.yelpUrl || `https://www.yelp.com/search?find_desc=${encodeURIComponent(place.enName)}&find_loc=${encodeURIComponent(place.city + ', CA')}`;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 cursor-pointer"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-2xl max-h-[92vh] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Top Cover Image Area */}
        <div className="relative h-56 sm:h-64 w-full bg-slate-950 shrink-0">
          <img
            src={place.imageUrl}
            alt={place.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>

          {/* Top Bar Floating Buttons */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <span className={`px-3 py-1 rounded-xl text-xs font-bold border backdrop-blur-md ${catConfig.bgClass}`}>
              {catConfig.icon} {catConfig.label} · {place.subcategory}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleFavorite(place.id)}
                className="p-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/80 text-white hover:text-rose-500 transition-all active:scale-90"
                title="收藏"
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/80 text-slate-300 hover:text-white transition-all active:scale-90"
                title="关闭"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Title and Rating on bottom of cover */}
          <div className="absolute bottom-4 left-5 right-5">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusConfig.badgeClass}`}>
                {statusConfig.label}
              </span>
              {place.openingDate && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  🗓️ {place.openingDate}
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-md">
              {place.name}
            </h1>
            <p className="text-sm text-slate-300 drop-shadow">{place.enName}</p>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 flex flex-col gap-6 text-sm text-slate-300">
          {/* Quick Metrics Bar: Rating, Price, City, Plaza */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-800/50 p-3 rounded-2xl border border-slate-800 text-center">
            <div className="flex flex-col items-center justify-center p-1 border-r border-slate-800 last:border-none">
              <span className="text-[11px] text-slate-400">综合评分</span>
              <div className="flex items-center gap-1 text-base font-bold text-amber-400 mt-0.5">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{place.rating}</span>
                <span className="text-xs text-slate-500 font-normal">({place.reviewCount})</span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center p-1 border-r border-slate-800 last:border-none">
              <span className="text-[11px] text-slate-400">消费价位</span>
              <span className="text-base font-bold text-emerald-400 mt-0.5">{place.priceLevel}</span>
            </div>

            <div className="flex flex-col items-center justify-center p-1 border-r border-slate-800 last:border-none">
              <span className="text-[11px] text-slate-400">所在城市</span>
              <span className="text-base font-bold text-slate-200 mt-0.5">{place.city}</span>
            </div>

            <div className="flex flex-col items-center justify-center p-1">
              <span className="text-[11px] text-slate-400">所属商圈</span>
              <span className="text-xs font-bold text-brand-400 mt-1 truncate max-w-[110px]">
                {place.plazaName ? place.plazaName.split(' (')[0] : '独立街区'}
              </span>
            </div>
          </div>

          {/* Description & Story */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-brand-400" />
              <span>餐厅亮点与特色介绍</span>
            </h2>
            <p className="text-slate-200 text-sm leading-relaxed bg-slate-800/30 p-3.5 rounded-xl border border-slate-800/60">
              {place.description}
            </p>
          </div>

          {/* Tags */}
          {place.tags && place.tags.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              {place.tags.map((t, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 text-xs font-medium text-slate-300 border border-slate-700/60"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* Signature Recommended Dishes (必点招牌菜) */}
          {place.dishes && place.dishes.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <Utensils className="w-4 h-4 text-brand-400" />
                <span>必点招牌菜品与推荐 ({place.dishes.length})</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {place.dishes.map((dish, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between gap-2 hover:border-brand-500/40 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-white text-xs sm:text-sm">{dish.name}</span>
                        {dish.tag && (
                          <span className="px-1.5 py-0.2 text-[10px] font-bold rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
                            {dish.tag}
                          </span>
                        )}
                      </div>
                      {dish.enName && (
                        <div className="text-[11px] text-slate-400 truncate max-w-[200px]">
                          {dish.enName}
                        </div>
                      )}
                    </div>
                    {dish.price && (
                      <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 shrink-0">
                        {dish.price}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Practical Info: Parking, Address, Phone, Hours */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-800/40 p-4 rounded-2xl border border-slate-800">
            {/* Parking Guide */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-brand-400">
                <Car className="w-4 h-4" />
                <span>停车指南 (Parking)</span>
              </div>
              <p className="text-xs text-slate-300 leading-normal">
                {place.parkingInfo || '商圈附近提供免费地面车位'}
              </p>
            </div>

            {/* Business Hours */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>营业时间 (Hours)</span>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                {place.hoursText}
              </p>
            </div>

            {/* Address */}
            <div className="flex flex-col gap-1 sm:col-span-2 pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 text-slate-400 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-red-400" />
                  <span>详细地址</span>
                </span>
                <button
                  onClick={handleCopyAddress}
                  className="flex items-center gap-1 text-brand-400 hover:text-brand-300 text-[11px]"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? '已复制' : '复制地址'}</span>
                </button>
              </div>
              <p className="text-xs text-slate-200 font-medium">{place.address}</p>
            </div>

            {/* Phone */}
            {place.phone && (
              <div className="flex items-center gap-2 sm:col-span-2 text-xs">
                <Phone className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-slate-400">电话预订:</span>
                <a href={`tel:${place.phone}`} className="text-blue-400 hover:underline font-bold">
                  {place.phone}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Footer Action Buttons */}
        <div className="p-4 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between gap-2.5 shrink-0">
          <div className="flex items-center gap-2 flex-1">
            {/* Google Maps Nav */}
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition-all active:scale-95"
            >
              <Navigation className="w-4 h-4" />
              <span>Google Maps 导航</span>
            </a>

            {/* Yelp Reviews */}
            <a
              href={yelpUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg transition-all active:scale-95"
            >
              <Star className="w-4 h-4" />
              <span>Yelp 评价详情</span>
            </a>

            {/* Official Website / Order */}
            {place.website && (
              <a
                href={place.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all"
              >
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>官网/点餐</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
