import React, { useState } from 'react';
import { TrendingUp, TrendingDown, PlusCircle, Check, Info, ChartBar } from 'lucide-react';

export interface MenuItemType {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
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
  
  // 트렌드 아이콘 렌더링
  const renderTrendIcon = (trend: 'up' | 'down') => {
    if (trend === 'up') {
      return <TrendingUp size={16} className="text-white" />;
    } else {
      return <TrendingDown size={16} className="text-white" />;
    }
  };

  // 투자 의견에 따른 색상
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

  // 장바구니에 추가
  const handleAddToCart = () => {
    if (item.isSoldOut) return;
    
    // 추가 애니메이션
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
    
    // 실제 추가
    addToCart(item);
  };

  return (
    <div 
      className={`bg-white rounded-xl shadow-md overflow-hidden mb-4 transition-all hover:shadow-lg border border-gray-100 ${
        item.isSoldOut ? 'opacity-70' : ''
      }`}
    >
      <div className="p-4">
        {/* 상단 정보 영역 */}
        <div className="flex">
          {/* 이미지 영역 */}
          <div className="relative w-24 h-24 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
            {item.isSoldOut && (
              <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                <span className="text-white font-bold text-sm bg-red-500 px-2 py-1 rounded-lg">매도 완료</span>
              </div>
            )}
          </div>
          
          {/* 메인 정보 영역 */}
          <div className="ml-3 flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{item.title}</h3>
                <p className="text-gray-600 text-sm mt-0.5 line-clamp-2">{item.description}</p>
              </div>
              <div className={`flex items-center px-2 py-1 rounded-lg shadow-sm ${
                item.trend === 'up' 
                  ? 'bg-gradient-to-r from-green-600 to-green-400' 
                  : 'bg-gradient-to-r from-red-600 to-red-400'
              }`}>
                {renderTrendIcon(item.trend)}
                <span className="ml-1 font-bold text-white text-sm">
                  {item.change}
                </span>
              </div>
            </div>
            
            {/* 가격 정보 */}
            <div className="flex items-end justify-between mt-2">
              <div>
                <span className="text-xs text-gray-500">매매가</span>
                <p className="font-bold text-gray-900 text-lg">₩{item.price.toLocaleString()}</p>
              </div>
              
              {/* 인기/추천 태그 */}
              <div className="flex space-x-1">
                {item.investment === '적극 매수' && (
                  <span className="inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-500 text-white px-2 py-0.5 rounded-full text-xs font-medium shadow-sm">
                    <span className="mr-0.5">🔥</span>인기
                  </span>
                )}
                {item.volatility === '낮음' && (
                  <span className="inline-flex items-center bg-gradient-to-r from-green-600 to-green-400 text-white px-2 py-0.5 rounded-full text-xs font-medium shadow-sm">
                    추천
                  </span>
                )}
              </div>
            </div>
            
            {/* 하단 정보 */}
            <div className="flex justify-between items-center mt-3">
              <div className="flex space-x-2">
                <div className="bg-gray-100 text-gray-800 px-2 py-1 rounded-lg text-xs font-medium">
                  재고: {item.stock}개
                </div>
                <div className="bg-gray-100 text-gray-800 px-2 py-1 rounded-lg text-xs font-medium">
                  거래량: {item.volume}
                </div>
              </div>
              
              {/* 버튼 영역 */}
              <div className="flex items-center">
                <button 
                  onClick={() => setShowDetails(!showDetails)}
                  className="p-1.5 rounded-full mr-1.5 bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors flex-shrink-0"
                >
                  <Info size={16} />
                </button>
                <button
                  onClick={handleAddToCart}
                  className={`flex items-center justify-center rounded-full px-3 py-1.5 flex-shrink-0 ${
                    item.isSoldOut
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : added
                        ? 'bg-gradient-to-r from-green-600 to-green-400 text-white'
                        : 'bg-gradient-to-r from-blue-600 to-blue-400 text-white hover:from-blue-700 hover:to-blue-500'
                  } transition-colors shadow-sm`}
                  disabled={item.isSoldOut}
                >
                  {added ? (
                    <Check size={16} className="mr-1" />
                  ) : (
                    <PlusCircle size={16} className="mr-1" />
                  )}
                  {item.isSoldOut ? '매도 완료' : added ? '추가됨' : '매수하기'}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* 상세 정보 */}
        {showDetails && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3">
              <h4 className="font-bold text-sm text-gray-900 mb-2 flex items-center">
                <ChartBar size={16} className="mr-1.5 text-blue-600" />
                상세 종목 분석
              </h4>
              
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-white p-2 rounded-lg shadow-sm">
                  <p className="text-gray-500 text-xs">시가총액</p>
                  <p className="font-medium text-sm">{item.marketCap}</p>
                </div>
                <div className="bg-white p-2 rounded-lg shadow-sm">
                  <p className="text-gray-500 text-xs">변동성</p>
                  <p className="font-medium text-sm">{item.volatility}</p>
                </div>
              </div>
              
              <div className="bg-white p-2 rounded-lg shadow-sm">
                <div className="flex justify-between items-center">
                  <p className="text-gray-500 text-xs">투자의견</p>
                  <p className={`text-xs font-bold px-2 py-0.5 rounded-full ${getInvestmentColor(item.investment)}`}>
                    {item.investment}
                  </p>
                </div>
                <p className="text-gray-600 text-xs mt-1">
                  {item.trend === 'up' 
                    ? '현재 상승세로 매수 추천합니다.' 
                    : '현재 하락세로 신중한 매수가 필요합니다.'}
                </p>
              </div>
              
              {/* 간단한 차트 */}
              <div className="mt-2 h-8 bg-white rounded-lg overflow-hidden flex items-end p-1 shadow-sm">
                {Array.from({ length: 12 }).map((_, i) => {
                  const height = 5 + Math.random() * 20;
                  return (
                    <div 
                      key={i} 
                      className={`w-full mx-0.5 rounded-t ${
                        item.trend === 'up' 
                          ? 'bg-gradient-to-b from-green-500 to-green-300' 
                          : 'bg-gradient-to-b from-red-500 to-red-300'
                      }`}
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
  );
};

export default MenuItem;