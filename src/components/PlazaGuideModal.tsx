import React from 'react';
import { Plaza } from '../types/food';
import { PLAZAS } from '../data/plazas';
import { 
  Building2, 
  X, 
  Car, 
  MapPin, 
  Sparkles, 
  ExternalLink, 
  ArrowRight,
  Store
} from 'lucide-react';

interface PlazaGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlaza: (plazaId: string) => void;
}

export const PlazaGuideModal: React.FC<PlazaGuideModalProps> = ({
  isOpen,
  onClose,
  onSelectPlaza,
}) => {
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

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 cursor-pointer"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-white flex items-center gap-2">
                <span>尔湾及周边核心亚洲美食商圈全景导览</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-semibold border border-amber-500/30">
                  Plaza & Mall Guide
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                收录 Diamond Jamboree, Culver Plaza, Mitsuwa, The District 等核心商圈停车攻略与特色商铺
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Plazas Grid List */}
        <div className="p-6 overflow-y-auto max-h-[75vh] grid grid-cols-1 md:grid-cols-2 gap-4">
          {PLAZAS.map((plaza) => (
            <div
              key={plaza.id}
              className="rounded-2xl bg-slate-800/40 border border-slate-700/60 overflow-hidden flex flex-col hover:border-brand-500/40 transition-all group"
            >
              {/* Cover */}
              <div className="relative h-36 w-full bg-slate-950">
                <img
                  src={plaza.imageUrl}
                  alt={plaza.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded bg-brand-500 text-white text-[10px] font-bold">
                      {plaza.city}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1 drop-shadow">
                      {plaza.name}
                    </h3>
                  </div>
                  <span className="text-[11px] font-semibold text-amber-300 bg-slate-900/80 px-2 py-0.5 rounded border border-amber-500/30">
                    {plaza.totalAsianPlaces || 10}+ 家亚洲商户
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 flex-1 flex flex-col justify-between gap-3 text-xs text-slate-300">
                <p className="text-slate-300 leading-relaxed">
                  {plaza.description}
                </p>

                {/* Parking info */}
                <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 text-[11px] flex flex-col gap-1 text-slate-300">
                  <span className="flex items-center gap-1 font-semibold text-brand-400">
                    <Car className="w-3.5 h-3.5" /> 停车攻略:
                  </span>
                  <span className="text-slate-400">{plaza.parkingGuide}</span>
                </div>

                {/* Featured Stores */}
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1">
                    <Store className="w-3 h-3 text-slate-400" />
                    <span>入驻特色招牌:</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {plaza.featuredStores.map((store, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 border border-slate-700/50"
                      >
                        {store}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action button */}
                <button
                  onClick={() => {
                    onSelectPlaza(plaza.id);
                    onClose();
                  }}
                  className="mt-1 w-full py-2 rounded-xl bg-brand-500/15 hover:bg-brand-500 text-brand-300 hover:text-white font-bold text-xs border border-brand-500/30 transition-all flex items-center justify-center gap-1"
                >
                  <span>在地图上查看该商圈全部商家</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
