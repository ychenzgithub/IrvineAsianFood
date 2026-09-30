import React, { useState } from 'react';
import { Place, City, MainCategory, PriceLevel, BusinessStatus } from '../types/food';
import { PLAZAS } from '../data/plazas';
import { PlusCircle, X, Check, Building2, MapPin, Sparkles } from 'lucide-react';

interface AddPlaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPlace: (place: Place) => void;
}

export const AddPlaceModal: React.FC<AddPlaceModalProps> = ({
  isOpen,
  onClose,
  onAddPlace,
}) => {
  const [name, setName] = useState('');
  const [enName, setEnName] = useState('');
  const [category, setCategory] = useState<MainCategory>('chinese');
  const [subcategory, setSubcategory] = useState('');
  const [city, setCity] = useState<City>('Irvine');
  const [plazaId, setPlazaId] = useState('diamond_jamboree');
  const [address, setAddress] = useState('');
  const [priceLevel, setPriceLevel] = useState<PriceLevel>('$$');
  const [status, setStatus] = useState<BusinessStatus>('open');
  const [hoursText, setHoursText] = useState('11:00 AM - 9:30 PM');
  const [parkingInfo, setParkingInfo] = useState('');
  const [signatureDishes, setSignatureDishes] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

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


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !enName.trim() || !address.trim()) {
      alert('请填写完整的中文名、英文名和详细地址');
      return;
    }

    const targetPlaza = PLAZAS.find((p) => p.id === plazaId);

    const dishes = signatureDishes
      .split(/[,，、\n]/)
      .map((d) => d.trim())
      .filter(Boolean)
      .map((d) => ({ name: d, tag: '招牌推荐' }));

    const newPlace: Place = {
      id: `custom_${Date.now()}`,
      name: name.trim(),
      enName: enName.trim(),
      category,
      subcategory: subcategory.trim() || '特色风味',
      city,
      plazaId: plazaId !== 'none' ? plazaId : undefined,
      plazaName: targetPlaza ? targetPlaza.name : undefined,
      address: address.trim(),
      lat: targetPlaza ? targetPlaza.lat + (Math.random() - 0.5) * 0.005 : 33.6846 + (Math.random() - 0.5) * 0.04,
      lng: targetPlaza ? targetPlaza.lng + (Math.random() - 0.5) * 0.005 : -117.8265 + (Math.random() - 0.5) * 0.04,
      status,
      hoursText: hoursText.trim() || '11:00 AM - 10:00 PM',
      priceLevel,
      rating: 4.8,
      reviewCount: 1,
      parkingInfo: parkingInfo.trim() || (targetPlaza ? targetPlaza.parkingGuide : '提供免费停车位'),
      dishes: dishes.length > 0 ? dishes : [{ name: '特色招牌菜', tag: '主厨推荐' }],
      tags: ['用户新增', '新店推荐'],
      description: description.trim() || '新收录亚洲美食商家，欢迎前去品尝打卡。',
      imageUrl:
        imageUrl.trim() ||
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      isCustomAdded: true,
      addedAt: new Date().toISOString(),
    };

    onAddPlace(newPlace);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 cursor-pointer"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-xl max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-white">添加/爆料亚洲新店</h2>
              <p className="text-xs text-slate-400">将您发现的美味新店或亚洲超市录入地图数据库</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[72vh] flex flex-col gap-4 text-xs text-slate-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-300 mb-1 block">中文店名 *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例如: 霸王茶姬"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="font-bold text-slate-300 mb-1 block">英文店名 *</label>
              <input
                type="text"
                required
                value={enName}
                onChange={(e) => setEnName(e.target.value)}
                placeholder="例如: CHAGEE Modern Tea Bar"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-300 mb-1 block">主分类</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-brand-500"
              >
                <option value="chinese">中式料理</option>
                <option value="japanese">东瀛日料</option>
                <option value="korean">正宗韩餐</option>
                <option value="southeast">东南亚风味</option>
                <option value="market">亚洲生鲜超市</option>
                <option value="dessert_tea">奶茶甜品烘焙</option>
                <option value="coming_soon">即将开业 / Coming Soon</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-300 mb-1 block">二级细分标签</label>
              <input
                type="text"
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                placeholder="例如: 川湘菜 / 原叶奶茶"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-300 mb-1 block">所在城市</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-brand-500"
              >
                <option value="Irvine">Irvine (尔湾)</option>
                <option value="Tustin">Tustin (塔斯廷)</option>
                <option value="Costa Mesa">Costa Mesa (科斯塔梅萨)</option>
                <option value="Newport Beach">Newport Beach (新港滩)</option>
                <option value="Santa Ana">Santa Ana (圣安娜)</option>
                <option value="Lake Forest">Lake Forest (森林湖)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-300 mb-1 block">所属商圈 (Plaza)</label>
              <select
                value={plazaId}
                onChange={(e) => setPlazaId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-brand-500"
              >
                <option value="none">独立街区 / 其他</option>
                {PLAZAS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-300 mb-1 block">营业状态</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-brand-500"
              >
                <option value="open">正常营业中</option>
                <option value="grand_opening">新开业 (Grand Opening)</option>
                <option value="coming_soon">筹备中 / 即将开业 (Coming Soon)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-300 mb-1 block">详细地址 *</label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="例如: 2700 Alton Pkwy, Irvine, CA 92606"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="font-bold text-slate-300 mb-1 block">必点招牌菜 (逗号分隔)</label>
            <input
              type="text"
              value={signatureDishes}
              onChange={(e) => setSignatureDishes(e.target.value)}
              placeholder="例如: 伯牙绝弦, 花田乌龙, 万里木兰"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="font-bold text-slate-300 mb-1 block">停车指南与建议</label>
            <input
              type="text"
              value={parkingInfo}
              onChange={(e) => setParkingInfo(e.target.value)}
              placeholder="例如: Plaza 免费平地停车场，周末车位充足"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="font-bold text-slate-300 mb-1 block">推荐理由与简介</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="分享推荐理由、环境特色或点餐技巧..."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Submit Buttons */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold shadow-glow transition-all active:scale-95"
            >
              确认添加到地图
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
