import React, { useState } from 'react';
import { TrendingUp, TrendingDown, PlusCircle, Check, Info, ChartBar } from 'lucide-react';

export interface MenuItemType {
  id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
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
    return trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />;
  };

  const getInvestmentColor = (investment: string) => {
    switch(investment) {
      case '적극 매수': return 'bg-green-100 text-green-700';
      case '매수': return 'bg-green-50 text-green-600';
      case '보유': return 'bg-blue-50 text-blue-600';
      case '관망': return 'bg-yellow-50 text-yellow-700';
      case '매도': return 'bg-red-50 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const handleAddToCart = () => {
    if (item.isSoldOut) return;

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);

    addToCart(item);
  };

  return (
    <div className={`bg-white rounded-lg shadow p-3 mb-3 border border-gray-100 ${item.isSoldOut ? 'opacity-70' : ''}`}>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-base">{item.title}</h3>
            <p className="text-xs text-gray-600 mt-0.5">{item.description}</p>
          </div>
          <div className={`flex items-center px-2 py-0.5 rounded ${item.trend === 'up' ? 'bg-green-500' : 'bg-red-500'}`}>
            {renderTrendIcon(item.trend)}
            <span className="ml-1 text-white text-xs font-bold">{item.change}</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <span className="text-xs text-gray-500">매매가</span>
            <p className="font-bold text-base">₩{item.price.toLocaleString()}</p>
          </div>

          <div className="flex space-x-1">
            {item.investment === '적극 매수' && (
              <span className="text-white bg-blue-500 px-2 py-0.5 rounded-full text-xs">🔥 인기</span>
            )}
            {item.volatility === '낮음' && (
              <span className="text-white bg-green-500 px-2 py-0.5 rounded-full text-xs">추천</span>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex space-x-2 text-xs">
            <span className="bg-gray-100 px-2 py-0.5 rounded">재고: {item.stock}개</span>
            <span className="bg-gray-100 px-2 py-0.5 rounded">거래량: {item.volume}</span>
          </div>
          <div className="flex space-x-2">
            <button onClick={() => setShowDetails(!showDetails)} className="p-1 rounded-full bg-gray-100 text-gray-600">
              <Info size={14} />
            </button>
            <button
              onClick={handleAddToCart}
              className={`flex items-center text-xs font-medium px-3 py-1 rounded-full ${
                item.isSoldOut
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : added
                    ? 'bg-green-500 text-white'
                    : 'bg-blue-500 text-white'
              }`}
              disabled={item.isSoldOut}
            >
              {added ? <Check size={14} className="mr-1" /> : <PlusCircle size={14} className="mr-1" />}
              {item.isSoldOut ? '매도 완료' : added ? '추가됨' : '매수하기'}
            </button>
          </div>
        </div>

        {showDetails && (
          <div className="mt-2 bg-gray-50 p-2 rounded space-y-2 text-xs">
            <div className="flex justify-between">
              <span>시가총액: {item.marketCap}</span>
              <span>변동성: {item.volatility}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>투자의견</span>
              <span className={`px-2 py-0.5 rounded-full ${getInvestmentColor(item.investment)}`}>{item.investment}</span>
            </div>
            <p className="text-gray-600 mt-1">
              {item.trend === 'up'
                ? '현재 상승세로 매수 추천합니다.'
                : '현재 하락세로 신중한 매수가 필요합니다.'}
            </p>

            <div className="flex items-end space-x-0.5 h-8">
              {Array.from({ length: 12 }).map((_, i) => {
                const height = 5 + Math.random() * 20;
                return (
                  <div
                    key={i}
                    className={`w-full rounded-t ${item.trend === 'up' ? 'bg-green-400' : 'bg-red-400'}`}
                    style={{ height: `${height}px` }}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuItem;
