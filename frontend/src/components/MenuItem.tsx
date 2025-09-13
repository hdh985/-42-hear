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
      case '즉시 체포': return 'bg-yellow-800 text-yellow-200 border border-yellow-600';
      case '체포 권장': return 'bg-green-900 text-green-300 border border-green-700';
      case '감시 중': return 'bg-blue-900 text-blue-300 border border-blue-700';
      case '수배 중': return 'bg-amber-900 text-amber-300 border border-amber-700';
      case '체포 완료': return 'bg-red-900 text-red-300 border border-red-700';
      default: return 'bg-gray-800 text-gray-300 border border-gray-600';
    }
  };

  const handleAddToCart = () => {
    if (item.isSoldOut) return;
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
    addToCart(item);
  };

  return (
    <div
      className={`bg-amber-50 rounded-xl shadow-md overflow-hidden mb-4 border-4 border-[#76231c] transition-all hover:shadow-xl relative ${
        item.isSoldOut ? 'opacity-70' : ''
      }`}
    >
      {/* 낡은 종이 질감 효과 (파일 없이 CSS로 표현) */}
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.08) 0%, transparent 40%),
            radial-gradient(circle at 80% 40%, rgba(0, 0, 0, 0.05) 0%, transparent 50%),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px, 120px 120px, 40px 40px, 40px 40px',
          backgroundBlendMode: 'multiply'
        }}
      ></div>

      <div className="p-4 relative z-10">
        <div className="flex flex-col space-y-3">
          {/* 타이틀 */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-extrabold text-[#3d110f] text-lg tracking-wide drop-shadow-sm">
                {item.title}
              </h3>
              <p className="text-[#5a1a16] text-sm mt-0.5 font-medium">{item.description}</p>
            </div>
           
          </div>

          {/* 현상금 */}
          <div className="flex justify-between items-center">
            <div>
              <span className="text-xs text-[#5a1a16] font-semibold">현상금</span>
              <p className="font-extrabold text-[#76231c] text-xl drop-shadow-md">
                ₩{item.price.toLocaleString()}
              </p>
            </div>
          </div>

          {/* 버튼 영역 */}
          <div className="flex justify-end items-center space-x-2">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="p-1.5 rounded-full bg-[#76231c] text-amber-100 hover:bg-[#5a1a16] transition-colors flex-shrink-0 border border-yellow-600 shadow-sm"
            >
              <Info size={16} />
            </button>
            <button
              onClick={handleAddToCart}
              className={`flex items-center justify-center rounded-full px-5 py-2 text-sm font-bold border-2 transition-all duration-200 ease-in-out
                ${
                  item.isSoldOut
                    ? 'bg-gray-400 text-gray-700 border-gray-500 cursor-not-allowed'
                    : added
                    ? 'bg-green-700 text-white border-green-800 shadow-md'
                    : 'bg-[#76231c] text-amber-100 border-yellow-600 hover:bg-[#5a1a16] hover:shadow-lg'
                }`}
              disabled={item.isSoldOut}
            >
              {added ? (
                <Check size={18} className="mr-2" />
              ) : (
                <PlusCircle size={18} className="mr-2" />
              )}
              {item.isSoldOut ? '담기 완료' : added ? '추가됨' : '메뉴 담기'}
            </button>
          </div>

          {/* 상세 정보 */}
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
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-semibold text-[#5a1a16]">보안관 의견</p>
                    <p className={`text-xs font-bold px-2 py-0.5 rounded-full border ${getInvestmentColor(item.investment)}`}>
                      {item.investment}
                    </p>
                  </div>
                  <p className="text-[#3d110f] text-xs mt-1 font-medium">
                    {item.trend === 'up'
                      ? '현재 도주 중으로 즉시 체포 권장합니다.'
                      : '현재 잠복 중으로 신중한 접근이 필요합니다.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuItem;
