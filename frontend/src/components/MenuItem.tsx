import React, { useState } from 'react';
import { TrendingUp, TrendingDown, PlusCircle, Check, Info, BarChart3 } from 'lucide-react';

export interface MenuItemType {
  id: string;
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

  const renderTrendIcon = (trend: 'up' | 'down') => {
    return trend === 'up' ? (
      <TrendingUp size={16} className="text-yellow-200" />
    ) : (
      <TrendingDown size={16} className="text-red-200" />
    );
  };

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
    <div className={`bg-white rounded-xl shadow-md overflow-hidden mb-4 transition-all hover:shadow-lg border-2 border-amber-300 ${item.isSoldOut ? 'opacity-70' : ''}`}>
      <div className="p-4">
        <div className="flex flex-col space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-gray-900 text-lg">{item.title}</h3>
              <p className="text-gray-700 text-sm mt-0.5 font-medium">{item.description}</p>
            </div>
            <div className={`flex items-center px-2 py-1 rounded-lg shadow-sm border-2 ${item.trend === 'up' ? 'bg-green-100 border-green-400 text-green-800' : 'bg-red-100 border-red-400 text-red-800'}`}>
              {renderTrendIcon(item.trend)}
              <span className="ml-1 font-bold text-sm">{item.change}</span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <span className="text-xs text-gray-600 font-semibold">현상금</span>
              <p className="font-bold text-gray-900 text-lg">₩{item.price.toLocaleString()}</p>
            </div>
            <div className="flex space-x-1">
              {item.investment === '즉시 체포' && (
                <span className="inline-flex items-center bg-red-600 text-white px-2 py-0.5 rounded-full text-xs font-bold shadow-sm border border-red-700">
                  🔥 최고 위험
                </span>
              )}
              {item.volatility === '낮음' && (
                <span className="inline-flex items-center bg-blue-600 text-white px-2 py-0.5 rounded-full text-xs font-bold shadow-sm border border-blue-700">
                  안전함
                </span>
              )}
            </div>
          </div>

          <div className="flex justify-end items-center space-x-2">
            <button onClick={() => setShowDetails(!showDetails)} className="p-1.5 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors flex-shrink-0 border border-gray-400">
              <Info size={16} />
            </button>
            <button
              onClick={handleAddToCart}
              className={`flex items-center justify-center rounded-full px-5 py-2 text-sm font-bold border-2
                ${
                  item.isSoldOut
                    ? 'bg-gray-400 text-gray-700 border-gray-500 cursor-not-allowed'
                    : added
                      ? 'bg-green-600 text-white border-green-700 shadow-md'
                      : 'bg-amber-600 text-white border-amber-700 hover:bg-amber-500 hover:shadow-lg'
                } 
                transition-all duration-200 ease-in-out
              `}
              disabled={item.isSoldOut}
            >
              {added ? (
                <Check size={18} className="mr-2" />
              ) : (
                <PlusCircle size={18} className="mr-2" />
              )}
              {item.isSoldOut ? '체포 완료' : added ? '추가됨' : '현상범 체포'}
            </button>
          </div>

          {showDetails && (
            <div className="mt-3 pt-3 border-t-2 border-gray-200">
              <div className="bg-gray-50 rounded-lg p-3 border-2 border-gray-300">
                <h4 className="font-bold text-sm text-gray-900 mb-2 flex items-center">
                  <BarChart3 size={16} className="mr-1.5 text-amber-600" />
                  현상범 정보
                </h4>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-300">
                    <p className="text-gray-600 text-xs font-semibold">총 현상금</p>
                    <p className="font-bold text-sm text-gray-900">{item.marketCap}</p>
                  </div>
                  <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-300">
                    <p className="text-gray-600 text-xs font-semibold">위험 등급</p>
                    <p className="font-bold text-sm text-gray-900">{item.volatility}</p>
                  </div>
                </div>
                <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-300">
                  <div className="flex justify-between items-center">
                    <p className="text-gray-600 text-xs font-semibold">보안관 의견</p>
                    <p className={`text-xs font-bold px-2 py-0.5 rounded-full border ${getInvestmentColor(item.investment)}`}>{item.investment}</p>
                  </div>
                  <p className="text-gray-700 text-xs mt-1 font-medium">
                    {item.trend === 'up' ? '현재 도주 중으로 즉시 체포 권장합니다.' : '현재 잠복 중으로 신중한 접근이 필요합니다.'}
                  </p>
                </div>
                <div className="mt-2 h-8 bg-white rounded-lg overflow-hidden flex items-end p-1 shadow-sm border border-gray-300">
                  {Array.from({ length: 12 }).map((_, i) => {
                    const height = 5 + Math.random() * 20;
                    return (
                      <div
                        key={i}
                        className={`w-full mx-0.5 rounded-t border-t-2 ${item.trend === 'up' ? 'bg-green-200 border-green-500' : 'bg-red-200 border-red-500'}`}
                        style={{ height: `${height}px` }}
                      ></div>
                    );
                  })}
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