import React, { useState } from 'react';
import { TrendingUp, TrendingDown, PlusCircle, Check, Info, BarChart3 } from 'lucide-react';

export interface MenuItemType {
  id: string;
  category: 'snack' | 'beverage';
  title: string;
  description: string;
  price: number;
  change: string;
  trend: 'up' | 'down';
  marketCap: string;
  volume: string;
  volatility: string;
  investment: string;
  isSoldOut?: boolean;
}

interface MenuItemProps {
  item: MenuItemType;
  addToCart: (item: MenuItemType) => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ item, addToCart }) => {
  const [added, setAdded] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const getInvestmentColor = (investment: string) => {
    switch (investment) {
      case '즉시 체포':
        return 'bg-yellow-800 text-yellow-200 border border-yellow-600';
      case '체포 권장':
        return 'bg-green-900 text-green-300 border border-green-700';
      case '감시 중':
        return 'bg-blue-900 text-blue-300 border border-blue-700';
      case '수배 중':
        return 'bg-amber-900 text-amber-300 border border-amber-700';
      case '체포 완료':
        return 'bg-red-900 text-red-300 border border-red-700';
      default:
        return 'bg-gray-800 text-gray-300 border border-gray-600';
    }
  };

  const handleAddToCart = () => {
    if (item.isSoldOut) return;
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
    addToCart(item);
  };

  const TrendIcon = item.trend === 'up' ? TrendingUp : TrendingDown;
  const trendColor = item.trend === 'up' ? 'text-green-500' : 'text-red-500';
  const trendBg = item.trend === 'up' ? 'bg-green-50/60 border-green-600/30' : 'bg-red-50/60 border-red-600/30';

  return (
    <div
      className={`group relative mb-4 rounded-xl overflow-hidden border-4 border-amber-900/90 shadow-md transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 ${
        item.isSoldOut ? 'opacity-70' : ''
      }`}
      style={{
        backgroundImage:
          'linear-gradient(180deg, rgba(255,240,220,0.75) 0%, rgba(255,240,220,0.55) 100%), repeating-linear-gradient(45deg, rgba(120,53,15,0.035) 0 12px, transparent 12px 24px)'
      }}
    >
      {/* subtle parchment grain */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            'radial-gradient(30% 40% at 20% 20%, rgba(255,255,255,0.08) 0%, transparent 60%), radial-gradient(40% 35% at 80% 35%, rgba(0,0,0,0.05) 0%, transparent 65%), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '100px 100px, 120px 120px, 40px 40px, 40px 40px',
          backgroundBlendMode: 'multiply'
        }}
      />

      {/* Sold out ribbon */}
      {item.isSoldOut && (
        <div className="pointer-events-none absolute -right-14 top-4 rotate-45 bg-gray-800 text-gray-100 text-xs font-extrabold tracking-wider px-16 py-1 shadow-lg border border-gray-700">
          SOLD OUT
        </div>
      )}

      <div className="relative z-10 p-4">
        {/* Top row: title & trend */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-extrabold text-[#3d110f] text-lg tracking-wide drop-shadow-sm truncate">
              {item.title}
            </h3>
            <p className="text-[#5a1a16] text-sm mt-0.5 font-medium break-words">{item.description}</p>
          </div>

         
        </div>

        {/* Price row */}
        <div className="mt-3 flex items-end justify-between">
          <div>
            <span className="text-xs text-[#5a1a16] font-semibold">현상금</span>
            <p className="font-extrabold text-[#76231c] text-2xl leading-7 drop-shadow-md tabular-nums">
              ₩{item.price.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-3 flex items-center justify-end gap-2">
          <button
            onClick={() => setShowDetails((v) => !v)}
            aria-expanded={showDetails}
            aria-label="메뉴 상세 보기"
            className="p-1.5 rounded-full bg-[#76231c] text-amber-100 hover:bg-[#5a1a16] transition-colors border border-yellow-600 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300"
          >
            <Info size={16} />
          </button>
          <button
            onClick={handleAddToCart}
            disabled={item.isSoldOut}
            className={`inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-bold border-2 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 ${
              item.isSoldOut
                ? 'bg-gray-400 text-gray-700 border-gray-500 cursor-not-allowed'
                : added
                ? 'bg-green-700 text-white border-green-800 shadow-md'
                : 'bg-[#76231c] text-amber-100 border-yellow-600 hover:bg-[#5a1a16] hover:shadow-lg active:translate-y-[1px]'
            }`}
            aria-label={item.isSoldOut ? '품절' : added ? '장바구니에 추가됨' : '장바구니에 담기'}
          >
            {added ? <Check size={18} className="mr-2" /> : <PlusCircle size={18} className="mr-2" />}
            {item.isSoldOut ? '담기 완료' : added ? '추가됨' : '메뉴 담기'}
          </button>
        </div>

        {/* Details */}
        {showDetails && (
          <div className="mt-3 pt-3 border-t-2 border-yellow-700">
            <div className="bg-amber-100 rounded-lg p-3 border-2 border-yellow-700">
              <h4 className="font-bold text-sm text-[#3d110f] mb-2 flex items-center">
                <BarChart3 size={16} className="mr-1.5 text-yellow-500" />
                현상범 정보
              </h4>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-amber-50 p-2 rounded-lg shadow-sm border border-yellow-600">
                  <p className="text-xs font-semibold text-[#5a1a16]">총 현상금</p>
                  <p className="font-bold text-sm text-[#76231c]">{item.marketCap}</p>
                </div>
                <div className="bg-amber-50 p-2 rounded-lg shadow-sm border border-yellow-600">
                  <p className="text-xs font-semibold text-[#5a1a16]">위험 등급</p>
                  <p className="font-bold text-sm text-[#76231c]">{item.volatility}</p>
                </div>
              </div>

              <div className="bg-amber-50 p-2 rounded-lg shadow-sm border border-yellow-600">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-[#5a1a16]">보안관 의견</p>
                  <p className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${getInvestmentColor(item.investment)}`}>
                    {item.investment}
                  </p>
                </div>
                <p className="text-[#3d110f] text-xs mt-1 font-medium">
                  {item.trend === 'up' ? '현재 도주 중으로 즉시 체포 권장합니다.' : '현재 잠복 중으로 신중한 접근이 필요합니다.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuItem;
