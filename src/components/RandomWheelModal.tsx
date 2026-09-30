import React, { useState } from 'react';
import { Place } from '../types/food';
import { Dices, X, Sparkles, Utensils, Star, MapPin, ArrowRight } from 'lucide-react';
import { CATEGORY_CONFIG } from '../utils/formatters';

interface RandomWheelModalProps {
  isOpen: boolean;
  onClose: () => void;
  places: Place[];
  onSelectPlace: (placeId: string) => void;
}

export const RandomWheelModal: React.FC<RandomWheelModalProps> = ({
  isOpen,
  onClose,
  places,
  onSelectPlace,
}) => {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

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

  const handleSpin = () => {
    if (places.length === 0) return;
    setIsSpinning(true);
    setSelectedPlace(null);

    let counter = 0;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * places.length);
      setSelectedPlace(places[randomIndex]);
      counter++;

      if (counter > 15) {
        clearInterval(interval);
        setIsSpinning(false);
      }
    }, 100);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 cursor-pointer"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10 p-6 text-center cursor-default"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
            <Dices className="w-5 h-5 animate-bounce" />
            <span>今天吃什么？(Lucky Roulette)</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Roulette Display Area */}
        <div className="py-6 flex flex-col items-center justify-center min-h-[260px]">
          {selectedPlace ? (
            <div className="w-full flex flex-col items-center gap-3 animate-in zoom-in-95 duration-200">
              <div className="relative w-28 h-28 rounded-2xl overflow-hidden shadow-glow border-2 border-brand-500">
                <img
                  src={selectedPlace.imageUrl}
                  alt={selectedPlace.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold border border-brand-500/30">
                  {selectedPlace.subcategory} · {selectedPlace.city}
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  {selectedPlace.name}
                </h3>
                <p className="text-xs text-slate-400">{selectedPlace.enName}</p>
              </div>

              <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{selectedPlace.rating} ({selectedPlace.reviewCount}条评价)</span>
                <span className="text-slate-400">·</span>
                <span className="text-emerald-400">{selectedPlace.priceLevel}</span>
              </div>

              {selectedPlace.dishes && selectedPlace.dishes[0] && (
                <div className="text-xs text-slate-300 bg-slate-800/60 px-3 py-1 rounded-lg border border-slate-700">
                  ✨ 推荐尝尝: <strong className="text-brand-300">{selectedPlace.dishes[0].name}</strong>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 text-slate-500">
              <div className="w-20 h-20 rounded-2xl bg-slate-800/80 flex items-center justify-center text-4xl shadow-inner">
                🍲
              </div>
              <p className="text-sm font-medium text-slate-400">不知道吃什么？让美食轮盘帮你决定！</p>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2 pt-4 border-t border-slate-800">
          <button
            onClick={handleSpin}
            disabled={isSpinning}
            className={`w-full py-3 rounded-xl font-bold text-sm text-white shadow-glow transition-all active:scale-95 ${
              isSpinning
                ? 'bg-slate-700 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-500 via-brand-500 to-orange-600 hover:from-amber-400 hover:to-orange-500'
            }`}
          >
            {isSpinning ? '🎲 命运轮盘飞转中...' : selectedPlace ? '🎲 不满意？再摇一次！' : '🎲 开始随机挑选美食'}
          </button>

          {selectedPlace && !isSpinning && (
            <button
              onClick={() => {
                onSelectPlace(selectedPlace.id);
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
            >
              <span>查看这家店详细信息与导航</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
